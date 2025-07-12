import React from "react";

type Props<T> = {
  data: T[][];
  children: (x: number, y: number, data: T) => React.ReactNode;
}

export const Grid = <T extends unknown,>({ data, children }: Props<T>) => {
  return (
    <div className="grid">
      {data.map((row, yPos) => (
        <div key={yPos} className="row">
          {row.map((value, xPos) => (
            <React.Fragment key={xPos}>
              {children(xPos, yPos, value)}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}