import { select, selectAll } from "d3-selection";
import { ascending } from "d3-array";

import state from "./state";
import data from "./data";

import { x, y, w, updateXDomain, end_circle_r } from "./size";
import { updateAxes } from "./axis";
import { getTargetPosition, updateChecks, updateLines, updateStartCircles, transformLabel, displayValue, labels_update, is_mobile } from "./update_graphic";

var current_position = 0;

function updateCurrentPosition(from_start) {
	var num_timeslices = data.horserace.column_names.stages.length;
	if (current_position > num_timeslices - 1) current_position = num_timeslices - 1;
	if (from_start) current_position = 1;
}

function tieBreak() {
	var labels_by_rank = {};
	var target_position = getTargetPosition();
	selectAll(".labels-group").each(function(d) {
		var rank = d.ranks[target_position];
		if (rank == null) return;
		if (!(rank in labels_by_rank)) labels_by_rank[rank] = [this];
		else labels_by_rank[rank].push(this);
	});

	for (var rank in labels_by_rank) {
		var labels = labels_by_rank[rank].sort(function(a, b) { return ascending(a.__data__.index, b.__data__.index); });
		if (labels.length > 1) {
			for (var i = 0; i < labels.length; i++) {
				var shift = end_circle_r * 0.5 * (i - 1/2);
				select(labels[i]).select(".end-circle-container")
					.attr("transform", "translate(" + shift + ",0)");

				select(labels[i]).classed("tied", true);

				select(labels[i]).selectAll(".name-bg, .name-fg")
					.attr("x", function() {
						if (!is_mobile || state.zoom_enabled) return (labels.length) * (end_circle_r * 0.5) + (end_circle_r/2);
						else {
							var text_width = this.getBBox().width;
							return -end_circle_r*1.5 - text_width;
						}
					});
			}
		}
	}
}

function replay() {
	state.target_position = 0;
	current_position = 0;
	state.target_position = data.horserace.column_names.stages.length;
	play();
}

var prev_timestamp, target_is_ahead, af = null;
function frame(t) {
	var target_position = getTargetPosition();
	if (!prev_timestamp) {
		prev_timestamp = t;
		af = requestAnimationFrame(frame);
		target_is_ahead = (current_position < target_position);
		return;
	}
	var reached_target;
	if (target_is_ahead) {
		current_position += (t - prev_timestamp) / state.stage_duration;
		reached_target = (current_position > target_position);
	}
	else {
		current_position -= (t - prev_timestamp) / state.stage_duration;
		reached_target = (current_position < target_position);
	}
	if (reached_target) current_position = target_position;

	updateXDomain(current_position);
	var x_offset = state.zoom_enabled ? 0 : Math.max(state.start_circle_r, state.line_width/2, state.shade_width/2) + state.margin_left;
	select("#clip rect")
		.attr("width", x(current_position) + x_offset)
		.attr("x", -x_offset);
	labels_update
		.interrupt()
		.attr("transform", transformLabel)
		.selectAll(".rank-number")
		.text(function(d) {
			return state.rank_outside_picture ? "" : displayValue(d) + " ";
		});

	if (state.zoom_enabled) {
		updateChecks();
		updateLines(0);
		updateStartCircles(0);
		var axis_width = Math.min(x(data.horserace.column_names.stages.length - 1), w);
		updateAxes(x, y, axis_width, 0);
	}

	labels_update.selectAll(".name-rank")
		.text(function(d) {
			return state.rank_outside_picture ? displayValue(d) + " " : "";
		})
		.each(function() {
			select(this.parentNode).attr("x", function() {
				if (!is_mobile || state.zoom_enabled) return end_circle_r + 4;
				else {
					var text_width = this.getBBox().width;
					return -end_circle_r - 4 - text_width;
				}
			});
		});

	if (reached_target) {
		af = null;
		tieBreak();
	}
	else {
		af = requestAnimationFrame(frame);
		prev_timestamp = t;
	}
}

function play() {
	prev_timestamp = null;
	if (af) cancelAnimationFrame(af);
	af = requestAnimationFrame(frame);
}

export { play, af, tieBreak, current_position, updateCurrentPosition, replay };
