import { useAcademic } from '@/contexts/AcademicContext';
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

export function StudyStats() {
  const { studySessions, getSubjectById } = useAcademic();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const thisWeekSessions = studySessions.filter((session) =>
    isWithinInterval(new Date(session.date), { start: weekStart, end: weekEnd })
  );

  const totalMinutesThisWeek = thisWeekSessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = Math.floor(totalMinutesThisWeek / 60);
  const remainingMinutes = totalMinutesThisWeek % 60;

  // Group by subject
  const subjectStats = thisWeekSessions.reduce((acc, session) => {
    if (!acc[session.subjectId]) {
      acc[session.subjectId] = 0;
    }
    acc[session.subjectId] += session.duration;
    return acc;
  }, {} as Record<string, number>);

  const sortedSubjects = Object.entries(subjectStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <h3 className="font-display font-semibold text-lg mb-4">This Week's Progress</h3>

      <div className="text-center mb-6">
        <p className="text-4xl font-display font-bold text-primary">
          {totalHours}h {remainingMinutes}m
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Total study time this week
        </p>
      </div>

      {sortedSubjects.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Time per subject</p>
          {sortedSubjects.map(([subjectId, minutes]) => {
            const subject = getSubjectById(subjectId);
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            const percentage = (minutes / totalMinutesThisWeek) * 100;

            return (
              <div key={subjectId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{subject?.name || 'Unknown'}</span>
                  <span className="text-muted-foreground">
                    {hours > 0 ? `${hours}h ` : ''}{mins}m
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          No study sessions recorded this week
        </p>
      )}

      {studySessions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
}
