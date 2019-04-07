import { ascending, descending, extent } from "d3-array";
import initLocalization from "@flourish/number-localization";

import data from "./data";
import state from "./state";

var localization = initLocalization(state.localization);
var parser;
var max_rank;

function addCompetitionRanks(data) {
	var prev_score = undefined, prev_rank = 0, ties = 0;
	data.forEach(function(d) {
		if (d.score == null) d.rank = null;
		else if (d.score == prev_score) {
			d.rank = prev_rank;
			ties++;
		}
		else {
			d.rank = prev_rank + ties + 1;
			prev_rank = d.rank;
			ties = 0;
		}
		prev_score = d.score;
		max_rank = Math.max(max_rank, d.rank);
	});
}

function addDenseRanks(data) {
	var prev_score = undefined, prev_rank = 0;

	data.forEach(function(d) {
		if (d.score == null) d.rank = null;
		else if (d.score == prev_score) d.rank = prev_rank;
		else d.rank = ++prev_rank;
		prev_score = d.score;
		max_rank = Math.max(max_rank, d.rank);
	});
}

function getProcessedData() {
	parser = localization.getParser();
	var timeslices = [];
	max_rank = 0;

	data.horserace.forEach(function(d, i) { d.unfiltered_index = i; });

	var filtered_horses;
	if (state.filter === null || state.filter === state.filter_all_label) filtered_horses = data.horserace;
	else filtered_horses = data.horserace.filter(function(d) { return d.filter === state.filter; });

	var min_score = Infinity, max_score = -Infinity;
	data.horserace.column_names.stages.forEach(function(stage, stage_index) {
		var timeslice = [];

		// Pull out the names and raw scores
		filtered_horses.forEach(function(horse, horse_index) {
			if (horse.stages[stage_index] === undefined) return;
			var stage = horse.stages[stage_index],
			    score = stage == "" || isNaN(parser(stage)) ? null : parser(stage);
			horse.index = horse_index;
			timeslice.push({
				name: horse.name,
				index: horse_index,
				score: score
			});
		});

		// Sort asc or desc based on score type
		timeslice.sort(function(a, b) {
			if (!state.higher_scores_win) return ascending(a.score, b.score);
			else return descending(a.score, b.score);
		});

		// Compute ranks
		(state.ties_mode === "dense" ? addDenseRanks : addCompetitionRanks)(timeslice);

		// Make look-up version
		var timeslice_by_horse_index = {};
		timeslice.forEach(function(horse) {
			timeslice_by_horse_index[horse.index] = horse;
		});
		timeslices.push(timeslice_by_horse_index);


		var timeslice_extent = extent(timeslice.map(function(d) { return d.score; }));
		timeslices[stage_index].min_score = Math.min(min_score, timeslice_extent[0]);
		timeslices[stage_index].max_score = Math.max(max_score, timeslice_extent[1]);
	});

	var horses = filtered_horses.map(function(horse, horse_index) {
		var missing_value = null;
		horse.ranks = horse.stages.map(function(stage, stage_index) {
			return timeslices[stage_index][horse_index].rank;
		});
		horse.line = horse.stages.map(function(stage, stage_index) {
			return {
				"i": stage_index,
				"value": state.value_type == "ranks" ? timeslices[stage_index][horse_index].rank : timeslices[stage_index][horse_index].score
			};
		});
		horse.missing_line = horse.line.map(function(position, i) {
			if (position.value === null && i !== 0) {
				if (!missing_value) {
					missing_value = true;
					return {
						"i": position.i - 1,
						"value": horse.line[i - 1].value
					};
				}
			}
			else if (position.value !== null && missing_value) {
				missing_value = null;
				return position;
			}
			else {
				return {
					"i": position.i,
					"value": null
				};
			}
		}).filter(function(d) { return d !== undefined; });
		horse.start_circle = horse.line.filter(function(d) { return d.value != null; })[0];
		return horse;
	}).filter(function(d) {
		return d.start_circle;
	});
	horses.max_rank = max_rank;
	horses.timeslices = timeslices;
	return horses;
}

export { getProcessedData, localization, parser };
