import { useState, useEffect } from 'react';
import { TimetableSlot } from '@/types/academic';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddTimetableSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDay?: string;
}

const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

export function AddTimetableSlotDialog({ open, onOpenChange, defaultDay }: AddTimetableSlotDialogProps) {
  const { addTimetableSlot, subjects } = useAcademic();
  const [subjectId, setSubjectId] = useState('');
  const [day, setDay] = useState<TimetableSlot['day']>('monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');

  useEffect(() => {
    if (defaultDay) {
      setDay(defaultDay as TimetableSlot['day']);
    }
  }, [defaultDay]);

  const resetForm = () => {
    setSubjectId('');
    setDay('monday');
    setStartTime('09:00');
    setEndTime('10:00');
    setRoom('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addTimetableSlot({
      subjectId,
      day,
      startTime,
      endTime,
      room: room || undefined,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add Class to Timetable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="day">Day</Label>
            <Select value={day} onValueChange={(v) => setDay(v as TimetableSlot['day'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room (Optional)</Label>
            <Input
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g., A-101"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!subjectId}>
              Add to Timetable
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
