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
  const { state, addTask, getListCategories } = useApp();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Get categories for the active list
  const categories = state.activeListId
    ? getListCategories(state.activeListId)
    : [];

  const inputField = useRef(null);

  function changeDescriptionHandler(event) {
    setDescription(event.target.value);
  }

  function createTaskHandler(e: FormEvent) {
    e.preventDefault();

    const newDescription = description.trim();
    if (newDescription.length) {
      addTask(newDescription, category);
    }
    setDescription("");
    if (inputField.current) {
      inputField.current.focus();
    }
  }

  return (
    <form onSubmit={createTaskHandler} className="flex align-items-center p-1 pb-3 gap-1">
      <div className="w-1/4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-8 text-sm" id="category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Input
         className="h-8 text-sm"
          ref={inputField}
          type="text"
          value={description}
          placeholder="Enter a task description..."
          onChange={changeDescriptionHandler}
          required
        />
      </div>

      <Button className="h-8" type="submit" variant="default" size="sm">
        Add
      </Button>
    </form>
  );
}
