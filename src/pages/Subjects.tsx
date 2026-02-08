import { useState } from 'react';
import { Subject } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { AddSubjectDialog } from '@/components/subjects/AddSubjectDialog';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';

export default function Subjects() {
  const { subjects } = useAcademic();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);

  const handleEdit = (subject: Subject) => {
    setEditSubject(subject);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditSubject(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage your courses and subjects</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <BookOpen className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No subjects yet</p>
          <p className="text-sm">Add your first subject to get started</p>
          <Button onClick={() => setDialogOpen(true)} className="mt-4" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <AddSubjectDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        editSubject={editSubject}
      />
    </div>
  );
}
