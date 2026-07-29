import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import "./InfoTooltip.css";

const VIEWPORT_MARGIN = 16;

// Reusable ⓘ button that reveals an explanatory popover on click.
// Used next to chart/metric titles (Beranda, Prediksi) to explain what they mean.
export default function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);
  const [shiftX, setShiftX] = useState(0);
  const wrapperRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // The trigger can sit anywhere along a heading line (short or long, on any
  // card), so the popover's natural position (flush against the trigger's
  // left edge) can run off either side of the viewport depending on where
  // that heading happens to land. Measure after each open/resize and shift
  // it back on-screen instead of guessing a fixed anchor per breakpoint.
  useLayoutEffect(() => {
    if (!open) {
      setShiftX(0);
      return undefined;
    }

    const recalc = () => {
      const trigger = wrapperRef.current?.getBoundingClientRect();
      const popover = popoverRef.current?.getBoundingClientRect();
      if (!trigger || !popover) return;

      const naturalLeft = trigger.left;
      const naturalRight = trigger.left + popover.width;
      let shift = 0;

      if (naturalRight > window.innerWidth - VIEWPORT_MARGIN) {
        shift -= naturalRight - (window.innerWidth - VIEWPORT_MARGIN);
      }
      if (naturalLeft + shift < VIEWPORT_MARGIN) {
        shift += VIEWPORT_MARGIN - (naturalLeft + shift);
      }
      setShiftX(shift);
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [open]);

  return (
    <span className="shared-info-tooltip" ref={wrapperRef}>
      <button
        type="button"
        className="shared-info-tooltip-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Penjelasan"
      >
        <FiInfo size={16} />
      </button>

      {open && (
        <div
          className="shared-info-tooltip-popover"
          ref={popoverRef}
          style={{ transform: shiftX ? `translateX(${shiftX}px)` : undefined }}
        >
          {text}
        </div>
      )}
    </span>
  );
}
