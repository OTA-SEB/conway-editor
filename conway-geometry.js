/* Pure grid geometry helpers shared by Conway editing tools. */
(() => {
"use strict";

function linePoints(a,b) {
  const pts=[];
  let x=a.x,y=a.y;
  const dx=Math.abs(b.x-a.x),sx=a.x<b.x?1:-1;
  const dy=-Math.abs(b.y-a.y),sy=a.y<b.y?1:-1;
  let err=dx+dy;
  while(true) {
    pts.push([x,y]);
    if(x===b.x&&y===b.y)break;
    const e=2*err;
    if(e>=dy){err+=dy;x+=sx;}
    if(e<=dx){err+=dx;y+=sy;}
  }
  return pts;
}

function makeShape(a,b,type,mode) {
  if(type==="line")return linePoints(a,b);
  const minX=Math.min(a.x,b.x),maxX=Math.max(a.x,b.x);
  const minY=Math.min(a.y,b.y),maxY=Math.max(a.y,b.y);
  const out=[];
  const rx=(maxX-minX)/2,ry=(maxY-minY)/2;
  const cx=(minX+maxX)/2,cy=(minY+maxY)/2;

  for(let x=minX;x<=maxX;x++)for(let y=minY;y<=maxY;y++) {
    let inside=true,edge=false;
    if(type==="rect")edge=x===minX||x===maxX||y===minY||y===maxY;
    if(type==="ellipse") {
      if(rx===0||ry===0)edge=true;
      else {
        const d=((x-cx)/rx)**2+((y-cy)/ry)**2;
        inside=d<=1;
        const irx=Math.max(.01,rx-1),iry=Math.max(.01,ry-1);
        edge=((x-cx)/irx)**2+((y-cy)/iry)**2>=1;
      }
    }
    if(inside&&(mode==="filled"||edge))out.push([x,y]);
  }
  return out;
}

window.ConwayGeometry=Object.freeze({linePoints,makeShape});
})();
