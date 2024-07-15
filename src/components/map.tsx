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

  const circles: { r: number; x: number; y: number; }[] = [
    { r: 500, x: 625, y: 625 },
    { r: 300, x: 520, y: 720 },
  ];

  const planes: { x: number; y: number; }[] = [
    { x: 530, y: 675 },
    { x: 585, y: 685 },
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
              <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} strokeWidth={0.5} className='stroke-gray-500 fill-none' />
            </pattern>
          </defs>

          <rect width='100%' height='100%' fill='url(#grid)' />

          {circles.map(({ r, x, y }, index) => (
            <circle
              key={index}
              r={size(r) / 2}
              cx={pos(x, cam[0])}
              cy={pos(y, cam[1])}
              fillOpacity={0.5}
              className='stroke-1 stroke-red-700 fill-red-600'
            />
          ))}

          {planes.map(({ x, y }, index) => (
            <circle
              key={index}
              r={zoom / cellSize * 5e-4 * mPerCell}
              cx={pos(x, cam[0])}
              cy={pos(y, cam[1])}
              className='stroke-1 fill-blue-500'
            />
          ))}
        </svg>
      </div>
    </div>
  );
}