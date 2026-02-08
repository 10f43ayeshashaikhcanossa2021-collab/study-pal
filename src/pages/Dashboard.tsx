import { useAcademic } from '@/contexts/AcademicContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingAssignments } from '@/components/dashboard/UpcomingAssignments';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { BookOpen, ClipboardList, FlaskConical, Timer } from 'lucide-react';

export default function Dashboard() {
  const { subjects, assignments, experiments, studySessions } = useAcademic();

  const pendingAssignments = assignments.filter((a) => a.status !== 'completed').length;
  const upcomingExperiments = experiments.filter((e) => e.status === 'upcoming').length;
  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + s.duration, 0);
  const studyHours = Math.floor(totalStudyMinutes / 60);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your academic overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          subtitle="Active courses"
          icon={BookOpen}
          color="primary"
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments}
          subtitle="Need attention"
          icon={ClipboardList}
          color={pendingAssignments > 5 ? 'destructive' : 'accent'}
        />
        <StatCard
          title="Upcoming Labs"
          value={upcomingExperiments}
          subtitle="Experiments"
          icon={FlaskConical}
          color="primary"
        />
        <StatCard
          title="Study Time"
          value={`${studyHours}h`}
          subtitle="Total tracked"
          icon={Timer}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAssignments />
        <TodaySchedule />
      </div>
    </div>
  );
}
