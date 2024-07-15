import React from "react";
import { lerp } from "../helpers";

const cellSize = 8;
const metersPerCell = 100;
const [minZ, maxZ] = [250, 1250];

export const pos = (val: number, zoom: number) => (val - (maxZ - zoom) / 2);
export const size = (val: number) => val / metersPerCell * cellSize;

export const Canvas = () => {
  const [height, setHeight] = React.useState<number>(100);

  let zoom = lerp(minZ, maxZ, (100 - height) / 100);
  let zoomAmount = (maxZ - zoom + minZ) / minZ;

  return (
    <div className='h-screen flex flex-row'>
      <div className='border-2 border-white w-[100vh] box-border relative'>
        <p className='absolute left-2 bottom-2 text-white'>x{zoomAmount.toFixed(2)}</p>
        <svg width='100%' height='100%' viewBox={`0 0 ${zoom} ${zoom}`}>
          <defs>
            <pattern id='grid' width={cellSize} height={cellSize} patternUnits='userSpaceOnUse'>
              <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill='none' stroke='gray' strokeWidth={0.5} />
            </pattern>
          </defs>

          <rect width='100%' height='100%' fill='url(#grid)' />
          <circle r={size(500) / 2} cx={pos(625, zoom)} cy={pos(625, zoom)} fill='red' fillOpacity={0.3} strokeWidth={2} stroke='red' />
        </svg>
      </div>

      <input
        type='range'
        min='0'
        max='100'
        value={height}
        className='[writing-mode:vertical-lr] [direction:rtl] align-middle'
        onChange={e => setHeight(Number(e.target.value))}
      />
    </div>
  );
}