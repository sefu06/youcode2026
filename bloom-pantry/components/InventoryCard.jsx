/* InventoryCard.jsx — Bloom Pantry
   Displays a single pantry item with name, expiry, quantity, and status.

   Usage:
   <InventoryCard
     name="Canned Tomatoes"
     expiry="2025-04-08"
     quantity={3}
     unit="cans"
     status="use-soon"
     imageUrl="/path/to/photo.jpg"  // optional
   />
*/

import { StatusPill } from "./StatusPill";

const COLORS = {
  mist:       "#d5dcd1",
  sage:       "#9fbca5",
  tealFern:   "#6d9c90",
  duskBlue:   "#496bbf",
  deepForest: "#2f3e46",
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function InventoryCard({ name, expiry, quantity, unit = "", status, imageUrl }) {
  const days = daysUntil(expiry);
  const expiryLabel =
    days < 0  ? "Expired"
  : days === 0 ? "Expires today"
  : days === 1 ? "Expires tomorrow"
  :              `Expires in ${days} days`;

  return (
    <div style={{
      background:   "#fff",
      border:       `1.5px solid ${COLORS.mist}`,
      borderRadius: "16px",
      padding:      "16px",
      display:      "flex",
      gap:          "14px",
      alignItems:   "flex-start",
      fontFamily:   "'DM Sans', system-ui, sans-serif",
      maxWidth:     "360px",
      boxShadow:    "0 2px 10px rgba(47,62,70,0.07)",
    }}>
      {/* Image or placeholder */}
      <div style={{
        width:        "56px",
        height:       "56px",
        borderRadius: "10px",
        background:   COLORS.mist,
        overflow:     "hidden",
        flexShrink:   0,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
      }}>
        {imageUrl
          ? <img src={imageUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          : <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="24" cy="24" rx="7" ry="16" fill="#9fbca5"/>
              <ellipse cx="24" cy="24" rx="7" ry="16" fill="#9fbca5" transform="rotate(60 24 24)"/>
              <ellipse cx="24" cy="24" rx="7" ry="16" fill="#9fbca5" transform="rotate(120 24 24)"/>
              <ellipse cx="24" cy="24" rx="5" ry="11" fill="#6d9c90" transform="rotate(30 24 24)"/>
              <ellipse cx="24" cy="24" rx="5" ry="11" fill="#6d9c90" transform="rotate(90 24 24)"/>
              <ellipse cx="24" cy="24" rx="5" ry="11" fill="#6d9c90" transform="rotate(150 24 24)"/>
              <circle cx="24" cy="24" r="8" fill="#2f3e46"/>
              <circle cx="24" cy="24" r="4" fill="#d5dcd1"/>
            </svg>
        }
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <span style={{ fontWeight: 500, fontSize: "15px", color: COLORS.deepForest, lineHeight: 1.3 }}>
            {name}
          </span>
          <StatusPill status={status} />
        </div>

        <div style={{ marginTop: "6px", fontSize: "13px", color: COLORS.tealFern }}>
          {quantity} {unit}
        </div>

        <div style={{
          marginTop:  "6px",
          fontSize:   "12px",
          color:      days <= 2 ? COLORS.duskBlue : COLORS.sage,
          fontWeight: days <= 2 ? 500 : 400,
        }}>
          {expiryLabel}
        </div>
      </div>
    </div>
  );
}

export default InventoryCard;
