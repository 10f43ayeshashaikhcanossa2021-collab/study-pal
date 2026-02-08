import { useState } from 'react';
import { Subject } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { ChapterList } from './ChapterList';
import { AddChapterDialog } from './AddChapterDialog';

interface SubjectChaptersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject;
}

const colorClasses: Record<string, string> = {
  math: 'bg-subject-math',
  physics: 'bg-subject-physics',
  chemistry: 'bg-subject-chemistry',
  biology: 'bg-subject-biology',
  english: 'bg-subject-english',
  history: 'bg-subject-history',
  cs: 'bg-subject-cs',
  default: 'bg-subject-default',
};

export function SubjectChaptersDialog({ open, onOpenChange, subject }: SubjectChaptersDialogProps) {
  const [addChapterOpen, setAddChapterOpen] = useState(false);
  const { getChaptersBySubject } = useAcademic();
  const chapters = getChaptersBySubject(subject.id);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${colorClasses[subject.color]}`} />
              <DialogTitle className="font-display">{subject.name} - Chapters</DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{subject.code}</p>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No chapters yet</p>
                <p className="text-sm">Add chapters to track your progress</p>
              </div>
            ) : (
              <ChapterList subjectId={subject.id} />
            )}
          </div>

          <div className="flex-shrink-0 pt-4 border-t">
            <Button 
              onClick={() => setAddChapterOpen(true)} 
              className="w-full gradient-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddChapterDialog
        open={addChapterOpen}
        onOpenChange={setAddChapterOpen}
        subjectId={subject.id}
      />
    </>
  );
}
