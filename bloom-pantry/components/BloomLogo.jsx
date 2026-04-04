/* BloomLogo.jsx — Bloom Pantry
   Renders the bloom flower mark as an inline SVG React component.

   Usage:
   <BloomLogo size={48} />
   <BloomLogo size={64} dark />        // inverted for dark backgrounds
   <BloomLogo size={32} badge />       // round badge / app icon style
*/

export function BloomLogo({ size = 48, dark = false, badge = false }) {
  if (badge) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="96" fill="#496bbf"/>
        <circle cx="100" cy="100" r="86" fill="#2f3e46"/>
        <ellipse cx="100" cy="100" rx="9" ry="20" fill="#9fbca5"/>
        <ellipse cx="100" cy="100" rx="9" ry="20" fill="#9fbca5" transform="rotate(60 100 100)"/>
        <ellipse cx="100" cy="100" rx="9" ry="20" fill="#9fbca5" transform="rotate(120 100 100)"/>
        <ellipse cx="100" cy="100" rx="6" ry="14" fill="#6d9c90" transform="rotate(30 100 100)"/>
        <ellipse cx="100" cy="100" rx="6" ry="14" fill="#6d9c90" transform="rotate(90 100 100)"/>
        <ellipse cx="100" cy="100" rx="6" ry="14" fill="#6d9c90" transform="rotate(150 100 100)"/>
        <circle cx="100" cy="100" r="12" fill="#d5dcd1"/>
        <circle cx="100" cy="100" r="6"  fill="#496bbf"/>
        <path d="M72,118 Q100,130 128,118" fill="none" stroke="#d5dcd1" stroke-width="3.5" strokeLinecap="round"/>
        <line x1="70"  y1="118" x2="70"  y2="130" stroke="#d5dcd1" strokeWidth="3" strokeLinecap="round"/>
        <line x1="130" y1="118" x2="130" y2="130" stroke="#d5dcd1" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
  }

  const petalColor  = dark ? "#6d9c90" : "#9fbca5";
  const innerPetal  = dark ? "#496bbf" : "#6d9c90";
  const centreOuter = dark ? "#d5dcd1" : "#2f3e46";
  const centreInner = dark ? "#2f3e46" : "#496bbf";
  const centreCore  = dark ? "#496bbf" : "#d5dcd1";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="24" rx="7" ry="16" fill={petalColor}/>
      <ellipse cx="24" cy="24" rx="7" ry="16" fill={petalColor} transform="rotate(60 24 24)"/>
      <ellipse cx="24" cy="24" rx="7" ry="16" fill={petalColor} transform="rotate(120 24 24)"/>
      <ellipse cx="24" cy="24" rx="5" ry="11" fill={innerPetal} transform="rotate(30 24 24)"/>
      <ellipse cx="24" cy="24" rx="5" ry="11" fill={innerPetal} transform="rotate(90 24 24)"/>
      <ellipse cx="24" cy="24" rx="5" ry="11" fill={innerPetal} transform="rotate(150 24 24)"/>
      <circle cx="24" cy="24" r="8" fill={centreOuter}/>
      <circle cx="24" cy="24" r="5" fill={centreInner}/>
      <circle cx="24" cy="24" r="2.5" fill={centreCore}/>
    </svg>
  );
}

export default BloomLogo;
