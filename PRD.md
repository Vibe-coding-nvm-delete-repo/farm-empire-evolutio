# Farm Empire - Product Requirements Document

Build an expansive, deeply engaging idle farm empire game where players progress from a small farmer to an agricultural tycoon. The game features 13 crops, 9 animals, 12 buildings, 36 technologies, and 30 achievements across 6 tiers of progression. Players plant crops, raise livestock, research technologies, automate production, and track every action through a comprehensive activity log. An AI advisor provides contextual hints and answers questions, while a visual progression path shows the journey ahead. A dice-roll harvest system adds exciting variance to every crop harvest, with luck upgrades that make critical yields more common.

**Performance**: Heavily optimized with memoization, change detection, and comprehensive test coverage (47 unit tests) ensuring snappy 60 FPS gameplay even with 20 active plots.

**Experience Qualities**:
1. **Crystal Clear & Guided** - Clean, modern UI with comprehensive tooltips, an AI chatbot advisor, progression path, and complete resource center guide.
2. **Maximally Rewarding & Addictive** - Constant progression with dice-roll harvest excitement, critical harvest celebrations, instant feedback, stunning achievement popups, and luck-based variance that keeps every harvest thrilling.
3. **Deeply Strategic** - Balanced resource economy requiring smart decisions between growth (crops), income (animals), automation (buildings), luck upgrades (critical harvests), and progression (research). Enhanced tech tree with category/tier views.

**Complexity Level**: Complex Application (advanced functionality with full progression system)
  - Multi-layered progression system with crops, animals, buildings, technologies, achievements spanning 6 tiers. Dice-roll harvest mechanics with luck progression, comprehensive resource center, sticky resource bar, real-time production, and interconnected reward systems that keep players engaged. Performance-optimized for smooth 60 FPS gameplay.

## Essential Features

### Dice-Roll Harvest System (NEW!)
- **Functionality**: Every crop harvest rolls a dice (75-150% normal, 150-200% critical) to determine yield multiplier with exciting animations
- **Purpose**: Add thrilling variance and "one more harvest" addictive element to gameplay
- **Trigger**: Click ready crop → Dice rolls automatically → Animated number displays → Yield calculated → Resources awarded
- **Progression**: Base harvests (75-150%) → Unlock Luck techs → Higher critical chance → More consistent big yields
- **Success criteria**: Dramatic roll animations for criticals, satisfying normal rolls, clear percentage display, luck progression feels meaningful

### Luck Progression System (NEW!)
- **Functionality**: Three luck technologies (Lucky Harvest, Fortune Farming, Golden Touch) that increase critical harvest chance and improve roll ranges
- **Purpose**: Create long-term progression goal focused on maximizing harvest variance
- **Trigger**: Unlock techs → Critical chance increases by 2% per level → Roll ranges improve → Track critical harvest achievements
- **Progression**: 10% base critical → 12% (Tier 2) → 14% (Tier 3) → 16% (Tier 4) → Consistent amazing yields
- **Success criteria**: Clear luck stats visible, critical harvests feel special, progression feels impactful, achievements track critical count

### Sticky Resource Bar (NEW!)
- **Functionality**: Resource display remains fixed at top of screen while scrolling for constant visibility
- **Purpose**: Always see resource counts without scrolling back up
- **Trigger**: Scroll down page → Resource bar stays at top with backdrop blur → Always accessible
- **Progression**: Resources visible → Scroll down → Bar stays visible with subtle styling
- **Success criteria**: Smooth sticky behavior, no layout jumps, backdrop blur for readability, doesn't obscure content

### Resource Center Guide (NEW!)
- **Functionality**: Complete game encyclopedia with 6 tabs: Guide, Crops, Animals, Buildings, Tech, Achievements - explains everything
- **Purpose**: Centralized reference for all game mechanics and content without leaving the game
- **Trigger**: Click Guide tab → Browse categories → View detailed cards for every item → Understand mechanics
- **Progression**: Open guide → Select category → Scroll through all items → Read descriptions/costs/yields → Plan strategy
- **Success criteria**: Covers all 13 crops, 9 animals, 12 buildings, 36 techs, 30 achievements with complete details, welcoming guide section explains core mechanics

### AI Chatbot Advisor
- **Functionality**: Floating chat interface with contextual tips and Q&A system for farming advice
- **Purpose**: Guide players through complex systems and provide hints when stuck
- **Trigger**: Auto-opens with tips at key moments (first harvest, tech unlock, etc.) → User can click to chat → Ask questions about crops/animals/strategy
- **Progression**: Passive tips appear → Click bot icon → Chat interface opens → Ask questions or tap suggestions → Get instant answers
- **Success criteria**: Bot provides 10+ contextual tips, responds to crop/animal/building/tech/money/strategy keywords, feels helpful not intrusive

### Progression Path Visualization
- **Functionality**: Visual milestone tracker showing 11 key progression goals from first harvest to ultimate farmer
- **Purpose**: Show clear path forward, prevent confusion about what to do next
- **Trigger**: Always visible at top of screen → Shows current milestone with hint → Celebrates completed milestones
- **Progression**: Empty milestones → Current goal highlighted with hint → Complete goal → Milestone fills with checkmark → Next goal becomes active
- **Success criteria**: Clear visual progress, animated states, helpful hints for current goal, celebratory completed states

### Beautiful Achievement Popups
- **Functionality**: Full-screen animated celebration when achievements unlock with particles, rotation, and smooth animations
- **Purpose**: Make achievement moments feel special and rewarding
- **Trigger**: Achievement completes → Animated popup appears → Shows achievement icon, name, description, tier → Click to dismiss
- **Progression**: Achievement earned → Screen dims → Popup animates in → Trophy bounces → Particles scatter → User celebrates → Click to dismiss
- **Success criteria**: Smooth animations, feels premium, particles and effects, not skippable accidentally

### Enhanced Tech Tree Navigation
- **Functionality**: Dual-view tech tree (by category or by tier) with progress tracking, prerequisite checking, and clear status
- **Purpose**: Make the 33-technology tree easy to navigate and understand at a glance
- **Trigger**: Click Tech tab → Toggle between category/tier view → See all techs organized → Click to unlock
- **Progression**: View all techs → Toggle views → See locked/unlocked/affordable states → Check prerequisites → Unlock tech
- **Success criteria**: Both views show progress bars, techs show prerequisite status, locked techs clearly marked, affordable techs highlighted

### Smart Tab Notifications
- **Functionality**: Real-time badges on tabs showing pending actions: ready crops on Farm, available techs on Tech, new logs on Log
- **Purpose**: Guide attention to tabs that need interaction without being overwhelming
- **Trigger**: Crop ready → Farm tab shows count → Tech affordable → Tech tab shows count → New log entry → Log shows new count
- **Progression**: Action pending → Badge appears on tab → User checks tab → Badge clears
- **Success criteria**: Badges are clear but not overwhelming, Farm shows ready harvests, Tech shows affordable techs, Log shows new entries

### Tutorial System
- **Functionality**: 11-step interactive tutorial explaining every core mechanic with clear examples
- **Purpose**: Eliminate confusion, teach resource management, tech unlocking, animal care, and automation
- **Trigger**: Automatically on first load, skippable with button
- **Progression**: Welcome → Resources → Plant → Harvest → Tech → Buildings → Animals → Progress tracking → Achievements → Tips → Ready
- **Success criteria**: Player understands all systems and feels confident to start building their empire

### Resource Management (12 Resources)
- **Functionality**: Track gold, seeds, water, fertilizer, energy, research, hay, milk, eggs, wool, leather, meat with real-time updates
- **Purpose**: Create deep economic strategy with interconnected resource chains
- **Trigger**: Resources update instantly from harvests, animal production, building output
- **Progression**: Earn basic resources → Unlock animal resources → Process goods → Scale production
- **Success criteria**: All resources have clear tooltips explaining source and use, updates are instant

### Farm Plots (20 Plots, 3 Types)
- **Functionality**: Place crops (grow & harvest), animals (feed & collect), or buildings (passive production)
- **Purpose**: Spatial farm management requiring strategic placement decisions
- **Trigger**: Click empty plot → Choose category (crops/animals/buildings) → Select item → Confirm
- **Progression**: Empty plot → Place item → Watch timer/production → Harvest/collect → Repeat or build
- **Success criteria**: Every plot type has distinct visual design, clear status badges, hover explanations

### Crop System (13 Crops, 6 Tiers)
- **Functionality**: 13 unique crops from basic wheat to exotic crystal grain, each with distinct costs, grow times, and yields
- **Purpose**: Provide early-game income and research point generation
- **Trigger**: Click empty plot → Crops tab → Select crop → Plant → Wait for growth → Harvest
- **Progression**: Tier 1 basics (wheat, corn) → Tier 2 vegetables → Tier 3 fruits → Tier 4 advanced → Tier 5 exports → Tier 6 exotic
- **Success criteria**: Each crop has clear description, tier badge, cost/yield breakdown, growth visualization

### Animal System (9 Animals, 5 Tiers)
- **Functionality**: Raise chickens, cows, sheep, pigs, goats, ducks, horses, llamas, peacocks for continuous production
- **Purpose**: Provide passive resource generation requiring feed management
- **Trigger**: Unlock via tech → Click plot → Animals tab → Purchase animal → Auto-feeds when resources available
- **Progression**: Tier 1 chickens → Tier 2 livestock (cows/sheep/pigs) → Tier 3 advanced → Tier 4 premium → Tier 5 exotic
- **Success criteria**: Animals show hunger status, auto-feed from resources, produce on timer, clear tooltips explain mechanics

### Building System (12 Buildings, 6 Tiers)
- **Functionality**: Construct production buildings (wells, windmills, labs) and processing facilities (dairy, bakery, factory)
- **Purpose**: Automate resource generation for hands-off progression
- **Trigger**: Unlock via tech → Click plot → Buildings tab → Build → Produces resources automatically
- **Progression**: Tier 1 basics → Tier 2 energy/production → Tier 3 processing → Tier 4 research → Tier 5 solar/automation → Tier 6 factory
- **Success criteria**: Buildings show production status, output visible in real-time, tooltips explain production rates

### Technology Tree (36 Technologies, 5 Tiers)
- **Functionality**: Unlock new content and powerful efficiency upgrades using research points, including 3 luck technologies for harvest bonuses
- **Purpose**: Gate progression, reward strategic planning, provide multiplicative power increases
- **Trigger**: Earn research → Tech tab → Click technology → Spend research to unlock
- **Progression**: Basic unlocks → Efficiency upgrades → Luck techs (critical harvests) → Advanced content → Automation → Master Farmer (25% all bonuses)
- **Success criteria**: Technologies organized by category, show prerequisites, display clear benefits, luck techs clearly boost critical chance

### Achievement System (30 Achievements, 5 Tiers)
- **Functionality**: Complete goals for bonus rewards across harvest, wealth, tech, animals, production, special, and luck categories
- **Purpose**: Provide long-term goals, milestones, and bonus resources for completion
- **Trigger**: Reach milestone → Animated popup → Award resources instantly → Track in panel
- **Progression**: Basic goals (first harvest) → Intermediate (50+ harvests) → Advanced (500+) → Master (1000+) → Critical harvest tracking
- **Success criteria**: 30 achievements with new luck category (Lucky Strike, Fortune Favors, Luck Master, Fortune Incarnate), clear progress tracking, instant rewards
- **Purpose**: Provide additional progression layer with tangible rewards
- **Trigger**: Automatic progress tracking, instant reward on completion
- **Progression**: Tier 1 basics → Tier 2 intermediate → Tier 3 advanced → Tier 4 expert → Tier 5 master
- **Success criteria**: Progress bars show completion, rewards granted instantly, toast notifications on unlock

### Progression System (Full Content Overview)
- **Functionality**: Dedicated tab showing ALL content in game organized by category and tier with lock/unlock status
- **Purpose**: Let players see full progression path and plan long-term strategy
- **Trigger**: Click Progression tab → Browse by crops/animals/buildings/tech/overview
- **Progression**: View locked content → See requirements → Unlock via tech → Track completion percentage
- **Success criteria**: Every item shows tier, unlock status, requirements, detailed stats in tooltips

### Activity Log (200 Entry History)
- **Functionality**: Chronological log of all player actions with filtering by type, search, timestamps, resource gains
- **Purpose**: Track all progress, review recent actions, understand resource flows
- **Trigger**: All actions auto-logged → Click Log tab → Filter/search entries → Review history
- **Progression**: Action occurs → Logged with icon/message/resources → Searchable → Review anytime
- **Success criteria**: Log is comprehensive, filterable, shows resource changes, timestamps with "X ago" format

### Immediate Responsiveness
- **Functionality**: Zero-delay feedback on all actions - harvests, placements, unlocks all update state instantly
- **Purpose**: Make game feel snappy and rewarding with no frustrating delays
- **Trigger**: Any user action triggers immediate state update and visual feedback
- **Progression**: Click action → State updates instantly → Toast notification → Continue playing
- **Success criteria**: No artificial delays, all actions feel instant, UI updates immediately

### Toast Notification System
- **Functionality**: Beautiful rich notifications for harvests, unlocks, achievements with resource breakdowns
- **Purpose**: Provide satisfying feedback for every important action
- **Trigger**: Harvest crop → Plant item → Unlock tech → Complete achievement → Toast appears
- **Progression**: Action completes → Toast slides in → Shows details → Auto-dismisses → Log entry created
- **Success criteria**: Toasts are elegant, not intrusive, show relevant info, can be dismissed

## Edge Case Handling

- **Insufficient Resources**: Tooltips and UI clearly indicate when player can't afford something - red badges on costs, disabled state, helpful message
- **Empty States**: All tabs show helpful empty states with instructions when no content available
- **Animal Starvation**: Visual indicators show when animals are hungry, auto-feed system prevents death mechanic
- **Progress Loss**: Game state persists to browser storage, auto-saves on every action
- **Tutorial Skip**: Players can skip tutorial entirely if they want to explore themselves
- **Tooltip Overload**: Tooltips delay 100-200ms and are concise, only showing when helpful
- **Performance**: Game ticks at 100ms intervals for smooth animations without lag

## Design Direction

The design should feel modern, clean, and professional - like a well-crafted productivity app that happens to be a game. Minimalist aesthetic with generous whitespace, clear hierarchy, and purposeful use of color to communicate state. Inspired by the best elements of Cookie Clicker (satisfying progression), Stardew Valley (farming charm), and modern SaaS dashboards (clean information design).

## Color Selection

**Complementary Scheme** - Green primary (growth/nature) with strategic accent colors for different content types

**Primary Color** (oklch(0.65 0.18 145)): Fresh green representing agriculture and growth. Used for primary actions, unlocked content, success states.

**Secondary Colors**:
- Amber/Yellow (tier badges, warnings): Represents high-value items and attention items
- Blue (buildings, water): Technology and automation
- Purple (research, exotic): Advanced content and progression
- Red (destructive actions): Clear danger/warning

**Accent Color** (oklch(0.80 0.12 90)): Soft golden tone for highlights and completed states

**Foreground/Background Pairings**:
- Background (oklch(0.98 0.005 90)): Off-white #FAFBFA with Card white #FFFFFF - Black text (#333) - Ratio 12:1 ✓
- Primary (oklch(0.65 0.18 145)): Green #5BC085 - White text (#FFFFFF) - Ratio 4.9:1 ✓
- Accent (oklch(0.80 0.12 90)): Gold #E8D48C - Black text (#333) - Ratio 10:1 ✓
- Destructive (oklch(0.577 0.245 27.325)): Red #EB5757 - White text (#FFFFFF) - Ratio 4.8:1 ✓

## Font Selection

Modern, highly legible sans-serif fonts that feel approachable yet professional, ensuring excellent readability for long play sessions.

**Typographic Hierarchy**:
- H1 (Page Title): Fredoka Bold/32px/0.9 letter spacing - Friendly but professional
- H2 (Section Headers): Fredoka SemiBold/20px/normal - Clear hierarchy
- H3 (Card Titles): Fredoka SemiBold/16px/normal - Distinct subsections
- Body Text: Inter Regular/14px/1.5 line height - Highly readable
- Small Text (Labels): Inter Medium/12px/1.4 line height - Clear but compact
- Numbers (Resources): Inter SemiBold/16-20px/tabular-nums - Easy scanning

## Animations

**Contextual and Purposeful** - Animations exist only to provide feedback or guide attention. No gratuitous motion.

**Purposeful Meaning**:
- Crop growing: Subtle sway animation (3s ease-in-out loop) communicates life
- Ready state: Gentle pulse on border calls attention to harvest-ready crops
- Hover: Subtle scale (1.05x) and shadow on interactive elements
- Transitions: Smooth tab changes and dialog appearances (200-300ms)
- Toast: Slide-in from bottom-right with elegant bounce

**Hierarchy of Movement**:
1. User actions (harvest, place): Immediate state change, no artificial delay
2. Progress bars: Smooth fill animation showing time passage
3. Notifications: Toast appears with spring animation
4. Background production: No animation, just state updates

## Component Selection

**Components** (shadcn v4):
- Cards: Primary container for all plot items, tech items, achievement cards
- Tabs: Main navigation between Farm/Tech/Achievements/Progression/Log
- Dialog: Placement modal, tutorial overlay
- Tooltip: Extensive use for all hover explanations
- Progress: Crop growth, achievement progress, tier completion
- Badge: Tier indicators, status labels, resource costs
- ScrollArea: All content panels for smooth scrolling
- Button: All actions, clear hover states
- Input/Select: Activity log filtering

**Customizations**:
- Resource display: Custom grid layout with icons and numeric displays
- Farm grid: Custom 5x4 grid of plot cards with type-specific styling
- Tech tree: Grouped by category with visual flow
- Activity log: Custom timeline-style entries with icons

**States**:
- Default: Clean, minimalist appearance
- Hover: Subtle scale + shadow + border color shift
- Active: Pressed state with slight inset shadow
- Disabled: 50% opacity + not-allowed cursor
- Success: Green accent border/background
- Error: Red accent for insufficient resources

**Icon Selection** (@phosphor-icons):
- Resources: Coin, Plant, Drop, Leaf, Lightning, Flask (filled weight)
- Navigation: Farm, TreeStructure, Trophy, Sparkle, ListBullets (filled weight)
- Actions: Plus, Check, Lock, ArrowRight
- States: Clear semantic meaning, consistent weight

**Spacing**:
- Section gaps: 16px (4 tailwind units)
- Card padding: 12-16px
- Grid gaps: 12px for compact density
- Page margins: 16px on mobile, auto-center on desktop

**Mobile**:
- 3-column grid for plots on mobile (vs 5 on desktop)
- Stacked resource display (2 rows)
- Tab bar with icons only option
- Bottom sheet for placement dialog
- Touch-friendly 44px minimum hit targets
- Responsive max-width containers

## Performance & Testing

**Performance Optimizations**:
- **Memoization**: All game engine lookup functions cached (getCropById, getUnlockedCrops, etc.)
- **Change Detection**: Game loop only updates when actual changes occur (1-3ms vs 5-10ms)
- **React Optimization**: useMemo for expensive calculations, useCallback for event handlers
- **Custom Hooks**: useGameLoop with delta time tracking, useThrottle, useDebounce
- **Frame Budget**: 16ms target (60 FPS) with performance monitoring

**Test Coverage** (47 total tests):
- **Game Engine** (35 tests): Resource management, data retrieval, unlocking system, tech tree, calculations, harvest bonus, performance benchmarks
- **Performance Utils** (12 tests): Debounce, throttle, memoize, RAF throttle with timing verification

**Quality Assurance**:
- Unit tests for all critical game logic
- Performance tests ensure 10,000 operations < 100ms
- Memoization cache hit verification
- Immutability guarantees for resource operations
- Edge case handling (invalid IDs, insufficient resources)

See `PERFORMANCE.md` for detailed optimization guide and metrics.
