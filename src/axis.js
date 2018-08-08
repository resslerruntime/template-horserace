import { select, selectAll } from "d3-selection";
import { axisLeft, axisTop } from "d3-axis";

import { y_min_score, y_max_score, w } from "./size";
import state from "./state";
import data from "./data";

function updateXAxis(x) {
	var xAxis = axisTop(x).tickFormat(function(d) {
		return data.horserace.column_names.stages[d] || "";
	});

	var min_space = 45;
	var max_ticks = Math.floor(w / min_space);

	select(".x.axis").call(xAxis)
		.selectAll(".tick")
		.selectAll("text")
		.style("text-anchor", state.x_axis_rotate_label == "horizontal" ? "middle" : "start")
		.attr("dx", state.x_axis_rotate_label == "horizontal" ? 0 : "2.3em")
		.attr("y", state.x_axis_rotate_label == "horizontal" ? -30 : -9)
		.attr("dy", function() {
			if (state.x_axis_rotate_label == "tilted") return "-0.9em";
			else if (state.x_axis_rotate_label == "horizontal") "-6em";
			else return "1em";
		})
		.attr("transform", function() {
			if (state.x_axis_rotate_label == "tilted") return "rotate(-45)";
			else if (state.x_axis_rotate_label == "vertical") return "rotate(-90)";
			else return "rotate(0)";
		})
		.style("font-size", state.x_axis_label_size + "px")
		.style("fill", state.x_axis_label_colors);

	if (selectAll(".x.axis .tick").size() > max_ticks) {
		xAxis.ticks(max_ticks);
		select(".x.axis").call(xAxis)
			.selectAll("text")
			.style("text-anchor", state.x_axis_rotate_label == "horizontal" ? "middle" : "start")
			.attr("dx", state.x_axis_rotate_label == "horizontal" ? 0 : "2.3em")
			.attr("y", state.x_axis_rotate_label == "horizontal" ? -30 : -9)
			.attr("dy", function() {
				if (state.x_axis_rotate_label == "tilted") return "-0.9em";
				else if (state.x_axis_rotate_label == "horizontal") "-6em";
				else return "1em";
			})
			.attr("transform", function() {
				if (state.x_axis_rotate_label == "tilted") return "rotate(-45)";
				else if (state.x_axis_rotate_label == "vertical") return "rotate(-90)";
				else return "rotate(0)";
			});
	}
}

function updateYAxis(y, w, duration) {
	var yAxis = axisLeft(y)
		.tickSize(-w)
		.tickFormat(function(d) { return state.y_axis_tick_prefix + d + state.y_axis_tick_suffix; })
		.tickPadding(10);

	if (state.value_type == "ranks") {
		yAxis.ticks(data.horserace.length).tickFormat(function(d) { return d % 1 == 0 ? d : ""; });
	}

	select(".y.axis").transition().duration(duration).call(yAxis);
	selectAll(".y.axis text")
		.style("font-size", state.y_axis_label_size + "px")
		.style("fill", state.y_axis_label_colors);

	if (state.value_type == "scores" && state.y_axis_rounding) {
		if (selectAll(".y.axis .tick").size() > y_max_score - y_min_score) {
			yAxis.ticks(y_max_score - y_min_score);
			select(".y.axis").call(yAxis);
		}
	}
}

function updateAxes(x, y, w, duration) {
	updateXAxis(x);
	updateYAxis(y, w, duration);
}

export { updateAxes };
