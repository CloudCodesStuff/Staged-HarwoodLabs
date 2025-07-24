"use client";
import React from "react";
import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";

// Shadcn
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Icons
import { X } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

// Confetti

export const TourCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  // Onborda hooks
  const { closeOnborda } = useOnborda();
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);
  // Confetti effect (simple)
  const [showConfetti, setShowConfetti] = React.useState(false);
  function handleFinish() {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      closeOnborda();
    }, 1200);
  }

  return (
    <AnimatePresence>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className="relative z-[999]"
      >
        <Card className="relative border-none min-w-[320px] max-w-xs sm:max-w-sm md:max-w-md bg-background shadow-xl rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{step.icon}</span>
                <div>
                  <CardDescription className="text-muted-foreground text-xs">
                    Step {currentStep + 1} of {totalSteps}
                  </CardDescription>
                  <CardTitle className="text-lg sm:text-xl text-foreground mt-1">
                    {step.title}
                  </CardTitle>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                size="icon"
                onClick={closeOnborda}
                aria-label="Close onboarding"
              >
                <X size={18} />
              </Button>
            </div>
            <Progress value={percent} className="mt-4 h-2 bg-accent" />
          </CardHeader>
          <CardContent className="text-foreground text-base py-4">
            {step.content}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="flex w-full justify-between gap-2">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 0}
                className="flex-1"
              >
                Previous
              </Button>
              {currentStep + 1 !== totalSteps ? (
                <Button onClick={nextStep} className="flex-1">
                  Next
                </Button>
              ) : (
                <Button onClick={handleFinish} className="flex-1 bg-gradient-to-r from-primary to-secondary text-white">
                  🎉 Finish!
                </Button>
              )}
            </div>
            <div className="flex justify-center mt-2">{arrow}</div>
          </CardFooter>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <span className="text-5xl animate-bounce">🎊</span>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};