import { LayoutHeader } from "./LayoutHeader";
import { LayoutFooter } from "./LayoutFooter";
import TokenGrid from "./TokenGrid";
import TaskListProgressBar from "./TaskListProgressBar";
import { useApp } from "@/context/AppContext";
import { TaskSidebar } from "./TaskSidebar";
import { RefObject, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

/**
 * A relatively simple layout: header, contents and footer.
 *
 * The AI-generated version had a sidebar containing the list of TaskLists. Instead, this will become
 * a dropdown list in the header.
 */
export const Layout: React.FC<void> = () => {
  const { isListComplete, selectRandomTask, shuffleTasks, undoDeleteTask } =
    useApp();
  /**
   * Listen for keypresses while this page is open, looking specifically for an undo command.
   * https://stackoverflow.com/a/61740188/4073160
   * https://github.com/facebook/react/issues/14699#issuecomment-457653146
   * The last link addressed a major issue with using old state values, as well as running more than once.
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === "u") {
      undoDeleteTask(); // Undo (Alt + U)
    } else if (e.ctrlKey && e.key.toLowerCase() === "enter") {
      selectRandomTask(); // Random Task (Ctrl + Enter)
    } else if (e.ctrlKey && e.key.toLowerCase() === "#") {
      shuffleTasks(); // Shuffle Tasks (Ctrl + #')
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Display confetti if we've completed the list.
  const mainRef: RefObject<HTMLElement> = useRef();

  const confettiShape = (ctx: CanvasRenderingContext2D) => {
    // Draw a hexagon!
    // Remember that JS/TS uses radians for maths functions.
    const hexRadius = 10;
    ctx.beginPath();
    for(let angle = 0; angle <= 360; angle += 60) {
      const radians = angle * Math.PI / 180;
      const x = hexRadius * Math.cos(radians);
      const y = hexRadius * Math.sin(radians);
      ctx.lineTo(x, y);
    }
    ctx.fill();
    ctx.closePath()
  };

  useEffect(() => {
    console.log("complete?", isListComplete);
  }, [isListComplete]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <LayoutHeader />

      <TaskListProgressBar />

      <main
        ref={mainRef}
        className="container relative mx-auto flex flex-col sm:flex-row h-full items-stretch overflow-hidden"
      >
        { isListComplete && (<Confetti
          width={mainRef.current?.clientWidth}
          height={mainRef.current?.clientHeight}
          drawShape={confettiShape}
          numberOfPieces={300}
          confettiSource={{x:0, y: 0, w: mainRef.current.clientWidth, h: mainRef.current.clientHeight / 5}}
          gravity={0.2}
          wind={0}
          friction={1}
          recycle={false}
        />) }
        <div className="flex-grow overflow-y-auto min-h-full">
          <TokenGrid />
        </div>

        <TaskSidebar />
      </main>

      <LayoutFooter />
    </div>
  );
};
