import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle } from '@phosphor-icons/react'

interface TutorialStep {
  title: string
  description: string
  highlight?: string
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Farm Empire! 🌾",
    description: "Your goal: Build the ultimate farming empire by growing crops, researching technology, and automating your farm. Let's get started!",
  },
  {
    title: "Step 1: Plant Your First Crop",
    description: "Click any empty plot (green square) to plant a crop. Start with Wheat - it's cheap and grows fast! You'll earn gold and seeds when you harvest.",
  },
  {
    title: "Step 2: Watch It Grow",
    description: "Your crop will grow over time (shows a timer). When it's ready, click it again to harvest! You'll see resources added to the top bar.",
  },
  {
    title: "Step 3: Earn Research Points",
    description: "Some crops (like Tomato) give Research Points when harvested. Use Research to unlock new technologies in the Tech Tree tab.",
  },
  {
    title: "Step 4: Unlock Technologies",
    description: "Visit the Tech Tree tab to unlock new crops, buildings, and upgrades. Each tech costs Research Points and unlocks powerful features.",
  },
  {
    title: "Step 5: Build Automation",
    description: "Buildings like Wells and Windmills produce resources automatically! They're expensive but pay off over time. Place them on empty plots.",
  },
  {
    title: "You're Ready!",
    description: "Keep planting, harvesting, and researching. Your ultimate goal: Unlock the Master Farmer technology and become the world's greatest farmer! 🏆",
  },
]

interface TutorialOverlayProps {
  onComplete: () => void
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [open, setOpen] = useState(true)

  const currentTutorial = TUTORIAL_STEPS[currentStep]
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      setOpen(false)
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    setOpen(false)
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        handleSkip()
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {isLastStep ? <CheckCircle weight="fill" className="text-primary" /> : null}
            {currentTutorial.title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {currentTutorial.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </div>
          <div className="flex gap-2">
            {!isLastStep && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tutorial
              </Button>
            )}
            <Button onClick={handleNext} className="gap-2">
              {isLastStep ? 'Start Playing!' : 'Next'}
              {!isLastStep && <ArrowRight weight="bold" />}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-1 pt-2">
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
