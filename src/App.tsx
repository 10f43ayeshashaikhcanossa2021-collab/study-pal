import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AcademicProvider } from "@/contexts/AcademicContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";
import Experiments from "./pages/Experiments";
import Timetable from "./pages/Timetable";
import StudyTracker from "./pages/StudyTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AcademicProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/experiments" element={<Experiments />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/study-tracker" element={<StudyTracker />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AcademicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
