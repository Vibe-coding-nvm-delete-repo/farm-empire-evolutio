# 🌾 Farm Empire - Build Your Agricultural Dynasty

An immersive, highly-optimized farming simulation game where you grow crops, raise animals, research technologies, and expand your agricultural empire! Features TRUE AI-powered advisor, silky-smooth animations, persistent save system, and deep strategic gameplay.

## ✨ Latest Update - Smooth Animations & Persistent Progress!

### 🎬 Buttery-Smooth Animations
- **Enhanced Progress Bars**: 500ms smooth easing on all crop/animal/building progress
- **Smooth Resource Counting**: Numbers animate up/down with spring physics
- **Fluid Tab Transitions**: 200ms fade-in animations when switching tabs
- **Animated Plot Cards**: Scale and fade effects when planting/harvesting
- **Harvest Pulse Animation**: Ready crops pulse with a satisfying glow
- **Micro-interactions**: Every button, hover, and click feels responsive

### 💾 True Persistent Progress
- **Auto-Save Every 3s**: Your progress saves automatically and frequently
- **Save Indicator**: See "Saving..." and "Saved ✓" status in header
- **Faster Save**: 1s debounce (down from 2s) for quicker persistence
- **Reload-Safe**: Refresh the page anytime - your farm persists!
- **State Validation**: Prevents corrupted saves with validation layer

### 🏆 Non-Intrusive Achievement Toasts
- **Top-Right Notifications**: Achievements appear as elegant toasts near notifications
- **Auto-Dismiss**: Fade out after 5 seconds automatically
- **Stack Multiple**: Multiple achievements queue nicely
- **Progress Bar**: Visual countdown shows time remaining
- **One-Click Close**: X button for instant dismiss
- **No Screen Blocking**: Keep playing while celebrating!

### 🎨 Visual Polish
- **Smooth Transitions**: All elements use optimized easing curves
- **Floating Numbers**: Resource gains show as floating +values (coming soon)
- **Better Button States**: Clear hover, active, and disabled states
- **Refined Spacing**: Improved layout consistency throughout
- **Professional Feel**: Every interaction feels intentional and polished

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
- **Progress Indicators**: See real-time production cycles with smooth animations

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
- ✅ Auto-save every 3 seconds
- ✅ Visual save indicator in header

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
- ✅ **Auto-Save**: Never lose progress with frequent auto-saves
- ✅ **Save Indicator**: Always know your progress is safe

## 🎨 Design Philosophy

Beautiful, minimalist interface with:
- ⚡ **Silky-smooth animations** with spring physics
- 🎨 **Nature-inspired color palette** (greens, ambers, earth tones)
- ✨ **Professional transitions** with optimized easing curves
- 📱 **Responsive design** for all screen sizes
- 💎 **Polished micro-interactions** in every detail
- 🎯 **Clear visual hierarchy** guiding focus
- 🔄 **Persistent progress** that never gets lost

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
- 💾 **Auto-Save**: Your progress saves every 3 seconds automatically!

## 🧪 Testing & Quality

- **Comprehensive Test Suite**: 47+ unit tests covering game engine, components, performance
- **Performance Benchmarks**: Ensures 60 FPS even with 20 active plots
- **Type Safety**: Full TypeScript coverage
- **No Infinite Loops**: Careful dependency management
- **Memory Efficient**: Memoization prevents leaks
- **Save Validation**: Prevents data corruption

## 📚 Documentation

- [Full Improvements List](./IMPROVEMENTS.md) - All performance & UX enhancements
- [Chatbot Guide](./CHATBOT_GUIDE.md) - How to use the AI advisor
- [PRD](./PRD.md) - Complete product requirements
- [Performance Details](./PERFORMANCE.md) - Technical optimization details

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
