import { Chapter } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChapterListProps {
  subjectId: string;
}

export function ChapterList({ subjectId }: ChapterListProps) {
  const { getChaptersBySubject, updateChapter, deleteChapter } = useAcademic();
  const chapters = getChaptersBySubject(subjectId);

  const handleStatusToggle = (chapter: Chapter) => {
    const newStatus = chapter.status === 'completed' ? 'pending' : 'completed';
    updateChapter(chapter.id, { status: newStatus });
  };

  const handleInProgress = (chapter: Chapter) => {
    updateChapter(chapter.id, { status: 'in-progress' });
  };

  if (chapters.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">No chapters added yet</p>
      </div>
    );
  }

  const completedCount = chapters.filter((c) => c.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / chapters.length) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: {completedCount}/{chapters.length} chapters
        </span>
        <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>
          {progressPercentage}%
        </Badge>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="space-y-2 mt-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all",
              chapter.status === 'completed' && "bg-primary/5 border-primary/20",
              chapter.status === 'in-progress' && "bg-accent/50 border-accent",
              chapter.status === 'pending' && "bg-card border-border hover:border-muted-foreground/30"
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50" />
            
            <Checkbox
              checked={chapter.status === 'completed'}
              onCheckedChange={() => handleStatusToggle(chapter)}
              className="h-5 w-5"
            />
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-sm",
                chapter.status === 'completed' && "line-through text-muted-foreground"
              )}>
                {chapter.order}. {chapter.title}
              </p>
              {chapter.description && (
                <p className="text-xs text-muted-foreground truncate">{chapter.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {chapter.status === 'pending' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInProgress(chapter)}
                  className="text-xs h-7 px-2"
                >
                  Start
                </Button>
              )}
              {chapter.status === 'in-progress' && (
                <Badge variant="outline" className="text-xs bg-accent text-accent-foreground">
                  In Progress
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteChapter(chapter.id)}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
