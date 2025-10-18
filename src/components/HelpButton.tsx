import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Question } from '@phosphor-icons/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
      >
        <Question weight="bold" className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">How to Play Farm Empire</DialogTitle>
            <DialogDescription>
              Quick reference guide for all game mechanics
            </DialogDescription>
          </DialogHeader>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basics">
              <AccordionTrigger className="text-lg font-semibold">
                🌱 The Basics
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-2">
                <p><strong>Goal:</strong> Build the ultimate farming empire by unlocking all technologies and maximizing your farm's productivity.</p>
                <p><strong>How to play:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Click empty plots to plant crops or build structures</li>
                  <li>Click grown crops (timer at 0:00) to harvest them</li>
                  <li>Earn resources from harvesting to plant more crops</li>
                  <li>Use Research Points to unlock new technologies</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="resources">
              <AccordionTrigger className="text-lg font-semibold">
                💰 Resources Explained
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-2">
                <ul className="space-y-2">
                  <li><strong>Gold:</strong> Main currency. Used to buy buildings and unlock plots.</li>
                  <li><strong>Seeds:</strong> Required to plant crops. Earned from harvesting.</li>
                  <li><strong>Water:</strong> Needed for growing crops. Build Wells to generate more.</li>
                  <li><strong>Fertilizer:</strong> Required for advanced crops. Build Compost Heaps.</li>
                  <li><strong>Energy:</strong> Powers buildings. Build Windmills to generate energy.</li>
                  <li><strong>Research:</strong> Unlocks technologies. Earned from special crops and labs.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="crops">
              <AccordionTrigger className="text-lg font-semibold">
                🌾 Crop Strategy
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-2">
                <p><strong>Wheat & Corn:</strong> Start here! Fast growing, low cost, good for building resources.</p>
                <p><strong>Tomato:</strong> Unlock with research. Gives Research Points for unlocking more tech.</p>
                <p><strong>Advanced Crops:</strong> Higher cost but much better rewards. Unlock via Tech Tree.</p>
                <p><strong>Pro Tip:</strong> Plant cheap crops early, then transition to high-value crops as you unlock automation buildings.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="buildings">
              <AccordionTrigger className="text-lg font-semibold">
                🏗️ Buildings & Automation
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-2">
                <p>Buildings produce resources automatically over time:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Well:</strong> Produces water. Your first automation building!</li>
                  <li><strong>Windmill:</strong> Generates energy for other buildings.</li>
                  <li><strong>Compost Heap:</strong> Creates fertilizer for advanced crops.</li>
                  <li><strong>Research Lab:</strong> Generates Research Points passively.</li>
                  <li><strong>Seed Maker:</strong> Automates seed production.</li>
                </ul>
                <p className="pt-2"><strong>Strategy:</strong> Build these ASAP! They pay for themselves over time and free you from manual resource grinding.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech">
              <AccordionTrigger className="text-lg font-semibold">
                🔬 Tech Tree Guide
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-2">
                <p>Technologies unlock new content and improve efficiency:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Crop Techs:</strong> Unlock new crop types for variety and profit.</li>
                  <li><strong>Building Techs:</strong> Unlock automation structures.</li>
                  <li><strong>Efficiency Techs:</strong> Improve growth speed, yields, and reduce costs.</li>
                  <li><strong>Master Farmer:</strong> The ultimate tech! Requires multiple prerequisites.</li>
                </ul>
                <p className="pt-2"><strong>Priority:</strong> Unlock Tomato Cultivation first for Research Points, then focus on building unlocks for automation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="progression">
              <AccordionTrigger className="text-lg font-semibold">
                📈 Progression Path
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-2">
                <div className="space-y-3">
                  <div>
                    <strong>Early Game (0-5 min):</strong>
                    <p className="text-muted-foreground">Plant Wheat and Corn repeatedly. Save gold. Unlock Tomato tech for Research.</p>
                  </div>
                  <div>
                    <strong>Mid Game (5-15 min):</strong>
                    <p className="text-muted-foreground">Build Wells and Windmills for passive resources. Unlock more crops. Start planting higher-value crops.</p>
                  </div>
                  <div>
                    <strong>Late Game (15+ min):</strong>
                    <p className="text-muted-foreground">Build Research Labs. Unlock efficiency techs. Automate everything. Work toward Master Farmer!</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tips">
              <AccordionTrigger className="text-lg font-semibold">
                💡 Pro Tips
              </AccordionTrigger>
              <AccordionContent className="text-base space-y-2">
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hover over ANYTHING to see detailed tooltips!</li>
                  <li>Don't spend all your gold - save for buildings</li>
                  <li>Research Labs are game-changers - prioritize them</li>
                  <li>Efficiency techs multiply with each other - very powerful!</li>
                  <li>Watch for achievement notifications - they give bonus resources</li>
                  <li>The Queue panel shows tasks in progress (future feature)</li>
                  <li>Diversify your crops to unlock the "Diverse Farm" achievement</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
    </>
  )
}
