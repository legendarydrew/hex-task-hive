import { Task } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// hexGridUtils.js
// With the help/assistance/work of ChatGPT. (Because my brain is fried.)
export function calculateHexPositions(
  items: Task[],
  containerWidth: number,
  hexRadius: number
) {
  const hexWidth = 2 * hexRadius;
  const hexHeight = Math.sqrt(3) * hexRadius;
  const horizSpacing = 1.5 * hexRadius;
  const vertSpacing = hexHeight;

  // How many columns can fit in the container
  const colsPerRow = Math.max(
    1,
    Math.floor((containerWidth - hexRadius) / horizSpacing)
  );

  return items.map((item, i) => {
    const row = Math.floor(i / colsPerRow);
    const col = i % colsPerRow;

    // Base positions
    let x = col * horizSpacing;
    let y = row * vertSpacing;

    // Apply stagger: odd columns shift down half a hex
    if (col % 2 === 1) {
      y += vertSpacing / 2;
    }

    // Center horizontally for this row
    const colsInRow = Math.min(colsPerRow, items.length - row * colsPerRow);
    const rowWidth = (colsInRow - 1) * horizSpacing + hexWidth;
    const offsetX = (containerWidth - rowWidth) / 2;

    x += offsetX;

    return { x, y, item };
  });
}
