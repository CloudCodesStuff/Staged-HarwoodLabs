'use client';

import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  Send,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

interface ClientPortalProps {
  primaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  textSize?: 'sm' | 'base' | 'lg';
  spacing?: 'tight' | 'normal' | 'loose';
  roundedness?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const project = {
  id: '1',
  name: 'Brand Redesign Project',
  client: 'Acme Corp',
  description:
    'Complete brand identity redesign including logo, colors, and brand guidelines for modern market positioning.',
  status: 'In Progress',
  progress: 75,
  startDate: 'Jan 10, 2024',
  dueDate: 'Feb 15, 2024',
  agency: 'Design Studio Pro',
  agencyLogo: 'D',
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
    name: 'Color_Palette_Options.pdf',
    type: 'document',
    size: '856 KB',
    uploadedAt: 'Feb 2, 2024',
    category: 'Design',
  },
  {
    id: '4',
    name: 'Typography_Samples.pdf',
    type: 'document',
    size: '1.2 MB',
    uploadedAt: 'Feb 5, 2024',
    category: 'Design',
  },
];

const updates = [
  {
    id: '1',
    title: 'Logo Concepts Ready for Review',
    content:
      "We've completed the initial logo concepts based on our discovery session. Please review the attached designs and let us know your thoughts. We're particularly excited about concepts #2 and #4.",
    author: 'Design Team',
    date: 'Jan 28, 2024',
    important: true,
  },
  {
    id: '2',
    title: 'Brand Audit Complete',
    content:
      'The comprehensive brand audit has been completed. The report includes competitor analysis, market positioning insights, and recommendations for your new brand direction.',
    author: 'Strategy Team',
    date: 'Jan 15, 2024',
    important: false,
  },
];

// Helper function to convert hex to OKLCH
function hexToOklch(hex: string): string {
  // Convert hex to RGB
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

  // Convert RGB to linear RGB
  const toLinear = (c: number) =>
    c <= 0.040_45 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);

  // Convert to XYZ (D65 illuminant)
  const x = 0.412_456_4 * rLin + 0.357_576_1 * gLin + 0.180_437_5 * bLin;
  const y = 0.212_672_9 * rLin + 0.715_152_2 * gLin + 0.072_175 * bLin;
  const z = 0.019_333_9 * rLin + 0.119_192 * gLin + 0.950_304_1 * bLin;

  // Convert XYZ to Lab
  const fx = x > 0.008_856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
  const fy = y > 0.008_856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
  const fz = z > 0.008_856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  // Convert Lab to LCH
  const C = Math.sqrt(a * a + bVal * bVal);
  let H = (Math.atan2(bVal, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  // Convert to OKLCH (approximation)
  const lightness = L / 100;
  const chroma = C / 100;
  const hue = H;

  return `${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)}`;
}

export default function Portal({
  primaryColor = '#000000',
  textColor = '#111827',
  backgroundColor = '#f9fafb',
  textSize = 'base',
  spacing = 'normal',
  roundedness = 'md',
}: ClientPortalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      content:
        'Love the direction of concept #2! Can we explore some variations with different color schemes?',
      author: 'Sarah Johnson',
      role: 'Marketing Director',
      date: 'Jan 29, 2024',
      avatar: 'S',
    },
    {
      id: '2',
      content:
        'The brand audit insights are very helpful. The competitor analysis section particularly resonated with our team.',
      author: 'Mike Chen',
      role: 'CEO',
      date: 'Jan 16, 2024',
      avatar: 'M',
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
      avatar: 'Y',
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const completedMilestones = milestones.filter((m) => m.completed).length;

  // Dynamic classes based on props
  const textSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  const spacingClasses = {
    tight: 'space-y-4',
    normal: 'space-y-6',
    loose: 'space-y-8',
  };

  const roundnessClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  const paddingClasses = {
    tight: 'p-3',
    normal: 'p-4',
    loose: 'p-6',
  };

  const gapClasses = {
    tight: 'gap-4',
    normal: 'gap-6',
    loose: 'gap-8',
  };

  // Convert hex to OKLCH for CSS custom properties
  const primaryOklch = hexToOklch(primaryColor);
  const primaryForeground = '0.985 0 0'; // White/light color for text on primary

  return (
    <div
      className="min-h-screen"
      style={
        {
          backgroundColor,
          color: textColor,
          '--primary': `oklch(${primaryOklch})`,
          '--primary-foreground': `oklch(${primaryForeground})`,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <div className="border-b bg-white">
        <div className={'mx-auto max-w-7xl px-6 py-4'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback className="bg-primary font-medium text-primary-foreground">
                  {project.agencyLogo}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1
                  className={`font-semibold text-xl ${textSizeClasses[textSize]}`}
                  style={{ color: textColor }}
                >
                  {project.name}
                </h1>
                <p className="text-gray-500 text-sm">{project.client}</p>
              </div>
            </div>
            <Badge
              className={`font-medium ${roundnessClasses[roundedness]}`}
              variant="secondary"
            >
              {project.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className={'mx-auto max-w-7xl px-6 py-8'}>
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 ${gapClasses[spacing]}`}
        >
          {/* Main Content */}
          <div className={`lg:col-span-2 ${spacingClasses[spacing]}`}>
            {/* Project Overview */}
            <Card className={` ${roundnessClasses[roundedness]}`}>
              <CardHeader className={`${paddingClasses[spacing]} pb-4`}>
                <CardTitle
                  className={` ${textSizeClasses[textSize]}`}
                  style={{ color: textColor }}
                >
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`${paddingClasses[spacing]} space-y-6 pt-0`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium" style={{ color: textColor }}>
                      {completedMilestones} of {milestones.length} milestones
                    </span>
                  </div>
                  <Progress
                    className="h-2"
                    value={(completedMilestones / milestones.length) * 100}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Started:</span>
                    <span className="font-medium" style={{ color: textColor }}>
                      {project.startDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Due:</span>
                    <span className="font-medium" style={{ color: textColor }}>
                      {project.dueDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className={` ${roundnessClasses[roundedness]}`}>
              <CardHeader className={`${paddingClasses[spacing]} `}>
                <CardTitle
                  className={`${textSizeClasses[textSize]}`}
                  style={{ color: textColor }}
                >
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className={`${paddingClasses[spacing]} pt-0`}>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div
                      className={`flex gap-4 border border-gray-100 p-4 transition-colors hover:border-gray-200 ${roundnessClasses[roundedness]}`}
                      key={milestone.id}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {milestone.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h4
                            className={`font-medium ${milestone.completed ? '' : 'text-gray-700'}`}
                            style={{
                              color: milestone.completed
                                ? textColor
                                : undefined,
                            }}
                          >
                            {milestone.title}
                          </h4>
                          <span className="ml-4 whitespace-nowrap text-gray-500 text-xs">
                            {milestone.completed
                              ? milestone.completedDate
                              : milestone.dueDate}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className={` ${roundnessClasses[roundedness]}`}>
              <CardHeader className={`${paddingClasses[spacing]} pb-4`}>
                <CardTitle
                  className={`${textSizeClasses[textSize]}`}
                  style={{ color: textColor }}
                >
                  Comments
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`${paddingClasses[spacing]} space-y-6 pt-0`}
              >
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    className={`min-h-[80px] resize-none border-gray-200 focus:border-gray-300 ${roundnessClasses[roundedness]}`}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    value={newComment}
                  />
                  <div className="flex justify-end">
                    <Button
                      disabled={!newComment.trim()}
                      onClick={handleAddComment}
                      size="sm"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Post Comment
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4 pt-2">
                  {comments.map((comment) => (
                    <div className="flex gap-3" key={comment.id}>
                      <Avatar className="h-8 w-8 bg-gray-100">
                        <AvatarFallback className="font-medium text-gray-600 text-xs">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className="font-medium text-sm"
                            style={{ color: textColor }}
                          >
                            {comment.author}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {comment.role}
                          </span>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-400 text-xs">
                            {comment.date}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className={spacingClasses[spacing]}>
            {/* Recent Updates */}
            <Card className={` ${roundnessClasses[roundedness]}`}>
              <CardHeader className={`${paddingClasses[spacing]} pb-4`}>
                <CardTitle
                  className={` ${textSizeClasses[textSize]}`}
                  style={{ color: textColor }}
                >
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent className={`${paddingClasses[spacing]} pt-0`}>
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div className="space-y-2" key={update.id}>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className="font-medium text-sm leading-tight"
                          style={{ color: textColor }}
                        >
                          {update.title}
                        </h4>
                        {update.important && (
                          <Badge className="text-xs" variant="secondary">
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {update.content}
                      </p>
                      <div className="flex items-center justify-between text-gray-400 text-xs">
                        <span>{update.author}</span>
                        <span>{update.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            <Card className={` ${roundnessClasses[roundedness]}`}>
              <CardHeader className={`${paddingClasses[spacing]}`}>
                <CardTitle
                  className={`${textSizeClasses[textSize]}`}
                  style={{ color: textColor }}
                >
                  Project Files
                </CardTitle>
              </CardHeader>
              <CardContent className={`${paddingClasses[spacing]} `}>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      className={`group flex items-center justify-between border border-gray-100 p-3 transition-colors hover:border-gray-200 ${roundnessClasses[roundedness]}`}
                      key={file.id}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate font-medium text-sm"
                            style={{ color: textColor }}
                          >
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>{file.uploadedAt}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
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
          </div>
        </div>

        {/* Powered by Staged */}
        <div className="mt-12 pt-8 ">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-md border p-2 text-gray-400 text-xs">
              <span>Powered by</span>
              <span className="font-semibold text-primary">Staged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
