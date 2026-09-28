# Vozinha Store (`vozinha.store.cv`) — Official Project Plan & Architecture

> **A Pure Frontend Experiential Showcase & Merch Drop Landing Page**  
> Dedicated to Josimar José Évora Dias (**Vozinha**), Legendary Goalkeeper & Captain of Cabo Verde (*Tubarões Azuis*).

---

## 1. Project Overview & Philosophy

### Core Concept: "The Wall of Cabo Verde"
The goal is to build an atmospheric, high-impact, pure-frontend landing page that honors Vozinha's legacy and directs fans to purchase the debut official T-shirt.

### What We Cut (Zero Bloat)
* ❌ **No Waitlists / Forms**: No email inputs, no database, no captcha.
* ❌ **No E-Commerce Backend on this site**: No Shopify API, no cart drawers, no Stripe keys. The site has one direct CTA button that links out to the actual store/checkout.
* ❌ **No Nav Menu Clutter**: No complex dropdowns, currency switchers, or multi-page routing.
* ❌ **No Spec Sheets**: No fabric weights or tech specs to distract from the raw aesthetic.

### What We Build (High-Impact Frontend Showpiece)
* ✅ **Pure Visual Storytelling**: Dark, moody stadium atmosphere with subtle smoke and gold accents.
* ✅ **The Comments Storm**: Screenshots of viral social media comments floating across the screen (adapted from the Digital Dropouts "leaves" particle engine).
* ✅ **The 3D Vault of Legendary Saves**: Vozinha standing center-stage while photos/clips of him stopping Messi, Ronaldo, Neymar, and world-class titans orbit him in 3D.
* ✅ **The T-Shirt Drop**: A striking product visual with a direct **"Buy Now" / "Shop Now"** button redirecting to the external store.

---

## 2. Section-by-Section Blueprint

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HERO               Vozinha. Stance. Name. Presence.      │
├─────────────────────────────────────────────────────────────┤
│ 2. THE STORY          Mindelo to the World Cup & 29M Wave   │
├─────────────────────────────────────────────────────────────┤
│ 3. THE COMMENTS STORM Social comments drifting horizontally │
├─────────────────────────────────────────────────────────────┤
│ 4. THE VAULT (3D)     Vozinha in center, saves orbiting him │
├─────────────────────────────────────────────────────────────┤
│ 5. THE T-SHIRT DROP   Drop 01 Preview + Direct "Shop Now"   │
├─────────────────────────────────────────────────────────────┤
│ 6. FOOTER             © Vozinha & V1 Group. Social Links.   │
└─────────────────────────────────────────────────────────────┘
```

---

### Section 1: Hero ("The Presence")
* **Goal**: Instant emotional impact and presence.
* **Visuals**:
  - Full-screen dark stadium atmosphere (`#03070D` / `#0C2645`).
  - High-contrast hero imagery/cutout of Vozinha focused, arms crossed, wearing gloves.
  - Subtle procedural mist/smoke drifting across the canvas.
* **Copy**:
  - **Title**: `VOZINHA` (Giant athletic display font: *Bebas Neue* or *Norwester*).
  - **Subline**: *"Captain. Guardian. The Wall of Mindelo."* (*Cormorant Garamond* italic).
  - **Status Pill**: `Cape Verde #1 | 29M+ Global Wave`.
* **Action**: Subtle scroll down indicator + optional direct anchor to `#drop`.

---

### Section 2: The Story ("Mindelo to 29 Million")
* **Goal**: Establish the legend without boring text walls.
* **Layout**: Asymmetrical 2-column or bold center-aligned narrative:
  - **The Roots**: Born in Mindelo, São Vicente (1986). A lifetime of resilience.
  - **The National Hero**: Captaining the *Tubarões Azuis* (Blue Sharks) across historic AFCONs and world competitions.
  - **The Viral Explosion**: The historic draw against Spain (Man of the Match) and Casimiro’s live shoutout on CazéTV that ignited **29 Million+** supporters worldwide.
* **Aesthetic**: Bold headline, high-contrast black-and-white portraits, glowing gold highlights (`#F2D36E`).

---

### Section 3: The Comments Storm (Drifting Social Proof)
* **Goal**: Let real fans around the world tell the story.
* **Engine**: Adapted from the Digital Dropouts **"Leaves Engine"**.
* **Visuals & Mechanics**:
  - Curated screenshot cards of comments from Instagram (`@vozinha_oficial`), Twitter/X, YouTube, and CazéTV chat.
  - Floating continuously from right to left with gentle sinusoidal vertical sway.
  - **Hover Interaction**: Hovering over any card pauses its motion, flattens rotation to `0deg`, and scales to `1.3x` for crisp readability.
  - **Click Interaction**: Opens in a fullscreen lightbox modal.
  - **Atmosphere**: Oceanic dark gradient background with floating particle depth.

---

### Section 4: The Vault (Vozinha & The 3D Saves Orbit)
* **Goal**: The undeniable proof of legend — him stopping the greatest players on the planet.
* **Engine**: Adapted from the Digital Dropouts **"Vault 3D Orbit Engine"**.
* **Visuals & Mechanics**:
  - **Center**: High-resolution cutout of Vozinha standing firm in goalkeeper stance.
  - **3D Orbiting Cards**: Satellite cards rotating in an elliptical 3D trajectory around him:
    - *Save vs. Lionel Messi*
    - *Save vs. Cristiano Ronaldo*
    - *Save vs. Neymar Jr.*
    - *Historic AFCON & World Stage stops*
  - **Z-Index Layering**: Cards seamlessly pass *behind* his back and *across* his chest as they revolve.
  - **Interaction**: Hovering pauses orbit; clicking an orbiting card opens the full HD photo or match clip in a lightbox.

---

### Section 5: The Drop ("The Guardian Tee — Drop 01")
* **Goal**: Convert hype into immediate store visits.
* **Visuals**:
  - Dark pedestal presentation with studio spotlighting on the debut official T-shirt.
  - Interactive **Front / Back** hover or toggle switch.
  - Clean, distressed streetwear design celebrating his iconic number `#1` and Cabo Verdean roots.
* **Copy**:
  - **Title**: `THE GUARDIAN TEE — DROP 01`
  - **Tagline**: *"Official Josimar 'Vozinha' Dias Limited Capsule."*
  - **Status Badge**: Glowing gold badge: `AVAILABLE NOW` (or `OFFICIAL MERCHANDISE`).
* **The Single Action**:
  - **One bold button**: `BUY NOW` / `SHOP THE DROP` $\to$ Direct external link opening your checkout/shop page in a new tab.
  - No forms, no waitlists, no multi-step friction.

---

### Section 6: Minimalist Footer
* **Content**:
  - `VOZINHA.STORE.CV`
  - Official certification line: *"Official Josimar 'Vozinha' Dias Platform. Exclusively represented by V1 Group."*
  - Social media links: Official Instagram, CazéTV moment, and YouTube.
  - Minimal copyright: `© 2026 Vozinha. All Rights Reserved.`

---

## 3. Design System & Tokens

```css
:root {
  /* Surfaces & Backgrounds */
  --bg-deep:           #03070d;                  /* Stadium midnight black */
  --bg-navy:           #0c2645;                  /* Cape Verde Atlantic navy */
  --bg-card:           rgba(12, 38, 69, 0.7);    /* Translucent glass card */
  --line-border:       rgba(242, 211, 110, 0.15);/* Subtle gold star divider */

  /* Inks (Typography) */
  --ink-primary:       #ffffff;                  /* Pure stadium white */
  --ink-secondary:     #e9f0ec;                  /* Soft bone body text */
  --ink-muted:         #8c9ba5;                  /* Slate captions */

  /* Brand Accents */
  --cv-gold:           #f2d36e;                  /* Golden star accent & buttons */
  --cv-gold-glow:      rgba(242, 211, 110, 0.45);/* Gold button aura */
  --cv-blue:           #003882;                  /* National flag blue */
  --cv-red:            #d63138;                  /* National flag red stripe */

  /* Typography Pairing */
  --font-athletic:     'Bebas Neue', 'Impact', sans-serif; /* H1, H2, Numbers */
  --font-narrative:    'Cormorant Garamond', serif;        /* Sublines, quotes */
  --font-street:       'Space Mono', 'Special Elite', monospace; /* Labels, badges */
}
```

---

## 4. Technology Stack & Architecture

* **Frontend Engine**: Lightweight, pure static build (Astro or standalone HTML5/ES6/CSS).
* **Animation & Physics**:
  - **GSAP 3.12 + ScrollTrigger**: Smooth scroll reveals, timeline choreography.
  - **HTML5 Canvas 2D**: Procedural mist/smoke particles.
  - **Vanilla Physics Loop**: Drifting comments storm with `requestAnimationFrame`.
  - **CSS 3D / Trigonometric Orbit**: Satellite cards revolving around Vozinha.
* **Hosting / Deployment**:
  - Static edge deployment (Cloudflare Pages, GitHub Pages, or Vercel).
  - Domain pointing: Custom domain `vozinha.store.cv` with SSL.
* **Maintenance Overhead**: **Zero**. No servers, no database, no security patching required.

---

## 5. Asset Checklist

| Asset | Format | Purpose |
| :--- | :--- | :--- |
| **Vozinha Hero Cutout** | Transparent PNG / WebP | Hero section & Center of 3D Orbit |
| **Editorial Match Photos** | High-Res WebP | Story section backdrop & lightbox |
| **Save Moments (Messi, Ronaldo, Neymar)** | WebP (or short MP4 clips) | Orbiting satellite cards in The Vault |
| **Social Proof Screenshots** | Cropped WebP cards | Drifting Comments Storm |
| **T-Shirt Product Mockup** | Transparent PNG (Front + Back) | Drop 01 showcase |
| **Destination Shop URL** | Web link | "Buy Now" button target |

---

## 6. Implementation Roadmap

1. **Step 1 — Foundation**: Scaffold repository structure, configure design tokens, colors, and embedded typography.
2. **Step 2 — Atmospheric Canvas**: Implement procedural smoke and dark Atlantic stadium background layers.
3. **Step 3 — Hero & Story Sections**: Build high-impact title, quote, and biographical narrative.
4. **Step 4 — Comments Storm Engine**: Port and adapt the horizontal drifting screenshots system with hover freeze and lightbox.
5. **Step 5 — The 3D Vault Orbit Engine**: Implement the center Vozinha cutout with revolving saves against top players.
6. **Step 6 — T-Shirt Drop Showcase**: Build the product visual presentation with the direct shop redirect button.
7. **Step 7 — Polish & Mobile Optimization**: Verify responsiveness across mobile, tablet, and desktop, then push to GitHub.
