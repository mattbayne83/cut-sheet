# CutSheet — Vision & North Star

## One-Liner

**Know how many sheets to buy before you get in the truck.**

## The Problem

It's Saturday morning. You've sketched a project on the back of an envelope — a bookshelf for your wife, a workbench, whatever. You need plywood. The question burning in your mind is simple: **do I need 1 sheet or 2?**

You could sit at a computer and type every dimension into an optimizer that looks like it was built in 2004. But you're not going to do that. You're going to eyeball it, probably buy an extra sheet "just in case," and eat $50-60 in waste. Or you'll buy too few and make a second trip.

The existing tools are built for the wrong moment. They assume you're at a desk, planning days ahead, entering data into a spreadsheet. But the real decision happens standing in your garage, phone in hand, sketch on the workbench, truck keys in your pocket.

## The Vision

CutSheet answers the question: **snap a photo of your sketch, see how many sheets you need, go buy them.**

Then — once you're back in the shop — print a clean cut diagram with dimensions and layout. Cut order is up to you. You know your tools.

Two distinct moments, one tool:
1. **The purchase decision** (phone, 60 seconds) — "I need 2 sheets."
2. **The cut reference** (print or phone at the saw) — clean diagram with dimensions.

No install. No subscription wall. No re-typing dimensions. No computer required.

### North Star Metric

**Time from "I have a sketch" to "I know how many sheets to buy"** — target: under 60 seconds.

### Design Principles

1. **Answer the question first.** The #1 output is a number: how many sheets. Everything else — layout diagrams, waste percentages, export options — is secondary. The hero moment is seeing "2 sheets" appear on your phone screen.

2. **Phone-first, not responsive-desktop.** This is a phone app that also works on desktop. Not the other way around. Every interaction must be designed for a thumb, in a garage, with sawdust on your hands.

3. **Sketch-first, not spreadsheet-first.** The natural starting point is a drawing on paper or in your head, not a data entry form. Photo extraction is the primary input, manual entry is the fallback.

4. **Respect the craft.** Woodworkers are precise, opinionated, and experienced. Don't tell them how to cut — give them the information and get out of the way. Cut order, fence settings, workflow — that's their domain.

5. **Algorithm honesty.** If the optimizer says 2 sheets and a woodworker can fit it on 1, the tool is broken. Optimization quality is non-negotiable.

6. **Generous by default.** The free tier should handle every real weekend project. Premium features should feel like upgrades, not unlocks of basics.

## Competitive Position

| Dimension | Market Status Quo | CutSheet |
|-----------|-------------------|----------|
| **Input** | Manual dimension entry | AI sketch extraction (Gemini Vision) |
| **UX** | 2000s-era desktop interfaces | Modern, responsive, mobile-first |
| **Platform** | Windows desktop or limited web | Browser — any device, no install |
| **Price** | $5-80/mo or aggressively limited free | Generous free tier |
| **Data** | Cookies (fragile) or local files | LocalStorage now, cloud sync later |
| **Workflow** | Design → re-enter in optimizer | Sketch → photo → cut list → saw |

### Unique Moat

**Nobody else does AI-powered dimension extraction from hand-drawn sketches.** This is genuine whitespace. The closest adjacent tools are construction blueprint readers (Kreo, Togal.ai) aimed at architects — not woodworkers, and not from casual sketches.

First-mover advantage is real here. The tech (Gemini Vision) is accessible, but the product insight — that woodworkers start with pencil and paper — is something the existing players haven't acted on.

## The Two Moments

The product serves two distinct moments in the same workflow:

### Moment 1: "How many sheets?" (Phone, Garage, 60 seconds)
- Snap photo of sketch → AI extracts dimensions → review/fix → see sheet count
- Hero output: **"2 sheets"** in huge type, with waste % and a thumbnail layout
- This must be fast, thumb-friendly, and work on a $200 Android phone
- This is the moment that earns trust and repeat usage

### Moment 2: "Where do I cut?" (Print or Phone at the Saw, 5 minutes)
- Clean cut diagram with piece labels and dimensions
- Color-coded pieces, large text, high contrast
- Print-ready PDF or full-screen phone view
- No cut order prescribed — the woodworker knows their tools and workflow

Everything in the backlog should be evaluated against: does this make Moment 1 faster, or Moment 2 more useful?

## Product Phases

### Phase 1: Foundation (Current — v1.0) ✅

What's built and working:
- Two optimization algorithms (guillotine best-fit + shelf packing)
- Manual piece entry with fraction support
- AI photo extraction via Gemini Vision
- SVG visualization with color-coded pieces
- PNG export at print quality
- Settings: sheet size presets, kerf width, units
- Full persistence (Zustand + localStorage)
- Responsive layout (mobile → desktop)

### Phase 2: The Phone Experience (v1.x)

Make Moment 1 bulletproof on mobile. Make Moment 2 print-ready.

- **Mobile-first redesign** — card-based piece input, full-width photo capture, large touch targets
- **Hero answer** — sheet count displayed prominently the instant optimization completes: "You need 2 sheets." Big, bold, impossible to miss.
- **Quick photo flow** — camera opens directly on mobile (not file picker), extract, review, optimize in 3 taps
- **Inline dimension correction** — when AI misreads "6" as "8", tap the number and fix it without leaving the flow
- **Shopping summary** — "2 sheets of 4'x8' plywood, ~$110 at $55/sheet." Purchase-decision-ready.
- **PDF export** — page 1 = shopping list + summary, page 2+ = cut diagrams with dimensions. Print before heading to the shop.
- **Grain direction** — per-piece grain lock so the optimizer respects veneer/plywood orientation
- **Use existing stock** — "I already have a half-sheet in the garage" → optimizer incorporates it

### Phase 3: Workshop Hub (v2.x)

Expand from single-use optimizer to a tool you keep coming back to.

- **Project library** — save, name, duplicate projects. "That bookshelf from last month."
- **Offcut inventory** — track leftover pieces across projects, auto-suggest reuse
- **Material library** — saved sheet goods with prices, grain, thickness
- **Multi-material projects** — mix 3/4" ply + 1/4" MDF in one project
- **Manual post-optimization adjustment** — drag pieces if you know your saw better than the algorithm
- **Shareable links** — text your spouse: "we need 2 sheets, here's the cut plan"
- **Cloud sync** — work on laptop, reference on phone at the saw

### Phase 4: Intelligence Layer (v3.x)

AI becomes a workflow partner.

- **Iterative sketch refinement** — "make the shelf 2 inches wider" via natural language
- **Design suggestions** — "this piece is close to a standard size, adjust to save a sheet?"
- **Waste pattern recognition** — "you have 3 projects this month, batch-cut these shared sizes"
- **CAD file parsing** — accept .skp, .f3d exports directly (no re-entry)
- **Linear material support** — board/lumber optimization (1D bin packing) for hardwood rails, trim

## Audience

### Primary: The Saturday Morning Woodworker
- It's the weekend. There's a project. They need plywood.
- Sketches on paper or cardboard, not CAD
- Comfortable with a table saw — knows how to cut, just needs to know what to buy
- Makes the purchase decision on their phone, in the garage or driveway
- Will not sit at a computer for a weekend project. If it doesn't work on a phone, it doesn't exist.
- Price-sensitive about materials ($50-60/sheet for quality ply) but won't pay for software either

### Secondary: Small Shop Professionals
- Cabinet makers, custom furniture builders
- 5-20 projects/month, material cost is a real line item
- Want layout diagrams they can print and pin up in the shop
- May integrate with SketchUp or Fusion 360 for larger projects
- Willing to pay for time savings on the planning side

### Tertiary: First-Time Builders
- Not traditional woodworkers — building their first bookshelf, desk, or storage
- Don't know plywood comes in 4x8 sheets, don't know kerf exists
- Need guidance and guardrails, not just optimization
- Mobile-native, share results via text to a partner ("do we need 1 or 2?")

## Success Metrics

| Metric | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|
| Monthly active users | 100 | 1,000 | 10,000 |
| Sketch-to-answer time (phone) | ~3 min | < 60 sec | < 30 sec |
| % sessions on mobile | — | > 60% | > 70% |
| Optimization quality (vs MaxCut) | Competitive | Parity | Best-in-class |
| Return usage (30-day) | 20% | 40% | 60% |
| Projects saved per user | 1 (no save) | 3 | 10+ |

## Monetization (Future — Phase 3+)

Not a priority now. Build something people love first. When the time comes:

- **Free tier**: Unlimited projects, full optimization, PNG export, local storage
- **Pro tier** ($5/mo or $40/yr): Cloud sync, PDF export with cut order, material library, offcut inventory, priority AI extraction
- **Never gate**: Core optimization, basic export, manual entry. These are table stakes.

## What We Will Not Build

- **Cut order / step-by-step guides.** The woodworker knows their tools and their preferred workflow. We show *where* the pieces go, not *how* to cut them. Adding cut sequence, fence-setting groups, or step-by-step modes adds complexity that serves the tool's ego, not the user.
- **A CAD tool.** SketchUp and Fusion exist. We optimize cuts, not design furniture.
- **A CNC toolpath generator.** Different problem, different users.
- **An industrial panel optimization system.** Our audience is humans with table saws, not factories with beam saws.
- **Social features, forums, or community.** The tool should be fast and focused.
