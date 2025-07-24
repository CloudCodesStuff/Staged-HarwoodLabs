"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { MessageCircle, Send, Loader2, FileText } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ProjectContext } from "../layout";
import { api } from "@/trpc/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const {
    project,
    isLoading,
    error,
    clientInfo,
    projectId,
    user,
    membership,
  } = useContext(ProjectContext as React.Context<any>);

  const [newComment, setNewComment] = useState("");
  const [optimisticComments, setOptimisticComments] = useState<any[]>([]);
  const lastLocalId = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();

  const createComment = api.comment.create.useMutation({
    onSuccess: () => {
      if (!lastLocalId.current) return;

      setOptimisticComments((prev) =>
        prev.map((msg) =>
          msg.localId === lastLocalId.current
            ? { ...msg, status: "sent" }
            : msg
        )
      );

      setNewComment("");
      utils.project.getForPortal.invalidate({ id: projectId });
      lastLocalId.current = null;
    },
    onError: () => {
      if (!lastLocalId.current) return;

      setOptimisticComments((prev) =>
        prev.map((msg) =>
          msg.localId === lastLocalId.current
            ? { ...msg, status: "failed" }
            : msg
        )
      );

      lastLocalId.current = null;
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project?.comments?.length, optimisticComments.length]);

  useEffect(() => {
    setOptimisticComments((prev) =>
      prev.filter(
        (opt) =>
          !project?.comments?.some(
            (c: any) =>
              c.content === opt.content &&
              Math.abs(
                new Date(c.createdAt).getTime() -
                  new Date(opt.createdAt).getTime()
              ) < 10000
          )
      )
    );
  }, [project?.comments]);

  // Determine sender info: prefer clientInfo, else use user/membership
  const senderName = clientInfo?.name || user?.name || membership?.role || "Member";
  const senderEmail = clientInfo?.email || user?.email || membership?.email || "";

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !senderName || !senderEmail) return;
    const localId = Math.random().toString(36).slice(2);
    lastLocalId.current = localId;
    const optimisticMsg = {
      id: localId,
      clientName: senderName,
      clientEmail: senderEmail,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      status: "sending",
      localId,
    };
    setOptimisticComments((prev) => [...prev, optimisticMsg]);
    createComment.mutate({
      projectId,
      clientName: senderName,
      clientEmail: senderEmail,
      content: newComment.trim(),
    });
    setNewComment("");
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Project not found or unauthorized.
      </div>
    );
  }

  const projectComments = Array.isArray(project.comments)
    ? project.comments
    : [];

  const allComments = [
    ...projectComments,
    ...optimisticComments.filter(
      (optComment) =>
        !projectComments.some(
          (projComment: any) =>
            projComment.content === optComment.content &&
            Math.abs(
              new Date(projComment.createdAt).getTime() -
                new Date(optComment.createdAt).getTime()
            ) < 10000
        )
    ),
  ].sort(
    (a: any, b: any) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="flex flex-col h-full p-4 max-w-6xl mx-auto sm:p-6 lg:p-8">
    <header className="mb-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center" style={{ borderRadius: 'var(--radius)' }}>
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground" style={{ fontSize: 'calc(var(--text-size) * 1.2)' }}>Chat</h1>
          <p className="text-muted-foreground text-sm" style={{ fontSize: 'var(--text-size)' }}>Speak with your project team.</p>
        </div>
      </div>
    </header>
    <Card className="h-full" style={{ borderRadius: 'var(--radius)' }}>
   
      <CardContent>
        <ScrollArea className="max-h-[500px]  flex-1 min-h-0 overflow-y-auto p-0 sm:p-4 space-y-4">
      <div className="flex flex-col gap-4">
        {allComments.length > 0 ? (
          allComments.map((comment: any) => {
            // Show 'You' for messages sent by the current user (by email)
            const isYou =
              (user?.email && comment.clientEmail === user.email) ||
              (membership?.email && comment.clientEmail === membership.email);
            const key = comment.id || comment.localId;

            return (
              <div
                key={key}
                className={cn(
                  "flex space-x-2",
                  isYou && "flex-row-reverse space-x-reverse"
                )}
              >
                {!isYou && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-gray-100 text-xs font-medium text-gray-600">
                      {comment.clientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex-1 max-w-lg rounded-xl px-4 py-2 text-base break-words shadow-sm",
                    isYou
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 text-gray-900"
                  )}
                  style={{ borderRadius: 'var(--radius)', fontSize: 'var(--text-size)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isYou
                          ? "text-primary-foreground"
                          : "text-gray-500"
                      )}
                    >
                      {isYou ? "You" : comment.clientName}
                    </span>
                    <span
                      className={cn(
                        "text-xs flex items-center gap-1",
                        isYou
                          ? "text-primary-foreground"
                          : "text-gray-400"
                      )}
                    >
                      {new Date(comment.createdAt).toLocaleDateString()}
                      {comment.status === "sending" && (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      )}
                      {comment.status === "failed" && (
                        <span className="ml-2 text-red-500 text-xs">
                          Failed
                        </span>
                      )}
                      {comment.status === "sent" && (
                        <span className="ml-2 text-green-500 text-xs">
                          Sent
                        </span>
                      )}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={bottomRef} />
        </div>
        </ScrollArea>
      </CardContent>

      <form
        onSubmit={handleCommentSubmit}
        className="flex items-center gap-2 border-t p-4 "
      >
        <Input
          className="w-full border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ borderRadius: 'var(--radius)', fontSize: 'var(--text-size)' }}
          placeholder="Type your message..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleCommentSubmit(e as any);
            }
          }}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!newComment.trim() || !senderName || !senderEmail || createComment.isPending}
        >
          {createComment.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </Card>
    </div>
  );
}
