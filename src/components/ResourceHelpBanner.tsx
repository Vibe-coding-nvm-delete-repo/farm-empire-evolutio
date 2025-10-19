import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Lightbulb } from '@phosphor-icons/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Resources } from '@/lib/types'

interface ResourceHelpBannerProps {
  resources: Resources
  hasResearchLab: boolean
  hasCompostHeap: boolean
}

interface Banner {
  id: string
  icon: string
  title: string
  message: string
  color: string
  textColor: string
}

export function ResourceHelpBanner({ resources, hasResearchLab, hasCompostHeap }: ResourceHelpBannerProps) {
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())

  const needsResearch = resources.research < 5 && !hasResearchLab
  const needsFertilizer = resources.fertilizer < 3 && !hasCompostHeap

  const dismiss = (bannerId: string) => {
    setDismissedBanners(prev => new Set([...prev, bannerId]))
  }

  const banners: Banner[] = []

  if (needsResearch && !dismissedBanners.has('research')) {
    banners.push({
      id: 'research',
      icon: '🔬',
      title: 'Need Research Points?',
      message: 'Build a Research Lab! Click an empty plot → Buildings tab → Research Lab (costs 300 gold, 20 energy). It automatically generates research points!',
      color: 'bg-purple-500/10 border-purple-500/30',
      textColor: 'text-purple-700',
    })
  }

  if (needsFertilizer && !dismissedBanners.has('fertilizer')) {
    banners.push({
      id: 'fertilizer',
      icon: '♻️',
      title: 'Need Fertilizer?',
      message: 'Build a Compost Heap! First, unlock "Composting" in the Tech tab. Then click an empty plot → Buildings tab → Compost Heap (costs 80 gold, 5 water). It produces 2 fertilizer every 10 seconds!',
      color: 'bg-green-500/10 border-green-500/30',
      textColor: 'text-green-700',
    })
  }

  return (
    <AnimatePresence>
      {banners.map((banner) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Card className={`p-4 ${banner.color} border-2 shadow-lg`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-2xl">
                  {banner.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb weight="fill" className={`w-5 h-5 ${banner.textColor}`} />
                    <h3 className="font-bold text-base">{banner.title}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-background/50"
                    onClick={() => dismiss(banner.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {banner.message}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
