import { useState, useEffect, useRef } from 'react';
import { useAcademic } from '@/contexts/AcademicContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

export function StudyTimer() {
  const { subjects, addStudySession } = useAcademic();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedSubject) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleComplete = () => {
    if (seconds > 0 && selectedSubject) {
      addStudySession({
        subjectId: selectedSubject,
        date: new Date(),
        duration: Math.ceil(seconds / 60), // Convert to minutes
      });
      handleReset();
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
      <h3 className="font-display font-semibold text-lg mb-4">Study Timer</h3>

      <div className="space-y-6">
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select a subject to study" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-center">
          <div className="text-6xl font-display font-bold text-primary mb-6 tabular-nums">
            {formatTime(seconds)}
          </div>

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                disabled={!selectedSubject}
                className="gradient-primary text-primary-foreground"
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="secondary">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>

            {seconds > 0 && (
              <Button onClick={handleComplete} variant="outline" className="text-primary">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Session
              </Button>
            )}
          </div>
        </div>

        {!selectedSubject && subjects.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Add subjects first to start tracking your study time
          </p>
        )}
      </div>
    </div>
  );
}
