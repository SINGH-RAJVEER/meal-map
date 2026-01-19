# Design Philosophy: MealMap

## 1. Core Identity

MealMap is defined by a **strict minimal, monochrome, and high-contrast aesthetic**. It rejects the colorful, cluttered interfaces typical of fitness apps in favor of a sophisticated, focus-driven user experience.

## 2. Visual Language

### A. The "Liquid Glass" Aesthetic

The primary texture of the application is **Liquid Glass**.

- **High Blur**: Backgrounds are heavily blurred (`backdrop-filter: blur(20px)` to `40px`) to create depth.
- **Transparency**: Surfaces are translucent (white/black with low opacity), allowing the background to bleed through subtly.
- **Physicality**: Edges are defined not just by color but by light. used `border-top` and `border-left` with higher opacity/lightness to simulate light catching the glass edge.
- **Depth**: Deep, multi-layered shadows lift elements off the canvas.

### B. Color Palette: Strict Monochrome

- **No Colors**: The app uses **ONLY** Black (`#000000`), White (`#FFFFFF`), and Greyscale.
- **Primary**: Pure Black (Light Mode) / Pure White (Dark Mode).
- **Secondary**: Light Grey (`90%` lightness) / Dark Grey (`15%` lightness).
- **Accents**: No colored accents. Progress bars, icons, and active states use the foreground color.
- **Exceptions**: `destructuve` actions may use standard red, but prefer monochrome indicators where possible.

### C. Contrast & Visibility

- **High Contrast**: Text is always pure black or pure white against the background.
- **Outlines**: All buttons and UI elements must have **slight, very minimal outlines**.
  - This is critical for distinguishing elements from the background, especially in Dark Mode.
  - Use subtle borders (e.g., `border-white/10`) rather than relying solely on shadows or background color differences.
- **Dark Mode**:
  - Background is Pure Black.
  - Interactive elements (buttons, inputs) **MUST** have a subtle border to ensure they are visible against the dark background.
  - Avoid relying solely on shadow in dark mode; utilize light borders to define shapes.

### D. Typography & Iconography

- **Font**: System UI / Sans-serif for maximum legibility and neutrality.
- **Icons**: `lucide-react`. Always `currentColor`. Stroke width should be consistent (usually `1.5px` or `2px`). No emojis unless absolutely necessary and monochrome.

## 3. Component Guidelines

### Buttons

- **Solid**: High contrast. Solid Black bg/White text (Light Mode) and vice versa.
- **Outline**: No glass effect. Solid 2px border. Transparent fill. Fill on hover.
- **Ghost/Secondary**: No glass effect. Solid grey background. Minimal border in dark mode.

### Cards & Containers

- Use `glass-card` utility.
- Rounded corners (`rounded-2xl` or `rounded-3xl`) to match the "liquid" feel.
- Padding should be generous to allow the glass effect to breathe.

### Inputs

- `glass-input` utility.
- High legibility.
- Clear focus states using rings or border color changes (monochrome).

## 4. User Experience for Agents

When generating code or UI for MealMap:

1.  **Stop and Check**: Did I add a color? Change it to black, white, or grey.
2.  **Glass Check**: Is the element sitting on the backgorund? It should probably be glass.
3.  **Contrast Check**: Is this button visible in pitch black dark mode? Add a border if no.
4.  **Minimalism**: Remove decorative elements that don't serve a function. Less is more.
