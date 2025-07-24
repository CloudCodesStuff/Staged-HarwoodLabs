'use client';

import { ArrowRight } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HeroSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          AI Search: Find leads the way you think
          <ArrowRight className="h-3 w-3" />
        </div>

        {/* Headline */}
        <h1 className="mb-6 font-semibold text-4xl tracking-tight sm:text-5xl md:text-6xl">
          Step into the future
          <br />
          of sales: Human + AI
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
          Empower reps, uncover opportunities, and grow revenue with an
          all-in-one AI platform.
        </p>

        {/* Form */}
        <form
          className="mx-auto mb-8 flex max-w-md gap-2"
          onSubmit={handleSubmit}
        >
          <Input
            className="flex-1"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            type="email"
            value={email}
          />
          <Button type="submit">Get started</Button>
        </form>

        {/* Social proof */}
        <p className="text-muted-foreground text-sm">
          Trusted by 10,000+ sales teams worldwide
        </p>
      </div>
    </div>
  );
}
