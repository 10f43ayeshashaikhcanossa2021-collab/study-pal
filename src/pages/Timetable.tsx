import { useState } from 'react';
import { useAcademic } from '@/contexts/AcademicContext';
import { TimetableGrid } from '@/components/timetable/TimetableGrid';
import { AddTimetableSlotDialog } from '@/components/timetable/AddTimetableSlotDialog';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';

export default function Timetable() {
  const { subjects } = useAcademic();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | undefined>();

  const handleAddSlot = (day: string) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedDay(undefined);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Timetable</h1>
          <p className="text-muted-foreground mt-1">Your weekly class schedule</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary text-primary-foreground"
          disabled={subjects.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Calendar className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">Add subjects first</p>
          <p className="text-sm">You need at least one subject to create your timetable</p>
        </div>
      ) : (
        <TimetableGrid onAddSlot={handleAddSlot} />
      )}

      <AddTimetableSlotDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        defaultDay={selectedDay}
      />
    </div>
  );
}
