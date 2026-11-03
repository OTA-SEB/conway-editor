/* Bounded undo/redo history for immutable cell-map snapshots. */
(() => {
"use strict";
class ConwayHistory {
  constructor(limit=80) {
    this.limit=limit;
    this.undoStack=[];
    this.redoStack=[];
  }
  get canUndo() { return this.undoStack.length>0; }
  get canRedo() { return this.redoStack.length>0; }
  record(before) {
    this.undoStack.push(new Map(before));
    if(this.undoStack.length>this.limit)this.undoStack.shift();
    this.redoStack.length=0;
  }
  undo(current) {
    if(!this.canUndo)return null;
    this.redoStack.push(new Map(current));
    return this.undoStack.pop();
  }
  redo(current) {
    if(!this.canRedo)return null;
    this.undoStack.push(new Map(current));
    return this.redoStack.pop();
  }
  clear() {
    this.undoStack.length=0;
    this.redoStack.length=0;
  }
}
window.ConwayHistory=ConwayHistory;
})();
