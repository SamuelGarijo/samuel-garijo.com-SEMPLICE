# Samuel Garijo Portfolio - Project Documentation

## Project Overview

This is a personal portfolio website built with Next.js 14, React, and TypeScript. The portfolio showcases Samuel Garijo's work as a Full Stack Engineer, featuring a modern design system with customizable themes, colors, and typography.

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules with CSS Variables
- **UI System**: Once UI (custom design system)
- **Fonts**: Geist (primary) and Geist Mono (code)
- **Content**: MDX for blog posts and work showcases

### Key Features
- Dark/Light theme support
- Customizable color schemes (brand, accent, neutral)
- Responsive design
- Blog with MDX support
- Work showcase pages
- Password-protected routes
- Mailchimp integration
- Visual effects (dots, gradients, masks)

## Project Structure

```
samuel-garijo-portfolio/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── [locale]/          # Internationalization support
│   │   ├── resources/         # Configuration and content
│   │   │   ├── config.js      # Main configuration file
│   │   │   ├── content.js     # Site content and metadata
│   │   │   └── content-i18n.js # Internationalized content
│   │   └── ...pages/          # Route pages
│   ├── components/            # React components
│   └── once-ui/              # Design system
│       ├── components/        # UI components
│       ├── tokens/           # Design tokens
│       │   ├── scheme.scss   # Color palette definitions
│       │   ├── function.scss # Color mapping logic
│       │   ├── theme.scss    # Theme variables
│       │   └── typography.scss # Font sizes and weights
│       └── styles/           # Global styles
├── public/                   # Static assets
└── package.json             # Dependencies
```

## Style System Architecture

### 1. **Font Configuration** (`/src/app/resources/config.js`)
```javascript
// Lines 22-39
const primaryFont = Geist({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const font = {
  primary: primaryFont,
  secondary: primaryFont,  // All use same font
  tertiary: primaryFont,
  code: monoFont,         // Geist Mono for code
};
```

### 2. **Color System**

#### Base Colors (`/src/once-ui/tokens/scheme.scss`)
- Defines 16 color palettes: sand, gray, slate, red, orange, yellow, moss, green, emerald, aqua, cyan, blue, indigo, violet, magenta, pink
- Each color has 12 shades (100-1200) + transparency variants (10%, 30%, 50%)
- Example: `--scheme-cyan-600: #049EE2;`

#### Color Mapping (`/src/once-ui/tokens/function.scss`)
Maps color schemes to functional variables based on config:
- `data-brand="cyan"` → `--function-brand-*` uses cyan palette
- `data-accent="red"` → `--function-accent-*` uses red palette
- `data-neutral="gray"` → `--function-neutral-*` uses gray palette

#### Theme Application (`/src/once-ui/tokens/theme.scss`)
Applies colors differently for light/dark themes:
- Dark theme: `--brand-background-strong: var(--function-brand-300);`
- Light theme: `--brand-background-strong: var(--function-brand-800);`

### 3. **Typography** (`/src/once-ui/tokens/typography.scss`)
- Font sizes: display (xl-xs), heading (xl-xs), body (xl-xs), label (l-s)
- Font weights: 100-800 (thin to extraBold)
- Responsive breakpoints for mobile/tablet adjustments

### 4. **Configuration** (`/src/app/resources/config.js`)
```javascript
const style = {
  theme: "dark",           // dark | light
  neutral: "gray",         // sand | gray | slate
  brand: "cyan",          // 16 color options
  accent: "red",          // 16 color options
  solid: "contrast",      // color | contrast | inverse
  solidStyle: "flat",     // flat | plastic
  border: "playful",      // rounded | playful | conservative
  surface: "translucent", // filled | translucent
  transition: "all",      // all | micro | macro
  scaling: "100"          // 90-110
};
```

## Key Commands

### Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Testing
```bash
npm run test     # Run tests (if configured)
```

## Important Files to Know

1. **`/src/app/resources/config.js`** - Main configuration (colors, fonts, effects, routes)
2. **`/src/app/resources/content.js`** - Site content, metadata, personal info
3. **`/src/once-ui/tokens/theme.scss`** - Theme variable definitions
4. **`/src/once-ui/tokens/scheme.scss`** - Color palette definitions
5. **`/src/components/ThemeProvider.tsx`** - Theme switching logic
6. **`/src/app/[locale]/layout.tsx`** - Root layout with font/theme setup

## Customization Tips

### Change Colors
Edit `/src/app/resources/config.js`:
```javascript
const style = {
  brand: "blue",    // Change primary color
  accent: "green",  // Change accent color
  neutral: "slate", // Change neutral palette
};
```

### Add Custom Colors
1. Add palette to `/src/once-ui/tokens/scheme.scss`
2. Map it in `/src/once-ui/tokens/function.scss`
3. Use in config: `brand: "custom"`

### Modify Typography
- Global font family: Edit font imports in `config.js`
- Font sizes: Adjust in `/src/once-ui/tokens/typography.scss`
- Font scaling: Change `--font-scaling-*` values

### Theme Customization
- Edit `/src/once-ui/tokens/theme.scss` for theme-specific variables
- Modify dark/light color mappings
- Adjust surface styles, transitions, borders

## Protected Routes
Configure in `/src/app/resources/config.js`:
```javascript
const protectedRoutes = {
  "/work/project-name": true,
};
```
Password is set via `.env` file.

## Content Management
- Blog posts: `/src/app/[locale]/blog/posts/*.mdx`
- Work showcases: `/src/app/[locale]/work/projects/*.mdx`
- Main content: `/src/app/resources/content.js`

## Deployment Notes
- Built for Vercel deployment
- Environment variables needed for protected routes
- Static export compatible
- Supports internationalization (i18n ready)

## Common Tasks

### Add a new blog post
1. Create `.mdx` file in `/src/app/[locale]/blog/posts/`
2. Add metadata and content
3. Will automatically appear in blog listing

### Change site metadata
Edit `/src/app/resources/content.js`:
- Update `person` object for personal info
- Modify `newsletter`, `social` sections
- Adjust SEO metadata

### Modify visual effects
Edit `/src/app/resources/config.js` `effects` object:
- Toggle dots, gradients, grids, lines
- Adjust opacity, colors, sizes
- Configure mask cursor effects