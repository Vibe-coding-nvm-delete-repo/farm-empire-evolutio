# Planning Guide

Build the ultimate idle farm empire game where players start with a small plot and grow into an agricultural tech conglomerate, unlocking advanced farming technologies, automating production chains, and ultimately achieving the goal of creating a self-sustaining eco-utopia that feeds the world.

**Experience Qualities**:
1. **Addictively Progressive** - Every click and decision creates a satisfying cascade of growth with clear visual feedback and rewarding unlock moments
2. **Strategically Deep** - Meaningful choices between specialization paths, resource allocation, and automation priorities that create emergent gameplay
3. **Visually Delightful** - Smooth animations, particle effects for harvests, and a living farm that breathes with activity as tasks complete

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Multiple interconnected systems: resource management, tech trees, queue management, building placement, automation chains, and persistent progression with deep strategic choices

## Essential Features

### Core Resource System
- **Functionality**: Track gold, seeds, water, fertilizer, energy, and research points with real-time updates
- **Purpose**: Create meaningful economic decisions and resource scarcity that drives strategic planning
- **Trigger**: Resources update from harvests, building production, and tech unlocks
- **Progression**: Resource tooltips → Real-time counter updates → Visual particle effects on gain → Deficit warnings
- **Success criteria**: Players can see all resources, understand rates of change, and make informed allocation decisions

### Plot & Building System
- **Functionality**: Place crops and buildings on expandable grid, each with visual states (growing, ready, harvesting)
- **Purpose**: Give players spatial strategy and satisfying visual growth of their farm empire
- **Trigger**: Click empty plot to plant crops or build structures
- **Progression**: Select plot → Choose crop/building from available options → Confirm placement → Watch construction/growth animation → Harvest/collect when ready
- **Success criteria**: Smooth drag-to-place interface, clear visual states, satisfying animations

### Queue & Automation System
- **Functionality**: Queue multiple farm tasks that process in background with time estimates; automate with unlocked tech
- **Purpose**: Core idle game mechanic allowing progression while away, rewarding planning
- **Trigger**: Add tasks to queue manually or via automation rules
- **Progression**: Click "Add to Queue" → Task appears in sidebar with timer → Background processing → Completion notification → Auto-collect if automated
- **Success criteria**: Queue persists across sessions, clear time remaining, satisfaction when returning to completed tasks

### Tech Tree System
- **Functionality**: Unlock 50+ technologies across 5 paths: Crops, Automation, Buildings, Efficiency, Exotic
- **Purpose**: Long-term progression hooks and strategic build diversity
- **Trigger**: Spend research points earned from special research plots and achievements
- **Progression**: Open tech tree → Browse paths → Preview benefits → Spend points → Unlock triggers new options → Synergies emerge
- **Success criteria**: Clear dependencies shown, exciting unlocks, meaningful choices between paths

### Production Chains
- **Functionality**: Advanced buildings process raw crops into valuable products (mill wheat → flour → bakery → bread)
- **Purpose**: Create satisfying complexity and exponential value growth
- **Trigger**: Unlock processing buildings in tech tree
- **Progression**: Harvest raw material → Auto-route to processor → Processing time → Output to storage → Sell or use in next chain
- **Success criteria**: Visual flow of resources, clear bottlenecks, optimization opportunities

### Achievement & Milestone System
- **Functionality**: Track 100+ achievements across categories with rewards
- **Purpose**: Provide constant micro-goals and dopamine hits
- **Trigger**: Complete specific actions (harvest 100 crops, unlock tech branch, earn 10K gold)
- **Progression**: Action triggers check → Toast notification → Achievement unlocked → Reward granted → Progress to next tier
- **Success criteria**: Discoveries feel organic, rewards feel meaningful, always something close to unlocking

### Prestige System (Late Game)
- **Functionality**: Reset farm for permanent bonuses and access to new exotic crops
- **Purpose**: Provide infinite replayability and exponential growth satisfaction
- **Trigger**: Reach world-feeding milestone (1M food produced)
- **Progression**: View prestige benefits → Confirm reset → Keep tech tree progress + gain multipliers → Start fresh with advantages
- **Success criteria**: Clear benefit display, exciting not frustrating, new content unlocked

## Edge Case Handling
- **Insufficient Resources**: Gray out unavailable options with tooltip showing what's needed
- **Queue Overflow**: Cap at 50 tasks with warning message and suggestion to unlock automation
- **Offline Progress**: Calculate up to 24 hours of queued tasks, show summary modal on return
- **Storage Full**: Pause auto-harvest with notification to expand storage or sell
- **Rapid Clicking**: Debounce with visual feedback to prevent double-placement bugs
- **Save Corruption**: Backup last 3 saves in separate keys, recovery UI if load fails
- **Missing Prerequisites**: Lock UI elements with clear dependency chain tooltip

## Design Direction
The design should feel like a premium mobile game brought to the browser - vibrant, playful yet sophisticated, with smooth animations that make every action feel responsive and rewarding. Rich interface with depth through layering, glows, and particle effects while maintaining clean information hierarchy. Think Stardew Valley meets Factorio with a modern UI polish.

## Color Selection
Triadic color scheme creating vibrant energy - earthy green for growth, golden yellow for wealth/sun, and sky blue for water/tech. The three colors represent the core farm elements while creating visual excitement through contrast.

- **Primary Color**: Fresh spring green `oklch(0.70 0.15 145)` - represents growth, nature, and the core farming experience. Used for CTAs, active plots, and positive progress indicators.
- **Secondary Colors**: Rich earth brown `oklch(0.45 0.08 60)` for soil/foundations and structures; Sky blue `oklch(0.68 0.12 230)` for water systems and technology unlocks
- **Accent Color**: Golden harvest yellow `oklch(0.82 0.15 90)` - wealth, sunshine, completed harvests, and achievement moments. Attention-grabbing for rewards and unlocks.
- **Foreground/Background Pairings**:
  - Background (Soft cream `oklch(0.97 0.01 90)`): Dark brown text `oklch(0.25 0.02 60)` - Ratio 10.1:1 ✓
  - Card (White `oklch(0.99 0 0)`): Dark text `oklch(0.20 0.02 60)` - Ratio 13.5:1 ✓
  - Primary (Green `oklch(0.70 0.15 145)`): White text `oklch(0.99 0 0)` - Ratio 5.2:1 ✓
  - Secondary (Earth brown `oklch(0.45 0.08 60)`): White text `oklch(0.99 0 0)` - Ratio 6.8:1 ✓
  - Accent (Golden `oklch(0.82 0.15 90)`): Dark brown text `oklch(0.25 0.02 60)` - Ratio 8.9:1 ✓
  - Muted (Light green `oklch(0.92 0.03 145)`): Medium text `oklch(0.45 0.05 145)` - Ratio 6.2:1 ✓

## Font Selection
Typography should feel friendly and approachable yet clear enough for numbers and data - combining a rounded sans-serif for personality with a clean geometric for UI precision.

- **Primary Font**: Fredoka (Google Fonts) - Rounded, playful headings that evoke the joy of farming without being childish
- **Secondary Font**: Inter (Google Fonts) - Clean, highly legible for all UI text, numbers, and data displays

- **Typographic Hierarchy**:
  - H1 (Game Title): Fredoka Bold/32px/tight letter-spacing/-1px
  - H2 (Section Headers): Fredoka SemiBold/24px/normal
  - H3 (Building/Crop Names): Fredoka Medium/18px/normal
  - Body (UI Text): Inter Regular/14px/1.5 line-height
  - Small (Tooltips/Meta): Inter Regular/12px/1.4 line-height
  - Numbers (Resources): Inter SemiBold/16px/tabular-nums

## Animations

Animations should create a living, breathing farm ecosystem - subtle idle movements on crops, satisfying pops when harvesting, smooth queue updates, and celebratory moments for unlocks. Balance between constant micro-movements that make the farm feel alive and bigger moments that reward player actions.

- **Purposeful Meaning**: 
  - Crops gently sway while growing (creating life)
  - Harvest actions trigger particle burst + scale bounce (rewarding feedback)
  - Gold counter animates up on earnings (satisfying accumulation)
  - Tech unlocks pulse with glow effect (excitement)
  - Queue items slide smoothly with progress bars (clear status)
  
- **Hierarchy of Movement**:
  1. High priority: Player action feedback (clicks, harvests, purchases)
  2. Medium priority: Completion notifications (tasks done, resources gained)
  3. Low priority: Ambient farm life (crop sway, building smoke)
  4. Special: Achievement celebrations (confetti, screen flash)

## Component Selection

- **Components**: 
  - **Card**: Primary container for buildings, plots, tech tree nodes - elevated shadow, hover lift effect
  - **Button**: All actions with distinct variants - Primary (plant/build), Secondary (harvest), Destructive (reset), Ghost (queue management)
  - **Progress**: Queue timers, crop growth, building construction - smooth animations
  - **Dialog**: Tech tree full view, achievement details, prestige confirmation
  - **Tooltip**: Rich information on hover - resource costs, benefits, unlock requirements
  - **Tabs**: Switch between Farm View, Tech Tree, Production, Achievements
  - **Badge**: Resource counters, achievement counts, new unlock indicators
  - **Separator**: Visual breaks between queue sections, resource categories
  - **ScrollArea**: Tech tree canvas, long queue lists, achievement panels
  - **Popover**: Quick actions for plots (plant menu, upgrade options)
  
- **Customizations**: 
  - **Plot Grid Component**: Custom 3D isometric grid cells with state-based styling
  - **Resource Counter**: Animated number with +/- delta indicators and particle effects
  - **Tech Node**: Hexagonal cards with connection lines, lock states, glow on hover
  - **Queue Item**: Expandable cards with circular progress, cancel/priority buttons
  - **Production Chain Visualizer**: Flow diagram showing resource transformations
  
- **States**:
  - Buttons: Idle (subtle shadow), Hover (lift + glow), Active (press down), Disabled (grayscale + clear tooltip), Loading (spinner)
  - Plots: Empty (subtle pulse), Growing (fill animation + sway), Ready (bright glow pulse), Harvesting (scale bounce out)
  - Tech Nodes: Locked (grayscale + lock icon), Available (pulse glow), Unlocked (full color), Active (glowing border)
  
- **Icon Selection**:
  - Plant (growing crops), Factory (buildings), TreeStructure (tech tree), Queue (task queue)
  - Lightning (energy), Drop (water), Coin (gold), Sparkle (research points)
  - ChartLine (production stats), Trophy (achievements), ArrowsClockwise (prestige)
  - Play (start task), X (cancel), Check (complete), LockKey (locked content)
  
- **Spacing**:
  - Tight (gap-2/4px): Related inline elements (icon + text)
  - Normal (gap-4/16px): Card content, form fields
  - Relaxed (gap-6/24px): Between major sections
  - Generous (gap-8/32px): Page sections, grid margins
  
- **Mobile**:
  - Stack layout: Side-by-side panels (resources, queue) stack vertically
  - Expand plot grid to full width, reduce to 4x4 visible with pan/zoom
  - Tech tree: Single column view with collapse/expand nodes
  - Bottom sheet for quick actions instead of popovers
  - Larger touch targets (min 44px) for all interactive elements
  - Persistent sticky header with key resources
