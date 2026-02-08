import { useState, useEffect } from 'react';
import { Assignment } from '@/types/academic';
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

interface AddAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAssignment?: Assignment | null;
}

export function AddAssignmentDialog({ open, onOpenChange, editAssignment }: AddAssignmentDialogProps) {
  const { addAssignment, updateAssignment, subjects } = useAcademic();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  useEffect(() => {
    if (editAssignment) {
      setTitle(editAssignment.title);
      setDescription(editAssignment.description || '');
      setSubjectId(editAssignment.subjectId);
      setDueDate(new Date(editAssignment.dueDate).toISOString().split('T')[0]);
      setPriority(editAssignment.priority);
      setStatus(editAssignment.status);
    } else {
      resetForm();
    }
  }, [editAssignment]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubjectId('');
    setDueDate('');
    setPriority('medium');
    setStatus('pending');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignmentData = {
      title,
      description: description || undefined,
      subjectId,
      dueDate: new Date(dueDate),
      priority,
      status,
    };

    if (editAssignment) {
      updateAssignment(editAssignment.id, assignmentData);
    } else {
      addAssignment(assignmentData);
    }

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editAssignment ? 'Edit Assignment' : 'Add New Assignment'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 5 Homework"
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

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes or details..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!subjectId}>
              {editAssignment ? 'Save Changes' : 'Add Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
