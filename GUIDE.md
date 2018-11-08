## What's it for?
Use this template to visualise the changing fortunes of people or groups in competition with each other, like political candidates or football teams. Choose between two modes: “Scores”, a line chart which plots the data’s raw values, and “Ranks”, a bump chart which plots rankings.

## How to get started 
1. The first thing you need is a CSV or Excel file of your data.
2. You need to make sure that there’s a row for each participant in the horserace – like a candidate or a football team. Use the first column to populate with the participants’ names. Each other column is a “stage” of the race – like a specific date, week or years.
3. Here's an example:
<table>
	<thead>
		<td>name</td>
		<td>Day 1</td>
		<td>Day 2</td>
		<td>Day 3</td>
	</thead>
	<tr>
		<td>Lance Armstrong</td>
		<td>0</td>
		<td>4</td>
		<td>7</td>
	</tr>
	<tr>
		<td>Chris Hoyle</td>
		<td>0</td>
		<td>3</td>
		<td>6</td>
	</tr>
</table>


*Not sure how to upload your data to Flourish? See [our handy guide](https://flourish.studio/help/add-your-own-data/)*

## FAQ
***How do I add an image for each competitor?***
Under the Data tab, in the “Select columns to visualise” panel, there’s an “Image column”. Assign this to a column in your data table which contains image URLs. Then switch to the Preview view, and to the right, on the Settings panel, under “Label styles”, make sure the box for “Show image in circle” is checked.

***How do I show ranks?***
There are two different ways to do this. The first one is to go “Interface” on the Settings panel and make sure that “Show ranks/scores buttons” is checked. This will ensure that whoever’s viewing your chart can always toggle between rank and score using the switcher to the right of the Replay button in the top left corner. The second way to show ranks is to uncheck that “Show ranks/scores buttons” and lock the view on rank by going to “Scoring type” on the Settings panel and changing the first option to “Ranks”.

***How do I make the stages of the race different widths?***
There isn’t a setting to do this yet, but you can hack it by adding blank columns in the middle of your data. Say, for example, you have a dataset that includes data points for January, February, March and May. You may want to make that March stage of the chart twice as long as the other three. In the Data tab, add a blank column to the right of March. Make sure you also adjust the “Score columns”, on the “Select columns to visualise” panel to now include all five columns. Then switch to the Preview view and select “Line styles” on the Settings panel. Check the box for “Show lines between missing data points” and adjust the settings to match the styling of the existing line.

***Why aren’t the x-axis labels visible?***
The labels for the x-axis won’t show up if the margins are too small. Go to “Margins” on the Settings panel and manually increase size of the Top and Bottom margins until the labels appear.

## Tips
* In the settings panel, you can decide whether to show scores or ranks, or to reveal buttons to let the viewer see both.
* In the Flourish story editor, try clicking on the axis labels to show different stages of the race in different slides.

## Examples
- [Gender in Australia's Federal Parliament 1918 - 2018](https://public.flourish.studio/visualisation/129802/)
- [Gun control vs Gun Rights spending](https://public.flourish.studio/visualisation/137615/)
- [Top OPEC crude oil production in Africa](https://public.flourish.studio/visualisation/137456/)

## Credits
Created by the Flourish team, inspired by [Google News Lab](https://newslab.withgoogle.com/). Want to see additional features? Let us know at [support@flourish.studio](mailto:support@flourish.studio). Developers can also submit a pull request.
