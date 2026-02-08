import { useState } from 'react';
import { Assignment } from '@/types/academic';
import { useAcademic } from '@/contexts/AcademicContext';
import { format, differenceInDays, isToday, isTomorrow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AssignmentListProps {
  onEdit: (assignment: Assignment) => void;
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-accent/20 text-accent-foreground',
  high: 'bg-destructive/10 text-destructive',
};

const statusColors = {
  pending: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  completed: 'bg-green-100 text-green-700',
};

export function AssignmentList({ onEdit }: AssignmentListProps) {
  const { assignments, getSubjectById, updateAssignment, deleteAssignment, subjects } = useAcademic();
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredAssignments = assignments
    .filter((a) => filterSubject === 'all' || a.subjectId === filterSubject)
    .filter((a) => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getDueDateLabel = (date: Date) => {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    const days = differenceInDays(d, new Date());
    if (days < 0) return `${Math.abs(days)} days overdue`;
    return format(d, 'MMM d, yyyy');
  };

  const toggleComplete = (assignment: Assignment) => {
    updateAssignment(assignment.id, {
      status: assignment.status === 'completed' ? 'pending' : 'completed',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No assignments found</p>
            <p className="text-sm">Add your first assignment to get started</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const subject = getSubjectById(assignment.subjectId);
            const isOverdue =
              assignment.status !== 'completed' &&
              differenceInDays(new Date(assignment.dueDate), new Date()) < 0;

            return (
              <div
                key={assignment.id}
                className={`flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 shadow-card transition-all hover:shadow-elevated ${
                  assignment.status === 'completed' ? 'opacity-60' : ''
                }`}
              >
                <Checkbox
                  checked={assignment.status === 'completed'}
                  onCheckedChange={() => toggleComplete(assignment)}
                  className="h-5 w-5"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`font-medium ${
                        assignment.status === 'completed' ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {assignment.title}
                    </p>
                    <Badge variant="secondary" className={priorityColors[assignment.priority]}>
                      {assignment.priority}
                    </Badge>
                    <Badge variant="secondary" className={statusColors[assignment.status]}>
                      {assignment.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{subject?.name || 'Unknown Subject'}</span>
                    <span>•</span>
                    <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                      {getDueDateLabel(assignment.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(assignment)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAssignment(assignment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
