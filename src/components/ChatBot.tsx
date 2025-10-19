import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Sparkle, X, PaperPlaneRight, Robot } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState } from '@/lib/types'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: number
}

interface ChatBotProps {
  gameState: GameState
}

const TIPS = [
  { trigger: (gs: GameState) => gs.totalHarvested === 0 && gs.resources.seeds >= 1, message: "🌱 Welcome! Start by clicking an empty plot to plant your first crop. Wheat is a great beginner choice!" },
  { trigger: (gs: GameState) => gs.totalHarvested >= 1 && gs.totalHarvested < 3, message: "🎉 Great harvest! Keep planting and harvesting to earn gold and research points. Tomatoes and grapes give research!" },
  { trigger: (gs: GameState) => gs.resources.research >= 50 && gs.techs.length === 0, message: "🔬 You have 50+ research points! Click the Tech tab to unlock new crops, animals, and upgrades." },
  { trigger: (gs: GameState) => gs.resources.research < 10 && gs.totalHarvested >= 3 && gs.techs.length === 0, message: "📚 Need research? Harvest Tomatoes (🍅) or Grapes (🍇) to generate research points! They're in the Crops tab after basic unlocks." },
  { trigger: (gs: GameState) => gs.techs.length >= 1 && gs.plots.filter(p => p.type === 'animal').length === 0, message: "🐔 Unlocked animals? They provide passive resources! Try placing a chicken for automatic egg production." },
  { trigger: (gs: GameState) => gs.plots.filter(p => p.type === 'animal').length >= 1 && gs.plots.filter(p => p.type === 'building').length === 0, message: "🏭 Buildings produce resources automatically! Wells generate water, windmills create energy." },
  { trigger: (gs: GameState) => gs.totalGoldEarned >= 500 && gs.techs.length < 3, message: "💡 Invest in technologies! Efficiency upgrades like Irrigation and Composting multiply your yields." },
  { trigger: (gs: GameState) => gs.plots.filter(p => p.type === 'crop').length >= 10, message: "⚡ Your farm is growing! Consider automating resource production with buildings to free up plots for high-value crops." },
  { trigger: (gs: GameState) => gs.achievements.length >= 3, message: "🏆 Nice achievement progress! Each achievement gives bonus resources. Check the Goals tab to see what's next." },
  { trigger: (gs: GameState) => gs.resources.energy < 20 && gs.techs.includes('tech_windmill'), message: "🔋 Low on energy! Build windmills or solar panels to keep production running smoothly." },
  { trigger: (gs: GameState) => gs.totalHarvested >= 50, message: "🌟 You're becoming a master farmer! Focus on unlocking higher-tier crops and animals for maximum profits." },
]

const CHATBOT_RESPONSES: Record<string, (gs: GameState) => string> = {
  hello: () => "👋 Hello! I'm your farming assistant. Ask me anything about crops, animals, buildings, or strategy!",
  help: () => "💡 I can help with:\n• Crop recommendations\n• Resource management tips\n• Tech tree guidance\n• Animal care advice\n• Building strategies\n\nJust ask!",
  crops: (gs) => {
    const unlocked = gs.techs.length
    return `🌾 You have ${unlocked} technologies unlocked. Focus on high-yield crops like tomatoes and strawberries. Don't forget to check the Tech tab for crop upgrades!`
  },
  animals: (gs) => {
    const animalCount = gs.plots.filter(p => p.type === 'animal').length
    if (animalCount === 0) return "🐔 Unlock animals in the Tech tab! Chickens are great starters - they produce eggs passively."
    return `🐄 You have ${animalCount} animals! Make sure you have enough hay and feed resources. Animals produce valuable resources over time.`
  },
  buildings: (gs) => {
    const buildingCount = gs.plots.filter(p => p.type === 'building').length
    if (buildingCount === 0) return "🏭 Buildings automate resource production! Start with a Well for water or Windmill for energy."
    return `⚡ You have ${buildingCount} buildings producing resources. They're key to scaling your empire efficiently!`
  },
  tech: (gs) => `🔬 You've unlocked ${gs.techs.length} technologies. Efficiency upgrades give multiplicative bonuses - they're usually worth prioritizing!`,
  money: (gs) => {
    if (gs.resources.gold < 100) return "💰 Plant and harvest crops to earn gold! Wheat and corn are reliable early money makers."
    return "💎 Focus on high-value crops like strawberries and grapes. Use buildings to automate resource production and scale faster!"
  },
  research: () => "🔬 Earn research points by harvesting crops that give research (Tomatoes 🍅, Grapes 🍇, higher-tier fruits) or build Research Labs. Spend research in the Tech tab to unlock new content!",
  strategy: (gs) => {
    if (gs.totalHarvested < 10) return "🎯 Early strategy: Plant wheat/corn repeatedly → Earn gold & research → Unlock basic techs → Expand to animals"
    if (gs.techs.length < 5) return "🎯 Mid strategy: Balance crops, animals, and buildings → Unlock efficiency techs → Automate resource production"
    return "🎯 Late strategy: Focus on tier 5-6 content → Maximize automation → Complete achievements → Build your ultimate empire!"
  },
}

export function ChatBot({ gameState }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', type: 'bot', content: "👋 Hi! I'm your farming advisor. I'll share tips as you play, but feel free to ask me questions anytime!", timestamp: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [shownTips, setShownTips] = useState<Set<number>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastCheckRef = useRef(Date.now())

  useEffect(() => {
    const now = Date.now()
    if (now - lastCheckRef.current < 10000) return
    lastCheckRef.current = now

    TIPS.forEach((tip, index) => {
      if (!shownTips.has(index) && tip.trigger(gameState)) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: tip.message,
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, newMessage])
        setShownTips(prev => new Set(prev).add(index))
        if (!isOpen) setHasNewMessage(true)
      }
    })
  }, [gameState, shownTips, isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMessage])

    const lowerInput = input.toLowerCase()
    let response = "🤔 I'm not sure about that. Try asking about crops, animals, buildings, tech, money, research, or strategy!"
    
    for (const [key, responder] of Object.entries(CHATBOT_RESPONSES)) {
      if (lowerInput.includes(key)) {
        response = responder(gameState)
        break
      }
    }

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, botMessage])
    }, 500)

    setInput('')
  }

  const handleOpen = () => {
    setIsOpen(true)
    setHasNewMessage(false)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 w-[380px] h-[600px] shadow-2xl"
          >
            <Card className="flex flex-col h-full border-2 border-primary/20 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Robot weight="fill" className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Farm Advisor</h3>
                    <p className="text-xs text-muted-foreground">Here to help!</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4 min-h-0" ref={scrollRef as any}>
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-card flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about crops, animals, strategy..."
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon" className="shrink-0">
                    <PaperPlaneRight weight="fill" className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['crops', 'animals', 'strategy', 'tech'].map(topic => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => {
                        setInput(topic)
                        setTimeout(handleSend, 100)
                      }}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button
            onClick={handleOpen}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg relative"
          >
            <Robot weight="fill" className="w-6 h-6" />
            {hasNewMessage && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full border-2 border-background"
              />
            )}
          </Button>
        </motion.div>
      )}
    </>
  )
}
