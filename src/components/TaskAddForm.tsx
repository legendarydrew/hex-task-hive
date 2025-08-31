import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";

export default function TaskAddForm() {
  const { state, addTask } = useApp();
  const [description, setDescription] = useState("");

  const inputField = useRef(null);

  function changeDescriptionHandler(event) {
    setDescription(event.target.value);
  }

  function createTaskHandler(e: FormEvent) {
    e.preventDefault();

    const newDescription = description.trim();
    if (newDescription.length) {
      addTask(newDescription);
    }
    setDescription("");
    if (inputField.current) {
      inputField.current.focus();
    }
  }

  return (
    <form
      onSubmit={createTaskHandler}
      className="flex align-items-center p-1 pb-3 gap-1"
    >
      <Input
        className="flex-grow h-8 text-sm"
        ref={inputField}
        type="text"
        value={description}
        placeholder="Enter a task description..."
        onChange={changeDescriptionHandler}
        required
      />

      <Button className="h-8" type="submit" variant="default" size="sm">
        Add
      </Button>
    </form>
  );
}
