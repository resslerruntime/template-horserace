var state = {
	margin_top: 5,
	margin_right: 10,
	margin_right_mobile: 5,
	margin_bottom: 0,
	margin_left: 5,

	bg_color: "#FFFFFF",
	color: {
		palette: ["#004F4F", "#0E9090", "#43C9C2", "#93F0E6", "#5A0B42", "#932B73", "#B14991", "#C981B2"]
	},

	start_circle_r: 5,
	end_circle_r: 20,
	end_circle_stroke: 4,
	end_circle_stroke_bg: true,
	horse_images: true,
	hide_labels: false,
	label_font_size: 12,
	rank_font_size: 14,
	rank_outside_picture: true,

	line_opacity: 1,
	line_width: 4,
	curve: "curveMonotoneX",

	shade: true,
	shade_opacity: 0.1,
	shade_width: 14,

	missing: false,
	missing_opacity: 1,
	missing_dash_width: 0.2,
	missing_dash_space: 4,
	missing_width: 2,

	stage_duration: 1000,
	update_duration: 500,

	label_ranks: "Ranks",
	label_scores: "Scores",
	label_replay: "Replay",

	value_type: "ranks",
	higher_scores_win: true,
	ties_mode: "competition",
	show_buttons: true,
	show_replay: true,

	target_position: null,

	selected_horse: null,
	mouseover_horse: null,

	// y axis

	y_axis_min: "",
	y_axis_max: "",
	y_axis_min_rank: "",
	y_axis_max_rank: "",
	y_axis_label_colors: "#808080",
	y_axis_label_size: 11,
	y_axis_stroke_color: "#e0e1e1",

	y_axis_format: {
		suffix: "%"
	},

	header_title: "",
	header_subtitle: "",
	header_color: "#333333",
	header_margin: "10",
	header_align: "left",

	filter_control_type: "auto-buttons",
	filter_width: 300,
	filter_include_all: true,
	filter_all_label: "All",
	filter: null,

	localization: {},
	label_format: {},

	header: {
		title: "Lorem ipsum dolor sit amet",
		subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
	},
	footer: {},

	// x axis
	x_axis_label_color: "#808080",
	x_axis_label_size: 11,
	x_axis_rotate: "tilted"
};

export default state;
