import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  FlaskConical, 
  Calendar, 
  Timer,
  GraduationCap
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Subjects', url: '/subjects', icon: BookOpen },
  { title: 'Assignments', url: '/assignments', icon: ClipboardList },
  { title: 'Experiments', url: '/experiments', icon: FlaskConical },
  { title: 'Timetable', url: '/timetable', icon: Calendar },
  { title: 'Study Tracker', url: '/study-tracker', icon: Timer },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display text-lg font-bold text-foreground">StudyHub</h1>
              <p className="text-xs text-muted-foreground">Academic Tracker</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
