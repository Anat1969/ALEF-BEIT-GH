# 🛠️ COWORK Instructions
## "22 Letters Living System" — Project Setup & Task Breakdown

---

## 📋 **Project Overview**

**Goal:** Build a complete system for exploring 22 Hebrew letters through visual, conceptual, and practical lenses.

**Deliverable:** 
- React web application
- 88 high-quality images (4 per letter)
- Complete interactive workflow system

**Timeline:** 7–10 days (parallel workflows)

---

## 🎯 **Your Role in COWORK**

You are the **Project Orchestrator**. Your job:
1. Review & approve specifications from CHAT
2. Break down work into daily tasks
3. Track progress
4. Manage dependencies between Claude Code tasks
5. QA the final output

**You do NOT code.** You organize, track, and coordinate.

---

## ✅ **Phase 1: Specification Review (Day 1)**

### **Inputs from CHAT:**
```
✅ 01_SCHEMA_letters.json (3 letters: א׳, ב׳, ג׳)
✅ 02_PROMPTS_generator.md
✅ 03_SKILLS_registry.md
✅ 04_WORKFLOW_specification.md
✅ 05_DESIGN_BRIEF.md
```

### **Your Tasks:**

1. **Read & Validate**
   - [ ] JSON syntax is correct (no duplicate keys, valid structure)
   - [ ] Prompts are clear and specific (not vague)
   - [ ] Skills are actionable (not abstract)
   - [ ] Design is cohesive (colors, fonts, spacing)

2. **Check Completeness**
   - [ ] 3 letters have all 7 dimensions
   - [ ] Each skill has time + action + outcome
   - [ ] Each prompt has spatial + human + technical layers
   - [ ] Design covers app + images + components

3. **Identify Blockers**
   - Any missing information?
   - Any contradictions?
   - Any technical constraints?

4. **Decision Gate**
   - ✅ **Go:** All specs clear, proceed to Phase 2
   - ❌ **No-Go:** Request revisions in CHAT before proceeding

### **Deliverable:**
```
APPROVAL CHECKLIST — file: PHASE1_APPROVAL.md
├─ Specifications complete: YES/NO
├─ Dependencies clear: YES/NO
├─ Timeline realistic: YES/NO
├─ Blockers identified: [list]
├─ Decision: GO / NO-GO
└─ Comments: [notes for team]
```

---

## 🔀 **Phase 2: Work Breakdown (Days 2–3)**

### **Three Parallel Workstreams:**

#### **Workstream A: IMAGE GENERATION**

**Owner:** Human (you)
**Duration:** 3–4 days
**Dependency:** None (can start immediately)

**Tasks:**
```
Day 1 (א׳ — Aleph):
  [ ] Copy prompt (Hebrew) from 02_PROMPTS_generator.md
  [ ] Open Midjourney
  [ ] Paste English prompt
  [ ] Generate 4 variations (upscale best)
  [ ] Save to: /outputs/gallery/aleph/
  [ ] Name: aleph_v1.png, aleph_v2.png, aleph_v3.png, aleph_v4.png
  [ ] Log in PROGRESS sheet: "א׳: 4 images generated"

Day 2 (ב׳ — Bet):
  [ ] Repeat process for bet
  [ ] Save to: /outputs/gallery/bet/
  [ ] Log progress

Day 3 (ג׳ — Gimel):
  [ ] Repeat process for gimel
  [ ] Save to: /outputs/gallery/gimel/

Day 4–onwards (ד׳–ת׳):
  [ ] Repeat for remaining 19 letters
  [ ] PARALLEL: Start ד׳ while ג׳ uploads, etc.
  [ ] Total: ~22 cycles × 30 min = 11 hours (spread over days)
```

**Deliverable:**
```
/outputs/gallery/
├── aleph/
│   ├── aleph_v1.png ✓
│   ├── aleph_v2.png ✓
│   ├── aleph_v3.png ✓
│   └── aleph_v4.png ✓
├── bet/
├── gimel/
└── ... (22 total)

File: IMAGE_LOG.md
├── Letter | Date | Variants | Status
├── א׳ | 2026-06-13 | 4 | ✓
├── ב׳ | 2026-06-13 | 4 | ✓
└── ...
```

---

#### **Workstream B: APP FOUNDATION (CLAUDE CODE)**

**Owner:** Claude Code
**Duration:** 1–2 days
**Dependency:** None (can start immediately)

**Tasks (assign to Claude Code):**
```
Initialize React Project:
  [ ] Create Vite project: npm create vite@latest 22-letters -- --template react
  [ ] Install dependencies: npm install
  [ ] Install Tailwind: npm install -D tailwindcss postcss autoprefixer
  [ ] Configure RTL: install tailwindcss-rtl plugin
  [ ] Folder structure created:
      src/
      ├── components/
      │   ├── Dashboard.jsx
      │   ├── LetterCard.jsx
      │   ├── Gallery.jsx
      │   ├── Network.jsx
      │   ├── Matrix.jsx
      │   └── Workflow.jsx
      ├── hooks/
      │   ├── useLetters.js
      │   └── useWorkflow.js
      ├── data/
      │   └── (will be populated)
      └── App.jsx

  [ ] Basic layout created:
      - Header with logo
      - Tab navigation (RTL)
      - Content area (placeholder)

  [ ] RTL configured & tested:
      - All text right-aligned
      - Flex direction reversed

  [ ] Color variables set:
      - Primary: #FFFFFF
      - Text: #1A1A1A
      - Accent: #2A5F5F
      - etc.

  [ ] JSON import working:
      - Read 01_SCHEMA_letters.json
      - Parse 3 letters (א׳, ב׳, ג׳)
      - Log to console for verification
```

**Deliverable:**
```
/outputs/app/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── App.jsx (renders)
│   ├── components/
│   ├── hooks/
│   └── data/
└── README.md (setup instructions)

Status: "React app initializes, RTL working, no errors"
```

---

#### **Workstream C: DATA ENHANCEMENT (COWORK)**

**Owner:** You (or can delegate to Claude via prompts)
**Duration:** 1 day
**Dependency:** Needs 01_SCHEMA_letters.json template

**Tasks:**
```
Expand JSON to all 22 letters:
  [ ] Copy 01_SCHEMA_letters.json → working copy
  [ ] For each letter ד׳ through ת׳:
      [ ] Fill all 7 dimensions (sonic, mathematical, physical, etc.)
      [ ] Write synthesis statement (essence + one-liner)
      [ ] Create skill (name, action, trigger time)
      [ ] Write spatial model description
      [ ] Create Midjourney prompt (English + Hebrew)

Validation:
  [ ] Check JSON syntax (no errors)
  [ ] Verify all 22 letters have same structure
  [ ] Ensure no duplicate values
  [ ] Verify skills times don't overlap (6:00–1:00 = 19 hours → fits)

Output:
  [ ] File: /outputs/data/letters_complete.json
  [ ] Status: "All 22 letters complete, validated"
```

**Checklist Template (for each letter):**
```
Letter ד׳ (Dalet):
  [ ] Core: name, number, gematria ✓
  [ ] Sonic: description complete ✓
  [ ] Mathematical: function clear ✓
  [ ] Physical: articulation described ✓
  [ ] Energetic: flow direction clear ✓
  [ ] Psychological: emotional state ✓
  [ ] Relationships: opposites, complements listed ✓
  [ ] Spatial: architectural principle ✓
  [ ] Synthesis: essence statement ✓
  [ ] Skill: action + time + outcome ✓
  [ ] Prompt: English + Hebrew complete ✓
```

---

## 📅 **Phase 2 Timeline**

```
Day 2:
  A: Generate א׳, ב׳, ג׳ images
  B: Initialize React app
  C: Expand JSON (parallel)

Day 3:
  A: Generate ד׳–ו׳ images (continue)
  B: Build LetterCard component (integrate JSON)
  C: Validate JSON

Day 4:
  A: Generate ז׳–י׳ images (continue)
  B: Build Gallery component
  C: (Idle, waiting for approval)

Day 5:
  A: Generate יא׳–יד׳ images (continue)
  B: Build Network diagram
  C: (Idle)

Day 6:
  A: Generate טו׳–יח׳ images (continue)
  B: Build Matrix component
  C: (Idle)

Day 7:
  A: Generate יט׳–כב׳ images (continue, final)
  B: Build Workflow component
  C: (Idle)

Day 8:
  A: QA images (all 88 ready)
  B: QA app (all components)
  C: Integration ready
```

---

## 🔌 **Phase 3: Integration (CLAUDE CODE)**

**Assign these tasks to Claude Code when Phase 2 is 80% complete:**

```
Tasks:
  [ ] Import letters_complete.json into React app
  [ ] Map JSON → LetterCard props
  [ ] Generate dynamic components for all 22 letters
  [ ] Load images from /outputs/gallery/
  [ ] Build Network diagram from relationships
  [ ] Create Matrix from dimension data
  [ ] Generate Workflow timeline from skills
  [ ] Implement filters & sorting
  [ ] Add export functionality (PDF, PNG, JSON)

Duration: 2–3 days
Dependency: Images + JSON + App foundation
```

---

## ✅ **Phase 4: Testing & QA (You)**

**Duration:** 1–2 days

### **Functional Testing**

**Dashboard:**
- [ ] All 22 letters appear in grid
- [ ] Click letter → opens card
- [ ] Back button works
- [ ] Search/filter works

**Letter Card:**
- [ ] Title, number, gematria display
- [ ] Image loads (no placeholder)
- [ ] All 7 dimensions visible
- [ ] Skill section complete
- [ ] Connections badges clickable

**Gallery:**
- [ ] All images load
- [ ] Grid responsive (3 cols desktop, 2 tablet, 1 mobile)
- [ ] Hover shows letter name
- [ ] Click → full-size view

**Network:**
- [ ] Nodes display (22 total)
- [ ] Edges show relationships
- [ ] Filters work (opposites, complements, sonic)
- [ ] Click node → navigate to letter

**Matrix:**
- [ ] Data loads (22×22 grid)
- [ ] Cells display correlation value
- [ ] Sortable by column
- [ ] Hover shows relationship

**Workflow:**
- [ ] Timeline shows 22 time slots
- [ ] Skills display with correct times
- [ ] Checkmarks toggle
- [ ] Skill details popup works

### **Visual Testing**

- [ ] RTL text renders correctly
- [ ] Font sizes consistent
- [ ] Colors match design brief
- [ ] Spacing uniform (8px, 12px, 16px, 24px)
- [ ] Buttons have hover/active states
- [ ] Mobile responsive (test on 375px, 768px, 1200px)

### **Performance Testing**

- [ ] Page loads in <2s
- [ ] Images lazy-load (if many)
- [ ] No console errors
- [ ] Smooth scrolling
- [ ] Tab switching instant

### **Content Testing**

- [ ] All text is right-aligned (RTL)
- [ ] No misspellings in Hebrew
- [ ] Prompts are complete
- [ ] Skills make sense
- [ ] Images reflect essence of letters

---

## 📊 **Daily Status Tracking**

Create file: `PROGRESS.md`

```markdown
# Daily Progress Log

## Day 2 (June 13)
**Workstream A (Images):**
- א׳: 4 variants generated ✓
- ב׳: 4 variants generated ✓
- ג׳: uploading...

**Workstream B (App):**
- React initialized ✓
- RTL configured ✓
- Folder structure created ✓
- JSON import working ✓

**Workstream C (Data):**
- JSON template expanded to 22 ✓
- Dimensions being filled (ד׳–ו׳ done, ז׳–י׳ 50%)

**Blockers:**
- Midjourney queue time ~30 min per batch

**Next:**
- Continue image generation
- Start LetterCard component
- Finish JSON by EOD

---

## Day 3 (June 14)
[Repeat format]
```

---

## 📦 **Deliverables Checklist**

### **End of Phase 1:**
- [ ] All specifications reviewed & approved

### **End of Phase 2:**
- [ ] 88 images (22 letters × 4 variants)
- [ ] React app foundation (compiles, RTL working)
- [ ] Complete JSON (all 22 letters, validated)

### **End of Phase 3:**
- [ ] App integrates all data
- [ ] All views functional
- [ ] Export working

### **End of Phase 4:**
- [ ] All tests passing
- [ ] No console errors
- [ ] Ready for deployment

---

## 📞 **Communication**

### **Sync Points:**
- **Daily:** 15-min standup (blockers + progress)
- **EOD:** Status update in PROGRESS.md
- **End Phase:** Go/No-go decision

### **Format:**
```
What got done today?
├─ A: 3 letters imaged
├─ B: LetterCard component built
└─ C: JSON expanded to 15 letters

What's blocked?
├─ Midjourney queue (working as expected)
└─ None critical

What's next?
├─ A: Continue ד׳–ו׳
├─ B: Build Gallery component
└─ C: Finish JSON validation
```

---

## 🎯 **Success Criteria**

### **Technical:**
- App loads without errors
- All 22 letters display
- Images load (no broken links)
- RTL text renders
- Responsive at 3 breakpoints

### **Visual:**
- Design consistent with brief
- Images match aesthetic
- Typography hierarchy clear
- Spacing uniform

### **Content:**
- All 7 dimensions filled
- 22 skills actionable
- Prompts capture essence
- Relationships make sense

### **UX:**
- Intuitive navigation
- Fast performance
- Smooth interactions
- Clear feedback

---

## 🚀 **Post-Launch**

Once app is complete, you can:
- Deploy to Vercel / Netlify
- Create PDF versions (letter guide, skills tracker)
- Generate print materials
- Build extensions (iOS app, Figma plugin)

---

## 📝 **Notes**

- **Assumption:** Team has access to Midjourney or DALL-E
- **Risk:** Image generation may be slower than expected
- **Mitigation:** Start early, batch submissions
- **Contingency:** Fallback to stock images if needed

---

## ✉️ **Next Steps**

1. **Review this document** — ask clarifications
2. **Approve Phase 1 specs** — gate or revise
3. **Start Phase 2 tasks** — assign to teams
4. **Track daily** — use PROGRESS.md
5. **QA Phase 4** — rigorous testing before launch

**Ready to begin?**

