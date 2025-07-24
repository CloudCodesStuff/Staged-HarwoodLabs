"use client";
import React, { createContext, useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";
import { api } from "@/trpc/react";
import { SidebarToggle } from "@/components/sidebarToggle";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { useSearchParams, useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { LoginForm } from "@/components/login-form";
import { PortalTheme } from "@/components/portal-theme";
import Head from 'next/head';

export const ProjectContext = createContext<any>(null);

function mapRadius(size: string | undefined) {
  switch (size) {
    case "xs": return "0.125rem";
    case "sm": return "0.25rem";
    case "md": return "0.5rem";
    case "lg": return "0.75rem";
    case "xl": return "1rem";
    default: return "0.5rem";
  }
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams?.get('folderId') ?? null;
  const portalId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  // All hooks must be called unconditionally
  const myMembershipQuery = api.portal.getMyMembership.useQuery({ portalId: portalId ?? "" }, { enabled: !!portalId });
  const [clientInfo, setClientInfo] = useState<{ name: string; email: string } | null>(null);
  useEffect(() => {
    if (!portalId) return;
    const stored = localStorage.getItem(`client-info-${portalId}`);
    if (stored) {
      try {
        setClientInfo(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse client info from localStorage", e);
      }
    }
  }, [portalId]);
  const { data: project, isLoading: projectLoading, error: projectError } = api.project.getForPortal.useQuery({ id: portalId ?? "" }, { enabled: !!portalId });
  const { data: folders = [], isLoading: foldersLoading, error: foldersError } = api.fileLink.listFolders.useQuery(
    currentFolderId ? { projectId: portalId ?? "", parentId: currentFolderId } : { projectId: portalId ?? "" },
    { enabled: !!portalId }
  );
  const { data: files = [], isLoading: filesLoading, error: filesError } = api.fileLink.listFiles.useQuery(
    currentFolderId ? { projectId: portalId ?? "", parentId: currentFolderId } : { projectId: portalId ?? "" },
    { enabled: !!portalId }
  );

  // Now do conditional rendering
  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background,#f8fafc)]">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-2" />
        <span>Loading your session...</span>
      </div>
    </div>
  );
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-white p-8 shadow-md">
        <div className="flex flex-col items-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Sign in to your portal
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Access your project files, updates, and chat. 
          </p>
        </div>

        <LoginForm
          callbackUrl={portalId ? `/portal/${portalId}` : "/portal"}
        />
      </div>
    </div>
    );
  }
  if (myMembershipQuery.isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background,#f8fafc)]">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-2" />
        <span>Checking access...</span>
      </div>
    </div>
  );
  const membership = myMembershipQuery.data;
  const isMember = membership && membership.status === "active";
  if (!isMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertTriangle className="w-10 h-10 mb-4 text-destructive" />
        <h2 className="text-xl mb-4">You do not have access to this portal.</h2>
      </div>
    );
  }
  const isLoading = projectLoading || foldersLoading || filesLoading;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background,#f8fafc)]">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-2" />
          <span>Loading your portal...</span>
        </div>
      </div>
    );
  }
  // Generate a favicon SVG with the primary color
  const faviconSvg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='28' fill='${project?.primaryColor || '#2563eb'}'/></svg>`);
  const faviconUrl = `data:image/svg+xml,${faviconSvg}`;

  const themeStyle = {
    '--background': project?.backgroundColor || '#f8fafc',
    '--foreground': project?.textColor || '#0f172a',
    '--primary': project?.primaryColor || '#2563eb',
    '--radius': mapRadius(project?.roundedness),
    '--text-size': project?.textSize === 'sm' ? '0.95rem' : project?.textSize === 'lg' ? '1.15rem' : '1rem',
  } as React.CSSProperties;
  return (
    <>
      <Head>
        <title>{project?.name || 'Portal'}</title>
        <link rel="icon" type="image/svg+xml" href={faviconUrl} />
        <link rel="shortcut icon" type="image/svg+xml" href={faviconUrl} />
        <link rel="icon" sizes="any" type="image/svg+xml" href={faviconUrl} />
      </Head>
      <ProjectContext.Provider value={{
        project,
        clientInfo,
        projectId: portalId,
        folders,
        files,
        user: session?.user,
        membership,
      }}>
        <div  className="bg-background text-foreground">
        <SidebarProvider className="flex flex-col min-h-screen">
          <div className="flex flex-1">
              <AppSidebar providerName={project?.name || ""} projectId={portalId ?? ""} mainColor={project?.primaryColor || ""} />
              <SidebarInset className="flex flex-col flex-1" style={themeStyle}>
                <PortalTheme theme={project}>
                  <div className="w-full  text-lg flex gap-2 items-center p-2">
                <SidebarToggle />
              </div>
                  <div className="flex-1 overflow-y-auto  " >
                {children}
              </div>
                </PortalTheme>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </ProjectContext.Provider>
    </>
  );
} 