import data from "./data";
import state from "./state";
import initColors from "@flourish/custom-colors";

var color = initColors(state.color, true);

function updateColors() {
	color.updateColors(data.horserace.map(function(d) { return d.name; }));
}

export { updateColors, color };
