import { Task } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { max } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Originally created by ChatGPT.
 * We want to arrange the items in a hexagonal gid, going from left to right and then downwards.
 * We're going by the assumption that the hexagons are vertical (i.e. has vertical sides).
 */
export function calculateHexPositions(
  items: Task[],
  containerWidth: number,
  hexRadius: number,
  hexSpacing: number = 10
) {
  const hexHeight = 2 * hexRadius;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const horizSpacing = 1.5 * hexRadius;
  const vertSpacing = hexHeight;

  // How many items can fit horizontally?
  const maxColumnsPerRow = Math.max(
    1,
    Math.floor(containerWidth / (hexWidth + hexSpacing))
  );


  return items.map((item, i) => {
    // We want to treat the items as follows:
    // Ο   Ο   Ο   Ο   Ο   Ο
    //   Ο   Ο   Ο   Ο   Ο
    // Ο   Ο   Ο   Ο   Ο   Ο
    //   Ο   Ο   Ο   Ο   Ο

    // Essentially divide all the items into groups containing one full row and one offset row.
    const modulusIndex = i % (maxColumnsPerRow * 2 - 1);

    let x = modulusIndex * (hexWidth + hexSpacing);
    let y = Math.floor(modulusIndex / maxColumnsPerRow) * (hexHeight + hexSpacing);

    // At this point, all of the tokens in this group are in one row.
    if (modulusIndex >= maxColumnsPerRow) {
      // We're on an offset row: move the token to the beginning of the row and offset accordingly.
      x -= (maxColumnsPerRow * (hexWidth + hexSpacing) - hexRadius);
      y -= hexRadius / 2;
    }

    // const row = Math.floor(i / colsPerRow);
    // const col = i % colsPerRow;

    // // Base positions
    // let x = col * horizSpacing;
    // let y = row * vertSpacing;

    // Apply stagger: odd columns shift down half a hex
    // if (col % 2 === 1) {
    //   y += vertSpacing / 2;
    // }

    // Center horizontally for this row
    // const colsInRow = Math.min(colsPerRow, items.length - row * colsPerRow);
    // const rowWidth = (colsInRow - 1) * horizSpacing + hexWidth;
    // const offsetX = (containerWidth - rowWidth) / 2;

    // x += offsetX;

    return { x, y, item };
  });
}
