# Obsidian Timetracker plugin

This Obsidian plugin adds a stopwatch to track time of something. Per hotkey the stopwatch's current value can be inserted into the editor, to make notes to 
this precise moment in time.
The stopwatch functionality is a completely rewritten clone of https://github.com/tokuhirom/obsidian-stopwatch-plugin

## Configuration

### Refresh interval

The stopwatch's refresh rate in milliseconds. The default value is `100`. The valid value range lies between 1 and 1000 milliseconds.

### Time format

The format for how to print the stopwatch's current value. Default is `HH:mm:ss.SSS`. For more formats see [here](https://github.com/jsmreese/moment-duration-format#template-string). 
