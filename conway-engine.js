/* Conway simulation engine: pure generation transitions, no UI or DOM access. */
(() => {
"use strict";

function nextGeneration(cells, random=Math.random) {
  const neighbors=new Map();

  for(const [cellKey,color] of cells) {
    const [x,y]=cellKey.split(",").map(Number);

    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++) {
      if(dx===0&&dy===0)continue;
      const neighborKey=(x+dx)+","+(y+dy);
      if(!neighbors.has(neighborKey))neighbors.set(neighborKey,[]);
      neighbors.get(neighborKey).push(color);
    }
  }

  const next=new Map();
  for(const [cellKey,parents] of neighbors) {
    const count=parents.length;
    if(cells.has(cellKey)) {
      if(count===2||count===3)next.set(cellKey,cells.get(cellKey));
    } else if(count===3) {
      next.set(cellKey,parents[Math.floor(random()*parents.length)]);
    }
  }
  return next;
}

window.ConwayEngine=Object.freeze({nextGeneration});
})();
