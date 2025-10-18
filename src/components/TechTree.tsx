import { Tech } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lock, Check, Flask } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface TechTreeProps {
  techs: Tech[]
  researchPoints: number
  onPurchase: (techId: string) => void
}

const CATEGORY_COLORS = {
  crops: 'bg-primary/10 border-primary text-primary',
  automation: 'bg-purple-500/10 border-purple-500 text-purple-500',
  buildings: 'bg-secondary/10 border-secondary text-secondary',
  efficiency: 'bg-blue-500/10 border-blue-500 text-blue-500',
  exotic: 'bg-accent/10 border-accent text-accent-foreground',
}

export function TechTree({ techs, researchPoints, onPurchase }: TechTreeProps) {
  const groupedTechs = techs.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = []
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, Tech[]>)

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Technology Tree</h2>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500">
            <Flask weight="fill" className="w-5 h-5 text-purple-500" />
            <span className="font-semibold font-numeric">{researchPoints}</span>
            <span className="text-sm text-muted-foreground">Research Points</span>
          </div>
        </div>

        {Object.entries(groupedTechs).map(([category, categoryTechs]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-semibold capitalize">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryTechs.map((tech) => {
                const canAfford = researchPoints >= tech.cost
                const isAvailable = tech.unlocked && !tech.purchased
                
                return (
                  <motion.div
                    key={tech.id}
                    whileHover={isAvailable ? { scale: 1.02 } : {}}
                    whileTap={isAvailable ? { scale: 0.98 } : {}}
                  >
                    <Card
                      className={`
                        p-4 transition-all duration-300
                        ${tech.purchased ? 'bg-muted border-primary/30' : ''}
                        ${isAvailable && canAfford ? 'border-primary cursor-pointer hover:shadow-lg' : ''}
                        ${!tech.purchased && !isAvailable ? 'opacity-50' : ''}
                      `}
                      onClick={() => isAvailable && canAfford && onPurchase(tech.id)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{tech.name}</h4>
                            <p className="text-xs text-muted-foreground">{tech.description}</p>
                          </div>
                          {tech.purchased ? (
                            <Check weight="bold" className="w-5 h-5 text-primary shrink-0" />
                          ) : !isAvailable ? (
                            <Lock weight="fill" className="w-5 h-5 text-muted-foreground shrink-0" />
                          ) : null}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={CATEGORY_COLORS[tech.category]}>
                            {category}
                          </Badge>
                          
                          {!tech.purchased && (
                            <div className="flex items-center gap-1">
                              <Flask weight="fill" className="w-4 h-4 text-purple-500" />
                              <span className={`text-sm font-semibold ${canAfford ? 'text-purple-500' : 'text-destructive'}`}>
                                {tech.cost}
                              </span>
                            </div>
                          )}
                        </div>

                        {tech.prerequisites.length > 0 && !tech.purchased && (
                          <div className="text-xs text-muted-foreground">
                            Requires: {tech.prerequisites.map(id => {
                              const prereq = techs.find(t => t.id === id)
                              return prereq?.name || id
                            }).join(', ')}
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
