'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Nav } from '../../components/nav';

// Mock data
const templates = [
  {
    id: '1',
    name: 'Brand Identity Project',
    description: 'Logo design, brand guidelines, and visual identity projects',
    category: 'Design',
    milestones: 4,
    usageCount: 45,
  },
  {
    id: '2',
    name: 'Website Development',
    description: 'Web development projects with client reviews and testing',
    category: 'Development',
    milestones: 5,
    usageCount: 32,
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Marketing campaigns from strategy to execution',
    category: 'Marketing',
    milestones: 4,
    usageCount: 28,
  },
  {
    id: '4',
    name: 'Photography Project',
    description: 'Photo shoots, event photography, and image delivery',
    category: 'Creative',
    milestones: 4,
    usageCount: 19,
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium text-xl tracking-tight">Templates</h1>
              <p className="mt-1 text-muted-foreground text-sm">
                Pre-built project templates
              </p>
            </div>
            <Button variant="outline">Create Template</Button>
          </div>

          {/* Templates */}
          <div className="grid grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="font-medium text-base">
                        {template.name}
                      </CardTitle>
                      <Badge className="text-xs" variant="secondary">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {template.description}
                  </p>

                  <Separator />

                  <div className="flex items-center justify-between text-muted-foreground text-xs">
                    <span>{template.milestones} milestones</span>
                    <span>Used {template.usageCount} times</span>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm" variant="outline">
                      Preview
                    </Button>
                    <Button className="flex-1" size="sm">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Custom Template */}
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-base">
                    Create Custom Template
                  </h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Build your own template based on your workflow
                  </p>
                </div>
                <Button>Create Template</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
