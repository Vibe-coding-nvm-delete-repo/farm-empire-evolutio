# Farm Empire - Product Requirements Document

Build an expansive, deeply engaging idle farm empire game where players progress from a small farmer to an agricultural tycoon. The game features 13 crops, 9 animals, 12 buildings, 33 technologies, and 26 achievements across 6 tiers of progression. Players plant crops, raise livestock, research technologies, automate production, and track every action through a comprehensive activity log.

**Experience Qualities**:
1. **Crystal Clear & Minimalist** - Clean, modern UI with comprehensive tooltips on every element. No confusion, only strategic decisions.
2. **Maximally Rewarding** - Constant progression with meaningful unlocks, instant feedback, and satisfying rewards at every tier.
3. **Deeply Strategic** - Balanced resource economy requiring smart decisions between growth (crops), income (animals), automation (buildings), and progression (research).

**Complexity Level**: Complex Application (advanced functionality with full progression system)
  - Multi-layered progression system with crops, animals, buildings, technologies, achievements spanning 6 tiers. Comprehensive activity logging, real-time production, and interconnected reward systems that keep players engaged.

## Essential Features

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

### Technology Tree (33 Technologies, 5 Tiers)
- **Functionality**: Unlock new content and powerful efficiency upgrades using research points
- **Purpose**: Gate progression, reward strategic planning, provide multiplicative power increases
- **Trigger**: Earn research → Tech tab → Click technology → Spend research to unlock
- **Progression**: Basic unlocks → Efficiency upgrades → Advanced content → Automation → Master Farmer (25% all bonuses)
- **Success criteria**: Technologies organized by category, show prerequisites, display clear benefits, unlock immediately

### Achievement System (26 Achievements, 5 Tiers)
- **Functionality**: Complete goals for bonus rewards across harvest, wealth, tech, animals, production, special categories
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
