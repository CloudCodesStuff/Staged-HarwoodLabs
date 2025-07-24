import {
  Briefcase,
  Folder,
  ListChecks,
  MessageSquare,
  UploadCloud,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Briefcase,
    title: 'Client-Specific Portals',
    description:
      'Each client gets a dedicated portal for all project files, updates, and communication.',
  },
  {
    icon: UploadCloud,
    title: 'Link-Based File Sharing & Folders',
    description:
      'Share Google Drive, Dropbox, or other file links—organized in folders for clarity.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Client Chat',
    description:
      'Clients can chat and leave feedback directly on the portal. No more lost emails.',
  },
  {
    icon: ListChecks,
    title: 'Milestone Tracking',
    description:
      'Clients can view project milestones and see progress at a glance.',
  },
  {
    icon: Folder,
    title: 'No-Nonsense Interface',
    description:
      'Minimal, distraction-free design. No ads, no upsells, no unnecessary features—just what you and your clients need.',
  },
];

const FeatureGrid = () => (
  <section aria-label="Features" className="relative px-6 py-24" id="features">
    <div className="mx-auto max-w-7xl">
      <div className="mb-20 text-center">
        <h2 className="mb-6 font-head font-medium text-4xl sm:text-5xl">
          Built for real client work, not just file sharing.
        </h2>
        <p className="mx-auto max-w-3xl text-muted-foreground text-xl leading-relaxed">
          Staged gives you the tools to deliver projects, communicate, and keep
          clients in the loop—without the mess of email threads or scattered
          links.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            className="group hover:-translate-y-2 h-full bg-background/50 transition-all duration-500 hover:shadow-2xl"
            key={feature.title}
          >
            <CardContent className="p-8">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground transition-transform duration-300 group-hover:scale-110">
                <feature.icon aria-hidden="true" className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-bold text-foreground text-xl">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
