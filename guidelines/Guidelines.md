# Project Guidelines

## Overview

This is the **Peace and Security Administration Bureau (PSAB)** website for the Addis Ababa City Administration, Ethiopia. It is a bilingual (English/Amharic) React + Vite + Tailwind CSS application.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 6.x | Build tool |
| Tailwind CSS | 4.x | Utility-first styling |
| React Router | 7.x | Client-side routing |
| shadcn/ui (Radix) | various | Accessible UI primitives |
| Lucide React | 0.487 | Icon library |
| TypeScript | via Vite | Type safety |

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── figma/          # Utility components (ImageWithFallback)
│   │   ├── ui/             # shadcn/ui component library
│   │   ├── Header.tsx      # Sticky nav with language toggle
│   │   └── Footer.tsx      # Site footer
│   ├── contexts/
│   │   └── LanguageContext.tsx  # EN/AM i18n context + translation map
│   ├── pages/              # One file per route
│   ├── routes.tsx          # React Router config
│   └── App.tsx             # Root component
├── styles/
│   ├── index.css           # Entry stylesheet
│   ├── tailwind.css        # Tailwind directives
│   ├── theme.css           # CSS custom properties / design tokens
│   └── fonts.css           # Font imports
guidelines/
└── Guidelines.md           # This file
```

---

## Internationalization (i18n)

All user-facing strings are managed through `LanguageContext.tsx`.

- Use the `t('key')` function for translated strings
- Add new keys to **both** `en` and `am` translation objects
- For inline bilingual logic: `language === 'en' ? 'English text' : 'የአማርኛ ጽሑፍ'`
- Language toggle is in the Header top bar

---

## Routing

Routes are defined in `src/app/routes.tsx`. All pages share the `RootLayout` (Header + Footer).

| Path | Component |
|------|-----------|
| `/` | Home |
| `/about` | About |
| `/services` | Services |
| `/news` | News |
| `/projects` | Projects |
| `/resources` | Resources |
| `/community` | Community |
| `/contact` | Contact |
| `*` | NotFound (404) |

---

## Design System

### Colors
The palette reflects the Ethiopian flag:
- **Green** — `green-600` / `green-700` (primary actions, peace)
- **Blue** — `blue-600` / `blue-700` (secondary, security)
- **Yellow** — `yellow-500` / `yellow-600` (accent, diversity)

### Component Conventions
- Page hero sections: `bg-gradient-to-r from-green-700 to-blue-700 text-white py-16`
- Cards: `bg-white rounded-lg shadow-md hover:shadow-xl transition-all`
- Primary button: `bg-green-600 text-white hover:bg-green-700`
- Outline button: `border border-green-600 text-green-600 hover:bg-green-50`

### Images
Use `ImageWithFallback` from `src/app/components/figma/ImageWithFallback.tsx` for all `<img>` tags to gracefully handle broken image URLs.

---

## Adding a New Page

1. Create `src/app/pages/MyPage.tsx`
2. Add the route in `src/app/routes.tsx`
3. Add nav label translations in `LanguageContext.tsx` under `nav.*`
4. Add the nav item to `Header.tsx`

---

## Forms

Forms use uncontrolled inputs with `react-hook-form` available as a dependency. Submit handlers should:
1. Validate inputs client-side
2. Show a success/error toast via `sonner`
3. Reset the form on success

---

## Code Style

- Functional components only, no class components
- Named exports for all page/component files
- Co-locate types with the component that uses them
- Prefer Tailwind utilities over custom CSS
- Use `lucide-react` for all icons

---

## Running the Project

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

> Note: This project uses `pnpm`. Do not use `npm` or `yarn`.
