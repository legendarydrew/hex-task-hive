
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from '@/context/AppContext';

interface ListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId?: string | null;
}

export const ListDialog: React.FC<ListDialogProps> = ({ 
  open, 
  onOpenChange,
  listId 
}) => {
  const { state, addList, updateList } = useApp();
  const isEditing = listId !== null && listId !== undefined;
  
  const existingList = isEditing 
    ? state.lists.find(list => list.id === listId) 
    : null;
  
  const [name, setName] = React.useState('');

  // Reset form when dialog opens/closes or list changes
  React.useEffect(() => {
    if (existingList) {
      setName(existingList.name);
    } else {
      setName('');
    }
  }, [existingList, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && existingList) {
      updateList(existingList.id, name);
    } else {
      addList(name);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit List' : 'Create New List'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Change the name of your list.' 
              : 'Give your new list a descriptive name.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">List Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Work Projects, Shopping List"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">
              {isEditing ? 'Save Changes' : 'Create List'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
