# Duhlab MVP Design System (v1.0)

## 1. Brand Philosophy
**"The Electric Lab"**
* **Vibe:** A hybrid of a Consumer Game (Juicy, Fun) and a Data Lab (Clean, Trustworthy).
* **Core Logic:**
    * **Blue (`#1A45FF`)** = Action, Digital, Tech.
    * **Yellow (`#FFC045`)** = Reward, Value, "The Wink".
    * **White/Grey** = The Canvas (Keep data legible).

---

## 2. Color Palette
*Adhere strictly to the 60-30-10 rule: 60% Neutrals, 30% Blue, 10% Yellow.*

### Primary Brand
* **Electric Blue:** `#1A45FF`
    * *Usage:* Primary Buttons, Active States, Header Bars, Selected Borders.
* **Marigold Yellow:** `#FFC045`
    * *Usage:* Rewards (Coins), Call-to-Action (Upgrade/Claim), Notification Badges (!).

### Neutrals (The Lab)
* **Text Navy:** `#192A56`
    * *Usage:* Primary Headings, Main Body Text. (Never use pure black).
* **Subtext Grey:** `#636E72`
    * *Usage:* Helper text, captions, inactive icons.
* **Canvas Grey:** `#F5F7FA`
    * *Usage:* App Backgrounds (The "Water" or "Fog" behind the island).
* **Surface White:** `#FFFFFF`
    * *Usage:* Cards, Bottom Nav Bar, Input Fields.

### Functional Status
* **Success Teal:** `#00D2D3`
    * *Usage:* Progress bar completion, "Correct" answers.
* **Error Red:** `#FF4757`
    * *Usage:* Time running out, Form errors.

---

## 3. Typography
*System uses Google Fonts. Fallback: San Francisco (iOS) / Roboto (Android).*

### Headings: [Outfit](https://fonts.google.com/specimen/Outfit)
*Geometric, friendly, slightly rounded. Use for personality.*
* **H1 (Screen Title):** Bold (700) | 24px | Line Height: 32px
* **H2 (Section Header):** Semi-Bold (600) | 20px | Line Height: 28px
* **H3 (Card Title):** Medium (500) | 18px | Line Height: 24px

### Body: [Inter](https://fonts.google.com/specimen/Inter)
*Clean, tall x-height, maximum legibility for survey questions.*
* **Body Large (Questions):** Medium (500) | 18px | Line Height: 26px
* **Body Regular (Description):** Regular (400) | 16px | Line Height: 24px
* **Caption/Label:** Regular (400) | 12px | Line Height: 16px | Color: Subtext Grey

---

## 4. UI Components (Atomic Elements)

### A. The "Duhlab Card"
*Everything sits on a card.*
* **Background:** `#FFFFFF`
* **Corner Radius:** `16px`
* **Border:** `1px Solid #EAEAEA` (Subtle definition)
* **Shadow:** `0px 4px 12px rgba(0, 0, 0, 0.05)` (Soft lift)

### B. Buttons (The "Juice")
*Make them feel clickable.*

**1. Primary Action (Next / Submit)**
* **Shape:** Full Pill (Height: 56px)
* **Color:** `Electric Blue`
* **Text:** White, Outfit Bold, 18px
* **Effect:** Add a hard shadow `0px 4px 0px #0F30B5` (Darker Blue) underneath.
    * *Pressed State:* Move button down 2px, reduce shadow to 2px.

**2. Reward Action (Claim / Shop)**
* **Color:** `Marigold Yellow`
* **Text:** Text Navy, Outfit Bold.
* **Effect:** Hard shadow `0px 4px 0px #E1A32A` (Darker Gold).

**3. Secondary / Ghost**
* **Background:** Transparent
* **Border:** `2px Solid #EAEAEA`
* **Text:** Subtext Grey.

### C. Survey Interactions
* **Answer Option (Default):** White Card, 1px Grey Border.
* **Answer Option (Selected):** White Card, **2px Electric Blue Border**, Pale Blue Tint Background (`#F0F3FF`).

---

## 5. Iconography & Imagery

### The Map (Home Screen)
* **Style:** 2.5D Isometric (Low Poly).
* **Reference:** "City Five" Asset Pack.
* **Palette Override:**
    * Change "Grass" to `Canvas Grey` or transparent platform.
    * Change "Windows" to `Electric Blue` tint.
    * Change "Awnings" to `Marigold Yellow`.

### Navigation Icons
* **Style:** Rounded, Thick Stroke (2px).
* **Active State:** Filled shape (Color: Blue).
* **Inactive State:** Outline shape (Color: Grey).

---

## 6. Layout & Spacing
* **Base Grid:** 8pt System. (All margins/padding should be multiples of 8: 8, 16, 24, 32).
* **Page Margins:** 24px (Keep content away from the edges for a breathable feel).
* **Card Spacing:** 16px between vertical cards.