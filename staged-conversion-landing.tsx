"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, Play, Users, Mail, MessageSquare, Star, Zap, DollarSign, Timer, Sparkles, X } from "lucide-react"
import Link from "next/link"

export default function StagedConversionLanding() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-4 z-50 w-full px-4">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="flex h-14 items-center justify-between px-6">
              <Link href="/" className="text-2xl font-bold">
                Staged
              </Link>
              <div className="flex items-center gap-3">
                <Button size="sm" className="hidden sm:inline-flex">
                  Start Free Trial
                </Button>
                <Button size="sm" className="sm:hidden">
                  Try Free
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-background to-background" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <Badge variant="secondary" className="mb-8 bg-green-50 text-green-700 hover:bg-green-100">
            <Sparkles className="mr-2 h-4 w-4" />
            Save 20+ hours per week
          </Badge>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Stop wasting time on
              <br />
              <span className="text-orange-500">repetitive tasks</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl">
              Let your AI agent handle the boring stuff while you focus on growing your business.
              <br />
              <span className="font-semibold">Setup takes 60 seconds. No coding required.</span>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Play className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              <Timer className="mr-2 h-5 w-5" />
              Watch 2-min Demo
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {["Free 14-day trial", "No credit card required", "Cancel anytime"].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-8 text-lg text-muted-foreground">
            <span className="font-semibold text-orange-500">2,847</span> founders already saving time with Staged
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { name: "Sarah", color: "bg-blue-500" },
              { name: "Marcus", color: "bg-green-500" },
              { name: "Jessica", color: "bg-purple-500" },
              { name: "David", color: "bg-red-500" },
              { name: "Alex", color: "bg-indigo-500" },
            ].map((user) => (
              <div key={user.name} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`${user.color} text-white text-xs font-bold`}>
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="border-t py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Why waste 20+ hours per week on tasks
              <br />a computer can do better?
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            {/* Manual Work */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-red-600">Manual Work</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Copy-paste data between apps",
                    description: "Waste hours every day on mindless data entry",
                  },
                  {
                    title: "Manually send follow-up emails",
                    description: "Risk missing important leads and opportunities",
                  },
                  {
                    title: "Update spreadsheets and reports",
                    description: "Prone to human error and inconsistencies",
                  },
                ].map((item, index) => (
                  <Card key={index} className="border-red-200 bg-red-50">
                    <CardContent className="flex gap-3 p-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500">
                        <X className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-red-800">{item.title}</p>
                        <p className="text-sm text-red-600">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* With Staged */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-green-600">With Staged</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Automatic data synchronization",
                    description: "AI handles all data transfers instantly and accurately",
                  },
                  {
                    title: "Smart email automation",
                    description: "Never miss a lead with intelligent follow-ups",
                  },
                  {
                    title: "Real-time reporting",
                    description: "Always-accurate data with zero manual work",
                  },
                ].map((item, index) => (
                  <Card key={index} className="border-green-200 bg-green-50">
                    <CardContent className="flex gap-3 p-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">{item.title}</p>
                        <p className="text-sm text-green-600">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-muted/50 py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Get your AI agent working in 3 steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Connect Your Apps",
                description:
                  "Link your existing tools in seconds. Works with Gmail, Slack, Salesforce, and 1000+ apps.",
                example: ["✓ Gmail connected", "✓ Slack connected", "✓ Salesforce connected"],
              },
              {
                step: "2",
                title: "Tell Your AI What to Do",
                description: "Use plain English to describe your workflows. No coding or complex setup required.",
                example: ['"When I get a new lead, add them to Salesforce and send a welcome email"'],
              },
              {
                step: "3",
                title: "Watch the Magic Happen",
                description: "Your AI agent works 24/7, handling tasks instantly and learning your preferences.",
                example: ["⚡ 47 tasks completed today", "⚡ 3.2 hours saved"],
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="mb-4 text-xl font-bold">{item.title}</h3>
                <p className="mb-6 text-muted-foreground">{item.description}</p>
                <Card>
                  <CardContent className="p-4 text-left">
                    {item.example.map((line, index) => (
                      <p key={index} className="text-sm font-mono text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">What founders are saying</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "I don't want to waste 3 hours every day on data entry and follow-ups. Staged solved this problem once and for all. The AI is incredibly smart.",
                author: "Sarah Chen",
                credential: "12.5K followers on LinkedIn",
                avatar: "S",
                color: "bg-blue-500",
              },
              {
                quote:
                  "My team was drowning in manual tasks. Staged gave us our time back. We're now focusing on growth instead of busy work.",
                author: "Marcus Rodriguez",
                credential: "8.3K followers on Twitter",
                avatar: "M",
                color: "bg-green-500",
              },
              {
                quote:
                  "The ROI is insane. I'm saving 25+ hours per week and my accuracy has improved dramatically. Best investment I've made for my business.",
                author: "Jessica Park",
                credential: "15.7K followers on LinkedIn",
                avatar: "J",
                color: "bg-purple-500",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">{testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className={`${testimonial.color} text-white font-bold`}>
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.credential}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-t bg-muted/50 py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-8 bg-orange-50 text-orange-700">
              <DollarSign className="mr-2 h-4 w-4" />
              Launch Special - 50% OFF
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Stop wasting time and money
              <br />
              on manual work
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
              Start automating your workflows today. No contracts, cancel anytime.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Starter Plan */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$29</span>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-lg">Perfect for solo entrepreneurs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {["1,000 automations per month", "20+ app integrations", "Email support", "Basic AI workflows"].map(
                    (feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ),
                  )}
                </ul>
                <Button className="w-full" variant="outline" size="lg">
                  Start 14-Day Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-2 border-orange-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-orange-500 text-white">Most Popular - 50% OFF</Badge>
              </div>
              <CardHeader className="pt-8 text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl text-muted-foreground line-through">$98</span>
                    <span className="text-5xl font-bold text-orange-500">$49</span>
                  </div>
                  <span className="text-lg text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-lg">For growing teams and businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {[
                    "Unlimited automations",
                    "1000+ app integrations",
                    "Priority support",
                    "Advanced AI + custom workflows",
                    "Team collaboration",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                  Start 14-Day Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-muted-foreground">
            No credit card required • Cancel anytime • 14-day money-back guarantee
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Frequently asked questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "How quickly can I start saving time?",
                answer:
                  "Most users see immediate results within 24 hours. Our AI agent starts working right after setup, and you'll notice significant time savings by the end of your first week.",
              },
              {
                question: "Do I need technical skills to use Staged?",
                answer:
                  "Not at all! Staged is designed for non-technical users. You describe what you want in plain English, and our AI handles the technical setup. No coding or complex configuration required.",
              },
              {
                question: "What if I'm not satisfied with the results?",
                answer:
                  "We offer a 14-day money-back guarantee. If you're not completely satisfied with the time savings and efficiency gains, we'll refund your money, no questions asked.",
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your automations will continue to work until the end of your billing period.",
              },
              {
                question: "Is my data secure with Staged?",
                answer:
                  "Absolutely. We use enterprise-grade encryption and comply with SOC 2 Type II standards. Your data is never shared with third parties, and all automations run in a secure, isolated environment.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`} className="rounded-lg border px-6">
                <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="pt-2 text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t bg-gradient-to-r from-orange-500 to-red-500 py-32 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Badge variant="secondary" className="mb-8 bg-white/20 text-white border-white/30">
            <Timer className="mr-2 h-4 w-4" />
            Limited Time Offer
          </Badge>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Ready to get your
              <br />
              time back?
            </h2>
            <p className="mx-auto max-w-3xl text-xl opacity-90 md:text-2xl">
              Join 2,847 founders who've already automated their way to freedom. Start your 14-day free trial today.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
              <Zap className="mr-2 h-5 w-5" />
              Start Free Trial Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm opacity-90">
            {["14-day free trial", "No credit card required", "Setup takes 60 seconds"].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Link href="/" className="text-3xl font-bold">
                Staged
              </Link>
              <p className="mt-4 max-w-sm text-muted-foreground">
                Automate your repetitive tasks with AI. Focus on growth, not busy work.
              </p>
              <div className="mt-6 flex gap-4">
                {[
                  { icon: Mail, href: "#" },
                  { icon: MessageSquare, href: "#" },
                  { icon: Users, href: "#" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "How It Works"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookies Policy"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 font-semibold">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8" />
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Staged. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
