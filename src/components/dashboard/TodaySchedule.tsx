import { useAcademic } from '@/contexts/AcademicContext';
import { Calendar } from 'lucide-react';

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

const subjectColorClasses: Record<string, string> = {
  math: 'border-l-subject-math',
  physics: 'border-l-subject-physics',
  chemistry: 'border-l-subject-chemistry',
  biology: 'border-l-subject-biology',
  english: 'border-l-subject-english',
  history: 'border-l-subject-history',
  cs: 'border-l-subject-cs',
  default: 'border-l-subject-default',
};

export function TodaySchedule() {
  const { timetable, getSubjectById } = useAcademic();
  const today = dayNames[new Date().getDay()];

  const todaySlots = timetable
    .filter((slot) => slot.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (todaySlots.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
        <h3 className="font-display font-semibold text-lg mb-4">Today's Schedule</h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mb-3 opacity-50" />
          <p>No classes today</p>
          <p className="text-sm">Enjoy your free day!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <h3 className="font-display font-semibold text-lg mb-4">Today's Schedule</h3>
      <div className="space-y-3">
        {todaySlots.map((slot) => {
          const subject = getSubjectById(slot.subjectId);
          const colorClass = subject ? subjectColorClasses[subject.color] : subjectColorClasses.default;

          return (
            <div
              key={slot.id}
              className={`flex items-center justify-between p-3 rounded-lg bg-muted/50 border-l-4 ${colorClass}`}
            >
              <div>
                <p className="font-medium text-sm">{subject?.name || 'Unknown Subject'}</p>
                {slot.room && (
                  <p className="text-xs text-muted-foreground">Room {slot.room}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
