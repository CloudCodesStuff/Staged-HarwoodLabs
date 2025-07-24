'use client';

import { Download, FileText, X } from 'lucide-react';
import type { SupabaseFile } from '@/lib/supabaseFiles';

interface FilePreviewModalProps {
  file: SupabaseFile;
  url: string;
  onClose: () => void;
}

export function FilePreviewModal({
  file,
  url,
  onClose,
}: FilePreviewModalProps) {
  const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = file.name.match(/\.pdf$/i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="truncate font-semibold text-lg">{file.name}</h3>
          <div className="flex items-center gap-2">
            <a
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
              download={file.name}
              href={url}
              title="Download"
            >
              <Download className="h-5 w-5" />
            </a>
            <button
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
              onClick={onClose}
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {isImage ? (
            <img
              alt={file.name}
              className="h-full w-full object-contain"
              src={url}
            />
          ) : isPdf ? (
            <iframe
              className="h-full w-full border-0"
              src={url}
              title={file.name}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-600">
              <FileText className="mb-4 h-16 w-16 text-gray-400" />
              <h4 className="font-semibold text-xl">Preview not available</h4>
              <p>You can download the file to view it on your device.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
