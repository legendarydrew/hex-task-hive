import { useState } from "react";
import TaskAddForm from "./TaskAddForm";
import TaskBulkAddForm from "./TaskBulkAddForm";
import { Switch } from "./ui/switch";

const TaskFormToggle: React.FC = () => {
  const [viewBulkMode, setViewBulkMode] = useState<boolean>(false);

  return (
    <div className="p-1 leading-none border-t-1">
      <div className="flex gap-2 my-1 pl-2 items-center">
        <Switch
          id="bulkMode"
          defaultChecked={viewBulkMode}
          onCheckedChange={(checked) => setViewBulkMode(checked)}
        />
        <label htmlFor="bulkMode" className="font-semibold text-sm">Bulk mode</label>
      </div>
      {viewBulkMode ? <TaskBulkAddForm /> : <TaskAddForm />}
    </div>
  );
};

export default TaskFormToggle;
