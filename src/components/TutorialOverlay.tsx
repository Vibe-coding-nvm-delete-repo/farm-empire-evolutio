import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, X } from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'

interface TutorialStep {
  title: string
  description: string
  icon: string
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Farm Empire!",
    description: "Build your agricultural empire from scratch. Plant crops, raise animals, research technologies, and automate your farm. Let's learn the basics!",
    icon: "🌾",
  },
  {
    title: "Resources Explained",
    description: "Top bar shows your resources: Gold (buy things), Seeds (plant crops), Water (grow crops), Fertilizer (advanced crops), Energy (power buildings), and Research (unlock tech). More resources unlock as you progress!",
    icon: "💰",
  },
  {
    title: "Plant Your First Crop",
    description: "Click an empty plot (the + squares) to open the placement menu. Start with Wheat or Corn - they're cheap and grow fast. Crops show a progress bar as they grow.",
    icon: "🌱",
  },
  {
    title: "Harvest for Rewards",
    description: "When a crop is ready (shows ✨ READY ✨), click it to harvest! You'll earn resources instantly. Plant more crops to build up your supplies.",
    icon: "🌾",
  },
  {
    title: "Unlock Technologies",
    description: "Click the 'Tech' tab to see available technologies. Spend Research Points to unlock new crops, animals, buildings, and efficiency upgrades. Each unlock opens new possibilities!",
    icon: "🔬",
  },
  {
    title: "Build Automation",
    description: "Buildings produce resources automatically - no clicking needed! Wells make water, Windmills make energy. They cost gold but pay off over time by generating resources while you're away.",
    icon: "🏗️",
  },
  {
    title: "Raise Animals",
    description: "After unlocking animal tech, buy chickens, cows, sheep, and more! They need feeding but produce valuable goods like eggs, milk, and wool. Check the Animals tab in placement.",
    icon: "🐄",
  },
  {
    title: "Track Progress",
    description: "The 'Progress' tab shows ALL content in the game - every crop, animal, building, and tech organized by tier. Use it to plan your strategy! The 'Log' tab tracks all your actions.",
    icon: "✨",
  },
  {
    title: "Complete Achievements",
    description: "'Goals' tab shows achievements - complete them for bonus rewards! They range from 'Harvest your first crop' to 'Earn 100,000 gold'. Each tier gets harder but more rewarding.",
    icon: "🏆",
  },
  {
    title: "Pro Tips",
    description: "• Hover over anything for details\n• Build Wells/Windmills early for passive income\n• Balance crops between gold (profit) and research (unlocks)\n• Animals need regular feeding - keep hay stocked!\n• Higher tier items are more powerful",
    icon: "💡",
  },
  {
    title: "You're Ready!",
    description: "Start small, expand steadily, and work toward unlocking everything! Your goal: Complete all achievements, unlock Master Farmer tech, and build a thriving empire. Good luck, farmer! 🚜",
    icon: "🎯",
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
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentTutorial.icon}</span>
              <div>
                <DialogTitle className="text-xl">{currentTutorial.title}</DialogTitle>
                <DialogDescription className="text-xs">
                  Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="py-4">
            <p className="text-base leading-relaxed whitespace-pre-line">
              {currentTutorial.description}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-primary'
                      : index < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button onClick={handleNext}>
              {isLastStep ? (
                'Start Farming!'
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
