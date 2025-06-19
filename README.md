# Creo · @creo-framework/creo

> A CSS-first frontend framework for structured, accessible, and aesthetic websites.

---

### ⚠️ Status: Work in Progress

This is an **early-stage, experimental version** of Creo.  
It's being built in the open to allow for feedback and contribution, but **not ready for production use** just yet.

You are welcome to explore, fork, and follow development, but please expect breaking changes, incomplete components, and undocumented behavior for now.

---

## 🎯 Why Creo?

Tired of utility-heavy markup that looks like this?
```html
<div class="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
```

**Creo** focuses on semantic structure with clear, purposeful classes:
```html
<section class="c-hero">
  <div class="c-hero__content">
    <h1 class="c-hero__title">Your Amazing Product</h1>
    <p class="c-hero__subtitle">Build faster, ship smarter</p>
    <div class="c-hero__actions">
      <a href="#" class="c-button c-button--primary">Get Started</a>
    </div>
  </div>
</section>
```

**Design-forward structure, with developer-grade control.**

Perfect for marketing pages, landing sites, portfolios, product pages, and SaaS homepages, where visual hierarchy, responsive structure, accessibility, and speed matter.

*Not intended for complex web apps, admin dashboards, or internal tools.*

---

## 🚀 Quick Start

### Installation
```bash
# Via npm
npm install @creo-framework/creo

# Via CDN
<link href="https://unpkg.com/@creo-framework/creo/dist/creo.css" rel="stylesheet">
```

### Hello World
```html
<!DOCTYPE html>
<html>
<head>
  <link href="creo.css" rel="stylesheet">
</head>
<body>
  <section class="c-hero">
    <div class="c-hero__content">
      <h1 class="c-hero__title">Welcome to Creo</h1>
      <p class="c-hero__subtitle">CSS-first framework for modern websites</p>
      <div class="c-hero__actions">
        <a href="#" class="c-button c-button--primary">Get Started</a>
      </div>
    </div>
  </section>
</body>
</html>
```

### Customization with Design Tokens
```scss
// Override design tokens
@use '@creo-framework/creo' with (
  $creo-colors: (
    primary: #your-brand-color,
    accent: #60a5fa,
    neutral: #e5e7eb,
  ),
  $creo-spacing: (
    xs: 0.25rem,
    sm: 0.5rem,
    md: 1rem,
    lg: 2rem,
  )
);
```

---

## 🧩 Architecture & Philosophy

### 1. Structure First
Websites should be structured and designed before they are styled or animated. Creo enforces clarity of intent in markup, spacing, and layout hierarchy.

### 2. Progressive by Default
Creo defaults to modern standards: Responsive typography, accessibility best practices, and clean design tokens. Interactive features are optional and additive.

### 3. Modular, Not Monolithic
Import only what you need. Creo ships as a modular Sass codebase to prevent CSS bloat and enable tree-shaking.

### 4. BEM-lite Naming Convention
- **Components:** `.c-button`, `.c-hero`, `.c-card`
- **Layout:** `.l-grid`, `.l-section`, `.l-container`
- **Utilities:** `.u-text-center`, `.u-mb-lg`, `.u-px-sm`

---

## 📦 What's Included

### Core CSS Framework
- **Layout primitives:** Grid system, containers, sections with accessible defaults
- **Component library:** Buttons, navigation, heroes, cards, forms
- **Design tokens:** Consistent spacing, typography, and color scales  
- **Utility classes:** Spacing, text alignment, responsive helpers
- **Theme support:** Dark mode and custom theme capabilities
- **Two builds:** Full version or lean version for minimal CSS

### Optional JavaScript Layer
**@creo/interact** provides lightweight helpers for:
- Modals and dropdowns
- Accordions and toggles
- Form validation highlights
- Menu interactions

Designed to work cleanly with Alpine.js, htmx, and Stimulus.

---

## 📁 Project Structure

```plaintext
.
├── scss/                   # Core source files
│   ├── core/               # Reset, typography, tokens
│   │   ├── _reset.scss
│   │   ├── _tokens.scss
│   │   └── _typography.scss
│   ├── layout/             # Grid, sections, containers
│   │   ├── _grid.scss
│   │   ├── _sections.scss
│   │   └── _containers.scss
│   ├── components/         # Buttons, nav, hero, etc.
│   │   ├── _button.scss
│   │   ├── _hero.scss
│   │   └── _card.scss
│   ├── utilities/          # Spacing, text, responsiveness
│   │   ├── _spacing.scss
│   │   ├── _text.scss
│   │   └── _responsive.scss
│   ├── themes/             # Optional themes
│   │   └── _dark.scss
│   ├── creo.scss           # Full version (includes all)
│   └── creo.lean.scss      # Lean version (core + layout)
│
├── dist/                   # Compiled CSS outputs
│   ├── creo.css / .min.css
│   ├── creo.lean.css / .min.css
│   └── source maps
│
├── apps/docs/              # Documentation site (Astro + Creo)
├── build.js                # Custom build script
├── LICENSE
└── package.json
```

---

## 🎯 Use Cases

| Use Case | Recommend Creo? |
|----------|----------------|
| Portfolio site | ✅ Yes |
| SaaS marketing homepage | ✅ Yes |
| Product landing page | ✅ Yes |
| Agency/creative site | ✅ Yes |
| Personal blog | ✅ Yes |
| Admin dashboard | ❌ No |
| Internal tool UI | ❌ No |
| Complex web app | ❌ No |

---

## 🌐 Browser Support

- **Modern browsers:** Last 2 versions, >1% usage
- **IE11:** Not supported (uses CSS custom properties extensively)
- **Mobile:** Full support for iOS Safari and Chrome Android

---

## ♿ SEO & Accessibility

Creo is semantic by default with:
- Proper `<main>`, `<section>`, `<article>`, `<footer>` structures
- `<h1>`–`<h6>` hierarchy rules
- WCAG-compliant color contrast
- Landmarks and skip links in starter templates
- Visually hidden but accessible labels

---

## 🔧 Development

```bash
# Clone and install
git clone https://github.com/codedgar/creo.git
cd creo
npm install

# Build CSS
npm run build

# Watch for changes
npm run dev

# Build all versions
npm run build:all
```

---

## 📖 Documentation

- **[Getting Started Guide](https://creo-framework.dev/docs)** (Work in Progress)
- **[Component Library](https://creo-framework.dev/components)** 
- **[Design Tokens Reference](https://creo-framework.dev/tokens)**

---

## 🤝 Contributing

We're building Creo in the open and welcome contributions! Since this is early-stage:

- **Issues:** Bug reports and feature requests are appreciated
- **Pull Requests:** Please discuss larger changes in issues first  
- **Documentation:** Help improve examples and guides

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Homepage:** [creo-framework.dev](https://creo-framework.dev)
- **NPM Package:** [@creo-framework/creo](https://npmjs.com/package/@creo-framework/creo)
- **GitHub:** [codedgar/creo](https://github.com/codedgar/creo)
- **Discussions:** [GitHub Discussions](https://github.com/codedgar/creo/discussions)