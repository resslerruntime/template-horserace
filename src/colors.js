import { map } from "d3-collection";
import data from "./data";
import state from "./state";
import initColors from "@flourish/custom-colors";

var color = initColors(state.color, true);

function updateColors() {
	var labels = map(data.horserace, function(d) { return d.name; }).keys();
	color.updateColorFinder(labels);
}

export { updateColors, color };
