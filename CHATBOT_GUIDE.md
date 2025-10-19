# AI Chatbot Guide - Ask Anything!

## What Makes This Chatbot Special

Unlike typical game chatbots with scripted responses, Farm Empire's AI advisor uses **TRUE LLM integration** to provide intelligent, specific answers based on your actual game state.

### It Has Deep Knowledge Of:
- ✅ Every crop (costs, yields, grow times)
- ✅ Every animal (production rates, feed costs)
- ✅ Every building (what they produce, how often)
- ✅ Every technology (prerequisites, effects)
- ✅ YOUR current resources and unlocked content
- ✅ What you CAN and CANNOT currently afford
- ✅ Exact requirements for locked content

## Example Questions You Can Ask

### Resource Questions
- "How do I get fertilizer?" → Tells you about Compost Heap building + tech requirement
- "I need more research points, help!" → Explains Research Lab AND which crops give research
- "Why don't I have enough energy?" → Suggests Windmill/Solar Panel with exact costs
- "How can I get wool?" → Tells you about sheep, their cost, and tech requirement

### Strategy Questions  
- "What should I do next?" → Analyzes your state and suggests optimal next step
- "What's the best crop to plant right now?" → Considers what you've unlocked and your resources
- "Should I focus on animals or buildings?" → Gives strategic advice based on your progression
- "How do I unlock strawberries?" → Tells you exact tech tree path needed

### Specific Item Questions
- "Tell me about tomatoes" → Gives exact cost, yield, grow time, why they're valuable (research!)
- "What does a chicken produce?" → Production items, rate, feeding requirements
- "How much does a windmill cost?" → Exact resource costs
- "What does the Irrigation tech do?" → Explains the effect and how much it helps

### Comparison Questions
- "Wheat vs corn?" → Compares yields, costs, efficiency
- "Chicken or cow first?" → Strategic comparison based on your resources
- "Which building should I build next?" → Prioritizes based on your needs

### Troubleshooting Questions
- "I can't afford anything!" → Suggests fastest way to earn resources
- "My animals aren't producing" → Explains feeding mechanics
- "Why can't I unlock X tech?" → Shows prerequisite path
- "How do critical harvests work?" → Explains luck system

## How It Works

1. **Click the robot icon** in bottom-right corner
2. **Type your question** (or click a suggested topic)
3. **AI analyzes** your full game state in ~1 second
4. **Receive specific answer** with exact numbers and steps

### Behind The Scenes

```javascript
// The AI receives this context about YOUR game:
- All your current resources
- All crops/animals/buildings you've unlocked
- Your total harvests, gold earned, etc.
- Which technologies are available to unlock
- What you're currently farming
- Resources you're low on
```

Then it uses GPT-4o-mini to generate a response that:
- References YOUR specific unlocked content
- Gives EXACT costs from the game data
- Explains EXACT steps to unlock locked items
- Suggests strategy based on YOUR progression

## Tips for Best Results

### ✅ DO:
- Ask specific questions about items or strategies
- Reference specific resources you need help with
- Ask "how to" questions
- Ask for comparisons between options

### ❌ DON'T:
- Ask about game features that don't exist
- Ask non-game-related questions
- Expect it to play the game for you
- Ask vague questions like "help me"

## Example Conversations

### Early Game
**You**: "I just started, what should I do?"
**AI**: "Start by planting Wheat - costs only 1 seed + 2 water, grows in 8 seconds, gives 12 gold + 1 seed + 2 hay. This will get you gold to expand. Once you have 50 research, unlock Root Crops in the Tech tab!"

### Mid Game
**You**: "How do I get fertilizer?"
**AI**: "You need to build a Compost Heap! First, unlock the 'Composting' technology in the Tech tab (costs 30 research). Then build the Compost Heap (costs 80 gold, 10 water, 20 energy). It produces 2 fertilizer every 10 seconds automatically!"

### Resource Problems
**You**: "I need research points fast"
**AI**: "Two ways: 1) Harvest Tomatoes - each gives 1 research point, costs 3 seeds + 4 water + 2 fertilizer, grows in 15 seconds. 2) Build Research Lab - costs 120 gold + 30 water + 50 energy, produces 1 research every 15 seconds passively. With your 850 gold, you can afford the lab!"

### Strategy
**You**: "Animals or buildings first?"
**AI**: "With 6 techs unlocked and 125 research, you're ready for both! Buildings automate resources (Well for water, Windmill for energy) so you can grow more crops. Animals (Chicken for eggs, Cow for milk) provide steady passive income. I'd suggest: 1 Well → Plant more tomatoes → Then animals once you have steady resource production."

## Advanced Tips

### Use It For Planning
Ask "If I save up 500 gold, what should I buy?" to plan ahead

### Use It For Optimization  
Ask "Am I using my plots efficiently?" for layout advice

### Use It For Understanding
Ask "Explain how X works" for any game mechanic

### Use It For Unlocking
Ask "Tech tree path to unlock X?" to see the route

## Response Quality

The AI aims to provide:
- **Specific numbers**: Exact costs, yields, times
- **Actionable steps**: Clear "do this, then that"
- **Context awareness**: Knows what you have vs need
- **No fluff**: Gets right to the point
- **Emoji hints**: Makes responses scannable

## When To Ask

- ❓ You're stuck and don't know what to do next
- 📚 You want to understand a game mechanic
- 💡 You need strategic advice
- 🔒 You want to unlock something but don't know how
- ⚡ You're low on a resource and need more
- 📊 You want to compare your options
- 🎯 You want to optimize your farm layout

## Technical Details

- **Model**: GPT-4o-mini (fast, accurate, cost-effective)
- **Response time**: ~1-2 seconds
- **Context size**: Full game state sent each query
- **Accuracy**: Based on actual game data files
- **Privacy**: Game state only, no personal data

## Limitations

The AI advisor:
- ❌ Can't modify your game state directly
- ❌ Can't see your screen or click for you  
- ❌ Might occasionally misunderstand unclear questions
- ❌ Won't help with exploits or cheats
- ✅ Will always try to help you play better!

## Get The Most Out Of It

Think of it as having an expert player sitting next to you who:
- Has memorized all the game data
- Can see your exact resources and progress
- Gives advice tailored to your situation
- Never gets tired of answering questions

**Don't be shy - ask away! The more specific your question, the more helpful the answer!** 🤖✨
