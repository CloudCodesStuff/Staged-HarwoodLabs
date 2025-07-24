"use client"

import { useState, useMemo, type FC, type ReactNode, useEffect } from "react";
import { toast } from "sonner";
import {
  FileText,
  ImageIcon,
  Download,
  Trash2,
  Plus,
  Loader2,
  Link2,
  Folder as FolderIcon,
  ChevronDown,
  ChevronRight,
  FileArchive,
  Music,
  Video,
  FileQuestion
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

// --- TYPE DEFINITIONS ---

type FileNode = {
  id: string;
  name: string;
  url: string;
  parentId: string | null;
  isFolder: false;
  createdAt: string;
};
type FolderNode = {
  id: string;
  name: string;
  parentId: string | null;
  isFolder: true;
  createdAt: string;
  children: TreeNode[];
};
type TreeNode = FileNode | FolderNode;

interface FileManagerProps {
  projectId: string;
}

// --- HELPER FUNCTIONS & COMPONENTS ---

/**
 * Enhanced image detection that works with various image formats and URLs
 */
function isImage(url: string): boolean {
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif|avif|heic|heif)$/i.test(url)) {
    return true;
  }
  if (
    url.includes("imgur.com") ||
    url.includes("cloudinary.com") ||
    url.includes("unsplash.com") ||
    url.includes("pexels.com") ||
    url.includes("pixabay.com") ||
    url.includes("images.unsplash.com") ||
    url.includes("res.cloudinary.com") ||
    url.includes("drive.google.com/uc?") ||
    (url.includes("dropbox.com") && url.includes("dl=1"))
  ) {
    return true;
  }
  if (url.startsWith("data:image/")) {
    return true;
  }
  return false;
}

/**
 * Returns a file-type-specific icon based on the file's name/URL.
 */
function getFileIcon(nameOrUrl: string): ReactNode {
  if (isImage(nameOrUrl)) return <ImageIcon />;
  if (/\.(pdf)$/i.test(nameOrUrl)) return <FileText />;
  if (/\.(zip|rar|7z)$/i.test(nameOrUrl)) return <FileArchive />;
  if (/\.(mp3|wav|ogg|flac|aac)$/i.test(nameOrUrl)) return <Music />;
  if (/\.(mp4|mov|avi|mkv|webm)$/i.test(nameOrUrl)) return <Video />;
  return <Link2 className="w-4 h-4" />;
}

/**
 * Recursively builds a tree structure from flat arrays of folders and files.
 */
function buildTree(
  folders: Omit<FolderNode, "children">[],
  files: FileNode[],
  parentId: string | null = null
): TreeNode[] {
  const children: TreeNode[] = [];
  folders.filter(f => f.parentId === parentId).forEach(folder => {
    children.push({
      ...folder,
      isFolder: true,
      children: buildTree(folders, files, folder.id)
    });
  });
  files.filter(f => f.parentId === parentId).forEach(file => {
    children.push({ ...file, isFolder: false });
  });
  return children.sort((a, b) => {
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

// --- ANIMATED COMPONENTS ---

/**
 * Animated wrapper for tree nodes
 */
const AnimatedTreeNode: FC<{
  children: ReactNode;
  nodeId: string;
  isRemoving?: boolean;
}> = ({ children, nodeId, isRemoving = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isRemoving) {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isRemoving]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out overflow-hidden",
        isVisible
          ? "opacity-100 translate-x-0 max-h-96"
          : "opacity-0 -translate-x-4 max-h-0"
      )}
      style={{
        transitionProperty: "opacity, transform, max-height, margin"
      }}
    >
      {children}
    </div>
  );
};

// --- UI SUB-COMPONENTS ---

/**
 * Renders the file and folder tree view, memoized for performance.
 */
const FileTreeView = React.memo(function FileTreeView({
  nodes,
  selectedId,
  onSelectNode,
  removingIds = new Set()
}: {
  nodes: TreeNode[];
  selectedId: string | null;
  onSelectNode: (node: TreeNode) => void;
  removingIds?: Set<string>;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const renderNode = (node: TreeNode, level: number): ReactNode => {
    const isExpanded = expanded[node.id] || false;
    const isRemoving = removingIds.has(node.id);

    if (node.isFolder) {
      return (
        <AnimatedTreeNode key={node.id} nodeId={node.id} isRemoving={isRemoving}>
          <div>
            <div
              className={cn(
                "flex items-center cursor-pointer py-1.5 px-2 rounded-md text-sm hover:bg-muted transition-colors duration-200",
                selectedId === node.id && "bg-muted font-semibold"
              )}
              style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
              onClick={() => onSelectNode(node)}
            >
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(p => ({ ...p, [node.id]: !isExpanded }));
                }}
                className="p-1 -ml-1"
              >
                <ChevronRight
                  className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-90")}
                />
              </span>
              <FolderIcon className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
              <span className="truncate" title={node.name}>
                {node.name}
              </span>
            </div>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              {node.children.map(child => renderNode(child, level + 1))}
            </div>
          </div>
        </AnimatedTreeNode>
      );
    }

    return (
      <AnimatedTreeNode key={node.id} nodeId={node.id} isRemoving={isRemoving}>
        <div
          className={cn(
            "flex items-center gap-1 rounded-md text-sm cursor-pointer py-1.5 px-2 hover:bg-muted transition-colors duration-200",
            selectedId === node.id && "bg-muted font-semibold"
          )}
          style={{ paddingLeft: `${level * 1.25 + 1.75}rem` }}
          onClick={() => onSelectNode(node)}
        >
          <span>{getFileIcon(node.name)}</span>
          <span className="truncate" title={node.name}>
            {node.name}
          </span>
        </div>
      </AnimatedTreeNode>
    );
  };

  return <>{nodes.map(node => renderNode(node, 0))}</>;
});

/**
 * Enhanced image component with loading states and error handling
 */
const ImagePreview: FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {!error ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-contain rounded-lg transition-opacity duration-300",
            loading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground p-8 text-center">
          <ImageIcon className="w-24 h-24 opacity-30" />
          <span className="mt-4 text-lg font-medium">Image failed to load</span>
          <span className="text-sm max-w-xs truncate">{alt}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Renders the details view for the selected item.
 */
const DetailsView: FC<{
  node: TreeNode;
  onDelete: (node: TreeNode) => void;
  isDeleting: boolean;
}> = ({ node, onDelete, isDeleting }) => {
  const renderPreview = () => {
    if (node.isFolder) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <FolderIcon className="w-24 h-24 opacity-20" />
          <span className="mt-4 text-lg font-medium">{node.name}</span>
          <span className="text-sm">This is a folder.</span>
        </div>
      );
    }
    if (isImage(node.url)) {
      return <ImagePreview src={node.url} alt={node.name} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground p-8 text-center">
        <FileQuestion className="w-24 h-24 opacity-30" />
        <span className="text-lg font-medium">No preview available</span>
        <a href={node.url} target="_blank" rel="noopener noreferrer">
          <Button asChild size="sm" className="mt-6">
            <Download /> Open File
          </Button>
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-muted/50 rounded-lg relative animate-in fade-in-50 duration-300">
      <header className="flex items-center p-3 border-b bg-background rounded-t-lg">
        <div className="flex items-center gap-2 truncate flex-1">
          <span className="w-5 h-5 text-primary flex-shrink-0">
            {node.isFolder ? <FolderIcon /> : getFileIcon(node.name)}
          </span>
          <span className="font-semibold truncate" title={node.name}>
            {node.name}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {!node.isFolder && (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a href={node.url} target="_blank" rel="noopener noreferrer" title="Open in new tab">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(node)}
            disabled={isDeleting}
            title={node.isFolder ? "Delete folder" : "Delete file"}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 relative">{renderPreview()}</main>
      <footer className="text-xs text-center p-2 border-t text-muted-foreground">
        {node.isFolder ? "Created" : "Added"}:{" "}
        {new Date(node.createdAt).toLocaleDateString()}
      </footer>
    </div>
  );
};

// --- MAIN COMPONENT ---

export function FileManager({ projectId }: FileManagerProps) {
  const { data: session } = useSession();
  const isPro = session?.user?.stripeSubscriptionStatus === "active";
  const [selected, setSelected] = useState<TreeNode | null>(null);
  const [nodeToDelete, setNodeToDelete] = useState<TreeNode | null>(null);
  const [dialogOpen, setDialogOpen] = useState<"file" | "folder" | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const utils = api.useUtils();
  const foldersQuery = api.fileLink.listFolders.useQuery({ projectId });
  const filesQuery = api.fileLink.listFiles.useQuery({ projectId });

  const refreshQueries = () => utils.invalidate();

  const createFolder = api.fileLink.create.useMutation({
    onSuccess: () => {
      toast.success("Folder created!");
      refreshQueries();
      setDialogOpen(null);
      setNewItemName("");
    },
    onError: (e: any) => {
      console.error("Create folder error:", e);
      toast.error(e?.data?.code === "FORBIDDEN"
        ? "You are not allowed to create folders in this project."
        : "Failed to create folder. Please try again.");
    }
  });

  const createFile = api.fileLink.create.useMutation({
    onSuccess: () => {
      toast.success("File link added!");
      refreshQueries();
      setDialogOpen(null);
      setNewItemName("");
      setNewItemUrl("");
    },
    onError: (e: any) => {
      console.error("Create file error:", e);
      toast.error(e?.data?.code === "FORBIDDEN"
        ? "File limit reached or you are not allowed to add files."
        : "Failed to add file. Please try again.");
    }
  });

  const deleteMutation = api.fileLink.delete.useMutation({
    onMutate: ({ id }: { id: string }) => {
      setRemovingIds((prev) => new Set(prev).add(id));
    },
    onSuccess: () => {
      toast.success("Deleted!");
      refreshQueries();
      setNodeToDelete(null);
      setSelected(null);
      setTimeout(() => setRemovingIds(new Set()), 300);
    },
    onError: (e: any) => {
      console.error("Delete error:", e);
      toast.error(e?.data?.code === "NOT_FOUND"
        ? "Item not found or already deleted."
        : "Failed to delete. Please try again.");
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        if (nodeToDelete) newSet.delete(nodeToDelete.id);
        return newSet;
      });
    }
  });

  const tree = useMemo(() => {
    if (!foldersQuery.data || !filesQuery.data) return [];
    const folders = foldersQuery.data.map((f) => ({
      ...f,
      isFolder: true as const,
      createdAt: f.createdAt.toISOString(),
      parentId: f.parentId ?? null
    }));
    const files = filesQuery.data.map((f) => ({
      ...f,
      isFolder: false as const,
      createdAt: f.createdAt.toISOString(),
      parentId: f.parentId ?? null
    }));
    return buildTree(folders, files);
  }, [foldersQuery.data, filesQuery.data]);

  const fileCount = filesQuery.data?.length ?? 0;
  const fileLimit = isPro ? 25 : 3;
  const atFileLimit = fileCount >= fileLimit;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dialogOpen === "file") {
      if (!newItemName.trim() || !newItemUrl.trim() || atFileLimit) return;
      await createFile.mutateAsync({
        projectId,
        name: newItemName,
        url: newItemUrl || "file://",
        parentId: selected?.isFolder ? selected.id : undefined,
        isFolder: false,
      });
    } else if (dialogOpen === "folder") {
      if (!newItemName.trim()) return;
      await createFolder.mutateAsync({
        projectId,
        name: newItemName,
        url: "folder://",
        parentId: selected?.isFolder ? selected.id : undefined,
        isFolder: true,
      });
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!nodeToDelete) return;
    await deleteMutation.mutateAsync({ id: nodeToDelete.id });
  };

  const isMutating =
    createFolder.isPending ||
    createFile.isPending ||
    deleteMutation.isPending;
  const isDeletingSelected =
    deleteMutation.isPending &&
    selected?.id === nodeToDelete?.id;

  return (
    <TooltipProvider>
      <Card
        className="p-4 flex gap-4 flex-row justify-between max-w-6xl mx-auto"
        style={{ minHeight: "70vh" }}
      >
        {/* --- Left Panel: File Tree --- */}
        <aside className="w-1/3 max-w-xs border-r pr-3 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-semibold text-lg">Files</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs font-mono bg-muted text-muted-foreground rounded px-2 py-1 cursor-help">
                  {fileCount}/{isPro ? "∞" : fileLimit}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isPro ? "Unlimited files with Studio plan." : "Upgrade to Studio for unlimited files."}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-2 mb-3 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDialogOpen("file")}
                    disabled={atFileLimit}
                    className="w-full"
                    tabIndex={0}
                  >
                    <Plus className="h-4 w-4 mr-2" /> File
                  </Button>
                </span>
              </TooltipTrigger>
              {atFileLimit && !isPro && (
                <TooltipContent side="top">
                  Upgrade to Studio for unlimited files.
                </TooltipContent>
              )}
            </Tooltip>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDialogOpen("folder")}
              className="flex-1"
            >
              <FolderIcon className="h-4 w-4 mr-2" /> Folder
            </Button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {foldersQuery.isLoading || filesQuery.isLoading ? (
              <div className="space-y-2 p-1">
                {[...Array(8)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-7 w-full"
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  />
                ))}
              </div>
            ) : tree.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm pt-12">
                No files or folders.
              </div>
            ) : (
              <FileTreeView
                nodes={tree}
                selectedId={selected?.id ?? null}
                onSelectNode={setSelected}
                removingIds={removingIds}
              />
            )}
          </div>
        </aside>

        {/* --- Right Panel: Details View --- */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {!selected ? (
            <div className="text-muted-foreground text-center animate-in fade-in-50 duration-500">
              <FileText className="mx-auto h-16 w-16 opacity-10" />
              <p className="mt-4 text-sm">Select a file or folder to view it here.</p>
            </div>
          ) : (
            <DetailsView node={selected} onDelete={setNodeToDelete} isDeleting={isDeletingSelected} />
          )}
        </div>

        {/* --- Dialogs --- */}
        <Dialog open={!!dialogOpen} onOpenChange={(isOpen) => !isOpen && setDialogOpen(null)}>
          <DialogContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {dialogOpen === "folder" ? "Create New Folder" : "Add a New File"}
                </DialogTitle>
                <DialogDescription>
                  Adding to:{" "}
                  <span className="font-semibold text-primary">
                    {selected?.isFolder ? selected.name : "Root Directory"}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Label htmlFor="itemName">
                  {dialogOpen === "folder" ? "Folder Name" : "File Name"}
                </Label>
                <Input
                  id="itemName"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={
                    dialogOpen === "folder"
                      ? "e.g., Project Resources"
                      : "e.g., Design Mockup.png"
                  }
                />
                {dialogOpen === "file" && (
                  <>
                    <Label htmlFor="fileUrl">Shareable URL</Label>
                    <Input
                      id="fileUrl"
                      value={newItemUrl}
                      onChange={(e) => setNewItemUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isMutating}>
                  {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {dialogOpen === "folder" ? "Create Folder" : "Add File"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!nodeToDelete} onOpenChange={(isOpen) => !isOpen && setNodeToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete{" "}
                <span className="font-semibold text-foreground">{nodeToDelete?.name}</span>.
                {nodeToDelete?.isFolder &&
                  " All contents within this folder will also be deleted."}{" "}
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setNodeToDelete(null)} disabled={isMutating}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirmed} disabled={isMutating}>
                {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}
