'use client';

import { ArrowRight, BarChart, MessageSquare, Target } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b bg-white/80 p-4 px-8 backdrop-blur-sm">
        <h1 className="font-bold text-gray-900 text-xl">
          <Image alt="Staged" height={35} src="/logo.png" width={35} />
          Staged
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button>
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center bg-gray-50 pt-32 pb-24 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="font-bold text-4xl text-gray-900 tracking-tight md:text-5xl">
              A better way to manage client projects.
            </h2>
            <p className="mt-6 text-gray-600 text-lg">
              Staged provides a seamless, professional client portal to track
              progress, share updates, and communicate effortlessly. Impress
              your clients from day one.
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button className="px-8 py-7 text-lg" size="lg">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 text-center">
              <h3 className="font-bold text-3xl text-gray-900">
                Everything you need, nothing you don't.
              </h3>
              <p className="mt-4 text-gray-600">
                Powerful features designed for clarity and impact.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
              <div className="p-6">
                <Target className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
                <h4 className="font-semibold text-gray-900 text-lg">
                  Track Milestones
                </h4>
                <p className="mt-2 text-gray-600">
                  Keep projects on track with a clear, visual timeline of key
                  deliverables and deadlines.
                </p>
              </div>
              <div className="p-6">
                <BarChart className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
                <h4 className="font-semibold text-gray-900 text-lg">
                  Share Updates
                </h4>
                <p className="mt-2 text-gray-600">
                  Post rich-text updates to keep your clients informed and
                  engaged with project progress.
                </p>
              </div>
              <div className="p-6">
                <MessageSquare className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
                <h4 className="font-semibold text-gray-900 text-lg">
                  Seamless Communication
                </h4>
                <p className="mt-2 text-gray-600">
                  A dedicated space for comments and discussion, keeping all
                  communication in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Staged. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
