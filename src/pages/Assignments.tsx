import { useState } from 'react';
import { Assignment } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import { AssignmentList } from '@/components/assignments/AssignmentList';
import { AddAssignmentDialog } from '@/components/assignments/AddAssignmentDialog';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList } from 'lucide-react';

export default function Assignments() {
  const { subjects } = useAcademic();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);

  const handleEdit = (assignment: Assignment) => {
    setEditAssignment(assignment);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditAssignment(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">Track and manage your homework</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary text-primary-foreground"
          disabled={subjects.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <ClipboardList className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">Add subjects first</p>
          <p className="text-sm">You need at least one subject to add assignments</p>
        </div>
      ) : (
        <AssignmentList onEdit={handleEdit} />
      )}

      <AddAssignmentDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        editAssignment={editAssignment}
      />
    </div>
  );
}
