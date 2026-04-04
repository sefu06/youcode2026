/* StatusPill.jsx — Bloom Pantry
   Usage: <StatusPill status="fresh" />
   Props: status = "fresh" | "use-soon" | "expiring" | "in-stock" | "low-stock"
*/

const STATUS_CONFIG = {
  "fresh":    { label: "Fresh",          bg: "#9fbca5", color: "#2f3e46" },
  "use-soon": { label: "Use soon",       bg: "#496bbf", color: "#d5dcd1" },
  "expiring": { label: "Expiring today", bg: "#2f3e46", color: "#d5dcd1" },
  "in-stock": { label: "In stock",       bg: "#6d9c90", color: "#2f3e46" },
  "low-stock":{ label: "Low stock",      bg: "#d5dcd1", color: "#2f3e46" },
};

export function StatusPill({ status = "fresh" }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["fresh"];
  return (
    <span
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        padding:       "4px 14px",
        borderRadius:  "100px",
        background:    cfg.bg,
        color:         cfg.color,
        fontFamily:    "'DM Sans', system-ui, sans-serif",
        fontSize:      "12px",
        fontWeight:    500,
        letterSpacing: "0.01em",
        userSelect:    "none",
        // test test
      }}
    >
      {cfg.label}
    </span>
  );
}

export default StatusPill;
