'use client';

import {
  ArrowRight,
  Calendar,
  Check,
  Eye,
  FileText,
  MessageSquare,
  Star,
  Upload,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function StagedLanding() {
  return (
    <div className="relative mx-auto min-h-screen max-w-7xl border-x bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="px-6">
          <nav className="flex h-16 items-center justify-between">
            <Link className="font-semibold text-xl" href="/">
              Staged
            </Link>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-bold text-5xl text-gray-900 tracking-tight">
            Client portals that actually get used
          </h1>
          <p className="mt-6 text-gray-600 text-xl">
            Create beautiful project pages for your clients. Share milestones,
            files, and updates in one place. No more email chaos.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Start free trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/demo">View demo</Link>
            </Button>
          </div>

          <p className="mt-4 text-gray-500 text-sm">
            Free 14-day trial • No credit card required
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t bg-gray-50 py-16">
        <div className="px-6">
          <p className="mb-8 text-center text-gray-600 text-sm">
            Trusted by 500+ agencies worldwide
          </p>
          <div className="flex items-center justify-center gap-8">
            {[
              'Design Co',
              'Marketing Plus',
              'Dev Studio',
              'Brand Agency',
              'Creative Lab',
            ].map((company) => (
              <div className="font-medium text-gray-400" key={company}>
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl text-gray-900">
              Stop losing clients in email threads
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Your clients want transparency. Give them a professional way to
              track project progress.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-6 font-semibold text-gray-900 text-lg">
                Without Staged
              </h3>
              <div className="space-y-4">
                {[
                  'Clients constantly ask for project updates',
                  'Files scattered across email attachments',
                  'Missed deadlines due to poor communication',
                  'Clients feel left out of the process',
                ].map((problem) => (
                  <div className="flex items-start gap-3" key={problem}>
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <p className="text-gray-700">{problem}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-6 font-semibold text-gray-900 text-lg">
                With Staged
              </h3>
              <div className="space-y-4">
                {[
                  'Clients see real-time project progress',
                  'All files organized in one secure place',
                  'Clear milestones and deadlines',
                  'Professional client experience',
                ].map((solution) => (
                  <div className="flex items-start gap-3" key={solution}>
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <p className="text-gray-700">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-gray-50 py-24">
        <div className="px-6">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl text-gray-900">
              Everything your clients need in one place
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: 'Project Milestones',
                description:
                  "Visual timeline showing completed and upcoming milestones. Clients always know what's next.",
              },
              {
                icon: FileText,
                title: 'File Sharing',
                description:
                  'Secure file uploads and downloads. No more digging through email attachments.',
              },
              {
                icon: MessageSquare,
                title: 'Project Notes',
                description:
                  'Keep clients informed with project updates, meeting notes, and important announcements.',
              },
              {
                icon: Users,
                title: 'Team Access',
                description:
                  'Invite team members and stakeholders. Everyone stays on the same page.',
              },
              {
                icon: Eye,
                title: 'Client Approval',
                description:
                  'Get feedback and approvals directly on the platform. Streamline your review process.',
              },
              {
                icon: Upload,
                title: 'Easy Setup',
                description:
                  'Create a client portal in minutes. Use our templates or customize your own.',
              },
            ].map((feature) => (
              <Card className="border-gray-200" key={feature.title}>
                <CardContent className="p-6">
                  <feature.icon className="mb-4 h-8 w-8 text-gray-700" />
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl text-gray-900">
              Set up a client portal in 3 steps
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                step: '1',
                title: 'Create your project',
                description:
                  'Add project details, set milestones, and upload initial files.',
              },
              {
                step: '2',
                title: 'Invite your client',
                description:
                  'Send a secure link to your client. They can access everything instantly.',
              },
              {
                step: '3',
                title: 'Keep them updated',
                description:
                  'Update milestones, share files, and post notes as your project progresses.',
              },
            ].map((step) => (
              <div className="flex gap-6" key={step.step}>
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 font-semibold text-white">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t bg-gray-50 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl text-gray-900">
              What agencies are saying
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                quote:
                  "Our clients love seeing their project progress in real-time. It's eliminated 90% of status update emails.",
                author: 'Sarah Chen',
                title: 'Creative Director, Design Co',
                avatar: 'S',
              },
              {
                quote:
                  'Staged makes us look incredibly professional. Clients are impressed before we even start the work.',
                author: 'Mike Rodriguez',
                title: 'Founder, Dev Studio',
                avatar: 'M',
              },
            ].map((testimonial) => (
              <Card className="border-gray-200" key={testimonial.author}>
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        className="h-4 w-4 fill-gray-900 text-gray-900"
                        key={i}
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-gray-700">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-900 text-sm text-white">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Start free, upgrade when you need more projects
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl gap-8 md:grid-cols-2">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="font-bold text-3xl">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription>Perfect for trying out Staged</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-3">
                  {[
                    '1 active project',
                    'Unlimited clients',
                    'File sharing',
                    'Basic milestones',
                  ].map((feature) => (
                    <li className="flex items-center gap-3" key={feature}>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline">
                  Start free
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-900">
              <CardHeader>
                <CardTitle className="text-xl">Professional</CardTitle>
                <div className="mt-4">
                  <span className="font-bold text-3xl">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription>For growing agencies</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-3">
                  {[
                    'Unlimited projects',
                    'Custom branding',
                    'Advanced milestones',
                    'Priority support',
                  ].map((feature) => (
                    <li className="flex items-center gap-3" key={feature}>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" >Start 14-day trial</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-gray-50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-16 text-center">
            <h2 className="font-bold text-3xl text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <Accordion className="space-y-4" collapsible type="single">
            {[
              {
                question: 'How do clients access their portal?',
                answer:
                  'You send them a secure link. No signup required for clients - they can access everything instantly.',
              },
              {
                question: 'Can I customize the portal with my branding?',
                answer:
                  'Yes! Professional plans include custom branding options including your logo and colors.',
              },
              {
                question: 'What file types can I share?',
                answer:
                  'Any file type up to 100MB per file. Common formats like PDFs, images, videos, and documents are all supported.',
              },
              {
                question: 'Is there a limit on the number of clients?',
                answer:
                  'No limits on clients. You can invite as many stakeholders as needed to each project portal.',
              },
              {
                question: 'Can I try it before paying?',
                answer:
                  'Start with our free plan or try Professional free for 14 days. No credit card required.',
              },
            ].map((faq, index) => (
              <AccordionItem
                className="rounded-lg border border-gray-200 px-6"
                key={index}
                value={`item-${index + 1}`}
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pt-2 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-bold text-4xl text-gray-900">
            Ready to impress your clients?
          </h2>
          <p className="mt-6 text-gray-600 text-xl">
            Create your first client portal in under 5 minutes.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-gray-500 text-sm">
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link className="font-semibold text-xl" href="/">
                Staged
              </Link>
              <p className="mt-2 text-gray-600 text-sm">
                Professional client portals for agencies.
              </p>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Demo', 'Templates'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact'],
              },
              {
                title: 'Support',
                links: ['Help Center', 'API Docs', 'Status', 'Community'],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="mb-3 font-semibold text-gray-900">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        className="text-gray-600 text-sm hover:text-gray-900"
                        href="#"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />
          <div className="flex items-center justify-between text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Staged. All rights reserved.</p>
            <div className="flex gap-6">
              <Link className="hover:text-gray-900" href="#">
                Privacy
              </Link>
              <Link className="hover:text-gray-900" href="#">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
