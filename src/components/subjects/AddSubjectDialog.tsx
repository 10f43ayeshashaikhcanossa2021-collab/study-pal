import { useState, useEffect } from 'react';
import { Subject, SubjectColor } from '@/types/academic';
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

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editSubject?: Subject | null;
}

const colors: { value: SubjectColor; label: string; class: string }[] = [
  { value: 'math', label: 'Red', class: 'bg-subject-math' },
  { value: 'physics', label: 'Blue', class: 'bg-subject-physics' },
  { value: 'chemistry', label: 'Green', class: 'bg-subject-chemistry' },
  { value: 'biology', label: 'Lime', class: 'bg-subject-biology' },
  { value: 'english', label: 'Purple', class: 'bg-subject-english' },
  { value: 'history', label: 'Orange', class: 'bg-subject-history' },
  { value: 'cs', label: 'Violet', class: 'bg-subject-cs' },
  { value: 'default', label: 'Teal', class: 'bg-subject-default' },
];

export function AddSubjectDialog({ open, onOpenChange, editSubject }: AddSubjectDialogProps) {
  const { addSubject, updateSubject } = useAcademic();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [credits, setCredits] = useState('');
  const [color, setColor] = useState<SubjectColor>('default');

  useEffect(() => {
    if (editSubject) {
      setName(editSubject.name);
      setCode(editSubject.code);
      setProfessor(editSubject.professor || '');
      setCredits(editSubject.credits?.toString() || '');
      setColor(editSubject.color);
    } else {
      resetForm();
    }
  }, [editSubject]);

  const resetForm = () => {
    setName('');
    setCode('');
    setProfessor('');
    setCredits('');
    setColor('default');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subjectData = {
      name,
      code,
      color,
      professor: professor || undefined,
      credits: credits ? parseInt(credits) : undefined,
    };

    if (editSubject) {
      updateSubject(editSubject.id, subjectData);
    } else {
      addSubject(subjectData);
    }

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editSubject ? 'Edit Subject' : 'Add New Subject'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Subject Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., MATH101"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professor">Professor (Optional)</Label>
            <Input
              id="professor"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="e.g., Dr. Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits">Credits (Optional)</Label>
            <Input
              id="credits"
              type="number"
              min="1"
              max="10"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="e.g., 3"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.class} transition-all ${
                    color === c.value
                      ? 'ring-2 ring-offset-2 ring-primary scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editSubject ? 'Save Changes' : 'Add Subject'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
