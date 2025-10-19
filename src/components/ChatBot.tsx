import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Sparkle, X, PaperPlaneRight, Robot } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameState } from '@/lib/types'
import { CROPS, ANIMALS, BUILDINGS, TECH_TREE } from '@/lib/gameData'

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
  { trigger: (gs: GameState) => gs.resources.research < 10 && gs.totalHarvested >= 3 && gs.techs.length === 0, message: "📚 Need research? Build a Research Lab (no tech required!) or unlock and harvest Tomatoes for research." },
  { trigger: (gs: GameState) => gs.techs.length >= 1 && gs.plots.filter(p => p.type === 'animal').length === 0, message: "🐔 Unlocked animals? They provide passive resources! Try placing a chicken for automatic egg production." },
  { trigger: (gs: GameState) => gs.plots.filter(p => p.type === 'animal').length >= 1 && gs.plots.filter(p => p.type === 'building').length === 0, message: "🏭 Buildings produce resources automatically! Wells generate water, windmills create energy." },
  { trigger: (gs: GameState) => gs.totalGoldEarned >= 500 && gs.techs.length < 3, message: "💡 Invest in technologies! Efficiency upgrades like Irrigation and Composting multiply your yields." },
  { trigger: (gs: GameState) => gs.plots.filter(p => p.type === 'crop').length >= 10, message: "⚡ Your farm is growing! Consider automating resource production with buildings to free up plots for high-value crops." },
  { trigger: (gs: GameState) => gs.achievements.length >= 3, message: "🏆 Nice achievement progress! Each achievement gives bonus resources. Check the Goals tab to see what's next." },
  { trigger: (gs: GameState) => gs.resources.energy < 20 && gs.techs.includes('tech_windmill'), message: "🔋 Low on energy! Build windmills or solar panels to keep production running smoothly." },
  { trigger: (gs: GameState) => gs.totalHarvested >= 50, message: "🌟 You're becoming a master farmer! Focus on unlocking higher-tier crops and animals for maximum profits." },
]

function buildGameContext(gameState: GameState): string {
  const unlockedCrops = CROPS.filter(c => !c.requiredTech || gameState.techs.includes(c.requiredTech))
  const unlockedAnimals = ANIMALS.filter(a => !a.requiredTech || gameState.techs.includes(a.requiredTech))
  const unlockedBuildings = BUILDINGS.filter(b => !b.requiredTech || gameState.techs.includes(b.requiredTech))
  const availableTechs = TECH_TREE.filter(t => 
    t.prerequisites.every(p => gameState.techs.includes(p)) && !gameState.techs.includes(t.id)
  )

  return `CURRENT GAME STATE:
Resources: ${JSON.stringify(gameState.resources)}
Total Harvested: ${gameState.totalHarvested}
Total Gold Earned: ${gameState.totalGoldEarned}
Technologies Unlocked: ${gameState.techs.length} (${gameState.techs.join(', ')})
Achievements: ${gameState.achievements.length}
Active Crops: ${gameState.plots.filter(p => p.type === 'crop').length}
Animals: ${gameState.plots.filter(p => p.type === 'animal').length}
Buildings: ${gameState.plots.filter(p => p.type === 'building').length}

UNLOCKED CONTENT:
Crops: ${unlockedCrops.map(c => `${c.name} (${c.icon}, cost: ${JSON.stringify(c.cost)}, yield: ${JSON.stringify(c.yield)}, grows in ${c.growTime/1000}s)`).join(', ')}
Animals: ${unlockedAnimals.map(a => `${a.name} (${a.icon}, cost: ${JSON.stringify(a.cost)}, produces: ${JSON.stringify(a.production)} every ${a.productionInterval/1000}s)`).join(', ')}
Buildings: ${unlockedBuildings.map(b => `${b.name} (${b.icon}, cost: ${JSON.stringify(b.cost)}, produces: ${JSON.stringify(b.production || 'none')} every ${b.productionRate/1000}s)`).join(', ')}

AVAILABLE TECHNOLOGIES:
${availableTechs.map(t => `${t.name} (${t.cost} research): ${t.description} - ${t.effect}`).join(', ')}

LOW RESOURCES (under 10): ${Object.entries(gameState.resources).filter(([k, v]) => v < 10).map(([k]) => k).join(', ') || 'none'}`
}

export function ChatBot({ gameState }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', type: 'bot', content: "👋 Hi! I'm your AI farming advisor. I have deep knowledge of every crop, animal, building, and strategy. Ask me ANYTHING specific!", timestamp: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [shownTips, setShownTips] = useState<Set<number>>(new Set())
  const [isThinking, setIsThinking] = useState(false)
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

  const handleSend = async () => {
    if (!input.trim() || isThinking) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    try {
      const context = buildGameContext(gameState)
      const prompt = (window as any).spark.llmPrompt`You are an expert Farm Empire game advisor. Answer the player's question with SPECIFIC, ACTIONABLE advice based on their current game state.

${context}

Player Question: ${userMessage.content}

IMPORTANT RULES:
- Give SPECIFIC numbers, costs, and exact steps
- Reference ACTUAL crops/animals/buildings from their unlocked content
- If they ask about something they haven't unlocked, tell them the exact tech requirement
- If resources are low, explain EXACTLY how to get more (which crops to plant, buildings to build, etc.)
- Be concise but thorough - no generic advice
- Use relevant emojis

Answer:`

      const response = await (window as any).spark.llm(prompt, 'gpt-4o-mini')
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Sorry, I had trouble processing that. Try asking about specific crops, animals, buildings, or strategies!",
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsThinking(false)
    }
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
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-4 right-4 z-50 w-[380px] h-[600px] shadow-2xl"
          >
            <Card className="flex flex-col h-full border-2 border-primary/20 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ rotate: isThinking ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isThinking ? Infinity : 0, ease: "linear" }}
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <Robot weight="fill" className="w-6 h-6 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Farm Advisor</h3>
                    <p className="text-xs text-muted-foreground">
                      {isThinking ? 'Thinking...' : 'Ask me anything!'}
                    </p>
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
                      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
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
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask: 'How do I get fertilizer?' or 'Best crop?'"
                    className="flex-1"
                    disabled={isThinking}
                  />
                  <Button onClick={handleSend} size="icon" className="shrink-0" disabled={isThinking}>
                    <PaperPlaneRight weight="fill" className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {['What should I do next?', 'How to get research?', 'Best strategy?'].map(topic => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 text-xs transition-colors"
                      onClick={() => {
                        if (!isThinking) {
                          setInput(topic)
                          setTimeout(handleSend, 100)
                        }
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
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
