import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { Check, X } from "lucide-react";
import { Task } from "@/types";
/**
 * This component is used for updating a Task within the Task List.
 */

export default function TaskListUpdateForm(props: {
  task: Task;
  onClose: Function;
}) {
  const inputField = useRef(null);

  const { state, updateTask, getListCategories } = useApp();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const categories = state.activeListId
    ? getListCategories(state.activeListId)
    : [];

  useEffect(() => {
    if (props.task) {
      setDescription(props.task.description);
      setCategory(props.task.category);
    } else {
      setDescription("");
      setCategory("");
    }
    inputField.current.focus();
  }, [props.task]);

  function changeDescriptionHandler(event) {
    setDescription(event.target.value);
  }

  function updateTaskHandler(e: FormEvent) {
    e.preventDefault();
    updateTask(props.task.id, { category, description });
    props.onClose();
  }

  function cancelHandler(e: FormEvent) {
    e.preventDefault();
    props.onClose();
  }

  return (
    <form
      onSubmit={updateTaskHandler}
      onReset={cancelHandler}
      className="flex gap-1 w-full items-center"
    >
      <div className="w-1/4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="p-1 h-6" id="category">
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

      <div className="flex-grow">
        <Input
          className="p-1 h-6"
          ref={inputField}
          type="text"
          value={description}
          placeholder="Enter a task description..."
          onChange={changeDescriptionHandler}
          required
        />
      </div>

      <div className="flex gap-1">
        <Button
          type="submit"
          variant="default"
          size="icon"
          title="Confirm edit"
        >
          <Check className="h-2 w-2" />
        </Button>
        <Button
          type="reset"
          variant="destructive"
          size="icon"
          title="Cancel edit"
        >
          <X className="h-2 w-2" />
        </Button>
      </div>
    </form>
  );
}
