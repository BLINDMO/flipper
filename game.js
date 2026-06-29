/* ── THRIFT & THRIVE ─ game.js ─────────────────────────────────── */
'use strict';

// ── CONFIG ─────────────────────────────────────────────────────────
const CONFIG = {
  START_CASH:         500,
  OVERHEAD_DAILY:     25,
  OVERHEAD_WEEKLY:    30,
  INVENTORY_MAX:      20,
  LOCATIONS_PER_DAY:  3,
  HAGGLE_ROUNDS_MIN:  3,
  HAGGLE_ROUNDS_MAX:  5,
  SUSPICION_THRESHOLD:80,
  PEEK_SECONDS:       30,
  SELL_INSTANT_PCT:   0.60,
  SELL_EBAY_DAYS:     3,
  SELL_EBAY_MIN:      0.85,   // online sale floor (after fees), x EMV
  SELL_EBAY_MAX:      1.15,   // online sale ceiling, x EMV
  UNLOCK_ESTATE:      500,
  UNLOCK_AUCTION:     2000,
  WIN_MILESTONES:     [10000, 50000, 100000],
};

// ── NPC SVG TEMPLATES ──────────────────────────────────────────────
const NPC_SVG = {
  garage: `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
    <!-- body: flannel shirt -->
    <rect x="22" y="78" width="56" height="48" rx="6" fill="#7C3C1A"/>
    <line x1="50" y1="78" x2="50" y2="126" stroke="#5C2D12" stroke-width="2"/>
    <!-- collar -->
    <path d="M 38 78 L 50 94 L 62 78" fill="#5C2D12" opacity="0.8"/>
    <!-- flannel lines -->
    <line x1="35" y1="78" x2="35" y2="126" stroke="#9B5030" stroke-width="1" opacity="0.5"/>
    <line x1="65" y1="78" x2="65" y2="126" stroke="#9B5030" stroke-width="1" opacity="0.5"/>
    <!-- neck -->
    <rect x="44" y="70" width="12" height="12" rx="4" fill="#C87941"/>
    <!-- head -->
    <ellipse cx="50" cy="47" rx="24" ry="26" fill="#C87941"/>
    <!-- hair -->
    <path d="M 26 42 Q 28 18 50 20 Q 72 18 74 42 Q 68 30 50 30 Q 32 30 26 42 Z" fill="#2C1A00"/>
    <!-- ear left -->
    <ellipse cx="27" cy="50" rx="5" ry="6" fill="#B86830"/>
    <!-- ear right -->
    <ellipse cx="73" cy="50" rx="5" ry="6" fill="#B86830"/>
    <!-- eye white left -->
    <ellipse cx="40" cy="47" rx="6" ry="5.5" fill="#F5F0E8"/>
    <!-- pupil left -->
    <circle cx="41" cy="47" r="3" fill="#2C1A00"/>
    <circle cx="42" cy="45.5" r="1" fill="white"/>
    <!-- eye white right -->
    <ellipse cx="60" cy="47" rx="6" ry="5.5" fill="#F5F0E8"/>
    <!-- pupil right -->
    <circle cx="61" cy="47" r="3" fill="#2C1A00"/>
    <circle cx="62" cy="45.5" r="1" fill="white"/>
    <!-- EYEBROWS — neutral -->
    <path class="brow-l-neutral" d="M 34 40 Q 40 37 46 39" stroke="#2C1A00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path class="brow-r-neutral" d="M 54 39 Q 60 37 66 40" stroke="#2C1A00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- EYEBROWS — suspicious (raised inner) -->
    <path class="brow-l-suspicious" d="M 34 40 Q 40 35 46 38" stroke="#2C1A00" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="brow-r-suspicious" d="M 54 38 Q 60 35 66 40" stroke="#2C1A00" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- EYEBROWS — hostile (furrowed) -->
    <path class="brow-l-hostile" d="M 33 41 Q 40 36 46 40" stroke="#2C1A00" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="brow-r-hostile" d="M 54 40 Q 60 36 67 41" stroke="#2C1A00" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- nose -->
    <path d="M 49 52 Q 46 60 49 63 Q 52 64 53 63 Q 56 60 51 52" fill="#B36030" opacity="0.5"/>
    <!-- MOUTH — neutral (slight smile) -->
    <path class="mouth-neutral" d="M 43 67 Q 50 72 57 67" stroke="#7C3C1A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- MOUTH — suspicious (flat/frown) -->
    <path class="mouth-suspicious" d="M 43 69 Q 50 66 57 69" stroke="#7C3C1A" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- MOUTH — hostile (deep frown) -->
    <path class="mouth-hostile" d="M 43 71 Q 50 65 57 71" stroke="#7C3C1A" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- stubble -->
    <ellipse cx="50" cy="63" rx="8" ry="5" fill="#2C1A00" opacity="0.15"/>
  </svg>`,

  estate: `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
    <!-- body: cardigan -->
    <rect x="22" y="78" width="56" height="48" rx="6" fill="#4A5568"/>
    <line x1="50" y1="78" x2="50" y2="126" stroke="#2D3748" stroke-width="2"/>
    <!-- lapels -->
    <path d="M 38 78 L 50 96 L 62 78 L 58 78 L 50 90 L 42 78 Z" fill="#718096" opacity="0.7"/>
    <!-- collar shirt -->
    <rect x="44" y="70" width="12" height="14" rx="3" fill="#E2E8F0"/>
    <!-- neck -->
    <rect x="45" y="68" width="10" height="10" rx="3" fill="#C8A882"/>
    <!-- head -->
    <ellipse cx="50" cy="46" rx="23" ry="25" fill="#C8A882"/>
    <!-- silver hair -->
    <path d="M 27 40 Q 29 16 50 19 Q 71 16 73 40 Q 65 26 50 28 Q 35 26 27 40 Z" fill="#A0ADB8"/>
    <path d="M 27 42 Q 26 52 28 60 Q 26 58 25 52 Q 24 44 27 42" fill="#A0ADB8"/>
    <path d="M 73 42 Q 74 52 72 60 Q 74 58 75 52 Q 76 44 73 42" fill="#A0ADB8"/>
    <!-- ears -->
    <ellipse cx="28" cy="49" rx="4.5" ry="5.5" fill="#B8926A"/>
    <ellipse cx="72" cy="49" rx="4.5" ry="5.5" fill="#B8926A"/>
    <!-- eyes -->
    <ellipse cx="40" cy="46" rx="5.5" ry="5" fill="#E8E0D0"/>
    <circle cx="41" cy="46" r="2.8" fill="#3D2B0A"/>
    <circle cx="42" cy="44.5" r="0.9" fill="white"/>
    <ellipse cx="60" cy="46" rx="5.5" ry="5" fill="#E8E0D0"/>
    <circle cx="61" cy="46" r="2.8" fill="#3D2B0A"/>
    <circle cx="62" cy="44.5" r="0.9" fill="white"/>
    <!-- wrinkles -->
    <path d="M 34 42 Q 36 40 38 42" stroke="#B8926A" stroke-width="0.8" fill="none" opacity="0.6"/>
    <path d="M 62 42 Q 64 40 66 42" stroke="#B8926A" stroke-width="0.8" fill="none" opacity="0.6"/>
    <!-- eyebrows neutral -->
    <path class="brow-l-neutral" d="M 35 39 Q 40 37 45 39" stroke="#8A9BA8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="brow-r-neutral" d="M 55 39 Q 60 37 65 39" stroke="#8A9BA8" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- eyebrows suspicious -->
    <path class="brow-l-suspicious" d="M 35 39 Q 40 35 45 38" stroke="#8A9BA8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="brow-r-suspicious" d="M 55 38 Q 60 35 65 39" stroke="#8A9BA8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- eyebrows hostile -->
    <path class="brow-l-hostile" d="M 34 40 Q 40 34 46 38" stroke="#8A9BA8" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="brow-r-hostile" d="M 54 38 Q 60 34 66 40" stroke="#8A9BA8" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- nose -->
    <path d="M 49 51 Q 47 58 50 61 Q 53 61 51 58 Q 53 51 49 51" fill="#B8926A" opacity="0.5"/>
    <!-- mouth neutral -->
    <path class="mouth-neutral" d="M 44 66 Q 50 70 56 66" stroke="#7A5A3A" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- mouth suspicious -->
    <path class="mouth-suspicious" d="M 44 68 Q 50 65 56 68" stroke="#7A5A3A" stroke-width="2" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- mouth hostile -->
    <path class="mouth-hostile" d="M 43 70 Q 50 64 57 70" stroke="#7A5A3A" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
  </svg>`,

  auctioneer: `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg">
    <!-- body: waistcoat -->
    <rect x="22" y="78" width="56" height="48" rx="6" fill="#1A237E"/>
    <rect x="36" y="78" width="28" height="48" rx="3" fill="#283593"/>
    <!-- shirt front -->
    <rect x="43" y="78" width="14" height="48" fill="#E8EAF6"/>
    <!-- buttons -->
    <circle cx="50" cy="88" r="1.5" fill="#1A237E"/>
    <circle cx="50" cy="96" r="1.5" fill="#1A237E"/>
    <circle cx="50" cy="104" r="1.5" fill="#1A237E"/>
    <!-- tie -->
    <path d="M 47 78 L 50 86 L 53 78 L 51 78 L 50 84 L 49 78 Z" fill="#C62828"/>
    <!-- neck -->
    <rect x="44" y="68" width="12" height="14" rx="3" fill="#E8EAF6"/>
    <rect x="45" y="67" width="10" height="10" rx="3" fill="#D4A870"/>
    <!-- head -->
    <ellipse cx="50" cy="45" rx="23" ry="25" fill="#D4A870"/>
    <!-- dark hair slicked back -->
    <path d="M 27 38 Q 30 14 50 17 Q 70 14 73 38 Q 65 24 50 26 Q 35 24 27 38 Z" fill="#1A1200"/>
    <!-- side part -->
    <path d="M 44 17 Q 43 26 40 36" stroke="#2C1E00" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- ears -->
    <ellipse cx="28" cy="48" rx="4.5" ry="5.5" fill="#C49060"/>
    <ellipse cx="72" cy="48" rx="4.5" ry="5.5" fill="#C49060"/>
    <!-- eyes energetic (slightly wider) -->
    <ellipse cx="40" cy="46" rx="6" ry="5.5" fill="#F0EAD8"/>
    <circle cx="41" cy="46" r="3.2" fill="#3D2B0A"/>
    <circle cx="42.5" cy="44.5" r="1.1" fill="white"/>
    <ellipse cx="60" cy="46" rx="6" ry="5.5" fill="#F0EAD8"/>
    <circle cx="61" cy="46" r="3.2" fill="#3D2B0A"/>
    <circle cx="62.5" cy="44.5" r="1.1" fill="white"/>
    <!-- eyebrows energetic/raised -->
    <path class="brow-l-neutral" d="M 34 38 Q 40 35 46 37" stroke="#1A1200" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path class="brow-r-neutral" d="M 54 37 Q 60 35 66 38" stroke="#1A1200" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path class="brow-l-suspicious" d="M 34 37 Q 40 33 46 36" stroke="#1A1200" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="brow-r-suspicious" d="M 54 36 Q 60 33 66 37" stroke="#1A1200" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="brow-l-hostile" d="M 33 38 Q 40 32 46 36" stroke="#1A1200" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="brow-r-hostile" d="M 54 36 Q 60 32 67 38" stroke="#1A1200" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- nose -->
    <path d="M 49 51 Q 47 57 50 60 Q 53 60 51 57 Q 53 51 49 51" fill="#C49060" opacity="0.5"/>
    <!-- mouth — open/talking -->
    <path class="mouth-neutral" d="M 43 65 Q 50 70 57 65" stroke="#7A4A20" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path class="mouth-suspicious" d="M 43 67 Q 50 64 57 67" stroke="#7A4A20" stroke-width="2" fill="none" stroke-linecap="round" opacity="0"/>
    <path class="mouth-hostile" d="M 43 69 Q 50 63 57 69" stroke="#7A4A20" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0"/>
    <!-- mustache -->
    <path d="M 44 62 Q 50 65 56 62" fill="#1A1200" opacity="0.8"/>
  </svg>`,
};

// ── ITEM DATABASE ───────────────────────────────────────────────────
// Items with ultraRare:true only enter the pool at 3% chance each visit
const ITEM_DB = [
  // ── ELECTRONICS ──────────────────────────────────────────────────
  { id:'radio-zenith',    name:'Zenith Trans-Oceanic Radio',        cat:'Electronics',  icon:'ph-radio',         color:'#60A5FA', baseEMV:280,    rarity:'rare',      askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:'A classic shortwave. Still crackles to life.' },
  { id:'camera-polaroid', name:'Polaroid OneStep Camera',           cat:'Electronics',  icon:'ph-camera',        color:'#60A5FA', baseEMV:95,     rarity:'uncommon',  askRange:[0.6,1.2], fake:false, phases:['garage','auction'],          flavor:'The white rainbow stripe is a dead giveaway.' },
  { id:'tv-console',      name:'Console Television Set',            cat:'Electronics',  icon:'ph-television',    color:'#60A5FA', baseEMV:55,     rarity:'common',    askRange:[0.5,0.9], fake:false, phases:['garage','auction'],          flavor:'Wood veneer cabinet. Picture tube intact.' },
  { id:'turntable-dual',  name:'Dual 1219 Turntable',               cat:'Electronics',  icon:'ph-vinyl-record',  color:'#60A5FA', baseEMV:165,    rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Belt-drive mechanism. Smooth as silk.' },
  { id:'phone-rotary',    name:'Western Electric Rotary Phone',     cat:'Electronics',  icon:'ph-phone',         color:'#60A5FA', baseEMV:45,     rarity:'common',    askRange:[0.4,0.9], fake:false, phases:['garage'],                    flavor:'Candy-apple red. Original cord and handset.' },
  { id:'projector-reel',  name:'8mm Reel Projector',                cat:'Electronics',  icon:'ph-film-strip',    color:'#60A5FA', baseEMV:130,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['garage','estate','auction'], flavor:'Complete with a box of mystery family reels.' },
  { id:'typewriter',      name:'Olivetti Lettera Typewriter',       cat:'Electronics',  icon:'ph-keyboard',      color:'#60A5FA', baseEMV:200,    rarity:'rare',      askRange:[0.5,1.1], fake:false, phases:['estate','auction'],          flavor:'Italian design icon. Keys strike cleanly.' },
  { id:'camera-leica',    name:'Leica M3 Rangefinder',              cat:'Electronics',  icon:'ph-camera',        color:'#60A5FA', baseEMV:1400,   rarity:'legendary', askRange:[0.4,0.9], fake:true,  phases:['estate','auction'],          flavor:'Black paint. Serial number tells the story.' },
  { id:'atari-2600',      name:'Atari 2600 Console',                cat:'Electronics',  icon:'ph-game-controller',color:'#60A5FA',baseEMV:120,    rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['garage','auction'],          flavor:'Woodgrain panel. Nine-switch model. Works.' },
  { id:'nes-console',     name:'Original Nintendo (NES)',           cat:'Electronics',  icon:'ph-game-controller',color:'#60A5FA',baseEMV:150,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','auction'],          flavor:'With Zapper and two controllers. Duck Hunt inside.' },
  { id:'walkman-tps',     name:'Sony Walkman TPS-L2 (First Gen)',   cat:'Electronics',  icon:'ph-headphones',    color:'#60A5FA', baseEMV:420,    rarity:'rare',      askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'The original. Blue and silver. Invented a lifestyle.' },
  { id:'speak-spell',     name:'Speak & Spell',                     cat:'Electronics',  icon:'ph-keyboard',      color:'#60A5FA', baseEMV:85,     rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['garage','auction'],          flavor:"Texas Instruments. E.T.'s favorite. Powers on." },
  { id:'commodore-64',    name:'Commodore 64 Computer',             cat:'Electronics',  icon:'ph-keyboard',      color:'#60A5FA', baseEMV:200,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','auction'],          flavor:'With datasette and a stack of floppy disks.' },
  { id:'gameboy-orig',    name:'Original Game Boy (Gray Brick)',    cat:'Electronics',  icon:'ph-game-controller',color:'#60A5FA',baseEMV:80,     rarity:'common',    askRange:[0.5,1.1], fake:false, phases:['garage','auction'],          flavor:'Tetris inside. Battery cover intact.' },
  { id:'morse-telegraph', name:'Morse Code Telegraph Key',          cat:'Electronics',  icon:'ph-radio',         color:'#60A5FA', baseEMV:95,     rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'Cast iron base. Brass contact. Actually works.' },
  { id:'apple-lisa',      name:'Apple Lisa Computer (1983)',        cat:'Electronics',  icon:'ph-television',    color:'#60A5FA', baseEMV:8000,   rarity:'legendary', askRange:[0.3,0.7], fake:false, phases:['auction'],                   flavor:'Pre-Mac. Only 10,000 made. Museum-grade rarity.', ultraRare:true },
  { id:'magnavox-odyssey',name:'Magnavox Odyssey Console (1972)',   cat:'Electronics',  icon:'ph-game-controller',color:'#60A5FA',baseEMV:2500,   rarity:'legendary', askRange:[0.3,0.8], fake:false, phases:['estate','auction'],          flavor:'The very first home video game console. Complete.' },
  { id:'calculator-hp35', name:'HP-35 Scientific Calculator',      cat:'Electronics',  icon:'ph-keyboard',      color:'#60A5FA', baseEMV:340,    rarity:'rare',      askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:"First pocket scientific calculator. 1972. Engineers wept." },
  { id:'viewmaster',      name:'View-Master with Reels',            cat:'Electronics',  icon:'ph-camera',        color:'#60A5FA', baseEMV:35,     rarity:'common',    askRange:[0.5,1.1], fake:false, phases:['garage'],                    flavor:'14 reels. Grand Canyon, Yellowstone, Disneyland.' },
  { id:'betamax-cam',     name:'Betamax Video Camera',              cat:'Electronics',  icon:'ph-film-strip',    color:'#60A5FA', baseEMV:40,     rarity:'common',    askRange:[0.4,0.9], fake:false, phases:['garage','auction'],          flavor:"Bulky shoulder mount. Beta tapes included. Sony's mistake." },

  // ── FURNITURE ──────────────────────────────────────────────────────
  { id:'chair-eames',     name:'Eames Lounge Chair & Ottoman',     cat:'Furniture',    icon:'ph-armchair',      color:'#9CA3AF', baseEMV:380,    rarity:'rare',      askRange:[0.5,1.1], fake:true,  phases:['estate','auction'],          flavor:'Walnut shell. Herman Miller label needs verification.' },
  { id:'dresser-mcm',     name:'Mid-Century Teak Dresser',         cat:'Furniture',    icon:'ph-dresser',       color:'#9CA3AF', baseEMV:320,    rarity:'rare',      askRange:[0.5,1.1], fake:false, phases:['estate','auction'],          flavor:'Dovetail joints. All six drawers glide easy.' },
  { id:'lamp-arc',        name:'1960s Arc Floor Lamp',             cat:'Furniture',    icon:'ph-lamp',          color:'#9CA3AF', baseEMV:185,    rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Heavy marble base. Original wiring (inspect it).' },
  { id:'chair-la-z',      name:"La-Z-Boy Recliner",                cat:'Furniture',    icon:'ph-armchair',      color:'#9CA3AF', baseEMV:60,     rarity:'common',    askRange:[0.4,0.9], fake:false, phases:['garage','auction'],          flavor:'Plaid fabric. Foot rest still catches.' },
  { id:'trunk-steamer',   name:'Vintage Steamer Trunk',            cat:'Furniture',    icon:'ph-suitcase',      color:'#9CA3AF', baseEMV:140,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Canvas-covered. Brass hardware and tray insert.' },
  { id:'desk-rolltop',    name:'Antique Roll-Top Desk',            cat:'Furniture',    icon:'ph-desk',          color:'#9CA3AF', baseEMV:520,    rarity:'rare',      askRange:[0.5,1.0], fake:false, phases:['estate','auction'],          flavor:'Quarter-sawn oak. Pigeonholes and secret compartment.' },
  { id:'mirror-ornate',   name:'Gilded Wall Mirror',               cat:'Furniture',    icon:'ph-frame-corners', color:'#9CA3AF', baseEMV:230,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['estate','auction'],          flavor:'Gold leaf frame, circa 1890. Some foxing on glass.' },
  { id:'barber-chair',    name:"Barber's Hydraulic Chair",         cat:'Furniture',    icon:'ph-armchair',      color:'#9CA3AF', baseEMV:450,    rarity:'rare',      askRange:[0.5,1.0], fake:false, phases:['estate','auction'],          flavor:'Takara Belmont. Red porcelain and chrome. Pumps smooth.' },
  { id:'apothecary-cab',  name:'48-Drawer Apothecary Cabinet',     cat:'Furniture',    icon:'ph-dresser',       color:'#9CA3AF', baseEMV:680,    rarity:'rare',      askRange:[0.5,1.1], fake:false, phases:['estate','auction'],          flavor:'Each drawer painted with its original Latin label.' },
  { id:'fainting-couch',  name:'Art Nouveau Fainting Couch',       cat:'Furniture',    icon:'ph-armchair',      color:'#9CA3AF', baseEMV:520,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Carved mahogany. Original velvet in remarkable shape.' },
  { id:'grandfather-clock',name:"Grandfather Clock",               cat:'Furniture',    icon:'ph-watch',         color:'#9CA3AF', baseEMV:380,    rarity:'rare',      askRange:[0.5,1.0], fake:false, phases:['estate','auction'],          flavor:"Still chimes on the hour. Westminster. Key's in the back." },
  { id:'tiffany-lamp',    name:'Tiffany-Style Leaded Glass Lamp',  cat:'Furniture',    icon:'ph-lamp',          color:'#9CA3AF', baseEMV:340,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'Leaded grape motif. Signed on the base — worth verifying.' },
  { id:'nesting-tables',  name:'Bamboo Nesting Tables (Set of 3)', cat:'Furniture',    icon:'ph-suitcase',      color:'#9CA3AF', baseEMV:130,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:'All three nest perfectly. Glass tops unscratched.' },
  { id:'factory-stool',   name:'Industrial Factory Stool',         cat:'Furniture',    icon:'ph-armchair',      color:'#9CA3AF', baseEMV:45,     rarity:'common',    askRange:[0.5,1.1], fake:false, phases:['garage','auction'],          flavor:'Cast iron base, cracked leather. Factory patina.' },
  { id:'barber-pole',     name:'Antique Barber Pole (working)',    cat:'Furniture',    icon:'ph-lamp',          color:'#9CA3AF', baseEMV:280,    rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['auction'],                   flavor:'William Marvy model. Motor hums. Stripes still spin.' },

  // ── SPORTS MEMORABILIA ─────────────────────────────────────────────
  { id:'card-mays',       name:"Willie Mays Rookie Card",          cat:'Sports',       icon:'ph-baseball',      color:'#34D399', baseEMV:4200,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['garage','estate','auction'], flavor:'1951 Bowman. Grade will make or break this.' },
  { id:'golf-clubs',      name:'Persimmon Golf Club Set',          cat:'Sports',       icon:'ph-golf',          color:'#34D399', baseEMV:90,     rarity:'common',    askRange:[0.5,1.0], fake:false, phases:['garage','auction'],          flavor:'MacGregor irons. Leather grips, full bag.' },
  { id:'jersey-signed',   name:'Signed Football Jersey',           cat:'Sports',       icon:'ph-trophy',        color:'#34D399', baseEMV:2100,   rarity:'legendary', askRange:[0.4,0.9], fake:true,  phases:['estate','auction'],          flavor:"Certificate of authenticity may or may not be real." },
  { id:'boxing-gloves',   name:'Championship Boxing Gloves',       cat:'Sports',       icon:'ph-boxing-glove',  color:'#34D399', baseEMV:360,    rarity:'rare',      askRange:[0.5,1.0], fake:true,  phases:['estate','auction'],          flavor:'Red leather, well-worn. Provenance is murky.' },
  { id:'pennant-old',     name:'Vintage Stadium Pennant',          cat:'Sports',       icon:'ph-flag-banner',   color:'#34D399', baseEMV:75,     rarity:'common',    askRange:[0.5,1.0], fake:false, phases:['garage','auction'],          flavor:'Wool felt, 1957. Faded but intact.' },
  { id:'skis-vintage',    name:'Wooden Downhill Skis',             cat:'Sports',       icon:'ph-snowflake',     color:'#34D399', baseEMV:110,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['garage','auction'],          flavor:'Blizzard brand, lace-up bindings. Wall art potential.' },
  { id:'ball-babe-ruth',  name:'Babe Ruth Signed Baseball',        cat:'Sports',       icon:'ph-baseball',      color:'#34D399', baseEMV:12000,  rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:'Single-signed OAL ball. Blue ink, strong signature.' },
  { id:'card-jordan',     name:"Michael Jordan Rookie Card",       cat:'Sports',       icon:'ph-trophy',        color:'#34D399', baseEMV:15000,  rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:"1986-87 Fleer #57. Every collector's white whale." },
  { id:'skates-quad',     name:'Vintage Quad Rollerskates',        cat:'Sports',       icon:'ph-boot',          color:'#34D399', baseEMV:55,     rarity:'common',    askRange:[0.5,1.0], fake:false, phases:['garage','auction'],          flavor:'White leather, red wheels. Size 8. Disco ready.' },
  { id:'racket-kramer',   name:'Jack Kramer Wood Tennis Racket',   cat:'Sports',       icon:'ph-trophy',        color:'#34D399', baseEMV:120,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['garage','estate','auction'], flavor:'Wilson. Press and gut strings. A classic.' },
  { id:'olympic-torch',   name:'1984 Olympic Commemorative Torch', cat:'Sports',       icon:'ph-star',          color:'#34D399', baseEMV:890,    rarity:'rare',      askRange:[0.5,1.0], fake:true,  phases:['estate','auction'],          flavor:'LA Games. Carrier torch. Some do exist out there.' },
  { id:'hockey-puck-wg',  name:'Signed Hockey Puck',               cat:'Sports',       icon:'ph-trophy',        color:'#34D399', baseEMV:2200,   rarity:'legendary', askRange:[0.4,0.9], fake:true,  phases:['estate','auction'],          flavor:'Gretzky signature. COA included — verify it anyway.' },
  { id:'croquet-set',     name:'Victorian Croquet Set',            cat:'Sports',       icon:'ph-golf',          color:'#34D399', baseEMV:95,     rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['estate','auction'],          flavor:'Boxwood mallets, iron hoops, original box.' },
  { id:'duck-decoy',      name:"Carved Duck Decoy",                cat:'Sports',       icon:'ph-star',          color:'#34D399', baseEMV:560,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:"Mason's Challenge Grade. All original paint." },
  { id:'ball-mantle',     name:"Mickey Mantle Signed Baseball",    cat:'Sports',       icon:'ph-baseball',      color:'#34D399', baseEMV:4800,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:'The Mick, blue sharpie. COA says PSA. Check it.' },
  { id:'bowling-ball',    name:'Marbled Vintage Bowling Ball',     cat:'Sports',       icon:'ph-coin',          color:'#34D399', baseEMV:20,     rarity:'common',    askRange:[0.4,0.9], fake:false, phases:['garage'],                    flavor:"Ebonite. Name 'Chuck' engraved. Nobody wants it." },
  { id:'fishing-fly-kit', name:"Fly Tying Kit (Complete)",         cat:'Sports',       icon:'ph-star',          color:'#34D399', baseEMV:40,     rarity:'common',    askRange:[0.5,1.0], fake:false, phases:['garage'],                    flavor:'50 hooks, 30 feathers, thread, whip finisher. Used once.' },

  // ── ART ────────────────────────────────────────────────────────────
  { id:'painting-oil',    name:'Oil Landscape c.1920',             cat:'Art',          icon:'ph-paint-brush',   color:'#C084FC', baseEMV:850,    rarity:'rare',      askRange:[0.3,0.9], fake:true,  phases:['estate','auction'],          flavor:'No signature visible. Stretched canvas, thick impasto.' },
  { id:'figurine-bronze', name:'Bronze Equestrian Figurine',       cat:'Art',          icon:'ph-horse',         color:'#C084FC', baseEMV:440,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'Weight feels right. Foundry mark on base is worn.' },
  { id:'print-litho',     name:'Vintage Lithograph Print',         cat:'Art',          icon:'ph-image',         color:'#C084FC', baseEMV:220,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'Art Deco travel poster. Color registration is perfect.' },
  { id:'pottery-vase',    name:'Studio Pottery Vase',              cat:'Art',          icon:'ph-vase',          color:'#C084FC', baseEMV:160,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Hand-thrown, signed on the bottom. Glaze is stunning.' },
  { id:'tin-toys',        name:'Tin Toy Robots (Set of 3)',        cat:'Art',          icon:'ph-robot',         color:'#C084FC', baseEMV:380,    rarity:'rare',      askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:'Space age, 1950s Japan. Wind-up mechanisms intact.' },
  { id:'velvet-elvis',    name:'Velvet Elvis Portrait',            cat:'Art',          icon:'ph-image',         color:'#C084FC', baseEMV:15,     rarity:'common',    askRange:[0.5,1.5], fake:false, phases:['garage'],                    flavor:"Blacklight reactive. The King in all his velvet glory." },
  { id:'paint-by-number', name:'Paint-by-Numbers Landscape',      cat:'Art',          icon:'ph-paint-brush',   color:'#C084FC', baseEMV:8,      rarity:'common',    askRange:[0.5,2.0], fake:false, phases:['garage'],                    flavor:"'Deer at Dusk.' Perfectly executed. Sentimental zero." },
  { id:'wpa-poster',      name:'WPA Government Poster (original)',  cat:'Art',         icon:'ph-image',         color:'#C084FC', baseEMV:1200,   rarity:'rare',      askRange:[0.4,0.9], fake:true,  phases:['estate','auction'],          flavor:'National Parks series. Silk-screened, linen-backed.' },
  { id:'stained-glass',   name:'Tiffany Stained Glass Panel',     cat:'Art',          icon:'ph-star',          color:'#C084FC', baseEMV:4500,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:'Leaded grape motif. Signature on lead came.' },
  { id:'lobby-card-kong', name:'King Kong 1933 Lobby Card Set',   cat:'Art',          icon:'ph-film-strip',    color:'#C084FC', baseEMV:1800,   rarity:'rare',      askRange:[0.4,0.9], fake:true,  phases:['estate','auction'],          flavor:'Set of 8. Linen-backed. Stunning color lithography.' },
  { id:'warhol-proof',    name:"Warhol Soup Can Proof Sheet",      cat:'Art',          icon:'ph-paint-brush',   color:'#C084FC', baseEMV:25000,  rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['auction'],                   flavor:'Uncut proof. Stamp from Factory assistant.', ultraRare:true },
  { id:'mask-tribal',     name:'Indigenous Ceremonial Mask',       cat:'Art',          icon:'ph-star',          color:'#C084FC', baseEMV:680,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Carved hardwood, natural pigment. Provenance unknown.' },
  { id:'charcoal-portrait',name:'Victorian Charcoal Portrait',     cat:'Art',          icon:'ph-image',         color:'#C084FC', baseEMV:95,     rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate'],           flavor:"Unknown subject. Gilt frame. Stares right through you." },
  { id:'macaroni-art',    name:"Grammy's Macaroni Art Portrait",   cat:'Art',          icon:'ph-paint-brush',   color:'#C084FC', baseEMV:1,      rarity:'common',    askRange:[1.0,5.0], fake:false, phases:['garage'],                    flavor:"Elbow macaroni. Spray-painted gold. A masterpiece." },
  { id:'dali-print',      name:'Salvador Dali Etching (signed)',   cat:'Art',          icon:'ph-image',         color:'#C084FC', baseEMV:2800,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:"Numbered 84/250. Pencil signature. Dali signed everything, so." },

  // ── CLOTHING & ACCESSORIES ─────────────────────────────────────────
  { id:'bag-lv',          name:'Louis Vuitton Speedy Bag',         cat:'Clothing',     icon:'ph-handbag',       color:'#F472B6', baseEMV:580,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['garage','estate','auction'], flavor:'Monogram canvas. Date code needs authenticating.' },
  { id:'jacket-denim',    name:'Lee 101Z Denim Jacket',            cat:'Clothing',     icon:'ph-t-shirt',       color:'#F472B6', baseEMV:190,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:'1960s selvedge. Fade pattern is natural, not artificial.' },
  { id:'boots-cowboy',    name:'Tony Lama Cowboy Boots',           cat:'Clothing',     icon:'ph-boot',          color:'#F472B6', baseEMV:155,    rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['garage','auction'],          flavor:'Lizard skin, size 10. Some scuffing on the toe box.' },
  { id:'fur-coat',        name:"Vintage Mink Coat",                cat:'Clothing',     icon:'ph-coat-hanger',   color:'#F472B6', baseEMV:420,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:"Full-length. Lining intact. Provenance unknown." },
  { id:'scarf-hermes',    name:'Hermès Silk Scarf',                cat:'Clothing',     icon:'ph-scarf',         color:'#F472B6', baseEMV:280,    rarity:'rare',      askRange:[0.4,1.1], fake:true,  phases:['estate','auction'],          flavor:'Equestrian print. Rolled hem, looks hand-stitched.' },
  { id:'shirt-shaheen',   name:'Alfred Shaheen Hawaiian Shirt',    cat:'Clothing',     icon:'ph-t-shirt',       color:'#F472B6', baseEMV:180,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:"1950s hand-screened silk. Elvis wore these, y'know." },
  { id:'jeans-big-e',     name:"Levi's 501 Big E (1950s)",         cat:'Clothing',     icon:'ph-t-shirt',       color:'#F472B6', baseEMV:420,    rarity:'rare',      askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:"Capital 'E' on the red tab. Pre-1971. Denimheads know." },
  { id:'army-jacket',     name:'WWII Army Field Jacket M-41',      cat:'Clothing',     icon:'ph-coat-hanger',   color:'#F472B6', baseEMV:145,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Wool. Name tape still inside: SGT. HARRIS, R.' },
  { id:'platforms-disco', name:'Disco Platform Shoes',             cat:'Clothing',     icon:'ph-boot',          color:'#F472B6', baseEMV:35,     rarity:'common',    askRange:[0.5,1.0], fake:false, phases:['garage','auction'],          flavor:"4-inch soles. Patent leather. Untouched since 1979." },
  { id:'pendleton-blanket',name:'Pendleton Wool Blanket',          cat:'Clothing',     icon:'ph-coat-hanger',   color:'#F472B6', baseEMV:140,    rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Chief Joseph pattern. Full selvedge. No moths.' },
  { id:'tuxedo-rat-pack', name:"1960s Slim Tuxedo",                cat:'Clothing',     icon:'ph-coat-hanger',   color:'#F472B6', baseEMV:175,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'One-button, notch lapel. Fits a 40R.' },
  { id:'chanel-no5',      name:'Sealed Vintage Chanel No. 5',      cat:'Clothing',     icon:'ph-vase',          color:'#F472B6', baseEMV:340,    rarity:'rare',      askRange:[0.4,0.9], fake:true,  phases:['estate','auction'],          flavor:'1970s rectangular bottle. Sealed with original box.' },

  // ── BOOKS & MEDIA ──────────────────────────────────────────────────
  { id:'book-hemingway',  name:"1st Ed. The Sun Also Rises",       cat:'Books',        icon:'ph-book-open',     color:'#FCD34D', baseEMV:1100,   rarity:'legendary', askRange:[0.3,0.8], fake:false, phases:['estate','auction'],          flavor:'Scribner, 1926. Spine crack but boards are tight.' },
  { id:'comic-action1',   name:"Action Comics (Early Run)",        cat:'Books',        icon:'ph-newspaper',     color:'#FCD34D', baseEMV:800,    rarity:'legendary', askRange:[0.3,0.8], fake:false, phases:['estate','auction'],          flavor:'Spine roll, colour solid. Grade conservatively.' },
  { id:'vinyl-beatles',   name:"Beatles White Album Vinyl",        cat:'Books',        icon:'ph-vinyl-record',  color:'#FCD34D', baseEMV:340,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:'UK pressing. Both LPs, poster and photos present.' },
  { id:'map-atlas',       name:'Antique World Atlas 1890s',        cat:'Books',        icon:'ph-map-trifold',   color:'#FCD34D', baseEMV:185,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'Colour-plate maps, hand-tipped. Binding solid.' },
  { id:'book-paperback',  name:'Pulp Paperback Collection',        cat:'Books',        icon:'ph-books',         color:'#FCD34D', baseEMV:35,     rarity:'common',    askRange:[0.4,0.9], fake:false, phases:['garage','auction'],          flavor:'Box of 40 mystery and sci-fi pockets. Mixed lot.' },
  { id:'book-harry-potter',name:"Harry Potter (1st UK edition)",   cat:'Books',        icon:'ph-book-open',     color:'#FCD34D', baseEMV:6500,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:"Bloomsbury, 1997. 'Joanne Rowling' not J.K. Look for it." },
  { id:'vinyl-star-wars', name:'Star Wars Original Soundtrack Vinyl',cat:'Books',      icon:'ph-vinyl-record',  color:'#FCD34D', baseEMV:120,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','auction'],          flavor:"Fox, 1977. 2-LP gatefold. John Williams conducting." },
  { id:'vinyl-elvis-45',  name:'Elvis "Heartbreak Hotel" 45rpm',   cat:'Books',        icon:'ph-vinyl-record',  color:'#FCD34D', baseEMV:480,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'RCA Victor, 1956. First pressing. Near-mint label.' },
  { id:'woodstock-program',name:"Woodstock '69 Concert Program",   cat:'Books',        icon:'ph-newspaper',     color:'#FCD34D', baseEMV:350,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Complete with ticket stub. Mud-stained but legible.' },
  { id:'comic-spiderman', name:"Amazing Fantasy #15",              cat:'Books',        icon:'ph-newspaper',     color:'#FCD34D', baseEMV:8000,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:"Spider-Man's debut. Heavily counterfeited. Test the paper." },
  { id:'vinyl-butcher',   name:'Beatles Butcher Cover Vinyl',      cat:'Books',        icon:'ph-vinyl-record',  color:'#FCD34D', baseEMV:2800,   rarity:'legendary', askRange:[0.3,0.8], fake:false, phases:['estate','auction'],          flavor:'Yesterday and Today. Third state paste-over. Look closely.' },
  { id:'dnd-rulebook',    name:'Original D&D Rulebook Set (1974)', cat:'Books',        icon:'ph-books',         color:'#FCD34D', baseEMV:900,    rarity:'rare',      askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'Three brown booklets. Gygax and Arneson. Very worn.' },
  { id:'eighttrack-box',  name:'Box of 8-Track Tapes (31)',        cat:'Books',        icon:'ph-books',         color:'#FCD34D', baseEMV:25,     rarity:'common',    askRange:[0.4,0.9], fake:false, phases:['garage'],                    flavor:"Mostly country. Someone's entire 1970s in a shoebox." },
  { id:'playboy-one',     name:"Playboy Issue #1 (December 1953)", cat:'Books',        icon:'ph-newspaper',     color:'#FCD34D', baseEMV:5500,   rarity:'legendary', askRange:[0.3,0.8], fake:false, phases:['estate','auction'],          flavor:"Marilyn Monroe. No month on cover — that's the tell." },
  { id:'joy-of-cooking',  name:'Joy of Cooking First Edition',     cat:'Books',        icon:'ph-book-open',     color:'#FCD34D', baseEMV:220,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'Irma Rombauer, 1931. Self-published. Spine worn but complete.' },

  // ── COLLECTIBLES & COINS ───────────────────────────────────────────
  { id:'watch-pocket',    name:'Gold Pocket Watch',                cat:'Collectibles', icon:'ph-watch',         color:'#F59E0B', baseEMV:920,    rarity:'legendary', askRange:[0.4,0.9], fake:true,  phases:['estate','auction'],          flavor:'Waltham 17-jewel. Case stamped 14k — assay it.' },
  { id:'coins-liberty',   name:'Walking Liberty Half Set',         cat:'Collectibles', icon:'ph-coin',          color:'#F59E0B', baseEMV:1200,   rarity:'legendary', askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'Near-complete set, album included. Strong strikes.' },
  { id:'stamps-classic',  name:'US Classic Stamp Collection',      cat:'Collectibles', icon:'ph-stamp',         color:'#F59E0B', baseEMV:380,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Scott catalogue pages. Several high-value issues.' },
  { id:'globe-snow',      name:'Hand-Painted Snow Globe',          cat:'Collectibles', icon:'ph-globe',         color:'#F59E0B', baseEMV:65,     rarity:'common',    askRange:[0.5,1.1], fake:false, phases:['garage','auction'],          flavor:'1940s Paris scene. Mechanism still plays Edith Piaf.' },
  { id:'carousel-horse',  name:'Carved Carousel Horse',            cat:'Collectibles', icon:'ph-horse',         color:'#F59E0B', baseEMV:1600,   rarity:'legendary', askRange:[0.5,1.2], fake:false, phases:['auction'],                   flavor:'Solid basswood, full-size. Original paint, minor chips.' },
  { id:'coin-morgan',     name:'Morgan Silver Dollar (1878-S)',    cat:'Collectibles', icon:'ph-coin',          color:'#F59E0B', baseEMV:180,    rarity:'uncommon',  askRange:[0.4,0.9], fake:true,  phases:['garage','estate','auction'], flavor:'San Francisco mint. AU-55 maybe. Bag marks on cheek.' },
  { id:'coin-kennedy',    name:'1964 Kennedy Half Dollar (Proof)', cat:'Collectibles', icon:'ph-coin',          color:'#F59E0B', baseEMV:20,     rarity:'common',    askRange:[0.5,1.5], fake:false, phases:['garage','auction'],          flavor:"Shiny. Could be worth $20. Could be $4,000. Look it up." },
  { id:'coin-lincoln-vdb',name:"1909-S VDB Lincoln Penny",        cat:'Collectibles', icon:'ph-coin',          color:'#F59E0B', baseEMV:850,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:"484,000 minted. VDB initials on the reverse. Grade it." },
  { id:'coin-roman',      name:'Roman Denarius (unverified)',      cat:'Collectibles', icon:'ph-coin',          color:'#F59E0B', baseEMV:95,     rarity:'uncommon',  askRange:[0.4,1.1], fake:true,  phases:['garage','estate','auction'], flavor:'2nd century AD maybe. Silver, corroded. Could be real.' },
  { id:'coin-confederate',name:'Confederate Currency Set (8 bills)',cat:'Collectibles',icon:'ph-newspaper',     color:'#F59E0B', baseEMV:150,    rarity:'uncommon',  askRange:[0.4,1.0], fake:true,  phases:['garage','estate'],           flavor:'$5 to $100 denominations. Heavily counterfeited era.' },
  { id:'campaign-button', name:'Teddy Roosevelt Campaign Button',  cat:'Collectibles', icon:'ph-star',          color:'#F59E0B', baseEMV:135,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:'1904. Celluloid over tin. TR profile, sharp.' },
  { id:'happy-meal-toys', name:"McDonald's Happy Meal Set (1980s)",cat:'Collectibles', icon:'ph-star',          color:'#F59E0B', baseEMV:220,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['garage','auction'],          flavor:"Complete in original bags. McBoo Halloween series. Mint." },
  { id:'sw-action-figure',name:'Star Wars 12-Back Action Figure',  cat:'Collectibles', icon:'ph-star',          color:'#F59E0B', baseEMV:650,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['garage','estate','auction'], flavor:"Original Kenner. 12-back card. Bubble yellowed but unpopped." },
  { id:'pez-collection',  name:'Pez Dispenser Collection (80+)',   cat:'Collectibles', icon:'ph-package',       color:'#F59E0B', baseEMV:290,    rarity:'uncommon',  askRange:[0.4,0.9], fake:false, phases:['garage','auction'],          flavor:'Shoebox lot. Includes Bride & Groom. All stems present.' },
  { id:'hw-beach-bomb',   name:'Hot Wheels "Pink Beach Bomb"',     cat:'Collectibles', icon:'ph-star',          color:'#F59E0B', baseEMV:125000, rarity:'legendary', askRange:[0.2,0.6], fake:true,  phases:['auction'],                   flavor:"The Holy Grail. Only 50 exist. Probably a redline copy.", ultraRare:true },
  { id:'depression-glass',name:'Pink Depression Glass Set (12)',   cat:'Collectibles', icon:'ph-vase',          color:'#F59E0B', baseEMV:160,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Mayfair pattern. No chips. Loads of pink light.' },
  { id:'gi-joe-vintage',  name:"G.I. Joe Set (1964 original)",     cat:'Collectibles', icon:'ph-star',          color:'#F59E0B', baseEMV:780,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:"First run. Fuzzy hair. 8 of 12 accessories present." },
  { id:'mood-ring',       name:'1970s Mood Ring',                  cat:'Collectibles', icon:'ph-ring',          color:'#F59E0B', baseEMV:8,      rarity:'common',    askRange:[0.5,2.0], fake:false, phases:['garage'],                    flavor:"Still changes color. Blue means 'calm.' Or it's just cold." },
  { id:'beanie-babies',   name:"Beanie Baby Collection (w/tags)",  cat:'Collectibles', icon:'ph-star',          color:'#F59E0B', baseEMV:45,     rarity:'common',    askRange:[0.5,1.5], fake:false, phases:['garage','auction'],          flavor:"28 with tags. Princess the bear included. Mom's investment." },
  { id:'faberge-egg',     name:"Fabergé Egg (claimed)",            cat:'Collectibles', icon:'ph-globe',         color:'#F59E0B', baseEMV:250000, rarity:'legendary', askRange:[0.2,0.5], fake:true,  phases:['auction'],                   flavor:"Seller says it's genuine. Seven legitimate ones are missing.", ultraRare:true },

  // ── JEWELRY ────────────────────────────────────────────────────────
  { id:'brooch-pearl',    name:'Art Deco Pearl Brooch',            cat:'Jewelry',      icon:'ph-diamond',       color:'#FDE68A', baseEMV:480,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'Platinum setting. Pearls are lustrous but check orientation.' },
  { id:'ring-cameo',      name:'Victorian Cameo Ring',             cat:'Jewelry',      icon:'ph-ring',          color:'#FDE68A', baseEMV:310,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Shell cameo in gold bezel setting, mourning hair inside.' },
  { id:'bracelet-silver', name:'Sterling Link Bracelet',           cat:'Jewelry',      icon:'ph-sparkle',       color:'#FDE68A', baseEMV:95,     rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:'Heavy gauge, stamped 925. Maker mark on clasp.' },
  { id:'earrings-estate', name:'Garnet Drop Earrings',             cat:'Jewelry',      icon:'ph-diamond',       color:'#FDE68A', baseEMV:140,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Rose gold tone. Stones test as genuine garnet.' },
  { id:'locket-gold',     name:'Victorian Gold Locket',            cat:'Jewelry',      icon:'ph-heart',         color:'#FDE68A', baseEMV:260,    rarity:'uncommon',  askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'Engraved floral case. Miniature portrait inside.' },
  { id:'ring-diamond',    name:'Diamond Solitaire Ring (estate)',  cat:'Jewelry',      icon:'ph-diamond',       color:'#FDE68A', baseEMV:1800,   rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'1.2 carat, appraised. Stone could be moissanite. Test it.' },
  { id:'brooch-mourning', name:'Victorian Mourning Hair Brooch',   cat:'Jewelry',      icon:'ph-heart',         color:'#FDE68A', baseEMV:145,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:"Human hair sealed in glass. Morbid. Increasingly desirable." },
  { id:'bracelet-copper', name:'Copper Healing Bracelet (1970s)', cat:'Jewelry',      icon:'ph-sparkle',       color:'#FDE68A', baseEMV:12,     rarity:'common',    askRange:[0.5,1.5], fake:false, phases:['garage'],                    flavor:"For arthritis. Probably doesn't work. Still sells today." },
  { id:'jade-bangle',     name:'Antique Chinese Jade Bangle',     cat:'Jewelry',      icon:'ph-ring',          color:'#FDE68A', baseEMV:520,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'Translucent green. Nephrite or glass — a gemologist decides.' },
  { id:'necklace-pearl',  name:'Edwardian Seed Pearl Necklace',   cat:'Jewelry',      icon:'ph-sparkle',       color:'#FDE68A', baseEMV:280,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'156 natural seed pearls on silk. Gold filigree clasp.' },
  { id:'ring-masonic',    name:"Men's Masonic Ring (14k gold)",   cat:'Jewelry',      icon:'ph-ring',          color:'#FDE68A', baseEMV:195,    rarity:'uncommon',  askRange:[0.5,1.0], fake:false, phases:['estate','auction'],          flavor:'Square and compass. Third degree. Initials inside.' },
  { id:'cuff-native',     name:'Native American Silver Cuff',     cat:'Jewelry',      icon:'ph-sparkle',       color:'#FDE68A', baseEMV:380,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'Navajo stamped silver. Turquoise stones, hand-cut.' },
  { id:'rhinestone-lot',  name:'1950s Rhinestone Brooch Set',     cat:'Jewelry',      icon:'ph-sparkle',       color:'#FDE68A', baseEMV:55,     rarity:'common',    askRange:[0.5,1.1], fake:false, phases:['garage','estate'],           flavor:'6 pieces. Weiss, Eisenberg, and others. All signed.' },
  { id:'charm-bracelet',  name:'14k Gold Charm Bracelet',         cat:'Jewelry',      icon:'ph-sparkle',       color:'#FDE68A', baseEMV:640,    rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'22 charms. Eiffel tower, Scottie dog, tiny working lock.' },
  { id:'moonstone-pendant',name:'Moonstone Arts & Crafts Pendant',cat:'Jewelry',      icon:'ph-diamond',       color:'#FDE68A', baseEMV:235,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Silver setting, curling leaf motif. Adularescence stunning.' },

  // ── ODDITIES & CURIOSITIES ─────────────────────────────────────────
  { id:'jackalope',       name:'Taxidermied Jackalope',            cat:'Oddities',     icon:'ph-star',          color:'#FB923C', baseEMV:45,     rarity:'common',    askRange:[0.5,1.5], fake:false, phases:['garage','auction'],          flavor:"Antlers glued to a rabbit. Everyone needs one." },
  { id:'shrunken-head',   name:'Shrunken Head (tourist replica)',  cat:'Oddities',     icon:'ph-globe',         color:'#FB923C', baseEMV:15,     rarity:'common',    askRange:[0.5,2.0], fake:false, phases:['garage'],                    flavor:'Rubber and hair. Made in Ecuador. Says so on the bottom.' },
  { id:'two-headed-coin', name:'Two-Headed Coin',                  cat:'Oddities',     icon:'ph-coin',          color:'#FB923C', baseEMV:8,      rarity:'common',    askRange:[0.5,3.0], fake:false, phases:['garage'],                    flavor:"A magician's prop. Both sides are heads. For cheating." },
  { id:'cannonball',      name:'Civil War Cannonball (inert)',     cat:'Oddities',     icon:'ph-coin',          color:'#FB923C', baseEMV:580,    rarity:'rare',      askRange:[0.4,0.9], fake:false, phases:['estate','auction'],          flavor:'12-pounder. Excavated Gettysburg area. Inert — probably.' },
  { id:'hair-wreath',     name:'Victorian Mourning Hair Wreath',   cat:'Oddities',     icon:'ph-heart',         color:'#FB923C', baseEMV:110,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:'Human hair, woven into flowers. Under glass dome. Intact.' },
  { id:'dummy-ventriloquist',name:'Hand-Carved Ventriloquist Dummy',cat:'Oddities',    icon:'ph-star',          color:'#FB923C', baseEMV:195,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:"Named 'Eddie.' Eyes follow you. Mouth opens smooth." },
  { id:'crystal-ball',    name:"Fortune-Teller's Crystal Ball",   cat:'Oddities',     icon:'ph-globe',         color:'#FB923C', baseEMV:35,     rarity:'common',    askRange:[0.5,1.5], fake:false, phases:['garage','auction'],          flavor:"4-inch glass sphere. Stand included. Sees all, tells nothing." },
  { id:'medical-shock',   name:'Victorian Electric Shock Device', cat:'Oddities',     icon:'ph-star',          color:'#FB923C', baseEMV:165,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:"For 'nervous disorders.' Two handles, a crank, a prayer." },
  { id:'ouija-fuld',      name:'William Fuld Ouija Board',        cat:'Oddities',     icon:'ph-star',          color:'#FB923C', baseEMV:240,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate','auction'], flavor:'Pre-Parker Brothers. 1920s. Original box and planchette.' },
  { id:'rabbit-foot',     name:"Lucky Rabbit's Foot Keychain",    cat:'Oddities',     icon:'ph-star',          color:'#FB923C', baseEMV:5,      rarity:'common',    askRange:[0.5,3.0], fake:false, phases:['garage'],                    flavor:"A real rabbit's foot. Pink fur, brass cap. Didn't help the rabbit." },
  { id:'mummy-cat',       name:'Mummified Cat (Egyptian, claimed)',cat:'Oddities',     icon:'ph-star',          color:'#FB923C', baseEMV:1200,   rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:'Linen-wrapped. British Museum sold these. Real ones exist.' },
  { id:'alien-reel',      name:'"Alien Autopsy" Film Reel',       cat:'Oddities',     icon:'ph-film-strip',    color:'#FB923C', baseEMV:75,     rarity:'uncommon',  askRange:[0.5,2.0], fake:true,  phases:['garage','auction'],          flavor:"Props from the 1995 Fox hoax. Seller swears it's the original." },
  { id:'shrunken-head-real',name:'Tsantsa Shrunken Head (genuine)',cat:'Oddities',     icon:'ph-globe',         color:'#FB923C', baseEMV:3200,   rarity:'rare',      askRange:[0.3,0.8], fake:false, phases:['auction'],                   flavor:'Jivaro people, Ecuador. Human hair. Museum quality. Complicated.' },
  { id:'ouija-board-gen', name:'Ouija Board (1930s, Mystifying Oracle)',cat:'Oddities',icon:'ph-star',          color:'#FB923C', baseEMV:140,    rarity:'uncommon',  askRange:[0.4,1.0], fake:false, phases:['garage','estate'],           flavor:'William Fuld era. All letters crisp. Planchette intact.' },
  { id:'electric-chair-miniature',name:'Prison Souvenir Electric Chair',cat:'Oddities',icon:'ph-star',         color:'#FB923C', baseEMV:60,     rarity:'common',    askRange:[0.5,1.5], fake:false, phases:['garage','auction'],          flavor:"Sing Sing gift shop, circa 1960. Tiny wooden chair. Grim." },

  // ── POP CULTURE MEMORABILIA ────────────────────────────────────────
  { id:'friends-poster',  name:'"Friends" Cast Signed Poster',    cat:'Memorabilia',  icon:'ph-star',          color:'#A78BFA', baseEMV:380,    rarity:'rare',      askRange:[0.5,1.1], fake:true,  phases:['garage','estate','auction'], flavor:'All 6 cast. Season 3 promo poster. 3 signatures look hesitant.' },
  { id:'sw-lobby-1977',   name:'Star Wars Lobby Card Set (1977)', cat:'Memorabilia',  icon:'ph-film-strip',    color:'#A78BFA', baseEMV:620,    rarity:'rare',      askRange:[0.4,1.0], fake:false, phases:['estate','auction'],          flavor:"Set of 8. A New Hope. Style B. Luke's hair is perfect." },
  { id:'elvis-signed-photo',name:'Elvis Presley Signed Photo',    cat:'Memorabilia',  icon:'ph-star',          color:'#A78BFA', baseEMV:4200,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:"'To Linda — Love, Elvis.' Green sharpie. COA from Memphis." },
  { id:'marilyn-signed',  name:'Marilyn Monroe Signed Headshot',  cat:'Memorabilia',  icon:'ph-star',          color:'#A78BFA', baseEMV:8500,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['auction'],                   flavor:"Inscribed 'To my dearest.' Black fountain pen. Expert eyes needed." },
  { id:'beatles-signed-prog',name:'Beatles Signed Tour Program (1964)',cat:'Memorabilia',icon:'ph-newspaper',   color:'#A78BFA', baseEMV:12000,  rarity:'legendary', askRange:[0.3,0.7], fake:true,  phases:['auction'],                   flavor:'All four. Hollywood Bowl. Lennon scrawl barely legible. Incredible.' },
  { id:'mj-thriller-signed',name:'"Thriller" Signed Liner Notes', cat:'Memorabilia',  icon:'ph-star',          color:'#A78BFA', baseEMV:3800,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['estate','auction'],          flavor:"Jackson signed in purple ink. 'MJ' with a moon. COA attached." },
  { id:'bob-ross-signed',  name:'Bob Ross "Happy Clouds" Print',  cat:'Memorabilia',  icon:'ph-paint-brush',   color:'#A78BFA', baseEMV:2100,   rarity:'rare',      askRange:[0.4,1.0], fake:true,  phases:['estate','auction'],          flavor:"Signed below a small original oil sketch. 'Happy painting!'" },
  { id:'seinfeld-cast',   name:'Seinfeld Cast Photo (all 4)',     cat:'Memorabilia',  icon:'ph-star',          color:'#A78BFA', baseEMV:420,    rarity:'uncommon',  askRange:[0.5,1.1], fake:true,  phases:['garage','estate','auction'], flavor:'Jerry, George, Elaine, Kramer. Black Sharpie. No COA.' },
  { id:'wwe-hogan-shirt', name:"Hulk Hogan WWF T-Shirt (1984)",   cat:'Memorabilia',  icon:'ph-t-shirt',       color:'#A78BFA', baseEMV:155,    rarity:'uncommon',  askRange:[0.5,1.1], fake:false, phases:['garage','estate','auction'], flavor:"'Real American.' Original WWF logo. Pre-1986 cut." },
  { id:'nirvana-signed',  name:"Nirvana 'In Utero' Signed Liner", cat:'Memorabilia',  icon:'ph-star',          color:'#A78BFA', baseEMV:6200,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['auction'],                   flavor:"All three. Dave's is huge. Kurt's is tiny and perfect." },
  { id:'diana-signed',    name:"Princess Diana Signed Photograph",cat:'Memorabilia',  icon:'ph-star',          color:'#A78BFA', baseEMV:5600,   rarity:'legendary', askRange:[0.3,0.8], fake:true,  phases:['auction'],                   flavor:"'Diana' in blue Biro. 1992 charity event. RR Authentication." },
  { id:'rogers-cardigan', name:"Mr. Rogers' Neighborhood Cardigan",cat:'Memorabilia', icon:'ph-coat-hanger',   color:'#A78BFA', baseEMV:35000,  rarity:'legendary', askRange:[0.3,0.7], fake:true,  phases:['auction'],                   flavor:"Red zipper cardigan. Tag reads 'Fred Rogers.' Smithsonian provenance?", ultraRare:true },
  { id:'mona-lisa-sketch',name:"Leonardo Sketch (claimed, c.1503)",cat:'Memorabilia', icon:'ph-image',         color:'#A78BFA', baseEMV:2500000,rarity:'legendary', askRange:[0.2,0.5], fake:true,  phases:['auction'],                   flavor:"Seller says: 'preparatory study for the Mona Lisa.' Carbon-dated. Expert opinions vary wildly.", ultraRare:true },
  { id:'constitution-page',name:"Founders' Parchment (claimed)",  cat:'Memorabilia',  icon:'ph-newspaper',     color:'#A78BFA', baseEMV:750000, rarity:'legendary', askRange:[0.2,0.5], fake:true,  phases:['auction'],                   flavor:"Page of text. Signature resembles Hamilton's. Provenance: 'my attic.'", ultraRare:true },
  { id:'first-folio',     name:"Shakespeare First Folio (1623)",  cat:'Memorabilia',  icon:'ph-book-open',     color:'#A78BFA', baseEMV:3000000,rarity:'legendary', askRange:[0.2,0.4], fake:true,  phases:['auction'],                   flavor:"Half the pages. Still worth millions if real. Seller: 'grandma found it.'", ultraRare:true },
];

// ── NPC DIALOGUE ────────────────────────────────────────────────────
const NPC_LINES = {
  offended:  ['That\'s insulting.', 'Are you serious right now?', 'Get real.', 'Boy, you got some nerve.'],
  eager:     ['You\'re awful eager.', 'Bit desperate, aren\'t ya?', '...You sure about that?', 'Hmm. Interesting.'],
  pleased:   ['I can work with that.', 'Now we\'re talking.', 'Fair enough.', 'You know what you\'re doing.'],
  neutral:   ['Let me think...', 'Mmm.', 'That\'s an offer.', 'I dunno...', 'Hmm.'],
  counter:   p => [`How about $${p}?`, `Best I can do is $${p}.`, `$${p} and it\'s yours.`, `Meet me at $${p}.`],
  hostile:   ['We\'re done here.', 'Take a hike.', 'I know what you\'re pulling.', 'Don\'t come back.'],
  final:     p => [`Last chance — $${p}. Take it or leave it.`, `Final offer: $${p}.`, `$${p}, and that\'s it.`],
};

const NEIGHBORHOODS = [
  { id:'riverside',  label:'Riverside',      icon:'ph-house',       x:'25%', y:'30%', cost:5,  phase:'garage',  color:'#10B981',
    wealth:1, wealthLabel:'Working Class', wealthDesc:'A modest neighborhood. Older household items and everyday finds. The occasional hidden gem.', houseMin:1, houseMax:4 },
  { id:'oldtown',    label:'Old Town',        icon:'ph-buildings',   x:'62%', y:'22%', cost:8,  phase:'garage',  color:'#F59E0B',
    wealth:2, wealthLabel:'Middle Class', wealthDesc:'Comfortable older homes. Vintage furniture, books, and collectibles are common here.', houseMin:2, houseMax:5 },
  { id:'sunset',     label:'Sunset Heights',  icon:'ph-house-line',  x:'78%', y:'58%', cost:10, phase:'garage',  color:'#34D399',
    wealth:3, wealthLabel:'Upper Middle', wealthDesc:'Upscale suburb. Quality items with higher asking prices. Rare finds surface here.', houseMin:1, houseMax:3 },
  { id:'downtown',   label:'The Estates',     icon:'ph-bank',        x:'38%', y:'62%', cost:15, phase:'estate',  color:'#C084FC', unlockAt: CONFIG.UNLOCK_ESTATE },
  { id:'industrial', label:'Industrial Row',  icon:'ph-warehouse',   x:'58%', y:'82%', cost:20, phase:'auction', color:'#F59E0B', unlockAt: CONFIG.UNLOCK_AUCTION },
];

// ── GAME STATE ──────────────────────────────────────────────────────
let G = {};
function newGame() {
  G = {
    cash:           CONFIG.START_CASH,
    day:            1,
    phase:          'title',
    inventory:      [],
    totalEarned:    0,
    stats:          { deals:0, auctions:0, fakes:0 },
    pendingEbay:    [],
    locationsVisited: 0,
    milestonesHit:  new Set(),
    bestFind:       null,
    currentSale:    null,
    haggle:         null,
    auction:        null,
    unboxing:       null,
    verdictQueue:   [],
    sellSelectedIdx: -1,
  };
}

// ── SCREEN ROUTER ───────────────────────────────────────────────────
const SCREEN_INITS = {
  map:           initMap,
  boxes:         initBoxes,
  sale:          initSale,
  'pack-pull':   initPackPull,
  haggle:        initHaggle,
  'auction-list':initAuctionList,
  'auction-peek':initAuctionPeek,
  'auction-bid': initAuctionBid,
  unboxing:      initUnboxing,
  verdict:       initVerdict,
  inventory:     initInventory,
  'game-over':   initGameOver,
  win:           initWin,
};
function showScreen(phase) {
  G.phase = phase;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`screen-${phase}`);
  if (el) { el.classList.add('active'); }
  if (SCREEN_INITS[phase]) SCREEN_INITS[phase]();
}

// ── ITEM FACTORY ────────────────────────────────────────────────────
const CONDITIONS = ['Poor','Fair','Good','Excellent'];
const COND_MODS  = [-0.30, -0.10, 0, +0.15];

// How well does THIS seller know what they have? Assigned per item instance,
// at random — independent of the house or neighborhood. This is what makes a
// deal good or bad: a clueless seller underprices a treasure, while an expert
// prices above value and won't budge. Drives asking price, negotiation floor,
// and how fast suspicion climbs.
const SELLER_TIERS = [
  { id:'clueless', label:'No idea what they have', weight:30, askMul:[0.20,0.50], floorFrac:0.50, suspMul:0.35,
    tell:"Honestly, no clue what it's worth. Just want it gone — make me an offer." },
  { id:'unsure',   label:'Vague sense of value',   weight:34, askMul:[0.55,0.85], floorFrac:0.64, suspMul:0.80,
    tell:"Might be worth a little something. What were you thinking?" },
  { id:'savvy',    label:'Knows the market',       weight:26, askMul:[0.90,1.12], floorFrac:0.82, suspMul:1.35,
    tell:"I know what I've got here. Don't bother lowballing me." },
  { id:'expert',   label:'Had it appraised',       weight:10, askMul:[1.05,1.35], floorFrac:0.93, suspMul:1.95,
    tell:"This has been professionally appraised. The price is firm." },
];
function pickSellerTier() {
  const total = SELLER_TIERS.reduce((s, t) => s + t.weight, 0);
  let r = Math.random() * total;
  for (const t of SELLER_TIERS) { if ((r -= t.weight) <= 0) return t; }
  return SELLER_TIERS[1];
}

function createItem(tpl) {
  const ci = Math.floor(Math.random() * 4);
  const emv = Math.round(tpl.baseEMV * (1 + COND_MODS[ci]));
  const isFake = tpl.fake && Math.random() < 0.20;
  // Seller's knowledge sets the asking price relative to true value.
  const tier = pickSellerTier();
  const [amlo, amhi] = tier.askMul;
  const asking = Math.max(1, Math.round(emv * (amlo + Math.random() * (amhi - amlo))));
  return {
    uid: tpl.id + '_' + Date.now() + Math.floor(Math.random()*9999),
    id: tpl.id, name: tpl.name, cat: tpl.cat,
    icon: tpl.icon, color: tpl.color,
    rarity: tpl.rarity, condition: CONDITIONS[ci],
    emv:        isFake ? 5 : emv,
    displayEmv: emv,
    asking, isFake, revealed: false, listed: false,
    seller: { id: tier.id, label: tier.label, floorFrac: tier.floorFrac, suspMul: tier.suspMul, tell: tier.tell },
    flavor: tpl.flavor,
  };
}
function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function rand(lo, hi) { return lo + Math.random() * (hi - lo); }
function pick(arr)    { return arr[Math.floor(Math.random() * arr.length)]; }

function generateSaleItems(phase, count, wealth = 2) {
  const wMap = {
    1: { common: 8, uncommon: 2, rare: 0.3, legendary: 0 },
    2: { common: 5, uncommon: 3, rare: 1.5, legendary: 0.3 },
    3: { common: 2, uncommon: 3, rare: 3, legendary: 1 },
  };
  const w = (phase === 'garage')
    ? (wMap[wealth] || wMap[2])
    : G.cash < 200
      ? { common: 6, uncommon: 3, rare: 1, legendary: 0.2 }
      : G.cash < 600
        ? { common: 4, uncommon: 3, rare: 2, legendary: 0.5 }
        : G.cash < 2000
          ? { common: 2, uncommon: 3, rare: 3, legendary: 1 }
          : { common: 1, uncommon: 2, rare: 3, legendary: 2 };

  const pool = ITEM_DB.filter(t => {
    if (!t.phases.includes(phase)) return false;
    if (t.ultraRare) return Math.random() < 0.005;
    return true;
  });

  const weighted = [];
  pool.forEach(item => {
    const weight = Math.round((w[item.rarity] || 1) * 10);
    for (let i = 0; i < weight; i++) weighted.push(item);
  });

  shuffle(weighted);
  const seen = new Set();
  const selected = [];
  for (const item of weighted) {
    if (!seen.has(item.id) && selected.length < count) {
      seen.add(item.id);
      selected.push(item);
    }
  }

  // Guarantee at least 1 affordable item early game
  if (G.cash < 300 && selected.length > 1) {
    const hasAffordable = selected.some(it => it.baseEMV * 0.7 <= G.cash * 0.6);
    if (!hasAffordable) {
      const cheap = pool.filter(t => t.rarity === 'common' && t.baseEMV < 50);
      if (cheap.length) selected[selected.length - 1] = cheap[Math.floor(Math.random() * cheap.length)];
    }
  }

  return selected.map(createItem);
}
function generateAuctionUnit(phase) {
  const count = 6 + Math.floor(Math.random() * 5); // 6-10 items
  const items = generateSaleItems(phase, count);
  return { items, num: Math.floor(rand(100,999)) };
}

// ── ECONOMY ─────────────────────────────────────────────────────────
function deductOverhead() {
  const total = CONFIG.OVERHEAD_DAILY + (G.day % 7 === 0 ? CONFIG.OVERHEAD_WEEKLY : 0);
  G.cash -= total;
  updateHUD();
  showToast(`−$${total} overhead`, 'danger');
  checkBankrupt();
}
function resolveEbay() {
  const ready = G.pendingEbay.filter(e => e.resolveDay <= G.day);
  ready.forEach(e => {
    const price = e.salePrice ?? e.item.emv;
    G.cash += price;
    G.totalEarned += price;
    // Remove the sold item from inventory so it frees its slot.
    const i = G.inventory.indexOf(e.item);
    if (i !== -1) G.inventory.splice(i, 1);
    const vs = price - e.item.emv;
    const note = vs >= 0 ? `(over estimate)` : `(under estimate)`;
    showToast(`+$${price.toLocaleString()} — ${e.item.name} sold online ${note}`, vs >= 0 ? 'success' : 'danger');
  });
  G.pendingEbay = G.pendingEbay.filter(e => e.resolveDay > G.day);
}
function checkBankrupt() {
  if (G.cash < 0) { setTimeout(() => showScreen('game-over'), 400); }
}
function checkMilestones() {
  for (const m of CONFIG.WIN_MILESTONES) {
    if (G.totalEarned >= m && !G.milestonesHit.has(m)) {
      G.milestonesHit.add(m);
      G.currentMilestone = m;
      setTimeout(() => showScreen('win'), 600);
      return;
    }
  }
}
function endDay() {
  G.day++;
  G.locationsVisited = 0;
  resolveEbay();
  deductOverhead();
  if (G.cash >= 0) {
    checkMilestones();
    if (G.phase !== 'win') showScreen('map');
  }
}
function advanceLocation() {
  G.locationsVisited++;
  if (G.locationsVisited >= CONFIG.LOCATIONS_PER_DAY) endDay();
  else showScreen('map');
}

// ── HUD ─────────────────────────────────────────────────────────────
function updateHUD() {
  const cashEl = document.getElementById('hud-cash');
  if (cashEl) {
    cashEl.textContent = '$' + G.cash.toLocaleString();
    cashEl.classList.remove('coin-pop');
    void cashEl.offsetWidth;
    cashEl.classList.add('coin-pop');
  }
  const dayEl = document.getElementById('hud-day');
  if (dayEl) dayEl.textContent = G.day;
  const invEl = document.getElementById('hud-inv');
  if (invEl) invEl.textContent = `${G.inventory.length}/20`;
  const locsEl = document.getElementById('map-locs-left');
  if (locsEl) locsEl.textContent = CONFIG.LOCATIONS_PER_DAY - G.locationsVisited;
}

// ── MAP ─────────────────────────────────────────────────────────────
function initMap() {
  updateHUD();
  renderMapPins();
  renderPhaseProgress();
}
function renderMapPins() {
  const container = document.getElementById('map-pins');
  container.innerHTML = '';
  NEIGHBORHOODS.forEach(n => {
    const unlocked = !n.unlockAt || G.totalEarned >= n.unlockAt;
    const pin = document.createElement('div');
    pin.className = `map-pin${unlocked ? '' : ' phase-locked'}`;
    pin.style.left = n.x; pin.style.top = n.y;
    pin.innerHTML = `
      <div class="map-pin-dot" style="${unlocked ? `border-color:${n.color}` : ''}">
        <i class="ph-bold ${unlocked ? n.icon : 'ph-lock-simple'}" style="${unlocked ? `color:${n.color}` : ''}"></i>
      </div>
      <div class="map-pin-label">${n.label}</div>
      ${unlocked ? `<div class="map-pin-cost">−$${n.cost}</div>` : `<div class="map-pin-cost">Locked</div>`}`;
    if (unlocked) {
      pin.addEventListener('click', () => visitNeighborhood(n));
    }
    container.appendChild(pin);
  });
}
function renderPhaseProgress() {
  const el = document.getElementById('map-phase-progress');
  el.innerHTML = '';
  if (G.totalEarned < CONFIG.UNLOCK_AUCTION) {
    const next = G.totalEarned < CONFIG.UNLOCK_ESTATE ? CONFIG.UNLOCK_ESTATE : CONFIG.UNLOCK_AUCTION;
    const label = G.totalEarned < CONFIG.UNLOCK_ESTATE ? 'Estate Sales' : 'Storage Auctions';
    const pct = Math.min(100, (G.totalEarned / next) * 100);
    el.innerHTML = `<div class="phase-progress-bar">
      <div class="phase-progress-label"><span>Unlock ${label}</span><span>$${G.totalEarned.toLocaleString()} / $${next.toLocaleString()}</span></div>
      <div class="phase-progress-track"><div class="phase-progress-fill" style="width:${pct}%"></div></div>
    </div>`;
  }
}
function visitNeighborhood(n) {
  if (n.phase === 'garage') {
    showNeighborhoodInfo(n);
    return;
  }
  if (G.cash <= n.cost) { showToast('Not enough cash for travel!', 'danger'); return; }
  G.cash -= n.cost;
  updateHUD();
  if (n.phase === 'auction') {
    G.currentAuctionNeighborhood = n;
    showScreen('auction-list');
  } else {
    const count = 5 + Math.floor(Math.random() * 4);
    G.currentSale = {
      location: n,
      items: generateSaleItems(n.phase, count),
      keptItems: [],
      packPullIdx: 0,
    };
    showScreen('sale');
  }
}

function showNeighborhoodInfo(n) {
  if (G.cash <= n.cost) { showToast('Not enough cash for travel!', 'danger'); return; }
  document.getElementById('nbhood-name').textContent = n.label.toUpperCase();
  document.getElementById('nbhood-wealth-label').textContent = n.wealthLabel || '';
  document.getElementById('nbhood-gas').textContent = `$${n.cost} gas`;
  document.getElementById('nbhood-houses').textContent = `${n.houseMin}–${n.houseMax} houses`;
  document.getElementById('nbhood-desc').textContent = n.wealthDesc || '';
  const dots = document.getElementById('nbhood-wealth-dots');
  dots.innerHTML = [1,2,3].map(i =>
    `<div class="nbhood-wealth-dot${i <= (n.wealth||1) ? ' lit' : ''}"></div>`
  ).join('');
  G._pendingNeighborhood = n;
  const sheet = document.getElementById('neighborhood-sheet');
  const backdrop = document.getElementById('nbhood-sheet-backdrop');
  sheet.hidden = false;
  backdrop.hidden = false;
  requestAnimationFrame(() => sheet.classList.add('visible'));
}

function hideNeighborhoodInfo() {
  const sheet = document.getElementById('neighborhood-sheet');
  const backdrop = document.getElementById('nbhood-sheet-backdrop');
  sheet.classList.remove('visible');
  setTimeout(() => {
    sheet.hidden = true;
    backdrop.hidden = true;
  }, 350);
  G._pendingNeighborhood = null;
}

function startTravel(n) {
  G.cash -= n.cost;
  updateHUD();
  hideNeighborhoodInfo();
  setTimeout(() => {
    const overlay = document.getElementById('travel-overlay');
    document.getElementById('travel-dest-name').textContent = n.label.toUpperCase();
    overlay.hidden = false;
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.hidden = true;
        overlay.style.opacity = '';
        enterNeighborhood(n);
      }, 300);
    }, 2500);
  }, 400);
}

function enterNeighborhood(n) {
  const numHouses = n.houseMin + Math.floor(Math.random() * (n.houseMax - n.houseMin + 1));
  const boxes = Array.from({ length: numHouses }, (_, i) => {
    const itemCount = 1 + Math.floor(Math.random() * 5);
    return { id: i, opened: false, items: generateSaleItems(n.phase, itemCount, n.wealth) };
  });
  G.currentSale = {
    location: n, isBoxFlow: true,
    boxes, openBoxIdx: null, keptItems: [], items: [], packPullIdx: 0,
  };
  showScreen('boxes');
}

function initBoxes() {
  const s = G.currentSale;
  document.getElementById('boxes-location-name').textContent = s.location.label.toUpperCase();
  document.getElementById('boxes-block-label').textContent =
    `${s.boxes.length} HOUSE${s.boxes.length !== 1 ? 'S' : ''} ON THIS BLOCK`;
  document.getElementById('box-items-panel').hidden = true;
  document.getElementById('boxes-done-panel').hidden = true;
  document.getElementById('screen-boxes').classList.remove('browsing');
  renderBoxRow();
}

function renderBoxRow() {
  const s = G.currentSale;
  const row = document.getElementById('boxes-house-row');
  const browsing = !document.getElementById('box-items-panel').hidden;
  row.innerHTML = s.boxes.map((box, i) => {
    const isActive = browsing && i === s.openBoxIdx;
    const cls = isActive ? 'active' : (box.opened ? 'visited' : '');
    const icon = isActive ? 'ph-door-open' : (box.opened ? 'ph-check-circle' : 'ph-house');
    return `
    <div class="house-box${cls ? ' ' + cls : ''}" data-idx="${i}">
      <div class="house-box-icon">
        <i class="ph-bold ${icon}"></i>
      </div>
      <div class="house-box-label">House ${i + 1}</div>
    </div>`;
  }).join('');
  row.querySelectorAll('.house-box').forEach(el => {
    el.addEventListener('click', () => openBox(+el.dataset.idx));
  });
}

function openBox(boxIdx) {
  const s = G.currentSale;
  const box = s.boxes[boxIdx];
  s.openBoxIdx = boxIdx;
  box.opened = true;
  document.getElementById('box-items-panel').hidden = false;
  document.getElementById('boxes-done-panel').hidden = true;
  document.getElementById('screen-boxes').classList.add('browsing');
  renderBoxRow();
  document.getElementById('box-items-header').textContent =
    `HOUSE ${boxIdx + 1} · ${box.items.length} ITEM${box.items.length !== 1 ? 'S' : ''}`;
  renderBoxItems(boxIdx);
}

function renderBoxItems(boxIdx) {
  const box = G.currentSale.boxes[boxIdx];
  const grid = document.getElementById('box-items-grid');
  document.getElementById('box-items-header').textContent =
    `HOUSE ${boxIdx + 1} · ${box.items.length} ITEM${box.items.length !== 1 ? 'S' : ''}`;
  if (box.items.length === 0) {
    grid.innerHTML = '<div class="box-items-empty">Nothing left here.</div>';
    return;
  }
  grid.innerHTML = box.items.map((item, i) => `
    <div class="box-item-card" style="--item-color:${item.color}">
      <div class="box-item-icon"><i class="ph-bold ${item.icon}" style="color:${item.color}"></i></div>
      <div class="box-item-name">${item.name}</div>
      <div class="box-item-cond">${item.condition} · ${item.rarity.toUpperCase()}</div>
      <button class="btn-grab" data-item="${i}">GRAB IT</button>
    </div>
  `).join('');
  grid.querySelectorAll('.btn-grab').forEach(btn => {
    btn.addEventListener('click', () => grabBoxItem(+btn.dataset.item, boxIdx));
  });
}

function grabBoxItem(itemIdx, boxIdx) {
  if (G.inventory.length >= CONFIG.INVENTORY_MAX) {
    showToast('Inventory full! Sell something first.', 'danger');
    return;
  }
  const box = G.currentSale.boxes[boxIdx];
  const item = box.items.splice(itemIdx, 1)[0];
  G.currentSale.openBoxIdx = boxIdx;
  startHaggle(item);
}

function closeBox() {
  document.getElementById('box-items-panel').hidden = true;
  document.getElementById('screen-boxes').classList.remove('browsing');
  renderBoxRow();
  const s = G.currentSale;
  const allOpened = s.boxes.every(b => b.opened);
  if (allOpened) {
    const total = s.keptItems.length;
    document.getElementById('boxes-done-summary').textContent =
      total > 0
        ? `You grabbed ${total} item${total !== 1 ? 's' : ''} from this block.`
        : 'Nothing caught your eye today.';
    document.getElementById('boxes-done-panel').hidden = false;
  }
}

function appraiseItem() {
  const APPRAISE_COST = 5;
  const idx = G.sellSelectedIdx;
  const item = G.inventory[idx];
  if (!item || item.appraised) return;
  if (G.cash < APPRAISE_COST) { showToast('Need $5 to appraise!', 'danger'); return; }
  G.cash -= APPRAISE_COST;
  item.appraised = true;
  updateHUD();
  const emvEl = document.getElementById('inv-detail-emv');
  emvEl.textContent = '$' + item.emv.toLocaleString();
  emvEl.classList.add('appraise-reveal');
  setTimeout(() => emvEl.classList.remove('appraise-reveal'), 800);
  selectInvItem(idx);
  const profit = item.emv - (item.paidPrice || 0);
  showToast(
    profit >= 0
      ? `Worth $${item.emv.toLocaleString()}! +$${profit} margin`
      : `Worth $${item.emv.toLocaleString()}. Paid $${item.paidPrice || '?'}.`,
    profit >= 0 ? 'success' : 'danger'
  );
}

// ── SALE SCENE ───────────────────────────────────────────────────────
const SALE_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SALE_TIMES = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM'];
const SALE_WEATHER = ['Sunny','Partly Cloudy','Overcast','Clear'];

function initSale() {
  const s = G.currentSale;
  document.getElementById('sale-location-name').textContent = s.location.label.toUpperCase();
  renderSaleHeader(s);
  renderSaleTable(s.items);
}

function renderSaleHeader(s) {
  const el = document.getElementById('sale-scene-header');
  if (!el) return;
  const phase = s.location.phase;
  const banner = phase === 'estate' ? 'ESTATE SALE · BY APPOINTMENT' : 'GARAGE SALE TODAY';
  const dayName = SALE_DAYS[(G.day + 5) % 7];
  const time = pick(SALE_TIMES);
  const weather = pick(SALE_WEATHER);
  const items = s.items.length;
  el.innerHTML = `
    <div class="sale-scene-banner">${banner}</div>
    <div class="sale-scene-meta">
      <span class="sale-scene-meta-item"><i class="ph-bold ph-calendar-blank"></i>${dayName}</span>
      <span class="sale-scene-meta-item"><i class="ph-bold ph-clock"></i>${time}</span>
      <span class="sale-scene-meta-item"><i class="ph-bold ph-cloud-sun"></i>${weather}</span>
      <span class="sale-scene-meta-item"><i class="ph-bold ph-tag"></i>${items} items</span>
    </div>`;
}
const COND_COLORS = { Poor:'#F85149', Fair:'#FCD34D', Good:'#3FB950', Excellent:'#2DD4BF' };

function renderSaleTable(items) {
  const container = document.getElementById('sale-table-items');
  container.innerHTML = '';
  items.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'sale-item-card';
    card.style.setProperty('--item-accent', item.color);
    card.style.animationDelay = `${i * 60}ms`;
    const condColor = COND_COLORS[item.condition] || '#7D8590';
    const priceHint = `$${Math.round(item.asking * 0.85)}–$${item.asking}`;
    card.innerHTML = `
      <i class="ph-bold ${item.icon} sale-item-icon" style="color:${item.color}"></i>
      <div class="sale-item-info">
        <div class="sale-item-name">${item.name}</div>
        <div class="sale-item-cat">${item.cat}</div>
        <div class="sale-item-price">${priceHint}</div>
        <div style="margin-top:3px">
          <span class="sale-item-cond-dot" style="background:${condColor}"></span>
          <span style="font-size:0.68rem;color:${condColor}">${item.condition}</span>
        </div>
      </div>`;
    card.addEventListener('click', () => {
      G.currentSale.packPullIdx = i;
      G.currentSale.items = [item, ...items.filter((_,j) => j !== i)];
      G.currentSale.keptItems = [];
      showScreen('pack-pull');
    });
    container.appendChild(card);
  });
}

// ── PACK PULL / SWIPE ENGINE ─────────────────────────────────────────
function initPackPull() {
  renderCardStack();
  renderFoundTray();
  document.getElementById('found-tray-section').hidden = true;
}
const RARITY_COLORS = { common:'#6B7280', uncommon:'#10B981', rare:'#60A5FA', legendary:'#F59E0B' };

function buildCardBackHTML() {
  return `<div class="card-back">
    <i class="ph-bold ph-question card-back-icon"></i>
    <div class="card-back-label">TAP TO REVEAL</div>
    <div class="swipe-overlay swipe-overlay-pass">PASS</div>
    <div class="swipe-overlay swipe-overlay-keep">KEEP</div>
  </div>`;
}
function buildCardFrontHTML(item) {
  const rc = RARITY_COLORS[item.rarity];
  return `<div class="card-front">
    <div class="card-rarity-band" style="background:${rc}"></div>
    <div class="card-icon-zone">
      <i class="ph-bold ${item.icon}" style="color:${item.color}"></i>
    </div>
    <div class="card-info">
      <div class="card-name">${item.name}</div>
      <div class="card-meta">
        <span class="card-category">${item.cat}</span>
        <span class="card-emv-badge" id="emv-badge-${item.uid}">EMV: $0</span>
      </div>
      <div class="card-bottom">
        <span class="card-condition">${item.condition}</span>
        <span class="card-rarity-tag" style="color:${rc}">${item.rarity.toUpperCase()}</span>
      </div>
      <div class="card-flavor">${item.flavor}</div>
    </div>
    <div class="swipe-overlay swipe-overlay-pass">PASS</div>
    <div class="swipe-overlay swipe-overlay-keep">KEEP</div>
  </div>`;
}

function renderCardStack() {
  const stack = document.getElementById('card-stack');
  if (!stack) return;
  stack.innerHTML = '';
  const { items, packPullIdx } = G.currentSale;
  const remaining = items.length - packPullIdx;
  document.getElementById('cards-remaining').textContent = remaining;

  if (remaining === 0) {
    showFoundTray();
    return;
  }

  const show = Math.min(3, remaining);
  for (let d = show - 1; d >= 0; d--) {
    const idx = packPullIdx + d;
    const item = items[idx];
    const card = document.createElement('div');
    card.className = `swipe-card rarity-${item.rarity}`;
    card.dataset.depth = d;
    card.dataset.idx = idx;
    card.innerHTML = buildCardBackHTML();
    if (d === 0) {
      card.addEventListener('click', e => {
        if (!card.classList.contains('revealed') && !card.dataset.dragging) {
          revealSwipeCard(card, item);
        }
      });
      bindSwipe(card, dir => handlePackSwipe(dir, item));
    }
    stack.appendChild(card);
  }
}

function revealSwipeCard(card, item) {
  card.classList.add('revealed');
  card.dataset.dragging = '';
  card.innerHTML = buildCardFrontHTML(item);
  card.classList.add('card-pop-in');
  // EMV count-up
  setTimeout(() => {
    animateCountUp(`emv-badge-${item.uid}`, 0, item.displayEmv, 900, v => `EMV: $${v.toLocaleString()}`);
    if (['rare','legendary'].includes(item.rarity)) spawnParticles(card);
  }, 50);
  // Re-bind swipe after reveal
  bindSwipe(card, dir => handlePackSwipe(dir, item));
  card.addEventListener('click', e => {
    if (!card.dataset.didSwipe) handlePackSwipe('keep', item);
  }, { once: true });
}

function handlePackSwipe(dir, item) {
  if (dir === 'keep') {
    if (!G.currentSale.keptItems.find(k => k.uid === item.uid)) {
      G.currentSale.keptItems.push(item);
    }
  }
  G.currentSale.packPullIdx++;
  renderCardStack();
}

function showFoundTray() {
  const { keptItems } = G.currentSale;
  if (keptItems.length === 0) {
    showToast('Nothing worth keeping here.');
    setTimeout(() => advanceLocation(), 1000);
    return;
  }
  document.getElementById('found-tray-section').hidden = false;
  renderFoundTray();
}

function renderFoundTray() {
  const tray = document.getElementById('found-tray');
  tray.innerHTML = '';
  G.currentSale.keptItems.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = `tray-item${item.haggled ? ' sold' : ''}`;
    el.innerHTML = `<i class="ph-bold ${item.icon}" style="color:${item.color}"></i>${item.name}`;
    if (!item.haggled) {
      el.addEventListener('click', () => startHaggle(item));
    }
    tray.appendChild(el);
  });
}

function bindSwipe(card, onSwipe) {
  let startX = 0, dx = 0, dragging = false, moved = false;
  const passOv = card.querySelector('.swipe-overlay-pass');
  const keepOv = card.querySelector('.swipe-overlay-keep');

  card.addEventListener('pointerdown', e => {
    if (card.dataset.depth && card.dataset.depth !== '0') return;
    startX = e.clientX; dx = 0; dragging = true; moved = false;
    card.setPointerCapture(e.pointerId);
    card.style.transition = 'none';
  });
  card.addEventListener('pointermove', e => {
    if (!dragging) return;
    dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { moved = true; card.dataset.dragging = '1'; }
    card.style.transform = `translateX(${dx}px) rotate(${dx * 0.05}deg)`;
    if (passOv) passOv.style.opacity = Math.min(1, Math.max(0, -dx / 60));
    if (keepOv) keepOv.style.opacity = Math.min(1, Math.max(0, dx / 60));
  });
  card.addEventListener('pointerup', () => {
    dragging = false;
    card.style.transition = '';
    if (Math.abs(dx) > 90 && moved) {
      const dir = dx > 0 ? 'keep' : 'pass';
      card.style.animation = dir === 'keep' ? 'card-fly-right 340ms forwards' : 'card-fly-left 340ms forwards';
      card.dataset.didSwipe = '1';
      setTimeout(() => onSwipe(dir), 330);
    } else {
      card.style.transform = '';
      if (passOv) passOv.style.opacity = 0;
      if (keepOv) keepOv.style.opacity = 0;
      setTimeout(() => { delete card.dataset.dragging; }, 50);
    }
    dx = 0;
  });
}

// ── HAGGLING ─────────────────────────────────────────────────────────
const HAGGLE_TACTICS = [
  {
    id: 'condition',
    label: "It's worn",
    icon: 'ph-warning',
    available: item => ['Poor','Fair'].includes(item.condition),
    effect(h) { h.current = Math.round(h.current * 0.88); },
    suspicion: +5,
    npcLines: ["Yeah, it's seen better days...", "Fair point, I guess.", "Can't argue with that."],
  },
  {
    id: 'market',
    label: "Tough market",
    icon: 'ph-trend-down',
    available: () => true,
    effect(h) { h.current = Math.round(h.current * 0.93); },
    suspicion: 0,
    npcLines: ["Things have been slow...", "I've heard that.", "Mm. Maybe."],
  },
  {
    id: 'cash',
    label: "Cash right now",
    icon: 'ph-money',
    available: () => true,
    effect(h) { h.current = Math.round(h.current * 0.92); },
    suspicion: -8,
    npcLines: ["Cash is cash...", "Alright, you got me.", "I do like cash."],
  },
  {
    id: 'disinterest',
    label: "Might pass",
    icon: 'ph-hand-palm',
    available: () => true,
    effect(h) {
      if (Math.random() < 0.35) { h.suspicion += 20; return false; }
      h.current = Math.round(h.current * 0.87);
    },
    suspicion: 0,
    npcLines: ["Well... I'd hate to miss a sale.", "Don't walk away just yet.", "Okay, okay. Let's talk."],
    bluffLines: ["Nice try.", "I see what you're doing.", "Save it for someone else."],
  },
];

function startHaggle(item) {
  const seller = item.seller || { floorFrac: 0.55, suspMul: 1, tell: '', label: '' };
  G.haggle = {
    item,
    asking: item.asking,
    current: item.asking,
    floor: Math.max(1, Math.round(item.asking * seller.floorFrac)),
    suspMul: seller.suspMul,
    seller,
    suspicion: 0,
    round: 1,
    maxRounds: CONFIG.HAGGLE_ROUNDS_MIN + Math.floor(Math.random() * (CONFIG.HAGGLE_ROUNDS_MAX - CONFIG.HAGGLE_ROUNDS_MIN + 1)),
    npcType: G.currentSale?.location?.phase === 'estate' ? 'estate' : 'garage',
    usedTactics: new Set(),
  };
  showScreen('haggle');
}
function initHaggle() {
  const h = G.haggle;
  document.getElementById('npc-character-wrap').innerHTML = NPC_SVG[h.npcType] || NPC_SVG.garage;
  const rc = RARITY_COLORS[h.item.rarity];
  document.getElementById('haggle-item-card').innerHTML = `
    <i class="ph-bold ${h.item.icon}" style="color:${h.item.color}; font-size:2.8rem"></i>
    <div class="haggle-item-name">${h.item.name}</div>
    <div class="haggle-item-cond">${h.item.condition} · <span style="color:${rc}">${h.item.rarity.toUpperCase()}</span></div>`;
  document.getElementById('haggle-asking-price').textContent = `$${h.asking}`;
  document.getElementById('haggle-round').textContent = h.round;
  document.getElementById('haggle-max-round').textContent = h.maxRounds;
  document.getElementById('npc-speech').textContent = h.seller.tell || pick(NPC_LINES.neutral);
  const readEl = document.getElementById('haggle-seller-read');
  if (readEl) {
    readEl.textContent = `Seller: ${h.seller.label}`;
    readEl.className = 'haggle-seller-read seller-' + (h.seller.id || 'unsure');
  }
  document.getElementById('btn-accept-counter').hidden = true;

  const slider = document.getElementById('offer-slider');
  slider.min = Math.max(1, Math.round(h.asking * 0.10));
  slider.max = Math.round(h.asking * 1.15);
  slider.value = Math.round(h.asking * 0.55);
  updateOfferDisplay(+slider.value);
  renderTactics();
}

function renderTactics() {
  const row = document.getElementById('tactic-row');
  if (!row) return;
  const h = G.haggle;
  if (!h) return;
  row.innerHTML = HAGGLE_TACTICS
    .filter(t => t.available(h.item))
    .map(t => {
      const used = h.usedTactics.has(t.id);
      return `<button class="tactic-btn" data-tactic="${t.id}" ${used ? 'disabled' : ''}>
        <i class="ph-bold ${t.icon}"></i>
        <span>${t.label}</span>
      </button>`;
    }).join('');
  row.querySelectorAll('.tactic-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => useTactic(btn.dataset.tactic));
  });
}

function useTactic(tacticId) {
  const h = G.haggle;
  if (!h || h.usedTactics.has(tacticId)) return;
  h.usedTactics.add(tacticId);

  const tactic = HAGGLE_TACTICS.find(t => t.id === tacticId);
  if (!tactic) return;

  const bluffCalled = tactic.effect(h) === false;
  let suspDelta = bluffCalled ? 20 : tactic.suspicion;
  if (suspDelta > 0) suspDelta = Math.round(suspDelta * (h.suspMul || 1));
  h.suspicion = Math.max(0, Math.min(100, h.suspicion + suspDelta));

  const line = bluffCalled
    ? pick(tactic.bluffLines || tactic.npcLines)
    : pick(tactic.npcLines);

  document.getElementById('suspicion-fill').style.width = h.suspicion + '%';
  setNpcExpression(Math.min(3, Math.floor(h.suspicion / 25)));
  document.getElementById('npc-speech').textContent = line;
  document.getElementById('haggle-asking-price').textContent = `$${h.current}`;
  updateOfferDisplay(+document.getElementById('offer-slider').value);
  renderTactics();

  if (h.suspicion >= CONFIG.SUSPICION_THRESHOLD) {
    document.getElementById('npc-speech').textContent = pick(NPC_LINES.hostile);
    animateShake('#screen-haggle .haggle-layout');
    setTimeout(() => endHaggle(false), 1600);
  }
}
function updateOfferDisplay(val) {
  document.getElementById('offer-display').textContent = '$' + val.toLocaleString();
  const h = G.haggle;
  if (!h) return;
  const pct = val / h.current;
  let hint = '';
  if (pct < 0.35) hint = 'That\'s a lowball. They won\'t like it.';
  else if (pct >= 0.95) hint = 'Close to asking — they might notice your eagerness.';
  else if (pct >= 0.50 && pct <= 0.80) hint = 'Reasonable territory.';
  document.getElementById('offer-hint').textContent = hint;
}

function makeOffer(playerOffer) {
  const h = G.haggle;
  const pct = playerOffer / h.current;
  let suspDelta = 0;

  if (pct < 0.35)                     suspDelta = +35;
  else if (pct >= 0.95)               suspDelta = +15;
  else if (pct >= 0.50 && pct <= 0.80) suspDelta = -5;

  if (h.round === 1 && pct >= 0.95) suspDelta += 12;

  // A clueless seller barely reacts to a lowball; an expert bristles instantly.
  if (suspDelta > 0) suspDelta = Math.round(suspDelta * (h.suspMul || 1));

  h.suspicion = Math.max(0, Math.min(100, h.suspicion + suspDelta));
  h.round++;

  // Update suspicion UI
  document.getElementById('suspicion-fill').style.width = h.suspicion + '%';
  const lvl = Math.min(3, Math.floor(h.suspicion / 25));
  setNpcExpression(lvl);

  if (h.suspicion >= CONFIG.SUSPICION_THRESHOLD) {
    document.getElementById('npc-speech').textContent = pick(NPC_LINES.hostile);
    animateShake('#screen-haggle .haggle-layout');
    setTimeout(() => endHaggle(false), 1600);
    return;
  }

  if (playerOffer >= h.current) { completeSale(playerOffer); return; }

  if (h.round > h.maxRounds) {
    document.getElementById('npc-speech').textContent = pick(NPC_LINES.final(h.current));
    document.getElementById('btn-accept-counter').textContent = `Accept $${h.current}`;
    document.getElementById('btn-accept-counter').hidden = false;
    document.getElementById('btn-make-offer').hidden = true;
    return;
  }

  // NPC counter — they concede toward their own floor, which is set by how
  // well they know the item's value (clueless caves; expert holds firm).
  h.current = Math.max(h.floor, Math.round(h.current * 0.95));
  document.getElementById('npc-speech').textContent = pick(NPC_LINES.counter(h.current));

  if (pct < 0.35) document.getElementById('npc-speech').textContent = pick(NPC_LINES.offended);
  else if (pct >= 0.95) document.getElementById('npc-speech').textContent = pick(NPC_LINES.eager);
  else if (pct >= 0.50 && pct <= 0.80) document.getElementById('npc-speech').textContent = pick(NPC_LINES.pleased);

  document.getElementById('haggle-round').textContent = Math.min(h.round, h.maxRounds);

  // Update slider max
  const slider = document.getElementById('offer-slider');
  slider.max = Math.round(h.current * 1.15);
}

function setNpcExpression(lvl) {
  const svg = document.querySelector('#npc-character-wrap svg');
  if (!svg) return;
  ['brow-l-neutral','brow-r-neutral','brow-l-suspicious','brow-r-suspicious','brow-l-hostile','brow-r-hostile',
   'mouth-neutral','mouth-suspicious','mouth-hostile'].forEach(cls => {
    svg.querySelectorAll(`.${cls}`).forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 300ms ease';
    });
  });
  const show = {
    0: ['brow-l-neutral','brow-r-neutral','mouth-neutral'],
    1: ['brow-l-neutral','brow-r-neutral','mouth-suspicious'],
    2: ['brow-l-suspicious','brow-r-suspicious','mouth-suspicious'],
    3: ['brow-l-hostile','brow-r-hostile','mouth-hostile'],
  }[lvl] || ['brow-l-neutral','brow-r-neutral','mouth-neutral'];
  show.forEach(cls => {
    svg.querySelectorAll(`.${cls}`).forEach(el => { el.style.opacity = '1'; });
  });
}

function completeSale(price) {
  const item = G.haggle.item;
  if (G.inventory.length >= CONFIG.INVENTORY_MAX) { showToast('Inventory full! Sell something first.', 'danger'); return; }
  if (price > G.cash) { showToast('Not enough cash!', 'danger'); return; }
  G.cash -= price;
  item.paidPrice = price;
  item.appraised = !G.currentSale?.isBoxFlow;
  G.inventory.push(item);
  G.stats.deals++;
  G.totalEarned += item.displayEmv;
  if (!G.bestFind || item.displayEmv > G.bestFind.displayEmv) G.bestFind = item;
  item.haggled = true;
  if (G.currentSale?.isBoxFlow) G.currentSale.keptItems.push(item);
  animateCashChange();
  showToast(`Snagged for $${price}!`, 'success');
  checkMilestones();
  endHaggle(true);
}

function endHaggle(success) {
  if (G.currentSale?.isBoxFlow) {
    const boxIdx = G.currentSale.openBoxIdx;
    const box = G.currentSale.boxes[boxIdx];
    showScreen('boxes');
    if (box && box.items.length > 0) {
      openBox(boxIdx);
    } else {
      closeBox();
    }
    return;
  }
  showScreen('pack-pull');
  renderFoundTray();
  const allHaggled = G.currentSale.keptItems.every(i => i.haggled);
  if (allHaggled) { setTimeout(() => advanceLocation(), 800); }
}

// ── AUCTION LIST ──────────────────────────────────────────────────────
function initAuctionList() {
  const n = G.currentAuctionNeighborhood;
  document.getElementById('auction-facility-name').textContent = n.label + ' Storage';
  const unitList = document.getElementById('unit-list');
  unitList.innerHTML = '';
  G.auctionUnits = Array.from({ length: 3 }, () => generateAuctionUnit('auction'));
  G.auctionUnits.forEach((unit, i) => {
    const totalEMV = unit.items.reduce((s, it) => s + it.displayEmv, 0);
    const loEst = Math.round(totalEMV * 0.5);
    const hiEst = Math.round(totalEMV * 1.4);
    const preview = shuffle(unit.items).slice(0, 5);
    const card = document.createElement('div');
    card.className = 'unit-card';
    card.innerHTML = `
      <div class="unit-card-header">
        <div class="unit-card-num">UNIT #${unit.num}</div>
        <div class="unit-card-est">Est. $${loEst.toLocaleString()}–$${hiEst.toLocaleString()}</div>
      </div>
      <div class="unit-card-icons">
        ${preview.map((it,j) => `<div class="unit-icon-preview${j<2?' revealed':''}">
          <i class="ph-bold ${j<2?it.icon:'ph-question'}" style="color:${j<2?it.color:'#484F58'}"></i>
        </div>`).join('')}
      </div>
      <div class="unit-card-meta">
        <span class="unit-meta-tag"><i class="ph-bold ph-users"></i> ${2+Math.floor(Math.random()*3)} bidders</span>
        <span class="unit-meta-tag"><i class="ph-bold ph-package"></i> ${unit.items.length} items</span>
      </div>`;
    card.addEventListener('click', () => {
      G.currentAuctionUnit = unit;
      showScreen('auction-peek');
    });
    unitList.appendChild(card);
  });
}

// ── AUCTION PEEK ──────────────────────────────────────────────────────
let peekTimerInterval = null;
function initAuctionPeek() {
  const unit = G.currentAuctionUnit;
  document.getElementById('peek-unit-num').textContent = unit.num;

  const totalEMV = unit.items.reduce((s, it) => s + it.displayEmv, 0);
  const loEst = Math.round(totalEMV * 0.5);
  const hiEst = Math.round(totalEMV * 1.4);
  document.getElementById('peek-est-low').textContent = '$' + loEst.toLocaleString();
  document.getElementById('peek-est-high').textContent = '$' + hiEst.toLocaleString();

  // Blur grid
  const blurLayer = document.getElementById('unit-blur-layer');
  blurLayer.innerHTML = '';
  const blurIcons = shuffle(unit.items).slice(0, 9);
  blurIcons.forEach(it => {
    const cell = document.createElement('div');
    cell.className = 'blur-cell';
    cell.innerHTML = `<i class="ph-bold ${it.icon}" style="color:${it.color}"></i>`;
    blurLayer.appendChild(cell);
  });

  // Revealed slots (3 items)
  const revealed = shuffle(unit.items).slice(0, 3);
  unit.peekRevealed = revealed;
  const revSlots = document.getElementById('revealed-slots');
  revSlots.innerHTML = '';
  revealed.forEach(it => {
    const slot = document.createElement('div');
    slot.className = 'revealed-item-slot';
    slot.innerHTML = `
      <div class="revealed-slot-icon"><i class="ph-bold ${it.icon}" style="color:${it.color}"></i></div>
      <div class="revealed-slot-name">${it.name}</div>
      <div class="revealed-slot-emv">~$${it.displayEmv.toLocaleString()}</div>`;
    revSlots.appendChild(slot);
  });

  // Timer
  if (peekTimerInterval) clearInterval(peekTimerInterval);
  let timeLeft = CONFIG.PEEK_SECONDS;
  const circle = document.getElementById('timer-circle');
  const circumference = 2 * Math.PI * 19; // 119.38
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = 0;
  document.getElementById('peek-timer-val').textContent = timeLeft;

  peekTimerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('peek-timer-val').textContent = timeLeft;
    const offset = circumference * (1 - timeLeft / CONFIG.PEEK_SECONDS);
    circle.style.strokeDashoffset = offset;
    if (timeLeft <= 0) {
      clearInterval(peekTimerInterval);
      enterAuctionBid();
    }
  }, 1000);
}
function enterAuctionBid() {
  if (peekTimerInterval) { clearInterval(peekTimerInterval); peekTimerInterval = null; }
  showScreen('auction-bid');
}

// ── AUCTION BID ────────────────────────────────────────────────────────
function initAuctionBid() {
  const unit = G.currentAuctionUnit;
  const totalEMV = unit.items.reduce((s, it) => s + it.displayEmv, 0);
  const startBid = Math.round(totalEMV * 0.20);
  const count = 2 + Math.floor(Math.random() * 3);
  G.auction = {
    unit,
    totalEMV,
    currentBid: startBid,
    leader: 'house',
    aiBidders: Array.from({ length: count }, (_, i) => ({
      id: i,
      maxBid: Math.round(totalEMV * rand(0.70, 1.25)),
      dropped: false,
    })),
  };
  renderBidScreen();
}
function renderBidScreen() {
  const au = G.auction;
  const amtEl = document.getElementById('bid-current-amount');
  amtEl.textContent = '$' + au.currentBid.toLocaleString();
  if (au._prevBid && au._prevBid !== au.currentBid) {
    amtEl.classList.remove('bid-flash');
    void amtEl.offsetWidth;
    amtEl.classList.add('bid-flash');
  }
  au._prevBid = au.currentBid;

  const leaderEl = document.getElementById('bid-leader-label');
  leaderEl.className = 'bid-leader-label';
  if (au.leader === 'player') {
    leaderEl.textContent = 'You\'re leading'; leaderEl.classList.add('you-lead');
  } else {
    leaderEl.textContent = 'Outbid!'; leaderEl.classList.add('ai-leads');
  }

  const row = document.getElementById('ai-bidder-row');
  row.innerHTML = '';
  au.aiBidders.forEach(b => {
    const dot = document.createElement('div');
    dot.className = `ai-dot${b.dropped ? ' dropped' : ''}`;
    dot.textContent = `B${b.id+1}`;
    row.appendChild(dot);
  });

  const minNext = au.currentBid + Math.max(10, Math.round(au.currentBid * 0.05));
  document.getElementById('bid-min-hint').textContent = '$' + minNext.toLocaleString();
  const inp = document.getElementById('bid-input');
  inp.min = minNext;
  if (!inp.value || +inp.value < minNext) inp.value = minNext;
}

function placeBid(amount) {
  const au = G.auction;
  const minBid = au.currentBid + Math.max(10, Math.round(au.currentBid * 0.05));
  if (amount < minBid) { showToast('Bid too low!', 'danger'); animateShake('.bid-input-row'); return; }
  if (amount > G.cash) { showToast('Not enough cash!', 'danger'); animateShake('.bid-input-row'); return; }
  au.currentBid = amount;
  au.leader = 'player';
  renderBidScreen();
  setTimeout(runAiBidRound, 800 + Math.random() * 700);
}

function runAiBidRound() {
  const au = G.auction;
  if (au.leader !== 'player') return;
  const active = au.aiBidders.filter(b => !b.dropped && b.maxBid > au.currentBid);
  if (active.length === 0) { resolveAuctionWin(); return; }
  const top = active.reduce((a, b) => b.maxBid > a.maxBid ? b : a);
  const inc = Math.max(10, Math.round(au.currentBid * 0.05));
  const newBid = au.currentBid + inc;
  if (newBid > top.maxBid) {
    top.dropped = true;
    renderBidScreen();
    setTimeout(runAiBidRound, 400);
    return;
  }
  au.currentBid = newBid;
  au.leader = 'ai';
  renderBidScreen();
}

function resolveAuctionWin() {
  const au = G.auction;
  G.cash -= au.currentBid;
  G.stats.auctions++;
  animateCashChange();
  showToast(`Won for $${au.currentBid.toLocaleString()}!`, 'success');
  au.unit.items.forEach(it => { it.revealed = true; });
  G.unboxing = { items: [...au.unit.items], idx: 0 };
  G.verdictQueue = au.unit.items.filter(it => it.isFake || it.rarity === 'legendary');
  setTimeout(() => showScreen('unboxing'), 500);
}

// ── UNBOXING ──────────────────────────────────────────────────────────
function initUnboxing() {
  document.getElementById('unbox-count').textContent = G.unboxing.items.length;
  renderUnboxStack();
}
function renderUnboxStack() {
  const stack = document.getElementById('unbox-stack');
  if (!stack) return;
  stack.innerHTML = '';
  const { items, idx } = G.unboxing;
  const remaining = items.length - idx;
  if (remaining === 0) { finishUnboxing(); return; }
  const show = Math.min(3, remaining);
  for (let d = show - 1; d >= 0; d--) {
    const item = items[idx + d];
    const card = document.createElement('div');
    card.className = `swipe-card rarity-${item.rarity}`;
    card.dataset.depth = d;
    card.innerHTML = buildCardBackHTML();
    if (d === 0) {
      card.addEventListener('click', () => {
        if (!card.classList.contains('revealed') && !card.dataset.dragging) {
          revealUnboxCard(card, item);
        }
      });
      bindSwipe(card, () => advanceUnbox(item));
    }
    stack.appendChild(card);
  }
}
function revealUnboxCard(card, item) {
  card.classList.add('revealed');
  card.innerHTML = buildCardFrontHTML(item);
  card.classList.add('card-pop-in');
  setTimeout(() => {
    animateCountUp(`emv-badge-${item.uid}`, 0, item.displayEmv, 900, v => `EMV: $${v.toLocaleString()}`);
    if (['rare','legendary'].includes(item.rarity)) spawnParticles(card);
  }, 50);
  bindSwipe(card, () => advanceUnbox(item));
}
function advanceUnbox(item) {
  G.unboxing.idx++;
  const space = CONFIG.INVENTORY_MAX - G.inventory.length;
  if (space > 0) G.inventory.push(item);
  if (!G.bestFind || item.displayEmv > (G.bestFind?.displayEmv || 0)) G.bestFind = item;
  renderUnboxStack();
}
function finishUnboxing() {
  if (G.verdictQueue.length > 0) {
    G.currentVerdictItem = G.verdictQueue.shift();
    showScreen('verdict');
  } else {
    showToast('Unit sorted!');
    advanceLocation();
  }
}

// ── VERDICT ────────────────────────────────────────────────────────────
function initVerdict() {
  const item = G.currentVerdictItem;
  const el = document.getElementById('screen-verdict');
  el.innerHTML = `
    <div class="verdict-item-preview">
      <div class="verdict-icon"><i class="ph-bold ${item.icon}" style="color:${item.color}"></i></div>
      <div class="verdict-item-name">${item.name}</div>
    </div>
    <div class="verdict-check-label">AUTHENTICITY CHECK</div>
    <div class="verdict-stamp ${item.isFake ? 'replica' : 'authentic'}">
      ${item.isFake ? 'REPLICA' : 'AUTHENTIC'}
    </div>
    <div class="verdict-value">${item.isFake ? 'Scrap value: $5' : 'Market Value: $' + item.emv.toLocaleString()}</div>
    <div class="verdict-profit">${item.isFake ? 'A fake. Worth nothing.' : 'A genuine find!'}</div>
    <div class="verdict-btn-wrap">
      <button id="btn-verdict-next" class="btn btn-primary">Next →</button>
    </div>`;

  if (item.isFake) {
    G.stats.fakes++;
    item.emv = 5;
  }

  setTimeout(() => {
    if (!item.isFake && item.rarity === 'legendary') spawnParticles(el.querySelector('.verdict-icon'));
    el.querySelector('.verdict-value').classList.add('visible');
    el.querySelector('.verdict-profit').classList.add('visible');
  }, 1400);
  setTimeout(() => {
    el.querySelector('.verdict-btn-wrap').classList.add('visible');
    document.getElementById('btn-verdict-next').addEventListener('click', () => {
      if (G.verdictQueue.length > 0) {
        G.currentVerdictItem = G.verdictQueue.shift();
        initVerdict();
      } else {
        advanceLocation();
      }
    });
  }, 2200);
}

// ── INVENTORY ─────────────────────────────────────────────────────────
function initInventory() {
  G.sellSelectedIdx = -1;
  document.getElementById('inv-detail').hidden = true;
  renderInvGrid();
  const pending = G.pendingEbay.reduce((s, e) => s + e.item.emv, 0);
  document.getElementById('inv-used').textContent = G.inventory.length;
  document.getElementById('inv-pending').textContent = '$' + pending.toLocaleString();
}
function renderInvGrid() {
  const grid = document.getElementById('inv-grid');
  grid.innerHTML = '';
  for (let i = 0; i < CONFIG.INVENTORY_MAX; i++) {
    const item = G.inventory[i];
    const cell = document.createElement('div');
    if (item) {
      cell.className = `inv-cell${item.isFake ? ' fake' : ''}${item.listed ? ' listed' : ''}`;
      cell.innerHTML = `<i class="ph-bold ${item.icon}" style="color:${item.color}; font-size:1.4rem"></i><div class="inv-cell-label">${item.name.split(' ').slice(0,2).join(' ')}</div>`;
      cell.addEventListener('click', () => selectInvItem(i));
    } else {
      cell.className = 'inv-cell empty';
    }
    grid.appendChild(cell);
  }
}
function selectInvItem(idx) {
  G.sellSelectedIdx = idx;
  const item = G.inventory[idx];
  document.querySelectorAll('.inv-cell').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.inv-cell')[idx]?.classList.add('selected');
  const det = document.getElementById('inv-detail');
  det.hidden = false;
  document.getElementById('inv-detail-icon').innerHTML = `<i class="ph-bold ${item.icon}" style="color:${item.color}; font-size:2.5rem"></i>`;
  document.getElementById('inv-detail-name').textContent = item.name;
  document.getElementById('inv-detail-condition').textContent = item.condition + ' · ' + item.rarity.toUpperCase();
  document.getElementById('inv-fake-badge').hidden = !item.isFake;
  const appraiseSection = document.getElementById('inv-appraise-section');
  const sellOpts = document.getElementById('inv-sell-opts');
  if (item.appraised === false) {
    document.getElementById('inv-detail-emv').textContent = '???';
    appraiseSection.hidden = false;
    sellOpts.style.opacity = '0.3';
    sellOpts.style.pointerEvents = 'none';
  } else {
    document.getElementById('inv-detail-emv').textContent = '$' + item.emv.toLocaleString();
    appraiseSection.hidden = true;
    sellOpts.style.opacity = '';
    sellOpts.style.pointerEvents = '';
    const instant = Math.round(item.emv * CONFIG.SELL_INSTANT_PCT);
    document.getElementById('sell-instant-price').textContent = '$' + instant.toLocaleString();
    document.getElementById('sell-ebay-price').textContent = '~$' + item.emv.toLocaleString();
  }
}
function sellInstant() {
  const idx = G.sellSelectedIdx;
  if (idx < 0 || !G.inventory[idx]) return;
  const item = G.inventory.splice(idx, 1)[0];
  const price = Math.round(item.emv * CONFIG.SELL_INSTANT_PCT);
  G.cash += price;
  G.totalEarned += price;
  animateCashChange();
  showToast(`+$${price.toLocaleString()} — ${item.name}`, 'success');
  checkMilestones();
  initInventory();
}
function sellEbay() {
  const idx = G.sellSelectedIdx;
  if (idx < 0 || !G.inventory[idx]) return;
  const item = G.inventory[idx];
  if (item.listed) { showToast('Already listed!'); return; }
  item.listed = true;
  // The market is uncertain: final price lands somewhere around EMV (after
  // fees), so listing online is a gamble vs. the guaranteed instant sale.
  const mul = CONFIG.SELL_EBAY_MIN + Math.random() * (CONFIG.SELL_EBAY_MAX - CONFIG.SELL_EBAY_MIN);
  const salePrice = Math.max(1, Math.round(item.emv * mul));
  G.pendingEbay.push({ item, resolveDay: G.day + CONFIG.SELL_EBAY_DAYS, salePrice });
  showToast(`Listed online — sells in ${CONFIG.SELL_EBAY_DAYS} days`, 'success');
  initInventory();
}

// ── GAME OVER ──────────────────────────────────────────────────────────
function initGameOver() {
  document.getElementById('go-days').textContent = G.day;
  document.getElementById('go-total-earned').textContent = '$' + G.totalEarned.toLocaleString();
  document.getElementById('go-deals').textContent = G.stats.deals;
  document.getElementById('go-best-find').textContent = G.bestFind ? G.bestFind.name : '—';
}

// ── WIN ────────────────────────────────────────────────────────────────
function initWin() {
  document.getElementById('win-milestone-label').textContent = '$' + G.currentMilestone.toLocaleString() + ' EARNED!';
  document.getElementById('win-day').textContent = G.day;
  document.getElementById('win-deals').textContent = G.stats.deals;
  document.getElementById('win-auctions').textContent = G.stats.auctions;
  spawnWinParticles();
}
function spawnWinParticles() {
  const container = document.getElementById('win-particles');
  const colors = ['#F59E0B','#10B981','#60A5FA','#C084FC','#F472B6','#FCD34D'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      const size = 6 + Math.random() * 8;
      p.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        background:${colors[Math.floor(Math.random()*colors.length)]};
        left:${Math.random()*100}%;
        top:${-10}px;
        animation: particle-burst ${1+Math.random()}s ease-out forwards;
        --dx:${(Math.random()-0.5)*200}px;
        --dy:${100+Math.random()*200}px;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }, i * 60);
  }
}

// ── UI UTILITIES ───────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast${type ? ' ' + type : ''} visible`;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('visible');
    setTimeout(() => { el.hidden = true; }, 350);
  }, 2600);
}

function animateShake(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 450);
}

function animateCashChange() {
  updateHUD();
}

function animateCountUp(elId, from, to, duration, format) {
  const el = document.getElementById(elId);
  if (!el) return;
  const fmt = format || (v => '$' + Math.round(v).toLocaleString());
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(Math.round(from + (to - from) * eased));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function spawnParticles(anchorEl) {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#F59E0B','#10B981','#60A5FA','#C084FC','#F472B6'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 14) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    p.style.cssText = `
      left:${cx}px; top:${cy}px;
      background:${colors[i % colors.length]};
      --dx:${Math.cos(angle)*dist}px;
      --dy:${Math.sin(angle)*dist}px;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 750);
  }
}

function htmlToEl(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.firstElementChild;
}

// ── PWA ────────────────────────────────────────────────────────────────
function injectPWA() {
  // Generate canvas icon
  function makeIcon(size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    // Background
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#21262D');
    grad.addColorStop(1, '#0D1117');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    // Amber circle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size*0.42, 0, Math.PI*2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    // Text
    ctx.fillStyle = '#0D1117';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${size*0.28}px 'Bebas Neue', Impact, sans-serif`;
    ctx.fillText('T&T', size/2, size/2);
    return c.toDataURL('image/png');
  }

  const manifest = {
    name: 'Thrift & Thrive', short_name: 'T&T',
    description: 'Buy low. Sell high. Survive.',
    start_url: './', display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0D1117', theme_color: '#F59E0B',
    icons: [
      { src: makeIcon(192), sizes:'192x192', type:'image/png' },
      { src: makeIcon(512), sizes:'512x512', type:'image/png' },
    ],
  };
  try {
    const blob = new Blob([JSON.stringify(manifest)], { type:'application/manifest+json' });
    document.getElementById('manifest-placeholder').href = URL.createObjectURL(blob);
  } catch(e) { console.warn('Manifest injection failed', e); }

  const SW = `
    const CACHE='thrift-v1';
    const SHELL=['./', './index.html', './style.css', './game.js'];
    self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))); self.skipWaiting(); });
    self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
    self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html')))); });
  `;
  try {
    if ('serviceWorker' in navigator) {
      const swBlob = new Blob([SW], { type:'text/javascript' });
      navigator.serviceWorker.register(URL.createObjectURL(swBlob))
        .catch(e => console.warn('SW registration failed (expected on file://)', e));
    }
  } catch(e) { console.warn('SW injection failed', e); }
}

// ── EVENT BINDINGS ─────────────────────────────────────────────────────
function bindEvents() {
  // Title
  document.getElementById('btn-start').addEventListener('click', () => {
    newGame();
    showScreen('map');
  });

  // Map
  document.getElementById('btn-open-inventory').addEventListener('click', () => showScreen('inventory'));

  // Neighborhood sheet
  document.getElementById('btn-travel-go').addEventListener('click', () => {
    if (G._pendingNeighborhood) startTravel(G._pendingNeighborhood);
  });
  document.getElementById('btn-travel-cancel').addEventListener('click', () => hideNeighborhoodInfo());
  document.getElementById('nbhood-sheet-backdrop').addEventListener('click', () => hideNeighborhoodInfo());

  // Boxes screen
  document.getElementById('boxes-leave').addEventListener('click', () => advanceLocation());
  document.getElementById('btn-close-box').addEventListener('click', () => closeBox());
  document.getElementById('btn-leave-neighborhood').addEventListener('click', () => advanceLocation());

  // Appraise
  document.getElementById('btn-appraise').addEventListener('click', () => appraiseItem());

  // Sale
  document.getElementById('sale-back').addEventListener('click', () => advanceLocation());

  // Pack pull
  document.getElementById('pack-back').addEventListener('click', () => {
    G.currentSale.keptItems = [];
    advanceLocation();
  });
  document.getElementById('btn-leave-sale').addEventListener('click', () => {
    advanceLocation();
  });

  // Haggle
  document.getElementById('offer-slider').addEventListener('input', e => {
    updateOfferDisplay(+e.target.value);
  });
  document.getElementById('btn-make-offer').addEventListener('click', () => {
    makeOffer(+document.getElementById('offer-slider').value);
  });
  document.getElementById('btn-accept-counter').addEventListener('click', () => {
    completeSale(G.haggle.current);
  });
  document.getElementById('haggle-back').addEventListener('click', () => endHaggle(false));

  // Auction list
  document.getElementById('auction-list-back').addEventListener('click', () => advanceLocation());

  // Auction peek
  document.getElementById('peek-back').addEventListener('click', () => {
    if (peekTimerInterval) clearInterval(peekTimerInterval);
    showScreen('auction-list');
  });
  document.getElementById('btn-enter-bid').addEventListener('click', () => enterAuctionBid());
  document.getElementById('btn-skip-unit').addEventListener('click', () => {
    if (peekTimerInterval) clearInterval(peekTimerInterval);
    showScreen('auction-list');
  });

  // Auction bid
  document.getElementById('btn-raise-bid').addEventListener('click', () => {
    placeBid(+document.getElementById('bid-input').value);
  });
  document.getElementById('bid-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') placeBid(+e.target.value);
  });
  document.getElementById('btn-walk-away-bid').addEventListener('click', () => {
    G.auction = null;
    showScreen('auction-list');
  });

  // Inventory
  document.getElementById('inv-back').addEventListener('click', () => showScreen('map'));
  document.getElementById('btn-sell-instant').addEventListener('click', sellInstant);
  document.getElementById('btn-sell-ebay').addEventListener('click', sellEbay);

  // Game over / win
  document.getElementById('btn-restart').addEventListener('click', () => { newGame(); showScreen('map'); });
  document.getElementById('btn-keep-going').addEventListener('click', () => showScreen('map'));
}

// ── ENTRY POINT ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectPWA();
  bindEvents();
  newGame();
  showScreen('title');
});
