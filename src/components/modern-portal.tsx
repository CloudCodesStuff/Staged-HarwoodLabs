'use client';

import {
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  Send,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface PortalConfig {
  theme: 'minimal' | 'modern' | 'warm' | 'dark';
  layout: 'sidebar' | 'top-nav' | 'centered';
  primaryColor: string;
  accentColor: string;
  fontFamily: 'inter' | 'system' | 'serif';
  borderRadius: number;
  spacing: 'compact' | 'comfortable' | 'spacious';
  showProgress: boolean;
  showTimeline: boolean;
  showComments: boolean;
  showFiles: boolean;
  logoUrl: string;
  brandName: string;
}

interface ModernPortalProps {
  config: PortalConfig;
}

const project = {
  id: 'demo',
  name: 'Brand Identity Redesign',
  client: 'Acme Corporation',
  description:
    'Complete brand identity redesign including logo, typography, color palette, and brand guidelines for modern market positioning.',
  status: 'In Progress',
  progress: 75,
  startDate: 'Jan 10, 2024',
  dueDate: 'Feb 15, 2024',
  agency: 'Design Studio Pro',
};

const milestones = [
  {
    id: '1',
    title: 'Discovery & Research',
    description: 'Brand audit, competitor analysis, and market research',
    completed: true,
    completedDate: 'Jan 15, 2024',
    dueDate: 'Jan 15, 2024',
  },
  {
    id: '2',
    title: 'Logo Design Concepts',
    description: 'Initial logo concepts and design exploration',
    completed: true,
    completedDate: 'Jan 28, 2024',
    dueDate: 'Jan 30, 2024',
  },
  {
    id: '3',
    title: 'Brand Guidelines Development',
    description: 'Comprehensive brand style guide and usage guidelines',
    completed: false,
    completedDate: null,
    dueDate: 'Feb 10, 2024',
  },
  {
    id: '4',
    title: 'Final Brand Package',
    description: 'Complete brand assets and documentation delivery',
    completed: false,
    completedDate: null,
    dueDate: 'Feb 15, 2024',
  },
];

const files = [
  {
    id: '1',
    name: 'Brand_Audit_Report.pdf',
    type: 'document',
    size: '2.4 MB',
    uploadedAt: 'Jan 15, 2024',
    category: 'Research',
  },
  {
    id: '2',
    name: 'Logo_Concepts_v2.png',
    type: 'image',
    size: '1.8 MB',
    uploadedAt: 'Jan 28, 2024',
    category: 'Design',
  },
  {
    id: '3',
    name: 'Color_Palette_Final.pdf',
    type: 'document',
    size: '856 KB',
    uploadedAt: 'Feb 2, 2024',
    category: 'Design',
  },
];

const updates = [
  {
    id: '1',
    title: 'Logo concepts ready for review',
    content:
      "We've completed the initial logo concepts based on our discovery session. Please review the attached designs and share your feedback.",
    author: 'Design Team',
    date: 'Jan 28, 2024',
    important: true,
  },
  {
    id: '2',
    title: 'Brand audit completed',
    content:
      'The comprehensive brand audit has been completed. The report includes competitor analysis and market positioning insights.',
    author: 'Strategy Team',
    date: 'Jan 15, 2024',
    important: false,
  },
];

export function ModernPortal({ config }: ModernPortalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      content:
        'Love the direction of concept #2! Can we explore some variations with different color schemes?',
      author: 'Sarah Johnson',
      role: 'Marketing Director',
      date: 'Jan 29, 2024',
      avatar: 'SJ',
    },
    {
      id: '2',
      content:
        'The brand audit insights are very helpful. The competitor analysis section particularly resonated with our team.',
      author: 'Mike Chen',
      role: 'CEO',
      date: 'Jan 16, 2024',
      avatar: 'MC',
    },
  ]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      content: newComment,
      author: 'You',
      role: 'Client',
      date: new Date().toLocaleDateString(),
      avatar: 'YO',
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const completedMilestones = milestones.filter((m) => m.completed).length;
  const progressPercentage = (completedMilestones / milestones.length) * 100;

  const getThemeClasses = () => {
    switch (config.theme) {
      case 'minimal':
        return 'bg-white text-gray-900';
      case 'modern':
        return 'bg-slate-50 text-slate-900';
      case 'warm':
        return 'bg-orange-50 text-orange-900';
      case 'dark':
        return 'bg-gray-900 text-white';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const getSpacingClasses = () => {
    switch (config.spacing) {
      case 'compact':
        return 'space-y-4 p-4';
      case 'comfortable':
        return 'space-y-6 p-6';
      case 'spacious':
        return 'space-y-8 p-8';
      default:
        return 'space-y-6 p-6';
    }
  };

  const getFontClasses = () => {
    switch (config.fontFamily) {
      case 'inter':
        return 'font-sans';
      case 'system':
        return 'font-system';
      case 'serif':
        return 'font-serif';
      default:
        return 'font-sans';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} ${getFontClasses()}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-gray-200/50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {config.logoUrl ? (
                <img
                  alt="Logo"
                  className="h-10 w-10 rounded-lg object-cover"
                  src={config.logoUrl || '/placeholder.svg'}
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm text-white"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {config.brandName.charAt(0) || 'D'}
                </div>
              )}
              <div>
                <h1 className="font-semibold text-xl tracking-tight">
                  {project.name}
                </h1>
                <p className="text-gray-600 text-sm">
                  {config.brandName || project.agency}
                </p>
              </div>
            </div>
            <Badge
              className="px-3 py-1 font-medium text-xs"
              style={{
                backgroundColor: `${config.accentColor}20`,
                color: config.accentColor,
                border: `1px solid ${config.accentColor}30`,
              }}
            >
              {project.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className={getSpacingClasses()}>
          {/* Project Overview */}
          <Card style={{ borderRadius: `${config.borderRadius}px` }}>
            <CardContent className={getSpacingClasses()}>
              <div className="space-y-4">
                <div>
                  <h2 className="mb-2 font-semibold text-lg">
                    Project Overview
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Start Date
                    </p>
                    <p className="font-medium">{project.startDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Due Date
                    </p>
                    <p className="font-medium">{project.dueDate}</p>
                  </div>
                  {config.showProgress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-500 text-xs uppercase tracking-wide">
                          Progress
                        </p>
                        <span className="font-semibold text-sm">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <Progress
                        className="h-2"
                        style={{
                          backgroundColor: `${config.primaryColor}20`,
                        }}
                        value={progressPercentage}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card style={{ borderRadius: `${config.borderRadius}px` }}>
            <CardContent className={getSpacingClasses()}>
              <h2 className="mb-6 font-semibold text-lg">Project Milestones</h2>

              {config.showTimeline ? (
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div className="flex gap-4" key={milestone.id}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                            milestone.completed
                              ? 'text-white shadow-sm'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          style={{
                            backgroundColor: milestone.completed
                              ? config.primaryColor
                              : undefined,
                          }}
                        >
                          {milestone.completed ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        {index < milestones.length - 1 && (
                          <div
                            className={`mt-2 h-12 w-px ${milestone.completed ? 'opacity-30' : 'bg-gray-200'}`}
                            style={{
                              backgroundColor: milestone.completed
                                ? config.primaryColor
                                : undefined,
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-medium">{milestone.title}</h3>
                          {milestone.completed && (
                            <Badge
                              className="px-2 py-0.5 text-xs"
                              style={{
                                backgroundColor: `${config.primaryColor}15`,
                                color: config.primaryColor,
                              }}
                            >
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="mb-3 text-gray-600 text-sm">
                          {milestone.description}
                        </p>
                        <div className="flex items-center gap-4 text-gray-500 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {milestone.dueDate}</span>
                          </div>
                          {milestone.completed && milestone.completedDate && (
                            <div className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              <span>Completed: {milestone.completedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {milestones.map((milestone) => (
                    <div
                      className="flex items-center gap-4 rounded-lg border border-gray-100 p-4"
                      key={milestone.id}
                      style={{ borderRadius: `${config.borderRadius}px` }}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          milestone.completed
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        style={{
                          backgroundColor: milestone.completed
                            ? config.primaryColor
                            : undefined,
                        }}
                      >
                        {milestone.completed ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {milestone.description}
                        </p>
                      </div>
                      <div className="text-gray-500 text-xs">
                        {milestone.completed
                          ? milestone.completedDate
                          : milestone.dueDate}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Files */}
            {config.showFiles && (
              <Card style={{ borderRadius: `${config.borderRadius}px` }}>
                <CardContent className={getSpacingClasses()}>
                  <h2 className="mb-4 font-semibold text-lg">Project Files</h2>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        className="group flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:border-gray-200"
                        key={file.id}
                        style={{ borderRadius: `${config.borderRadius}px` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-gray-50 p-2">
                            <FileText className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>{file.uploadedAt}</span>
                              <Badge
                                className="px-1.5 py-0 text-xs"
                                variant="outline"
                              >
                                {file.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          size="sm"
                          variant="ghost"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Updates */}
            <Card style={{ borderRadius: `${config.borderRadius}px` }}>
              <CardContent className={getSpacingClasses()}>
                <h2 className="mb-4 font-semibold text-lg">Recent Updates</h2>
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div
                      className="border-l-2 pl-4"
                      key={update.id}
                      style={{
                        borderColor: update.important
                          ? config.accentColor
                          : '#e5e7eb',
                      }}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-medium text-sm">{update.title}</h3>
                        {update.important && (
                          <Badge
                            className="px-2 py-0 text-xs"
                            style={{
                              backgroundColor: `${config.accentColor}15`,
                              color: config.accentColor,
                            }}
                          >
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="mb-2 text-gray-600 text-sm">
                        {update.content}
                      </p>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <span>{update.author}</span>
                        <span>•</span>
                        <span>{update.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comments */}
          {config.showComments && (
            <Card style={{ borderRadius: `${config.borderRadius}px` }}>
              <CardContent className={getSpacingClasses()}>
                <h2 className="mb-6 font-semibold text-lg">
                  Comments & Feedback
                </h2>

                {/* Add Comment */}
                <div className="mb-8 space-y-4">
                  <Textarea
                    className="resize-none border-gray-200 focus:border-gray-300"
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your feedback or ask questions..."
                    rows={3}
                    style={{ borderRadius: `${config.borderRadius}px` }}
                    value={newComment}
                  />
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Attach File
                    </Button>
                    <Button
                      className="text-white hover:opacity-90"
                      disabled={!newComment.trim()}
                      onClick={handleAddComment}
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div className="flex gap-4" key={comment.id}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-100 font-medium text-xs">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {comment.author}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {comment.role}
                          </span>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-500 text-xs">
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
