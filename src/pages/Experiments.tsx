import { useState } from 'react';
import { Experiment } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import { ExperimentList } from '@/components/experiments/ExperimentList';
import { AddExperimentDialog } from '@/components/experiments/AddExperimentDialog';
import { Button } from '@/components/ui/button';
import { Plus, FlaskConical } from 'lucide-react';

export default function Experiments() {
  const { subjects } = useAcademic();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editExperiment, setEditExperiment] = useState<Experiment | null>(null);

  const handleEdit = (experiment: Experiment) => {
    setEditExperiment(experiment);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditExperiment(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Experiments</h1>
          <p className="text-muted-foreground mt-1">Track your lab work and practicals</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary text-primary-foreground"
          disabled={subjects.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experiment
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <FlaskConical className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">Add subjects first</p>
          <p className="text-sm">You need at least one subject to add experiments</p>
        </div>
      ) : (
        <ExperimentList onEdit={handleEdit} />
      )}

      <AddExperimentDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        editExperiment={editExperiment}
      />
    </div>
  );
}
