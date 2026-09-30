export function getSanskritName(name: string): string {
  const map: Record<string, string> = {
    "Arjuna": "अर्जुनः",
    "Krishna": "श्रीकृष्णः",
    "Karna": "कर्णः",
    "Bhishma": "भीष्मः",
    "Yudhishthira": "युधिष्ठिरः",
    "Bheema": "भीमः",
    "Nakula": "नकुलः",
    "Sahadeva": "सहदेवः",
    "Draupadi": "द्रौपदी",
    "Duryodhana": "दुर्योधनः",
    "Dushasana": "दुःशासनः",
    "Gandhari": "गांधारी",
    "Dhritarashtra": "धृतराष्ट्रः",
    "Kunti": "कुन्ती",
    "Drona": "द्रोणाचार्यः",
    "Ashwatthama": "अश्वत्थामा",
    "Shakuni": "शकुनिः",
    "Vyasa": "महर्षि व्यासः",
    "Abhimanyu": "अभिमन्युः",
    "Ghatotkacha": "घटोत्कचः",
    "Iravan": "इरावान्",
    "Subhadra": "सुभद्रा",
    "Balarama": "बलरामः",
    "Satyaki (Yuyudhana)": "सात्यकिः",
    "Kripacharya": "कृपाचार्यः",
    "Vidura": "विदुरः",
    "Sanjaya": "संजयः",
    "Dhrishtadyumna": "धृष्टद्युम्नः",
    "Shikhandi": "शिखंडी",
    "Ekalavya": "एकलव्यः",
    "Barbarika (Khatu Shyam)": "बर्बरीकः",
    "Shalya": "शल्यः",
    "Jarasandha": "जरासंधः",
    "Yuyutsu": "युयुत्सुः",
    "Kuntibhoja": "कुन्तिभोजः",
    "Virata": "विराटः",
    "Uttara (Matsya Prince)": "उत्तरः",
    "Uttaraa (Matsya Princess)": "उत्तरा",
    "Parikshit": "परीक्षितः",
    "Janamejaya": "जनमेजयः",
    "Kichaka": "कीचकः",
    "Hidimbi": "हिडिम्बी",
    "Ulupi": "उलूपी",
    "Chitrangada (Manipura)": "चित्रांगदा",
    "Babruvahana": "बभ्रुवाहनः",
    "Jayadratha": "जयद्रथः",
    "Amba": "अम्बा",
    "Ambika & Ambalika": "अम्बिका",
    "Pandu": "पाण्डुः",
    "Madri": "माद्री"
  };
  return map[name] || name;
}

export function generateCharacterAvatarSVG(c: {
  name: string;
  alliance?: string;
  role?: string;
  avatar?: string;
}): string {
  const name = c.name || "Mahabharat Hero";
  const alliance = c.alliance || "Neutral";
  const role = c.role || "Epic Warrior";
  const emoji = c.avatar || "🛡️";
  const sanskrit = getSanskritName(name);

  const allianceLower = alliance.toLowerCase();

  let bgStop1 = "#0a1220";
  let bgStop2 = "#151d30";
  let bgStop3 = "#070a12";
  let accentColor = "#eab308";
  let glowColor = "#f59e0b";

  if (allianceLower.includes("divine")) {
    bgStop1 = "#031b4e";
    bgStop2 = "#0f2b6b";
    bgStop3 = "#080e22";
    accentColor = "#38bdf8";
    glowColor = "#60a5fa";
  } else if (allianceLower.includes("pandava")) {
    bgStop1 = "#064e3b";
    bgStop2 = "#0f766e";
    bgStop3 = "#031f17";
    accentColor = "#34d399";
    glowColor = "#10b981";
  } else if (allianceLower.includes("kaurava")) {
    bgStop1 = "#7f1d1d";
    bgStop2 = "#9f1239";
    bgStop3 = "#180709";
    accentColor = "#f87171";
    glowColor = "#ef4444";
  } else if (allianceLower.includes("neutral") || allianceLower.includes("sage")) {
    bgStop1 = "#7c2d12";
    bgStop2 = "#9a3412";
    bgStop3 = "#1c0a04";
    accentColor = "#fb923c";
    glowColor = "#f97316";
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStop1}" />
      <stop offset="50%" stop-color="${bgStop2}" />
      <stop offset="100%" stop-color="${bgStop3}" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#a16207" />
    </linearGradient>
    <pattern id="sacredPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="14" fill="none" stroke="#eab308" stroke-opacity="0.06" stroke-width="1" />
      <path d="M15,0 L15,30 M0,15 L30,15" stroke="#eab308" stroke-opacity="0.04" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="600" height="240" fill="url(#bgGrad)" />
  <rect width="600" height="240" fill="url(#sacredPattern)" />

  <circle cx="480" cy="120" r="110" fill="${glowColor}" fill-opacity="0.08" />
  <circle cx="480" cy="120" r="85" fill="none" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="2" stroke-dasharray="6 4" />
  <circle cx="480" cy="120" r="100" fill="none" stroke="#eab308" stroke-opacity="0.1" stroke-width="1" />

  <text x="30" y="115" font-family="Georgia, serif" font-size="52" font-weight="900" fill="#eab308" fill-opacity="0.14" letter-spacing="2">
    ${sanskrit}
  </text>

  <circle cx="480" cy="120" r="54" fill="#0c0e14" stroke="url(#goldGrad)" stroke-width="3.5" />
  <circle cx="480" cy="120" r="48" fill="#141824" stroke="${accentColor}" stroke-opacity="0.4" stroke-width="1" />
  
  <text x="480" y="134" font-size="42" text-anchor="middle">${emoji}</text>

  <rect x="0" y="0" width="600" height="4" fill="url(#goldGrad)" />
  <rect x="0" y="236" width="600" height="4" fill="url(#goldGrad)" fill-opacity="0.6" />

  <rect x="30" y="145" width="4" height="42" fill="url(#goldGrad)" rx="2" />
  <text x="44" y="162" font-family="sans-serif" font-size="11" font-weight="800" fill="${accentColor}" letter-spacing="1.5" text-transform="uppercase">
    ${alliance} &bull; ${role}
  </text>
  <text x="44" y="182" font-family="sans-serif" font-size="22" font-weight="900" fill="#ffffff" letter-spacing="0.5">
    ${name}
  </text>
</svg>`;

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
