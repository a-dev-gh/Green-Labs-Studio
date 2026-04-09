# TASK-005: Scrollytelling Leaves Color Transition Fix

**Status:** Analysis complete, awaiting approval to apply
**Confidence:** High
**Risk:** Low
**Flagged:** No (UI animation code, not auth or database)

---

## Bug Summary

The `CanvasBackground` component draws succulent leaves from the bottom center of the viewport. When the testimonials section (dark green background) scrolls into view, the leaves are supposed to smoothly transition from green to white. Currently this transition is binary -- leaves snap instantly between green and white because `darkBlend` is calculated as `darkMode ? 1 : 0` with no interpolation.

## Root Cause

Three compounding issues:

1. **Binary blend value.** `darkBlend` is set to either `0` or `1` with no intermediate values. There is no lerp, no easing, no animation frame interpolation.

2. **IntersectionObserver is a threshold toggle.** The observer fires once at `threshold: 0.15`, producing a single boolean. It cannot provide a continuous scroll-position ratio.

3. **No scroll-position-based blending.** The canvas redraws on every scroll tick (driven by `progress`), but the color blend is locked to the boolean `darkMode` prop rather than being derived from continuous scroll position relative to the testimonials section.

## The Fix

Replace the binary `darkMode` boolean prop with a continuous `darkBlend` number (0..1) computed from the scroll position of the testimonials section relative to the viewport. Keep the IntersectionObserver for the initial detection if desired, but the blend value itself must come from scroll math.

### Architecture of the Fix

- In the parent component, compute `darkBlend` as a continuous 0-to-1 value on every scroll event, based on how far the testimonials section has entered the viewport.
- Pass `darkBlend` (number) to `CanvasBackground` instead of (or in addition to) the boolean `darkMode`.
- In the canvas drawing code, use `darkBlend` directly for color interpolation -- no change needed there since it already interpolates between green and white RGB using the blend value; the problem is the value itself is always 0 or 1.

---

## Exact Code Changes

### Change 1: Parent component -- replace boolean with continuous blend

**BEFORE:**

```jsx
// State: binary toggle
const [darkVisible, setDarkVisible] = useState(false);

// IntersectionObserver: fires once at threshold
useEffect(() => {
  const obs = new IntersectionObserver(
    ([entry]) => setDarkVisible(entry.isIntersecting),
    { threshold: 0.15 }
  );
  if (testimonialsRef.current) obs.observe(testimonialsRef.current);
  return () => obs.disconnect();
}, []);

// Passed to canvas as boolean
<CanvasBackground darkMode={darkVisible} progress={scrollProgress} />
```

**AFTER:**

```jsx
// State: continuous blend value 0..1
const [darkBlend, setDarkBlend] = useState(0);

// Scroll-driven blend calculation
useEffect(() => {
  const handleScroll = () => {
    if (!testimonialsRef.current) return;

    const rect = testimonialsRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Transition window: starts when the section's top edge hits the
    // bottom of the viewport, ends when the section's top edge reaches
    // 60% up the viewport (i.e. 40% from top). This gives a generous
    // scroll range for the color fade.
    const transitionStart = viewportH;        // section top == viewport bottom
    const transitionEnd = viewportH * 0.4;    // section top == 40% from viewport top

    // rect.top moves from large (below viewport) to small/negative (above)
    // Map rect.top from [transitionStart..transitionEnd] to [0..1]
    let blend = 0;
    if (rect.top <= transitionStart && rect.top >= transitionEnd) {
      blend = (transitionStart - rect.top) / (transitionStart - transitionEnd);
    } else if (rect.top < transitionEnd) {
      blend = 1;
    }

    // Clamp for safety
    blend = Math.max(0, Math.min(1, blend));
    setDarkBlend(blend);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Pass continuous blend to canvas
<CanvasBackground darkBlend={darkBlend} progress={scrollProgress} />
```

### Change 2: CanvasBackground component -- accept `darkBlend` as a number prop

**BEFORE:**

```jsx
function CanvasBackground({ darkMode, progress }) {
  // ...inside the draw function:
  const darkBlend = darkMode ? 1 : 0;

  // Color interpolation (this part is already correct in concept)
  const r = Math.round(greenR + (whiteR - greenR) * darkBlend);
  const g = Math.round(greenG + (whiteG - greenG) * darkBlend);
  const b = Math.round(greenB + (whiteB - greenB) * darkBlend);
  // ...
}
```

**AFTER:**

```jsx
function CanvasBackground({ darkBlend = 0, progress }) {
  // ...inside the draw function:

  // darkBlend is already a continuous 0..1 value from the parent.
  // Optional: apply an easing curve for a more natural feel.
  const easedBlend = darkBlend * darkBlend * (3 - 2 * darkBlend); // smoothstep

  // Color interpolation using the eased blend
  const r = Math.round(greenR + (whiteR - greenR) * easedBlend);
  const g = Math.round(greenG + (whiteG - greenG) * easedBlend);
  const b = Math.round(greenB + (whiteB - greenB) * easedBlend);
  // ...
}
```

### Change 3 (cleanup): Remove the IntersectionObserver for darkVisible

The IntersectionObserver that previously set `darkVisible` can be removed entirely since the scroll handler now computes the blend directly. If the observer is used for other purposes (e.g., lazy-loading testimonials content), keep it but decouple it from the canvas color logic.

**BEFORE:**

```jsx
useEffect(() => {
  const obs = new IntersectionObserver(
    ([entry]) => setDarkVisible(entry.isIntersecting),
    { threshold: 0.15 }
  );
  if (testimonialsRef.current) obs.observe(testimonialsRef.current);
  return () => obs.disconnect();
}, []);
```

**AFTER:**

```
// Removed -- replaced by scroll-driven darkBlend calculation in Change 1.
// Delete the darkVisible state and this useEffect entirely.
```

---

## Why This Works

| Concern | Before | After |
|---|---|---|
| Blend granularity | Binary 0 or 1 | Continuous 0..1 driven by scroll position |
| Transition trigger | IntersectionObserver at 15% threshold (fires once) | Every scroll tick, recalculated from `getBoundingClientRect` |
| Scroll-up reversal | Toggles back to 0 only when section leaves 15% threshold | Smoothly decreases from 1 back to 0 as user scrolls up |
| Leaf growth animation | Unaffected -- driven by separate `progress` prop | Unaffected -- `progress` prop unchanged |
| Performance | N/A | Scroll handler is passive, `getBoundingClientRect` is a single layout read per tick, state updates only when blend value actually changes (React batching handles this) |

## Optional Enhancement

For extra smoothness, add a small optimization to avoid unnecessary re-renders:

```jsx
// In the scroll handler, only update state if the value changed meaningfully
const quantized = Math.round(blend * 100) / 100; // 100 discrete steps
setDarkBlend((prev) => (prev === quantized ? prev : quantized));
```

This limits React re-renders to ~100 steps across the transition window rather than firing on every sub-pixel scroll.

---

## Easing Reference

The smoothstep formula used in the canvas component:

```
f(t) = t * t * (3 - 2t)
```

This produces an S-curve that eases in and out, making the green-to-white transition feel natural rather than linear.

---

## Files to Modify

Once the prototype JSX file is created by the UI builder (TASK-004), these changes apply to:

1. **The parent page component** (e.g., `src/pages/Landing.tsx`) -- Changes 1 and 3
2. **The canvas component** (e.g., `src/components/CanvasBackground.tsx`) -- Change 2

## Next Steps

- Awaiting Adrian's approval to apply the fix
- The prototype JSX file must exist first (depends on TASK-004)
- Once the file is available, the exact edits can be applied as a diff
