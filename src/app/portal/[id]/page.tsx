"use client";
import React, { useContext } from "react";
import { ProjectContext } from "./layout";
import { Folder, File, ArrowLeft, Eye, FileText, FolderGit2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <div className="bg-white/10 p-6 rounded-lg flex items-center space-x-4 backdrop-blur-sm">
        <div className="bg-white/20 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="portal-text-sm text-white/80">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { project, files, folders, projectId } = useContext(ProjectContext);
    const { data: session } = useSession();

    const recentUpdates = (project?.updates || []).slice(0, 2);
    const milestones = project?.milestones || [];
    const recentMilestones = milestones.slice(0, 2);
    const recentComments = (project?.comments || []).slice(0, 2);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-1">
                    Hey, {session?.user?.name || 'Valued Client'}!
                </h1>
                <p className="text-muted-foreground">Welcome to your portal for {project?.name}.</p>
            </div>

            <div className="mb-8 p-6 md:p-8 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[color-mix(in_srgb,var(--primary)_70%,transparent)] shadow-lg text-white">
                <h2 className="text-2xl font-bold mb-4">At a Glance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard title="Total Files" value={files.length} icon={<FileText className="w-6 h-6 text-white" />} />
                    <StatCard title="Total Folders" value={folders.length} icon={<FolderGit2 className="w-6 h-6 text-white" />} />
                    <StatCard title="Project Status" value={project?.status || 'Active'} icon={<Eye className="w-6 h-6 text-white" />} />
                </div>
            </div>

            {/* Recent Updates & Milestones Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Recent Updates Card */}
                <Card className="bg-white">
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-black mb-2">Recent Updates</h3>
                    </CardHeader>
                    <CardContent>
                        {recentUpdates.length > 0 ? recentUpdates.map((u: any) => (
                            <div key={u.id} className="mb-2">
                                <div className="flex items-center gap-2 text-black/80 text-sm mb-1">
                                    <span className="font-semibold">{u.name}</span>
                                    <span className="text-xs text-black/60">{format(new Date(u.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                        )) : <div className="text-muted-foreground text-sm">No updates yet.</div>}
                        <Link href={`/portal/${projectId}/updates`} className="text-primary text-xs mt-2 hover:underline">See all updates</Link>
                    </CardContent>
                </Card>
                {/* Recent Milestones Card */}
                <Card className="bg-white">
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-black mb-2">Recent Milestones</h3>
                    </CardHeader>
                    <CardContent>
                        {recentMilestones.length > 0 ? recentMilestones.map((m: any) => (
                            <div key={m.id} className="mb-2">
                                <div className="flex items-center gap-2 text-black/80 text-sm mb-1">
                                    <span className="font-semibold">{m.name}</span>
                                    <span className={`text-xs ${m.completed ? 'text-green-400' : 'text-yellow-300'}`}>{m.completed ? 'Completed' : 'In Progress'}</span>
                                </div>
                            </div>
                        )) : <div className="text-muted-foreground text-sm">No milestones yet.</div>}
                        <Link href={`/portal/${projectId}/milestones`} className="text-primary text-xs mt-2 hover:underline">See all milestones</Link>
                    </CardContent>
                </Card>
            </div>

            {/* Dashboard Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recent Comments/Chat */}
                <Card className="bg-white">
                    <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="bg-white p-3 rounded-full"><MessageCircle className="w-7 h-7 text-primary" /></div>
                            <h2 className="text-xl font-semibold text-black mb-1">Recent Comments</h2>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentComments.length > 0 ? recentComments.map((c: any) => (
                            <div key={c.id} className="flex items-center gap-2 text-black text-sm mb-1">
                                <span className="font-semibold">{c.clientName || 'User'}:</span>
                                <span className="truncate max-w-xs">{c.content?.slice(0, 60)}</span>
                            </div>
                        )) : <div className="text-muted-foreground text-sm">No comments yet.</div>}
                        <Link href={`/portal/${projectId}/chat`} className="text-primary text-xs mt-2 hover:underline">Open chat</Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const FileBrowser = () => {
    const { folders, files, projectId } = useContext(ProjectContext);
    const searchParams = useSearchParams();
    const currentFolderId = searchParams?.get('folderId');
    const parentFolderId = searchParams?.get('parent');

    const getBackLink = () => {
        if (parentFolderId) {
            return `/portal/${projectId}?folderId=${parentFolderId}`;
        }
        return `/portal/${projectId}`;
    }

    return (
        <div className="p-4 sm:p-6">
         

            <h1 className="text-2xl font-semibold text-foreground mb-4">Files</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folders.map((folder: any) => (
                    <Link key={folder.id} href={`/portal/${projectId}?folderId=${folder.id}&parent=${currentFolderId}`}>
                        <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow-sm hover:bg-card/90 transition-colors aspect-square cursor-pointer">
                            <Folder className="w-12 h-12 text-primary mb-2" />
                            <span className="text-sm font-medium text-center truncate w-full">{folder.name}</span>
                        </div>
                    </Link>
                ))}
                {files.map((file: any) => (
                    <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-card rounded-lg shadow-sm hover:bg-card/90 transition-colors aspect-square">
                        <File className="w-12 h-12 text-primary mb-2" />
                        <span className="text-sm font-medium text-center truncate w-full">{file.name}</span>
                    </a>
                ))}
            </div>

            {(folders.length === 0 && files.length === 0) && (
                <div className="text-center text-muted-foreground mt-8">
                    <p>This folder is empty.</p>
                </div>
            )}
        </div>
    );
}

const PortalPage = () => {
  const { id: portalId } = useParams() as { id: string };
  const { data: session } = useSession();

  // Check if user is an active member
  const userEmail = session?.user?.email;

  const searchParams = useSearchParams();
  const currentFolderId = searchParams?.get('folderId');

  if (currentFolderId) {
    return <FileBrowser />;
  }

  return <Dashboard />;
};

export default PortalPage;
