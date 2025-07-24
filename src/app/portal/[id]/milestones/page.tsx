'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, CheckCircle2, Circle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { ProjectContext } from "../layout";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { PortalTheme } from "@/components/portal-theme";

export default function MilestonesPage() {
  const { project, isLoading, error } = useContext(ProjectContext as React.Context<any>);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (error || !project) return <div className="p-8 text-center text-muted-foreground">Project not found or unauthorized.</div>;

  const completedMilestones = project.milestones?.filter((m: any) => m.completed).length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const sortedMilestones = [...(project.milestones || [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <PortalTheme theme={{
      primaryColor: project?.primaryColor,
      backgroundColor: project?.backgroundColor,
      textColor: project?.textColor,
      roundedness: project?.roundedness,
      spacing: project?.spacing,
      textSize: project?.textSize,
    }}>
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8  ">
    <header className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Milestones</h1>
            <p className="text-muted-foreground text-sm">A complete overview of the project's progress.</p>
          </div>
        </div>
      </header>

      <Card className="flex-grow flex flex-col bg-white text-black shadow-sm border-0 ring-1 ring-border" style={{ borderRadius: 'var(--radius)' }}>
        <CardHeader className="p-6 flex-shrink-0">
          <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-lg font-semibold " style={{ fontSize: 'calc(var(--text-size) * 1.1)' }}>Project Progress</CardTitle>
              <span className="font-semibold  text-sm" style={{ fontSize: 'var(--text-size)' }}>{completedMilestones} / {totalMilestones} Done</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-y-auto">
          {sortedMilestones.length > 0 ? (
            <ul className="divide-y divide-border">
              {sortedMilestones.map((milestone: any) => (
                <li key={milestone.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div>
                      {milestone.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className={cn("font-medium ", milestone.completed && "line-through text-muted-foreground")} style={{ fontSize: 'var(--text-size)' }}>
                          {milestone.name}
                        </p>
                        <time className="text-xs text-muted-foreground flex-shrink-0 ml-4" style={{ fontSize: 'calc(var(--text-size) * 0.9)' }}>
                          {format(new Date(milestone.createdAt), "MMM d, yyyy")}
                        </time>
                      </div>
                      {milestone.description && (
                        <p className="text-muted-foreground mt-2 text-sm leading-6" style={{ fontSize: 'calc(var(--text-size) * 0.95)' }}>
                          {milestone.description}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-12 text-center h-full flex items-center justify-center">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-size)' }}>No milestones have been added to this project yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </PortalTheme>
  );
}
