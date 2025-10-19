# 🌾 Farm Empire - Build Your Agricultural Dynasty

An immersive, highly-optimized farming simulation game where you grow crops, raise animals, research technologies, and expand your agricultural empire! Features TRUE AI-powered advisor, snappy animations, and deep strategic gameplay.

## ✨ What's New - Major Performance & UX Overhaul!

### 🚀 Performance Improvements
- **40-50% Faster Animations**: All interactions feel instant (150-250ms vs 300-500ms)
- **20% Faster Game Loop**: 200ms update cycle for smoother gameplay
- **Optimized Rendering**: Memoized components prevent unnecessary re-renders
- **Instant Feedback**: Toast notifications display for only 1-2 seconds

### 🤖 TRUE AI Integration
- **LLM-Powered Chatbot**: Ask ANYTHING and get specific, intelligent answers
- **Game State Awareness**: AI knows your exact resources, unlocked content, and progression
- **Precise Guidance**: Get exact costs, yields, and step-by-step instructions
- **No Generic Responses**: Every answer is tailored to YOUR specific situation
- [See Full Chatbot Guide](./CHATBOT_GUIDE.md)

### 📊 Stats Overview Dashboard (NEW!)
- **6 Key Metrics** always visible at top of screen
- Total Gold Earned • Total Harvests • Technologies • Achievements • Active Plots • Playtime
- Beautiful card design with smooth animations
- Detailed tooltips on hover

### 🎉 Enhanced Celebrations
- **Confetti Animations**: 40 colorful particles rain down on achievements
- **Improved Unlock Notifications**: Shine effects, wobble animations, faster timing
- **Better Harvest Rolls**: Glowing crits, rotating sparkles, clearer feedback

### 🎨 UI Improvements
- **Clearer Tab Design**: Icons above text, better active states, prominent badges
- **Better Visual Hierarchy**: Stats → Resources → Help → Progression → Content
- **Improved Tooltips**: More detailed with "HOW TO GET" callouts for tricky resources
- **Smoother Animations**: Professional easing curves on all transitions

[See All Improvements](./IMPROVEMENTS.md)

## 🎮 Core Gameplay

### 🌱 Farm Management
- **Plant & Harvest**: 13 different crops from wheat to exotic fruits
- **20-Plot Farm**: Strategically arrange crops, animals, and buildings  
- **Dice Roll System**: 25-200% yield variance with critical harvest bonuses
- **Luck Upgrades**: Increase critical hit chances for more rewards

### 🐄 Livestock & Production
- **9 Animal Types**: Chickens, cows, sheep, pigs, goats, ducks, llamas, and more
- **Passive Production**: Animals generate resources automatically
- **Feed Management**: Keep animals fed for continuous production
- **Progress Indicators**: See real-time production cycles

### 🏭 Building & Automation
- **12 Buildings**: Wells, windmills, research labs, compost heaps, solar panels, barns
- **Resource Generation**: Automate water, energy, research, and fertilizer production
- **Efficiency Bonuses**: Buildings free up farm space for high-value crops

### 🔬 Technology Tree
- **36 Technologies** across 7 categories
- **Efficiency Multipliers**: Faster growth, higher yields, reduced costs
- **Content Unlocks**: Access to new crops, animals, and buildings
- **Strategic Choices**: Plan your research path carefully

## 💾 Persistent Save System

All game progress automatically saves using the Spark KV store:
- ✅ Resources and farm state
- ✅ Unlocked technologies & achievements  
- ✅ Activity history & notifications
- ✅ Progression milestones
- ✅ Animal feeding states & production timers

**Your farm persists forever** - refresh the page anytime!

## 🏆 Achievement & Progression

### 30 Achievements Across 6 Categories
- 🌾 Harvest (10 total, 1K harvested, etc.)
- 💰 Wealth (100K gold earned, etc.)
- 🔬 Tech (Unlock all 36 technologies)
- 🐄 Animals (Diverse ranch, 200 products)
- 🏭 Automation (15 buildings)
- ⭐ Special (Lucky farmer, critical master)

### Visual Progression Path
11 milestone markers showing your journey from beginner to ultimate farmer with contextual hints

### Activity Log
Complete timestamped history of every action - harvests, purchases, unlocks, achievements

## 🎯 Quality of Life Features

- ✅ **Bulk Harvest**: Collect all ready crops with one click
- ✅ **Row Planting**: Plant entire rows at once
- ✅ **Smart AI Advisor**: Ask specific questions, get precise answers
- ✅ **Tutorial System**: First-time walkthrough
- ✅ **Resource Help Banner**: Shows exactly how to get low resources
- ✅ **Comprehensive Guide**: Full game documentation in-app
- ✅ **Detailed Tooltips**: Hover for information on everything

## 🎨 Design Philosophy

Beautiful, minimalist interface with:
- ⚡ **Lightning-fast animations** (150-250ms)
- 🎨 **Nature-inspired color palette** (greens, ambers, earth tones)
- ✨ **Smooth transitions** with professional easing
- 📱 **Responsive design** for all screen sizes
- 💎 **Polished details** in every interaction
- 🎯 **Clear visual hierarchy** guiding focus

Typography:
- **Fredoka** for friendly, approachable headings
- **Inter** for clean, readable body text

## 🕹️ How to Play

1. **Start Small**: Plant wheat and corn to build initial resources (8-12 second grow times)
2. **Get Research**: Build a Research Lab OR harvest tomatoes for research points
3. **Unlock Technologies**: Spend research in Tech tab to unlock new content
4. **Diversify**: Add animals for passive income, buildings for automation
5. **Follow the Path**: Check Progression Path when unsure what to do next
6. **Ask the AI**: Chat with the robot advisor for specific guidance

## 💡 Pro Tips

- 🔬 **Research Early**: Build Research Lab immediately (costs 120g + 30w + 50e)
- 🌱 **Compost is Key**: Unlock Composting tech, build Compost Heap for infinite fertilizer
- 💧 **Automate Resources**: Wells and Windmills free you to plant valuable crops
- 🐔 **Animals = Passive Income**: They produce while you're away!
- 📊 **Check Stats**: Dashboard shows your progress at a glance
- 🤖 **Use AI Advisor**: Ask "How do I get X?" for instant, specific help
- ⚡ **Bulk Actions**: Use Collect All and row planting for efficiency
- 🎲 **Luck Matters**: Invest in luck techs for bigger critical harvest bonuses

## 🧪 Testing & Quality

- **Comprehensive Test Suite**: 47+ unit tests covering game engine, components, performance
- **Performance Benchmarks**: Ensures 60 FPS even with 20 active plots
- **Type Safety**: Full TypeScript coverage
- **No Infinite Loops**: Careful dependency management
- **Memory Efficient**: Memoization prevents leaks

## 📚 Documentation

- [Full Improvements List](./IMPROVEMENTS.md) - All performance & UX enhancements
- [Chatbot Guide](./CHATBOT_GUIDE.md) - How to use the AI advisor
- [PRD](./PRD.md) - Complete product requirements
- [Performance Details](./PERFORMANCE.md) - Technical optimization details

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
