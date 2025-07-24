'use client';

import {
  Eye,
  Layout,
  Monitor,
  Palette,
  Settings,
  Tablet,
  Type,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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

interface PortalCustomizerProps {
  config: PortalConfig;
  onConfigChange: (config: PortalConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

const themes = [
  { id: 'minimal', name: 'Minimal', colors: ['#000000', '#f8f9fa'] },
  { id: 'modern', name: 'Modern', colors: ['#2563eb', '#f1f5f9'] },
  { id: 'warm', name: 'Warm', colors: ['#ea580c', '#fef7ed'] },
  { id: 'dark', name: 'Dark', colors: ['#1f2937', '#111827'] },
];

const layouts = [
  { id: 'sidebar', name: 'Sidebar', icon: Layout },
  { id: 'top-nav', name: 'Top Navigation', icon: Monitor },
  { id: 'centered', name: 'Centered', icon: Tablet },
];

const fonts = [
  { id: 'inter', name: 'Inter', preview: 'Modern & Clean' },
  { id: 'system', name: 'System', preview: 'Native Feel' },
  { id: 'serif', name: 'Serif', preview: 'Traditional' },
];

export function PortalCustomizer({
  config,
  onConfigChange,
  isOpen,
  onClose,
}: PortalCustomizerProps) {
  const [activeTab, setActiveTab] = useState('theme');

  const updateConfig = (updates: Partial<PortalConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <Card className="max-h-[90vh] w-full max-w-4xl overflow-hidden border-0 shadow-2xl">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-gray-100 border-r bg-gray-50/50">
            <div className="border-gray-100 border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  Customize Portal
                </h2>
                <Button onClick={onClose} size="sm" variant="ghost">
                  ×
                </Button>
              </div>
            </div>

            <div className="space-y-1 p-4">
              {[
                { id: 'theme', label: 'Theme & Colors', icon: Palette },
                { id: 'layout', label: 'Layout', icon: Layout },
                { id: 'typography', label: 'Typography', icon: Type },
                { id: 'components', label: 'Components', icon: Settings },
                { id: 'branding', label: 'Branding', icon: Eye },
              ].map((tab) => (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  }`}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 font-medium text-gray-900">Theme</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {themes.map((theme) => (
                        <button
                          className={`rounded-xl border-2 p-4 transition-all ${
                            config.theme === theme.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          key={theme.id}
                          onClick={() =>
                            updateConfig({ theme: theme.id as any })
                          }
                        >
                          <div className="mb-2 flex gap-2">
                            {theme.colors.map((color, i) => (
                              <div
                                className="h-6 w-6 rounded-full border border-gray-200"
                                key={i}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <p className="text-left font-medium text-sm">
                            {theme.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-medium text-gray-900">
                      Custom Colors
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            className="h-10 w-12 border-gray-200 p-1"
                            onChange={(e) =>
                              updateConfig({ primaryColor: e.target.value })
                            }
                            type="color"
                            value={config.primaryColor}
                          />
                          <Input
                            className="flex-1"
                            onChange={(e) =>
                              updateConfig({ primaryColor: e.target.value })
                            }
                            value={config.primaryColor}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-2">
                          <Input
                            className="h-10 w-12 border-gray-200 p-1"
                            onChange={(e) =>
                              updateConfig({ accentColor: e.target.value })
                            }
                            type="color"
                            value={config.accentColor}
                          />
                          <Input
                            className="flex-1"
                            onChange={(e) =>
                              updateConfig({ accentColor: e.target.value })
                            }
                            value={config.accentColor}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 font-medium text-gray-900">
                      Layout Style
                    </h3>
                    <div className="space-y-3">
                      {layouts.map((layout) => (
                        <button
                          className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                            config.layout === layout.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          key={layout.id}
                          onClick={() =>
                            updateConfig({ layout: layout.id as any })
                          }
                        >
                          <layout.icon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium">{layout.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-medium text-gray-900">Spacing</h3>
                    <div className="space-y-3">
                      {[
                        {
                          id: 'compact',
                          name: 'Compact',
                          desc: 'Dense layout, more content',
                        },
                        {
                          id: 'comfortable',
                          name: 'Comfortable',
                          desc: 'Balanced spacing',
                        },
                        {
                          id: 'spacious',
                          name: 'Spacious',
                          desc: 'Generous whitespace',
                        },
                      ].map((spacing) => (
                        <button
                          className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                            config.spacing === spacing.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          key={spacing.id}
                          onClick={() =>
                            updateConfig({ spacing: spacing.id as any })
                          }
                        >
                          <div className="font-medium">{spacing.name}</div>
                          <div className="text-gray-600 text-sm">
                            {spacing.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 font-medium text-gray-900">
                      Font Family
                    </h3>
                    <div className="space-y-3">
                      {fonts.map((font) => (
                        <button
                          className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                            config.fontFamily === font.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          key={font.id}
                          onClick={() =>
                            updateConfig({ fontFamily: font.id as any })
                          }
                        >
                          <div className="font-medium">{font.name}</div>
                          <div className="text-gray-600 text-sm">
                            {font.preview}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 font-medium text-gray-900">
                      Border Radius
                    </h3>
                    <div className="space-y-3">
                      <input
                        className="w-full"
                        max="20"
                        min="0"
                        onChange={(e) =>
                          updateConfig({
                            borderRadius: Number.parseInt(e.target.value),
                          })
                        }
                        type="range"
                        value={config.borderRadius}
                      />
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Sharp</span>
                        <span>{config.borderRadius}px</span>
                        <span>Rounded</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'components' && (
                <div className="space-y-6">
                  <h3 className="font-medium text-gray-900">
                    Visible Components
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: 'showProgress',
                        label: 'Progress Bar',
                        desc: 'Show project completion percentage',
                      },
                      {
                        key: 'showTimeline',
                        label: 'Timeline View',
                        desc: 'Display milestones as timeline',
                      },
                      {
                        key: 'showComments',
                        label: 'Comments Section',
                        desc: 'Allow client feedback',
                      },
                      {
                        key: 'showFiles',
                        label: 'File Downloads',
                        desc: 'Show downloadable files',
                      },
                    ].map((component) => (
                      <div
                        className="flex items-center justify-between rounded-xl border border-gray-200 p-4"
                        key={component.key}
                      >
                        <div>
                          <div className="font-medium">{component.label}</div>
                          <div className="text-gray-600 text-sm">
                            {component.desc}
                          </div>
                        </div>
                        <Switch
                          checked={
                            config[
                              component.key as keyof PortalConfig
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            updateConfig({ [component.key]: checked })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Brand Name</Label>
                      <Input
                        className="mt-2"
                        onChange={(e) =>
                          updateConfig({ brandName: e.target.value })
                        }
                        placeholder="Your Company Name"
                        value={config.brandName}
                      />
                    </div>
                    <div>
                      <Label>Logo URL</Label>
                      <Input
                        className="mt-2"
                        onChange={(e) =>
                          updateConfig({ logoUrl: e.target.value })
                        }
                        placeholder="https://example.com/logo.png"
                        value={config.logoUrl}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-gray-100 border-t bg-gray-50/50 p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Changes saved automatically
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
