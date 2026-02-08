import { useAcademic } from '@/contexts/AcademicContext';
import { StudyTimer } from '@/components/study/StudyTimer';
import { StudyStats } from '@/components/study/StudyStats';
import { Timer } from 'lucide-react';

export default function StudyTracker() {
  const { subjects } = useAcademic();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Study Tracker</h1>
        <p className="text-muted-foreground mt-1">Track your study time and progress</p>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Timer className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">Add subjects first</p>
          <p className="text-sm">You need at least one subject to track study time</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StudyTimer />
          <StudyStats />
        </div>
      )}
    </div>
  );
}
