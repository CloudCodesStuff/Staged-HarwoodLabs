'use client';

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Building,
  CheckCircle2,
  Code,
  Crown,
  Database,
  Eye,
  Grip,
  Loader2,
  MessageSquare,
  Palette,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type React from 'react';
import { type JSX, useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { Command } from './ui/command';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

// Zod schemas for validation
const userInfoSchema = z.object({
  role: z.string().min(1, 'Please select your role'),
  company: z.string().optional(),
  teamSize: z.string().min(1, 'Please select your team size'),
  workflowStyle: z.string().min(1, 'Please select your workflow style'),
  primaryGoal: z.string().min(1, 'Please select your primary goal'),
});

type UserInfo = z.infer<typeof userInfoSchema>;

interface StepData {
  title: string;
  subtitle: string;
  description: string;
}

interface RoleOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TeamSizeOption {
  value: string;
  label: string;
  desc: string;
}

interface WorkflowOption {
  value: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GoalOption {
  value: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function OnboardingPage(): JSX.Element {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    role: '',
    company: '',
    teamSize: '',
    workflowStyle: '',
    primaryGoal: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>(
    {}
  );

  const userName: string = session?.user?.name?.split(' ')[0] ?? 'there';
  const userEmail: string | undefined = session?.user?.email ?? undefined;
  const isReturningUser: boolean = Boolean(session?.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: completeOnboarding } =
    api.user.completeOnboarding.useMutation({
      onSuccess: () => {
        window.location.href = '/dashboard';
      },
      onError: (error) => {
        console.error('Failed to complete onboarding:', error);
        setIsSubmitting(false);
      },
    });

  const handleComplete = async () => {
    setIsSubmitting(true);
    const result = userInfoSchema.safeParse(userInfo);
    if (result.success) {
      completeOnboarding(result.data);
    } else {
      // This should ideally not happen if button is disabled, but as a fallback
      console.error('Validation failed on final step:', result.error);
      setIsSubmitting(false);
    }
  };

  const steps: StepData[] = [
    {
      subtitle: "Welcome to Staged, let's get you set up.",
      title: `Hey ${userName}!`,
      description: '',
    },
    {
      title: 'About you',
      subtitle: '',
      description: 'Help us customize your experience',
    },
    {
      title: 'How you work',
      subtitle: '',
      description: 'What does your workflow style look like?',
    },
    {
      title: 'Your focus',
      subtitle: '',
      description: 'This helps us prioritize features that matter most',
    },
    {
      title: '',
      subtitle: '',
      description: '',
    },
  ];

  const roleOptions: RoleOption[] = [
    { value: 'product-manager', label: 'Product Manager', icon: Target },
    { value: 'engineering-manager', label: 'Engineering Manager', icon: Users },
    { value: 'developer', label: 'Developer', icon: Code },
    { value: 'designer', label: 'Designer', icon: Palette },
    { value: 'analyst', label: 'Data Analyst', icon: Database },
    { value: 'founder', label: 'Founder/CEO', icon: Crown },
    { value: 'other', label: 'Other', icon: User },
  ];

  const teamSizeOptions: TeamSizeOption[] = [
    { value: 'solo', label: 'Just me', desc: 'Individual contributor' },
    { value: 'small', label: '2-5 people', desc: 'Small team' },
    { value: 'medium', label: '6-20 people', desc: 'Medium team' },
    { value: 'large', label: '21-50 people', desc: 'Large team' },
    { value: 'enterprise', label: '50+', desc: 'Enterprise' },
    { value: '', label: '', desc: '' }, // Empty slot for 2x3 grid
  ];

  const workflowOptions: WorkflowOption[] = [
    {
      value: 'agile',
      label: 'Agile/Scrum',
      desc: 'Sprints & standups',
      icon: Zap,
    },
    {
      value: 'kanban',
      label: 'Kanban',
      desc: 'Visual flow boards',
      icon: Workflow,
    },
    {
      value: 'waterfall',
      label: 'Waterfall',
      desc: 'Sequential phases',
      icon: BarChart3,
    },
    {
      value: 'flexible',
      label: 'Flexible',
      desc: 'Hybrid approach',
      icon: Star,
    },
    { value: 'unsure', label: 'Other', desc: 'Anything else', icon: Grip },
  ];

  const goalOptions: GoalOption[] = [
    {
      value: 'productivity',
      label: 'Work smarter',
      desc: 'Automate busywork and get more done, faster',
      icon: TrendingUp,
    },
    {
      value: 'collaboration',
      label: 'Keep everyone aligned',
      desc: 'Streamline client and team communication',
      icon: MessageSquare,
    },
    {
      value: 'visibility',
      label: 'Stay on top of everything',
      desc: 'See where projects stand at a glance',
      icon: Eye,
    },
    {
      value: 'quality',
      label: 'Deliver better work',
      desc: 'Raise the bar on consistency and output',
      icon: CheckCircle2,
    },
  ];

  const validateCurrentStep = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};

    try {
      switch (currentStep) {
        case 1:
          userInfoSchema.pick({ role: true, teamSize: true }).parse({
            role: userInfo.role,
            teamSize: userInfo.teamSize,
          });
          break;
        case 2:
          userInfoSchema.pick({ workflowStyle: true }).parse({
            workflowStyle: userInfo.workflowStyle,
          });
          break;
        case 3:
          userInfoSchema.pick({ primaryGoal: true }).parse({
            primaryGoal: userInfo.primaryGoal,
          });
          break;
        default:
          return true;
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] as keyof UserInfo) {
            newErrors[err.path[0] as keyof UserInfo] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
  }, [currentStep, userInfo]);

  const handleContinue = useCallback((): void => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        window.location.href = '/dashboard';
      }
    }
  }, [currentStep, steps.length, validateCurrentStep]);

  const handleBack = useCallback((): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleContinue();
      } else if (event.key === 'ArrowLeft' && event.ctrlKey) {
        event.preventDefault();
        handleBack();
      } else if (event.key === 'ArrowRight' && event.ctrlKey) {
        event.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleContinue, handleBack]);

  const progress: number = ((currentStep + 1) / steps.length) * 100;

  const isStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return !!(userInfo.role && userInfo.teamSize);
      case 2:
        return !!userInfo.workflowStyle;
      case 3:
        return !!userInfo.primaryGoal;
      default:
        return true;
    }
  }, [currentStep, userInfo]);

  const updateUserInfo = useCallback((updates: Partial<UserInfo>): void => {
    setUserInfo((prev) => ({ ...prev, ...updates }));
    setErrors({});
  }, []);

  const getStepContent = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold text-base">
                <User className="h-4 w-4" />
                Role
              </Label>
              <Select
                onValueChange={(value: string) =>
                  updateUserInfo({ role: value })
                }
                value={userInfo.role}
              >
                <SelectTrigger
                  className={cn(
                    'h-12 text-left',
                    errors.role && 'border-destructive'
                  )}
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-destructive text-sm">{errors.role}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold text-base">
                <Building className="h-4 w-4" />
                Company{' '}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                className="h-12"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateUserInfo({ company: e.target.value })
                }
                placeholder="Company name"
                value={userInfo.company || ''}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold text-base">
                <Users className="h-4 w-4" />
                Team size
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {teamSizeOptions.slice(0, 5).map((option) => (
                  <Card
                    className={cn(
                      'flex aspect-square cursor-pointer items-center justify-center border-2 transition-all hover:border-primary/50',
                      userInfo.teamSize === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border',
                      errors.teamSize && 'border-destructive'
                    )}
                    key={option.value}
                    onClick={() => updateUserInfo({ teamSize: option.value })}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="mt-1 text-muted-foreground text-xs">
                        {option.desc}
                      </div>
                      {userInfo.teamSize === option.value && (
                        <CheckCircle2 className="mx-auto mt-2 h-4 w-4 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
                {/* Empty slot for 2x3 grid */}
                <div className="aspect-square" />
              </div>
              {errors.teamSize && (
                <p className="text-destructive text-sm">{errors.teamSize}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label className="flex items-center gap-2 font-semibold text-base">
              <Workflow className="h-4 w-4" />
              Workflow methodology
            </Label>
            <RadioGroup
              className="grid grid-cols-2 gap-3"
              onValueChange={(value: string) =>
                updateUserInfo({ workflowStyle: value })
              }
              value={userInfo.workflowStyle}
            >
              {workflowOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card
                    className={cn(
                      'aspect-square cursor-pointer border-2 transition-all hover:border-primary/50',
                      userInfo.workflowStyle === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border',
                      errors.workflowStyle && 'border-destructive'
                    )}
                    key={option.value}
                    onClick={() =>
                      updateUserInfo({ workflowStyle: option.value })
                    }
                  >
                    <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
                      <RadioGroupItem
                        className="sr-only"
                        value={option.value}
                      />
                      <div className="mb-2 rounded-lg bg-muted p-2">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="mt-1 text-muted-foreground text-xs">
                        {option.desc}
                      </div>
                      {userInfo.workflowStyle === option.value && (
                        <CheckCircle2 className="mt-2 h-4 w-4 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </RadioGroup>
            {errors.workflowStyle && (
              <p className="text-destructive text-sm">{errors.workflowStyle}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label className="flex items-center gap-2 font-semibold text-base">
              <Target className="h-4 w-4" />
              Primary goal
            </Label>
            <RadioGroup
              className="grid grid-cols-2 gap-3"
              onValueChange={(value: string) =>
                updateUserInfo({ primaryGoal: value })
              }
              value={userInfo.primaryGoal}
            >
              {goalOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card
                    className={cn(
                      'aspect-square cursor-pointer border-2 transition-all hover:border-primary/50',
                      userInfo.primaryGoal === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border',
                      errors.primaryGoal && 'border-destructive'
                    )}
                    key={option.value}
                    onClick={() =>
                      updateUserInfo({ primaryGoal: option.value })
                    }
                  >
                    <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
                      <RadioGroupItem
                        className="sr-only"
                        value={option.value}
                      />
                      <div className="mb-2 rounded-lg bg-muted p-2">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="mt-1 text-muted-foreground text-xs">
                        {option.desc}
                      </div>
                      {userInfo.primaryGoal === option.value && (
                        <CheckCircle2 className="mt-2 h-4 w-4 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </RadioGroup>
            {errors.primaryGoal && (
              <p className="text-destructive text-sm">{errors.primaryGoal}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">
                Ready to go, {userName}!
              </h3>
              <p className="text-muted-foreground">
                Your workspace is configured and ready
              </p>
            </div>
            <Card className="p-4 text-left">
              <div className="space-y-3 text-sm">
                {userInfo.role && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <Badge className="capitalize" variant="secondary">
                      {
                        roleOptions.find((r) => r.value === userInfo.role)
                          ?.label
                      }
                    </Badge>
                  </div>
                )}
                {userInfo.teamSize && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team</span>
                    <Badge variant="secondary">
                      {
                        teamSizeOptions.find(
                          (t) => t.value === userInfo.teamSize
                        )?.label
                      }
                    </Badge>
                  </div>
                )}
                {userInfo.workflowStyle && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Workflow</span>
                    <Badge variant="secondary">
                      {
                        workflowOptions.find(
                          (w) => w.value === userInfo.workflowStyle
                        )?.label
                      }
                    </Badge>
                  </div>
                )}
                {userInfo.primaryGoal && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Focus</span>
                    <Badge variant="secondary">
                      {
                        goalOptions.find(
                          (g) => g.value === userInfo.primaryGoal
                        )?.label
                      }
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex max-h-screen min-h-screen flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b p-4 lg:hidden">
        <div className="group flex items-center gap-2">
          <Link
            className="flex items-center gap-2 font-medium text-xl tracking-tight"
            href="/"
          >
            <Image
              alt="Staged"
              className="rotate-90 transition-transform duration-300 group-hover:rotate-[80deg]"
              height={35}
              src="/logo.png"
              width={35}
            />
            Staged
          </Link>
        </div>
        <div className="text-muted-foreground text-sm">
          {currentStep + 1} / {steps.length}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="container hidden flex-1 overflow-hidden lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Side - Branding */}
        <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex">
          <div className="group flex items-center gap-2">
            <Link
              className="flex items-center gap-2 font-medium text-xl tracking-tight"
              href="/"
            >
              <Image
                alt="Staged"
                className="rotate-90 transition-transform duration-300 group-hover:rotate-[80deg]"
                height={35}
                src="/logo.png"
                width={35}
              />
              Staged
            </Link>
          </div>

          <div className="relative z-20 mt-12">
            <div className="mb-3 flex items-center justify-between text-muted-foreground text-sm">
              <span className="font-medium">Setup Progress</span>
              <span>
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress className="h-2" value={progress} />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="r flex justify-center overflow-scroll p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="font-bold text-3xl tracking-tight">
                {steps?.[currentStep]?.title}
              </h1>
              <p className="text-muted-foreground text-xl">
                {steps?.[currentStep]?.subtitle}
              </p>
              <p className="text-muted-foreground text-sm">
                {steps?.[currentStep]?.description}
              </p>
            </div>

            <div>{getStepContent()}</div>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  className="flex-1"
                  onClick={handleBack}
                  size="lg"
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                className="flex-1"
                disabled={!isStepValid() || isSubmitting}
                onClick={
                  currentStep === steps.length - 1
                    ? handleComplete
                    : handleContinue
                }
                size="lg"
                variant="default"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Get Started
                    <ArrowRight className="" />
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        {/* Progress */}
        <div className="px-4 py-2">
          <Progress className="h-1" value={progress} />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between overflow-auto p-4">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="font-bold text-2xl tracking-tight">
                {steps[currentStep]?.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {steps[currentStep]?.subtitle}
              </p>
              <p className="text-muted-foreground text-sm">
                {steps[currentStep]?.description}
              </p>
            </div>

            <div>{getStepContent()}</div>
          </div>

          {/* Mobile Actions */}
          <div className="space-y-4 pt-6">
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  className="flex-1"
                  onClick={handleBack}
                  size="lg"
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                className="flex-1"
                disabled={!isStepValid() || isSubmitting}
                onClick={
                  currentStep === steps.length - 1
                    ? handleComplete
                    : handleContinue
                }
                size="lg"
                variant="default"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Get Started
                    <ArrowRight className="" />
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-xs">
                {currentStep === 0 && 'Takes less than a minute'}
                {/* {currentStep > 0 && currentStep < steps.length - 1 && "You can change these later"} */}
                {currentStep === steps.length - 1 && 'Ready to explore Staged'}
              </p>
              {currentStep === 0 && userEmail && (
                <p className="mt-1 text-muted-foreground text-xs">
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
