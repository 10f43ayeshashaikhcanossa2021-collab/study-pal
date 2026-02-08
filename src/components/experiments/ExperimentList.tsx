import { Experiment } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2, FlaskConical, CheckCircle } from 'lucide-react';

interface ExperimentListProps {
  onEdit: (experiment: Experiment) => void;
}

export function ExperimentList({ onEdit }: ExperimentListProps) {
  const { experiments, getSubjectById, deleteExperiment, updateExperiment } = useAcademic();

  const sortedExperiments = [...experiments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const toggleComplete = (experiment: Experiment) => {
    updateExperiment(experiment.id, {
      status: experiment.status === 'completed' ? 'upcoming' : 'completed',
    });
  };

  if (experiments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No experiments added</p>
        <p className="text-sm">Track your lab work and experiments here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedExperiments.map((experiment) => {
        const subject = getSubjectById(experiment.subjectId);

        return (
          <div
            key={experiment.id}
            className={`flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 shadow-card transition-all hover:shadow-elevated ${
              experiment.status === 'completed' ? 'opacity-60' : ''
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleComplete(experiment)}
              className={experiment.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}
            >
              {experiment.status === 'completed' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <FlaskConical className="h-5 w-5" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className={`font-medium ${
                    experiment.status === 'completed' ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {experiment.title}
                </p>
                <Badge
                  variant="secondary"
                  className={
                    experiment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-primary/10 text-primary'
                  }
                >
                  {experiment.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{subject?.name || 'Unknown Subject'}</span>
                {experiment.labNumber && (
                  <>
                    <span>•</span>
                    <span>Lab {experiment.labNumber}</span>
                  </>
                )}
                <span>•</span>
                <span>{format(new Date(experiment.date), 'MMM d, yyyy')}</span>
              </div>
              {experiment.description && (
                <p className="text-sm text-muted-foreground mt-1">{experiment.description}</p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(experiment)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteExperiment(experiment.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
