// components/testimonials.tsx

import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Jane Doe',
    role: 'Product Designer',
    image: '/avatars/jane.jpg',
    quote:
      'Staged has completely transformed how we prep our releases. It feels like magic.',
  },
  {
    name: 'Liam Tran',
    role: 'DevOps Engineer',
    image: '/avatars/liam.jpg',
    quote:
      'The minty UI and tight integration made onboarding dead simple. Incredible UX.',
  },
  {
    name: 'Liam Tran',
    role: 'DevOps Engineer',
    image: '/avatars/liam.jpg',
    quote:
      'The minty UI and tight integration made onboarding dead simple. Incredible UX.',
  },
];

const mainTestimonial = {
  name: 'Subha',
  role: 'KDS Group LLC',
  image: 'https://ui-avatars.com/api/?name=Subha&background=0D8ABC&color=fff',
  quote:
    'Staged made our client handoff process seamless. Our clients love having everything in one place, and we haven’t had a single client ask about project status since switching.',
};

export function SocialProofSection() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center justify-center bg-background py-10 px-4">
      {/* Main Testimonial */}
      <div className="space-y-8 text-center mb-12">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex gap-2 p-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <blockquote className="mx-auto mb-6 max-w-2xl font-medium text-2xl text-foreground sm:text-3xl">
            “{mainTestimonial.quote}”
          </blockquote>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-foreground text-lg">
              {mainTestimonial.name}
            </span>
            <span className="text-base text-muted-foreground">
              {mainTestimonial.role}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Testimonials */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-muted p-6">
            <CardContent className="flex flex-col items-center text-center space-y-4">
             
              <blockquote className="text-sm text-muted-foreground">
                “{testimonial.quote}”
              </blockquote>
              <div>
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
