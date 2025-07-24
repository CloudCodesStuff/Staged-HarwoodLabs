"use client";
import { useContext, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Folder as FolderIcon,
  ChevronRight,
  ChevronDown,
  FileText,
  ImageIcon,
  Link2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectContext } from "../layout";
import { Button } from "@/components/ui/button";

function isImage(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif|avif|heic|heif)$/i.test(url) ||
    url.startsWith("data:image/");
}

function getFileIcon(nameOrUrl: string) {
  if (isImage(nameOrUrl)) return <ImageIcon className="w-full h-full" />;
  if (/\.(pdf)$/i.test(nameOrUrl)) return <FileText className="w-full h-full" />;
  if (/drive\.google\.com/.test(nameOrUrl) || /dropbox\.com/.test(nameOrUrl)) return <Link2 className="w-full h-full" />;
  return <FileText className="w-full h-full" />;
}

type FileNode = {
  id: string;
  name: string;
  url: string;
  parentId: string | null;
  isFolder: false;
  createdAt?: string;
};

type FolderNode = {
  id: string;
  name: string;
  parentId: string | null;
  isFolder: true;
  createdAt?: string;
  children?: TreeNode[];
};

type TreeNode = FileNode | FolderNode;

function buildTree(
  folders: Omit<FolderNode, "children">[],
  files: FileNode[],
  parentId: string | null = null
): TreeNode[] {
  const children: TreeNode[] = [];

  folders
    .filter(f => f.parentId === parentId)
    .forEach(folder => {
      children.push({
        ...folder,
        children: buildTree(folders, files, folder.id)
      });
    });

  files
    .filter(f => f.parentId === parentId)
    .forEach(file => {
      children.push(file);
    });

  return children.sort((a, b) => {
    if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function FileTreeView({
  nodes,
  selectedId,
  onSelectNode
}: {
  nodes: TreeNode[];
  selectedId: string | null;
  onSelectNode: (node: TreeNode) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const renderNode = (node: TreeNode, level: number): React.ReactNode => {
    const isExpanded = expanded[node.id] || false;

    if (node.isFolder) {
      return (
        <div key={node.id}>
          <div
            className={cn(
              "flex items-center cursor-pointer py-1 px-2 rounded-md text-sm hover:bg-muted transition-colors duration-200",
              selectedId === node.id && "bg-muted font-semibold"
            )}
            style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
            onClick={() =>
              setExpanded(prev => ({
                ...prev,
                [node.id]: !isExpanded
              }))
            }
          >
            <span className="p-1 -ml-1">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
            <FolderIcon className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
            <span className="truncate" title={node.name}>
              {node.name}
            </span>
            <span className="ml-auto text-xs text-muted-foreground pr-2">{node.children?.length ?? 0}</span>
          </div>
          {isExpanded && node.children && (
            <div className="ml-4 border-l border-border">
              {node.children.map(child => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.id}
        className={cn(
          "flex items-center gap-1 rounded-md text-sm cursor-pointer py-1 px-2 hover:bg-muted transition-colors duration-200",
          selectedId === node.id && "bg-muted font-semibold"
        )}
        style={{ paddingLeft: `${level * 1.25 + 1.75}rem` }}
        onClick={() => onSelectNode(node)}
      >
        <span className="w-4 h-4">{getFileIcon(node.name)}</span>
        <span className="truncate ml-2" title={node.name}>
          {node.name}
        </span>
      </div>
    );
  };

  return <>{nodes.map(node => renderNode(node, 0))}</>;
}

function DetailsView({ node }: { node: TreeNode }) {
  if (node.isFolder) {
    const folder = node as FolderNode;
    const fileCount = folder.children?.filter(c => !c.isFolder).length ?? 0;
    const folderCount = folder.children?.filter(c => c.isFolder).length ?? 0;
    const totalItems = fileCount + folderCount;
    
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 py-12">
        <div className="relative mb-8">
          <div className="w-20 h-20 flex items-center justify-center" style={{ borderRadius: 'var(--radius)' }}>
            <FolderIcon className="w-9 h-9 text-blue-600" />
          </div>
          {totalItems > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">{totalItems}</span>
            </div>
          )}
        </div>
        
        <div className="text-center space-y-3 max-w-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 truncate" title={node.name} style={{ fontSize: 'calc(var(--text-size) * 1.2)' }}>
            {node.name}
          </h2>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600 leading-relaxed" style={{ fontSize: 'var(--text-size)' }}>
              {totalItems === 0 ? (
                "Empty folder"
              ) : (
                <>
                  {fileCount > 0 && (
                    <span className="font-medium text-gray-700">
                      {fileCount} {fileCount === 1 ? "file" : "files"}
                    </span>
                  )}
                  {fileCount > 0 && folderCount > 0 && (
                    <span className="text-gray-400 mx-2">•</span>
                  )}
                  {folderCount > 0 && (
                    <span className="font-medium text-gray-700">
                      {folderCount} {folderCount === 1 ? "folder" : "folders"}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const file = node as FileNode;
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 truncate mb-2" title={file.name}>
            {file.name}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium text-xs tracking-wide uppercase">
              {fileExtension}
            </span>
            <span className="text-gray-400">•</span>
            <span>Ready to download</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-gray-50/30">
        <div className="w-full max-w-2xl">
          {/* Preview Container */}
          <div className="relative mb-8">
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              {isImage(file.url) ? (
                <div className="relative w-full h-full group">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center mb-4" style={{ borderRadius: 'var(--radius)' }}>
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No preview available</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                    Preview is only available for image files. Use the download button to access this file.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-4">
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="group">
              <Button >
                <Download />
                Download File
              </Button>
            </a>
            
  
          </div>
        </div>
      </div>
    </div>
  );
}
export default function FilesPage() {
  const { files = [], folders = [] } = useContext(ProjectContext);
  const folderNodes = folders.map((f: any) => ({ ...f, isFolder: true }));
  const fileNodes = files.map((f: any) => ({ ...f, isFolder: false }));
  const tree = useMemo(() => buildTree(folderNodes, fileNodes), [folderNodes, fileNodes]);
  const [selected, setSelected] = useState<TreeNode | null>(null);

  return (
    <div className="flex flex-col max-w-6xl mx-auto h-full p-4 sm:p-6 lg:p-8">
      <header className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Files</h1>
            <p className="text-muted-foreground text-sm">Project documents and assets.</p>
          </div>
        </div>
      </header>
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <Card className="bg-white text-black">
          <div className="p-3 border-b border-border">
            <h2 className="font-medium text-base">Project Files</h2>
          </div>
          <div className="flex-grow overflow-y-auto px-2 py-1">
            {tree.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-8">No files or folders yet.</div>
            ) : (
              <FileTreeView nodes={tree} selectedId={selected?.id ?? null} onSelectNode={setSelected} />
            )}
          </div>
        </Card>
        <Card className="lg:col-span-2 bg-white text-black flex flex-col items-center justify-center  ">
          {!selected ? (
            <div className="text-center text-muted-foreground py-12 px-4">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-primary/10 rounded-full ">
                <FolderIcon className="w-10 h-10 text-black " />
              </div>
              <h3 className="text-lg font-semibold ">Select an item</h3>
              <p className="mt-1 text-sm">Choose a file or folder from the list to see its details.</p>
            </div>
          ) : (
            <DetailsView node={selected} />
          )}
        </Card>
      </div>
    </div>
  );
}
