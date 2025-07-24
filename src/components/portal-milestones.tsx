import { Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { PortalConfig, ProjectWithRelations } from '@/lib/types';

interface PortalMilestonesProps {
  project: ProjectWithRelations;
  config: PortalConfig;
}

export function PortalMilestones({ project, config }: PortalMilestonesProps) {
  if (!config.showTimeline) return null;

  const sortedMilestones = project.milestones.sort((a, b) => a.order - b.order);

  return (
    <Card style={{ borderRadius: `${config.borderRadius}px` }}>
      <CardContent>
        <div className="space-y-6">
          {sortedMilestones.map((milestone, index) => (
            <div className="flex gap-4" key={milestone.id}>
              <div className="flex flex-col items-center">
                <div
                  className="flex h-10 w-10 items-center justify-center text-white transition-colors"
                  style={{
                    backgroundColor: milestone.completed
                      ? config.primaryColor
                      : '#e5e7eb',
                    borderRadius: `${config.borderRadius}px`,
                  }}
                >
                  {milestone.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                {index < sortedMilestones.length - 1 && (
                  <div
                    className="mt-3 h-16 w-px"
                    style={{
                      backgroundColor: milestone.completed
                        ? `${config.primaryColor}30`
                        : '#e5e7eb',
                    }}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="font-medium">{milestone.name}</h3>
                  {milestone.completed && (
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: `${config.primaryColor}15`,
                        color: config.primaryColor,
                      }}
                    >
                      Completed
                    </Badge>
                  )}
                </div>
                {milestone.description && (
                  <p className="mb-3 text-muted-foreground text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-muted-foreground text-xs">
                  <span>
                    Target:{' '}
                    {milestone.createdAt
                      ? new Date(milestone.createdAt).toLocaleDateString()
                      : 'No due date'}
                  </span>
                  {milestone.completed && milestone.updatedAt && (
                    <>
                      <span>•</span>
                      <span>
                        Completed:{' '}
                        {new Date(milestone.updatedAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
