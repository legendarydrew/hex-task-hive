// <task-bulk-add>
// A component for adding tasks in bulk.

import { FormEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useApp } from "@/context/AppContext";
import { Textarea } from "./ui/textarea";

const TaskBulkAddForm: React.FC = () => {
  const inputField = useRef<HTMLTextAreaElement>();
  const { addTask } = useApp();
  const [content, setContent] = useState<string>("");

  const changeHandler = (e) => {
    setContent(e.target.value);
  };

  const createHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rows = content.split("\n");
    rows.forEach((row) => addTask(row));
    setContent("");
    inputField.current.focus();
  };

  return (
    <form onSubmit={createHandler} className="flex flex-col p-1 pb-3 gap-1">
      <Textarea
        className="text-sm h-[10dvh] resize-none"
        ref={inputField}
        value={content}
        onChange={changeHandler}
        placeholder="One task per line..."
        required
      />

      <Button type="submit" variant="default" size="sm">
        Create tasks
      </Button>
    </form>
  );
};

export default TaskBulkAddForm;
