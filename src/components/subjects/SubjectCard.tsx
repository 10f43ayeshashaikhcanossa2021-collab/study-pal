import { useState } from 'react';
import { Subject } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2, Edit2, ClipboardList, FlaskConical, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SubjectChaptersDialog } from '@/components/chapters/SubjectChaptersDialog';
import { Progress } from '@/components/ui/progress';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
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

export function SubjectCard({ subject, onEdit }: SubjectCardProps) {
  const { deleteSubject, assignments, experiments, getChaptersBySubject } = useAcademic();
  const [chaptersOpen, setChaptersOpen] = useState(false);

  const subjectAssignments = assignments.filter((a) => a.subjectId === subject.id);
  const subjectExperiments = experiments.filter((e) => e.subjectId === subject.id);
  const pendingAssignments = subjectAssignments.filter((a) => a.status !== 'completed').length;
  
  const chapters = getChaptersBySubject(subject.id);
  const completedChapters = chapters.filter((c) => c.status === 'completed').length;
  const chapterProgress = chapters.length > 0 ? Math.round((completedChapters / chapters.length) * 100) : 0;

  return (
    <>
      <div className="subject-card animate-scale-in group">
        <div className={`h-2 ${colorClasses[subject.color]}`} />
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">{subject.name}</h3>
              <p className="text-sm text-muted-foreground">{subject.code}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(subject)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteSubject(subject.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {subject.professor && (
            <p className="text-sm text-muted-foreground mb-3">Prof. {subject.professor}</p>
          )}

          {/* Chapter Progress */}
          <button 
            onClick={() => setChaptersOpen(true)}
            className="w-full mb-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                Chapters
              </span>
              <span className="text-xs text-muted-foreground">
                {completedChapters}/{chapters.length}
              </span>
            </div>
            <Progress value={chapterProgress} className="h-1.5" />
          </button>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              <span>
                {pendingAssignments} pending
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FlaskConical className="h-4 w-4" />
              <span>{subjectExperiments.length} labs</span>
            </div>
          </div>

          {subject.credits && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">{subject.credits} Credits</span>
            </div>
          )}
        </div>
      </div>

      <SubjectChaptersDialog
        open={chaptersOpen}
        onOpenChange={setChaptersOpen}
        subject={subject}
      />
    </>
  );
}
