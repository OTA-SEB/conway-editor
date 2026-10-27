# Conway Studio ∞

**An interactive editor for playing with Conway's Game of Life.**

🌐 **Play online:** https://ota-seb.github.io/conway-editor/

📦 **Source code:** https://github.com/ota-seb/conway-editor

---

## What is this?

Conway Studio ∞ is a browser-based editor for experimenting with **Conway's Game of Life**, a cellular automaton created by mathematician John Conway.

The idea is simple: draw patterns, start the simulation, and watch cells evolve according to a few simple rules.

Despite its simplicity, the Game of Life can produce an incredible variety of behavior. Cells can form stable structures, moving patterns, oscillators, and complex arrangements that emerge from nothing more than local interactions.

Conway Studio ∞ provides a collection of tools for drawing, editing, arranging, and experimenting with these patterns in an interactive environment.

The goal isn't to build a scientific tool, prove a revolutionary theory, or solve the mysteries of the universe. It's simply to **make playing with Conway's Game of Life fun**. LOL.

## Features

### Simulation

- ▶️ Start and pause the simulation.
- ⏭️ Advance the simulation one generation at a time.
- 🎲 Generate random cells.
- 🧹 Clear the board and start over.
- 🧬 Watch patterns evolve through successive generations.

### Drawing and editing

- 🖌️ Draw and erase cells with different brush sizes.
- 🪣 Fill regions.
- ▧ Select rectangular areas of the board.
- 📐 Draw lines, rectangles, and ellipses, either outlined or filled.
- 🎨 Change cell colors.
- 🧩 Place well-known patterns, including gliders, spaceships, and stable structures.

### Navigation and workspace

- 🔍 Zoom in and zoom out.
- 🖱️ Move around the board to explore different areas.
- ♾️ Explore a space that extends beyond the visible screen.
- 🧭 Navigate around your creations and work with patterns larger than the visible area.

### Pattern management

- 📋 Copy and paste selected patterns.
- ↶ Undo and redo editing actions.
- 📝 Copy, paste, and work with patterns using the editor's own text-based format.
- 📷 Export selected areas as PNG images.

The available tools make it possible to experiment with patterns, build larger constructions, and explore how simple rules can produce surprisingly complex behavior.

## How does Conway's Game of Life work?

Conway's Game of Life is a **cellular automaton**: a system made of cells whose states change according to a set of rules.

In the classic version, each cell has eight neighboring positions. During each generation, the next state of every cell is determined by its current state and the number of living neighbors.

The rules are:

1. **Underpopulation:** A living cell with fewer than two living neighbors dies.
2. **Survival:** A living cell with two or three living neighbors survives.
3. **Overpopulation:** A living cell with more than three living neighbors dies.
4. **Reproduction:** A dead cell with exactly three living neighbors becomes alive.

These rules are applied repeatedly to produce new generations.

There is no central intelligence controlling the patterns. Their behavior emerges from the rules and the arrangement of cells.

That's part of what makes the Game of Life so interesting: a small set of rules can produce an enormous variety of outcomes.

## How does the editor work?

Conway Studio ∞ is built using standard web technologies:

- **HTML** defines the page structure, controls, buttons, and canvas.
- **CSS** handles the layout, appearance, colors, and responsive interface.
- **JavaScript** implements the simulation, drawing tools, interactions, and rendering.

The application is contained in a single HTML file, including its structure, styles, and JavaScript code.

The simulation runs directly in your browser, so no custom backend server or separate installation is required.

This makes the project easy to explore, experiment with, and modify.

## How was it made?

This project was developed with the help of **ChatGPT Free**, the free plan of ChatGPT.

ChatGPT helped generate and edit the HTML, CSS, and JavaScript code, explain implementation details, debug problems, and develop features throughout the project.

The editor was built iteratively: implement something, test it, find problems, fix them, and continue improving the result.

The code wasn't written manually from scratch, line by line. Artificial intelligence was used as a development tool throughout the process.

The project also involved making decisions about the editor's functionality, interface, behavior, and overall purpose.

The result is a working interactive application built around a simple idea: making Conway's Game of Life enjoyable to explore.

The website is hosted using **GitHub Pages**, which serves the application directly from the GitHub repository.

## Run it locally

You don't need to install a dedicated application to try Conway Studio ∞.

1. Open the [GitHub repository](https://github.com/ota-seb/conway-editor).
2. Download the repository or clone it.
3. Open `index.html` in a modern web browser.
4. Start experimenting!

The application is self-contained in a single HTML file, making it straightforward to inspect and experiment with the source code.

## Project status

**Conway Studio ∞ is complete.**

The project has reached its intended goal: providing a working, interactive editor for playing with Conway's Game of Life.

There are no planned updates or promises of continued development. The project is finished in its current intended form, and that's perfectly fine.

This doesn't mean the code is perfect or that nobody could improve it. It simply means the original project has reached its goal.

## What if I want to change it?

Go ahead and experiment!

You can explore the code, learn from its implementation, modify your own copy, add features, redesign the interface, improve existing tools, or use the project as inspiration for something completely different.

You could create new drawing tools, experiment with alternative rules, build your own pattern editor, or take the project in a direction that was never part of the original plan.

The original project being finished doesn't mean your experiments have to stop.

If you want to publish or redistribute a modified version, remember that the repository does not include a specific open-source license granting reuse permissions. Check the applicable copyright rules before redistributing the original code.

## Why does this exist?

Because Conway's Game of Life is interesting, experimenting with patterns is fun, and building an editor to play around with them seemed like a good idea.

There's no secret mission. No company behind it. No grand technological promise.

Just cells, rules, patterns, and a ridiculous number of possibilities.

**Made with the help of ChatGPT Free, hosted on GitHub Pages, and built for fun.** XD

---

*An experimental project made for entertainment. Draw something, hit Play, and see what happens!*

**The project is finished. What you do with it is up to you.**
