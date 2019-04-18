import { select, selectAll } from "d3-selection";
import { axisLeft, axisTop } from "d3-axis";
import initFormatter from "@flourish/number-formatter";
import { localization } from "./process_data";

import { w, max_horse_height } from "./size";
import state from "./state";
import data from "./data";

var getYAxisFormatter = initFormatter(state.y_axis_format);

function updateXAxis(x) {
	var xAxis = axisTop(x).tickFormat(function(d) {
		return data.horserace.column_names.stages[d] || "";
	});

	var min_space = state.x_axis_rotate == "tilted" ? 30 : (state.x_axis_rotate == "vertical" ? state.x_axis_label_size : 80);
	var max_ticks = Math.floor(w / min_space);
	var plot_margin_top = max_horse_height / 2;

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
		.tickPadding(5);

	if (state.value_type == "ranks") yAxis.ticks(Math.min(data.horserace.length, state.y_axis_max_rank || Infinity));
	select(".y.axis").transition().duration(duration).call(yAxis);

	selectAll(".y.axis text")
		.style("font-size", state.y_axis_label_size + "px")
		.style("fill", state.y_axis_label_colors);

	selectAll(".y.axis line").style("stroke", state.y_axis_stroke_color);
	selectAll(".y.axis path").style("stroke", state.y_axis_stroke_color);
}

function updateAxes(x, y, w, duration) {
	updateXAxis(x);
	updateYAxis(y, w, duration);
}

export { updateAxes };
