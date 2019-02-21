import { select, event } from "d3-selection";
import initLayout from "@flourish/layout";

import state from "./state";
import update from "./update";
import { replay } from "./play";
import { initFilterControls } from "./controls";

var svg, plot, g_lines, g_labels, g_start_circles, g_checks, viz_ui;
var layout = initLayout(state.layout);

function clearHighlighting() {
	if (event.target) {
		event.target.getAttribute("class");
		if (event.target.getAttribute("class") == "check-rect") return;
	}
	state.selected_horse = null;
	update();
}

function createDom() {
	viz_ui = select(layout.getSection("controls")).append("div").attr("id", "viz-ui");
	svg = select(layout.getSection("primary")).append("svg").on("click", clearHighlighting);

	plot = svg.append("g").attr("id", "plot");
	plot.append("clipPath").attr("id", "clip").append("rect").attr("width", 0);
	plot.append("clipPath").attr("id", "circleClip").append("circle");
	g_checks = plot.append("g").attr("class", "g-checks");
	plot.append("g").attr("class", "x axis").style("pointer-events", "none");
	plot.append("g").attr("class", "y axis").style("pointer-events", "none");

	g_lines = plot.append("g").attr("class", "g-lines").attr("clip-path", "url(#clip)");
	g_start_circles = plot.append("g").attr("class", "g-start-circles");
	g_labels = plot.append("g").attr("class", "g-labels");
	var horse_controls = viz_ui.append("div").attr("id", "horse-controls");
	horse_controls.append("button").attr("id", "replay").text(state.label_replay).on("click", replay);
	var toggle = horse_controls.append("div").attr("id", "rank-toggle");
	toggle.append("button").attr("id", "ranks").text(state.label_ranks).attr("data-type", "ranks");
	toggle.append("button").attr("id", "scores").text(state.label_scores).attr("data-type", "scores");
	toggle.selectAll("button")
		.on("click", function() {
			state.value_type = select(this).attr("data-type");
			update();
		})
		.classed("selected", function() {
			return select(this).attr("data-type") === (state.value_type == "ranks" ? state.label_ranks : state.label_scores);
		});
	viz_ui.append("div").attr("id", "filter-control").style("display", "inline-block");
	initFilterControls();
}

export { createDom, svg, plot, g_lines, g_labels, g_start_circles, g_checks, viz_ui, layout };
