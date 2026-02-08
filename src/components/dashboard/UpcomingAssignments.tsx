import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { useAcademic } from '@/contexts/AcademicContext';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-accent/20 text-accent-foreground',
  high: 'bg-destructive/10 text-destructive',
};

export function UpcomingAssignments() {
  const { assignments, getSubjectById } = useAcademic();

  const upcomingAssignments = assignments
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getDueDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    const days = differenceInDays(date, new Date());
    if (days < 0) return 'Overdue';
    if (days <= 7) return `${days} days`;
    return format(date, 'MMM d');
  };

  if (upcomingAssignments.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
        <h3 className="font-display font-semibold text-lg mb-4">Upcoming Assignments</h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mb-3 opacity-50" />
          <p>No upcoming assignments</p>
          <p className="text-sm">Add assignments to track them here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <h3 className="font-display font-semibold text-lg mb-4">Upcoming Assignments</h3>
      <div className="space-y-3">
        {upcomingAssignments.map((assignment) => {
          const subject = getSubjectById(assignment.subjectId);
          const dueDate = new Date(assignment.dueDate);
          const isOverdue = differenceInDays(dueDate, new Date()) < 0;

          return (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                {isOverdue && <AlertCircle className="h-4 w-4 text-destructive" />}
                <div>
                  <p className="font-medium text-sm">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {subject?.name || 'Unknown Subject'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={priorityColors[assignment.priority]}>
                  {assignment.priority}
                </Badge>
                <span className={`text-xs font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {getDueDateLabel(dueDate)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
