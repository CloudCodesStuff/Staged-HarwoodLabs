'use client';

import type EditorJS from '@editorjs/editorjs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type EditorProps = {
  projectId: string;
  updateId: string | null;
};

export const Editor = ({ projectId, updateId }: EditorProps) => {
  const router = useRouter();
  const ref = useRef<EditorJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState('');

  const { data: updateData } = api.update.getById.useQuery(
    { id: updateId! },
    { enabled: !!updateId }
  );

  const { mutate: saveUpdate, isPending } = api.update.save.useMutation({
    onSuccess: (data) => {
      toast.success('Update saved successfully!');
      router.push(`/dashboard/projects/${projectId}`);
    },
    onError: (err) => {
      toast.error('Failed to save update. Please try again.');
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const List = (await import('@editorjs/list')).default;
    const Quote = (await import('@editorjs/quote')).default;
    const Paragraph = (await import('@editorjs/paragraph')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady: () => {
          ref.current = editor;
        },
        placeholder: 'Start writing your update here...',
        inlineToolbar: true,
        data: updateData?.content as any,
        tools: {
          header: Header,
          list: List,
          quote: Quote,
          paragraph: Paragraph,
        },
      });
    }
  }, [updateData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();
    }
    return () => {
      ref.current?.destroy();
      ref.current = null;
    };
  }, [isMounted, initializeEditor]);

  useEffect(() => {
    if (updateData) {
      setTitle(updateData.name);
    }
  }, [updateData]);

  const handleSave = async () => {
    if (!ref.current) return;

    if (!title.trim()) {
      toast.error('A title is required before saving.');
      return;
    }

    const savedData = await ref.current.save();

    saveUpdate({
      id: updateId,
      name: title,
      content: savedData as any,
      projectId,
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="">
      <div className="flex w-full justify-between">
        <Link href={`/dashboard/projects/${projectId}`}>
          <Button variant="outline">
            <ArrowLeft />
            Back to Project
          </Button>
        </Link>
        <Button disabled={isPending} onClick={handleSave}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? 'Saving...' : 'Save Update'}
        </Button>
      </div>
      <div className="prose prose-stone mx-auto w-full">
        <Input
          className="!border-0 !ring-0 !shadow-none focus:!ring-offset-0 mb-8 p-0 text-center font-semibold text-4xl tracking-tight placeholder:text-gray-300"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Update Title"
          required
          value={title}
        />
        <div className="min-h-[300px]" id="editor" />
      </div>
    </div>
  );
};
