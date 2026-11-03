# Conway Studio ∞

**An interactive, browser-based editor for Conway's Game of Life.**

🌐 **Play online:** https://ota-seb.github.io/conway-editor/

📦 **Source code:** https://github.com/ota-seb/conway-editor

---

## What is Conway Studio?

Conway Studio ∞ lets you draw, edit, save, and simulate patterns in Conway's Game of Life. It includes a main menu, a full editor, and an image-to-pattern converter.

The goal is simple: **make playing with Conway's Game of Life fun.**

Try **Conway Arcade**, a mobile-friendly challenge mode where you edit patterns and solve small objectives.\n\nExplore the **Pattern Atlas** to watch classic Life patterns evolve, learn what makes them special, and send any pattern straight into the editor.

## Features

### Simulation
- Start, pause, and advance the simulation one generation at a time.
- Generate random cells and clear the board.
- Watch patterns evolve according to the classic Game of Life rules.

### Drawing and editing
- Select the active tool from one compact tool selector: brush, eraser, bucket, selection, line, rectangle, ellipse, or canvas movement.
- Change cell colors and brush size.
- Fill or recolor connected regions.
- Select, copy, paste, and move patterns.
- Draw lines, rectangles, and ellipses, outlined or filled.
- Undo and redo editing actions.

### Workspace
- Zoom in and out, center the view, and move around the board.
- Work on a large, effectively unbounded canvas.
- Import and export patterns using Conway Studio's text-based pattern format.
- Export selected areas as PNG images.

### Mobile interface
- Responsive layouts for the main menu, editor, and image converter.
- Larger touch targets and compact controls.
- Choose drawing tools from a single selector instead of a row of separate tool buttons.
- Use the on-screen zoom controls and the canvas-movement tool to navigate on touch devices.

### Conway Arcade
- Three bite-sized challenges based on Conway's rules.
- Edit a pattern, advance generations, and reach an exact population target.
- Progress is tracked for the current session; no account or backend required.
- Touch-friendly board and controls for mobile.

### Image converter
- Open **Image → Conway** from the main menu.
- Load an image from your device and convert it into a pixel pattern.
- Adjust the output resolution and preview the result.
- Send the generated pattern to the editor.

### Saved maps
- Save maps from the editor and give each one a name.
- Open or delete saved maps from the main menu.
- Maps are stored in the browser's `localStorage`, on the current device and browser. They are not uploaded to a server and are not automatically synchronized between devices.
- Clearing the browser's site data may delete saved maps. Export important patterns separately if you want another copy.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Main menu and saved-map library |
| `editor.html` | Conway pattern editor and simulation |
| `pixelizer.html` | Image-to-Conway converter |
| `arcade.html` | Interactive Conway challenge mode |\n| `atlas.html` | Animated reference gallery of classic patterns |

Open `index.html` to start using the project. The other pages can also be opened directly.

## How does Conway's Game of Life work?

Conway's Game of Life is a cellular automaton. Each cell has eight neighboring positions, and its state changes once per generation:

1. A living cell with fewer than two living neighbors dies (underpopulation).
2. A living cell with two or three living neighbors survives.
3. A living cell with more than three living neighbors dies (overpopulation).
4. A dead cell with exactly three living neighbors becomes alive (reproduction).

Repeating these rules creates stable structures, oscillators, moving patterns, and many other behaviors.

## Technology

Conway Studio is built with standard **HTML, CSS, and JavaScript**. It runs in a modern browser and does not require a custom backend or installation.

The image converter and editor process images and patterns locally in the browser. Saved maps use browser `localStorage`.

## Run locally

1. Download the repository.
2. Open `index.html` in a modern web browser.
3. Choose the editor or image converter from the main menu.

For the best experience, use a browser with JavaScript enabled. GitHub Pages hosts the online version directly from this repository.

## Project status

Conway Studio is a personal experimental project made for fun. Its features and interface may evolve, but there is no fixed development roadmap.

The project was developed with help from **ChatGPT**, which assisted with implementation, explanations, debugging, and iteration. The project's direction and feature decisions were made during the development process.

## License

No open-source license is currently included in this repository. Unless a license is added, do not assume that the code is free to redistribute or reuse.

---

**Draw something, hit Play, and see what happens!** XD
