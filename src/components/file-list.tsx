'use client';

import {
  Archive,
  Calendar,
  Code,
  Download,
  ExternalLink,
  Eye,
  FileIcon,
  FileText,
  ImageIcon,
  Link2,
  Loader2,
  Music,
  Video,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { SupabaseFile } from '@/lib/supabaseFiles';
import { getSignedUrl, listFiles } from '@/lib/supabaseFiles';
import { cn } from '@/lib/utils';
import { FilePreviewModal } from './file-preview-modal';

interface FileLink {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size?: number;
  type?: string;
}

interface FileListProps {
  projectId: string;
}

// Enhanced file type detection and icons
const getFileIcon = (fileName: string, isLoading = false) => {
  if (isLoading)
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;

  const ext = fileName.toLowerCase().split('.').pop() || '';

  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return <ImageIcon className="h-5 w-5 text-blue-500" />;
  }
  if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext)) {
    return <Video className="h-5 w-5 text-purple-500" />;
  }
  if (['mp3', 'wav', 'flac', 'aac'].includes(ext)) {
    return <Music className="h-5 w-5 text-green-500" />;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return <Archive className="h-5 w-5 text-orange-500" />;
  }
  if (['js', 'ts', 'html', 'css', 'py', 'java', 'cpp'].includes(ext)) {
    return <Code className="h-5 w-5 text-indigo-500" />;
  }
  if (ext === 'pdf') {
    return <FileText className="h-5 w-5 text-red-500" />;
  }

  return <FileIcon className="h-5 w-5 text-gray-500" />;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
};

// Enhanced cloud service icons
const GoogleDriveIcon = () => (
  <svg className="flex-shrink-0" height="20" viewBox="0 0 48 48" width="20">
    <polygon fill="#0066DA" points="13.2,15.0 22.8,15.0 31.8,25.0 22.2,25.0" />
    <polygon fill="#00AC47" points="24.0,15.0 38.4,15.0 31.8,25.0 17.4,25.0" />
    <polygon fill="#EA4335" points="38.4,15.0 42.0,21.0 38.4,27.0 34.8,21.0" />
    <polygon fill="#00832D" points="13.2,15.0 9.6,21.0 13.2,27.0 16.8,21.0" />
    <polygon fill="#2684FC" points="9.6,21.0 24.0,33.0 38.4,21.0 24.0,15.0" />
  </svg>
);

const DropboxIcon = () => (
  <svg className="flex-shrink-0" height="20" viewBox="0 0 48 48" width="20">
    <path
      d="M24,4.5L12,12l12,7.5L36,12L24,4.5z M12,27l12,7.5L36,27L24,19.5L12,27z"
      fill="#0061FF"
    />
  </svg>
);

const getProviderInfo = (url: string) => {
  if (/drive\.google\.com/.test(url)) {
    return {
      icon: <GoogleDriveIcon />,
      name: 'Google Drive',
      color: 'bg-blue-50 text-blue-700',
    };
  }
  if (/dropbox\.com/.test(url)) {
    return {
      icon: <DropboxIcon />,
      name: 'Dropbox',
      color: 'bg-indigo-50 text-indigo-700',
    };
  }
  return {
    icon: <Link2 className="h-4 w-4" />,
    name: 'External Link',
    color: 'bg-gray-50 text-gray-700',
  };
};

// Loading skeleton component
const FileSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="flex items-center gap-4 p-4">
        <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>
    </CardContent>
  </Card>
);

export function FileList({ projectId }: FileListProps) {
  const [fileLinks, setFileLinks] = useState<FileLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/file-links?projectId=${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch file links');
      const data = await res.json();
      setFileLinks(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load file links');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <FileSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <div className="text-destructive text-sm">
              <p className="font-medium">Error loading files</p>
              <p className="mt-1">{error}</p>
              <Button
                className="mt-3"
                onClick={fetchLinks}
                size="sm"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (fileLinks.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Link2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 font-semibold text-lg text-muted-foreground">
              No file links added yet
            </h3>
            <p className="mx-auto max-w-md text-muted-foreground text-sm">
              Ask your provider to share Google Drive, Dropbox, or other file
              links to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Shared Files</h2>
        <Badge className="text-xs" variant="secondary">
          {fileLinks.length} {fileLinks.length === 1 ? 'file' : 'files'}
        </Badge>
      </div>

      {fileLinks.map((link) => (
        <FileCard key={link.id} link={link} />
      ))}
    </div>
  );
}

// Individual file card component
function FileCard({ link }: { link: FileLink }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isImage = useMemo(
    () => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(link.url),
    [link.url]
  );

  const provider = useMemo(() => getProviderInfo(link.url), [link.url]);

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        // For external links, open in new tab instead of downloading
        window.open(link.url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Failed to open link:', error);
      }
    },
    [link.url]
  );

  const handlePreview = useCallback(() => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  }, [link.url]);

  return (
    <Card className="group overflow-hidden border-0 shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 p-4">
          {/* Preview/Icon */}
          <div className="relative h-12 w-12 flex-shrink-0">
            {isImage && !imageError ? (
              <>
                <img
                  alt={link.name}
                  className={cn(
                    'h-full w-full rounded-lg object-cover transition-opacity duration-200',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onError={() => setImageError(true)}
                  onLoad={() => setImageLoaded(true)}
                  src={link.url}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted">
                {getFileIcon(link.name)}
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3
                className="flex-1 truncate font-medium text-sm"
                title={link.name}
              >
                {link.name}
              </h3>
              <Badge
                className={cn('px-2 py-0.5 text-xs', provider.color)}
                variant="secondary"
              >
                <span className="flex items-center gap-1">
                  {provider.icon}
                  {provider.name}
                </span>
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(link.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              {link.size && <span>{formatFileSize(link.size)}</span>}
            </div>

            <p className="mt-1 truncate text-muted-foreground text-xs">
              {link.url}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              className="opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handlePreview}
              size="sm"
              title="Preview"
              variant="ghost"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              className="opacity-60 transition-all hover:bg-primary hover:text-primary-foreground group-hover:opacity-100"
              onClick={handleDownload}
              size="sm"
              title="Open link"
              variant="ghost"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
