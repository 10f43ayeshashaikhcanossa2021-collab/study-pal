import { useState, useEffect } from 'react';
import { Experiment } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddExperimentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editExperiment?: Experiment | null;
}

export function AddExperimentDialog({ open, onOpenChange, editExperiment }: AddExperimentDialogProps) {
  const { addExperiment, updateExperiment, subjects } = useAcademic();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState('');
  const [labNumber, setLabNumber] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'completed'>('upcoming');

  useEffect(() => {
    if (editExperiment) {
      setTitle(editExperiment.title);
      setDescription(editExperiment.description || '');
      setSubjectId(editExperiment.subjectId);
      setDate(new Date(editExperiment.date).toISOString().split('T')[0]);
      setLabNumber(editExperiment.labNumber || '');
      setStatus(editExperiment.status);
    } else {
      resetForm();
    }
  }, [editExperiment]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubjectId('');
    setDate('');
    setLabNumber('');
    setStatus('upcoming');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const experimentData = {
      title,
      description: description || undefined,
      subjectId,
      date: new Date(date),
      labNumber: labNumber || undefined,
      status,
    };

    if (editExperiment) {
      updateExperiment(editExperiment.id, experimentData);
    } else {
      addExperiment(experimentData);
    }

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editExperiment ? 'Edit Experiment' : 'Add New Experiment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Experiment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Titration Analysis"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="labNumber">Lab Number (Optional)</Label>
              <Input
                id="labNumber"
                value={labNumber}
                onChange={(e) => setLabNumber(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add experiment details or observations..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!subjectId}>
              {editExperiment ? 'Save Changes' : 'Add Experiment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
