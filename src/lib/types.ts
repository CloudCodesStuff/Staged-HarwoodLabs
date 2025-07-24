import type { Prisma } from '@prisma/client';

// Project with all relations
export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: {
    client: true;
    user: true;
    organization: true;
    portalSettings: true;
    milestones: true;
    files: true;
    activities: {
      include: {
        user: true;
      };
      orderBy: {
        createdAt: 'desc';
      };
      take: 10;
    };
    updates: {
      orderBy: {
        createdAt: 'desc';
      };
    };
    comments: {
      orderBy: {
        createdAt: 'desc';
      };
    };
    notes: {
      include: {
        author: true;
      };
      orderBy: {
        updatedAt: 'desc';
      };
    };
  };
}>;

// Simplified project for lists
export type ProjectSummary = Prisma.ProjectGetPayload<{
  include: {
    client: true;
    user: true;
    _count: {
      select: {
        files: true;
        comments: true;
        milestones: true;
      };
    };
  };
}>;

// Dashboard stats type
export interface DashboardStats {
  activeProjects: number;
  filesUploaded: number;
  clientMessages: number;
  completedThisMonth: number;
  recentProjects: ProjectSummary[];
}

// Portal configuration
export interface PortalConfig {
  theme: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  borderRadius: number;
  fontFamily: string;
  spacing: string;
  headerStyle: string;
  cardStyle: string;
  showProgress: boolean;
  showTimeline: boolean;
  showComments: boolean;
  showFiles: boolean;
  brandName: string;
  logoUrl: string;
  sections: PortalSection[];
}

export interface PortalSection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}
