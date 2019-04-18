import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
import { parser } from "./process_data";

import state from "./state";
import data from "./data";

import { is_mobile, horses } from "./update_graphic";
import { svg, plot, layout } from "./create_dom";

var end_circle_r, end_circle_stroke, start_circle_r, line_width, shade_width, max_horse_height;
var w, h, x, y, viz_ui;
var label_sizes = {
	x_axis: {},
	line: {}
};

function updateSizesAndScales(current_position, max_rank, duration) {
	getLabelSizes();
	viz_ui = viz_ui || document.getElementById("viz-ui");

	var svg_height;
	var svg_width = layout.getInnerWidth();

	start_circle_r = !is_mobile ? state.start_circle_r : Math.min(state.start_circle_r, 28) / 2;
	end_circle_r = !is_mobile ? state.end_circle_r : Math.min(state.end_circle_r, 28) / 2;
	end_circle_stroke = !is_mobile ? state.end_circle_stroke : state.end_circle_stroke / 2;
	shade_width = !is_mobile ? state.shade_width : Math.max(Math.round(state.shade_width/2), 1);
	line_width = !is_mobile ? state.line_width : Math.max(Math.round(state.line_width/2), 1);
	max_horse_height = Math.max(end_circle_r * 2 + end_circle_stroke, start_circle_r * 2, line_width, shade_width);

	var margin_right;
	if (state.zoom_enabled) {
		margin_right = is_mobile ? state.margin_right_mobile : state.margin_right;
	}
	else if (is_mobile) {
		margin_right = end_circle_r + state.margin_right_mobile;
	}
	else margin_right = state.margin_right + label_sizes.line.width + (state.rank_outside_picture ? 15 : 0) + end_circle_r + end_circle_stroke;

	var margin_bottom = max_horse_height/2 + state.margin_bottom;
	var margin_top = max_horse_height/2 + label_sizes.x.height + state.margin_top;
	var margin_left = Math.max(max_horse_height/2, 5) + state.margin_left + (state.value_type == "ranks" ? 0 : (state.y_axis_format.suffix.length + state.y_axis_format.prefix.length) * (state.y_axis_label_size * 0.5));

	var num_of_horses = state.y_axis_max_rank != null && state.y_axis_max_rank != "" ? state.y_axis_max_rank : data.horserace.length;
	var gap_between = max_horse_height * 0.1;
	var plot_height = (num_of_horses * max_horse_height) + (num_of_horses - 1) * gap_between;

	if (state.height_mode == "flexible" || (state.height_mode == "auto" && plot_height > layout.getDefaultPrimaryHeight())) {
		svg_height = plot_height + (margin_top + margin_bottom - max_horse_height);
		layout.setHeight(svg_height);
	}
	else {
		layout.setHeight(null);
		svg_height = layout.getPrimaryHeight();
	}

	svg.attr("width", svg_width).attr("height", svg_height);

	plot.attr("transform", "translate(" + margin_left + "," + margin_top + ")");
	w = Math.max(0, svg_width - margin_left - margin_right);
	h = Math.max(0, svg_height - margin_top - margin_bottom);
	x = scaleLinear().range([0, w]);

	updateXDomain(current_position);

	y = scaleLinear().range([h, 0]);
	updateYDomain(current_position);

	var x_offset = state.zoom_enabled ? 0 : Math.max(state.start_circle_r, state.line_width/2, state.shade_width/2) + state.margin_left;
	select("#clip rect")
		.transition().duration(duration)
		.attr("transform", "translate(0,-" + margin_top + ")")
		.attr("height", h + margin_top + margin_bottom)
		.attr("width", x(current_position) + x_offset)
		.attr("x", -x_offset);
}

function updateXDomain(current_position) {
	var num_stages = data.horserace.column_names.stages.length;
	var min_domain = !state.zoom_enabled ? 0 : Math.max(0, current_position - state.zoom_steps_to_show);
	var steps_to_show = Math.min(num_stages, state.zoom_steps_to_show);

	var max_domain;
	if (!state.zoom_enabled) max_domain = num_stages - 1;
	else max_domain = Math.max(current_position + steps_to_show, steps_to_show * 2);

	var domain = [min_domain, max_domain];
	x.domain(domain);
}

function updateYDomain(current_position) {
	var domain, y_min, y_max;
	if (state.value_type == "ranks") domain = [state.y_axis_max_rank || horses.max_rank, state.y_axis_min_rank || 1];
	else {
		if (state.zoom_enabled && state.zoom_y_axis) {
			var from = Math.floor(current_position), to = Math.ceil(current_position),
			    from_min = horses.timeslices[from].min_score, from_max = horses.timeslices[from].max_score,
			    to_min = horses.timeslices[to].min_score, to_max = horses.timeslices[to].max_score;
			y_min = from_min + ((to_min - from_min) * (current_position - from));
			y_max = from_max + ((to_max - from_max) * (current_position - from));
			var diff = y_max - y_min, padding = state.zoom_y_padding/100;
			y_min -= diff * padding; y_max += diff * padding;
		}
		else {
			y_min = min(data.horserace, function(d) { return min(d.stages, function(v) { return parser(v); }); });
			y_max = max(data.horserace, function(d) { return max(d.stages, function(v) { return parser(v); }); });
		}
		if (state.y_axis_min !== "" && state.y_axis_min !== null) y_min = state.y_axis_min;
		if (state.y_axis_max !== "" && state.y_axis_max !== null) y_max = state.y_axis_max;
		if (state.higher_scores_win) domain = [y_min, y_max];
		else domain = [y_max, y_min];
	}
	y.domain(domain);
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
	label_sizes.line.el = svg.append("text").text(label_sizes.line.text)
		.style("font-size", state.label_font_size + "px");
	label_sizes.line.width = label_sizes.line.el.node().getBoundingClientRect().width;
	label_sizes.line.el.remove();

	// Get longest x axis label
	data.horserace.column_names.stages.forEach(function(name) {
		if (name.length > label_sizes.x.size) {
			label_sizes.x.text = name;
			label_sizes.x.size = name.length;
		}
	});
	label_sizes.x.el = svg.append("text")
		.text(label_sizes.x.text)
		.style("font-size", state.x_axis_label_size + "px")
		.attr("transform", function() {
			if (state.x_axis_rotate == "tilted") return "rotate(-45)";
			else if (state.x_axis_rotate == "vertical") return "rotate(-90)";
			else return "rotate(0)";
		});

	label_sizes.x.height = label_sizes.x.el.node().getBoundingClientRect().height;
	label_sizes.x.el.remove();
}

export { updateSizesAndScales, updateXDomain, updateYDomain, w, h, x, y, start_circle_r, end_circle_r, end_circle_stroke, shade_width, line_width, max_horse_height };
