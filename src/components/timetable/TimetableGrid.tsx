import { useAcademic } from '@/contexts/AcademicContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface TimetableGridProps {
  onAddSlot: (day: string) => void;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const subjectColorClasses: Record<string, string> = {
  math: 'bg-subject-math/20 border-l-subject-math text-subject-math',
  physics: 'bg-subject-physics/20 border-l-subject-physics text-subject-physics',
  chemistry: 'bg-subject-chemistry/20 border-l-subject-chemistry text-subject-chemistry',
  biology: 'bg-subject-biology/20 border-l-subject-biology text-subject-biology',
  english: 'bg-subject-english/20 border-l-subject-english text-subject-english',
  history: 'bg-subject-history/20 border-l-subject-history text-subject-history',
  cs: 'bg-subject-cs/20 border-l-subject-cs text-subject-cs',
  default: 'bg-subject-default/20 border-l-subject-default text-subject-default',
};

export function TimetableGrid({ onAddSlot }: TimetableGridProps) {
  const { timetable, getSubjectById, deleteTimetableSlot } = useAcademic();

  const getSlotAtTime = (day: string, time: string) => {
    return timetable.find((slot) => {
      const startHour = parseInt(slot.startTime.split(':')[0]);
      const endHour = parseInt(slot.endTime.split(':')[0]);
      const currentHour = parseInt(time.split(':')[0]);
      return slot.day === day && currentHour >= startHour && currentHour < endHour;
    });
  };

  const isSlotStart = (day: string, time: string) => {
    return timetable.some((slot) => slot.day === day && slot.startTime === time);
  };

  const getSlotHeight = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    return end - start;
  };

  return (
    <div className="bg-card rounded-xl shadow-card border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-7 border-b border-border/50">
            <div className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/50">
              Time
            </div>
            {dayLabels.map((day, i) => (
              <div
                key={days[i]}
                className="p-3 text-center text-sm font-medium text-foreground border-l border-border/50"
              >
                {day}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-6 w-6"
                  onClick={() => onAddSlot(days[i])}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-7 border-b border-border/50 last:border-b-0">
              <div className="p-3 text-center text-xs text-muted-foreground bg-muted/50 h-16 flex items-center justify-center">
                {time}
              </div>
              {days.map((day) => {
                const slot = getSlotAtTime(day, time);
                const isStart = isSlotStart(day, time);

                if (slot && !isStart) {
                  return <div key={day} className="border-l border-border/50" />;
                }

                if (slot && isStart) {
                  const subject = getSubjectById(slot.subjectId);
                  const colorClass = subject
                    ? subjectColorClasses[subject.color]
                    : subjectColorClasses.default;
                  const height = getSlotHeight(slot.startTime, slot.endTime);

                  return (
                    <div
                      key={day}
                      className={`border-l border-border/50 p-1.5 relative`}
                      style={{ height: `${height * 64}px` }}
                    >
                      <div
                        className={`h-full rounded-lg border-l-4 p-2 ${colorClass} group`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs truncate text-foreground">
                              {subject?.name || 'Unknown'}
                            </p>
                            <p className="text-xs opacity-75">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            {slot.room && (
                              <p className="text-xs opacity-75">Room {slot.room}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteTimetableSlot(slot.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={day}
                    className="border-l border-border/50 h-16 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => onAddSlot(day)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
