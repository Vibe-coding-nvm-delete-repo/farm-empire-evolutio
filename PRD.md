# Farm Empire - Product Requirements Document

Build the ultimate idle farm empire game where players start with a small plot and grow into an agricultural tech conglomerate, unlocking advanced farming technologies, automating production chains, and ultimately achieving the goal of unlocking the "Master Farmer" technology and creating a self-sustaining farm that feeds the world.

**Experience Qualities**:
1. **Crystal Clear Progression** - Every player immediately understands what to do next through comprehensive tutorials, tooltips, and intuitive UI that removes all confusion
2. **Strategically Rewarding** - Meaningful choices between crops, buildings, and technologies with clear explanations of benefits and trade-offs
3. **Visually Satisfying** - Clean minimalist design with smooth animations, clear states, and delightful feedback for every action

**Complexity Level**: Light Application (multiple features with basic state)
  - Focused core loop: plant crops → harvest → earn resources → unlock tech → automate → expand. Tutorial system and comprehensive tooltips make the game accessible to anyone.

## Essential Features

### Onboarding Tutorial System
- **Functionality**: 7-step guided tutorial that teaches core mechanics on first launch
- **Purpose**: Eliminate confusion and ensure every player understands the game loop immediately
- **Trigger**: Automatically appears on first game load, can be skipped
- **Progression**: Welcome screen → Plant first crop → Watch growth → Learn about research → Explore tech tree → Build automation → Ready to play
- **Success criteria**: Players complete tutorial understanding the full game loop, or skip if already familiar

### Comprehensive Help System
- **Functionality**: Always-accessible help button with detailed accordion guide covering all mechanics
- **Purpose**: Provide reference documentation for confused players at any time
- **Trigger**: Click floating help button (question mark icon) in bottom-right corner
- **Progression**: Click help → Browse sections → Find answer → Close and continue playing
- **Success criteria**: Every game mechanic has clear explanation with strategy tips

### Tooltip System
- **Functionality**: Hover tooltips on every interactive element explaining function and strategy
- **Purpose**: Provide contextual help exactly when needed without overwhelming the UI
- **Trigger**: Hover over resources, crops, buildings, techs, or plots
- **Progression**: Hover element → Instant tooltip appears → Read explanation → Act with confidence
- **Success criteria**: Zero ambiguity - every element is self-explanatory on hover

### Core Resource System
- **Functionality**: Track gold, seeds, water, fertilizer, energy, and research points with real-time updates
- **Purpose**: Create meaningful economic decisions and resource scarcity that drives strategic planning
- **Trigger**: Resources update from harvests, building production, and tech unlocks
- **Progression**: Resource tooltips explain each resource → Real-time counter updates → Clear visual feedback on changes
- **Success criteria**: Players can see all resources, understand what each does via tooltip, and make informed decisions

### Plot & Crop System
- **Functionality**: 16 plots for placing crops and buildings, each with clear visual states (empty, growing, ready)
- **Purpose**: Give players spatial strategy and satisfying visual growth of their farm
- **Trigger**: Click empty plot to open placement dialog with crops and buildings
- **Progression**: Click plot → Browse crops/buildings with descriptions → Select affordable option → Watch growth with timer → Click ready crop to harvest
- **Success criteria**: Every plot state is visually obvious, tooltips explain what to do, harvest moment is satisfying

### Tech Tree System
- **Functionality**: 18 technologies across 5 categories: Crops, Automation, Buildings, Efficiency, Exotic
- **Purpose**: Long-term progression and strategic build diversity with clear explanations
- **Trigger**: Spend research points earned from special crops and labs
- **Progression**: Open tech tree → Hover techs to see benefits → Check prerequisites → Purchase unlocks → New content available
- **Success criteria**: Clear dependencies, detailed tooltips explaining impact, badge showing available techs

### Building & Automation System
- **Functionality**: Place buildings that automatically produce resources (Well, Windmill, Research Lab, etc.)
- **Purpose**: Create passive income and reduce clicking grind as players progress
- **Trigger**: Unlock buildings via tech tree, place on empty plots
- **Progression**: Research building tech → Open placement dialog → Select building → Watch it produce resources automatically
- **Success criteria**: Clear production rates shown, tooltips explain benefits, buildings feel impactful

### Achievement & Milestone System
- **Functionality**: Track 12 achievements across categories (harvesting, wealth, tech, automation, special)
- **Purpose**: Provide constant micro-goals and guide progression with rewards
- **Trigger**: Complete specific actions (harvest crops, unlock tech, earn gold)
- **Progression**: Action triggers check → Toast notification → Achievement unlocked → Reward granted → Progress to next tier
- **Success criteria**: Achievements feel organic, rewards meaningful, always something close to unlocking

## Edge Case Handling
- **Insufficient Resources**: Items you can't afford are clearly marked with red text and "Can't Afford" badge
- **No Crops/Buildings Available**: Tutorial guides to unlock via tech tree
- **Empty Farm**: Clear visual indicators (large + icons) show clickable empty plots
- **Growing Crops**: Progress bar and timer clearly show when crop will be ready
- **Rapid Clicking**: Each action shows toast notification confirming what happened
- **First Time Playing**: Comprehensive 7-step tutorial explains everything

## Design Direction
The design should feel minimalist and Apple-like - clean, spacious, with obvious interactive elements. Remove all visual clutter while maintaining delight through smooth micro-animations. Every element should be self-explanatory on hover with comprehensive tooltips removing all ambiguity.

## Color Selection
Analogous color scheme using shades of green for a cohesive, natural farming aesthetic that feels calm and focused rather than overwhelming.

- **Primary Color**: Fresh spring green `oklch(0.70 0.15 145)` - represents growth, nature, and the core farming experience. Used for CTAs, active plots, and positive progress indicators.
- **Secondary Colors**: Rich earth brown `oklch(0.45 0.08 60)` for soil/foundations and structures
- **Accent Color**: Golden harvest yellow `oklch(0.82 0.15 90)` - wealth, sunshine, completed harvests, and achievement moments. Attention-grabbing for rewards and unlocks.
- **Foreground/Background Pairings**:
  - Background (Soft cream `oklch(0.97 0.01 90)`): Dark brown text `oklch(0.25 0.02 60)` - Ratio 10.1:1 ✓
  - Card (White `oklch(0.99 0 0)`): Dark text `oklch(0.20 0.02 60)` - Ratio 13.5:1 ✓
  - Primary (Green `oklch(0.70 0.15 145)`): White text `oklch(0.99 0 0)` - Ratio 5.2:1 ✓
  - Secondary (Earth brown `oklch(0.45 0.08 60)`): White text `oklch(0.99 0 0)` - Ratio 6.8:1 ✓
  - Accent (Golden `oklch(0.82 0.15 90)`): Dark brown text `oklch(0.25 0.02 60)` - Ratio 8.9:1 ✓

## Font Selection
Typography should feel friendly and approachable yet clear for data - combining rounded sans-serif for personality with geometric precision for numbers.

- **Primary Font**: Fredoka (Google Fonts) - Rounded, playful headings that evoke farming joy
- **Secondary Font**: Inter (Google Fonts) - Clean, highly legible for UI text and numbers

- **Typographic Hierarchy**:
  - H1 (Game Title): Fredoka Bold/40px/tight letter-spacing
  - H2 (Section Headers): Fredoka SemiBold/24px/normal
  - H3 (Item Names): Fredoka Medium/18px/normal
  - Body (UI Text): Inter Regular/14px/1.5 line-height
  - Small (Tooltips): Inter Regular/13px/1.4 line-height
  - Numbers (Resources): Inter SemiBold/18px/tabular-nums

## Animations

Animations should be subtle and purposeful - enhancing clarity rather than demanding attention. Everything moves smoothly but quickly, with special celebration moments for major milestones.

- **Purposeful Meaning**: 
  - Crops gently sway while growing (showing life)
  - Ready crops pulse with glow (clear visual indicator)
  - Resource numbers animate on change (satisfying feedback)
  - Hover states scale slightly (clear interactivity)
  - Progress bars fill smoothly (clear time visualization)
  
- **Hierarchy of Movement**:
  1. High priority: Player action feedback (clicks, harvests)
  2. Medium priority: State changes (crop ready, task complete)
  3. Low priority: Ambient effects (crop sway, idle states)

## Component Selection

- **Components**: 
  - **Card**: Primary container for plots, crops, buildings, tech nodes - clean borders, subtle hover states
  - **Button**: Clear actions with Primary (plant/unlock) and Ghost (secondary actions) variants
  - **Progress**: Growth timers and task progress - smooth fill animation
  - **Dialog**: Placement selection, tutorial steps, help documentation
  - **Tooltip**: Comprehensive hover explanations on every interactive element
  - **Tabs**: Switch between Farm, Tech Tree, and Achievements
  - **Badge**: Resource counts, notification indicators, status labels
  - **ScrollArea**: Tech tree, help documentation, long lists
  
- **Customizations**: 
  - **Plot Grid**: 4x4 grid of large cards with clear empty state indicators
  - **Resource Bar**: Horizontal display with icon + number + tooltip for each resource
  - **Active Tasks Panel**: Simple list showing current crop growth with progress bars
  - **Placement Dialog**: Two-tab interface (Crops/Buildings) with large, detailed cards
  
- **States**:
  - Buttons: Default (clean), Hover (subtle scale + shadow), Disabled (obvious "Can't Afford" badge)
  - Plots: Empty (dashed border + large + icon), Growing (progress bar + timer), Ready (pulsing ring + "READY" label)
  - Tech Nodes: Locked (grayed + lock icon + prerequisite text), Available (colored + cost), Unlocked (checkmark + muted)
  - Resources: Normal display, hover shows detailed tooltip explanation
  
- **Icon Selection**:

- **Icon Selection**: 
  - Phosphor Icons throughout for consistency and clarity
  - Farm (farm view), TreeStructure (tech tree), Trophy (achievements), Question (help)
  - Lightning (energy), Drop (water), Coin (gold), Flask (research), Plant (seeds), Leaf (fertilizer)
  - Plus (add/empty plot), Check (complete), Lock (locked), Info (information)
  - Timer (countdown), TrendUp (yields), ArrowRight (navigation)
  
- **Spacing**:
  - Tight (gap-2/8px): Icon + label pairs
  - Normal (gap-4/16px): Card content, list items
  - Comfortable (gap-6/24px): Between sections
  
- **Mobile**:
  - Responsive grid: 4 columns desktop, 3 columns tablet, 2 columns mobile
  - Stack side panel below main content on mobile
  - Bottom navigation for primary tabs
  - Larger touch targets (min 44px) for all buttons
  - Full-screen dialogs instead of centered modals
