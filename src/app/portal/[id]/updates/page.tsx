'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Bell, FileText } from "lucide-react";
import { useContext } from "react";
import { ProjectContext } from "../layout";
import { EditorOutput } from "@/components/editor-output";
import { format } from "date-fns";

export default function UpdatesPage() {
  const { project, isLoading, error } = useContext(ProjectContext as React.Context<any>);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (error || !project) return <div className="p-8 text-center text-muted-foreground">Project not found or unauthorized.</div>;

  const sortedUpdates = [...(project.updates || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
 <header className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Updates</h1>
            <p className="text-muted-foreground text-sm">Project updates and announcements.</p>
          </div>
        </div>
      </header>

      <Card className="flex-grow bg-white overflow-y-auto">
      <CardContent>
        {sortedUpdates.length > 0 ? (
          <div className="relative">
            {/* Vertical line */}
 
            <div className="space-y-12">
              {sortedUpdates.map((update: any) => (
                <div key={update.id} className="relative flex items-start">
            
                  <div className="flex-1 pt-1.5">
                    <Card className="bg-white text-black shadow-sm border">
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <CardTitle className="text-xl">{update.name}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 sm:mt-0">
                            {update.important && (
                              <Badge variant="destructive">
                                <Bell className="w-3 h-3 mr-1.5" />
                                Important
                              </Badge>
                            )}
                            <time className="text-sm text-muted-foreground">
                              {format(new Date(update.createdAt), "MMMM d, yyyy")}
                            </time>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="prose prose-sm max-w-none text-muted-foreground">
                        <EditorOutput content={update.content as any} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-whit py-20 text-muted-foreground">
            <Activity className="w-14 h-14 mb-4 text-primary/70" />
            <div className="text-lg font-semibold mb-1">No updates yet</div>
            <div className="text-sm">Project updates and announcements will appear here.</div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
