# GREENLABS.Studio

## Project
Succulent store website for GREENLABS Botanics (Oscar Junior Espinosa).
Santiago de los Caballeros, Dominican Republic.

## Stack
- React 18 + TypeScript
- Custom CSS (NO Tailwind)
- Supabase (Auth + PostgreSQL + Storage)
- Vite (bundler)
- WhatsApp for orders (wa.me link)

## Brand
- Colors: Forest #1B4332, Olive #8BA740, Coral #EF583D, Sand #F5F0E8
- Fonts: DM Sans (UI), Lora (editorial)
- 8px grid, 12px border-radius, mobile-first

## Language
- UI is in Spanish
- Code (variables, components, comments) in English
- Always say "succulents" not "plants"

## Architecture
- See docs/architecture.md for full system design
- See WORKFLOW.md for agent dependency rules
- See docs/agent-notes.md for session tracking

## Conventions
- Components: PascalCase, one per file
- CSS: BEM-style class names in .css files (not CSS modules)
- Supabase: timestamped migrations in supabase/migrations/
- All auth changes require human approval
