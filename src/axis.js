import { select, selectAll } from "d3-selection";
import { axisLeft, axisTop } from "d3-axis";
import initFormatter from "@flourish/number-formatter";
import { localization } from "./process_data";

import { y_min_score, y_max_score, w } from "./size";
import state from "./state";
import data from "./data";

var getYAxisFormatter = initFormatter(state.y_axis_format);

function updateXAxis(x) {
	var xAxis = axisTop(x).tickFormat(function(d) {
		return data.horserace.column_names.stages[d] || "";
	});

	var min_space = state.x_axis_rotate == "tilted" ? 30 : (state.x_axis_rotate == "vertical" ? state.x_axis_label_size : 80);
	var max_ticks = Math.floor(w / min_space);
	var plot_margin_top = Math.max(state.end_circle_r + state.end_circle_stroke, state.start_circle_r, state.line_width/2, state.shade_width/2);

	select(".x.axis").call(xAxis);

	if (selectAll(".x.axis .tick").size() > max_ticks) {
		xAxis.ticks(max_ticks);
	}

	select(".x.axis").call(xAxis)
		.selectAll(".tick text")
		.style("text-anchor", state.x_axis_rotate == "horizontal" ? "middle" : "start")
		.attr("dx", function() {
			if (state.x_axis_rotate == "tilted") return (plot_margin_top * 0.68) + 2;
			else if (state.x_axis_rotate == "horizontal") return 0;
			else if (state.x_axis_rotate == "vertical") return plot_margin_top;
		})
		.attr("dy", function() {
			if (state.x_axis_rotate == "tilted") return (-plot_margin_top * 0.68) - 2;
			else if (state.x_axis_rotate == "horizontal") return -plot_margin_top;
			else return "0.25em";
		})
		.attr("y", 	0)
		.attr("transform", function() {
			if (state.x_axis_rotate == "tilted") return "rotate(-45)";
			else if (state.x_axis_rotate == "vertical") return "rotate(-90)";
			else return "rotate(0)";
		})
		.style("font-size", state.x_axis_label_size + "px")
		.style("fill", state.x_axis_label_color);
}

function updateYAxis(y, w, duration) {
	var localeFunction = localization.getFormatterFunction();
	var yAxisFormat = getYAxisFormatter(localeFunction);

	var yAxis = axisLeft(y)
		.tickSize(-w)
		.tickFormat(function(d) {
			if (state.value_type == "ranks") return d % 1 == 0 ? d : "";
			return yAxisFormat(d);
		})
		.tickPadding(10);

	select(".y.axis").transition().duration(duration).call(yAxis);

	selectAll(".y.axis text")
		.style("font-size", state.y_axis_label_size + "px")
		.style("fill", state.y_axis_label_colors);

	selectAll(".y.axis line").style("stroke", state.y_axis_stroke_color);
	selectAll(".y.axis path").style("stroke", state.y_axis_stroke_color);

	if (state.value_type == "scores" && state.y_axis_format.decimals === 0) {
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
