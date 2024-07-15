import React from "react";
import { clamp, lerp } from "../helpers";

const cellSize = 8;
const mPerCell = 100;
const [minZ, maxZ] = [250, 1000];

export const Map = () => {
  const [val, setVal] = React.useState<number>(0.5);
  const [cam, setCam] = React.useState<[number, number]>([maxZ / 2, maxZ / 2]);

  const [isMoving, setIsMoving] = React.useState<boolean>(false);

  let zoom = lerp(minZ, maxZ, val);
  let zoomAmount = (maxZ - zoom + minZ) / minZ;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // cells in view * part of view * meter per cell
  const mPerPixels = (pixels: number) =>
    zoom / cellSize * (pixels / height) * mPerCell;

  const pos = (val: number, cam: number) =>
    (val - (maxZ - zoom) / 2) - (cam - maxZ / 2);
  const size = (val: number) =>
    val / mPerCell * cellSize;

  const circles: { r: number; x: number; y: number; color: string; }[] = [
    { r: 500, x: 625, y: 625, color: 'red' },
    { r: 300, x: 520, y: 720, color: 'blue' },
  ];

  return (
    <div className='h-screen flex flex-row'>
      <div className='border-2 border-white w-full box-border relative'>

        <div className='absolute bottom-0 text-white flex flex-row w-full justify-between p-2'>
          <p>x{zoomAmount.toFixed(2)}</p>
          <div className='border-x-[1px] border-x-white flex flex-row max-w-[160px]'>
            <hr className='w-10 left my-auto' />
            <p className='w-20 text-center'>{(mPerPixels(160) / 1000).toFixed(2)}km</p>
            <hr className='w-10 right my-auto' />
          </div>
        </div>

        <svg
          width='100%' height='100%'
          viewBox={`0 0 ${zoom * width / height} ${zoom}`}
          onMouseDown={() => setIsMoving(true)}
          onMouseMove={e => isMoving && setCam(([x, y]) => [
            x - mPerPixels(e.movementX) / 20,
            y - mPerPixels(e.movementY) / 20,
          ])}
          onMouseUp={() => setIsMoving(false)}
          onMouseLeave={() => setIsMoving(false)}
          onBlur={() => setIsMoving(false)}
          onWheel={e => setVal(val => clamp(val + e.deltaY / height * 0.04, 0, 1))}
          className='cursor-move'
        >
          <defs>
            <pattern id='grid' width={cellSize} height={cellSize} patternUnits='userSpaceOnUse' x={-cam[0]} y={-cam[1]}>
              <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill='none' stroke='gray' strokeWidth={0.5} />
            </pattern>
          </defs>

          <rect width='100%' height='100%' fill='url(#grid)' />

          {circles.map(({ r, x, y, color }, index) => (
            <circle
              key={index}
              r={size(r) / 2}
              cx={pos(x, cam[0])}
              cy={pos(y, cam[1])}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
              stroke={color}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}