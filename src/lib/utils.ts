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

  // How many items can fit horizontally?
  const maxColumnsPerRow = Math.max(
    1,
    Math.floor(containerWidth / (hexWidth + hexSpacing))
  );

  // We're essentially going to divide all the items into groups, containing one full row and one offset row.
  const itemsInGroup = (maxColumnsPerRow * 2 - 1);
  const groupHeight = (hexHeight + hexSpacing - hexRadius / 2);
  const rowOffset = (containerWidth - (hexWidth + hexSpacing) * maxColumnsPerRow) / 2;


  return items.map((item, i) => {
    // We want to treat the items as follows:
    // Ο   Ο   Ο   Ο   Ο   Ο
    //   Ο   Ο   Ο   Ο   Ο
    // Ο   Ο   Ο   Ο   Ο   Ο
    //   Ο   Ο   Ο   Ο   Ο

    const modulusIndex = i % itemsInGroup;

    let x = modulusIndex * (hexWidth + hexSpacing);
    let y = Math.floor(i / itemsInGroup) * 2 * groupHeight;

    // At this point, all of the tokens in this group are in one row.
    if (modulusIndex >= maxColumnsPerRow) {
      // We're on an offset row: move the token to the beginning of the row and offset accordingly.
      x -= (maxColumnsPerRow * (hexWidth + hexSpacing) - hexRadius);
      y += groupHeight;
    }

    // Account for the width of the container, to horizontally centre the rows.
    x += rowOffset;

    return { x, y, item };
  });
}
