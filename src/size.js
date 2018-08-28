import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { parser } from "./process_data";

import state from "./state";
import data from "./data";

import { is_mobile } from "./update_graphic";
import { svg, plot, header, footer } from "./create_dom";

var w, h, x, y, y_max_score, y_min_score, viz_ui;
var label_sizes = {
	x_axis: {},
	line: {}
};

function updateSizesAndScales(current_position, max_rank) {
	getLabelSizes();
	var window_height = window.innerHeight;
	viz_ui = viz_ui || document.getElementById("viz-ui");
	var svg_height = window_height - header.getHeight() - footer.getHeight() - viz_ui.getBoundingClientRect().height;
	var plot_margin = Math.max(state.end_circle_r + state.end_circle_stroke, state.start_circle_r, state.line_width/2, state.shade_width/2);
	svg.attr("width", window.innerWidth).attr("height", svg_height);
	var end_circle_size = state.end_circle_r + state.end_circle_stroke;
	var margin_right = !is_mobile ? state.margin_right + label_sizes.line.width + (state.rank_outside_picture ? 30 : 20) : end_circle_size + state.margin_right_mobile;
	var margin_bottom = plot_margin + state.margin_bottom;
	var margin_top = plot_margin + label_sizes.x.height + state.margin_top;
	var margin_left = Math.max(plot_margin, 5) + state.margin_left + (state.value_type == "ranks" ? 0 : (state.y_axis_format.suffix.length + state.y_axis_format.prefix.length) * (state.y_axis_label_size * 0.5));

	plot.attr("transform", "translate(" + margin_left + "," + margin_top + ")");

	w = Math.max(0, window.innerWidth - margin_left - margin_right);
	h = Math.max(0, svg_height - margin_top - margin_bottom);
	x = scaleLinear().range([0, w]).domain([0, data.horserace.column_names.stages.length - 1]);

	var y_domain;
	if (state.value_type == "ranks") y_domain = [state.y_axis_max_rank || max_rank, state.y_axis_min_rank || 1];
	else {
		y_max_score = max(data.horserace, function(d) { return max(d.stages, function(v) { return parser(v); }); }),
		y_min_score = min(data.horserace, function(d) { return min(d.stages, function(v) { return parser(v); }); });

		if (state.y_axis_min !== "" && state.y_axis_min !== null) y_min_score = state.y_axis_min;
		if (state.y_axis_max !== "" && state.y_axis_max !== null) y_max_score = state.y_axis_max;
		if (state.higher_scores_win) y_domain = [y_min_score, y_max_score];
		else y_domain = [y_max_score, y_min_score];
	}
	y = scaleLinear().range([h, 0]).domain(y_domain);

	var x_offset = Math.max(state.start_circle_r, state.line_width/2, state.shade_width/2) + state.margin_left;
	select("#clip rect")
		.attr("transform", "translate(0,-" + margin_top + ")")
		.attr("height", h + margin_top + margin_bottom)
		.attr("width", x(current_position) + x_offset)
		.attr("x", -x_offset);
}

function getLabelSizes() {
	label_sizes = {
		x: { size: 0 },
		line: { size: 0 }
	};

	// Get longest line label
	data.horserace.forEach(function(d) {
		if (d.name.length > label_sizes.line.size) {
			label_sizes.line.text = d.name;
			label_sizes.line.size = d.name.length;
		}
	});
	label_sizes.line.el = svg.append("text").html(label_sizes.line.text)
		.style("font-size", state.label_font_size + "px");
	label_sizes.line.width = label_sizes.line.el.node().getBoundingClientRect().width;
	label_sizes.line.el.remove();
	// console.log(label_sizes.line.el.node())

	// Get longest x axis label
	data.horserace.column_names.stages.forEach(function(name) {
		if (name.length > label_sizes.x.size) {
			label_sizes.x.text = name;
			label_sizes.x.size = name.length;
		}
	});
	label_sizes.x.el = svg.append("text")
		.html(label_sizes.x.text)
		.style("font-size", state.x_axis_label_size + "px")
		.attr("transform", function() {
			if (state.x_axis_rotate == "tilted") return "rotate(-45)";
			else if (state.x_axis_rotate == "vertical") return "rotate(-90)";
			else return "rotate(0)";
		});

	label_sizes.x.height = label_sizes.x.el.node().getBoundingClientRect().height;
	label_sizes.x.el.remove();
}

export { updateSizesAndScales, w, h, x, y, y_max_score, y_min_score };
