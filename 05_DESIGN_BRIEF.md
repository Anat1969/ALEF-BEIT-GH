# 🎨 Design Brief
## "22 Letters Living System" — Visual Identity & Aesthetics

---

## 🎯 **Core Design Principle**

**Minimalism Meets Depth**

- Visual simplicity on surface
- Conceptual richness underneath
- Every element serves two purposes: beauty + meaning
- Mediterranean light as constant reference

---

## 📐 **Visual System**

### **Typography**
- **Primary Font:** Segoe UI / Rubik (Hebrew-friendly sans-serif)
- **Fallback:** Arial / -apple-system
- **Weights:** 400 (regular), 500 (semibold), 700 (bold)
- **Sizes:**
  - H1: 28px (letter titles)
  - H2: 20px (section headers)
  - Body: 16px (main content)
  - Small: 12px (labels, annotations)
  - Micro: 11px (timestamps, metadata)

### **Color Palette**
```
PRIMARY:
  - Background: #FFFFFF (pure white)
  - Text: #1A1A1A (near-black)
  - Border: #E0E0E0 (light gray, 0.5px)
  - Accent: #2A5F5F (teal — Mediterranean water)

SEMANTIC:
  - Info: #378ADD (blue)
  - Success: #639922 (green)
  - Warning: #BA7517 (amber)
  - Danger: #E24B4A (red)

NEUTRAL SCALE:
  - #F5F5F5 (surface)
  - #EBEBEB (hover)
  - #D3D1C7 (secondary text)
  - #888780 (tertiary text)
```

### **Typography Colors**
```
- Primary text: #1A1A1A
- Secondary text: #666666
- Tertiary text: #999999
- On colored background: Use darkest shade of that color
```

---

## 🖼️ **Letter Card Design**

### **Layout (RTL)**
```
┌────────────────────────────────────┐
│ א׳ (אלף) — Letter #1              │  ← Title (24px, right-aligned)
├────────────────────────────────────┤
│                                    │
│  [Image 400×300px, bordered]       │  ← Centered, with frame
│                                    │
├────────────────────────────────────┤
│ ✨ Essence                         │  ← Label (12px, caps)
│ "התחלה טהורה..."                   │  ← Quote (18px, italic)
│                                    │
│ 🔊 Sonic                           │  ← Label
│ קול פתוח, נשימה טהורה             │  ← Body (14px)
│                                    │
│ ⚡ Energetic                        │  ← Label
│ פתיחה רדיאלית, עלייה למעלה        │  ← Body
│                                    │
│ 💼 Skill #1: פתיחת היום           │  ← Skill box (gray background)
│ ├─ Time: 06:00–07:00              │
│ ├─ Action: נשימה × 3 + 3 כוונות    │
│ └─ Outcome: מצב כלִיּוּת           │
│                                    │
│ 🔗 Connections                     │  ← Label
│ [ת׳ opposite] [ב׳ complement]    │  ← Badges
│                                    │
│ [← View More] [↓ Download]        │  ← Actions
└────────────────────────────────────┘
```

### **Dimensions:**
- Card width: 600px (max)
- Card padding: 2rem (24px)
- Image size: 400×300px (4:3 ratio)
- Border: 0.5px solid #E0E0E0
- Border-radius: 12px (card), 8px (buttons)
- Box-shadow: None (flat design)

---

## 🖼️ **Image Specifications (Midjourney)**

### **Dimensions:**
- **Aspect ratio:** 16:9 (landscape)
- **Resolution:** 1920×1080px (minimum)
- **Quality:** Maximum detail, sharp focus

### **Visual Language:**
```
CONSISTENT ACROSS ALL 22:
✅ Professional architecture photography
✅ Documentary realism (not artistic render)
✅ Mediterranean light (natural, golden hour / morning)
✅ Human figure (1–2 people, small scale)
✅ Minimal color palette (white, gray, earth tones)
✅ Clean lines, no clutter
✅ Negative space (breathing room)

FORBIDDEN:
❌ Text / words / letters
❌ Artificial lighting (neon, studio)
❌ Stylized or illustrative
❌ Multiple unrelated objects
❌ Dark / moody / dramatic
❌ Crowded composition
```

### **Light Quality:**
- **Time of day:** Early morning or golden hour (sunset)
- **Direction:** Side lighting (creates shadow/depth)
- **Color temperature:** Warm (3000K–4000K, not cool blue)
- **Intensity:** Soft, never harsh

---

## 🎨 **App Layout (RTL)**

### **Header**
```
[← Menu] [Logo "22 אותיות"] [⚙️ Settings]
(height: 56px, sticky)
```

### **Tabs (Navigation)**
```
[לוח בקרה] [אות בודדת] [גלריה] [קשרים] [מטריצה] [Workflow]
(underline active tab in accent color)
```

### **Dashboard View**
```
📍 בחר אות לחקירה

Grid of 22 letter thumbnails:
┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│א │ │ב │ │ג │ │ד │ │ה │ │ו │ ...
│1 │ │2 │ │3 │ │4 │ │5 │ │6 │
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘

(100px × 100px squares, 6–8 per row)
(Click → expand to full card)
```

### **Gallery View**
```
Grid of images:
┌────────┐ ┌────────┐ ┌────────┐
│ א׳ v1 │ │ א׳ v2 │ │ א׳ v3 │ ...
│ image │ │ image │ │ image │
└────────┘ └────────┘ └────────┘

(140px × 140px thumbnails, responsive)
(Hover → show letter name)
```

### **Network View**
```
[Filters: All | Opposites | Complements | Sonic]

   א׳
   /|\
  / | \
 ב׳ |  ת׳
  \ | /
   \|/
   ג׳

(SVG diagram, interactive nodes)
(Click node → navigate to letter)
```

### **Workflow View**
```
Timeline:
06:00 → א׳ פתיחת היום ✓
07:00 → ב׳ בחירה בדואל ✓
08:00 → ג׳ גמול העמל ○
...
22:00 → ת׳ סוף יום ○

(Linear flow, drag to reorder, mark as done)
```

---

## 🎨 **Component Design**

### **Button (Standard)**
```
Padding: 12px 16px
Border: 0.5px solid #E0E0E0
Background: transparent
Border-radius: 8px
Font: 14px / 400
Color: #1A1A1A
Hover: Background #F5F5F5, Border #CCCCCC
Active: Background #E0E0E0, Scale 0.98
```

### **Input Field**
```
Height: 36px
Padding: 8px 12px
Border: 0.5px solid #E0E0E0
Border-radius: 8px
Font: 14px
Direction: RTL
Placeholder: #999999
Focus: Border #2A5F5F
```

### **Badge (Connection)**
```
Padding: 8px 12px
Background: #F5F5F5
Border: 0.5px solid #E0E0E0
Border-radius: 6px
Font: 12px
Hover: Background #EBEBEB
```

### **Skill Box**
```
Background: #F5F5F5
Border: none
Padding: 12px
Border-radius: 8px
Lines: 14px

Key: font-weight 500
Value: color #666666
```

---

## 📏 **Spacing (Rem-based)**

```
Gap between elements:      8px / 12px / 16px / 24px
Card padding:             2rem (32px)
Section padding:          1.5rem (24px) vertical
Vertical rhythm:          1.5rem (24px)
```

---

## 📱 **Responsive Design**

### **Desktop (1200px+)**
- 6–8 columns for thumbnails
- Card full width (600px centered)
- Side panels visible

### **Tablet (768px–1199px)**
- 4–5 columns for thumbnails
- Card full width (narrow margins)
- Collapsible side panels

### **Mobile (< 768px)**
- 2–3 columns for thumbnails
- Card full width (edge-to-edge with padding)
- Hamburger menu
- Vertical tabs (scroll)

---

## 🌑 **Dark Mode (If Needed)**

```
Background: #1A1A1A
Text: #F5F5F5
Border: #333333
Accent: #4DBBA0 (lighter teal)
Surfaces: #2A2A2A
```

---

## 🎬 **Micro-Interactions**

### **Hover States**
- Border darkens slightly
- Background fills lightly
- Slight scale increase (1.02x)

### **Click States**
- Scale decreases (0.98x)
- Feedback haptic (if mobile)

### **Transitions**
- Duration: 200ms
- Easing: ease-in-out
- Properties: border-color, background, transform

### **Loading States**
- Skeleton loaders (gray pulse)
- Progress bar for image load
- Lazy-load images as you scroll

---

## 🔤 **Text Styles**

### **Letter Title (Hebrew)**
```
Font: 28px / 500
Color: #1A1A1A
Text-align: right (RTL)
Margin-bottom: 8px
```

### **Essence Quote**
```
Font: 18px / 400
Style: Italic
Color: #2A5F5F (accent)
Margin: 1rem 0
Line-height: 1.6
```

### **Dimension Labels**
```
Font: 12px / 500
Text-transform: uppercase
Color: #999999
Letter-spacing: 0.5px
Margin-bottom: 8px
```

### **Body Text**
```
Font: 14px / 400
Color: #1A1A1A
Line-height: 1.7
Margin-bottom: 1rem
```

---

## 📊 **Grid System**

### **12-Column RTL Grid**
```
Gutter: 16px
Max-width: 1200px
Breakpoints:
  - Desktop: 1200px (1 column)
  - Tablet: 768px (2 columns)
  - Mobile: 480px (4 columns)
```

---

## 🎯 **Accessibility**

### **Contrast**
- All text: min 4.5:1 (WCAG AA)
- Interactive: clear focus outline (2px)

### **Size**
- Minimum tap target: 44×44px
- Minimum text: 12px

### **Direction**
- All text: `dir="rtl"`
- All flex: `flex-direction: row-reverse`

---

## 📸 **Image Treatment**

### **Card Image**
- Aspect ratio: 4:3
- Border: 1px solid #E0E0E0
- Border-radius: 8px
- Box-shadow: None
- Object-fit: cover
- Loading: Skeleton while fetching

### **Thumbnail Image**
- Aspect ratio: 1:1
- Border: 0.5px solid #E0E0E0
- Border-radius: 6px
- Hover: Border darkens

---

## 📝 **Font Stack (Hebrew)**

```css
font-family: -apple-system, "Segoe UI", "Rubik", "Ubuntu", 
             "DejaVu Sans", sans-serif;
```

**Why this order:**
1. Native OS fonts (fastest)
2. Rubik (Hebrew-optimized)
3. Fallbacks
4. Generic sans-serif

---

## 🎨 **Breakpoints (Tailwind-based)**

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## ✅ **Design Checklist**

- [ ] All text is right-aligned (RTL)
- [ ] Colors pass WCAG AA contrast
- [ ] Images are 16:9 (prompts only)
- [ ] No artificial elements (icons, filters)
- [ ] Mediterranean light/warmth consistent
- [ ] Minimal color palette (white, gray, accent)
- [ ] Whitespace generous (breathing room)
- [ ] Typography hierarchy clear
- [ ] Responsive at 3 breakpoints
- [ ] Loading states visible

---

## 📚 **Reference Images**

*Inspirational mood board for visual direction:*

- Mediterranean architecture (white walls, light)
- Japanese minimalism (emptiness as design)
- Bauhaus (function + form)
- Nature photography (soft light, composition)

---

## 🎬 **Prototype / Demo**

Prototype HTML should include:
- Sample card (א׳)
- Sample gallery (3 letters)
- Sample network (3 nodes)
- All interactive states

