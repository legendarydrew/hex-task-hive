// <task-bulk-add>
// A component for adding tasks in bulk.

import { FormEvent, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useApp } from "@/context/AppContext";
import { Textarea } from "./ui/textarea";

const TaskBulkAddForm: React.FC = () => {
  const inputField = useRef<HTMLTextAreaElement>();
  const { addTask } = useApp();
  const [content, setContent] = useState<string>('');

  const changeHandler = (e) => {
    setContent(e.target.value);
  };

  const createHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rows = content.split("\n");
    rows.forEach((row) => {
        const parts = row.split("|", 2);
        if (parts.length == 2) {
            addTask(parts[1], parts[0]);
        } else {
            addTask(row);
        }
    });
    setContent('');
    inputField.current.focus();
  };

  return (
    <form onSubmit={createHandler} className="flex flex-col p-1 pb-3 gap-1">
      <Textarea
        className="text-sm"
        rows={4}
        ref={inputField}
        value={content}
        onChange={changeHandler}
        placeholder="One task per line"
        required
      />

      <Button type="submit" variant="default" size="sm">
        Create tasks
      </Button>
    </form>
  );
};

export default TaskBulkAddForm;
