# Brand Guidelines

## Color Palette

### Light Mode

- **Primary Background**: White / Alice Blue (`#F0F7FF`)
- **Primary Text**: Oxford Blue (`#010F31`) or Black (`#000000`)
- **Brand Primary**: Oxford Blue (`#010F31`)
- **Accents**:
  - Blue (`#1727E0`)
  - Dodger Blue (`#2F94FF`)
  - Orange (`#FF6828`)

### Dark Mode

- **Background**: Dark (system default or configured theme)
- **Text**: Alice Blue (`#F0F7FF`) - chosen for high contrast against dark backgrounds.
- **Brand Primary (Dark)**: Alice Blue (`#F0F7FF`)

### CSS Variables

The following semantic variables are available in the global scope:

- `--brand-oxford-blue`: `#010F31`
- `--brand-alice-blue`: `#F0F7FF`
- `--brand-blue`: `#1727E0`
- `--brand-dodger-blue`: `#2F94FF`
- `--brand-orange`: `#FF6828`

## Usage Implementation

### Tailwind Utility Classes

You can use these variables in Tailwind arbitrary values:

```tsx
// Example: Background color
<div className="bg-(--brand-alice-blue)">...</div>

// Example: Text color
<p className="text-(--brand-oxford-blue)">...</p>
```

### Theme Switching

The application uses a class-based dark mode (`.dark` class on html/body).

- **Light Mode**: Default styling.
- **Dark Mode**: Elements inside `.dark` container should use high-contrast variants.

## Accessibility (WCAG 2.1 AA)

- **Contrast Ratio**: Text must maintain a contrast ratio of at least 4.5:1 against its background
  (3:1 for large text).
- **Dark Mode**: Alice Blue (`#F0F7FF`) on dark backgrounds provides excellent contrast.
- **Light Mode**: Oxford Blue (`#010F31`) on Alice Blue (`#F0F7FF`) background provides excellent
  contrast.

## Typography

- **Primary Font**: Instrument Sans
- **Monospace**: Fira Code
- **Serif**: Lora
