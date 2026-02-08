import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, Assignment, Experiment, TimetableSlot, StudySession } from '@/types/academic';

interface AcademicContextType {
  subjects: Subject[];
  assignments: Assignment[];
  experiments: Experiment[];
  timetable: TimetableSlot[];
  studySessions: StudySession[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  addExperiment: (experiment: Omit<Experiment, 'id'>) => void;
  updateExperiment: (id: string, experiment: Partial<Experiment>) => void;
  deleteExperiment: (id: string) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, slot: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;
  addStudySession: (session: Omit<StudySession, 'id'>) => void;
  getSubjectById: (id: string) => Subject | undefined;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const STORAGE_KEYS = {
  subjects: 'academic_subjects',
  assignments: 'academic_assignments',
  experiments: 'academic_experiments',
  timetable: 'academic_timetable',
  studySessions: 'academic_study_sessions',
};

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.subjects);
    return stored ? JSON.parse(stored) : [];
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.assignments);
    if (stored) {
      return JSON.parse(stored).map((a: any) => ({ ...a, dueDate: new Date(a.dueDate) }));
    }
    return [];
  });

  const [experiments, setExperiments] = useState<Experiment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.experiments);
    if (stored) {
      return JSON.parse(stored).map((e: any) => ({ ...e, date: new Date(e.date) }));
    }
    return [];
  });

  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.timetable);
    return stored ? JSON.parse(stored) : [];
  });

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.studySessions);
    if (stored) {
      return JSON.parse(stored).map((s: any) => ({ ...s, date: new Date(s.date) }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.experiments, JSON.stringify(experiments));
  }, [experiments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.timetable, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.studySessions, JSON.stringify(studySessions));
  }, [studySessions]);

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    setSubjects((prev) => [...prev, { ...subject, id: generateId() }]);
  };

  const updateSubject = (id: string, subject: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...subject } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setAssignments((prev) => prev.filter((a) => a.subjectId !== id));
    setExperiments((prev) => prev.filter((e) => e.subjectId !== id));
    setTimetable((prev) => prev.filter((t) => t.subjectId !== id));
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    setAssignments((prev) => [...prev, { ...assignment, id: generateId() }]);
  };

  const updateAssignment = (id: string, assignment: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...assignment } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const addExperiment = (experiment: Omit<Experiment, 'id'>) => {
    setExperiments((prev) => [...prev, { ...experiment, id: generateId() }]);
  };

  const updateExperiment = (id: string, experiment: Partial<Experiment>) => {
    setExperiments((prev) => prev.map((e) => (e.id === id ? { ...e, ...experiment } : e)));
  };

  const deleteExperiment = (id: string) => {
    setExperiments((prev) => prev.filter((e) => e.id !== id));
  };

  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    setTimetable((prev) => [...prev, { ...slot, id: generateId() }]);
  };

  const updateTimetableSlot = (id: string, slot: Partial<TimetableSlot>) => {
    setTimetable((prev) => prev.map((t) => (t.id === id ? { ...t, ...slot } : t)));
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
  };

  const addStudySession = (session: Omit<StudySession, 'id'>) => {
    setStudySessions((prev) => [...prev, { ...session, id: generateId() }]);
  };

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  return (
    <AcademicContext.Provider
      value={{
        subjects,
        assignments,
        experiments,
        timetable,
        studySessions,
        addSubject,
        updateSubject,
        deleteSubject,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        addExperiment,
        updateExperiment,
        deleteExperiment,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        addStudySession,
        getSubjectById,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within AcademicProvider');
  }
  return context;
}
