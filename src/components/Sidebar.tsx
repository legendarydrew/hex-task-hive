
import React from 'react';
import { Button } from "@/components/ui/button";
import { useApp } from '@/context/AppContext';
import { 
  List, 
  Edit, 
  Trash2,
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ListDialog } from './ListDialog';
import { MoreHorizontal } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Sidebar = () => {
  const { state, setActiveList, deleteList } = useApp();
  const [listToEdit, setListToEdit] = React.useState<string | null>(null);
  const [listToDelete, setListToDelete] = React.useState<string | null>(null);

  return (
    <div className="h-[calc(100vh-64px)] w-full sm:w-64 p-4 bg-white border-r">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <List className="h-5 w-5" />
          <span>My Lists</span>
        </h2>
        
        {state.lists.length === 0 ? (
          <div className="text-muted-foreground text-sm py-6 text-center">
            No lists yet. Create your first list to get started.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {state.lists.map((list) => (
              <div 
                key={list.id}
                className="flex items-center justify-between"
              >
                <Button
                  variant={state.activeListId === list.id ? "default" : "ghost"}
                  className={`justify-start w-full text-left ${state.activeListId === list.id ? 'bg-primary text-white' : ''}`}
                  onClick={() => setActiveList(list.id)}
                >
                  {list.name}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setListToEdit(list.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setListToDelete(list.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      <ListDialog 
        open={listToEdit !== null} 
        onOpenChange={(open) => !open && setListToEdit(null)} 
        listId={listToEdit}
      />

      <AlertDialog open={listToDelete !== null} onOpenChange={(open) => !open && setListToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the list
              and all tasks within it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (listToDelete) {
                  deleteList(listToDelete);
                  setListToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
