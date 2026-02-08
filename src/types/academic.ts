export type SubjectColor = 'math' | 'physics' | 'chemistry' | 'biology' | 'english' | 'history' | 'cs' | 'default';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: SubjectColor;
  professor?: string;
  credits?: number;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface Experiment {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  date: Date;
  status: 'upcoming' | 'completed';
  labNumber?: string;
}

export interface TimetableSlot {
  id: string;
  subjectId: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  room?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: Date;
  duration: number; // in minutes
  topic?: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  order: number;
  status: 'pending' | 'in-progress' | 'completed';
}
