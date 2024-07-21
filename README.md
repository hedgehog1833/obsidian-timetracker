# Obsidian Timetracker plugin

This Obsidian plugin adds a stopwatch to track time of something. Per hotkey the stopwatch's current value can be inserted into the editor, to make notes to 
this precise moment in time. If you forgot to activate the stopwatch, you can set a custom start value.
The stopwatch functionality is a completely rewritten clone of https://github.com/tokuhirom/obsidian-stopwatch-plugin

## Configuration

### Time format: hours, minutes, seconds

The format for how to print the stopwatch's current value. Default is to display hours, minutes and seconds `00:00:00`. Each can be turned on and off separately. 

### Trimming

Allows cutting off leading zeros. With this setting activated, `01:10:01` will be displayed as `1:10:1`.

### Line break

Adds a line break after the inserted timestamp instead of the default whitespace.

### Text color

The inserted timestamp's text color can be chosen via color picker. The color is applied via an html span.
