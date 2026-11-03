/* Conway/2 language service: parsing and serialization only. */
(() => {
"use strict";
const validColor = value => typeof value==="string"&&/^#[0-9a-fA-F]{6}$/.test(value);
function encodePattern(data,name="Pattern") {
  const colors=[...new Set(data.cells.map(cell=>cell.color))];
  const symbols="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const safeName=String(name).replace(/[^a-zA-Z0-9_-]/g,"")||"Pattern";

  // The compact payload preserves patterns with more colors than the text palette can express.
  if(colors.length>symbols.length) {
    const compact={v:1,w:data.w,h:data.h,cells:data.cells};
    return ["# CONWAY/2",`pattern ${safeName} {`,
      "# COMPACT: "+JSON.stringify(compact),"}"].join("\n");
  }

  const colorToSymbol=new Map();
  const lines=[];
  colors.forEach((color,i)=>{
    colorToSymbol.set(color,symbols[i]);
    lines.push(`  @color ${symbols[i]} ${color}`);
  });
  if(!colors.length)lines.push("  @color O #54e6a5");

  const cellsByPosition=new Map(data.cells.map(cell=>[`${cell.x},${cell.y}`,cell]));
  for(let y=0;y<data.h;y++) {
    let raw="";
    for(let x=0;x<data.w;x++) {
      const cell=cellsByPosition.get(`${x},${y}`);
      raw+=cell?(colorToSymbol.get(cell.color)||"O"):".";
    }
    const runs=[];
    for(let i=0;i<raw.length;) {
      let j=i+1;
      while(j<raw.length&&raw[j]===raw[i])j++;
      runs.push((j-i>1?`${j-i}*`:"")+raw[i]);
      i=j;
    }
    const compressed="@row "+runs.join(" ");
    lines.push("  "+(compressed.length<raw.length?compressed:raw));
  }

  return ["# CONWAY/2",`pattern ${safeName} {`,...lines,"}"].join("\n");
}

function parsePattern(source, options={}) {
  const MAX_CELLS=options.maxCells||500000;
  const MAX_PATTERN_DIMENSION=options.maxDimension||2000;
  const defaultColor=validColor(options.defaultColor)?options.defaultColor:'#54e6a5';
  if(typeof source!=="string"||source.length>2_000_000)
    throw Error("El código está vacío o es demasiado grande.");

  // Legacy compact payloads and high-color exports remain supported.
  const compactLine=source.split(/\r?\n/).find(line=>line.startsWith("# COMPACT:"));
  if(compactLine) {
    let obj;
    try { obj=JSON.parse(compactLine.slice("# COMPACT:".length).trim()); }
    catch { throw Error("El bloque compacto no contiene JSON válido."); }

    if(!obj||obj.v!==1||!Number.isInteger(obj.w)||!Number.isInteger(obj.h)||
       obj.w<1||obj.h<1||obj.w>MAX_PATTERN_DIMENSION||
       obj.h>MAX_PATTERN_DIMENSION||!Array.isArray(obj.cells)||
       obj.cells.length>MAX_CELLS)throw Error("Dimensiones o datos inválidos.");

    const out=[];
    for(const cell of obj.cells) {
      if(!cell||!Number.isInteger(cell.x)||!Number.isInteger(cell.y)||
         cell.x<0||cell.y<0||cell.x>=obj.w||cell.y>=obj.h)continue;
      out.push({x:cell.x,y:cell.y,color:validColor(cell.color)?cell.color:defaultColor});
    }
    return {w:obj.w,h:obj.h,cells:out};
  }

  const lines=source.split(/\r?\n/);
  const legend=new Map([["O",defaultColor]]);
  const rows=[];
  const transforms=[];
  const primitives=[];
  const shapes=new Map();
  let activeShape=null;
  let inside=false;
  let sawPattern=false;

  for(const raw of lines) {
    const line=raw.trim();
    if(!line)continue;
    if(/^#(?:\s|$)/.test(line))continue;

    const header=line.match(/^(pattern|shape)\s+([a-zA-Z0-9_-]+)\s*\{$/);
    if(header) {
      if(inside||activeShape)throw Error("No se permiten bloques anidados.");
      if(header[1]==="pattern") {
        if(sawPattern)throw Error("Solo se permite una declaración pattern por archivo.");
        inside=true;sawPattern=true;activeShape=null;
      } else {
        if(shapes.has(header[2]))throw Error("Nombre de shape duplicado: "+header[2]);
        activeShape={name:header[2],items:[],transforms:[]};
        shapes.set(header[2],activeShape);
      }
      continue;
    }
    if(line==="}") {
      if(!inside&&!activeShape)throw Error("Cierre } sin un bloque abierto.");
      if(activeShape) {
        let items=activeShape.items;
        if(activeShape.transforms.length) {
          const points=[];
          for(const item of items)
            for(let y=0;y<item.h;y++)for(let x=0;x<item.w;x++)
              points.push({x:item.x+x,y:item.y+y,color:item.color});
          if(points.length) {
            let minX=Math.min(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y));
            let width=Math.max(...points.map(p=>p.x))-minX+1;
            let height=Math.max(...points.map(p=>p.y))-minY+1;
            let cells=points.map(p=>({...p,x:p.x-minX,y:p.y-minY}));
            for(const transform of activeShape.transforms) {
              if(transform.type==="mirror") {
                cells=cells.map(cell=>({...cell,
                  x:transform.axis==="horizontal"||transform.axis==="both"?width-1-cell.x:cell.x,
                  y:transform.axis==="vertical"||transform.axis==="both"?height-1-cell.y:cell.y
                }));
              } else {
                for(let turn=0;turn<transform.degrees/90;turn++) {
                  cells=cells.map(cell=>({...cell,x:height-1-cell.y,y:cell.x}));
                  [width,height]=[height,width];
                }
              }
            }
            items=cells.map(cell=>({x:cell.x,y:cell.y,w:1,h:1,color:cell.color}));
          }
        }
        shapes.set(activeShape.name,{name:activeShape.name,items});
      }
      inside=false;activeShape=null;continue;
    }
    if(!inside&&!activeShape&&line.startsWith("@color ")) {
      const match=line.match(/^@color\s+(\S)\s+(#[0-9a-fA-F]{6})$/u);
      if(!match||match[1]===".")throw Error("Directiva de color inválida: usa @color SIMBOLO #RRGGBB.");
      legend.set(match[1],match[2]);
      continue;
    }
    if(!inside&&!activeShape)throw Error("El contenido debe estar dentro de pattern o shape.");

    if(activeShape) {
      const parts=line.split(/\s+/);
      if(parts[0]==="@cell"&&parts.length===4) {
        const x=Number(parts[1]),y=Number(parts[2]),symbol=parts[3];
        if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||Math.abs(x)>MAX_PATTERN_DIMENSION||Math.abs(y)>MAX_PATTERN_DIMENSION)
          throw Error("Coordenadas inválidas en shape "+activeShape.name+".");
        if(!legend.has(symbol))throw Error("Símbolo sin color definido: "+symbol);
        activeShape.items.push({x,y,w:1,h:1,color:legend.get(symbol)});
      } else if(parts[0]==="@rect"&&parts.length===6) {
        const [x,y,w,h]=parts.slice(1,5).map(Number),symbol=parts[5];
        if(![x,y,w,h].every(Number.isSafeInteger)||Math.abs(x)>MAX_PATTERN_DIMENSION||Math.abs(y)>MAX_PATTERN_DIMENSION||w<1||h<1||w>MAX_PATTERN_DIMENSION||h>MAX_PATTERN_DIMENSION||x+w>MAX_PATTERN_DIMENSION||y+h>MAX_PATTERN_DIMENSION)
          throw Error("Dimensiones inválidas en shape "+activeShape.name+".");
        if(!legend.has(symbol))throw Error("Símbolo sin color definido: "+symbol);
        activeShape.items.push({x,y,w,h,color:legend.get(symbol)});
      } else if(parts[0]==="@mirror"&&parts.length===2&&["horizontal","vertical","both"].includes(parts[1])) {
        activeShape.transforms.push({type:"mirror",axis:parts[1]});
      } else if(parts[0]==="@rotate"&&parts.length===2&&["90","180","270"].includes(parts[1])) {
        activeShape.transforms.push({type:"rotate",degrees:Number(parts[1])});
      } else throw Error("Los shapes admiten @cell, @rect, @mirror y @rotate.");
      continue;
    }

    if(line.startsWith("@color ")) {
      const match=line.match(/^@color\s+(\S)\s+(#[0-9a-fA-F]{6})$/u);
      if(!match)throw Error("Directiva de color inválida: usa @color SÍMBOLO #RRGGBB.");
      if(match[1]===".")throw Error("El punto (.) está reservado para una celda vacía.");
      legend.set(match[1],match[2]);
      continue;
    }

    if(line.startsWith("@cell ")||line.startsWith("@rect ")) {
      const parts=line.split(/\s+/);
      const isRect=parts[0]==="@rect";
      const expected=isRect?6:4;
      if(parts.length!==expected)throw Error(isRect?
        "Usa @rect x y ancho alto SIMBOLO.":
        "Usa @cell x y SIMBOLO.");
      const x=Number(parts[1]),y=Number(parts[2]);
      const width=isRect?Number(parts[3]):1;
      const height=isRect?Number(parts[4]):1;
      const symbol=parts[isRect?5:3];
      if(![x,y,width,height].every(Number.isSafeInteger)||
         Math.abs(x)>MAX_PATTERN_DIMENSION||Math.abs(y)>MAX_PATTERN_DIMENSION||
         width<1||height<1||width>MAX_PATTERN_DIMENSION||height>MAX_PATTERN_DIMENSION||
         x+width>MAX_PATTERN_DIMENSION||y+height>MAX_PATTERN_DIMENSION)
        throw Error("Coordenadas o dimensiones fuera del límite permitido.");
      if(!legend.has(symbol))throw Error("Símbolo sin color definido: "+symbol);
      primitives.push({x,y,w:width,h:height,color:legend.get(symbol)});
      continue;
    }

    if(line.startsWith("@use ")) {
      const match=line.match(/^@use\s+([a-zA-Z0-9_-]+)\s+(-?\d+)\s+(-?\d+)$/);
      if(!match)throw Error("Usa @use Nombre x y.");
      const shape=shapes.get(match[1]);
      if(!shape)throw Error("Shape no definido o declarado después: "+match[1]);
      const x=Number(match[2]),y=Number(match[3]);
      if(!Number.isSafeInteger(x)||!Number.isSafeInteger(y)||Math.abs(x)>MAX_PATTERN_DIMENSION||Math.abs(y)>MAX_PATTERN_DIMENSION)
        throw Error("Coordenadas inválidas en @use.");
      for(const item of shape.items)primitives.push({...item,x:item.x+x,y:item.y+y});
      continue;
    }

    if(line.startsWith("@mirror ")) {
      const match=line.match(/^@mirror (horizontal|vertical|both)$/);
      if(!match)throw Error("Usa @mirror horizontal, @mirror vertical o @mirror both.");
      transforms.push({type:"mirror",axis:match[1]});
      continue;
    }

    if(line.startsWith("@rotate ")) {
      const match=line.match(/^@rotate (90|180|270)$/);
      if(!match)throw Error("La rotación debe ser @rotate 90, @rotate 180 o @rotate 270.");
      transforms.push({type:"rotate",degrees:Number(match[1])});
      continue;
    }

    if(line.startsWith("@row ")) {
      const tokens=line.slice(5).trim().split(/\s+/);
      if(!tokens.length||!tokens[0])throw Error("La fila @row necesita al menos un bloque.");
      let expanded="";
      for(const token of tokens) {
        const match=token.match(/^(?:(\d+)\*)?(.)$/u);
        if(!match)throw Error("Bloque @row inválido: "+token);
        const count=match[1]?Number(match[1]):1;
        if(!Number.isSafeInteger(count)||count<1||count>MAX_PATTERN_DIMENSION||
           expanded.length+count>MAX_PATTERN_DIMENSION)
          throw Error("La fila @row supera el ancho máximo.");
        expanded+=match[2].repeat(count);
      }
      rows.push(expanded);
      continue;
    }

    if(/^[^\s]+$/u.test(line)) {
      rows.push(line);
      continue;
    }
    throw Error("Sintaxis no reconocida: "+line.slice(0,60));
  }

  if(inside||activeShape)throw Error("Falta cerrar un bloque con }.");
  if(!sawPattern)throw Error("No se encontró una declaración pattern.");

  if(!rows.length&&!primitives.length)throw Error("No se encontraron filas ni instrucciones de células.");
  let minX=0,minY=0,maxX=rows.length?Math.max(...rows.map(row=>[...row].length))-1:-1;
  let maxY=rows.length-1;
  for(const item of primitives) {
    minX=Math.min(minX,item.x);minY=Math.min(minY,item.y);
    maxX=Math.max(maxX,item.x+item.w-1);maxY=Math.max(maxY,item.y+item.h-1);
  }
  const w=maxX-minX+1,h=maxY-minY+1;
  if(w<1||h<1||w>MAX_PATTERN_DIMENSION||h>MAX_PATTERN_DIMENSION)
    throw Error("El patrón es demasiado grande.");

  const out=[],occupied=new Set();
  const addCell=(x,y,color)=>{
    const id=x+","+y;
    if(occupied.has(id))return;
    occupied.add(id);out.push({x,y,color});
    if(out.length>MAX_CELLS)throw Error("El patrón supera el máximo de células vivas.");
  };
  rows.forEach((row,y)=>[...row].forEach((symbol,x)=>{
    if(symbol===".")return;
    if(!legend.has(symbol))throw Error("Símbolo sin color definido: "+symbol);
    addCell(x-minX,y-minY,legend.get(symbol));
  }));
  for(const item of primitives)
    for(let y=0;y<item.h;y++)for(let x=0;x<item.w;x++)
      addCell(item.x-minX+x,item.y-minY+y,item.color);

  let width=w,height=h,cells=out;
  for(const transform of transforms) {
    if(transform.type==="mirror") {
      cells=cells.map(cell=>({
        ...cell,
        x:transform.axis==="horizontal"||transform.axis==="both"?width-1-cell.x:cell.x,
        y:transform.axis==="vertical"||transform.axis==="both"?height-1-cell.y:cell.y
      }));
      continue;
    }

    const turns=transform.degrees/90;
    for(let turn=0;turn<turns;turn++) {
      cells=cells.map(cell=>({...cell,x:height-1-cell.y,y:cell.x}));
      [width,height]=[height,width];
    }
  }
  return {w:width,h:height,cells};
}

window.ConwayLanguage=Object.freeze({encodePattern,parsePattern});
})();
