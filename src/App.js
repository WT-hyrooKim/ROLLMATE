import { useState, useEffect, useRef } from "react";

// ── Supabase 설정 ──────────────────────────────────────────────
const SUPABASE_URL = "https://klesgczkebudkuidhflc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZXNnY3prZWJ1ZGt1aWRoZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTE1MjksImV4cCI6MjA4ODk2NzUyOX0.ZKAAmR2yj9Aia-1-q_3ZAOfx-95MnW9OWz9jpr2qxfw";

const sbFetch = async (path, options={}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const sbGet = (table, query="") => sbFetch(`/${table}?${query}`);
const sbInsert = (table, data) => sbFetch(`/${table}`, { method:"POST", body:JSON.stringify(data) });
const sbUpdate = (table, id, data) => sbFetch(`/${table}?id=eq.${id}`, { method:"PATCH", body:JSON.stringify(data) });
const sbDelete = (table, id) => sbFetch(`/${table}?id=eq.${id}`, { method:"DELETE", prefer:"" });
// ──────────────────────────────────────────────────────────────

const BOWWWL_BALL = (slug) =>
  `https://www.bowwwl.com/sites/default/files/styles/ball_grid/public/balls/${slug}.png`;
const BOWWWL_CORE = (slug) =>
  `https://www.bowwwl.com/sites/default/files/styles/ball_image_main/public/cores/${slug}.png`;

// 브랜드별 2개씩
const ALL_BALLS = [
  // Storm
  {
    id:1, brand:"Storm", name:"Bionic",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Torsion A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#e91e63",
    ballSlug:"storm-bionic", coreSlug:"storm-torsion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.050}, 15:{rg:2.470,diff:0.050},
      14:{rg:2.480,diff:0.047}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Feb 2026", fragrance:"Cherry Cobbler",
    colors:["red","black","white"],
    description:"The ultimate symmetrical solution — an all-encompassing ball capable of handling virtually any lane condition."
  },
  {
    id:2, brand:"Storm", name:"Ion Max Pearl",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Element Max A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"storm-ion-max-pearl", coreSlug:"storm-element-max-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.055}, 15:{rg:2.480,diff:0.053},
      14:{rg:2.490,diff:0.050}, 13:{rg:2.580,diff:0.045}, 12:{rg:2.640,diff:0.038}
    },
    releaseDate:"Jan 2026", fragrance:"Blue Ice",
    colors:["blue","silver","pearl"],
    description:"Pearl asymmetric powerhouse built on the proven Element Max A.I. core for explosive backend motion."
  },
  // Brunswick
  {
    id:3, brand:"Brunswick", name:"Combat Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Rampart",
    finish:"500/2000 Siaair", condition:"Medium-Heavy Oil", accent:"#f57f17",
    ballSlug:"brunswick-combat-hybrid", coreSlug:"brunswick-rampart-core",
    weightData:{
      16:{rg:2.515,diff:0.043,moi:0.016}, 15:{rg:2.502,diff:0.051,moi:0.019},
      14:{rg:2.513,diff:0.051,moi:0.019}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2026",
    colors:["red","black","silver"],
    description:"Tactical evolution for midlane dominance. Alpha Premier Hybrid cover + Rampart core."
  },
  {
    id:4, brand:"Brunswick", name:"Crown Victory Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Tiered Hexagon",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"brunswick-crown-victory-pearl", coreSlug:"brunswick-crown-victory-pearl-core",
    weightData:{
      16:{rg:2.540,diff:0.045}, 15:{rg:2.545,diff:0.043},
      14:{rg:2.555,diff:0.040}, 13:{rg:2.635,diff:0.036}, 12:{rg:2.695,diff:0.030}
    },
    releaseDate:"Jan 2026",
    colors:["blue","pearl","silver"],
    description:"Pearl symmetric delivering clean length with powerful backend reaction for medium conditions."
  },
  // Roto Grip
  {
    id:5, brand:"Roto Grip", name:"Gremlin Tour-X",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Catalyst A.I.",
    finish:"4000 Abralon", condition:"Medium Oil", accent:"#6a1b9a",
    ballSlug:"roto-grip-gremlin-tour-x", coreSlug:"roto-grip-catalyst-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.034,moi:0.014}, 15:{rg:2.490,diff:0.032,moi:0.013},
      14:{rg:2.500,diff:0.030}, 13:{rg:2.585,diff:0.026}, 12:{rg:2.645,diff:0.022}
    },
    releaseDate:"Feb 2026",
    colors:["green","black"],
    description:"Tour-level asymmetric hybrid for the most demanding lane conditions professionals face."
  },
  {
    id:6, brand:"Roto Grip", name:"Transformer",
    cover:"Solid", coreType:"Asymmetric", coreName:"Nano A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00695c",
    ballSlug:"roto-grip-transformer", coreSlug:"roto-grip-nano-ai-core",
    weightData:{
      16:{rg:2.510,diff:0.051,moi:0.017}, 15:{rg:2.520,diff:0.049,moi:0.016},
      14:{rg:2.530,diff:0.046}, 13:{rg:2.615,diff:0.041}, 12:{rg:2.675,diff:0.034}
    },
    releaseDate:"Jan 2026",
    colors:["silver","black"],
    description:"Transforms any heavy oil environment into a scoring opportunity."
  },
  // Motiv
  {
    id:7, brand:"Motiv", name:"Supra Sport",
    cover:"Solid", coreType:"Symmetric", coreName:"Quadfire",
    finish:"4000 LSS", condition:"Light-Medium Oil", accent:"#ef6c00",
    ballSlug:"motiv-supra-sport", coreSlug:"motiv-quadfire-core",
    weightData:{
      16:{rg:2.550,diff:0.043}, 15:{rg:2.560,diff:0.041},
      14:{rg:2.570,diff:0.038}, 13:{rg:2.650,diff:0.034}, 12:{rg:2.710,diff:0.028}
    },
    releaseDate:"Feb 2026",
    colors:["blue","silver"],
    description:"Sport performance solid symmetric — the ultimate control ball for medium to light oil."
  },
  {
    id:8, brand:"Motiv", name:"Evoke Mayhem",
    cover:"Solid", coreType:"Asymmetric", coreName:"Overload",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"motiv-evoke-mayhem", coreSlug:"motiv-overload-core",
    weightData:{
      16:{rg:2.480,diff:0.050,moi:0.017}, 15:{rg:2.490,diff:0.048,moi:0.016},
      14:{rg:2.500,diff:0.045}, 13:{rg:2.590,diff:0.040}, 12:{rg:2.650,diff:0.033}
    },
    releaseDate:"Jan 2026",
    colors:["blue","black"],
    description:"Evoke your inner power with Turbulent V2 core and Infusion-MX solid coverstock."
  },
  // Hammer
  {
    id:9, brand:"Hammer", name:"Black Widow 3.0 Dynasty",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair", condition:"Heavy Oil", accent:"#1c1c1e",
    ballSlug:"hammer-black-widow-30-dynasty", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.500,diff:0.058,moi:0.018}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.520,diff:0.053}, 13:{rg:2.605,diff:0.048}, 12:{rg:2.665,diff:0.041}
    },
    releaseDate:"Feb 2026",
    colors:["black","gold","purple"],
    description:"The Dynasty of the most iconic bowling ball line. Gas Mask core + maximum asymmetric power."
  },
  {
    id:10, brand:"Hammer", name:"Hammerhead Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hammerhead",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#4e342e",
    ballSlug:"hammer-hammerhead-pearl", coreSlug:"hammer-hammerhead-core",
    weightData:{
      16:{rg:2.481,diff:0.048}, 15:{rg:2.490,diff:0.046},
      14:{rg:2.500,diff:0.043}, 13:{rg:2.585,diff:0.038}, 12:{rg:2.645,diff:0.032}
    },
    releaseDate:"Jan 2026",
    colors:["red","pearl","black"],
    description:"Sharpen your attack — Hammerhead symmetric pearl for clean length and explosive backend."
  },
  // 900 Global
  {
    id:11, brand:"900 Global", name:"Vengeance",
    cover:"Solid", coreType:"Symmetric", coreName:"Vengeance",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#1c1c1e",
    ballSlug:"900-global-vengeance", coreSlug:"900-global-vengeance-core",
    weightData:{
      16:{rg:2.470,diff:0.055}, 15:{rg:2.480,diff:0.053},
      14:{rg:2.490,diff:0.050}, 13:{rg:2.580,diff:0.045}, 12:{rg:2.640,diff:0.038}
    },
    releaseDate:"Jan 2026",
    colors:["red","black"],
    description:"Vengeance is coming. Heavy oil solid symmetric for maximum pin carry and continuation."
  },
  {
    id:12, brand:"900 Global", name:"Phantom Cruise",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Phantom",
    finish:"3000 Abralon", condition:"Medium-Heavy Oil", accent:"#4a148c",
    ballSlug:"900-global-phantom-cruise", coreSlug:"900-global-phantom-core",
    weightData:{
      16:{rg:2.480,diff:0.056,moi:0.014}, 15:{rg:2.490,diff:0.054,moi:0.013},
      14:{rg:2.500,diff:0.051}, 13:{rg:2.590,diff:0.046}, 12:{rg:2.650,diff:0.039}
    },
    releaseDate:"Nov 2025",
    colors:["purple","silver","black"],
    description:"Ghost-like asymmetric pearl gliding through the fronts and erupting on the backend."
  },
  // DV8
  {
    id:13, brand:"DV8", name:"Dark Side Curse",
    cover:"Solid", coreType:"Symmetric", coreName:"Duality",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#4e342e",
    ballSlug:"dv8-dark-side-curse", coreSlug:"dv8-duality-core",
    weightData:{
      16:{rg:2.494,diff:0.031}, 15:{rg:2.480,diff:0.036},
      14:{rg:2.503,diff:0.035}, 13:{rg:2.577,diff:0.043}, 12:{rg:2.599,diff:0.043}
    },
    releaseDate:"Jan 2026",
    colors:["black","purple"],
    description:"Join the dark side — symmetric solid for controlled, predictable medium oil performance."
  },
  {
    id:14, brand:"DV8", name:"Heckler Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Turmoil",
    finish:"Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#263238",
    ballSlug:"dv8-heckler-hybrid", coreSlug:"dv8-turmoil-core",
    weightData:{
      16:{rg:2.504,diff:0.051,moi:0.018}, 15:{rg:2.514,diff:0.049,moi:0.017},
      14:{rg:2.524,diff:0.046}, 13:{rg:2.609,diff:0.041}, 12:{rg:2.669,diff:0.034}
    },
    releaseDate:"Nov 2025",
    colors:["orange","black"],
    description:"Heckle the competition with serious midlane dominance and powerful backend motion."
  },
  // Ebonite
  {
    id:15, brand:"Ebonite", name:"Spartan",
    cover:"Solid", coreType:"Asymmetric", coreName:"Piston",
    finish:"500/1500 Siaair", condition:"Heavy Oil", accent:"#546e7a",
    ballSlug:"ebonite-spartan", coreSlug:"ebonite-piston-core",
    weightData:{
      16:{rg:2.473,diff:0.053,moi:0.017}, 15:{rg:2.483,diff:0.051,moi:0.016},
      14:{rg:2.493,diff:0.048}, 13:{rg:2.578,diff:0.043}, 12:{rg:2.638,diff:0.036}
    },
    releaseDate:"Feb 2026",
    colors:["red","black","silver"],
    description:"Spartan discipline meets modern coverstock — heavy oil asymmetric supremacy."
  },
  {
    id:16, brand:"Ebonite", name:"The One Ovation",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Gear",
    finish:"Crown Factory Compound", condition:"Heavy Oil", accent:"#1b5e20",
    ballSlug:"ebonite-the-one-ovation", coreSlug:"ebonite-gear-core",
    weightData:{
      16:{rg:2.466,diff:0.056,moi:0.019}, 15:{rg:2.476,diff:0.054,moi:0.018},
      14:{rg:2.486,diff:0.051}, 13:{rg:2.571,diff:0.046}, 12:{rg:2.631,diff:0.039}
    },
    releaseDate:"Sep 2025",
    colors:["purple","pearl"],
    description:"Give a standing ovation to the most iconic name in bowling — boldly reimagined."
  },
  // Columbia 300
  {
    id:17, brand:"Columbia 300", name:"Piranha Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Piranha",
    finish:"500/1500 Siaair", condition:"Medium Oil", accent:"#00838f",
    ballSlug:"columbia-300-piranha-solid", coreSlug:"columbia-300-piranha-core",
    weightData:{
      16:{rg:2.554,diff:0.043}, 15:{rg:2.564,diff:0.041},
      14:{rg:2.574,diff:0.038}, 13:{rg:2.654,diff:0.034}, 12:{rg:2.714,diff:0.028}
    },
    releaseDate:"Feb 2026",
    colors:["green","black"],
    description:"The Piranha bites hard — solid symmetric cover for aggressive medium oil performance."
  },
  {
    id:18, brand:"Columbia 300", name:"Street Rally",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Formula",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"columbia-300-street-rally", coreSlug:"columbia-300-formula-core",
    weightData:{
      16:{rg:2.478,diff:0.050,moi:0.015}, 15:{rg:2.488,diff:0.048,moi:0.014},
      14:{rg:2.498,diff:0.045}, 13:{rg:2.583,diff:0.040}, 12:{rg:2.643,diff:0.033}
    },
    releaseDate:"Dec 2025",
    colors:["red","black","silver"],
    description:"Rally on any condition — asymmetric pearl for explosive backend motion."
  },
  // SWAG
  {
    id:19, brand:"SWAG", name:"Serpent Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Scale",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#2e7d32",
    ballSlug:"swag-serpent-hybrid", coreSlug:"swag-scale-core",
    weightData:{
      16:{rg:2.510,diff:0.048,moi:0.016}, 15:{rg:2.520,diff:0.046,moi:0.015},
      14:{rg:2.530,diff:0.043}, 13:{rg:2.615,diff:0.038}, 12:{rg:2.675,diff:0.031}
    },
    releaseDate:"Feb 2026",
    colors:["green","black"],
    description:"Strike like a serpent — asymmetric hybrid with calculated, deadly motion through the oil."
  },
  {
    id:20, brand:"SWAG", name:"Assassin Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Blade",
    finish:"1500 Abralon", condition:"Medium Oil", accent:"#880e4f",
    ballSlug:"swag-assassin-pearl", coreSlug:"swag-blade-core",
    weightData:{
      16:{rg:2.520,diff:0.048}, 15:{rg:2.530,diff:0.046},
      14:{rg:2.540,diff:0.043}, 13:{rg:2.625,diff:0.038}, 12:{rg:2.685,diff:0.031}
    },
    releaseDate:"Jan 2026",
    colors:["black","silver","pearl"],
    description:"Silently precise — pearl symmetric assassin for clean, angular medium oil performance."
  },
  // Radical
  {
    id:21, brand:"Radical", name:"Deep Impact",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Astrophysics",
    finish:"500/2000 Siaair", condition:"Heavy Oil", accent:"#d32f2f",
    ballSlug:"radical-deep-impact", coreSlug:"radical-astrophysics-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.018}, 15:{rg:2.490,diff:0.050,moi:0.017},
      14:{rg:2.500,diff:0.047}, 13:{rg:2.585,diff:0.042}, 12:{rg:2.645,diff:0.035}
    },
    releaseDate:"Feb 2026",
    colors:["blue","black"],
    description:"Make a deep impact on the heaviest oil with the Astrophysics asymmetric core."
  },
  {
    id:22, brand:"Radical", name:"Outer Limits Black Hole",
    cover:"Solid", coreType:"Asymmetric", coreName:"Astrophysics",
    finish:"Crown Factory Compound", condition:"Heavy Oil", accent:"#212121",
    ballSlug:"radical-outer-limits-black-hole", coreSlug:"radical-astrophysics-core",
    weightData:{
      16:{rg:2.499,diff:0.051,moi:0.017}, 15:{rg:2.509,diff:0.049,moi:0.016},
      14:{rg:2.519,diff:0.046}, 13:{rg:2.604,diff:0.041}, 12:{rg:2.664,diff:0.034}
    },
    releaseDate:"Jan 2026",
    colors:["black","silver"],
    description:"Push beyond the outer limits — the Black Hole swallows anything in its path."
  },
  // Track
  {
    id:23, brand:"Track", name:"Synthesis",
    cover:"Solid", coreType:"Asymmetric", coreName:"Kinetic",
    finish:"500/1500 Siaair", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"track-synthesis", coreSlug:"track-kinetic-core",
    weightData:{
      16:{rg:2.480,diff:0.053,moi:0.017}, 15:{rg:2.490,diff:0.051,moi:0.016},
      14:{rg:2.500,diff:0.048}, 13:{rg:2.585,diff:0.043}, 12:{rg:2.645,diff:0.036}
    },
    releaseDate:"Feb 2026",
    colors:["purple","black"],
    description:"The synthesis of everything Track does best in one powerful asymmetric solid."
  },
  {
    id:24, brand:"Track", name:"Stealth Mode Hybrid",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Stealth",
    finish:"Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#37474f",
    ballSlug:"track-stealth-mode-hybrid", coreSlug:"track-stealth-core",
    weightData:{
      16:{rg:2.482,diff:0.056}, 15:{rg:2.492,diff:0.054},
      14:{rg:2.502,diff:0.051}, 13:{rg:2.587,diff:0.046}, 12:{rg:2.647,diff:0.039}
    },
    releaseDate:"Jan 2026",
    colors:["black","silver"],
    description:"Operate in stealth mode — symmetric hybrid that strikes without warning."
  },

  // ── 2023-2025 신규 추가 ──────────────────────────────────────────
  // Storm
  {
    id:25, brand:"Storm", name:"Ion Pro",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Element Tour A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-ion-pro", coreSlug:"storm-element-tour-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.035,moi:0.013}, 15:{rg:2.470,diff:0.035,moi:0.014},
      14:{rg:2.510,diff:0.036,moi:0.010}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Jun 2024",
    colors:["teal","black"],
    description:"Storm's first asymmetric benchmark ball — versatile, forgiving, built for every style."
  },
  {
    id:26, brand:"Storm", name:"Phaze A.I.",
    cover:"Pearl", coreType:"Symmetric", coreName:"Velocity A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ai", coreSlug:"storm-velocity-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.053}, 15:{rg:2.470,diff:0.053},
      14:{rg:2.520,diff:0.052}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Oct 2024",
    colors:["purple","black"],
    description:"Think Phaze II, but pearl — A.I. core technology meets TX-16 Pearl for explosive backend."
  },
  // Brunswick
  {
    id:27, brand:"Brunswick", name:"Ethos",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ethos",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-ethos", coreSlug:"brunswick-ethos-core",
    weightData:{
      16:{rg:2.495,diff:0.046}, 15:{rg:2.481,diff:0.053},
      14:{rg:2.505,diff:0.053}, 13:{rg:2.510,diff:0.047}, 12:{rg:2.577,diff:0.045}
    },
    releaseDate:"Oct 2023",
    colors:["blue","silver","pearl"],
    description:"Brunswick's ethos in ball form — HK22 pearl cover with sweeping backend motion."
  },
  {
    id:28, brand:"Brunswick", name:"Mesmerize",
    cover:"Solid", coreType:"Asymmetric", coreName:"Tri-Elliptic",
    finish:"500/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-mesmerize", coreSlug:"brunswick-tri-elliptic-core",
    weightData:{
      16:{rg:2.521,diff:0.048,moi:0.014}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.533,diff:0.056,moi:0.016}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Aug 2024",
    colors:["blue","purple","silver"],
    description:"HK22C-Evo Solid with the new Tri-Elliptic D.O.T. core — Brunswick's biggest hooking ball ever."
  },
  // Roto Grip
  {
    id:29, brand:"Roto Grip", name:"Attention Star",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Momentous AV + A.I.",
    finish:"Reacta Gloss", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-attention-star", coreSlug:"roto-grip-momentous-av-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.049,moi:0.017},
      14:{rg:2.530,diff:0.046,moi:0.014}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Feb 2024",
    colors:["blue","silver","black"],
    description:"eTrax PLUS Pearl with the Momentous AV + A.I. core — a ball motion unlike anything on earth."
  },
  {
    id:30, brand:"Roto Grip", name:"Optimum Idol",
    cover:"Solid", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-optimum-idol", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.054}, 15:{rg:2.470,diff:0.056},
      14:{rg:2.510,diff:0.054}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Mar 2024",
    colors:["purple","pearl"],
    description:"MicroTrax Solid particle cover with the Ikon + A.I. core — a cheat code for any lane condition."
  },
  // Motiv
  {
    id:31, brand:"Motiv", name:"Jackal Onyx",
    cover:"Solid", coreType:"Asymmetric", coreName:"Predator V2",
    finish:"1000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-jackal-onyx", coreSlug:"motiv-predator-v2-core",
    weightData:{
      16:{rg:2.480,diff:0.047,moi:0.013}, 15:{rg:2.480,diff:0.047,moi:0.013},
      14:{rg:2.510,diff:0.044,moi:0.011}, 13:{rg:2.560,diff:0.040,moi:0.009}, 12:{rg:2.620,diff:0.034,moi:0.008}
    },
    releaseDate:"Jan 2025",
    colors:["black","orange"],
    description:"Leverage HXC Solid with Duramax tech and the Predator V2 core — maximum hook, relentless traction."
  },
  {
    id:32, brand:"Motiv", name:"Nuclear Forge",
    cover:"Pearl", coreType:"Symmetric", coreName:"Detonator",
    finish:"1500 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-nuclear-forge", coreSlug:"motiv-detonator-core",
    weightData:{
      16:{rg:2.470,diff:0.054}, 15:{rg:2.470,diff:0.055},
      14:{rg:2.500,diff:0.052}, 13:{rg:2.560,diff:0.046}, 12:{rg:2.620,diff:0.039}
    },
    releaseDate:"May 2024",
    colors:["orange","black"],
    description:"Propulsion HVP Pearl with the Detonator symmetric core — electrifying length and explosive backend motion."
  },
  // Hammer
  {
    id:33, brand:"Hammer", name:"Black Widow 3.0",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#212121",
    ballSlug:"hammer-black-widow-30", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.510,diff:0.048,moi:0.015}, 15:{rg:2.500,diff:0.058,moi:0.016},
      14:{rg:2.500,diff:0.056,moi:0.016}, 13:{rg:2.589,diff:0.043,moi:0.011}, 12:{rg:2.612,diff:0.043,moi:0.011}
    },
    releaseDate:"Jan 2024",
    colors:["black","red","orange"],
    description:"HK22 Aggression Solid with the legendary Gas Mask core — the Black Widow line's most powerful solid yet."
  },
  {
    id:34, brand:"Hammer", name:"Effect Tour",
    cover:"Solid", coreType:"Asymmetric", coreName:"Huntsman Tour",
    finish:"500/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#212121",
    ballSlug:"hammer-effect-tour", coreSlug:"hammer-huntsman-tour-core",
    weightData:{
      16:{rg:2.472,diff:0.036,moi:0.012}, 15:{rg:2.472,diff:0.036,moi:0.012},
      14:{rg:2.472,diff:0.036,moi:0.012}, 13:{rg:2.597,diff:0.041,moi:0.011}, 12:{rg:2.612,diff:0.041,moi:0.011}
    },
    releaseDate:"Nov 2024",
    colors:["blue","black","silver"],
    description:"TourV3 Solid with the low-diff Huntsman Tour core — smooth, predictable, precision motion for demanding patterns."
  },
  // 900 Global
  {
    id:35, brand:"900 Global", name:"Zen 25",
    cover:"Pearl", coreType:"Symmetric", coreName:"Meditate A.I.",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-zen-25", coreSlug:"900-global-meditate-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.053}, 15:{rg:2.480,diff:0.053},
      14:{rg:2.490,diff:0.051}, 13:{rg:2.560,diff:0.046}, 12:{rg:2.580,diff:0.039}
    },
    releaseDate:"Jan 2025",
    colors:["blue","teal","black"],
    description:"RB 83 Pearl with the Meditate A.I. symmetric core — Zen's 25th anniversary, pushed to new heights."
  },
  {
    id:36, brand:"900 Global", name:"Eternity Pi",
    cover:"Solid", coreType:"Asymmetric", coreName:"Epoch",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-eternity-pi", coreSlug:"900-global-epoch-core",
    weightData:{
      16:{rg:2.470,diff:0.052,moi:0.014}, 15:{rg:2.490,diff:0.052,moi:0.014},
      14:{rg:2.490,diff:0.052,moi:0.014}, 13:{rg:2.560,diff:0.046,moi:0.011}, 12:{rg:2.580,diff:0.040,moi:0.009}
    },
    releaseDate:"Sep 2023",
    colors:["purple","gold","black"],
    description:"Reserve Blend 901 Solid with the all-new Epoch Asymmetric core — heavy oil power with a cleaner motion."
  },
  // DV8
  {
    id:37, brand:"DV8", name:"Heckler",
    cover:"Solid", coreType:"Asymmetric", coreName:"Unholy",
    finish:"500/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#4e342e",
    ballSlug:"dv8-heckler", coreSlug:"dv8-unholy-core",
    weightData:{
      16:{rg:2.518,diff:0.043,moi:0.010}, 15:{rg:2.504,diff:0.051,moi:0.010},
      14:{rg:2.526,diff:0.051,moi:0.010}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Nov 2024",
    colors:["orange","black"],
    description:"HK22C Maximum Havoc Solid with the asymmetric Unholy core — engineered for no-thumb dominance on heavy oil."
  },
  {
    id:38, brand:"DV8", name:"Hater",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Hater",
    finish:"500/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#4e342e",
    ballSlug:"dv8-hater", coreSlug:"dv8-hater-core",
    weightData:{
      16:{rg:2.545,diff:0.047,moi:0.021}, 15:{rg:2.539,diff:0.054,moi:0.024},
      14:{rg:2.556,diff:0.054,moi:0.024}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Mar 2024",
    colors:["red","black"],
    description:"HK22 Havoc Hybrid with the brand-new Hater core — a hook monster built for the heaviest conditions."
  },
  // Ebonite
  {
    id:39, brand:"Ebonite", name:"Emerge",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Emerge",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#1b5e20",
    ballSlug:"ebonite-emerge", coreSlug:"ebonite-emerge-core",
    weightData:{
      16:{rg:2.520,diff:0.046,moi:0.018}, 15:{rg:2.510,diff:0.053,moi:0.021},
      14:{rg:2.537,diff:0.054,moi:0.019}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Jul 2023",
    colors:["blue","black"],
    description:"HK22 Optimize Pearl with the new Emerge Asymmetric core — length, flippy backend, and serious continuation."
  },
  {
    id:40, brand:"Ebonite", name:"Emerge Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Emerge",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#1b5e20",
    ballSlug:"ebonite-emerge-hybrid", coreSlug:"ebonite-emerge-core",
    weightData:{
      16:{rg:2.520,diff:0.046,moi:0.018}, 15:{rg:2.510,diff:0.053,moi:0.021},
      14:{rg:2.537,diff:0.054,moi:0.019}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Mar 2024",
    colors:["blue","black"],
    description:"Emerge Hybrid cover brings more mid-lane read — same powerful Emerge core, stronger overall reaction."
  },
  // Columbia 300
  {
    id:41, brand:"Columbia 300", name:"Atlas",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atlas",
    finish:"500/2000 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#00838f",
    ballSlug:"columbia-300-atlas", coreSlug:"columbia-300-atlas-core",
    weightData:{
      16:{rg:2.530,diff:0.047,moi:0.016}, 15:{rg:2.520,diff:0.054,moi:0.018},
      14:{rg:2.542,diff:0.054,moi:0.018}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.612,diff:0.041,moi:0.014}
    },
    releaseDate:"Jul 2023",
    colors:["blue","black"],
    description:"Formula 1 Solid with the new asymmetric Atlas core — exceptional backend and pin drive on medium-heavy oil."
  },
  {
    id:42, brand:"Columbia 300", name:"Atlas Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Atlas",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#00838f",
    ballSlug:"columbia-300-atlas-hybrid", coreSlug:"columbia-300-atlas-core",
    weightData:{
      16:{rg:2.530,diff:0.047,moi:0.016}, 15:{rg:2.520,diff:0.054,moi:0.018},
      14:{rg:2.542,diff:0.054,moi:0.018}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.612,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2024",
    colors:["blue","silver","black"],
    description:"HK22 Formula 1 Hybrid with the Atlas core — longer, cleaner complement to the Atlas Solid."
  },
  // SWAG
  {
    id:43, brand:"SWAG", name:"Unreal",
    cover:"Solid", coreType:"Symmetric", coreName:"Unreal",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#558b2f",
    ballSlug:"swag-unreal", coreSlug:"swag-unreal-core",
    weightData:{
      16:{rg:2.520,diff:0.034}, 15:{rg:2.510,diff:0.047},
      14:{rg:2.560,diff:0.040}, 13:{rg:2.550,diff:0.048}, 12:{rg:2.610,diff:0.041}
    },
    releaseDate:"Jan 2025",
    colors:["blue","silver"],
    description:"Never Quit coverstock on the symmetric Unreal core — SWAG's benchmark utility performance ball."
  },
  {
    id:44, brand:"SWAG", name:"APEX Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"APX V1",
    finish:"3000 Abralon", condition:"Medium-Heavy Oil", accent:"#558b2f",
    ballSlug:"swag-apex-solid", coreSlug:"swag-apx-v1-core",
    weightData:{
      16:{rg:2.500,diff:0.042}, 15:{rg:2.500,diff:0.042},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.590,diff:0.033}, 12:{rg:2.650,diff:0.028}
    },
    releaseDate:"Apr 2025",
    colors:["blue","black"],
    description:"Apex Solid coverstock on the APX V1 symmetric core — smooth, predictable motion that reads oil early and finishes strong."
  },
  // Radical
  {
    id:45, brand:"Radical", name:"ZigZag",
    cover:"Pearl", coreType:"Asymmetric", coreName:"ZigZag",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#bf360c",
    ballSlug:"radical-zigzag", coreSlug:"radical-zigzag-core",
    weightData:{
      16:{rg:2.501,diff:0.045,moi:0.015}, 15:{rg:2.501,diff:0.045,moi:0.015},
      14:{rg:2.531,diff:0.042,moi:0.013}, 13:{rg:2.601,diff:0.037,moi:0.011}, 12:{rg:2.661,diff:0.030,moi:0.009}
    },
    releaseDate:"Dec 2023",
    colors:["blue","orange","black"],
    description:"HK22 HyperKinetic Pearl with the new ZigZag asymmetric core — extended hook window, powerful continuation."
  },
  {
    id:46, brand:"Track", name:"Theorem Pearl",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Theorem",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#37474f",
    ballSlug:"track-theorem-pearl", coreSlug:"track-theorem-core",
    weightData:{
      16:{rg:2.485,diff:0.044,moi:0.017}, 15:{rg:2.473,diff:0.046,moi:0.017},
      14:{rg:2.487,diff:0.046,moi:0.017}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Nov 2024",
    colors:["blue","pearl","silver"],
    description:"HK22 Prime Response Pearl with the Theorem asymmetric core — sharper and more defined breakpoint than the original."
  },
  {
    id:47, brand:"Track", name:"Theorem",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Theorem",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#37474f",
    ballSlug:"track-theorem", coreSlug:"track-theorem-core",
    weightData:{
      16:{rg:2.485,diff:0.044,moi:0.017}, 15:{rg:2.473,diff:0.046,moi:0.017},
      14:{rg:2.487,diff:0.046,moi:0.017}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2024",
    colors:["blue","black"],
    description:"Prime Response Hybrid HK22 with the Theorem asymmetric core — big sweeping motion and strong continuation."
  },

  // ══════════════════════════════════════════════════════════════
  // v6.8 NEW BALLS — 12 brands, 2023-2026 (bowwwl verified)
  // ══════════════════════════════════════════════════════════════

  // ── Storm 추가 (bowwwl 검증) ─────────────────────────────────────
  {
    id:48, brand:"Storm", name:"The Road",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-the-road", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Apr 2024",
    colors:["blue","silver"],
    description:"The legendary Hy-Road reinvented — ReX Hybrid cover with Inverted Fe2 A.I. core for the modern game."
  },
  {
    id:49, brand:"Storm", name:"Absolute Power",
    cover:"Solid", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-absolute-power", coreSlug:"storm-sentinel-core",
    weightData:{
      16:{rg:2.480,diff:0.044,moi:0.016}, 15:{rg:2.480,diff:0.044,moi:0.016},
      14:{rg:2.520,diff:0.042,moi:0.014}, 13:{rg:2.590,diff:0.038,moi:0.011}, 12:{rg:2.650,diff:0.031,moi:0.009}
    },
    releaseDate:"Jan 2024",
    colors:["red","black"],
    description:"R2S Deep Solid on Storm's first single-density Sentinel core — powerful solid motion for heavy conditions."
  },
  {
    id:50, brand:"Storm", name:"Summit Peak",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-summit-peak", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Jan 2024",
    colors:["blue","purple","black"],
    description:"TX-23 Pearl with the Centripetal HD A.I. core — unlike anything else in your bag, a clean yet powerful shape."
  },
  {
    id:51, brand:"Storm", name:"Summit Ascent",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-summit-ascent", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Aug 2024",
    colors:["blue","teal","black"],
    description:"R2S Solid at 4000-grit — uniquely cleaner than typical solids while still commanding medium-heavy oil."
  },
  {
    id:52, brand:"Storm", name:"Marvel Scale",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-marvel-scale", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.056,moi:0.018},
      14:{rg:2.510,diff:0.053,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Oct 2023",
    colors:["purple","silver","gold"],
    description:"R2S Solid with the powerful Atomic A.I. core — heavy oil dominance with the signature Storm backend snap."
  },
  {
    id:53, brand:"Storm", name:"Phaze A.I. Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Velocity A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ai-solid", coreSlug:"storm-velocity-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.053}, 15:{rg:2.470,diff:0.053},
      14:{rg:2.520,diff:0.052}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Mar 2025",
    colors:["purple","black"],
    description:"TX-16 Solid wrapped around the Velocity A.I. core — the benchmark solid companion to the Phaze A.I. Pearl."
  },

  // ── Brunswick 추가 (bowwwl 검증) ────────────────────────────────
  {
    id:54, brand:"Brunswick", name:"Hypnotize",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Tri-Elliptic",
    finish:"500/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-hypnotize", coreSlug:"brunswick-tri-elliptic-core",
    weightData:{
      16:{rg:2.521,diff:0.048,moi:0.014}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.533,diff:0.056,moi:0.016}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Feb 2025",
    colors:["purple","teal","black"],
    description:"HK22C-Evo Hybrid with the Tri-Elliptic core — the perfect Mesmerize follow-up with controlled backend aggression."
  },
  {
    id:55, brand:"Brunswick", name:"Ethos Hybrid",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Ethos",
    finish:"500/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-ethos-hybrid", coreSlug:"brunswick-ethos-core",
    weightData:{
      16:{rg:2.495,diff:0.046}, 15:{rg:2.481,diff:0.053},
      14:{rg:2.505,diff:0.053}, 13:{rg:2.510,diff:0.047}, 12:{rg:2.577,diff:0.045}
    },
    releaseDate:"Mar 2024",
    colors:["blue","teal","black"],
    description:"HK22 Ethos Hybrid cover — larger, polished symmetric motion that surpasses previous Ethos models."
  },
  {
    id:56, brand:"Brunswick", name:"Vaporize",
    cover:"Solid", coreType:"Asymmetric", coreName:"Tri-Elliptic",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-vaporize", coreSlug:"brunswick-tri-elliptic-core",
    weightData:{
      16:{rg:2.521,diff:0.048,moi:0.014}, 15:{rg:2.510,diff:0.056,moi:0.017},
      14:{rg:2.533,diff:0.056,moi:0.016}, 13:{rg:2.597,diff:0.041,moi:0.014}, 12:{rg:2.593,diff:0.041,moi:0.014}
    },
    releaseDate:"Nov 2024",
    colors:["green","black"],
    description:"HK22C-Evo Solid with the Tri-Elliptic core — the strongest option in the Mesmerize family for heavy oil."
  },
  {
    id:57, brand:"Roto Grip", name:"Attention Star S2",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Momentous AV + A.I.",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-attention-star-s2", coreSlug:"roto-grip-momentous-av-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.049,moi:0.017},
      14:{rg:2.530,diff:0.046,moi:0.014}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Nov 2024",
    colors:["purple","black"],
    description:"eTrax PLUS Hybrid with the Momentous AV + A.I. core — S2 brings midlane grip with the same monster backend."
  },
  {
    id:58, brand:"Roto Grip", name:"Rockstar",
    cover:"Solid", coreType:"Symmetric", coreName:"Rocker A.I.",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-rockstar", coreSlug:"roto-grip-rocker-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.054}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Feb 2025",
    colors:["red","black"],
    description:"NanoStar Solid on the brand-new Rocker A.I. core — fills the gap between MicroTrax and eTrax for total versatility."
  },
  {
    id:59, brand:"Roto Grip", name:"Magic Gem",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Defiant LRG",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-magic-gem", coreSlug:"roto-grip-defiant-lrg-core",
    weightData:{
      16:{rg:2.470,diff:0.054}, 15:{rg:2.470,diff:0.054},
      14:{rg:2.510,diff:0.054}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Oct 2023",
    colors:["teal","pearl","silver"],
    description:"MicroTrax Hybrid with the Defiant LRG core — enchanting arc motion for medium-heavy conditions."
  },
  {
    id:60, brand:"Roto Grip", name:"Hustle BRY",
    cover:"Hybrid", coreType:"Symmetric", coreName:"HP1 A.I.",
    finish:"Reacta Gloss", condition:"Light-Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-hustle-bry", coreSlug:"roto-grip-hp1-ai-core",
    weightData:{
      16:{rg:2.560,diff:0.035}, 15:{rg:2.560,diff:0.035},
      14:{rg:2.580,diff:0.033}, 13:{rg:2.640,diff:0.028}, 12:{rg:2.700,diff:0.023}
    },
    releaseDate:"Apr 2024",
    colors:["blue","red","yellow"],
    description:"VTC Hybrid cover on the HP1 A.I. core — built for everyone, from casual leagues to competitive play on lighter oil."
  },

  // ── Motiv 추가 (bowwwl 검증) ─────────────────────────────────────
  {
    id:61, brand:"Motiv", name:"Lethal Venom",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gear APG",
    finish:"3000 LSS", condition:"Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-lethal-venom", coreSlug:"motiv-gear-apg-core",
    weightData:{
      16:{rg:2.470,diff:0.036,moi:0.013}, 15:{rg:2.470,diff:0.036,moi:0.013},
      14:{rg:2.500,diff:0.034,moi:0.011}, 13:{rg:2.560,diff:0.030,moi:0.009}, 12:{rg:2.620,diff:0.025,moi:0.007}
    },
    releaseDate:"Oct 2024",
    colors:["black","orange"],
    description:"Leverage MXC Solid with Duramax tech on the Gear APG core — the benchmark Venom, predictable and deadly."
  },
  {
    id:62, brand:"Motiv", name:"Pride Empire",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Overload",
    finish:"2000 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-pride-empire", coreSlug:"motiv-overload-core",
    weightData:{
      16:{rg:2.480,diff:0.053,moi:0.018}, 15:{rg:2.480,diff:0.053,moi:0.018},
      14:{rg:2.510,diff:0.050,moi:0.016}, 13:{rg:2.565,diff:0.045,moi:0.013}, 12:{rg:2.625,diff:0.038,moi:0.011}
    },
    releaseDate:"Jun 2023",
    colors:["purple","gold","black"],
    description:"Propulsion Pearl on the Overload core — new level of backend speed and angular response in the Pride line."
  },
  {
    id:63, brand:"Motiv", name:"Blue Tank",
    cover:"Solid", coreType:"Symmetric", coreName:"Halogen V2",
    finish:"500 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-blue-tank", coreSlug:"motiv-halogen-v2-core",
    weightData:{
      16:{rg:2.560,diff:0.029}, 15:{rg:2.560,diff:0.029},
      14:{rg:2.590,diff:0.027}, 13:{rg:2.650,diff:0.022}, 12:{rg:2.710,diff:0.018}
    },
    releaseDate:"Jan 2024",
    colors:["blue","black"],
    description:"Microcell Polymer cover with the Halogen V2 core — urethane-like control with reactive power for heavy oil."
  },
  {
    id:64, brand:"Motiv", name:"Hyper Venom",
    cover:"Pearl", coreType:"Symmetric", coreName:"Gear",
    finish:"2000 LSS", condition:"Light-Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-hyper-venom", coreSlug:"motiv-gear-core",
    weightData:{
      16:{rg:2.470,diff:0.028}, 15:{rg:2.470,diff:0.030},
      14:{rg:2.500,diff:0.027}, 13:{rg:2.560,diff:0.023}, 12:{rg:2.620,diff:0.019}
    },
    releaseDate:"Mar 2024",
    colors:["red","orange","black"],
    description:"Propulsion MXR Pearl on the proven Gear core — the most angular Venom ever, deadly on light-moderate volumes."
  },

  // ── Storm v6.8 신규 ──────────────────────────────────────────────
  {
    id:65, brand:"Storm", name:"Equinox Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Solarion A.I.",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-equinox-solid", coreSlug:"storm-solarion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.510,diff:0.052,moi:0.015}, 13:{rg:2.580,diff:0.047,moi:0.012}, 12:{rg:2.640,diff:0.040,moi:0.010}
    },
    releaseDate:"Oct 2025",
    colors:["blue","black"],
    description:"A2S Solid with the Solarion A.I. core — sharp, angular solid rare in its kind, stands toe-to-toe with the Ion Max."
  },
  {
    id:66, brand:"Storm", name:"PhysiX Grandeur",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-grandeur", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Nov 2025",
    colors:["purple","gold","black"],
    description:"R2S Solid with the Atomic A.I. core — overseas release bringing the PhysiX pedigree to heavy oil dominance."
  },
  {
    id:67, brand:"Storm", name:"Code Honor",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"2000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-honor", coreSlug:"storm-sentinel-core",
    weightData:{
      16:{rg:2.480,diff:0.044,moi:0.016}, 15:{rg:2.480,diff:0.044,moi:0.016},
      14:{rg:2.520,diff:0.042,moi:0.014}, 13:{rg:2.590,diff:0.038,moi:0.011}, 12:{rg:2.650,diff:0.031,moi:0.009}
    },
    releaseDate:"Nov 2025",
    colors:["blue","silver","black"],
    description:"NeX Pearl (Nano Extreme) — Storm's earliest-reading cover ever, paired with the Sentinel core for big midlane motion."
  },
  {
    id:68, brand:"Storm", name:"Next Factor",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Ignition A.I.",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-next-factor", coreSlug:"storm-ignition-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.018}, 15:{rg:2.480,diff:0.052,moi:0.018},
      14:{rg:2.520,diff:0.050,moi:0.016}, 13:{rg:2.590,diff:0.044,moi:0.013}, 12:{rg:2.650,diff:0.037,moi:0.011}
    },
    releaseDate:"Dec 2025",
    colors:["orange","black"],
    description:"RX Pro Pearl on Ignition A.I. — the modern revival of the legendary X-Factor skid-flip reaction."
  },
  {
    id:69, brand:"Brunswick", name:"Combat Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Rampart",
    finish:"500/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-combat-solid", coreSlug:"brunswick-rampart-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.016}, 15:{rg:2.490,diff:0.058,moi:0.018},
      14:{rg:2.510,diff:0.058,moi:0.018}, 13:{rg:2.590,diff:0.042,moi:0.014}, 12:{rg:2.610,diff:0.042,moi:0.014}
    },
    releaseDate:"Sep 2024",
    colors:["red","black"],
    description:"QR-12 Solid cover with the Rampart asymmetric core — midlane-dominant heavy oil control."
  },
  {
    id:70, brand:"Brunswick", name:"Danger Zone",
    cover:"Solid", coreType:"Symmetric", coreName:"Twist",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-danger-zone", coreSlug:"brunswick-twist-core",
    weightData:{
      16:{rg:2.520,diff:0.048}, 15:{rg:2.520,diff:0.050},
      14:{rg:2.550,diff:0.048}, 13:{rg:2.610,diff:0.040}, 12:{rg:2.670,diff:0.033}
    },
    releaseDate:"Dec 2025",
    colors:["red","black"],
    description:"A modern tribute to the 1996 classic — QR-12 Solid with the Twist core for today's lanes."
  },
  {
    id:71, brand:"Brunswick", name:"Crown 78U",
    cover:"Urethane", coreType:"Symmetric", coreName:"Crown",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-crown-78u", coreSlug:"brunswick-crown-core",
    weightData:{
      16:{rg:2.530,diff:0.040}, 15:{rg:2.530,diff:0.043},
      14:{rg:2.560,diff:0.041}, 13:{rg:2.620,diff:0.034}, 12:{rg:2.680,diff:0.028}
    },
    releaseDate:"Dec 2025",
    colors:["purple","black"],
    description:"USBC-approved 78-durometer urethane with the Crown core — more flare potential than traditional urethane."
  },

  // ── Roto Grip v6.8 신규 ──────────────────────────────────────────
  {
    id:72, brand:"Roto Grip", name:"Rockstar Amped",
    cover:"Pearl", coreType:"Symmetric", coreName:"Rocker A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-rockstar-amped", coreSlug:"roto-grip-rocker-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.054}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.580,diff:0.047}, 12:{rg:2.640,diff:0.037}
    },
    releaseDate:"Oct 2025",
    colors:["red","black","gold"],
    description:"NanoStar Pearl on Rocker A.I. — the Rockstar's angular sibling, delivering a roaring wall of backend sound."
  },
  {
    id:73, brand:"Roto Grip", name:"Optimum Idol Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-optimum-idol-solid", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.048}, 15:{rg:2.470,diff:0.047},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.560,diff:0.038}, 12:{rg:2.620,diff:0.030}
    },
    releaseDate:"Oct 2025",
    colors:["purple","black"],
    description:"eTrax PLUS Solid on Ikon + A.I. — the Idol Helios reborn with A.I. tech for wider lane versatility."
  },
  {
    id:74, brand:"Motiv", name:"Primal Rage Evolution",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Impulse V2",
    finish:"2000 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-primal-rage-evolution", coreSlug:"motiv-impulse-v2-core",
    weightData:{
      16:{rg:2.570,diff:0.050,moi:0.018}, 15:{rg:2.570,diff:0.050,moi:0.018},
      14:{rg:2.600,diff:0.047,moi:0.016}, 13:{rg:2.660,diff:0.042,moi:0.013}, 12:{rg:2.720,diff:0.035,moi:0.011}
    },
    releaseDate:"Nov 2024",
    colors:["red","black"],
    description:"Propulsion HVP Pearl on Impulse V2 — the legendary #redball reborn, explosive backend return of the Primal Rage."
  },
  {
    id:75, brand:"Motiv", name:"Apex Jackal",
    cover:"Solid", coreType:"Asymmetric", coreName:"Apex Predator",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-apex-jackal", coreSlug:"motiv-apex-predator-core",
    weightData:{
      16:{rg:2.480,diff:0.054,moi:0.019}, 15:{rg:2.480,diff:0.052,moi:0.019},
      14:{rg:2.510,diff:0.050,moi:0.017}, 13:{rg:2.565,diff:0.045,moi:0.014}, 12:{rg:2.625,diff:0.038,moi:0.012}
    },
    releaseDate:"Aug 2025",
    colors:["orange","black"],
    description:"Propulsion MXV Solid on the dual-density Apex Predator core — a new predator for the most demanding heavy oil."
  },
  {
    id:76, brand:"Motiv", name:"Steel Forge",
    cover:"Pearl", coreType:"Symmetric", coreName:"Detonator",
    finish:"2000 LSS", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-steel-forge", coreSlug:"motiv-detonator-core",
    weightData:{
      16:{rg:2.470,diff:0.048}, 15:{rg:2.470,diff:0.048},
      14:{rg:2.500,diff:0.046}, 13:{rg:2.560,diff:0.041}, 12:{rg:2.620,diff:0.034}
    },
    releaseDate:"Aug 2025",
    colors:["silver","black"],
    description:"Propulsion MXV Pearl on the Detonator core — explosive down-lane reaction with the Evoke Hysteria's proven cover."
  },
  {
    id:77, brand:"Hammer", name:"Maximum Effect",
    cover:"Solid", coreType:"Asymmetric", coreName:"Huntsman Tour",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-maximum-effect", coreSlug:"hammer-huntsman-tour-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.490,diff:0.055,moi:0.017},
      14:{rg:2.530,diff:0.053,moi:0.016}, 13:{rg:2.600,diff:0.046,moi:0.013}, 12:{rg:2.660,diff:0.039,moi:0.011}
    },
    releaseDate:"Sep 2025",
    colors:["red","black","silver"],
    description:"HK22 Solid on the Huntsman Tour core — the ultimate upgrade to the popular Effect with maximum power."
  },
  {
    id:78, brand:"900 Global", name:"Cruise Sapphire",
    cover:"Pearl", coreType:"Symmetric", coreName:"Cruise",
    finish:"Reacta Gloss", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-cruise-sapphire", coreSlug:"900-global-cruise-core",
    weightData:{
      16:{rg:2.570,diff:0.030}, 15:{rg:2.570,diff:0.030},
      14:{rg:2.600,diff:0.028}, 13:{rg:2.660,diff:0.023}, 12:{rg:2.720,diff:0.018}
    },
    releaseDate:"May 2023",
    colors:["blue","silver","pearl"],
    description:"Pearl reactive on the Cruise symmetric core — smooth, predictable arc motion for lighter oil conditions."
  },
  {
    id:79, brand:"900 Global", name:"Dark Matter",
    cover:"Solid", coreType:"Asymmetric", coreName:"Dark Matter",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-dark-matter", coreSlug:"900-global-dark-matter-core",
    weightData:{
      16:{rg:2.480,diff:0.054,moi:0.018}, 15:{rg:2.475,diff:0.053,moi:0.018},
      14:{rg:2.510,diff:0.051,moi:0.016}, 13:{rg:2.570,diff:0.045,moi:0.013}, 12:{rg:2.630,diff:0.038,moi:0.011}
    },
    releaseDate:"Oct 2023",
    colors:["black","silver"],
    description:"Quantum Solid on the Dark Matter asymmetric core — heavy oil workhorse with strong midlane continuation."
  },
  {
    id:80, brand:"900 Global", name:"Zen 25 Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Meditate A.I.",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-zen-25-pearl", coreSlug:"900-global-meditate-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.053}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.510,diff:0.048}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Jun 2025",
    colors:["blue","pearl","silver"],
    description:"Pearl reactive on Meditate A.I. — the Zen 25 pearl complement, adding length with the same smooth arc."
  },

  // ── DV8 v6.8 신규 ───────────────────────────────────────────────
  {
    id:81, brand:"DV8", name:"Mantra Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Mantra",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-mantra-solid", coreSlug:"dv8-mantra-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.490,diff:0.055,moi:0.017},
      14:{rg:2.520,diff:0.053,moi:0.016}, 13:{rg:2.590,diff:0.046,moi:0.013}, 12:{rg:2.650,diff:0.039,moi:0.011}
    },
    releaseDate:"Sep 2025",
    colors:["blue","black"],
    description:"Strong solid cover on the Mantra asymmetric core — consistent hook and reliable control for heavy conditions."
  },
  {
    id:82, brand:"Ebonite", name:"Envision",
    cover:"Pearl", coreType:"Symmetric", coreName:"Envision",
    finish:"Reacta Gloss", condition:"Medium Oil", accent:"#4527a0",
    ballSlug:"ebonite-envision", coreSlug:"ebonite-envision-core",
    weightData:{
      16:{rg:2.500,diff:0.042}, 15:{rg:2.500,diff:0.044},
      14:{rg:2.530,diff:0.042}, 13:{rg:2.600,diff:0.035}, 12:{rg:2.660,diff:0.029}
    },
    releaseDate:"Jan 2023",
    colors:["blue","silver"],
    description:"Pearl reactive on the Envision symmetric core — clean, angular backend response for medium conditions."
  },
  {
    id:83, brand:"Ebonite", name:"Choice Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Choice",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#4527a0",
    ballSlug:"ebonite-choice-solid", coreSlug:"ebonite-choice-core",
    weightData:{
      16:{rg:2.490,diff:0.053,moi:0.018}, 15:{rg:2.490,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.053,moi:0.016}, 13:{rg:2.590,diff:0.047,moi:0.013}, 12:{rg:2.650,diff:0.040,moi:0.011}
    },
    releaseDate:"Aug 2024",
    colors:["orange","black"],
    description:"Strong solid cover on the Choice asymmetric core — aggressive heavy-oil motion with high entry angle."
  },

  // ── Columbia 300 v6.8 신규 ───────────────────────────────────────
  {
    id:84, brand:"SWAG", name:"Craze Tour Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Craze",
    finish:"500 Polished", condition:"Medium Oil", accent:"#558b2f",
    ballSlug:"swag-craze-tour-pearl", coreSlug:"swag-craze-core",
    weightData:{
      16:{rg:2.510,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}
    },
    releaseDate:"Nov 2025",
    colors:["purple","pearl","silver"],
    description:"SWAG Rage Pearl AP26 on the Craze symmetric core — clean, polished arc for medium oil league play."
  },

  // ── Radical v6.8 신규 ───────────────────────────────────────────
  {
    id:85, brand:"Radical", name:"Zig Zag Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"ZigZag",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"radical-zig-zag-solid", coreSlug:"radical-zigzag-core",
    weightData:{
      16:{rg:2.500,diff:0.045,moi:0.017}, 15:{rg:2.490,diff:0.047,moi:0.017},
      14:{rg:2.530,diff:0.045,moi:0.015}, 13:{rg:2.600,diff:0.039,moi:0.012}
    },
    releaseDate:"Sep 2024",
    colors:["blue","black"],
    description:"Solid reactive on the ZigZag asymmetric core — powerful solid motion companion to the original ZigZag Pearl."
  },
  {
    id:86, brand:"Radical", name:"Ridiculous Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ridiculous",
    finish:"Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"radical-ridiculous-pearl", coreSlug:"radical-ridiculous-core",
    weightData:{
      16:{rg:2.520,diff:0.040}, 15:{rg:2.510,diff:0.042},
      14:{rg:2.540,diff:0.040}, 13:{rg:2.610,diff:0.033}
    },
    releaseDate:"Mar 2024",
    colors:["pink","pearl","white"],
    description:"Pearl reactive on the Ridiculous symmetric core — smooth, arcing response for medium oil versatility."
  },

  // ── Track v6.8 신규 ─────────────────────────────────────────────
  {
    id:87, brand:"Storm", name:"Ion Max",
    cover:"Solid", coreType:"Asymmetric", coreName:"Element Max A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-ion-max", coreSlug:"storm-element-max-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.510,diff:0.052,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Sep 2024",
    colors:["blue","silver"],
    description:"TX-16 Solid on Element Max A.I. — the benchmark heavy-oil asymmetric for the modern game, top-tier midlane."
  },
  {
    id:88, brand:"Storm", name:"Ion Pro Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Element Tour A.I.",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-ion-pro-solid", coreSlug:"storm-element-tour-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.018}, 15:{rg:2.480,diff:0.051,moi:0.018},
      14:{rg:2.520,diff:0.048,moi:0.016}, 13:{rg:2.590,diff:0.042,moi:0.013}, 12:{rg:2.650,diff:0.035,moi:0.011}
    },
    releaseDate:"Jun 2025",
    colors:["teal","black"],
    description:"TX-16 Solid on Element Tour A.I. — the Ion Pro's solid sibling, stronger midlane with the same benchmark shape."
  },
  {
    id:89, brand:"Storm", name:"Marvel Pearl A.I.",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-marvel-pearl-ai", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Nov 2024",
    colors:["purple","pearl","silver"],
    description:"NRG Pearl on Centripetal HD A.I. — the Marvel series upgraded with A.I. tech for a straighter, smoother arc."
  },
  {
    id:90, brand:"Storm", name:"PhysiX Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-solid", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Oct 2024",
    colors:["purple","black"],
    description:"EXO Solid on Atomic A.I. — overseas release bringing PhysiX solid power to heavy oil."
  },
  {
    id:91, brand:"Storm", name:"EquinoX",
    cover:"Pearl", coreType:"Symmetric", coreName:"Solarion A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-equinox", coreSlug:"storm-solarion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.050}, 15:{rg:2.470,diff:0.050},
      14:{rg:2.510,diff:0.048}, 13:{rg:2.580,diff:0.042}, 12:{rg:2.640,diff:0.035}
    },
    releaseDate:"Feb 2025",
    colors:["blue","teal","silver"],
    description:"A1S Pearl on Solarion A.I. — purpose-built for 39-44ft league patterns with signature Storm backend motion."
  },
  {
    id:92, brand:"Storm", name:"!Q Tour A.I.",
    cover:"Solid", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour-ai", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Mar 2025",
    colors:["blue","silver","pearl"],
    description:"R2S Solid on Inverted Fe2 A.I. — the legendary !Q Tour elevated with A.I. Core Technology for wider strike window."
  },
  {
    id:93, brand:"Storm", name:"Hyper Motor",
    cover:"Pearl", coreType:"Symmetric", coreName:"Torque A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hyper-motor", coreSlug:"storm-torque-ai-core",
    weightData:{
      16:{rg:2.490,diff:0.048}, 15:{rg:2.490,diff:0.048},
      14:{rg:2.520,diff:0.046}, 13:{rg:2.590,diff:0.040}, 12:{rg:2.650,diff:0.033}
    },
    releaseDate:"Jan 2025",
    colors:["blue","black"],
    description:"RX Pro Pearl on Torque A.I. — the next evolution of the Motor line with explosive backend rev-up."
  },
  {
    id:94, brand:"Storm", name:"The Road X",
    cover:"Solid", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-the-road-x", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Feb 2025",
    colors:["red","black"],
    description:"ReX Solid on Inverted Fe2 A.I. — overseas The Road companion, stronger midlane read on tougher conditions."
  },
  {
    id:95, brand:"Storm", name:"Typhoon",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#00897b",
    ballSlug:"storm-typhoon", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Apr 2025",
    colors:["blue","teal","black"],
    description:"NRG Pearl on Centripetal HD A.I. — powerful precision for light-medium oil, builds momentum every rotation."
  },
  {
    id:96, brand:"Storm", name:"PhysiX Era",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-era", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Jun 2025",
    colors:["blue","purple","black"],
    description:"R2S Solid on Atomic A.I. — overseas PhysiX continuation, combining running and sharpness on heavy oil."
  },
  {
    id:97, brand:"Storm", name:"Motor Rev",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Torque A.I.",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-motor-rev", coreSlug:"storm-torque-ai-core",
    weightData:{
      16:{rg:2.490,diff:0.048}, 15:{rg:2.490,diff:0.048},
      14:{rg:2.520,diff:0.046}, 13:{rg:2.590,diff:0.040}, 12:{rg:2.650,diff:0.033}
    },
    releaseDate:"Dec 2025",
    colors:["red","black","silver"],
    description:"RX Pro Pearl on Torque A.I. — overseas Motor Rev, high-polish skid-flip motion for medium oil."
  },

  // ── Brunswick 누락분 ──────────────────────────────────────────
  {
    id:98, brand:"Brunswick", name:"Combat",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Rampart",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-combat", coreSlug:"brunswick-rampart-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.016}, 15:{rg:2.490,diff:0.058,moi:0.018},
      14:{rg:2.510,diff:0.058,moi:0.018}, 13:{rg:2.590,diff:0.042,moi:0.014}, 12:{rg:2.610,diff:0.042,moi:0.014}
    },
    releaseDate:"Aug 2025",
    colors:["red","black"],
    description:"HK22C Alpha Premier Pearl on Rampart — angular backend response with asymmetric midlane control."
  },
  {
    id:99, brand:"Brunswick", name:"Alert",
    cover:"Solid", coreType:"Symmetric", coreName:"Alert",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-alert", coreSlug:"brunswick-alert-core",
    weightData:{
      16:{rg:2.480,diff:0.042}, 15:{rg:2.480,diff:0.044},
      14:{rg:2.510,diff:0.042}, 13:{rg:2.580,diff:0.036}, 12:{rg:2.640,diff:0.030}
    },
    releaseDate:"Oct 2025",
    colors:["red","black"],
    description:"Low RG/low diff new series — Alert is your early warning system, first-release in the all-new Alert line."
  },
  {
    id:100, brand:"Brunswick", name:"Energize",
    cover:"Pearl", coreType:"Symmetric", coreName:"Energize",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-energize", coreSlug:"brunswick-energize-core",
    weightData:{
      16:{rg:2.510,diff:0.040}, 15:{rg:2.500,diff:0.042},
      14:{rg:2.530,diff:0.040}, 13:{rg:2.600,diff:0.034}, 12:{rg:2.660,diff:0.028}
    },
    releaseDate:"Oct 2025",
    colors:["orange","black"],
    description:"Pearl cover on the Energize symmetric core — the -ize series newest entry for clean, angular medium oil motion."
  },

  // ── Motiv 누락분 ──────────────────────────────────────────────
  {
    id:101, brand:"Motiv", name:"Nebula",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hadron",
    finish:"5500 Grit LSP", condition:"Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-nebula", coreSlug:"motiv-hadron-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.045},
      14:{rg:2.510,diff:0.049}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Oct 2025",
    colors:["purple","blue","black"],
    description:"Dark Matter Propulsion Pearl on Hadron dual-density core — Motiv's most angular coverstock ever, cosmic backend."
  },
  {
    id:102, brand:"Motiv", name:"Raptor Reign",
    cover:"Solid", coreType:"Asymmetric", coreName:"Impulse V2",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-raptor-reign", coreSlug:"motiv-impulse-v2-core",
    weightData:{
      16:{rg:2.570,diff:0.050,moi:0.018}, 15:{rg:2.570,diff:0.050,moi:0.018},
      14:{rg:2.600,diff:0.047,moi:0.016}, 13:{rg:2.660,diff:0.042,moi:0.013}, 12:{rg:2.720,diff:0.035,moi:0.011}
    },
    releaseDate:"Feb 2025",
    colors:["green","black"],
    description:"Propulsion HVP Solid on Impulse V2 — dominant heavy oil raptor with high flare and strong continuous motion."
  },

  // ── Hammer 누락분 ────────────────────────────────────────────
  {
    id:103, brand:"Hammer", name:"Black Widow 2.0 Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-black-widow-20-hybrid", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.490,diff:0.054,moi:0.017}, 15:{rg:2.490,diff:0.057,moi:0.017},
      14:{rg:2.530,diff:0.055,moi:0.016}, 13:{rg:2.600,diff:0.047,moi:0.013}, 12:{rg:2.660,diff:0.040,moi:0.011}
    },
    releaseDate:"Jan 2023",
    colors:["black","red","silver"],
    description:"HK22 Hybrid cover on the Gas Mask core — more midlane read than the pearl BW2.0, built for heavy oil."
  },
  {
    id:104, brand:"Hammer", name:"NU Blue Hammer",
    cover:"Solid", coreType:"Symmetric", coreName:"Spheroid",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-nu-blue-hammer", coreSlug:"hammer-spheroid-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}, 12:{rg:2.660,diff:0.026}
    },
    releaseDate:"Nov 2023",
    colors:["blue","black"],
    description:"Aggression Solid HK22 on Spheroid — a modern reimagining of the iconic Blue Hammer for today's game."
  },

  // ── Roto Grip 누락분 ─────────────────────────────────────────
  {
    id:105, brand:"Roto Grip", name:"Attention Sign",
    cover:"Solid", coreType:"Asymmetric", coreName:"Momentous AV + A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#c62828",
    ballSlug:"roto-grip-attention-sign", coreSlug:"roto-grip-momentous-av-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.049,moi:0.017},
      14:{rg:2.530,diff:0.046,moi:0.014}, 13:{rg:2.560,diff:0.034,moi:0.011}, 12:{rg:2.580,diff:0.031,moi:0.009}
    },
    releaseDate:"Jan 2026",
    colors:["red","black"],
    description:"eTrax PLUS Solid on Momentous AV + A.I. — the Attention Star's solid big brother for heavier conditions."
  },
  {
    id:106, brand:"Roto Grip", name:"RST Hyperdrive Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"HP1 A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-rst-hyperdrive-pearl", coreSlug:"roto-grip-hp1-ai-core",
    weightData:{
      16:{rg:2.560,diff:0.035}, 15:{rg:2.560,diff:0.035},
      14:{rg:2.580,diff:0.033}, 13:{rg:2.640,diff:0.028}, 12:{rg:2.700,diff:0.023}
    },
    releaseDate:"Sep 2025",
    colors:["blue","pearl","silver"],
    description:"VTC Pearl on HP1 A.I. — the RST Hyperdrive's cleaner sibling for arc motion on medium oil."
  },

  // ── 900 Global 누락분 ────────────────────────────────────────
  {
    id:107, brand:"900 Global", name:"Wolverine Night",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Wolverine",
    finish:"Reacta Gloss", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-wolverine-night", coreSlug:"900-global-wolverine-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.485,diff:0.051,moi:0.017},
      14:{rg:2.520,diff:0.049,moi:0.015}, 13:{rg:2.580,diff:0.043,moi:0.012}, 12:{rg:2.640,diff:0.036,moi:0.010}
    },
    releaseDate:"Nov 2024",
    colors:["black","silver"],
    description:"Quantum Pearl on the Wolverine asymmetric core — nighttime aggression with clean arc through the front."
  },

  // ── DV8 누락분 ───────────────────────────────────────────────
  {
    id:108, brand:"DV8", name:"Intimidator",
    cover:"Solid", coreType:"Asymmetric", coreName:"Intimidator",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-intimidator", coreSlug:"dv8-intimidator-core",
    weightData:{
      16:{rg:2.485,diff:0.055,moi:0.018}, 15:{rg:2.480,diff:0.057,moi:0.018},
      14:{rg:2.515,diff:0.055,moi:0.017}, 13:{rg:2.585,diff:0.048,moi:0.014}, 12:{rg:2.645,diff:0.041,moi:0.012}
    },
    releaseDate:"Jun 2025",
    colors:["green","black"],
    description:"Strong solid cover on the Intimidator asymmetric core — DV8's new flagship for maximum heavy-oil dominance."
  },

  // ── Radical 누락분 ───────────────────────────────────────────
  {
    id:109, brand:"Radical", name:"Xtra Bonus",
    cover:"Solid", coreType:"Symmetric", coreName:"Xtra Bonus",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"radical-xtra-bonus", coreSlug:"radical-xtra-bonus-core",
    weightData:{
      16:{rg:2.490,diff:0.040}, 15:{rg:2.490,diff:0.042},
      14:{rg:2.520,diff:0.040}, 13:{rg:2.590,diff:0.034}, 12:{rg:2.650,diff:0.028}
    },
    releaseDate:"Feb 2025",
    colors:["orange","black"],
    description:"Strong solid cover on the Xtra Bonus symmetric core — versatile medium-heavy oil control ball."
  },

  // ── Track 누락분 ─────────────────────────────────────────────
  {
    id:110, brand:"Track", name:"Rhyno",
    cover:"Solid", coreType:"Symmetric", coreName:"II-Core Gen4",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#37474f",
    ballSlug:"track-rhyno", coreSlug:"track-ii-core-gen4-core",
    weightData:{
      16:{rg:2.493,diff:0.048}, 15:{rg:2.480,diff:0.050},
      14:{rg:2.510,diff:0.048}, 13:{rg:2.580,diff:0.042}
    },
    releaseDate:"Aug 2024",
    colors:["orange","black"],
    description:"QR-12 Solid HK22C on II-Core Gen4 — Track's dependable workhorse for medium-heavy oil consistency."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.0 누락분 2차 추가 — 전수 재검증
  // ══════════════════════════════════════════════════════════════

  // ── Storm 추가 누락분 ─────────────────────────────────────────
  {
    id:111, brand:"Storm", name:"Concept",
    cover:"Pearl", coreType:"Symmetric", coreName:"Radius",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#00897b",
    ballSlug:"storm-concept", coreSlug:"storm-radius-core",
    weightData:{
      16:{rg:2.590,diff:0.030}, 15:{rg:2.590,diff:0.030},
      14:{rg:2.610,diff:0.028}, 13:{rg:2.670,diff:0.022}, 12:{rg:2.730,diff:0.018}
    },
    releaseDate:"Feb 2026",
    colors:["blue","teal","black"],
    description:"ARC Pearl on Radius weight block — urethane-alternative motion for short patterns and demanding conditions."
  },
  {
    id:112, brand:"Storm", name:"Absolute Reign",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-absolute-reign", coreSlug:"storm-sentinel-core",
    weightData:{
      16:{rg:2.470,diff:0.053,moi:0.018}, 15:{rg:2.470,diff:0.052,moi:0.018},
      14:{rg:2.510,diff:0.049,moi:0.016}, 13:{rg:2.580,diff:0.043,moi:0.013}, 12:{rg:2.640,diff:0.036,moi:0.011}
    },
    releaseDate:"Jan 2026",
    colors:["purple","black"],
    description:"NeX Pearl on Sentinel — overseas Absolute series' most angular entry, sharp backend on medium-heavy oil."
  },
  {
    id:113, brand:"Storm", name:"Virtual Gravity Destino",
    cover:"Solid", coreType:"Asymmetric", coreName:"Rock HD A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-virtual-gravity-destino", coreSlug:"storm-rock-hd-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.019}, 15:{rg:2.470,diff:0.055,moi:0.019},
      14:{rg:2.510,diff:0.052,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Jan 2026",
    colors:["green","gold","black"],
    description:"Overseas VG Destino — legendary Rock HD A.I. core with excellent rolling for heavy oil dominance."
  },
  {
    id:114, brand:"Storm", name:"Phaze II Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2 A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ii-pearl", coreSlug:"storm-inverted-fe2-ai-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.045}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Nov 2025",
    colors:["blue","purple","pearl"],
    description:"R2S Pearl on Inverted Fe2 A.I. — the Phaze II Pearl bowlers worldwide asked for, classic shape perfected."
  },
  {
    id:115, brand:"Storm", name:"Prime Gate",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-prime-gate", coreSlug:"storm-c3-centripetal-core",
    weightData:{
      16:{rg:2.530,diff:0.048}, 15:{rg:2.530,diff:0.048},
      14:{rg:2.550,diff:0.046}, 13:{rg:2.620,diff:0.040}, 12:{rg:2.680,diff:0.033}
    },
    releaseDate:"Nov 2025",
    colors:["blue","silver"],
    description:"ReX Solid on C3 Centripetal — overseas Gate series Prime entry for medium-heavy oil control."
  },
  {
    id:116, brand:"Storm", name:"Star Road",
    cover:"Solid", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-star-road", coreSlug:"storm-inverted-fe2-core",
    weightData:{
      16:{rg:2.550,diff:0.045}, 15:{rg:2.550,diff:0.045},
      14:{rg:2.550,diff:0.044}, 13:{rg:2.620,diff:0.038}, 12:{rg:2.680,diff:0.031}
    },
    releaseDate:"Oct 2025",
    colors:["blue","silver","pearl"],
    description:"Overseas Star Road — enhanced High Road series with improved track stability for medium-heavy oil."
  },
  {
    id:117, brand:"Storm", name:"Summit Tune",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-summit-tune", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Oct 2025",
    colors:["orange","gold","black"],
    description:"R2S Pearl on Centripetal HD A.I. — overseas Summit continuation, stable arc with strong large hook."
  },
  {
    id:118, brand:"Storm", name:"Marvel Maxx Silver",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-marvel-maxx-silver", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{
      16:{rg:2.460,diff:0.056}, 15:{rg:2.460,diff:0.056},
      14:{rg:2.460,diff:0.056}, 13:{rg:2.590,diff:0.045}, 12:{rg:2.650,diff:0.035}
    },
    releaseDate:"Sep 2025",
    colors:["silver","white","pearl"],
    description:"Overseas Marvel Maxx Silver — stable arc motion, high adaptability across lane conditions."
  },
  {
    id:119, brand:"Storm", name:"PhysiX Raze",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-raze", coreSlug:"storm-atomic-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.056,moi:0.018}, 15:{rg:2.470,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.054,moi:0.016}, 13:{rg:2.580,diff:0.047,moi:0.013}, 12:{rg:2.640,diff:0.040,moi:0.011}
    },
    releaseDate:"Oct 2025",
    colors:["red","orange","black"],
    description:"EXO Hybrid on Atomic A.I. — PhysiX Raze blends cover versatility with the powerful Atomic asymmetric engine."
  },
  {
    id:120, brand:"Storm", name:"Lock-On",
    cover:"Pearl", coreType:"Symmetric", coreName:"RAD-X",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-lock-on", coreSlug:"storm-rad-x-core",
    weightData:{
      16:{rg:2.480,diff:0.046}, 15:{rg:2.480,diff:0.046},
      14:{rg:2.510,diff:0.044}, 13:{rg:2.580,diff:0.038}, 12:{rg:2.640,diff:0.031}
    },
    releaseDate:"Sep 2025",
    colors:["blue","black","silver"],
    description:"RX Pearl on RAD-X — overseas Lock-On, smooth skid with powerful hooking response from breakpoint."
  },
  {
    id:121, brand:"Storm", name:"Blaze DNA",
    cover:"Pearl", coreType:"Symmetric", coreName:"Torsion A.I.",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#00897b",
    ballSlug:"storm-blaze-dna", coreSlug:"storm-torsion-ai-core",
    weightData:{
      16:{rg:2.470,diff:0.050}, 15:{rg:2.470,diff:0.050},
      14:{rg:2.500,diff:0.048}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Apr 2025",
    colors:["red","orange","black"],
    description:"NRG Pearl on Torsion A.I. — overseas Blaze DNA with explosive downlane continuation."
  },

  // ── Roto Grip 추가 누락분 ─────────────────────────────────────
  {
    id:122, brand:"Roto Grip", name:"Vintage Gem",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-vintage-gem", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.048}, 15:{rg:2.480,diff:0.048},
      14:{rg:2.510,diff:0.046}, 13:{rg:2.580,diff:0.040}, 12:{rg:2.640,diff:0.033}
    },
    releaseDate:"Oct 2025",
    colors:["purple","gold","pearl"],
    description:"eTrax PLUS Pearl on Ikon + A.I. — a nostalgic gem design with modern A.I. core performance."
  },
  {
    id:123, brand:"Roto Grip", name:"Hustle ETF",
    cover:"Solid", coreType:"Symmetric", coreName:"Hustle",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-hustle-etf", coreSlug:"roto-grip-hustle-core",
    weightData:{
      16:{rg:2.560,diff:0.030}, 15:{rg:2.560,diff:0.030},
      14:{rg:2.580,diff:0.028}, 13:{rg:2.640,diff:0.023}, 12:{rg:2.700,diff:0.018}
    },
    releaseDate:"Nov 2024",
    colors:["orange","black"],
    description:"Solid cover on Hustle core — ETF (Electric Teal Fuchsia) colorway, reliable entry-level performance."
  },
  {
    id:124, brand:"Roto Grip", name:"Gem Blue Sapphire",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ikon + A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-gem-blue-sapphire", coreSlug:"roto-grip-ikon-ai-core",
    weightData:{
      16:{rg:2.480,diff:0.048}, 15:{rg:2.480,diff:0.048},
      14:{rg:2.510,diff:0.046}, 13:{rg:2.580,diff:0.040}, 12:{rg:2.640,diff:0.033}
    },
    releaseDate:"Oct 2024",
    colors:["blue","silver","pearl"],
    description:"eTrax PLUS Pearl on Ikon + A.I. — sapphire blue gem series with polished backend arc."
  },
  {
    id:125, brand:"Roto Grip", name:"Hustle BP",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hustle",
    finish:"Power Edge", condition:"Light-Medium Oil", accent:"#c62828",
    ballSlug:"roto-grip-hustle-bp", coreSlug:"roto-grip-hustle-core",
    weightData:{
      16:{rg:2.560,diff:0.030}, 15:{rg:2.560,diff:0.030},
      14:{rg:2.580,diff:0.028}, 13:{rg:2.640,diff:0.023}, 12:{rg:2.700,diff:0.018}
    },
    releaseDate:"Jan 2026",
    colors:["blue","purple","pearl"],
    description:"Pearl cover on Hustle — Black/Pink colorway, entry performance ball for light-medium conditions."
  },

  // ── Hammer 추가 누락분 ────────────────────────────────────────
  {
    id:126, brand:"Hammer", name:"Black Widow Tour V1",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask Tour V1",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-black-widow-tour-v1", coreSlug:"hammer-gas-mask-tour-v1-core",
    weightData:{
      16:{rg:2.490,diff:0.033,moi:0.014}, 15:{rg:2.490,diff:0.035,moi:0.014},
      14:{rg:2.530,diff:0.033,moi:0.013}, 13:{rg:2.600,diff:0.028,moi:0.010}, 12:{rg:2.660,diff:0.023,moi:0.008}
    },
    releaseDate:"Sep 2025",
    colors:["black","orange","gold"],
    description:"HK22 Solid on Gas Mask Tour V1 — flip block removed, 20+ point lower diff for smoother controlled motion."
  },
  {
    id:127, brand:"Hammer", name:"Anger",
    cover:"Solid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-anger", coreSlug:"hammer-gas-mask-core",
    weightData:{
      16:{rg:2.490,diff:0.054,moi:0.017}, 15:{rg:2.490,diff:0.057,moi:0.017},
      14:{rg:2.530,diff:0.055,moi:0.016}, 13:{rg:2.600,diff:0.047,moi:0.013}, 12:{rg:2.660,diff:0.040,moi:0.011}
    },
    releaseDate:"Nov 2024",
    colors:["red","black"],
    description:"HK22 Cohesion Solid on Gas Mask — bold upgrade to the Hammer line with attitude and heavy-oil character."
  },
  {
    id:128, brand:"Hammer", name:"Hammerhead",
    cover:"Solid", coreType:"Symmetric", coreName:"Spheroid",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-hammerhead", coreSlug:"hammer-spheroid-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}, 12:{rg:2.660,diff:0.026}
    },
    releaseDate:"Apr 2025",
    colors:["red","black"],
    description:"Aggression Solid HK22 on Spheroid — the original Hammerhead Solid released spring 2025."
  },
  {
    id:129, brand:"Hammer", name:"Zero Mercy Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Super Offset",
    finish:"500/1000/2000 Siaair Micro Pad", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-zero-mercy-solid", coreSlug:"hammer-super-offset-core",
    weightData:{
      16:{rg:2.480,diff:0.056,moi:0.018}, 15:{rg:2.485,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.052,moi:0.016}, 13:{rg:2.590,diff:0.046,moi:0.013}, 12:{rg:2.650,diff:0.039,moi:0.011}
    },
    releaseDate:"Jan 2026",
    colors:["black","silver"],
    description:"HK22 Solid on Super Offset asymmetric core — Zero Mercy solid entry for maximum heavy oil dominance."
  },
  {
    id:130, brand:"Hammer", name:"Zero Mercy Pearl",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Super Offset",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"hammer-zero-mercy-pearl", coreSlug:"hammer-super-offset-core",
    weightData:{
      16:{rg:2.480,diff:0.056,moi:0.018}, 15:{rg:2.485,diff:0.055,moi:0.018},
      14:{rg:2.520,diff:0.052,moi:0.016}, 13:{rg:2.590,diff:0.046,moi:0.013}, 12:{rg:2.650,diff:0.039,moi:0.011}
    },
    releaseDate:"Jan 2026",
    colors:["black","silver","pearl"],
    description:"HK22 Pearl on Super Offset asymmetric core — the angularly sharp Zero Mercy companion."
  },
  {
    id:131, brand:"Hammer", name:"NU 2.0",
    cover:"Urethane", coreType:"Symmetric", coreName:"Spheroid",
    finish:"500/2000 SiaAir", condition:"Medium Oil", accent:"#b71c1c",
    ballSlug:"hammer-nu-20", coreSlug:"hammer-spheroid-core",
    weightData:{
      16:{rg:2.500,diff:0.038}, 15:{rg:2.500,diff:0.040},
      14:{rg:2.530,diff:0.038}, 13:{rg:2.600,diff:0.032}, 12:{rg:2.660,diff:0.026}
    },
    releaseDate:"Jan 2026",
    colors:["blue","silver"],
    description:"Not Urethane (NuCoat) Grey matte cover on Spheroid — follow-up to NU Blue Hammer, MCP-style control."
  },

  // ── Motiv 추가 누락분 ─────────────────────────────────────────
  {
    id:132, brand:"Motiv", name:"Shadow Tank",
    cover:"Pearl", coreType:"Symmetric", coreName:"Halogen V2",
    finish:"5500 LSP", condition:"Medium-Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-shadow-tank", coreSlug:"motiv-halogen-v2-core",
    weightData:{
      16:{rg:2.500,diff:0.045}, 15:{rg:2.500,diff:0.045},
      14:{rg:2.510,diff:0.049}, 13:{rg:2.570,diff:0.042}, 12:{rg:2.630,diff:0.035}
    },
    releaseDate:"Oct 2025",
    colors:["black","silver"],
    description:"Frixion M7 Pearl MCP on Halogen V2 — smoothest, most controllable Tank with urethane-like predictability."
  },
  {
    id:133, brand:"900 Global", name:"Origin",
    cover:"Solid", coreType:"Asymmetric", coreName:"Ellipse A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-origin", coreSlug:"900-global-ellipse-ai-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.485,diff:0.051,moi:0.017},
      14:{rg:2.520,diff:0.049,moi:0.015}, 13:{rg:2.580,diff:0.043,moi:0.012}, 12:{rg:2.640,diff:0.036,moi:0.010}
    },
    releaseDate:"Nov 2024",
    colors:["purple","black"],
    description:"Quantum Solid on Ellipse A.I. — dual precession weight block design for unparalleled hook and turbulence."
  },
  {
    id:134, brand:"900 Global", name:"Viking",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Viking",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-viking", coreSlug:"900-global-viking-core",
    weightData:{
      16:{rg:2.490,diff:0.052,moi:0.017}, 15:{rg:2.485,diff:0.051,moi:0.017},
      14:{rg:2.520,diff:0.049,moi:0.015}, 13:{rg:2.580,diff:0.043,moi:0.012}, 12:{rg:2.640,diff:0.036,moi:0.010}
    },
    releaseDate:"Feb 2026",
    colors:["blue","black"],
    description:"Quantum Hybrid on Viking asymmetric core — aggressive Nordic force for heavy oil conditions."
  },

  // ── DV8 추가 누락분 ──────────────────────────────────────────
  {
    id:135, brand:"Columbia 300", name:"Ricochet Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ricochet",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Medium Oil", accent:"#0277bd",
    ballSlug:"columbia-300-ricochet-pearl", coreSlug:"columbia-300-ricochet-core",
    weightData:{
      16:{rg:2.540,diff:0.040}, 15:{rg:2.540,diff:0.042},
      14:{rg:2.560,diff:0.040}, 13:{rg:2.620,diff:0.034}, 12:{rg:2.680,diff:0.028}
    },
    releaseDate:"Nov 2024",
    colors:["orange","pearl"],
    description:"Pearl cover on Ricochet + Dynamicore — more explosive backend, sharp breakpoint for medium oil."
  },
  {
    id:136, brand:"Columbia 300", name:"Super Cuda PowerCOR Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Super Cuda PowerCOR",
    finish:"Factory Compound", condition:"Medium Oil", accent:"#0277bd",
    ballSlug:"columbia-300-super-cuda-powercor-pearl", coreSlug:"columbia-300-super-cuda-powercor-core",
    weightData:{
      16:{rg:2.540,diff:0.040}, 15:{rg:2.540,diff:0.042},
      14:{rg:2.560,diff:0.040}, 13:{rg:2.620,diff:0.034}, 12:{rg:2.680,diff:0.028}
    },
    releaseDate:"Feb 2026",
    colors:["blue","pearl","silver"],
    description:"Pearl cover on Super Cuda PowerCOR — faster, flashier and fiercer return of the Super Cuda lineup."
  },

  // ── Ebonite 추가 누락분 ───────────────────────────────────────
  {
    id:137, brand:"Ebonite", name:"Real Time",
    cover:"Solid", coreType:"Symmetric", coreName:"Big Time",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#4e342e",
    ballSlug:"ebonite-real-time", coreSlug:"ebonite-big-time-core",
    weightData:{
      16:{rg:2.520,diff:0.040}, 15:{rg:2.520,diff:0.042},
      14:{rg:2.540,diff:0.040}, 13:{rg:2.600,diff:0.034}, 12:{rg:2.660,diff:0.028}
    },
    releaseDate:"Nov 2024",
    colors:["teal","black"],
    description:"HK22 GB13.7 Solid on Big Time core — sharp backend move on medium conditions, standout value."
  },

  // ── Radical 추가 누락분 ───────────────────────────────────────
  {
    id:138, brand:"SWAG", name:"Judgement Hybrid",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Judgement",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-judgement-hybrid", coreSlug:"swag-judgement-core",
    weightData:{
      15:{rg:2.480,diff:0.052,moi:0.017},
      14:{rg:2.510,diff:0.050,moi:0.015}, 13:{rg:2.580,diff:0.044,moi:0.012}
    },
    releaseDate:"Feb 2026",
    colors:["red","black"],
    description:"SWAG Slayer AP26 Hybrid on Judgement asymmetric — one of six new AP26 launch balls for Feb 2026."
  },
  {
    id:139, brand:"SWAG", name:"Unreal Solid",
    cover:"Solid", coreType:"Asymmetric", coreName:"Unreal",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-unreal-solid", coreSlug:"swag-unreal-core",
    weightData:{
      15:{rg:2.480,diff:0.054,moi:0.017},
      14:{rg:2.510,diff:0.052,moi:0.015}, 13:{rg:2.580,diff:0.046,moi:0.012}
    },
    releaseDate:"Feb 2026",
    colors:["blue","black"],
    description:"SWAG Never Quit AP26 Solid on Unreal asymmetric core — maximum heavy oil performance with AP26 tech."
  },
  {
    id:140, brand:"SWAG", name:"Fusion Hybrid",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Fusion",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-fusion-hybrid", coreSlug:"swag-fusion-core",
    weightData:{
      15:{rg:2.540,diff:0.036},
      14:{rg:2.560,diff:0.034}, 13:{rg:2.620,diff:0.028}
    },
    releaseDate:"Aug 2025",
    colors:["orange","black"],
    description:"Serum Hybrid AP26 on Fusion symmetric core — benchmark versatility with 2.54 RG for lane transition."
  },

  // ── Track 추가 누락분 ─────────────────────────────────────────
  {
    id:141, brand:"Track", name:"I-Core Gen4",
    cover:"Solid", coreType:"Asymmetric", coreName:"I-Core Gen4",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Heavy Oil", accent:"#37474f",
    ballSlug:"track-i-core-gen4", coreSlug:"track-i-core-gen4-core",
    weightData:{
      16:{rg:2.480,diff:0.052,moi:0.017}, 15:{rg:2.480,diff:0.052,moi:0.017},
      14:{rg:2.510,diff:0.050,moi:0.015}, 13:{rg:2.580,diff:0.044,moi:0.012}
    },
    releaseDate:"Feb 2026",
    colors:["red","black"],
    description:"QR-12 Solid HK22C on I-Core Gen4 — Track's debut asymmetric Gen4 core for heavy oil tournament play."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.1 최종 누락분 — 3차 전수 검증
  // ══════════════════════════════════════════════════════════════

  // ── 900 Global ───────────────────────────────────────────────
  {
    id:142, brand:"900 Global", name:"Cove",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Magna A.I.",
    finish:"500/1000/1500 Siaair / Factory Compound", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-cove", coreSlug:"900-global-magna-ai-core",
    weightData:{16:{rg:2.480,diff:0.048},15:{rg:2.480,diff:0.048},14:{rg:2.510,diff:0.046},13:{rg:2.580,diff:0.040},12:{rg:2.640,diff:0.033}},
    releaseDate:"Aug 2025",
    colors:["teal","black"],
    description:"RB 85 Hybrid on Magna A.I. dual-hemisphere symmetric core — smooth, continuous motion on medium-heavy."
  },
  {
    id:143, brand:"900 Global", name:"Ember",
    cover:"Pearl", coreType:"Symmetric", coreName:"Magna A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-ember", coreSlug:"900-global-magna-ai-core",
    weightData:{16:{rg:2.480,diff:0.048},15:{rg:2.480,diff:0.048},14:{rg:2.510,diff:0.046},13:{rg:2.580,diff:0.040},12:{rg:2.640,diff:0.033}},
    releaseDate:"Aug 2025",
    colors:["red","orange","black"],
    description:"RB 82 Pearl on Magna A.I. — stronger backend Cove companion, angular pearl for medium conditions."
  },
  {
    id:144, brand:"900 Global", name:"Mach Cruise",
    cover:"Solid", coreType:"Symmetric", coreName:"Cruise",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-mach-cruise", coreSlug:"900-global-cruise-core",
    weightData:{16:{rg:2.560,diff:0.035},15:{rg:2.560,diff:0.035},14:{rg:2.580,diff:0.033},13:{rg:2.640,diff:0.028},12:{rg:2.700,diff:0.023}},
    releaseDate:"Jul 2025",
    colors:["red","black"],
    description:"Reserve Blend 93 Solid on Cruise symmetric core — overseas Mach Cruise for controlled medium-heavy oil."
  },
  {
    id:145, brand:"900 Global", name:"Honey Badger Black Edition",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-honey-badger-black-edition", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Jul 2025",
    colors:["black","orange"],
    description:"Reserve Blend 70E Hybrid on Grapnel 2.0 asymmetric — Black Edition HB for medium oil skid/flip shape."
  },
  {
    id:146, brand:"900 Global", name:"Reality Incursion",
    cover:"Solid", coreType:"Asymmetric", coreName:"Disturbance A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-reality-incursion", coreSlug:"900-global-disturbance-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.470,diff:0.056,moi:0.018},14:{rg:2.500,diff:0.054,moi:0.016},13:{rg:2.560,diff:0.048,moi:0.013},12:{rg:2.620,diff:0.041,moi:0.011}},
    releaseDate:"Sep 2025",
    colors:["silver","black"],
    description:"Reserve Blend 901 Solid on Disturbance A.I. — Reality's next chapter; lower RG, higher diff via A.I. outer core."
  },
  {
    id:147, brand:"900 Global", name:"Remaster Honey Badger",
    cover:"Solid", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-remaster-honey-badger", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Jan 2026",
    colors:["orange","black"],
    description:"Reserve Blend 70D Solid on Grapnel 2.0 — Remaster Honey Badger solid for medium-heavy oil dominance."
  },
  {
    id:148, brand:"900 Global", name:"Origin EX",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Ellipse A.I.",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-origin-ex", coreSlug:"900-global-ellipse-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.480,diff:0.054,moi:0.017},14:{rg:2.510,diff:0.052,moi:0.015},13:{rg:2.570,diff:0.046,moi:0.012},12:{rg:2.630,diff:0.039,moi:0.010}},
    releaseDate:"Oct 2025",
    colors:["blue","black"],
    description:"Quantum Pearl on Ellipse A.I. — Origin's pearl companion with angular backend and same dual-precession power."
  },
  {
    id:149, brand:"900 Global", name:"Rev Matrix",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Matrix",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-rev-matrix", coreSlug:"900-global-matrix-core",
    weightData:{16:{rg:2.490,diff:0.048,moi:0.014},15:{rg:2.490,diff:0.048,moi:0.014},14:{rg:2.520,diff:0.046,moi:0.012},13:{rg:2.580,diff:0.040,moi:0.009},12:{rg:2.640,diff:0.033,moi:0.007}},
    releaseDate:"Oct 2025",
    colors:["blue","silver"],
    description:"S86R Pearl on Matrix flip-block asymmetric core — overseas, designed by PWBA pro Daria Payonk for medium oil."
  },
  {
    id:150, brand:"900 Global", name:"Duty Majesty",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Duty",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-duty-majesty", coreSlug:"900-global-duty-core",
    weightData:{16:{rg:2.540,diff:0.038},15:{rg:2.540,diff:0.038},14:{rg:2.560,diff:0.036},13:{rg:2.620,diff:0.030},12:{rg:2.680,diff:0.024}},
    releaseDate:"Feb 2025",
    colors:["purple","gold"],
    description:"Reserve Blend 902 Hybrid on Duty symmetric core — overseas controlled motion for medium lane conditions."
  },
  {
    id:151, brand:"900 Global", name:"Honey Badger Blameless",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"3000 Abralon", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-honey-badger-blameless", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Feb 2025",
    colors:["orange","white"],
    description:"Reserve Blend 701 Pearl on Grapnel 2.0 — overseas Blameless, angular Honey Badger for light-medium oil."
  },

  // ── Motiv ─────────────────────────────────────────────────────
  {
    id:152, brand:"Motiv", name:"Jackal ExJ",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Predator V2",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-jackal-exj", coreSlug:"motiv-predator-v2-core",
    weightData:{16:{rg:2.570,diff:0.056,moi:0.020},15:{rg:2.570,diff:0.056,moi:0.020},14:{rg:2.600,diff:0.053,moi:0.017},13:{rg:2.660,diff:0.048,moi:0.014},12:{rg:2.720,diff:0.041,moi:0.012}},
    releaseDate:"Jan 2026",
    colors:["black","orange","gold"],
    description:"Propulsion HVH Hybrid on Predator V2 — first hybrid Jackal in 3+ years, slots between Jackal Ghost and Crimson Jackal."
  },
  {
    id:153, brand:"Motiv", name:"Subzero Forge",
    cover:"Solid", coreType:"Symmetric", coreName:"Detonator",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-subzero-forge", coreSlug:"motiv-detonator-core",
    weightData:{16:{rg:2.470,diff:0.052},15:{rg:2.470,diff:0.052},14:{rg:2.500,diff:0.050},13:{rg:2.560,diff:0.044},12:{rg:2.620,diff:0.037}},
    releaseDate:"Sep 2025",
    colors:["teal","black"],
    description:"Leverage MXC Solid + Duramax on Detonator symmetric — ice-cold heavy oil force, strong early read with continuous motion."
  },
  {
    id:154, brand:"Motiv", name:"Max Thrill Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Halogen V2",
    finish:"5500 LSP", condition:"Light-Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-max-thrill-pearl", coreSlug:"motiv-halogen-v2-core",
    weightData:{16:{rg:2.600,diff:0.035},15:{rg:2.600,diff:0.035},14:{rg:2.620,diff:0.033},13:{rg:2.680,diff:0.028},12:{rg:2.740,diff:0.022}},
    releaseDate:"Sep 2025",
    colors:["pink","pearl","black"],
    description:"Turmoil XP3 Pearl on Halogen V2 — more angular and cleaner than Top Thrill Pearl, serious dry-lane explosion."
  },

  // ── SWAG ──────────────────────────────────────────────────────
  {
    id:155, brand:"SWAG", name:"Craze Tour Solid",
    cover:"Solid", coreType:"Symmetric", coreName:"Craze",
    finish:"3000 Abralon", condition:"Medium-Heavy Oil", accent:"#1a237e",
    ballSlug:"swag-craze-tour-solid", coreSlug:"swag-craze-core",
    weightData:{15:{rg:2.540,diff:0.036},14:{rg:2.560,diff:0.034},13:{rg:2.620,diff:0.028}},
    releaseDate:"Feb 2026",
    colors:["purple","black"],
    description:"SWAG Rage Solid AP26 on Craze symmetric core — solid companion to Craze Tour Pearl with more oil traction."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.2 누락분 4차 추가 — 전수 재검증 (페이지네이션 포함)
  // ══════════════════════════════════════════════════════════════

  // ── Storm 추가 누락분 (bowwwl p1~2 대조) ──────────────────────
  {
    id:156, brand:"Storm", name:"Hy-Road 40",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road-40", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.570,diff:0.044},13:{rg:2.630,diff:0.038},12:{rg:2.690,diff:0.031}},
    releaseDate:"Jun 2025",
    colors:["red","orange","black"],
    description:"A1S Pearl on Inverted Fe2 — 40th anniversary HyRoad, clean through the fronts with predictable angular backend."
  },
  {
    id:157, brand:"Storm", name:"!Q Spear",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-spear", coreSlug:"storm-c3-centripetal-ai-core",
    weightData:{16:{rg:2.550,diff:0.045},15:{rg:2.550,diff:0.045},14:{rg:2.550,diff:0.043},13:{rg:2.620,diff:0.037},12:{rg:2.680,diff:0.030}},
    releaseDate:"Jan 2026",
    colors:["red","black"],
    description:"R2S Solid on C3 Centripetal A.I. — ultimate control and workability at the breakpoint, A.I. enhanced energy transfer."
  },
  {
    id:158, brand:"Storm", name:"Motor 30",
    cover:"Pearl", coreType:"Symmetric", coreName:"Torsion A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-motor-30", coreSlug:"storm-torsion-ai-core",
    weightData:{16:{rg:2.490,diff:0.048},15:{rg:2.490,diff:0.048},14:{rg:2.520,diff:0.046},13:{rg:2.590,diff:0.040},12:{rg:2.650,diff:0.033}},
    releaseDate:"Feb 2026",
    colors:["orange","black"],
    description:"RX Pro Pearl on Torsion A.I. — Motor line's 30th anniversary limited edition with explosive rev-up motion."
  },
  {
    id:159, brand:"Storm", name:"IDentity B-C-P",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"3000 Abralon", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-identity-bcp", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Jan 2026",
    colors:["blue","teal","purple"],
    description:"Hybrid cover on Ignition A.I. — B-C-P (Blue/Crimson/Purple) colorway IDentity, versatile medium oil performer."
  },
  {
    id:160, brand:"Storm", name:"Grand Gate",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-grand-gate", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Mar 2025",
    colors:["red","gold"],
    description:"A1S Pearl on Ignition A.I. — Gate series' premium pearl for clean skid with sharp angular backend reaction."
  },
  {
    id:161, brand:"Storm", name:"Star Gate",
    cover:"Solid", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-star-gate", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Oct 2024",
    colors:["blue","silver"],
    description:"Hybrid cover on Ignition A.I. — Star Gate's blueberry-scented aggressive solid Gate series entry."
  },
  {
    id:162, brand:"Storm", name:"Marvel Flame",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-marvel-flame", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{16:{rg:2.460,diff:0.056},15:{rg:2.460,diff:0.056},14:{rg:2.460,diff:0.056},13:{rg:2.590,diff:0.045},12:{rg:2.650,diff:0.035}},
    releaseDate:"Feb 2025",
    colors:["red","orange","gold"],
    description:"EXO Solid on Centripetal HD A.I. — 3rd Marvel A.I. series, stable arc with high scoreability on medium-heavy."
  },
  {
    id:163, brand:"Storm", name:"Code Impact",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"RAD4",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-impact", coreSlug:"storm-rad4-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.020},15:{rg:2.470,diff:0.057,moi:0.020},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Sep 2025",
    colors:["green","black"],
    description:"NeX Hybrid on RAD4 — the Code series' heaviest hitter, highest diff in the Premier line for maximum heavy oil."
  },
  {
    id:164, brand:"Storm", name:"Summit World",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-summit-world", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{16:{rg:2.460,diff:0.056},15:{rg:2.460,diff:0.056},14:{rg:2.460,diff:0.056},13:{rg:2.590,diff:0.045},12:{rg:2.650,diff:0.035}},
    releaseDate:"Jul 2025",
    colors:["green","blue","black"],
    description:"R2S Solid on Centripetal HD A.I. — overseas Summit World, strong continuous roll on medium-heavy oil."
  },
  {
    id:165, brand:"Storm", name:"Wild Absolute",
    cover:"Solid", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-wild-absolute", coreSlug:"storm-sentinel-core",
    weightData:{16:{rg:2.470,diff:0.053,moi:0.018},15:{rg:2.470,diff:0.052,moi:0.018},14:{rg:2.510,diff:0.049,moi:0.016},13:{rg:2.580,diff:0.043,moi:0.013},12:{rg:2.640,diff:0.036,moi:0.011}},
    releaseDate:"Dec 2024",
    colors:["purple","gold","black"],
    description:"NeX Solid on Sentinel — overseas Wild Absolute, stable power axis movement for continuous heavy oil dominance."
  },
  {
    id:166, brand:"Storm", name:"DNA Strand",
    cover:"Solid", coreType:"Asymmetric", coreName:"G2",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-dna-strand", coreSlug:"storm-g2-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Mar 2025",
    colors:["blue","silver","black"],
    description:"NeX Solid on G2 asymmetric — stronger midlane read than DNA Coil II, 11% more entry angle vs NRG cover."
  },
  {
    id:167, brand:"Storm", name:"Bite Panic A.I.",
    cover:"Pearl", coreType:"Asymmetric", coreName:"G2 A.I.",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-bite-panic-ai", coreSlug:"storm-g2-ai-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Jan 2025",
    colors:["red","orange","black"],
    description:"EXO Pearl on G2 A.I. — overseas Bite Panic A.I., improved oil-resistance front and boosted backend power."
  },
  {
    id:168, brand:"Storm", name:"Bite Panic X",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"G2",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-bite-panic-x", coreSlug:"storm-g2-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Jun 2024",
    colors:["blue","black"],
    description:"EXO Hybrid on G2 — overseas Bite Panic X, fine flare pattern with astonishing pin action on heavy oil."
  },
  {
    id:169, brand:"Storm", name:"PhysiX Power Elite IV",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-power-elite-iv", coreSlug:"storm-atomic-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.470,diff:0.055,moi:0.018},14:{rg:2.520,diff:0.054,moi:0.016},13:{rg:2.580,diff:0.047,moi:0.013},12:{rg:2.640,diff:0.040,moi:0.011}},
    releaseDate:"Oct 2024",
    colors:["blue","silver"],
    description:"R2S Solid on Atomic A.I. — PhysiX Power Elite IV, overseas limited release for maximum heavy oil performance."
  },
  {
    id:170, brand:"Storm", name:"Blue !Q",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-blue-iq", coreSlug:"storm-c3-centripetal-ai-core",
    weightData:{16:{rg:2.550,diff:0.045},15:{rg:2.550,diff:0.045},14:{rg:2.550,diff:0.043},13:{rg:2.620,diff:0.037},12:{rg:2.680,diff:0.030}},
    releaseDate:"Jun 2025",
    colors:["blue","black"],
    description:"R2S Solid on C3 A.I. — Blue !Q celebrating the iconic IQ lineage with A.I. enhanced control motion."
  },
  {
    id:171, brand:"Storm", name:"!Q Super G",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-super-g", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.550,diff:0.040},15:{rg:2.550,diff:0.040},14:{rg:2.550,diff:0.038},13:{rg:2.620,diff:0.032},12:{rg:2.680,diff:0.026}},
    releaseDate:"Aug 2024",
    colors:["purple","black"],
    description:"R2S Solid on C3 Centripetal — overseas !Q Super G, tuned for smooth mid-lane transition and predictable arc."
  },

  // ── Brunswick 추가 누락분 ──────────────────────────────────────
  {
    id:172, brand:"Brunswick", name:"Danger Zone Purple Ice",
    cover:"Solid", coreType:"Symmetric", coreName:"Twist",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium-Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-danger-zone-purple-ice", coreSlug:"brunswick-twist-core",
    weightData:{16:{rg:2.510,diff:0.040},15:{rg:2.500,diff:0.042},14:{rg:2.530,diff:0.040},13:{rg:2.600,diff:0.034},12:{rg:2.660,diff:0.028}},
    releaseDate:"Feb 2026",
    colors:["purple","blue","black"],
    description:"QR-12 Solid on Twist symmetric — Danger Zone Purple Ice colorway, same spec as the black version."
  },
  {
    id:173, brand:"Brunswick", name:"Melee Jab Void Black",
    cover:"Solid", coreType:"Symmetric", coreName:"Melee",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-melee-jab-void-black", coreSlug:"brunswick-melee-core",
    weightData:{16:{rg:2.560,diff:0.030},15:{rg:2.560,diff:0.032},14:{rg:2.580,diff:0.030},13:{rg:2.640,diff:0.025},12:{rg:2.700,diff:0.020}},
    releaseDate:"Nov 2025",
    colors:["black","silver"],
    description:"Reactive Solid on Melee symmetric — Void Black colorway Melee Jab, entry-level medium oil performance."
  },
  {
    id:174, brand:"Brunswick", name:"Vapor Zone Red",
    cover:"Pearl", coreType:"Symmetric", coreName:"Vapor",
    finish:"Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-vapor-zone-red", coreSlug:"brunswick-vapor-core",
    weightData:{16:{rg:2.560,diff:0.032},15:{rg:2.560,diff:0.034},14:{rg:2.580,diff:0.032},13:{rg:2.640,diff:0.027},12:{rg:2.700,diff:0.022}},
    releaseDate:"Dec 2025",
    colors:["red","black"],
    description:"Pearl cover on Vapor symmetric core — Vapor Zone Red, polished entry-level ball for medium oil conditions."
  },

  // ══════════════════════════════════════════════════════════════
  // v7.3 — 5차 전수검증: 중복 22개 제거 + 실제 누락 3개 추가
  // ══════════════════════════════════════════════════════════════
  {
    id:175, brand:"Hammer", name:"Special Effect",
    cover:"Solid", coreType:"Asymmetric", coreName:"Huntsman",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium-Heavy Oil", accent:"#d84315",
    ballSlug:"hammer-special-effect", coreSlug:"hammer-huntsman-core",
    weightData:{16:{rg:2.483,diff:0.043,moi:0.015},15:{rg:2.470,diff:0.050,moi:0.017},14:{rg:2.495,diff:0.050,moi:0.016},13:{rg:2.597,diff:0.041,moi:0.014},12:{rg:2.593,diff:0.041,moi:0.014}},
    releaseDate:"Mar 2025",
    colors:["purple","black","silver"],
    description:"HK22C Cohesion Solid on Huntsman asymmetric — follow-up to the Effect, slightly earlier read for medium-heavy oil with the same signature Huntsman power."
  },
  {
    id:176, brand:"Hammer", name:"Black Widow Mania",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#d84315",
    ballSlug:"hammer-black-widow-mania", coreSlug:"hammer-gas-mask-core",
    weightData:{16:{rg:2.510,diff:0.048,moi:0.015},15:{rg:2.500,diff:0.058,moi:0.016},14:{rg:2.500,diff:0.056,moi:0.016},13:{rg:2.589,diff:0.043,moi:0.011},12:{rg:2.612,diff:0.043,moi:0.011}},
    releaseDate:"Jan 2025",
    colors:["black","orange","gold"],
    description:"HK22C Cohesion Pearl on Gas Mask — longer and sharper than BW 2.0 Hybrid, perfect medium oil follow-up in the legendary Black Widow lineage."
  },
  {
    id:177, brand:"Motiv", name:"Primal Ghost",
    cover:"Solid", coreType:"Symmetric", coreName:"Impulse V2",
    finish:"3000 LSS", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"motiv-primal-ghost", coreSlug:"motiv-impulse-v2-core",
    weightData:{16:{rg:2.540,diff:0.049},15:{rg:2.550,diff:0.050},14:{rg:2.560,diff:0.054},13:{rg:2.600,diff:0.055},12:{rg:2.670,diff:0.040}},
    releaseDate:"Sep 2025",
    colors:["white","silver","pearl"],
    description:"Coercion HFS Solid on Impulse V2 symmetric — fusion of Jackal Ghost's legendary cover with Primal Rage's proven core, smooth and strong medium oil performer."
  },

  // ── Motiv 누락 ────────────────────────────────────────────────
  {
    id:178, brand:"Motiv", name:"Evoke",
    cover:"Solid", coreType:"Asymmetric", coreName:"Overload",
    finish:"2000 Siaair", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-evoke", coreSlug:"motiv-overload-core",
    weightData:{16:{rg:2.480,diff:0.050,moi:0.017},15:{rg:2.480,diff:0.050,moi:0.017},14:{rg:2.510,diff:0.047,moi:0.015},13:{rg:2.580,diff:0.042,moi:0.012},12:{rg:2.640,diff:0.035,moi:0.010}},
    releaseDate:"Feb 2024",
    colors:["purple","black"],
    description:"Leverage MXC Solid on Overload asymmetric — tunable differential, smooth heavy oil benchmark control."
  },
  {
    id:179, brand:"Motiv", name:"Evoke Hysteria",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Overload",
    finish:"4000 LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-evoke-hysteria", coreSlug:"motiv-overload-core",
    weightData:{16:{rg:2.480,diff:0.050,moi:0.017},15:{rg:2.480,diff:0.050,moi:0.017},14:{rg:2.510,diff:0.047,moi:0.015},13:{rg:2.580,diff:0.042,moi:0.012},12:{rg:2.640,diff:0.035,moi:0.010}},
    releaseDate:"Mar 2025",
    colors:["red","black","orange"],
    description:"Propulsion MXV Pearl on Overload — angular backend with tunable differential, devastatingly controllable entry angle."
  },

  // ── Columbia 300 누락 ─────────────────────────────────────────
  {
    id:180, brand:"Columbia 300", name:"Ricochet Return",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Ricochet",
    finish:"Factory Polish", condition:"Medium Oil", accent:"#0277bd",
    ballSlug:"columbia-300-ricochet-return", coreSlug:"columbia-300-ricochet-core",
    weightData:{16:{rg:2.502,diff:0.047},15:{rg:2.488,diff:0.054},14:{rg:2.535,diff:0.054},13:{rg:2.600,diff:0.048},12:{rg:2.660,diff:0.040}},
    releaseDate:"Jan 2025",
    colors:["orange","black"],
    description:"HK22C Micro Flex Hybrid on Ricochet core — skid/flip hybrid companion to the original pearl, versatile medium oil option."
  },
  {
    id:181, brand:"Columbia 300", name:"Pulse",
    cover:"Solid", coreType:"Symmetric", coreName:"Pulse PowerCOR",
    finish:"500/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"columbia-300-pulse", coreSlug:"columbia-300-pulse-powercor-core",
    weightData:{16:{rg:2.481,diff:0.039},15:{rg:2.468,diff:0.045},14:{rg:2.481,diff:0.039},13:{rg:2.550,diff:0.034},12:{rg:2.610,diff:0.028}},
    releaseDate:"Aug 2025",
    colors:["purple","black"],
    description:"HK22 Hyperflex Solid on Pulse PowerCOR — ultra-low RG with predictable continuous roll, the classic Pulse reimagined."
  },

  // ── Radical 누락 ──────────────────────────────────────────────
  {
    id:182, brand:"Radical", name:"Intel Recon",
    cover:"Pearl", coreType:"Symmetric", coreName:"Intel Recon",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#d32f2f",
    ballSlug:"radical-intel-recon", coreSlug:"radical-intel-recon-core",
    weightData:{16:{rg:2.483,diff:0.032},15:{rg:2.483,diff:0.032},14:{rg:2.500,diff:0.030},13:{rg:2.570,diff:0.026},12:{rg:2.630,diff:0.022}},
    releaseDate:"Oct 2025",
    colors:["green","black"],
    description:"HK22 Pearl on Intel Recon core — replicates the beloved original Intel motion with modern chemistry."
  },

  // ── Roto Grip 누락 ────────────────────────────────────────────
  {
    id:183, brand:"Roto Grip", name:"Attention Edge",
    cover:"Solid", coreType:"Asymmetric", coreName:"Attention",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-attention-edge", coreSlug:"roto-grip-attention-core",
    weightData:{16:{rg:2.470,diff:0.052,moi:0.018},15:{rg:2.470,diff:0.052,moi:0.018},14:{rg:2.500,diff:0.049,moi:0.016},13:{rg:2.570,diff:0.044,moi:0.013},12:{rg:2.630,diff:0.037,moi:0.011}},
    releaseDate:"Aug 2025",
    colors:["orange","black"],
    description:"MXC Solid on Attention asymmetric — heavy oil workhorse with strong midlane read and predictable continuation."
  },
  {
    id:184, brand:"Roto Grip", name:"Hyped Super Pearl II",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hyped",
    finish:"Power Edge", condition:"Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hyped-super-pearl-ii", coreSlug:"roto-grip-hyped-core",
    weightData:{16:{rg:2.560,diff:0.036},15:{rg:2.560,diff:0.036},14:{rg:2.580,diff:0.034},13:{rg:2.640,diff:0.029},12:{rg:2.700,diff:0.024}},
    releaseDate:"Nov 2025",
    colors:["pink","pearl","white"],
    description:"HK22 Pearl on Hyped symmetric — clean through the fronts with angular backend flip, ideal for medium and sport patterns."
  },
  {
    id:185, brand:"Roto Grip", name:"Gremlin",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Gremlin",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-gremlin", coreSlug:"roto-grip-gremlin-core",
    weightData:{16:{rg:2.500,diff:0.058,moi:0.019},15:{rg:2.500,diff:0.058,moi:0.019},14:{rg:2.530,diff:0.055,moi:0.017},13:{rg:2.600,diff:0.049,moi:0.014},12:{rg:2.660,diff:0.042,moi:0.012}},
    releaseDate:"Jul 2025",
    colors:["green","black","orange"],
    description:"EXO Pearl on Gremlin asymmetric — high differential mischief maker with explosive backend motion on heavier conditions."
  },
  {
    id:186, brand:"Roto Grip", name:"Exit Red",
    cover:"Solid", coreType:"Symmetric", coreName:"Exit",
    finish:"500/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-exit-red", coreSlug:"roto-grip-exit-core",
    weightData:{16:{rg:2.510,diff:0.040},15:{rg:2.510,diff:0.040},14:{rg:2.540,diff:0.038},13:{rg:2.610,diff:0.033},12:{rg:2.670,diff:0.027}},
    releaseDate:"Apr 2025",
    colors:["red","black"],
    description:"R2S Solid on Exit symmetric — red colorway Exit, strong continuous arc for medium-heavy conditions."
  },
  {
    id:187, brand:"Roto Grip", name:"Hustle Teal/Black",
    cover:"Solid", coreType:"Symmetric", coreName:"Hustle",
    finish:"Crown Factory Compound", condition:"Light-Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hustle-tealblack", coreSlug:"roto-grip-hustle-core",
    weightData:{16:{rg:2.580,diff:0.028},15:{rg:2.580,diff:0.028},14:{rg:2.600,diff:0.026},13:{rg:2.660,diff:0.022},12:{rg:2.720,diff:0.018}},
    releaseDate:"Feb 2025",
    colors:["teal","black"],
    description:"Reactive Solid on Hustle symmetric — Teal/Black colorway entry-level performer for lighter oil conditions."
  },

  // ══════════════════════════════════════════════════════════════
  // 역대 인기/판매 상위 클래식 볼 추가 (연도 무관 베스트셀러)
  // ══════════════════════════════════════════════════════════════

  // ── Storm 역대 인기 ───────────────────────────────────────────
  {
    id:188, brand:"Storm", name:"Phaze II",
    cover:"Solid", coreType:"Symmetric", coreName:"Velocity",
    finish:"500/2000 Siaair", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-phaze-ii", coreSlug:"storm-velocity-core",
    weightData:{16:{rg:2.480,diff:0.052},15:{rg:2.480,diff:0.052},14:{rg:2.510,diff:0.050},13:{rg:2.580,diff:0.044},12:{rg:2.640,diff:0.037}},
    releaseDate:"Aug 2018",
    colors:["blue","red","purple"],
    description:"R2S Solid on Velocity — 역대 가장 많이 팔린 스톰 볼 중 하나. 강한 미드레인 반응과 연속적인 백엔드, 전 세계 볼링선수들의 베이스볼."
  },
  {
    id:189, brand:"Storm", name:"Phaze III",
    cover:"Pearl", coreType:"Symmetric", coreName:"Velocity",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-phaze-iii", coreSlug:"storm-velocity-core",
    weightData:{16:{rg:2.480,diff:0.052},15:{rg:2.480,diff:0.052},14:{rg:2.510,diff:0.050},13:{rg:2.580,diff:0.044},12:{rg:2.640,diff:0.037}},
    releaseDate:"Jun 2020",
    colors:["red","orange","gold"],
    description:"R2S Pearl on Velocity — Phaze II의 펄 버전. 깔끔한 프론트와 날카로운 백엔드 앵글로 미디엄 오일에서 폭발적인 인기."
  },
  {
    id:190, brand:"Storm", name:"IQ Tour",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.570,diff:0.034},15:{rg:2.570,diff:0.034},14:{rg:2.590,diff:0.032},13:{rg:2.650,diff:0.027},12:{rg:2.710,diff:0.022}},
    releaseDate:"Jan 2015",
    colors:["blue","silver"],
    description:"R2S Solid on C3 Centripetal — 가장 오래 판매된 컨트롤 볼. 투어 선수들의 필수 아이템으로 10년 이상 베스트셀러 유지."
  },
  {
    id:191, brand:"Storm", name:"IQ Tour Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour-pearl", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.570,diff:0.034},15:{rg:2.570,diff:0.034},14:{rg:2.590,diff:0.032},13:{rg:2.650,diff:0.027},12:{rg:2.710,diff:0.022}},
    releaseDate:"Mar 2016",
    colors:["blue","silver","pearl"],
    description:"R2S Pearl on C3 Centripetal — IQ Tour의 펄 버전. 긴 활주와 예측 가능한 각도로 아마추어~프로까지 폭넓은 사랑."
  },
  {
    id:192, brand:"Storm", name:"Hy-Road",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Compound", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.590,diff:0.044},13:{rg:2.650,diff:0.038},12:{rg:2.710,diff:0.031}},
    releaseDate:"Jan 2010",
    colors:["red","black"],
    description:"A1S Pearl on Inverted Fe2 — 스톰 역사상 가장 상징적인 볼. 15년 이상 꾸준히 팔리는 레전드. 볼 입문자의 첫 고성능볼로 전 세계 1위."
  },
  {
    id:193, brand:"Storm", name:"Hy-Road Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road-pearl", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.590,diff:0.044},13:{rg:2.650,diff:0.038},12:{rg:2.710,diff:0.031}},
    releaseDate:"Jun 2014",
    colors:["red","pearl","white"],
    description:"Pearl cover on Inverted Fe2 — HyRoad 패밀리의 펄 버전. 더 긴 활주와 선명한 앵글. 역대 스톰 판매 Top 5 안에 드는 볼."
  },
  {
    id:194, brand:"Storm", name:"Code Red",
    cover:"Solid", coreType:"Asymmetric", coreName:"RAD-X",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-red", coreSlug:"storm-rad-x-core",
    weightData:{16:{rg:2.480,diff:0.053,moi:0.017},15:{rg:2.480,diff:0.052,moi:0.017},14:{rg:2.510,diff:0.049,moi:0.015},13:{rg:2.580,diff:0.044,moi:0.012},12:{rg:2.640,diff:0.037,moi:0.010}},
    releaseDate:"Sep 2021",
    colors:["red","black"],
    description:"NeX Solid on RAD-X — Code 시리즈의 역대 최고 판매작. 어시머트릭 고성능 헤비오일 볼로 투어 선수들 압도적 선택."
  },
  {
    id:195, brand:"Storm", name:"Marvel Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-marvel-pearl", coreSlug:"storm-centripetal-hd-core",
    weightData:{16:{rg:2.460,diff:0.054},15:{rg:2.460,diff:0.054},14:{rg:2.490,diff:0.052},13:{rg:2.560,diff:0.046},12:{rg:2.620,diff:0.039}},
    releaseDate:"Nov 2019",
    colors:["purple","pearl","silver"],
    description:"EXO Pearl on Centripetal HD — 출시 즉시 연간 판매 1위. 낮은 RG와 강한 DIFF의 조합으로 2019~2020 시즌 투어를 지배한 볼."
  },

  // ── Hammer 역대 인기 ──────────────────────────────────────────
  {
    id:196, brand:"Hammer", name:"Black Widow 2.0",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"hammer-black-widow-20", coreSlug:"hammer-gas-mask-core",
    weightData:{16:{rg:2.480,diff:0.058,moi:0.017},15:{rg:2.481,diff:0.058,moi:0.017},14:{rg:2.500,diff:0.054,moi:0.015},13:{rg:2.570,diff:0.048,moi:0.012},12:{rg:2.630,diff:0.041,moi:0.010}},
    releaseDate:"Sep 2018",
    colors:["black","red"],
    description:"HK22 Hybrid on Gas Mask — 블랙위도우 시리즈의 역대 판매 1위. 헤비~미디엄헤비 전천후 활약, 전 세계 볼링인의 사랑을 받은 레전드."
  },
  {
    id:197, brand:"Hammer", name:"Purple Pearl Urethane",
    cover:"Urethane", coreType:"Symmetric", coreName:"Offset",
    finish:"Rough Buff", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-purple-pearl-urethane", coreSlug:"hammer-offset-core",
    weightData:{16:{rg:2.600,diff:0.020},15:{rg:2.600,diff:0.020},14:{rg:2.620,diff:0.018},13:{rg:2.680,diff:0.015},12:{rg:2.740,diff:0.012}},
    releaseDate:"Jan 2017",
    colors:["purple","pearl"],
    description:"Urethane cover on Offset — 역대 가장 많이 팔린 우레탄 볼. 드라이~쇼트 패턴의 절대 강자, PBA 투어에서도 꾸준히 사용되는 영원한 베스트셀러."
  },
  {
    id:198, brand:"Hammer", name:"Vibe",
    cover:"Solid", coreType:"Symmetric", coreName:"Vibe",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-vibe", coreSlug:"hammer-vibe-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Mar 2019",
    colors:["blue","silver"],
    description:"Reactive Solid on Vibe symmetric — 엔트리~미드 퍼포먼스 역대 판매 1위. 가성비 최강으로 입문자들이 가장 많이 선택하는 볼."
  },
  {
    id:199, brand:"Hammer", name:"Bubblegum Vibe",
    cover:"Solid", coreType:"Symmetric", coreName:"Vibe",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-bubblegum-vibe", coreSlug:"hammer-vibe-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Sep 2021",
    colors:["pink","white","pearl"],
    description:"Reactive Solid on Vibe — 핑크/블루 버블껌 컬러로 입문자 최고 인기. 친근한 디자인과 탁월한 가성비로 볼링 입문 1위 추천볼."
  },

  // ── Motiv 역대 인기 ───────────────────────────────────────────
  {
    id:200, brand:"Motiv", name:"Venom Shock",
    cover:"Pearl", coreType:"Symmetric", coreName:"Sigma V2",
    finish:"4000 LSS", condition:"Medium Oil", accent:"#7b1fa2",
    ballSlug:"motiv-venom-shock", coreSlug:"motiv-sigma-v2-core",
    weightData:{16:{rg:2.490,diff:0.044},15:{rg:2.490,diff:0.044},14:{rg:2.520,diff:0.042},13:{rg:2.590,diff:0.037},12:{rg:2.650,diff:0.030}},
    releaseDate:"Mar 2020",
    colors:["blue","orange","black"],
    description:"Turmoil MFS Pearl on Sigma V2 — 모티브 역대 최고 판매 볼 중 하나. 강한 미드레인과 연속적인 백엔드로 리그~투어까지 압도적 사랑."
  },
  {
    id:201, brand:"Motiv", name:"Venom EXJ",
    cover:"Solid", coreType:"Symmetric", coreName:"Gear",
    finish:"2000 Siaair", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-venom-exj", coreSlug:"motiv-gear-core",
    weightData:{16:{rg:2.480,diff:0.038},15:{rg:2.480,diff:0.038},14:{rg:2.510,diff:0.036},13:{rg:2.580,diff:0.031},12:{rg:2.640,diff:0.025}},
    releaseDate:"Jun 2024",
    colors:["purple","orange","black"],
    description:"Coercion HFS Solid on Gear — EJ Tackett 시그니처. 낮은 RG 벤치마크 볼로 2024 베스트셀러. 안정적이고 예측 가능한 미드레인 반응."
  },
  {
    id:202, brand:"Motiv", name:"Forge Fire",
    cover:"Solid", coreType:"Symmetric", coreName:"Impulse V2",
    finish:"3000 Grit LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-forge-fire", coreSlug:"motiv-impulse-v2-core",
    weightData:{16:{rg:2.530,diff:0.051},15:{rg:2.540,diff:0.050},14:{rg:2.550,diff:0.049},13:{rg:2.600,diff:0.041},12:{rg:2.650,diff:0.035}},
    releaseDate:"Sep 2022",
    colors:["red","orange","black"],
    description:"Coercion MXC Solid on Impulse V2 — 역대 모티브 스트레이트 셀러. 강한 미드레인 반응과 내구성으로 리그볼러들의 절대적 신뢰."
  },
  {
    id:203, brand:"Motiv", name:"Trident Odyssey",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Trident",
    finish:"4000 LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-trident-odyssey", coreSlug:"motiv-trident-core",
    weightData:{16:{rg:2.480,diff:0.053,moi:0.018},15:{rg:2.490,diff:0.052,moi:0.018},14:{rg:2.510,diff:0.049,moi:0.016},13:{rg:2.580,diff:0.044,moi:0.013},12:{rg:2.640,diff:0.037,moi:0.011}},
    releaseDate:"Jan 2022",
    colors:["blue","teal","black"],
    description:"Propulsion MXV Pearl on Trident — 역대 모티브 어시머트릭 판매 1위. Jackal과 함께 모티브의 양대 산맥, 긴 활주와 폭발적 각도."
  },

  // ── Brunswick 역대 인기 ───────────────────────────────────────
  {
    id:204, brand:"Brunswick", name:"Kingpin Max",
    cover:"Solid", coreType:"Asymmetric", coreName:"ECA-XR",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#e65100",
    ballSlug:"brunswick-kingpin-max", coreSlug:"brunswick-eca-xr-core",
    weightData:{16:{rg:2.470,diff:0.054,moi:0.018},15:{rg:2.470,diff:0.053,moi:0.018},14:{rg:2.500,diff:0.050,moi:0.016},13:{rg:2.570,diff:0.045,moi:0.013},12:{rg:2.630,diff:0.038,moi:0.011}},
    releaseDate:"Mar 2022",
    colors:["black","gold"],
    description:"ECA-XR Solid on ECA-XR — 브런즈윅 헤비오일 역대 판매 1위. 강한 훅과 놀라운 핀 액션으로 2022~2023 투어 지배."
  },
  {
    id:205, brand:"Brunswick", name:"Rhino",
    cover:"Solid", coreType:"Symmetric", coreName:"Rhino",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-rhino", coreSlug:"brunswick-rhino-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Jan 2016",
    colors:["blue","black"],
    description:"Reactive Solid on Rhino symmetric — 브런즈윅 역대 최고 판매 입문볼. 수십 년간 꾸준히 팔리는 브런즈윅의 아이콘."
  },

  // ── Roto Grip 역대 인기 ───────────────────────────────────────
  {
    id:206, brand:"Roto Grip", name:"Hype-E",
    cover:"Pearl", coreType:"Symmetric", coreName:"Nucleus",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hype-e", coreSlug:"roto-grip-nucleus-core",
    weightData:{16:{rg:2.550,diff:0.038},15:{rg:2.550,diff:0.038},14:{rg:2.570,diff:0.036},13:{rg:2.630,diff:0.031},12:{rg:2.690,diff:0.025}},
    releaseDate:"Apr 2022",
    colors:["red","orange","black"],
    description:"EXO Pearl on Nucleus — 로토그립 역대 미드퍼포먼스 최고 판매작. 깔끔한 활주와 예측 가능한 백엔드로 2022~2023 리그 1위."
  },
  {
    id:207, brand:"Roto Grip", name:"UFO Alert",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Nucleus V2",
    finish:"Power Edge Polish", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-ufo-alert", coreSlug:"roto-grip-nucleus-v2-core",
    weightData:{16:{rg:2.490,diff:0.052,moi:0.018},15:{rg:2.490,diff:0.052,moi:0.018},14:{rg:2.520,diff:0.049,moi:0.016},13:{rg:2.590,diff:0.044,moi:0.013},12:{rg:2.650,diff:0.037,moi:0.011}},
    releaseDate:"Aug 2021",
    colors:["green","blue","black"],
    description:"MXC Pearl on Nucleus V2 — 출시 즉시 로토그립 연간 판매 1위. 강렬한 UFO 패턴과 날카로운 백엔드로 2021~2022 최고 인기."
  },

  // ── DV8 역대 인기 ─────────────────────────────────────────────
  {
    id:208, brand:"DV8", name:"Pitbull Bite",
    cover:"Solid", coreType:"Asymmetric", coreName:"Pitbull",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-pitbull-bite", coreSlug:"dv8-pitbull-core",
    weightData:{16:{rg:2.480,diff:0.054,moi:0.018},15:{rg:2.480,diff:0.053,moi:0.018},14:{rg:2.510,diff:0.050,moi:0.016},13:{rg:2.580,diff:0.045,moi:0.013},12:{rg:2.640,diff:0.038,moi:0.011}},
    releaseDate:"May 2021",
    colors:["red","black"],
    description:"HK22 Solid on Pitbull asymmetric — DV8 역대 판매 1위. 강력한 훅과 폭발적인 핀 액션으로 헤비오일 조건에서 절대 강자."
  },
  {
    id:209, brand:"DV8", name:"Thug",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Thug",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-thug", coreSlug:"dv8-thug-core",
    weightData:{16:{rg:2.480,diff:0.055,moi:0.019},15:{rg:2.481,diff:0.054,moi:0.019},14:{rg:2.510,diff:0.051,moi:0.017},13:{rg:2.580,diff:0.046,moi:0.014},12:{rg:2.640,diff:0.039,moi:0.012}},
    releaseDate:"Jan 2019",
    colors:["black","silver"],
    description:"Composite Hybrid on Thug asymmetric — DV8의 레전드 볼. 미드레인 강한 반응과 연속적인 백엔드 파워로 2019~2021 투어 인기."
  },

  // ── 2026 신규 출시 볼 ─────────────────────────────────
  // Storm - 2026 Tournament Collection
  // Roto Grip - 2026
  // 900 Global - 2026
  // Motiv - 2026
  {
    id:216, brand:"Motiv", name:"Venom Hysteria",
    cover:"Pearl", coreType:"Symmetric", coreName:"Gear",
    finish:"5000 Grit LSS", condition:"Light-Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-venom-hysteria", coreSlug:"motiv-gear-core",
    weightData:{
      15:{rg:2.49,diff:0.034}
    },
    releaseDate:"Apr 2026",
    colors:["black","purple","blue","pearl"],
    description:"Propulsion MXV Pearl on Gear Symmetric — Venom 라인의 가장 클린하고 각도 있는 볼. 라이트-미디엄 오일에서 강한 백엔드 무브. 2026년 봄 인기 피스."
  },
  // Hammer - 2026
  {
    id:217, brand:"Hammer", name:"Full Effect",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Huntsman",
    finish:"Factory Compound", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"hammer-full-effect", coreSlug:"hammer-huntsman-core",
    weightData:{
      16:{rg:2.470,diff:0.055}, 15:{rg:2.470,diff:0.055},
      14:{rg:2.490,diff:0.052}
    },
    releaseDate:"Mar 2026",
    colors:["red","black","silver"],
    description:"HK22C² Hybrid on Huntsman Asymmetric — 이펙트 라인의 폴리시드 버전. Maximum Effect와 Zero Mercy Pearl 사이 강도. 미드-헤비 오일에서 강한 폴리시드 반응."
  },
  {
    id:218, brand:"Hammer", name:"Purple Pearl Urethane 78D",
    cover:"Urethane", coreType:"Symmetric", coreName:"Super LED",
    finish:"4000 Abralon", condition:"Light-Medium Oil", accent:"#7b1fa2",
    ballSlug:"hammer-purple-pearl-urethane-78d", coreSlug:"hammer-super-led-core",
    weightData:{
      15:{rg:2.52,diff:0.025}
    },
    releaseDate:"Mar 2026",
    colors:["purple","pearl"],
    description:"78D Urethane Pearl on Super LED Symmetric — 전설의 PPU 2026년 재출시. 올 뉴 Super LED 코어로 토너먼트 승인 공식. 우레탄 컨트롤의 정석."
  },
  // Radical - 2026
  // DV8 - 2026
  // Ebonite - 2026
  // SWAG - 2026
  // Brunswick - 2026
  // Track - 2026
  // Columbia 300 - 2026
  // 추가 Roto Grip - 2026 (이미 있는 Gremlin Tour-X 외)
  // Motiv 추가 - 2026
  {
    id:235, brand:"Motiv", name:"Covert VIP ExJ",
    cover:"Solid", coreType:"Symmetric", coreName:"Vanquish",
    finish:"4000 Grit LSS", condition:"Heavy Oil", accent:"#1a237e",
    ballSlug:"motiv-covert-vip-exj", coreSlug:"motiv-vanquish-core",
    weightData:{
      16:{rg:2.47,diff:0.056}, 15:{rg:2.47,diff:0.056},
      14:{rg:2.49,diff:0.053}
    },
    releaseDate:"Apr 2026",
    colors:["blue","black","silver"],
    description:"Propulsion HVH Solid on Vanquish Symmetric — 모티브 2026 헤비 오일 파워하우스. .056 디퍼런셜 2.47 RG로 최강 견인력. 투어 레벨 헤비 조건 전용."
  },
];

// ── 한글→영문 볼 검색 매핑 ─────────────────────────────
const KO_SEARCH_MAP = {
  // Storm
  "바이오닉":"Bionic", "이온맥스":"Ion Max", "이온맥스펄":"Ion Max Pearl",
  "이온프로":"Ion Pro", "페이즈":"Phaze", "페이즈2":"Phaze II",
  "페이즈2펄":"Phaze II Pearl", "페이즈3":"Phaze III",
  "하이로드":"Hy-Road", "하이로드펄":"Hy-Road Pearl",
  "코드레드":"Code Red", "코드아너":"Code Honor",
  "마블":"Marvel", "마블스케일":"Marvel Scale", "마블펄":"Marvel Pearl",
  "컨셉":"Concept", "락온":"Lock-On", "이퀴녹스":"EquinoX",
  "피직스":"PhysiX", "서밋":"Summit", "서밋피크":"Summit Peak",
  "서밋어센트":"Summit Ascent", "스타로드":"Star Road",
  "타이푼":"Typhoon", "모터레브":"Motor Rev", "블레이즈":"Blaze DNA",
  "프라임게이트":"Prime Gate", "버추얼":"Virtual Gravity Destino",
  "어브솔루트":"Absolute Reign", "와일드":"Wild Absolute",
  // Hammer
  "블랙위도우":"Black Widow", "블랙위도우매니아":"Black Widow Mania",
  "블랙위도우3":"Black Widow 3.0", "블랙위도우투어":"Black Widow Tour V1",
  "맥시멈이펙트":"Maximum Effect", "이펙트투어":"Effect Tour",
  "스페셜이펙트":"Special Effect", "해머헤드":"Hammerhead",
  "해머헤드펄":"Hammerhead Pearl", "제로머시":"Zero Mercy",
  "앵거":"Anger", "뉴":"NU",
  // Motiv
  "재칼":"Jackal", "재칼오닉스":"Jackal Onyx",
  "에보크":"Evoke", "에보크히스테리아":"Evoke Hysteria",
  "에보크메이헴":"Evoke Mayhem", "스틸포지":"Steel Forge",
  "뉴클리어포지":"Nuclear Forge", "섭제로포지":"Subzero Forge",
  "프라이드":"Pride Empire", "쉐도우탱크":"Shadow Tank",
  "베놈":"Venom", "베놈쇼크":"Venom Shock", "하이퍼베놈":"Hyper Venom",
  "리썰베놈":"Lethal Venom", "베놈이엑스제이":"Venom EXJ",
  "프라이멀":"Primal", "프라이멀고스트":"Primal Ghost",
  "랩터":"Raptor Reign", "네뷸라":"Nebula", "아펙스재칼":"Apex Jackal",
  "수프라스포트":"Supra Sport", "코버트":"Covert VIP ExJ",
  // Roto Grip
  "그렘린":"Gremlin", "그렘린투어":"Gremlin Tour-X",
  "트랜스포머":"Transformer", "어텐션":"Attention",
  "어텐션사인":"Attention Sign", "어텐션스타":"Attention Star",
  "어텐션엣지":"Attention Edge", "록스타":"Rockstar",
  "옵티멈아이돌":"Optimum Idol", "빈티지젬":"Vintage Gem",
  "젬블루사파이어":"Gem Blue Sapphire", "매직젬":"Magic Gem",
  "허슬":"Hustle",
  // 900 Global
  "다크매터":"Dark Matter", "젠":"Zen", "젠25":"Zen 25",
  "엠버":"Ember", "마하크루즈":"Mach Cruise", "오리진":"Origin",
  "허니배저":"Honey Badger", "리얼리티":"Reality Incursion",
  "바이킹":"Viking", "복수":"Vengeance", "벤전스":"Vengeance",
  "코브":"Cove", "파팬텀크루즈":"Phantom Cruise",
  // Brunswick
  "컴뱃":"Combat", "컴뱃하이브리드":"Combat Hybrid",
  "크라운":"Crown Victory Pearl", "알러트":"Alert",
  "에너자이즈":"Energize", "데인저존":"Danger Zone",
  // Columbia 300
  "피라냐":"Piranha", "스트리트랠리":"Street Rally",
  "아틀라스":"Atlas", "리코셋":"Ricochet", "펄스":"Pulse",
  // Radical
  "딥임팩트":"Deep Impact", "아우터리밋":"Outer Limits Black Hole",
  "인텔리콘":"Intel Recon", "리디큘러스":"Ridiculous Pearl",
  "지그재그":"ZigZag",
  // Track
  "스텔스":"Stealth Mode Hybrid", "신시시스":"Synthesis",
  "씨어럼":"Theorem", "아이코어":"I-Core Gen4", "라이노":"Rhyno",
  // DV8
  "다크사이드":"Dark Side Curse", "헥클러":"Heckler",
  "만트라":"Mantra Solid", "헤이터":"Hater", "인티미데이터":"Intimidator",
  // Ebonite
  "스파르탄":"Spartan", "이머지":"Emerge", "더원":"The One Ovation",
  "리얼타임":"Real Time", "엔비전":"Envision",
  // SWAG
  "크레이즈":"Craze", "저지먼트":"Judgement Hybrid",
  "언리얼":"Unreal", "퓨전":"Fusion Hybrid", "서팬트":"Serpent Hybrid",
  "어쌔신":"Assassin Pearl", "에이펙스":"APEX Solid",
  // 브랜드명 한글
  "스톰":"Storm", "해머":"Hammer", "모티브":"Motiv", "모티브":"Motiv",
  "브런즈윅":"Brunswick", "로토그립":"Roto Grip",
  "900글로벌":"900 Global", "디브이8":"DV8", "콜롬비아":"Columbia 300",
  "에보나이트":"Ebonite", "래디컬":"Radical", "트랙":"Track",
  "스왜그":"SWAG",
};

// 한글 검색어 → 영문 변환 함수
const koToEn = (query) => {
  const q = query.trim().toLowerCase();
  // 직접 매핑
  for (const [ko, en] of Object.entries(KO_SEARCH_MAP)) {
    if (q === ko || q.includes(ko) || ko.includes(q)) return en;
  }
  return null;
};

const COND_COLOR = {
  "Heavy Oil":"#ef5350","Medium-Heavy Oil":"#fb8c00",
  "Medium Oil":"#fdd835","Light-Medium Oil":"#66bb6a","Light Oil":"#42a5f5",
};
const BRANDS = ["전체",...Array.from(new Set(ALL_BALLS.map(b=>b.brand)))];
const BRAND_ICON = {
  "Storm":"⚡","Brunswick":"🟠","Roto Grip":"🔴","Track":"🔵","Motiv":"🟣",
  "Radical":"🔶","Hammer":"🔨","900 Global":"9️⃣","DV8":"🔥","Ebonite":"💎",
  "Columbia 300":"🌊","SWAG":"🌀",
};

// 브랜드 로고 설정 (약자 + 고유 색상)
const BRAND_LOGO = {
  "Storm":      {abbr:"STM", color:"#e53935", bg:"#fff0f0", textColor:"#e53935", img:"data:image/webp;base64,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"},
  "Roto Grip":  {abbr:"RG",  color:"#1e88e5", bg:"#e3f2fd", textColor:"#1e88e5", img:"data:image/webp;base64,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"},
  "Motiv":      {abbr:"MTV", color:"#6d1f7e", bg:"#f3e5f5", textColor:"#6d1f7e", img:"data:image/webp;base64,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"},
  "Hammer":     {abbr:"HMR", color:"#d32f2f", bg:"#ffebee", textColor:"#c62828", img:"data:image/webp;base64,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"},
  "Brunswick":  {abbr:"BRN", color:"#e65100", bg:"#fff3e0", textColor:"#e65100", img:"data:image/webp;base64,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"},
  "900 Global": {abbr:"900", color:"#1565c0", bg:"#e8eaf6", textColor:"#1565c0", img:"data:image/webp;base64,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"},
  "DV8":        {abbr:"DV8", color:"#212121", bg:"#f5f5f5", textColor:"#212121", img:"data:image/webp;base64,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"},
  "Ebonite":    {abbr:"EBN", color:"#4a148c", bg:"#ede7f6", textColor:"#4a148c", img:"data:image/webp;base64,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"},
  "Columbia 300":{abbr:"C3", color:"#0277bd", bg:"#e1f5fe", textColor:"#0277bd", img:"data:image/webp;base64,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"},
  "SWAG":       {abbr:"SWG", color:"#558b2f", bg:"#f1f8e9", textColor:"#558b2f", img:"data:image/webp;base64,UklGRgANAABXRUJQVlA4WAoAAAAQAAAARwEAVwAAQUxQSHIDAAABoMfs/yFJ+qRSqdTatu0927Zt27Ztc23v2b5lZ43zrY3OoNL55Xso/H413+TTf0bEBIDKxrd/8seCYUd7KPeevkNif+pcxmm+/4WX3i3JG/qXafyTvzGScUP/sszQWWJxU/+yRTj0zGO7WrqwQqxu6k3f0Hufu7Z7tvDeLSIii04HsOdjk146OUzxmNgueNx1/kL+P6VzhuaLJHFYy0/k/7/tnXC32D+Zut6bJH7bwam8WZKyKPHR0TEni8MxzNVfJclVh6Y5XaxGRwMYWuFiGXHBS5K2ePD/gu5dA8yyI9HRCAvi8hfW/LM/Kkr6HYei86gKkYoPxHa050PidBpp+/4i2c2MCnG8JnJzJ2X+I0b03Zsxf4woXAwI88aIxtNA+COi8pWEHWpUMm35ar5FVJ4HvieIzvfydajobHrT5f+i1BLQfbEo/QBd/m9a9aTrdFG6ALq/0upmurobpaKmdN0rSs8A3Yu0Op6ujkapNT5dF4rSj4DuN5Qy7flaoNRH4DtS6mC+movSL3l0DdRKhnlsDVVLhnnlInmFrIGKycVcNTaKFdtThS2KyWtcjdFsE1fnaiZNqQo3aNaYKlyu2CZw7U3T6z2yggMjrap6UtX1mXWi9ZZDQXT9F0qi9ra2IHr/VaL4cyD6xpJo3p2oO0X1WeD5ZtH9fJ6uFN2LtWna1Sj3Dliuv0KU35Om10T5BWB5V6PdlTR9I8pXNGTpYNF+GFieod6uLHU22s0Dyw+J9ufTtEC7dSFLbUX7u8HyqdpVNaXpCe1eA80TatKCD3JQ6s7TnBpjRgwE7jbOxoHnVTXEjOqK/x9ecFTqW+74oD8SvYfcjAPRv9SE345G2tOdlPoy9VX+ogdqI3VvJ6PA9Hu5K/RHxrolB1F3qq7OmXkgQOYfHDwFqrvna82BsHinvTV1ucKCPP3UEjZbR9ZOB9lX5mhEALtP2ZoBtmuvys0DHizX/cXOtrZ04fS83An7HVfZMMeD8BH5eAguB26x8AwYrz0nDxPgduCWTB94lKHlAjvfFdIsq+sIAzdkmBaC9Lrf2fggaDwvaVVXOO+4JE10qwfa636XyTwRAI2nmJjP2iKH4e1r4ipG9ATz4Rsm3V+HI3boA9M+eGx35NQ/8NY3ht19fH2wv++sFKuuD1HW7X/3Z7+sWvDZI3v74BBWUDggaAkAAPAsAJ0BKkgBWAA+kUidSyWkoqGklxlosBIJaW7hbyEb2+z8R4c+NT0X7g+rtkT6i8zf3C/Ef1vz47x+AF+R/zfdgQAfWH/e9/B/ceiX1t9gD+Z/0f/YetX+Y8GHxH2AP5j/dv+z/fPXr/8/9L56PpD9n/gR/Wb/ueuT7Bf3Y9lgdR2VFGEwDW5ugYMq7lj3evNMPS2qXnsxEMUAg852N6IzB9IObI7SoZCAoonj0ucYoP0nR9OOCoMbjiSSxpFBKzSj9h3KaHFo+3I203BfcGQgJlhNEeJieVl9DwTHty5Ed1mm0FSMOgjyqxHFnhbtMcF/FBuXHFbjva/+ZW7KiletlQjelH2m/PGLjAJf3J6Z42ITwHmHUXfMbBLd+5VMSI1zIjz/5CXN7OEBRSvWymSIU7WjqlziDjCvY9m2gDlXsL+aeht+QQ7DUpThJ1Q8Fx4qKV62VDIPAZ9Oq0mBdPzHesXPaq35fQptFOkdpUHgAP7+3TI3mKKDcDQe4BZhEwoH2OFlEporuNuus9Ss83OTbNZvX/mjMsHxvzlBo4w6Pbf4TfB5DL2qSeoqASRkYgK2t5sqtP2fnp9O1vwp8bZnr+Hy9u4LaF/1r7uAnNGzIjCK6Gmijt7cid5HejhdJuxSHhX70iOnqSWyTDGbJa3hQgDUGdPeY72Pk6VFmtKdDIgisVl5jsBZN96Gwk00nEESl0wJZxtNfW249KXXyIcvwblorhp2NqM2topLqE67R7X52WRGKuTryVHPcFScfyATsLumUdYpM99p7Da+EoDEtSN6Lc80Xbe5xz5RodU9OrYIzi9mBwLy2uJt+MGXAzFrRzj/Q5aPh6ZFT/NdeAyLTTnTrc9Xb/o4qJpVfFOmINxNwtmFZwl9my3uUO7B33cMnvgwZhkUV67olzqiAyOi0Uu2FmhgSZeHYzvy+wgBNfaTfoEMhNaUGNHg2wvPYAuMZTFgBSgBCaoueD5ewBm692WLKfMA4zdOw41sLa6GAiqrPeo1z5Vs4CScUWKj3Z1CxmyFk7xV2rljt02s9wUtPsxzE/bBTW2vt2xVvcbZyZjgf9YanGPRr2DMLEahGwwGw5JfnMoI5xo6CYFEX+REpFYpMJQFfgORhONwpx/gUFfsCXzEs26YzXGU8dv2NIfWb4HTuD2/mO+QX7ZO7E1tkU6RT+WYKpJDCa9t6V9evnxi7uD+Wj8q9QTrVOspkJX9b2L0Y8Hl/Mn5/H/MoLtyd9fnguI1fZTQLj0wMjQQsb1FCpYF3Dguobc1cHn+vR95FQcUDybqsc1S1s4ulRBXbdDX35sOiEyIEAPsXg2PLA5Yr5GMexHEUgU+Hfk/hcuYErsRtSvHq77nyErKnXWLwj/fMgTZWqnLomcju3gmWRqwTrGVAFTDS9FI+KeINY2hq6tcXRPhoqc83iiOohBHIrurYi15Q6VB86a53252p31VMKooQKWaCepLHSVnhRnTxVXV3riOEk3Nfpeg/F67PcWYdfKeayJ65E7slKbeTGOtrBllbX4FfNyrR8x9XBtcp7LY3TrcugeP1hmeTSMCQeCwQejklH/E7a4VO3DkU3fvgVutvzd8Y5BRxz/Ld7nWQxEbxanu1Mj/EaNKAXAhyzWelxt++dFRwYYrqH/2CI4kl/+vb5jAjLTfBr7m3gXuzmPvKvhEnM2BmP3nspOZlLwWn68vuWgnGV23d2HL1VDq+Fjt/oH3KyjVM1u4w1aIIz8Gl8BDw9m/fwVLApx+0Foa1GnIReU9fOx3ZIhlcgALKyGf+Pc+jr+mXqPGxNlKciSmrZ1ntsqREzuI4Irn78DFSNLmg1wBACJXy/H7miBgsAZ8b7WbRDnNq688ZxjHLXLN3BO7d/2fWnKuaGWQGgVgQo+Qlh3TY4A/abf3vYutZAEc4WMxo9b9M2/HWoBob4MYpPaKj0+1oOHzrJIuX+S7AClzxiPFmdfl/fv7LK2cxPkWFk1uMCSVJLt6/DVuw9re4v7I8Z2AJAAoL/p0FEdndZ2hY94DlXbWgUHO4JY9UIDJiX2FmUwRLL8u8/uWt283Qe6jEhsThQrqKcHscea+LfpKpkbqKIf0/LMB4ty8MQILom+12Bf+L4gUxOZs3tIw+NQWe/fx99LZMVi5klURAMwqjIk+DJ0zPRS5oXTMfTIoy4eti7T6+H2/0a93gMLN+GS17oUGnpBM0aQWF9dtcF49UFiQD1n+9cL6HrKgBmVPLa+j7LWiIe9TIMsicJsd0uHZc41/BL0HtQoBa/P32aJCTi4LmjJ72r5r5Idc6Qj32TiSzYORG4v38m/LJFTqVa7o5OQ7jdh6YckPu138Fg/u3KnKPnMzjCYoIcO6f/8PTfonAIC2bJ0oc3avniS4mruR5PnFpK2UCr/Vwx3/fes3ViGCWpx+d9hUQVEJf1nUXKbstCv0Mfv7fq+nLfAtxn7ZbXwIZ+rXmooOVEO88DVlcpyYYlQFj9QkYdZPU35vnEVko2nILadQMkx//rRUauC06bEmb7ThcgqlLhLGU3n6y6y4abFOfaZ2NfzaXuUBpd25qxR8ctramxBuZG7dpLObFolDBwg+gWhSXjOINHh0i0/fO0JuSeUVatdiiYwMfpAd5OvH2ctmYSznmGd+lJOtvUbZp7tMIf7kgbA/cKCmSAkii0rZs23jDkIfIqLruCJuu3XIerMUftZKjq6o2oUowmIf6dCOZdVKvHYinzcVXybw5jjgzQBsXtbWXWOg4xXVVKyx5Kd6mxTXOFnk0q8xXRQIxl71FrNhn1dfjzmuiToARStCneKL50uBLby5jHEirXVQSGc4mC85lz44fY15pRybHl9WLSXZ84GdgMT+B5e305IXePgfm1NxmZw53ZUil7m1vW+tAC6rah77C6y1E1OPaLO+69cQCFqti92QOYy4nRCaA7iWHZMCYQP/ZUn5gJstI6Xg6D1fEvtJSIPoZWPOU1E27hkNRwqW59XrH4+Jb1MVdt46Yunldx56Bnd2SkLNPh6sDZr5HJfEQCVFC2aXnP8V6+z0npaA0GwXx0TgeiKQBiSVotmoj+aHKCRF4j3WlRYqnWzbLdEFgcmjFqFU0ElBtD7D+qjg2VNTpH0ezrtP7iXufYbVY2Y63ibfLoBUoDyoiLrHgR8stlJoHR1oFxtEkMTiG5OGGKASU/CF81t4AE5uLP0IYeUZnFfOdyttzwL1uSVt0YUAAAAA"},
  "Radical":    {abbr:"RAD", color:"#ef6c00", bg:"#fff8e1", textColor:"#e65100", img:"data:image/webp;base64,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"},
  "Track":      {abbr:"TRK", color:"#00695c", bg:"#e0f2f1", textColor:"#00695c", img:"data:image/webp;base64,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"},
};

function BrandLogo({ brand, size=28, active=false }) {
  const logo = BRAND_LOGO[brand];
  if (!logo) return <span style={{fontSize:14}}>{BRAND_ICON[brand]||"🎳"}</span>;

  if (logo.img) {
    return (
      <div style={{
        width:size*2.2, height:size*0.75,
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0,
      }}>
        <img src={logo.img} alt={brand} style={{
          width:"100%", height:"100%", objectFit:"contain",
          opacity:active?1:0.7,
          filter:active?"none":"grayscale(15%)",
          transition:"all .2s",
        }}/>
      </div>
    );
  }

  return (
    <div style={{
      width:size, height:size, borderRadius:6,
      background: active ? "rgba(255,255,255,0.2)" : logo.bg,
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0,
    }}>
      <span style={{
        fontSize: size <= 24 ? 8 : 10,
        fontWeight:900,
        color: active ? "#fff" : logo.textColor,
        letterSpacing:"-0.5px",
        fontFamily:"'Exo 2','Inter',sans-serif",
        lineHeight:1,
      }}>{logo.abbr}</span>
    </div>
  );
}

// 인기/판매 순위 데이터 (BowlersMart·Bowling.com·PBA 투어 사용률 종합, 2024~2025)
const POPULARITY = {
  // ── 2026 신규 출시 볼 ──────────────────────────────────
  "Concept":82,
  "Transformer":85,
  "Vengeance":83,
  "Apex Jackal":88,
  "Evoke Mayhem":86,
  "Supra Sport":70,
  "Venom Hysteria":75,
  "Full Effect":82,
  "Purple Pearl Urethane 78D":88,
  "Outer Limits Black Hole":78,
  "Deep Impact":80,
  "Dark Side Curse":79,
  "Spartan":76,
  "Serpent Hybrid":68,
  "Judgement Hybrid":72,
  "Assassin Pearl":65,
  "Unreal Solid":67,
  "Craze Tour Pearl":74,
  "Craze Tour Solid":71,
  "Combat Hybrid":80,
  "Crown Victory Pearl":78,
  "Synthesis":77,
  "Stealth Mode Hybrid":74,
  "Piranha Solid":72,
  "Attention Sign":75,
  "Covert VIP ExJ":78,
    // ── 2025~2026 실제 판매 TOP 순위 반영 ──────────────────
  // Storm
  "Bionic":99,                  // 2026 전체 #1, PBA 투어 다수 우승
  "Phaze II":98,                // 역대 최고 베스트셀러
  "Ion Max":97,                 // 2025 출시 즉시 #1
  "Ion Max Pearl":95,
  "Equinox Solid":94,           // 2025 top5
  "EquinoX":92,
  "Code Honor":90,
  "PhysiX Grandeur":88,
  "Absolute Reign":86,
  "Marvel Scale":84,
  "Concept":82,
  "Lock-On":80,
  "Phaze II Pearl":96,
  "Phaze III":88,
  "Hy-Road":97,
  "Hy-Road Pearl":93,
  "IQ Tour":91,
  "IQ Tour Pearl":87,
  "Marvel Pearl":95,
  "Code Red":86,
  "PhysiX Raze":76,
  "Virtual Gravity Destino":75,
  "Star Road":74,
  "Summit Tune":72,
  "Marvel Maxx Silver":71,
  "Prime Gate":70,
  "Marvel Pearl A.I.":69,
  "PhysiX Era":68,
  "Blaze DNA":65,
  "Typhoon":60,
  "Ion Pro Solid":58,
  "Ion Pro":55,
  "Summit Ascent":54,
  "Summit Peak":52,
  "The Road X":50,
  "Motor Rev":48,
  "PhysiX Solid":46,
  "!Q Tour A.I.":44,
  // Hammer
  "Black Widow Mania":99,       // 2025 연간 #1 판매
  "Black Widow 3.0":97,         // 2025 top3
  "Black Widow 3.0 Dynasty":96, // 2026 출시 즉시 top5
  "Black Widow Tour V1":90,
  "Maximum Effect":85,
  "Effect Tour":83,
  "Special Effect":78,
  "Hammerhead":75,
  "Hammerhead Pearl":73,
  "Zero Mercy Solid":70,
  "Zero Mercy Pearl":68,
  "Black Widow 2.0":94,
  "Black Widow 2.0 Hybrid":50,
  "Anger":65,
  "NU 2.0":60,
  "NU Blue Hammer":55,
  // Motiv
  "Jackal Onyx":96,             // 2025 전체 판매 #3
  "Evoke Hysteria":88,
  "Evoke Mayhem":86,
  "Evoke":80,
  "Steel Forge":78,
  "Primal Rage Evolution":75,
  "Jackal ExJ":72,
  "Nuclear Forge":70,
  "Pride Empire":68,
  "Shadow Tank":65,
  "Apex Jackal":62,
  "Subzero Forge":60,
  "Max Thrill Pearl":58,
  "Hyper Venom":55,
  "Lethal Venom":52,
  "Raptor Reign":50,
  "Nebula":48,
  "Blue Tank":45,
  "Supra Sport":40,
  "Primal Ghost":38,
  // Roto Grip
  "Gremlin Tour-X":87,
  "Transformer":85,
  "Attention Sign":82,
  "Attention Edge":80,
  "RST Hyperdrive Pearl":78,
  "Rockstar Amped":75,
  "Optimum Idol Solid":72,
  "Optimum Idol":70,
  "Vintage Gem":68,
  "Gem Blue Sapphire":65,
  "Gremlin":63,
  "Hyped Super Pearl II":60,
  "Exit Red":55,
  "Hustle ETF":50,
  "Hustle BP":48,
  "Hustle Teal/Black":42,
  "Magic Gem":40,
  "Attention Star S2":38,
  "Attention Star":35,
  "Rockstar":32,
  "Hustle BRY":30,
  // 900 Global
  "Dark Matter":85,
  "Zen 25":80,
  "Zen 25 Pearl":78,
  "Ember":75,
  "Mach Cruise":73,
  "Origin EX":70,
  "Reality Incursion":68,
  "Remaster Honey Badger":65,
  "Honey Badger Black Edition":63,
  "Rev Matrix":60,
  "Cove":58,
  "Duty Majesty":55,
  "Phantom Cruise":52,
  "Cruise Sapphire":50,
  "Origin":48,
  "Viking":46,
  "Wolverine Night":44,
  "Honey Badger Blameless":42,
  "Eternity Pi":40,
  "Vengeance":38,
  // Brunswick
  "Combat Hybrid":82,
  "Crown Victory Pearl":78,
  "Combat":72,
  "Crown 78U":65,
  "Alert":55,
  "Energize":50,
  "Danger Zone":45,
  "Danger Zone Purple Ice":42,
  "Melee Jab Void Black":38,
  "Vapor Zone Red":35,
  // Columbia 300
  "Street Rally":80,
  "Piranha Solid":75,
  "Atlas Hybrid":65,
  "Atlas":60,
  "Ricochet Return":55,
  "Super Cuda PowerCOR Pearl":52,
  "Ricochet Pearl":50,
  "Pulse":48,
  // Radical
  "Deep Impact":78,
  "Outer Limits Black Hole":72,
  "Intel Recon":65,
  "Ridiculous Pearl":58,
  "Xtra Bonus":50,
  "Zig Zag Solid":42,
  "ZigZag":38,
  // Track
  "Stealth Mode Hybrid":75,
  "Synthesis":68,
  "Theorem Pearl":62,
  "Theorem":58,
  "I-Core Gen4":55,
  "Rhyno":45,
  // DV8
  "Dark Side Curse":78,
  "Heckler Hybrid":72,
  "Heckler":65,
  "Mantra Solid":60,
  "Hater":55,
  "Intimidator":48,
  // Ebonite
  "Spartan":72,
  "Emerge Hybrid":65,
  "Emerge":60,
  "The One Ovation":55,
  "Real Time":50,
  "Envision":45,
  "Choice Solid":40,
  // SWAG
  "Craze Tour Pearl":80,
  "Craze Tour Solid":75,
  "Judgement Hybrid":70,
  "Unreal Solid":65,
  "Fusion Hybrid":60,
  "Serpent Hybrid":55,
  "Assassin Pearl":50,
  "APEX Solid":48,
  "Unreal":42,
  // 역대 클래식
  "Purple Pearl Urethane":92,
  "Vibe":89,
  "Bubblegum Vibe":83,
  "Venom Shock":88,
  "Venom EXJ":82,
  "Forge Fire":80,
  "Trident Odyssey":85,
  "Kingpin Max":84,
  "Rhino":79,
  "Hype-E":81,
  "UFO Alert":86,
  "Pitbull Bite":82,
  "Thug":77,
};


// bowwwl.com 이미지 컴포넌트 — 실제 제품 이미지 로드
function BowwwlImg({ src, alt, size, radius="50%", style={} }) {
  const [ok, setOk] = useState(null);
  return (
    <div style={{width:size,height:size,borderRadius:radius,overflow:"hidden",flexShrink:0,
      background:"linear-gradient(135deg,#e8ecf5,#e8e8f4)",position:"relative",...style}}>
      <img
        src={src}
        alt={alt}
        onLoad={()=>setOk(true)}
        onError={()=>setOk(false)}
        style={{
          width:"100%",height:"100%",objectFit:"cover",display:"block",
          opacity:ok===true?1:0,
          transition:"opacity .4s ease",
          position:"absolute",inset:0,
        }}
      />
      {ok===null&&(
        <div style={{position:"absolute",inset:0,
          background:"linear-gradient(135deg,#e2e2e0,#f5f5fb)",
          animation:"shimmer 1.5s ease infinite"}}/>
      )}
      {ok===false&&(
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:size*0.38,background:"#f5f5fa",
          color:"#6b6b7e"}}>🎳</div>
      )}
    </div>
  );
}

// 볼 이미지 — 원형, 그림자
function BallImg({ ball, size=56 }) {
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,overflow:"hidden",
      boxShadow:`0 4px 20px ${ball.accent}55`,border:`2px solid ${ball.accent}33`}}>
      <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={size} radius="50%"/>
    </div>
  );
}

// 파운드별 테이블
function WeightTable({ ball, sel, onSel }) {
  const wts = Object.keys(ball.weightData).map(Number).sort((a,b)=>b-a);
  const hasMoi = wts.some(w=>ball.weightData[w]?.moi);
  const d = ball.weightData[sel];
  return (
    <div>
      <div style={{display:"flex",gap:5,marginBottom:14,flexWrap:"nowrap"}}>
        {wts.map(w=>(
          <button key={w} onClick={()=>onSel(w)} style={{
            flex:1,padding:"6px 4px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,
            border:"none",fontFamily:"'Inter',sans-serif",letterSpacing:0,
            background:sel===w?ball.accent:"#e8ecf5",color:sel===w?"#fff":"#2d2d3d",
            boxShadow:sel===w?`0 3px 10px ${ball.accent}44`:"none",whiteSpace:"nowrap"}}>
            {w}lb
          </button>
        ))}
      </div>
      {d&&(
        <div style={{background:`linear-gradient(135deg,${ball.accent}09,${ball.accent}04)`,
          borderRadius:14,padding:"16px 18px",border:`1.5px solid ${ball.accent}22`,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${hasMoi&&d.moi?"3":"2"},1fr)`,gap:8,marginBottom:14}}>
            {[
              {l:"RG",v:d.rg,desc:"Radius of Gyration"},
              {l:"DIFF",v:d.diff,desc:"Total Differential"},
              ...(d.moi?[{l:"MOI",v:d.moi,desc:"Mass Bias Diff"}]:[]),
            ].map(item=>(
              <div key={item.l} style={{textAlign:"center"}}>
                <div style={{fontSize:12,color:"#1c1c1e",fontWeight:700,letterSpacing:2,marginBottom:4,fontFamily:"'Inter',sans-serif"}}>{item.l}</div>
                <div style={{fontSize:hasMoi&&d.moi?28:34,fontWeight:700,color:ball.accent,lineHeight:1,fontFamily:"'Inter',sans-serif"}}>{item.v}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:3,fontFamily:"'Inter',sans-serif",letterSpacing:.3}}>{item.desc}</div>
              </div>
            ))}
          </div>
          {[{l:"RG",v:d.rg,mx:2.80,mn:2.40},{l:"DIFF",v:d.diff,mx:0.060,mn:0.000}].map(s=>(
            <div key={s.l} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,color:"#1c1c1e",fontWeight:700}}>{s.l}</span>
                <span style={{fontSize:12,color:ball.accent,fontWeight:700}}>{s.v}</span>
              </div>
              <div style={{height:5,background:"rgba(0,0,0,0.06)",borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:3,
                  width:`${((s.v-s.mn)/(s.mx-s.mn))*100}%`,
                  background:`linear-gradient(90deg,${ball.accent}77,${ball.accent})`,
                  transition:"width .5s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,fontFamily:"inherit"}}>
          <thead>
            <tr>{["LB","RG","DIFF",...(hasMoi?["MOI"]:[])].map(h=>(
              <th key={h} style={{padding:"5px 8px",textAlign:"center",fontSize:13,color:"#1c1c1e",
                fontWeight:700,letterSpacing:1.5,borderBottom:"1px solid #e8ecf5",fontFamily:"'Inter',sans-serif"}}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {wts.map(w=>{
              const row=ball.weightData[w]; const act=w===sel;
              return (
                <tr key={w} onClick={()=>onSel(w)} style={{cursor:"pointer",
                  background:act?`${ball.accent}10`:"transparent"}}>
                  {[w,row.rg,row.diff,...(hasMoi?[row.moi||"-"]:[])].map((v,i)=>(
                    <td key={i} style={{padding:"6px 8px",textAlign:"center",
                      fontWeight:act?700:500,color:act?ball.accent:"#1a1a2e",
                      borderBottom:"1px solid #fafafa",fontSize:14,fontFamily:"'Inter',sans-serif"}}>{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 간단 로그인 팝업 (비로그인 탭 접근 시)
function LoginPopup({ onLogin, onClose }) {
  const [mode, setMode] = useState("login"); // login | register | find
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  // 아이디/비번 찾기
  const [findNick, setFindNick] = useState("");
  const [findName, setFindName] = useState("");
  const [findBirth, setFindBirth] = useState({y:"",m:"",d:""});
  const [findResult, setFindResult] = useState(null); // null | {pw, nickname} | "fail"

  const inputStyle = {
    width:"100%", background:"#f7f7fc", border:"1.5px solid #e2e2e0", borderRadius:10,
    color:"#333", padding:"10px 13px", fontSize:14, outline:"none",
    fontFamily:"inherit", boxSizing:"border-box", marginBottom:8,
  };

  useEffect(()=>{
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return ()=>{
      document.body.style.overflow = prev;
      document.body.style.position = "";
      document.body.style.width = "";
    };
  },[]);

  const handleLogin = async () => {
    if(!name.trim()||!pw){setErr("닉네임과 비밀번호를 입력해주세요");return;}
    setLoading(true);setErr("");
    try{
      const users=await sbGet("users",`nickname=eq.${encodeURIComponent(name.trim())}&select=*`);
      if(!users.length){setErr("존재하지 않는 닉네임이에요");setLoading(false);return;}
      if(users[0].password!==pw){setErr("비밀번호가 틀렸어요");setLoading(false);return;}
      const isAdmin=users[0].is_admin===true;
      localStorage.setItem("rm_nickname",name.trim());
      localStorage.setItem("rm_pw",pw);
      localStorage.setItem("rm_admin",isAdmin?"1":"0");
      const [data,noticeData]=await Promise.all([
        sbGet("equipment",`nickname=eq.${encodeURIComponent(name.trim())}&order=created_at.asc`),
        sbGet("notices","is_active=eq.true&order=created_at.desc"),
      ]);
      onLogin(name.trim(),data,isAdmin,noticeData);
    }catch(e){setErr("연결 오류. 잠시 후 다시 시도해주세요.");}
    setLoading(false);
  };

  const handleRegister = async () => {
    if(!name.trim()||name.trim().length<2){setErr("닉네임을 2글자 이상 입력해주세요");return;}
    if(!pw||pw.length<4){setErr("비밀번호를 4자리 이상 입력해주세요");return;}
    if(pw!==pw2){setErr("비밀번호가 일치하지 않아요");return;}
    setLoading(true);setErr("");
    try{
      // 닉네임 중복 체크 (users + join_requests)
      const [existing, existingReq] = await Promise.all([
        sbGet("users",`nickname=eq.${encodeURIComponent(name.trim())}&select=id`),
        sbGet("join_requests",`nickname=eq.${encodeURIComponent(name.trim())}&status=eq.pending&select=id`),
      ]);
      if(existing.length){setErr("이미 사용 중인 닉네임이에요");setLoading(false);return;}
      if(existingReq.length){setErr("이미 가입 신청 중인 닉네임이에요");setLoading(false);return;}
      // 가입 신청 등록
      await sbInsert("join_requests",{
        nickname:name.trim(),
        password:pw,
        message:memo||"",
        status:"pending"
      });
      setErr("");
      setStep(99); // 신청완료 화면
    }catch(e){setErr("연결 오류. 잠시 후 다시 시도해주세요.");}
    setLoading(false);
  };

  const handleFind = async () => {
    if(!findNick.trim()||!findName.trim()||!findBirth.y||!findBirth.m||!findBirth.d){
      setErr("모든 항목을 입력해주세요"); return;
    }
    setLoading(true); setErr(""); setFindResult(null);
    try{
      const users = await sbGet("users", `nickname=eq.${encodeURIComponent(findNick.trim())}&select=*`);
      if(!users.length){ setFindResult("fail"); setLoading(false); return; }
      const u = users[0];
      const birthStr = `${findBirth.y}-${String(findBirth.m).padStart(2,"0")}-${String(findBirth.d).padStart(2,"0")}`;
      if(u.real_name===findName.trim() && u.birth_date===birthStr){
        setFindResult({nickname: u.nickname, pw: u.password});
      } else {
        setFindResult("fail");
      }
    }catch(e){ setErr("연결 오류. 잠시 후 다시 시도해주세요."); }
    setLoading(false);
  };

  const tabs = [
    {k:"login", l:"로그인"},
    {k:"register", l:"회원가입"},
    {k:"find", l:"계정 찾기"},
  ];

  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:4000,
        background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",
        display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff",borderRadius:"24px 24px 0 0",
        padding:"20px 20px 36px",width:"100%",maxWidth:480,
        boxShadow:"0 -8px 40px rgba(0,0,0,0.2)",
        animation:"slideUp .3s cubic-bezier(.34,1.1,.64,1)"}}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{width:40,height:4,background:"#e2e2e0",borderRadius:2,margin:"0 auto 16px"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:900,color:"#111",fontFamily:"'Exo 2',sans-serif"}}>ROLLMATE</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:"#ccc",cursor:"pointer"}}>✕</button>
        </div>
        {/* 탭 */}
        <div style={{display:"flex",background:"#f5f5f7",borderRadius:12,padding:3,marginBottom:16,gap:2}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>{setMode(t.k);setErr("");setFindResult(null);}}
              style={{flex:1,padding:"8px 4px",borderRadius:9,border:"none",
                fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",
                background:mode===t.k?"#fff":"transparent",
                color:mode===t.k?"#111":"#999",
                boxShadow:mode===t.k?"0 1px 4px rgba(0,0,0,0.1)":"none",
                transition:"all .15s"}}>{t.l}</button>
          ))}
        </div>

        {/* 로그인 */}
        {mode==="login"&&(<>
          <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="닉네임" maxLength={20} style={inputStyle} autoFocus/>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="비밀번호" maxLength={30} style={inputStyle}/>
          {err&&<div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{width:"100%",padding:"14px",background:loading?"#aaa":"#ff8c00",
              border:"none",borderRadius:12,color:"#fff",fontFamily:"inherit",
              fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",
              boxShadow:"0 4px 16px rgba(255,140,0,0.35)",marginTop:4}}>
            {loading?"확인 중...":"로그인 →"}
          </button>
          <button onClick={()=>{setMode("find");setErr("");}} style={{
            width:"100%",padding:"10px",background:"none",border:"none",
            color:"#aaa",fontFamily:"inherit",fontSize:12,cursor:"pointer",marginTop:6}}>
            아이디 / 비밀번호를 잊으셨나요?
          </button>
        </>)}

        {/* 회원가입 */}
        {mode==="register"&&(<>
          <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
            placeholder="닉네임 (2글자 이상)" maxLength={20} style={inputStyle} autoFocus/>
          <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
            placeholder="비밀번호 (4자리 이상)" maxLength={30} style={inputStyle}/>
          <input type="password" value={pw2} onChange={e=>{setPw2(e.target.value);setErr("");}}
            onKeyDown={e=>e.key==="Enter"&&handleRegister()}
            placeholder="비밀번호 확인" maxLength={30} style={inputStyle}/>
          {err&&<div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
          <button onClick={handleRegister} disabled={loading}
            style={{width:"100%",padding:"14px",background:loading?"#aaa":"#ff8c00",
              border:"none",borderRadius:12,color:"#fff",fontFamily:"inherit",
              fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",
              boxShadow:"0 4px 16px rgba(255,140,0,0.35)",marginTop:4}}>
            {loading?"가입 중...":"가입하기 →"}
          </button>
          <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:10}}>
            추가 정보(실명·생년월일)는 설정에서 입력 가능해요
          </div>
        </>)}

        {/* 계정 찾기 */}
        {mode==="find"&&(<>
          {!findResult&&(<>
            <div style={{fontSize:12,color:"#888",marginBottom:12,lineHeight:1.6,
              background:"#f7f7fc",borderRadius:10,padding:"10px 12px"}}>
              💡 가입 시 입력한 <b>닉네임 · 성명 · 생년월일</b>이 모두 일치하면 비밀번호를 확인할 수 있어요.
            </div>
            <input value={findNick} onChange={e=>{setFindNick(e.target.value);setErr("");}}
              placeholder="닉네임" maxLength={20} style={inputStyle} autoFocus/>
            <input value={findName} onChange={e=>{setFindName(e.target.value);setErr("");}}
              placeholder="성명 (실명)" maxLength={20} style={inputStyle}/>
            {/* 생년월일 드롭다운 */}
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              <select value={findBirth.y} onChange={e=>setFindBirth(b=>({...b,y:e.target.value}))}
                style={{flex:2,...inputStyle,marginBottom:0,color:findBirth.y?"#333":"#aaa"}}>
                <option value="" disabled>연도</option>
                {Array.from({length:70},(_,i)=>new Date().getFullYear()-i).map(y=>(
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
              <select value={findBirth.m} onChange={e=>setFindBirth(b=>({...b,m:e.target.value}))}
                style={{flex:1,...inputStyle,marginBottom:0,color:findBirth.m?"#333":"#aaa"}}>
                <option value="" disabled>월</option>
                {Array.from({length:12},(_,i)=>i+1).map(m=>(
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
              <select value={findBirth.d} onChange={e=>setFindBirth(b=>({...b,d:e.target.value}))}
                style={{flex:1,...inputStyle,marginBottom:0,color:findBirth.d?"#333":"#aaa"}}>
                <option value="" disabled>일</option>
                {Array.from({length:31},(_,i)=>i+1).map(d=>(
                  <option key={d} value={d}>{d}일</option>
                ))}
              </select>
            </div>
            {err&&<div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
            <button onClick={handleFind} disabled={loading}
              style={{width:"100%",padding:"14px",background:loading?"#aaa":"#1c1c1e",
                border:"none",borderRadius:12,color:"#fff",fontFamily:"inherit",
                fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer",marginTop:4}}>
              {loading?"확인 중...":"계정 찾기 →"}
            </button>
          </>)}

          {/* 결과 */}
          {findResult==="fail"&&(
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:32,marginBottom:10}}>😕</div>
              <div style={{fontWeight:700,fontSize:15,color:"#111",marginBottom:6}}>일치하는 계정을 찾지 못했어요</div>
              <div style={{fontSize:13,color:"#aaa",marginBottom:20,lineHeight:1.6}}>입력한 정보를 다시 확인해주세요</div>
              <button onClick={()=>setFindResult(null)} style={{padding:"10px 24px",
                background:"#f5f5f7",border:"none",borderRadius:10,fontFamily:"inherit",
                fontSize:13,fontWeight:700,cursor:"pointer",color:"#555"}}>다시 시도</button>
            </div>
          )}
          {findResult&&findResult!=="fail"&&(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:32,marginBottom:10}}>🎉</div>
              <div style={{fontWeight:700,fontSize:15,color:"#111",marginBottom:16}}>계정을 찾았어요!</div>
              <div style={{background:"#f7f7fc",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"left"}}>
                <div style={{fontSize:11,color:"#aaa",fontWeight:700,marginBottom:4}}>닉네임</div>
                <div style={{fontSize:16,fontWeight:800,color:"#111",marginBottom:12}}>{findResult.nickname}</div>
                <div style={{fontSize:11,color:"#aaa",fontWeight:700,marginBottom:4}}>비밀번호</div>
                <div style={{fontSize:20,fontWeight:900,color:"#ff8c00",letterSpacing:2}}>{findResult.pw}</div>
              </div>
              <button onClick={()=>{setMode("login");setName(findResult.nickname);setFindResult(null);setErr("");}}
                style={{width:"100%",padding:"13px",background:"#ff8c00",border:"none",
                  borderRadius:12,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,
                  cursor:"pointer",boxShadow:"0 4px 14px rgba(255,140,0,0.35)"}}>
                로그인하러 가기 →
              </button>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

// 비교 팝업 (볼 2개 이상 선택 시)
function CmpToast({ cmpList, onGo, onDismiss }) {
  if(cmpList.length < 2) return null;
  return (
    <div style={{position:"fixed",bottom:76,left:"50%",transform:"translateX(-50%)",
      zIndex:3000,animation:"slideUp .3s cubic-bezier(.34,1.1,.64,1)"}}>
      <div style={{background:"#1c1c1e",borderRadius:50,padding:"8px 8px 8px 14px",
        display:"flex",alignItems:"center",gap:8,
        boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
        border:"1px solid rgba(255,140,0,0.25)"}}>
        {/* 아바타들 */}
        <div style={{display:"flex",alignItems:"center"}}>
          {cmpList.map((b,i)=>(
            <div key={b.id} style={{width:24,height:24,borderRadius:"50%",
              background:b.accent,marginLeft:i>0?-6:0,
              border:"2px solid #1c1c1e",flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:10,fontWeight:900,color:"#fff"}}>
              {b.name.charAt(0)}
            </div>
          ))}
        </div>
        <span style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:600,whiteSpace:"nowrap"}}>
          {cmpList.length}개 선택
        </span>
        <button onClick={onGo} style={{
          padding:"8px 16px",background:"#ff8c00",
          border:"none",borderRadius:50,color:"#fff",fontFamily:"inherit",
          fontSize:13,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",
          boxShadow:"0 3px 12px rgba(255,140,0,0.45)"}}>
          비교하기 ⚖️
        </button>
        <button onClick={onDismiss} style={{
          width:28,height:28,background:"rgba(255,255,255,0.1)",
          border:"none",borderRadius:"50%",color:"rgba(255,255,255,0.5)",
          fontFamily:"inherit",fontSize:13,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
      </div>
    </div>
  );
}

// 관리자 화면
function AdminView({ nickname, onLogout, showToast }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [ytChannels, setYtChannels] = useState([]);
  const [newChName, setNewChName] = useState("");
  const [newChId, setNewChId] = useState("");
  const [newChUrl, setNewChUrl] = useState("");
  const [ytSaving, setYtSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selUser, setSelUser] = useState(null);
  const [userEquip, setUserEquip] = useState([]);
  const [equipLoading, setEquipLoading] = useState(false);
  const [noticeForm, setNoticeForm] = useState({title:"", content:""});
  const [posting, setPosting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await sbGet("users", "order=created_at.desc&select=*");
      setUsers(data);
    } catch(e) { showToast("불러오기 오류","#ef5350"); }
    setLoading(false);
  };

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await sbGet("notices", "order=created_at.desc");
      setNotices(data);
    } catch(e) { showToast("불러오기 오류","#ef5350"); }
    setLoading(false);
  };

  useEffect(()=>{
    if(tab==="users") loadUsers();
    if(tab==="notices") loadNotices();
  },[tab]);

  const loadUserEquip = async (nick) => {
    setEquipLoading(true);
    try {
      const data = await sbGet("equipment", `nickname=eq.${encodeURIComponent(nick)}&order=created_at.asc`);
      setUserEquip(data);
    } catch(e) { showToast("불러오기 오류","#ef5350"); }
    setEquipLoading(false);
  };

  const deleteUser = async (nick) => {
    if(!window.confirm(`'${nick}' 회원을 강제 탈퇴시킬까요?\n장비 데이터도 모두 삭제됩니다.`)) return;
    try {
      await sbFetch(`/equipment?nickname=eq.${encodeURIComponent(nick)}`, {method:"DELETE",prefer:""});
      await sbFetch(`/users?nickname=eq.${encodeURIComponent(nick)}`, {method:"DELETE",prefer:""});
      showToast(`🗑️ ${nick} 탈퇴 완료`,"#ef5350");
      setSelUser(null);
      loadUsers();
    } catch(e) { showToast("삭제 오류","#ef5350"); }
  };

  const postNotice = async () => {
    if(!noticeForm.title.trim() || !noticeForm.content.trim()) {
      showToast("제목과 내용을 입력해주세요","#ef5350"); return;
    }
    setPosting(true);
    try {
      await sbInsert("notices", {title:noticeForm.title.trim(), content:noticeForm.content.trim(), is_active:true});
      showToast("📢 공지사항 등록 완료");
      setNoticeForm({title:"",content:""});
      loadNotices();
    } catch(e) { showToast("등록 오류","#ef5350"); }
    setPosting(false);
  };

  const toggleNotice = async (notice) => {
    try {
      await sbFetch(`/notices?id=eq.${notice.id}`, {
        method:"PATCH", body:JSON.stringify({is_active:!notice.is_active}), prefer:"return=minimal"
      });
      loadNotices();
    } catch(e) { showToast("오류 발생","#ef5350"); }
  };

  const deleteNotice = async (id) => {
    if(!window.confirm("공지사항을 삭제할까요?")) return;
    try {
      await sbFetch(`/notices?id=eq.${id}`, {method:"DELETE",prefer:""});
      showToast("🗑️ 공지 삭제됨","#ef5350");
      loadNotices();
    } catch(e) { showToast("삭제 오류","#ef5350"); }
  };

  const inputStyle = {width:"100%",background:"#f7f7fc",border:"1.5px solid #e2e2e0",borderRadius:10,
    color:"#333",padding:"10px 13px",fontSize:13,outline:"none",fontFamily:"inherit",
    boxSizing:"border-box",marginBottom:8};

  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#f2f2f0",minHeight:"100vh",maxWidth:520,margin:"0 auto"}}>
      {/* 관리자 탑바 */}
      <div style={{background:"linear-gradient(135deg,#1c1c1e,#2d2014)",padding:"16px 20px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        boxShadow:"0 2px 12px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🛡️</span>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:0.5}}>ROLLMATE 관리자</div>
            <div style={{fontSize:11,color:"rgba(255,140,0,0.8)",fontWeight:600}}>@{nickname}</div>
          </div>
        </div>
        <button onClick={()=>{if(window.confirm("로그아웃 할까요?")) onLogout();}}
          style={{padding:"7px 14px",borderRadius:18,border:"1px solid rgba(255,255,255,0.2)",
            background:"transparent",color:"rgba(255,255,255,0.7)",fontFamily:"inherit",
            fontSize:12,fontWeight:700,cursor:"pointer"}}>로그아웃</button>
      </div>

      {/* 탭 */}
      <div style={{display:"flex",background:"#fff",borderBottom:"2px solid #f2f2f0"}}>
        {[{k:"users",l:"👥 회원 관리"},{k:"notices",l:"📢 공지사항"},{k:"youtube",l:"🎬 유튜브 채널"}].map(t=>(
          <button key={t.k} onClick={()=>{
              setTab(t.k);setSelUser(null);
              if(t.k==="youtube"){
                sbGet("youtube_channels","order=created_at.desc")
                  .then(d=>setYtChannels(d||[])).catch(()=>{});
              }
            }} style={{
            flex:1,padding:"13px",border:"none",fontFamily:"inherit",fontSize:13,fontWeight:700,
            cursor:"pointer",background:"transparent",
            color:tab===t.k?"#ff8c00":"#999",
            borderBottom:tab===t.k?"2.5px solid #ff8c00":"2.5px solid transparent",
            transition:"all .15s"}}>
            {t.l}
            {t.k==="users"&&<span style={{marginLeft:5,fontSize:11,background:"#ff8c00",color:"#fff",
              padding:"1px 6px",borderRadius:10,fontWeight:800}}>{users.length}</span>}
          </button>
        ))}
      </div>

      <div style={{padding:"16px 16px 40px"}}>
        {/* 회원 목록 */}
        {tab==="users" && !selUser && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:800,fontSize:16,color:"#111"}}>전체 회원</div>
              <button onClick={loadUsers} style={{padding:"6px 12px",borderRadius:14,border:"1.5px solid #e2e2e0",
                background:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",color:"#555"}}>
                🔄 새로고침
              </button>
            </div>
            {loading ? (
              <div style={{textAlign:"center",padding:40,color:"#aaa"}}>불러오는 중...</div>
            ) : users.length === 0 ? (
              <div style={{textAlign:"center",padding:40,color:"#ccc"}}>회원이 없어요</div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {users.map(u=>(
                  <div key={u.id} onClick={()=>{setSelUser(u);loadUserEquip(u.nickname);}}
                    style={{background:"#fff",borderRadius:14,padding:"13px 16px",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:12,
                      boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
                      border:u.is_admin?"2px solid #ff8c0044":"1.5px solid transparent"}}>
                    <div style={{width:40,height:40,borderRadius:"50%",
                      background:u.is_admin?"linear-gradient(135deg,#ff8c00,#e65100)":"linear-gradient(135deg,#1c1c1e,#444)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:16,fontWeight:900,color:"#fff",flexShrink:0}}>
                      {u.nickname.charAt(0).toUpperCase()}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{u.nickname}</div>
                        {u.is_admin&&<span style={{fontSize:10,background:"#ff8c00",color:"#fff",
                          padding:"1px 6px",borderRadius:8,fontWeight:800}}>관리자</span>}
                      </div>
                      <div style={{fontSize:11,color:"#aaa",marginTop:2}}>
                        {u.real_name&&<span style={{color:"#888",fontWeight:600,marginRight:5}}>{u.real_name}</span>}
                        {u.gender&&<span style={{marginRight:5}}>{u.gender}</span>}
                        {u.birth_date&&<span>{u.birth_date}</span>}
                      </div>
                      <div style={{fontSize:11,color:"#ccc",marginTop:1}}>
                        가입 {new Date(u.created_at).toLocaleDateString("ko-KR")}
                      </div>
                    </div>
                    <span style={{color:"#ddd",fontSize:18}}>›</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 회원 상세 */}
        {tab==="users" && selUser && (
          <div>
            <button onClick={()=>setSelUser(null)} style={{background:"#fff",border:"1.5px solid #e2e2e0",
              color:"#2d2d3d",padding:"6px 14px",borderRadius:18,cursor:"pointer",
              fontWeight:700,fontSize:13,marginBottom:14,fontFamily:"inherit"}}>← 목록</button>
            <div style={{background:"linear-gradient(135deg,#1c1c1e,#333)",borderRadius:18,
              padding:"20px",marginBottom:14,display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:52,borderRadius:"50%",
                background:selUser.is_admin?"linear-gradient(135deg,#ff8c00,#e65100)":"rgba(255,255,255,0.15)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"#fff"}}>
                {selUser.nickname.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{selUser.nickname}</div>
                  {selUser.is_admin&&<span style={{fontSize:11,background:"#ff8c00",color:"#fff",
                    padding:"2px 8px",borderRadius:10,fontWeight:800}}>관리자</span>}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>
                  가입일 {new Date(selUser.created_at).toLocaleDateString("ko-KR")}
                </div>
                {selUser.real_name&&<div style={{fontSize:12,color:"rgba(255,140,0,0.7)",marginTop:1,fontWeight:600}}>{selUser.real_name}</div>}
              </div>
            </div>
            {/* 개인정보 카드 */}
            <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,
              boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontWeight:800,fontSize:14,color:"#111",marginBottom:12}}>👤 회원 정보</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[
                  {l:"성명", v:selUser.real_name||"-"},
                  {l:"성별", v:selUser.gender||"-"},
                  {l:"생년월일", v:selUser.birth_date||"-"},
                  {l:"닉네임", v:selUser.nickname},
                ].map(({l,v})=>(
                  <div key={l} style={{background:"#f7f7fc",borderRadius:10,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:1,marginBottom:2}}>{l.toUpperCase()}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"#111"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* 장비 목록 */}
            <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,
              boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontWeight:800,fontSize:14,color:"#111",marginBottom:12}}>
                🎳 등록 장비 {equipLoading?"...":userEquip.length+"개"}
              </div>
              {equipLoading ? (
                <div style={{textAlign:"center",padding:20,color:"#aaa",fontSize:13}}>불러오는 중...</div>
              ) : userEquip.length === 0 ? (
                <div style={{textAlign:"center",padding:16,color:"#ccc",fontSize:13}}>등록된 장비가 없어요</div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {userEquip.map(e=>(
                    <div key={e.id} style={{background:"#f7f7fc",borderRadius:10,padding:"10px 13px"}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#111"}}>{e.ball_name}</div>
                      <div style={{fontSize:11,color:"#888",marginTop:2}}>
                        {e.weight}lb · {e.grip||"세미팁"}
                        {e.purchase_price&&` · ${parseInt(e.purchase_price).toLocaleString()}원`}
                        {e.purchase_date&&` · ${e.purchase_date}`}
                      </div>
                      {e.memo&&<div style={{fontSize:11,color:"#aaa",marginTop:3,fontStyle:"italic"}}>"{e.memo}"</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!selUser.is_admin && (
              <button onClick={()=>deleteUser(selUser.nickname)} style={{
                width:"100%",padding:"13px",background:"#ef5350",border:"none",borderRadius:14,
                color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer",
                boxShadow:"0 4px 14px rgba(239,83,80,0.35)"}}>
                🗑️ 이 회원 강제 탈퇴
              </button>
            )}
          </div>
        )}

        {/* 공지사항 탭 */}
        {tab==="notices" && (
          <div>
            <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:16,
              boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
              <div style={{fontWeight:800,fontSize:14,color:"#111",marginBottom:12}}>📝 새 공지 작성</div>
              <input value={noticeForm.title} onChange={e=>setNoticeForm(f=>({...f,title:e.target.value}))}
                placeholder="제목" style={inputStyle}/>
              <textarea value={noticeForm.content} onChange={e=>setNoticeForm(f=>({...f,content:e.target.value}))}
                placeholder="내용을 입력하세요..." rows={4}
                style={{...inputStyle,resize:"vertical"}}/>
              <button onClick={postNotice} disabled={posting} style={{
                width:"100%",padding:"11px",background:posting?"#aaa":"#ff8c00",border:"none",borderRadius:11,
                color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:800,cursor:"pointer",
                boxShadow:"0 4px 14px rgba(255,140,0,0.3)"}}>
                {posting?"등록 중...":"📢 공지 등록"}
              </button>
            </div>
            <div style={{fontWeight:800,fontSize:14,color:"#111",marginBottom:10}}>공지 목록</div>
            {loading ? (
              <div style={{textAlign:"center",padding:30,color:"#aaa"}}>불러오는 중...</div>
            ) : notices.length === 0 ? (
              <div style={{textAlign:"center",padding:30,color:"#ccc",fontSize:13}}>등록된 공지가 없어요</div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {notices.map(n=>(
                  <div key={n.id} style={{background:"#fff",borderRadius:14,padding:"14px 16px",
                    boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
                    border:n.is_active?"1.5px solid #ff8c0033":"1.5px solid #e2e2e0",
                    opacity:n.is_active?1:0.55}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <span style={{fontSize:11,fontWeight:800,padding:"2px 7px",borderRadius:8,
                        background:n.is_active?"#ff8c00":"#ddd",color:"#fff"}}>
                        {n.is_active?"게시 중":"숨김"}
                      </span>
                      <span style={{fontSize:11,color:"#aaa"}}>{new Date(n.created_at).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <div style={{fontWeight:700,fontSize:14,color:"#111"}}>{n.title}</div>
                    <div style={{fontSize:12,color:"#777",marginTop:4,lineHeight:1.5}}>{n.content}</div>
                    <div style={{display:"flex",gap:6,marginTop:10}}>
                      <button onClick={()=>toggleNotice(n)} style={{flex:1,padding:"7px",borderRadius:8,
                        border:`1.5px solid ${n.is_active?"#ff8c0044":"#43a04744"}`,
                        background:"transparent",color:n.is_active?"#ff8c00":"#43a047",
                        fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        {n.is_active?"숨기기":"다시 게시"}
                      </button>
                      <button onClick={()=>deleteNotice(n.id)} style={{flex:1,padding:"7px",borderRadius:8,
                        border:"1.5px solid #ef535044",background:"transparent",color:"#ef5350",
                        fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 탈퇴 모달 (별도 컴포넌트 - 리렌더링 방지)
function DeleteModal({ onClose, onDelete }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const inputStyle = {width:"100%",background:"#f7f7fc",border:"1.5px solid #e2e2e0",borderRadius:10,
    color:"#333",padding:"10px 13px",fontSize:13,outline:"none",fontFamily:"inherit",
    boxSizing:"border-box",marginBottom:8};

  const handle = async () => {
    if(!pw) { setErr("비밀번호를 입력해주세요"); return; }
    if(confirm !== "탈퇴") { setErr("'탈퇴'를 정확히 입력해주세요"); return; }
    setLoading(true);
    const res = await onDelete(pw);
    setLoading(false);
    if(res !== "ok") setErr(res);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:2500,
      background:"rgba(10,10,30,0.55)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"60px 20px 20px",overflowY:"auto"}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,
        padding:"22px 20px",width:"100%",maxWidth:360,
        boxShadow:"0 24px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontSize:17,fontWeight:800,color:"#111"}}>🗑️ 계정 삭제</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#ccc",fontSize:22,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{background:"#fff5f5",border:"1.5px solid #ffcdd2",borderRadius:10,
          padding:"10px 12px",marginBottom:14,fontSize:12,color:"#c62828",lineHeight:1.7,fontWeight:600}}>
          ⚠️ 삭제 시 모든 장비 데이터가 영구적으로 삭제돼요. 복구가 불가능해요.
        </div>
        <label style={{fontSize:12,color:"#555",fontWeight:700,display:"block",marginBottom:5}}>비밀번호 확인</label>
        <input
          type="password"
          placeholder="현재 비밀번호"
          value={pw}
          onChange={e=>{ setPw(e.target.value); setErr(""); }}
          style={inputStyle}
          autoComplete="current-password"
        />
        <label style={{fontSize:12,color:"#555",fontWeight:700,display:"block",marginBottom:5,marginTop:4}}>'탈퇴' 입력</label>
        <input
          placeholder="탈퇴"
          value={confirm}
          onChange={e=>{ setConfirm(e.target.value); setErr(""); }}
          style={inputStyle}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {err && <div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
        <button onClick={handle} disabled={loading} style={{
          width:"100%",padding:"12px",background:loading?"#aaa":"#ef5350",
          border:"none",borderRadius:11,color:"#fff",fontFamily:"inherit",
          fontSize:14,fontWeight:800,cursor:loading?"not-allowed":"pointer",marginTop:4}}>
          {loading?"삭제 중...":"계정 영구 삭제"}
        </button>
      </div>
    </div>
  );
}

// 비밀번호 변경 모달 (별도 컴포넌트)
function PwChangeModal({ onClose, onSave }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw1, setNewPw1] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const inputStyle = {width:"100%",background:"#f7f7fc",border:"1.5px solid #e2e2e0",borderRadius:10,
    color:"#333",padding:"10px 13px",fontSize:13,outline:"none",fontFamily:"inherit",
    boxSizing:"border-box",marginBottom:8};

  const handle = async () => {
    if(!oldPw || !newPw1 || !newPw2) { setErr("모든 항목을 입력해주세요"); return; }
    if(newPw1.length < 4) { setErr("새 비밀번호는 4자리 이상이어야 해요"); return; }
    if(newPw1 !== newPw2) { setErr("새 비밀번호가 일치하지 않아요"); return; }
    setLoading(true);
    const res = await onSave(oldPw, newPw1);
    setLoading(false);
    if(res === "ok") onClose(true);
    else setErr(res);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:2500,
      background:"rgba(10,10,30,0.55)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"60px 20px 20px",overflowY:"auto"}}
      onClick={()=>onClose(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,
        padding:"22px 20px",width:"100%",maxWidth:360,
        boxShadow:"0 24px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontSize:17,fontWeight:800,color:"#111"}}>🔑 비밀번호 변경</div>
          <button onClick={()=>onClose(false)} style={{background:"none",border:"none",color:"#ccc",fontSize:22,cursor:"pointer"}}>✕</button>
        </div>
        <input type="password" placeholder="현재 비밀번호" value={oldPw}
          onChange={e=>{setOldPw(e.target.value);setErr("");}} style={inputStyle}/>
        <input type="password" placeholder="새 비밀번호 (4자 이상)" value={newPw1}
          onChange={e=>{setNewPw1(e.target.value);setErr("");}} style={inputStyle}/>
        <input type="password" placeholder="새 비밀번호 확인" value={newPw2}
          onChange={e=>{setNewPw2(e.target.value);setErr("");}} style={inputStyle}/>
        {err && <div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
        <button onClick={handle} disabled={loading} style={{width:"100%",padding:"12px",
          background:loading?"#aaa":"#1c1c1e",border:"none",borderRadius:11,color:"#fff",
          fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer",marginTop:4}}>
          {loading?"변경 중...":"변경하기"}
        </button>
      </div>
    </div>
  );
}

// 닉네임 변경 모달 (별도 컴포넌트)
function NickChangeModal({ nickname, onClose, onSave }) {
  const [newNick, setNewNick] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const inputStyle = {width:"100%",background:"#f7f7fc",border:"1.5px solid #e2e2e0",borderRadius:10,
    color:"#333",padding:"10px 13px",fontSize:13,outline:"none",fontFamily:"inherit",
    boxSizing:"border-box",marginBottom:8};

  const handle = async () => {
    if(!newNick || newNick.trim().length < 2) { setErr("닉네임을 2글자 이상 입력해주세요"); return; }
    if(!pw) { setErr("비밀번호를 입력해주세요"); return; }
    setLoading(true);
    const res = await onSave(newNick.trim(), pw);
    setLoading(false);
    if(res === "ok") onClose(true);
    else setErr(res);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:2500,
      background:"rgba(10,10,30,0.55)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      padding:"60px 20px 20px",overflowY:"auto"}}
      onClick={()=>onClose(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:22,
        padding:"22px 20px",width:"100%",maxWidth:360,
        boxShadow:"0 24px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{fontSize:17,fontWeight:800,color:"#111"}}>✏️ 닉네임 변경</div>
          <button onClick={()=>onClose(false)} style={{background:"none",border:"none",color:"#ccc",fontSize:22,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{fontSize:12,color:"#888",marginBottom:12,lineHeight:1.6}}>
          현재: <b style={{color:"#ff8c00"}}>{nickname}</b>
        </div>
        <input placeholder="새 닉네임 (2글자 이상)" value={newNick}
          onChange={e=>{setNewNick(e.target.value);setErr("");}} style={inputStyle}/>
        <input type="password" placeholder="비밀번호 확인" value={pw}
          onChange={e=>{setPw(e.target.value);setErr("");}} style={inputStyle}/>
        {err && <div style={{fontSize:12,color:"#ef5350",fontWeight:600,marginBottom:8}}>{err}</div>}
        <button onClick={handle} disabled={loading} style={{width:"100%",padding:"12px",
          background:loading?"#aaa":"#1c1c1e",border:"none",borderRadius:11,color:"#fff",
          fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer",marginTop:4}}>
          {loading?"변경 중...":"변경하기"}
        </button>
      </div>
    </div>
  );
}

// 설정 화면
function SettingsView({ nickname, arsenal, onPasswordChange, onNicknameChange, onDeleteAll, onLogout, showToast }) {
  const [section, setSection] = useState(null);

  const Card = ({children, style={}}) => (
    <div style={{background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 1px 8px rgba(0,0,0,0.06)",...style}}>
      {children}
    </div>
  );
  const Row = ({icon, label, sub, onClick, danger=false}) => (
    <button onClick={onClick} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
      background:"none",border:"none",cursor:onClick?"pointer":"default",fontFamily:"inherit",
      borderBottom:"1px solid #f5f5f8",textAlign:"left"}}>
      <span style={{fontSize:22,width:32,textAlign:"center"}}>{icon}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:700,color:danger?"#ef5350":"#111"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:"#aaa",marginTop:1}}>{sub}</div>}
      </div>
      {onClick&&<span style={{color:"#ddd",fontSize:16}}>›</span>}
    </button>
  );

  return (
    <div style={{animation:"fadeUp .3s ease both",paddingBottom:20}}>
      {/* 헤더 프로필 */}
      <div style={{background:"linear-gradient(135deg,#1c1c1e,#2d2014)",borderRadius:20,padding:"22px 20px",
        marginBottom:20,display:"flex",alignItems:"center",gap:16,boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
        <div style={{width:54,height:54,borderRadius:"50%",background:"#ff8c00",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:"#fff",
          boxShadow:"0 4px 14px rgba(255,140,0,0.4)"}}>
          {nickname.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{nickname}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2}}>
            볼링공 {arsenal.length}개 등록됨
          </div>
        </div>
      </div>

      {/* 계정 관리 */}
      <div style={{fontSize:11,color:"#aaa",fontWeight:700,letterSpacing:1.5,marginBottom:6,paddingLeft:4}}>계정 관리</div>
      <Card style={{marginBottom:16}}>
        <Row icon="🔑" label="비밀번호 변경" sub="현재 비밀번호 확인 후 변경" onClick={()=>setSection("pw")}/>
        <Row icon="✏️" label="닉네임 변경" sub="변경 시 장비 데이터도 이동" onClick={()=>setSection("nick")}/>
        <Row icon="🚪" label="로그아웃" sub="데이터는 클라우드에 유지됨"
          onClick={()=>{if(window.confirm("로그아웃 하시겠어요?")) onLogout();}}/>
      </Card>

      {/* 데이터 관리 */}
      <div style={{fontSize:11,color:"#aaa",fontWeight:700,letterSpacing:1.5,marginBottom:6,paddingLeft:4}}>데이터 관리</div>
      <Card style={{marginBottom:16}}>
        <Row icon="📊" label="내 장비 현황" sub={`총 ${arsenal.length}개 · 클라우드 저장 중`}/>
        <Row icon="🗑️" label="계정 및 데이터 삭제" sub="탈퇴 시 모든 데이터가 삭제돼요"
          onClick={()=>setSection("delete")} danger/>
      </Card>

      {/* 앱 정보 */}
      <div style={{fontSize:11,color:"#aaa",fontWeight:700,letterSpacing:1.5,marginBottom:6,paddingLeft:4}}>앱 정보</div>
      <Card>
        <Row icon="🎳" label="ROLLMATE" sub="볼링 장비 관리 앱"/>
        <Row icon="🔢" label="버전" sub="v7.9"/>
        <Row icon="👨‍💻" label="만든이" sub="완태콩 & Claude"/>
      </Card>

      {/* 모달들 - 별도 컴포넌트라 리렌더링 없음 */}
      {section==="pw" && (
        <PwChangeModal
          onClose={(ok)=>{ setSection(null); if(ok) showToast("✅ 비밀번호 변경 완료"); }}
          onSave={onPasswordChange}
        />
      )}
      {section==="nick" && (
        <NickChangeModal
          nickname={nickname}
          onClose={(ok)=>{ setSection(null); if(ok) showToast("✅ 닉네임 변경 완료"); }}
          onSave={onNicknameChange}
        />
      )}
      {section==="delete" && (
        <DeleteModal
          onClose={()=>setSection(null)}
          onDelete={onDeleteAll}
        />
      )}
    </div>
  );
}

// 닉네임 + 비밀번호 로그인  // onLogin(nickname, data, isAdmin)
function NicknameLogin({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [realName, setRealName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState(1); // 회원가입 1단계(계정) / 2단계(개인정보)

  const handleLogin = async () => {
    const n = name.trim();
    if (!n) { setErr("닉네임을 입력해주세요"); return; }
    if (!pw) { setErr("비밀번호를 입력해주세요"); return; }
    setLoading(true); setErr("");
    try {
      const users = await sbGet("users", `nickname=eq.${encodeURIComponent(n)}&select=*`);
      if (users.length === 0) { setErr("존재하지 않는 닉네임이에요. 회원가입을 해주세요."); setLoading(false); return; }
      if (users[0].password !== pw) { setErr("비밀번호가 틀렸어요."); setLoading(false); return; }
      const isAdmin = users[0].is_admin === true;
      localStorage.setItem("rm_nickname", n);
      localStorage.setItem("rm_pw", pw);
      localStorage.setItem("rm_admin", isAdmin ? "1" : "0");
      const [data, noticeData] = await Promise.all([
        sbGet("equipment", `nickname=eq.${encodeURIComponent(n)}&order=created_at.asc`),
        sbGet("notices", "is_active=eq.true&order=created_at.desc"),
      ]);
      onLogin(n, data, isAdmin, noticeData);
    } catch(e) { setErr("연결 오류. 잠시 후 다시 시도해주세요."); }
    setLoading(false);
  };

  const handleNextStep = () => {
    const n = name.trim();
    if (!n || n.length < 2) { setErr("닉네임을 2글자 이상 입력해주세요"); return; }
    if (!pw || pw.length < 4) { setErr("비밀번호를 4자리 이상 입력해주세요"); return; }
    if (pw !== pw2) { setErr("비밀번호가 일치하지 않아요"); return; }
    setErr(""); setStep(2);
  };

  const handleRegister = async () => {
    if (!realName.trim()) { setErr("성명을 입력해주세요"); return; }
    if (!birthYear || !birthMonth || !birthDay) { setErr("생년월일을 모두 선택해주세요"); return; }
    const birthDate = `${birthYear}-${birthMonth.padStart(2,"0")}-${birthDay.padStart(2,"0")}`;
    if (!gender) { setErr("성별을 선택해주세요"); return; }
    setLoading(true); setErr("");
    try {
      const existing = await sbGet("users", `nickname=eq.${encodeURIComponent(name.trim())}&select=id`);
      if (existing.length > 0) { setErr("이미 사용 중인 닉네임이에요."); setStep(1); setLoading(false); return; }
      await sbInsert("users", {
        nickname: name.trim(),
        password: pw,
        real_name: realName.trim(),
        birth_date: birthDate,
        gender: gender,
        is_admin: false,
      });
      localStorage.setItem("rm_nickname", name.trim());
      localStorage.setItem("rm_pw", pw);
      localStorage.setItem("rm_admin", "0");
      onLogin(name.trim(), [], false);
    } catch(e) { setErr("연결 오류. 잠시 후 다시 시도해주세요."); }
    setLoading(false);
  };

  const inputStyle = {
    width:"100%", background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.2)",
    borderRadius:12, color:"#fff", padding:"12px 14px", fontSize:14, outline:"none",
    fontFamily:"inherit", boxSizing:"border-box", marginBottom:8,
  };
  const labelStyle = {fontSize:11,color:"rgba(255,255,255,0.45)",fontWeight:700,
    letterSpacing:1.2,display:"block",marginBottom:5,marginTop:4};

  return (
    <div style={{position:"fixed",inset:0,zIndex:3000,
      background:"linear-gradient(160deg,#1c1c1e 0%,#2d2014 100%)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:24,overflowY:"auto"}}>
      <div style={{width:"100%",maxWidth:340,textAlign:"center",paddingTop:20,paddingBottom:20}}>
        <div style={{fontSize:56,marginBottom:4}}>🎳</div>
        <div style={{fontFamily:"'Bebas Neue','Inter',sans-serif",fontWeight:400,
          fontSize:44,color:"#fff",letterSpacing:7,marginBottom:2,
          textShadow:"0 0 24px rgba(255,140,0,0.4)"}}>
          ROLL<span style={{
            color:"#ff8c00",
            textShadow:"0 0 18px rgba(255,140,0,0.75)",
            borderBottom:"2.5px solid #ff8c00",
            paddingBottom:2
          }}>MATE</span>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:24,fontWeight:600}}>나만의 장비 관리 앱</div>

        {/* 로그인/회원가입 탭 */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.08)",borderRadius:12,padding:4,marginBottom:20}}>
          {[{k:"login",l:"로그인"},{k:"register",l:"회원가입"}].map(t=>(
            <button key={t.k} onClick={()=>{setMode(t.k);setErr("");setStep(1);}} style={{flex:1,padding:"9px",
              borderRadius:9,border:"none",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer",
              background:mode===t.k?"#ff8c00":"transparent",
              color:mode===t.k?"#fff":"rgba(255,255,255,0.4)",transition:"all .15s"}}>{t.l}</button>
          ))}
        </div>

        <div style={{background:"rgba(255,255,255,0.06)",borderRadius:20,padding:"24px 20px",
          border:"1px solid rgba(255,255,255,0.1)",textAlign:"left"}}>

          {/* 로그인 */}
          {mode==="register" && step===99 && (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:40,marginBottom:12}}>✅</div>
              <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:8}}>
                가입 신청 완료!
              </div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:20}}>
                관리자 승인 후 로그인하실 수 있어요.<br/>
                잠시 기다려 주세요 🙏
              </div>
              <button onClick={()=>{setMode("login");setStep(1);setName("");setPw("");setPw2("");}}
                style={{padding:"12px 30px",background:"#ff8c00",border:"none",
                  borderRadius:12,color:"#fff",fontFamily:"inherit",
                  fontSize:14,fontWeight:700,cursor:"pointer"}}>
                로그인 화면으로
              </button>
            </div>
          )}

          {mode==="login" && (<>
            <label style={labelStyle}>닉네임</label>
            <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="닉네임 입력" maxLength={20} autoFocus style={inputStyle}/>
            <label style={labelStyle}>비밀번호</label>
            <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="비밀번호 입력" maxLength={30} style={inputStyle}/>
            {err&&<div style={{fontSize:12,color:"#ff6b6b",marginBottom:8,fontWeight:600}}>{err}</div>}
            <button onClick={handleLogin} disabled={loading} style={{width:"100%",padding:"13px",marginTop:4,
              background:loading?"#555":"#ff8c00",border:"none",borderRadius:12,color:"#fff",
              fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:loading?"not-allowed":"pointer",
              boxShadow:"0 6px 20px rgba(255,140,0,0.4)"}}>
              {loading?"확인 중...":"로그인 →"}
            </button>
          </>)}

          {/* 회원가입 1단계: 계정 정보 */}
          {mode==="register" && step===1 && (<>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"#ff8c00",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>1</div>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.7)"}}>계정 정보</div>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,0.1)"}}/>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>2단계 중 1</div>
            </div>
            <label style={labelStyle}>닉네임 (로그인 ID)</label>
            <input value={name} onChange={e=>{setName(e.target.value);setErr("");}}
              placeholder="2글자 이상" maxLength={20} autoFocus style={inputStyle}/>
            <label style={labelStyle}>비밀번호</label>
            <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}}
              placeholder="4자리 이상" maxLength={30} style={inputStyle}/>
            <label style={labelStyle}>비밀번호 확인</label>
            <input type="password" value={pw2} onChange={e=>{setPw2(e.target.value);setErr("");}}
              onKeyDown={e=>e.key==="Enter"&&handleNextStep()}
              placeholder="비밀번호 재입력" maxLength={30} style={inputStyle}/>
            {err&&<div style={{fontSize:12,color:"#ff6b6b",marginBottom:8,fontWeight:600}}>{err}</div>}
            <button onClick={handleNextStep} style={{width:"100%",padding:"13px",marginTop:4,
              background:"#ff8c00",border:"none",borderRadius:12,color:"#fff",
              fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer",
              boxShadow:"0 6px 20px rgba(255,140,0,0.4)"}}>
              다음 →
            </button>
          </>)}

          {/* 회원가입 2단계: 개인 정보 */}
          {mode==="register" && step===2 && (<>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"#ff8c00",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff"}}>2</div>
              <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.7)"}}>개인 정보</div>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,0.1)"}}/>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>2단계 중 2</div>
            </div>
            <label style={labelStyle}>성명</label>
            <input value={realName} onChange={e=>{setRealName(e.target.value);setErr("");}}
              placeholder="홍길동" maxLength={20} autoFocus style={inputStyle}/>
            <label style={labelStyle}>생년월일</label>
            <div style={{background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"4px",
              display:"flex",gap:2,marginBottom:8}}>
              {[
                {val:birthYear, set:setBirthYear, placeholder:"연도",
                 opts:Array.from({length:70},(_,i)=>new Date().getFullYear()-i),
                 fmt:v=>v, flex:5},
                {val:birthMonth, set:setBirthMonth, placeholder:"월",
                 opts:Array.from({length:12},(_,i)=>i+1),
                 fmt:v=>v, flex:3},
                {val:birthDay, set:setBirthDay, placeholder:"일",
                 opts:Array.from({length:birthMonth&&birthYear?new Date(birthYear,birthMonth,0).getDate():31},(_,i)=>i+1),
                 fmt:v=>v, flex:3},
              ].map(({val,set,placeholder,opts,fmt,flex})=>(
                <select key={placeholder} value={val} onChange={e=>{set(e.target.value);setErr("");}}
                  style={{flex,background:"transparent",border:"none",
                    color:val?"#fff":"rgba(255,255,255,0.3)",
                    padding:"11px 4px",fontSize:13,outline:"none",fontFamily:"inherit",
                    cursor:"pointer",colorScheme:"dark",textAlign:"center"}}>
                  <option value="" disabled style={{background:"#2d2014"}}>{placeholder}</option>
                  {opts.map(o=>(
                    <option key={o} value={o} style={{background:"#2d2014",color:"#fff"}}>{fmt(o)}</option>
                  ))}
                </select>
              ))}
            </div>
            {birthYear&&birthMonth&&birthDay&&(
              <div style={{fontSize:12,color:"rgba(255,140,0,0.85)",fontWeight:700,
                marginBottom:8,textAlign:"center",letterSpacing:0.5}}>
                {birthYear} · {String(birthMonth).padStart(2,"0")} · {String(birthDay).padStart(2,"0")}
              </div>
            )}
            <label style={labelStyle}>성별</label>
            <div style={{display:"flex",gap:6,marginBottom:8}}>
              {["남성","여성"].map(g=>(
                <button key={g} onClick={()=>setGender(g)} style={{flex:1,padding:"11px 4px",
                  borderRadius:10,border:`1.5px solid ${gender===g?"#ff8c00":"rgba(255,255,255,0.15)"}`,
                  background:gender===g?"#ff8c00":"transparent",
                  color:gender===g?"#fff":"rgba(255,255,255,0.5)",
                  fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>{g}</button>
              ))}
            </div>
            {err&&<div style={{fontSize:12,color:"#ff6b6b",marginBottom:8,fontWeight:600}}>{err}</div>}
            <div style={{display:"flex",gap:6,marginTop:4}}>
              <button onClick={()=>{setStep(1);setErr("");}} style={{flex:1,padding:"13px",
                background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:12,color:"rgba(255,255,255,0.6)",fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                ← 이전
              </button>
              <button onClick={handleRegister} disabled={loading} style={{flex:2,padding:"13px",
                background:loading?"#555":"#ff8c00",border:"none",borderRadius:12,color:"#fff",
                fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:loading?"not-allowed":"pointer",
                boxShadow:"0 6px 20px rgba(255,140,0,0.4)"}}>
                {loading?"가입 중...":"가입 완료 →"}
              </button>
            </div>
          </>)}
        </div>

        <div style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginTop:14,lineHeight:1.7,textAlign:"center"}}>
          개인정보는 서비스 운영 목적으로만 사용돼요<br/>소중한 비밀번호는 사용하지 마세요
        </div>
      </div>
    </div>
  );
}

// 등록 모달 (드릴링 + 구매정보 + 표면관리 + 메모)
function RegModal({ ball, existing, onSave, onClose }) {
  const [form, setForm] = useState({
    nickname: existing?.nickname||"",
    weight: existing?.weight||15,
    grip: existing?.grip||"세미팁",
    drill_pin: existing?.drill_pin||"",
    drill_cg: existing?.drill_cg||"",
    drill_mb: existing?.drill_mb||"",
    drill_note: existing?.drill_note||"",
    purchase_date: existing?.purchase_date||"",
    purchase_price: existing?.purchase_price||"",
    memo: existing?.memo||"",
    surface_logs: existing?.surface_logs||[],
  });
  const [tab, setTab] = useState("basic");
  const [newLog, setNewLog] = useState({date:"",method:"",grit:"",note:""});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const addLog = () => {
    if (!newLog.date && !newLog.method) return;
    set("surface_logs", [...form.surface_logs, {...newLog, id:Date.now()}]);
    setNewLog({date:"",method:"",grit:"",note:""});
  };
  const removeLog = (id) => set("surface_logs", form.surface_logs.filter(l=>l.id!==id));
  const tabs = [{k:"basic",l:"기본"},{k:"drill",l:"드릴링"},{k:"purchase",l:"구매"},{k:"surface",l:"표면관리"}];
  const inputStyle = {width:"100%",background:"#f7f7fc",border:"1.5px solid #e2e2e0",borderRadius:10,
    color:"#333",padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
  const labelStyle = {fontSize:12,color:"#1c1c1e",fontWeight:700,letterSpacing:1.2,display:"block",marginBottom:4};
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,
      background:"rgba(10,10,30,0.6)",backdropFilter:"blur(14px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:16,overflowY:"auto"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#ffffff",borderRadius:24,padding:"22px 20px",width:"100%",maxWidth:400,
        boxShadow:"0 32px 80px rgba(0,0,0,0.25)",animation:"modalIn .28s cubic-bezier(.34,1.56,.64,1)",
        maxHeight:"90vh",overflowY:"auto"}}>
        <style>{`@keyframes modalIn{from{transform:scale(.88) translateY(20px);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <BallImg ball={ball} size={48}/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:"#6b6b7e",fontWeight:700,letterSpacing:1.5}}>{ball.brand.toUpperCase()}</div>
            <div style={{fontSize:17,fontWeight:800,color:"#111",lineHeight:1.1}}>{ball.name}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#ddd",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:16,background:"#f7f7fc",borderRadius:12,padding:4}}>
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"7px 4px",borderRadius:9,border:"none",
              fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .15s",
              background:tab===t.k?"#fff":"transparent",
              color:tab===t.k?"#111":"#999",
              boxShadow:tab===t.k?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>{t.l}</button>
          ))}
        </div>
        {tab==="basic" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={labelStyle}>볼 별명 (선택)</label>
              <input value={form.nickname} onChange={e=>set("nickname",e.target.value)} placeholder="나만의 이름" maxLength={20} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>무게</label>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {[10,11,12,13,14,15,16].map(w=>(
                  <button key={w} onClick={()=>set("weight",w)} style={{padding:"5px 10px",borderRadius:7,cursor:"pointer",
                    fontSize:13,fontWeight:700,border:"none",fontFamily:"inherit",
                    background:form.weight===w?ball.accent:"#e8ecf5",color:form.weight===w?"#fff":"#2d2d3d"}}>{w}lb</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>인서트</label>
              <div style={{display:"flex",gap:4}}>
                {["파워리프트","오발","세미팁"].map(o=>(
                  <button key={o} onClick={()=>set("grip",o)} style={{flex:1,padding:"7px",borderRadius:7,cursor:"pointer",
                    fontSize:12,fontWeight:700,border:"none",fontFamily:"inherit",
                    background:form.grip===o?ball.accent:"#e8ecf5",color:form.grip===o?"#fff":"#2d2d3d"}}>{o}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>메모</label>
              <textarea value={form.memo} onChange={e=>set("memo",e.target.value)} placeholder="레인 조건, 세팅 팁, 사용 기록..." rows={3}
                style={{...inputStyle,resize:"vertical"}}/>
            </div>
          </div>
        )}
        {tab==="drill" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:"#fff8f0",borderRadius:10,padding:"10px 12px",fontSize:12,color:"#e65100",fontWeight:600,lineHeight:1.6}}>
              💡 드릴링 레이아웃 정보를 기록해두면 나중에 동일하게 맞출 수 있어요
            </div>
            {[
              {k:"drill_pin",l:"PIN 각도",ph:"예) 45°, 60° PIN UP"},
              {k:"drill_cg",l:"CG 위치",ph:"예) CG 레프트 3/8인치"},
              {k:"drill_mb",l:"MB 각도",ph:"예) 90° MB, MB 위"},
            ].map(({k,l,ph})=>(
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inputStyle}/>
              </div>
            ))}
            <div>
              <label style={labelStyle}>드릴러 메모</label>
              <textarea value={form.drill_note} onChange={e=>set("drill_note",e.target.value)}
                placeholder="드릴러 이름, 핏 정보, 피치 등..." rows={3} style={{...inputStyle,resize:"vertical"}}/>
            </div>
          </div>
        )}
        {tab==="purchase" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={labelStyle}>구매일</label>
              <input type="date" value={form.purchase_date} onChange={e=>set("purchase_date",e.target.value)} style={inputStyle}/>
            </div>
            <div>
              <label style={labelStyle}>구매 가격 (원)</label>
              <input type="number" value={form.purchase_price} onChange={e=>set("purchase_price",e.target.value)}
                placeholder="예) 180000" style={inputStyle}/>
              {form.purchase_price && (
                <div style={{fontSize:12,color:"#ff8c00",fontWeight:700,marginTop:4}}>
                  {parseInt(form.purchase_price).toLocaleString()}원
                </div>
              )}
            </div>
          </div>
        )}
        {tab==="surface" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{fontWeight:700,fontSize:13,color:"#111"}}>관리 이력</div>
            {form.surface_logs.length === 0 && (
              <div style={{textAlign:"center",padding:"20px",color:"#ccc",fontSize:13}}>아직 기록이 없어요</div>
            )}
            {form.surface_logs.map(log=>(
              <div key={log.id} style={{background:"#f7f7fc",borderRadius:10,padding:"10px 12px",position:"relative"}}>
                <button onClick={()=>removeLog(log.id)} style={{position:"absolute",top:8,right:8,background:"none",
                  border:"none",color:"#ccc",fontSize:14,cursor:"pointer"}}>✕</button>
                <div style={{fontSize:12,fontWeight:700,color:"#ff8c00"}}>{log.date}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#111"}}>{log.method}{log.grit&&` (${log.grit})`}</div>
                {log.note&&<div style={{fontSize:12,color:"#666",marginTop:2}}>{log.note}</div>}
              </div>
            ))}
            <div style={{background:"#fff",border:"1.5px dashed #e2e2e0",borderRadius:12,padding:"12px"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#111",marginBottom:8}}>+ 새 기록 추가</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <input type="date" value={newLog.date} onChange={e=>setNewLog(l=>({...l,date:e.target.value}))} style={inputStyle}/>
                <div style={{display:"flex",gap:4}}>
                  {["샌딩","폴리싱","플러깅","디톡스"].map(m=>(
                    <button key={m} onClick={()=>setNewLog(l=>({...l,method:m}))} style={{flex:1,padding:"6px 4px",
                      borderRadius:7,border:"none",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",
                      background:newLog.method===m?ball.accent:"#e8ecf5",color:newLog.method===m?"#fff":"#2d2d3d"}}>{m}</button>
                  ))}
                </div>
                <input value={newLog.grit} onChange={e=>setNewLog(l=>({...l,grit:e.target.value}))}
                  placeholder="그릿 (예: 500, 2000)" style={inputStyle}/>
                <input value={newLog.note} onChange={e=>setNewLog(l=>({...l,note:e.target.value}))}
                  placeholder="메모 (선택)" style={inputStyle}/>
                <button onClick={addLog} style={{padding:"8px",background:"#1c1c1e",border:"none",borderRadius:9,
                  color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>기록 추가 ✓</button>
              </div>
            </div>
          </div>
        )}
        <button onClick={()=>onSave(form)} style={{
          marginTop:16,width:"100%",padding:"13px",background:ball.accent,border:"none",borderRadius:12,
          color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer",
          boxShadow:`0 6px 20px ${ball.accent}55`}}>
          {existing ? "수정 완료 ✓" : "내 장비로 등록하기 →"}
        </button>
      </div>
    </div>
  );
}

// 내 볼 플립 카드
function MyCard({ entry, ball, onRemove, onEdit }) {
  const [flip, setFlip] = useState(false);
  const d = ball.weightData?.[entry.weight] || ball.weightData?.[15] || ball.weightData?.[16];
  const oilLabel = ball.condition==="Heavy Oil"?"Heavy":ball.condition==="Medium-Heavy Oil"?"Med-Heavy":ball.condition==="Medium Oil"?"Medium":ball.condition==="Light-Medium Oil"?"Light-Med":"Light";
  const oilColor = ball.condition==="Heavy Oil"?"#ef5350":ball.condition==="Medium-Heavy Oil"?"#fb8c00":ball.condition==="Medium Oil"?"#fdd835":ball.condition==="Light-Medium Oil"?"#66bb6a":"#42a5f5";

  return (
    <div style={{perspective:1200,cursor:"pointer",marginBottom:0}} onClick={()=>setFlip(f=>!f)}>
      <div style={{position:"relative",width:"100%",transformStyle:"preserve-3d",
        transition:"transform .55s cubic-bezier(.4,0,.2,1)",
        transform:flip?"rotateY(180deg)":"none",minHeight:200}}>

        {/* ── 앞면 ── */}
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",
          borderRadius:20,overflow:"hidden",
          background:`linear-gradient(145deg,#fff 60%,${ball.accent}08)`,
          border:`1.5px solid ${ball.accent}30`,
          boxShadow:`0 4px 20px ${ball.accent}18`}}>
          {/* 상단 컬러 바 */}
          <div style={{height:4,background:`linear-gradient(90deg,${ball.accent},${ball.accent}88)`}}/>
          <div style={{padding:"12px 14px"}}>
            {/* 헤더: 이미지 + 볼 이름 */}
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
              {/* 볼 이미지 크게 */}
              <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",flexShrink:0,
                boxShadow:`0 6px 20px ${ball.accent}55`,border:`2.5px solid ${ball.accent}44`}}>
                <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={72} radius="50%"/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,color:"#999",fontWeight:700,letterSpacing:1.5,marginBottom:1}}>
                  {ball.brand.toUpperCase()}
                </div>
                <div style={{fontWeight:800,fontSize:14,color:"#111",lineHeight:1.25,marginBottom:4}}>
                  {ball.name}
                </div>
                {entry.nickname&&(
                  <div style={{fontSize:11,color:ball.accent,fontWeight:700,
                    background:`${ball.accent}12`,padding:"1px 7px",borderRadius:8,
                    display:"inline-block"}}>"{entry.nickname}"</div>
                )}
              </div>
              <span style={{fontSize:11,color:"#ccc",flexShrink:0}}>탭↺</span>
            </div>
            {/* 태그 행 */}
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8,
                background:`${ball.accent}15`,color:ball.accent}}>⚖️ {entry.weight}lb</span>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8,
                background:`${ball.accent}15`,color:ball.accent}}>🤙 {entry.grip||"세미팁"}</span>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8,
                background:`${oilColor}18`,color:oilColor}}>{oilLabel}</span>
            </div>
            {/* 수치 행 */}
            {d&&(
              <div style={{display:"flex",gap:0,background:"#f7f7fc",borderRadius:12,overflow:"hidden"}}>
                {[
                  {l:"RG",v:d.rg,accent:ball.accent},
                  {l:"DIFF",v:d.diff,accent:ball.accent},
                  ...(d.moi?[{l:"MOI",v:d.moi,accent:ball.accent}]:[]),
                ].map((x,i,arr)=>(
                  <div key={x.l} style={{flex:1,padding:"7px 0",textAlign:"center",
                    borderRight:i<arr.length-1?`1px solid #eee`:"none"}}>
                    <div style={{fontSize:9,color:"#aaa",fontWeight:700,letterSpacing:1}}>{x.l}</div>
                    <div style={{fontSize:14,fontWeight:900,color:x.accent}}>{x.v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 뒷면 ── */}
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",
          transform:"rotateY(180deg)",
          background:`linear-gradient(145deg,#1c1c1e,#2d2014)`,
          borderRadius:20,overflow:"hidden",
          boxShadow:`0 4px 20px rgba(0,0,0,0.2)`}}>
          <div style={{height:4,background:`linear-gradient(90deg,${ball.accent},${ball.accent}55)`}}/>
          <div style={{padding:"12px 14px",height:"calc(100% - 4px)",display:"flex",flexDirection:"column",boxSizing:"border-box"}}>
            <div style={{flex:1,overflowY:"auto"}}>
              {(entry.drill_pin||entry.drill_cg||entry.drill_mb)&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:9,color:ball.accent,fontWeight:800,letterSpacing:1.5,marginBottom:4}}>📌 DRILLING</div>
                  {entry.drill_pin&&<div style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginBottom:1}}>PIN: {entry.drill_pin}</div>}
                  {entry.drill_cg&&<div style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginBottom:1}}>CG: {entry.drill_cg}</div>}
                  {entry.drill_mb&&<div style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>MB: {entry.drill_mb}</div>}
                </div>
              )}
              {(entry.purchase_date||entry.purchase_price)&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:9,color:ball.accent,fontWeight:800,letterSpacing:1.5,marginBottom:4}}>💰 PURCHASE</div>
                  {entry.purchase_date&&<div style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginBottom:1}}>{entry.purchase_date}</div>}
                  {entry.purchase_price&&<div style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>{parseInt(entry.purchase_price).toLocaleString()}원</div>}
                </div>
              )}
              {entry.surface_logs?.length>0&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:9,color:ball.accent,fontWeight:800,letterSpacing:1.5,marginBottom:4}}>🔧 표면관리 {entry.surface_logs.length}회</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>
                    최근: {entry.surface_logs[entry.surface_logs.length-1]?.date} {entry.surface_logs[entry.surface_logs.length-1]?.method}
                  </div>
                </div>
              )}
              {entry.memo&&(
                <div>
                  <div style={{fontSize:9,color:ball.accent,fontWeight:800,letterSpacing:1.5,marginBottom:4}}>📝 MEMO</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.5}}>{entry.memo}</div>
                </div>
              )}
              {!entry.drill_pin&&!entry.purchase_date&&!entry.surface_logs?.length&&!entry.memo&&(
                <div style={{textAlign:"center",paddingTop:20,color:"rgba(255,255,255,0.25)",fontSize:12}}>
                  기록 없음 · ✏️ 수정으로 추가
                </div>
              )}
            </div>
            <div style={{display:"flex",gap:6,marginTop:10,flexShrink:0}}>
              <button onClick={e=>{e.stopPropagation();onEdit();}} style={{flex:1,padding:"8px",borderRadius:10,
                border:`1px solid ${ball.accent}55`,background:"transparent",color:ball.accent,
                cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit"}}>✏️ 수정</button>
              <button onClick={e=>{e.stopPropagation();onRemove();}} style={{flex:1,padding:"8px",borderRadius:10,
                border:"1px solid rgba(239,83,80,0.4)",background:"transparent",color:"#ef5350",
                cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit"}}>🗑️ 삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 상세 뷰
function Detail({ ball, onBack, inArsenal, onReg }) {
  const [tab, setTab] = useState("specs");
  const [selW, setSelW] = useState(16);
  const inA = inArsenal(ball.id);
  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      <button onClick={onBack} style={{background:"#ffffff",border:"1.5px solid #e2e2e0",color:"#2d2d3d",
        padding:"6px 14px",borderRadius:18,cursor:"pointer",fontWeight:700,fontSize:13,marginBottom:13,
        boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>← 목록</button>

      {/* 헤더 카드 */}
      <div style={{background:"#ffffff",borderRadius:22,overflow:"hidden",
        boxShadow:"0 2px 16px rgba(0,0,0,0.09)",marginBottom:11}}>
        <div style={{height:5,background:`linear-gradient(90deg,${ball.accent},${ball.accent}66)`}}/>
        <div style={{padding:"18px 16px"}}>
          <div style={{display:"flex",gap:15,alignItems:"flex-start",marginBottom:14}}>
            {/* 실제 볼 이미지 — 큰 사이즈 */}
            <div style={{flexShrink:0,width:108,height:108,borderRadius:"50%",overflow:"hidden",
              boxShadow:`0 8px 30px ${ball.accent}55`,border:`3px solid ${ball.accent}33`}}>
              <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={108} radius="50%"/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:"#1c1c1e",fontWeight:700,letterSpacing:2,marginBottom:2}}>{ball.brand.toUpperCase()}</div>
              <div style={{fontWeight:700,fontSize:22,color:"#111",lineHeight:1.2,marginBottom:4}}>{ball.name}</div>
              <div style={{fontSize:13,color:"#1c1c1e",marginBottom:7}}>
                {ball.releaseDate}{ball.fragrance?` · 🍒 ${ball.fragrance}`:""}
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {[ball.cover,ball.coreType,ball.condition].map(t=>(
                  <span key={t} style={{fontSize:13,fontWeight:700,letterSpacing:.8,padding:"2px 7px",
                    borderRadius:4,background:`${ball.accent}14`,color:ball.accent,textTransform:"uppercase"}}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <p style={{fontSize:12,color:"#2d2d3d",lineHeight:1.7,marginBottom:13}}>{ball.description}</p>
          {/* bowwwl 링크 버튼 삭제 — 내 장비함 버튼만 */}
          <button onClick={()=>onReg(ball)} style={{
            width:"100%",padding:"12px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",
            background:inA?`${ball.accent}14`:ball.accent,
            border:`1.5px solid ${inA?ball.accent+"44":"transparent"}`,
            color:inA?ball.accent:"#fff",fontWeight:800,fontSize:13,
            boxShadow:inA?"none":`0 4px 16px ${ball.accent}55`}}>
            {inA?"✓ 장비함 등록됨":"+ 내 장비함에 추가"}
          </button>
        </div>
      </div>

      {/* 탭 */}
      <div style={{display:"flex",gap:6,marginBottom:11}}>
        {[{k:"specs",l:"📊 스펙"},{k:"weights",l:"⚖️ 파운드별"},{k:"core",l:"🫀 코어"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            flex:1,padding:"9px",borderRadius:11,cursor:"pointer",fontWeight:800,fontSize:13,
            border:"none",fontFamily:"inherit",
            background:tab===t.k?"#1e293b":"#fff",color:tab===t.k?"#fff":"#2d2d3d",
            boxShadow:tab===t.k?"0 4px 14px rgba(30,41,59,0.30)":"0 1px 4px rgba(0,0,0,0.06)"}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* 스펙 탭 */}
      {tab==="specs"&&(
        <div style={{background:"#ffffff",borderRadius:18,padding:"16px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.07)",animation:"fadeUp .22s ease both"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
            {[{l:"커버스탁",v:ball.cover},{l:"코어 타입",v:ball.coreType},
              {l:"코어 이름",v:ball.coreName},{l:"마감 처리",v:ball.finish},
              {l:"오일 조건",v:ball.condition},{l:"출시일",v:ball.releaseDate}].map(s=>(
              <div key={s.l} style={{background:"#f8f8fc",borderRadius:11,padding:"9px 12px"}}>
                <div style={{fontSize:12,color:"#4a4a5a",fontWeight:700,letterSpacing:1.5,marginBottom:4}}>{s.l.toUpperCase()}</div>
                <div style={{fontSize:15,color:"#1a1a2e",fontWeight:800,fontFamily:"'Inter',sans-serif"}}>{s.v}</div>
              </div>
            ))}
          </div>
          {ball.weightData[16]&&[
            {l:"RG (15lb)",v:(ball.weightData[15]||ball.weightData[16]).rg,mx:2.80,mn:2.40,d:"낮을수록 빠른 회전 시작"},
            {l:"Diff (15lb)",v:(ball.weightData[15]||ball.weightData[16]).diff,mx:0.060,mn:0,d:"높을수록 강한 훅 포텐셜"},
          ].map(s=>(
            <div key={s.l} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:13,color:"#3d3d50",fontWeight:700}}>{s.l}</span>
                <span style={{fontSize:22,fontWeight:800,color:ball.accent}}>{s.v}</span>
              </div>
              <div style={{height:7,background:"#f0f2f8",borderRadius:4,overflow:"hidden",marginBottom:3}}>
                <div style={{height:"100%",borderRadius:4,
                  width:`${((s.v-s.mn)/(s.mx-s.mn))*100}%`,
                  background:`linear-gradient(90deg,${ball.accent}66,${ball.accent})`}}/>
              </div>
              <div style={{fontSize:12,color:"#6b6b7e"}}>{s.d}</div>
            </div>
          ))}
        </div>
      )}

      {/* 파운드별 탭 */}
      {tab==="weights"&&(
        <div style={{background:"#ffffff",borderRadius:18,padding:"16px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.07)",animation:"fadeUp .22s ease both"}}>
          <div style={{fontSize:13,color:"#2d2d3d",fontWeight:700,letterSpacing:2,marginBottom:14,fontFamily:"'Inter',sans-serif"}}>파운드별 코어 데이터</div>
          <WeightTable ball={ball} sel={selW} onSel={setSelW}/>
        </div>
      )}

      {/* 코어 탭 — 실제 코어 이미지 */}
      {tab==="core"&&(
        <div style={{background:"#ffffff",borderRadius:18,padding:"16px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.07)",animation:"fadeUp .22s ease both"}}>
          <div style={{fontSize:13,color:"#2d2d3d",fontWeight:700,letterSpacing:2,marginBottom:12,fontFamily:"'Inter',sans-serif"}}>
            {ball.coreName.toUpperCase()} CORE
          </div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <div style={{width:200,height:200,borderRadius:20,overflow:"hidden",
              background:"linear-gradient(135deg,#f5f5fc,#e2e2e0)",
              border:"1.5px solid #e8e8f4",boxShadow:`0 8px 24px ${ball.accent}22`}}>
              <BowwwlImg src={BOWWWL_CORE(ball.coreSlug)} alt={ball.coreName+" Core"} size={200} radius="20px"/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{l:"코어 타입",v:ball.coreType},{l:"코어 이름",v:ball.coreName}].map(s=>(
              <div key={s.l} style={{background:`${ball.accent}09`,borderRadius:11,padding:"12px",
                border:`1.5px solid ${ball.accent}18`,textAlign:"center"}}>
                <div style={{fontSize:12,color:"#4a4a5a",fontWeight:700,letterSpacing:1.5,marginBottom:6}}>{s.l.toUpperCase()}</div>
                <div style={{fontSize:18,fontWeight:700,color:ball.accent,fontFamily:"'Inter',sans-serif",letterSpacing:.5}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



// ══ 볼링공 비교 컴포넌트 ══
function CompareView({ cmpList, setCmpList, toggleCmp, setView }) {
  const [selW, setSelW] = useState(15);
  const allWeights = [16,15,14,13,12];

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
        <div style={{fontWeight:800,fontSize:22,color:"#111"}}>볼링공 비교</div>
        {cmpList.length>0&&(
          <button onClick={()=>setCmpList([])} style={{
            padding:"6px 14px",borderRadius:18,border:"1.5px solid #ef5350",
            background:"#fff",color:"#ef5350",fontFamily:"inherit",
            fontSize:12,fontWeight:700,cursor:"pointer"}}>
            🗑️ 초기화
          </button>
        )}
      </div>
      <p style={{fontSize:13,color:"#1c1c1e",marginBottom:14}}>
        {cmpList.length===0?"볼링공 탭에서 + 비교 버튼으로 최대 3개 선택":`${cmpList.length}개 비교 중`}
      </p>

      {cmpList.length===0?(
        <div style={{textAlign:"center",padding:"50px 20px",background:"#ffffff",border:"2px dashed #e2e2e0",borderRadius:18}}>
          <div style={{fontSize:40,marginBottom:10,opacity:.22}}>⚖️</div>
          <div style={{fontWeight:800,fontSize:17,color:"#ddd"}}>선택된 볼 없음</div>
          <button onClick={()=>setView("balls")} style={{marginTop:13,padding:"8px 20px",background:"#1c1c1e",
            border:"none",color:"#fff",borderRadius:18,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit",
            boxShadow:"0 3px 10px rgba(15,37,87,.28)"}}>볼링공 리스트로 →</button>
        </div>
      ):(
        <>
          {/* 파운드 선택 */}
          <div style={{background:"#fff",borderRadius:14,padding:"12px 14px",
            boxShadow:"0 1px 8px rgba(0,0,0,.06)",marginBottom:11}}>
            <div style={{fontSize:12,color:"#1c1c1e",fontWeight:700,letterSpacing:1.5,marginBottom:8}}>파운드 선택</div>
            <div style={{display:"flex",gap:6}}>
              {allWeights.map(w=>(
                <button key={w} onClick={()=>setSelW(w)} style={{
                  flex:1,padding:"7px 4px",borderRadius:9,cursor:"pointer",fontWeight:700,fontSize:13,
                  border:"none",fontFamily:"'Inter',sans-serif",
                  background:selW===w?"#1c1c1e":"#e8ecf5",
                  color:selW===w?"#fff":"#1c1c1e",
                  boxShadow:selW===w?"0 3px 10px rgba(55,65,81,.3)":"none"}}>
                  {w}lb
                </button>
              ))}
            </div>
          </div>

          {/* 볼 카드 그리드 */}
          <div style={{display:"grid",gridTemplateColumns:`repeat(${cmpList.length},1fr)`,gap:8}}>
            {cmpList.map(ball=>{
              const d = ball.weightData[selW] || ball.weightData[16];
              return (
                <div key={ball.id} style={{background:"#ffffff",borderRadius:16,overflow:"hidden",
                  boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}>
                  <div style={{height:4,background:ball.accent}}/>
                  <div style={{padding:"7px 6px 6px",textAlign:"center",borderBottom:"1px solid #f5f5f8"}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>
                      <div style={{width:44,height:44,borderRadius:"50%",overflow:"hidden",
                        boxShadow:`0 3px 10px ${ball.accent}44`,border:`2px solid ${ball.accent}33`}}>
                        <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={44} radius="50%"/>
                      </div>
                    </div>
                    <div style={{fontSize:9,color:"#4a4a5a",fontWeight:700,letterSpacing:1}}>{ball.brand.toUpperCase()}</div>
                    <div style={{fontWeight:800,fontSize:10,color:"#111",lineHeight:1.2,marginBottom:3,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{ball.name}</div>
                    <button onClick={()=>toggleCmp(ball)} style={{padding:"1px 7px",
                      background:"#f3f4f6",border:"none",color:"#1c1c1e",borderRadius:5,cursor:"pointer",
                      fontWeight:700,fontSize:10,fontFamily:"inherit"}}>제거</button>
                  </div>
                  {/* 코어 이미지 */}
                  <div style={{padding:"5px",borderBottom:"1px solid #f8f8fc",display:"flex",justifyContent:"center"}}>
                    <div style={{width:38,height:38,borderRadius:7,overflow:"hidden",
                      background:"#f5f5f8",border:"1px solid #e2e2e0"}}>
                      <BowwwlImg src={BOWWWL_CORE(ball.coreSlug)} alt="Core" size={38} radius="7px"/>
                    </div>
                  </div>
                  <div style={{padding:"5px 6px"}}>
                    {[
                      {k:"RG",v:d?.rg||"-"},
                      {k:"Diff",v:d?.diff||"-"},
                      {k:"Cover",v:ball.cover},
                      {k:"Core",v:ball.coreType}
                    ].map(r=>(
                      <div key={r.k} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",
                        borderBottom:"1px solid #f8f8fc",fontSize:10}}>
                        <span style={{color:"#6b6b7e",fontWeight:700}}>{r.k}</span>
                        <span style={{color:"#111",fontWeight:700,textAlign:"right",
                          maxWidth:"60%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 수치 비교 바 */}
          {cmpList.length>1&&(
            <div style={{marginTop:11,background:"#ffffff",borderRadius:14,padding:"14px 16px",
              boxShadow:"0 1px 8px rgba(0,0,0,.06)"}}>
              <div style={{fontSize:13,color:"#1c1c1e",fontWeight:700,letterSpacing:2,marginBottom:10}}>
                수치 비교 ({selW}lb)
              </div>
              {[{l:"RG",k:"rg",mx:2.8,mn:2.4},{l:"DIFF",k:"diff",mx:.06,mn:0}].map(m=>(
                <div key={m.k} style={{marginBottom:12}}>
                  <div style={{fontSize:13,color:"#1c1c1e",fontWeight:700,letterSpacing:1.3,marginBottom:7}}>{m.l}</div>
                  {cmpList.map(ball=>{
                    const d = ball.weightData[selW] || ball.weightData[16];
                    return (
                      <div key={ball.id} style={{marginBottom:5}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                          <span style={{fontSize:12,color:"#3d3d50"}}>{ball.name}</span>
                          <span style={{fontSize:12,color:ball.accent,fontWeight:800}}>{d?.[m.k]||"-"}</span>
                        </div>
                        <div className="sbar">
                          <div style={{height:"100%",borderRadius:3,
                            width:`${(((d?.[m.k]||m.mn)-m.mn)/(m.mx-m.mn))*100}%`,
                            background:`linear-gradient(90deg,${ball.accent}77,${ball.accent})`}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

        </>
      )}
    </div>
  );
}

// ══ 관리자 유튜브 채널 관리 뷰 ════════════════════════
function AdminYoutubeView({ showToast, onBack }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [handle, setHandle] = useState("");       // @핸들 입력
  const [preview, setPreview] = useState(null);   // 조회된 채널 미리보기
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    sbGet("youtube_channels","order=created_at.desc")
      .then(d=>{ setChannels(d||[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  // @핸들로 채널 조회
  const searchChannel = async () => {
    if(!handle.trim()) return;
    setSearching(true);
    setPreview(null);
    try {
      const res = await fetch("/api/youtube", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({handle:handle.trim()})
      });
      const data = await res.json();
      if(!data.success || data.error) {
        showToast(data.error||"채널을 찾을 수 없어요","#ef5350");
      } else {
        setPreview(data);
      }
    } catch(e){ showToast("조회 오류","#ef5350"); }
    setSearching(false);
  };

  // 채널 등록
  const addChannel = async () => {
    if(!preview) return;
    setSaving(true);
    try {
      await sbInsert("youtube_channels",{
        name:preview.channelName,
        channel_id:preview.channelId,
        channel_url:preview.channelUrl,
        is_active:true
      });
      setHandle(""); setPreview(null); setShowAdd(false);
      load();
      sessionStorage.removeItem("bowling_videos");
      sessionStorage.removeItem("bowling_videos_time");
      showToast(`${preview.channelName} 채널 추가 완료! 🎥`);
    } catch(e){
      showToast("이미 등록된 채널이거나 오류가 발생했어요","#fb8c00");
    }
    setSaving(false);
  };

  const toggleActive = async (ch) => {
    try {
      await sbFetch(`/youtube_channels?id=eq.${ch.id}`,{
        method:"PATCH",
        body:JSON.stringify({is_active:!ch.is_active}),
        prefer:"return=representation"
      });
      setChannels(prev=>prev.map(c=>c.id===ch.id?{...c,is_active:!c.is_active}:c));
      sessionStorage.removeItem("bowling_videos");
      sessionStorage.removeItem("bowling_videos_time");
      showToast(ch.is_active?"채널 비활성화":"채널 활성화 완료");
    } catch(e){ showToast("오류 발생","#ef5350"); }
  };

  const deleteChannel = async (ch) => {
    if(!window.confirm(`"${ch.name}" 채널을 삭제할까요?`)) return;
    try {
      await sbFetch(`/youtube_channels?id=eq.${ch.id}`,{method:"DELETE"});
      setChannels(prev=>prev.filter(c=>c.id!==ch.id));
      sessionStorage.removeItem("bowling_videos");
      sessionStorage.removeItem("bowling_videos_time");
      showToast("채널 삭제 완료");
    } catch(e){ showToast("오류 발생","#ef5350"); }
  };

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      {/* 헤더 */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:"none",
          color:"#aaa",cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0}}>
          ← 홈
        </button>
        <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e"}}>📡 유튜브 채널 관리</div>
      </div>

      {/* 채널 추가 */}
      <button onClick={()=>{setShowAdd(s=>!s);setPreview(null);setHandle("");}}
        style={{width:"100%",padding:"10px",
          background:showAdd?"#f5f5f5":"rgba(30,136,229,0.08)",
          border:"1px dashed rgba(30,136,229,0.4)",borderRadius:12,
          color:"#1e88e5",fontFamily:"inherit",fontSize:13,fontWeight:700,
          cursor:"pointer",marginBottom:12}}>
        {showAdd?"✕ 닫기":"+ 채널 추가"}
      </button>

      {showAdd&&(
        <div style={{background:"#f7f9ff",borderRadius:14,padding:"14px",
          marginBottom:14,border:"1px solid rgba(30,136,229,0.2)"}}>
          <div style={{fontSize:12,color:"#666",marginBottom:10,lineHeight:1.7}}>
            유튜브 채널 페이지에서 <b>URL을 복사</b>해서 붙여넣으세요<br/>
            예) https://www.youtube.com/<b>@BOWLINGMANIA</b>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input value={handle} onChange={e=>setHandle(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&searchChannel()}
              placeholder="유튜브 채널 URL 붙여넣기"
              style={{flex:1,background:"#fff",border:"1px solid #e0e8ff",
                borderRadius:10,color:"#1c1c1e",padding:"9px 12px",fontSize:13,
                outline:"none",fontFamily:"inherit"}}/>
            <button onClick={searchChannel} disabled={searching||!handle.trim()}
              style={{padding:"9px 16px",background:searching?"#ccc":"#1e88e5",
                border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",
                fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              {searching?"조회 중...":"채널 조회"}
            </button>
          </div>

          {/* 채널 미리보기 */}
          {preview&&(
            <div style={{background:"#fff",borderRadius:12,padding:"12px 14px",
              border:"1px solid rgba(30,136,229,0.3)",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                {preview.thumbnail&&(
                  <img src={preview.thumbnail} alt={preview.channelName}
                    style={{width:40,height:40,borderRadius:"50%",objectFit:"cover"}}/>
                )}
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#111"}}>
                    {preview.channelName}
                  </div>
                  <div style={{fontSize:11,color:"#aaa"}}>{preview.channelId}</div>
                </div>
                <span style={{marginLeft:"auto",fontSize:10,background:"rgba(67,160,71,0.1)",
                  color:"#43a047",padding:"2px 8px",borderRadius:6,fontWeight:700}}>
                  ✓ 확인됨
                </span>
              </div>
              <button onClick={addChannel} disabled={saving}
                style={{width:"100%",padding:"10px",background:"#1e88e5",
                  border:"none",borderRadius:10,color:"#fff",fontFamily:"inherit",
                  fontSize:13,fontWeight:700,cursor:"pointer"}}>
                {saving?"추가 중...":"이 채널 추가하기"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 채널 목록 */}
      <div style={{fontSize:11,color:"#aaa",fontWeight:700,letterSpacing:1,marginBottom:8}}>
        등록된 채널 ({channels.length}개)
      </div>

      {loading?(
        <div style={{textAlign:"center",padding:"30px",color:"#aaa"}}>로딩 중...</div>
      ):channels.length===0?(
        <div style={{textAlign:"center",padding:"40px",background:"#f7f7f7",
          borderRadius:16,border:"2px dashed #e0e0e0"}}>
          <div style={{fontSize:32,marginBottom:8}}>📡</div>
          <div style={{fontSize:13,color:"#aaa"}}>등록된 채널이 없어요</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {channels.map(ch=>(
            <div key={ch.id} style={{background:"#fff",borderRadius:14,
              padding:"12px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
              border:`1px solid ${ch.is_active?"rgba(30,136,229,0.2)":"#f0f0f0"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,
                  background:ch.is_active?"rgba(255,0,0,0.1)":"#f5f5f5",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:16}}>▶</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#111",marginBottom:2}}>
                    {ch.name}
                  </div>
                  {ch.channel_url&&(
                    <a href={ch.channel_url} target="_blank" rel="noreferrer"
                      onClick={e=>e.stopPropagation()}
                      style={{fontSize:11,color:"#1e88e5",textDecoration:"none"}}>
                      {ch.channel_url.replace("https://","").replace("www.","")} →
                    </a>
                  )}
                </div>
                <div style={{display:"flex",gap:5,flexShrink:0}}>
                  <button onClick={()=>toggleActive(ch)} style={{
                    padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",
                    fontFamily:"inherit",fontSize:11,fontWeight:700,
                    background:ch.is_active?"rgba(67,160,71,0.12)":"rgba(0,0,0,0.06)",
                    color:ch.is_active?"#43a047":"#999"}}>
                    {ch.is_active?"ON":"OFF"}
                  </button>
                  <button onClick={()=>deleteChannel(ch)} style={{
                    padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",
                    fontFamily:"inherit",fontSize:11,fontWeight:700,
                    background:"rgba(239,83,80,0.1)",color:"#ef5350"}}>
                    삭제
                  </button>
                </div>
              </div>
              {!ch.is_active&&(
                <div style={{marginTop:6,fontSize:10,color:"#bbb",
                  paddingTop:6,borderTop:"1px solid #f5f5f5"}}>
                  ⚠️ 비활성화 - 홈화면에 영상이 표시되지 않아요
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ══ 관리자 최신볼링공 관리 뷰 ══════════════════════════
function AdminLatestView({ showToast, onBack }) {
  const [search, setSearch] = useState("");

  // releaseDate 파싱
  const parseDate = (d) => {
    if(!d) return 0;
    const [mon, yr] = d.split(" ");
    const months = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,
      Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
    return (parseInt(yr)||0)*100 + (months[mon]||0);
  };

  const sorted = [...ALL_BALLS]
    .sort((a,b)=>parseDate(b.releaseDate)-parseDate(a.releaseDate));

  const filtered = sorted.filter(b=>
    !search ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      {/* 헤더 */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:"none",
          color:"#aaa",cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0}}>
          ← 홈
        </button>
        <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e"}}>🔥 최신 볼링공 현황</div>
      </div>

      <div style={{background:"rgba(255,140,0,0.08)",borderRadius:12,padding:"10px 14px",
        marginBottom:14,border:"1px solid rgba(255,140,0,0.2)"}}>
        <div style={{fontSize:12,color:"#ff8c00",fontWeight:700,marginBottom:4}}>
          📌 홈화면 노출 TOP 5
        </div>
        {sorted.slice(0,5).map((b,i)=>(
          <div key={b.id} style={{fontSize:12,color:"#1c1c1e",padding:"2px 0",
            display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontWeight:800,color:"#ff8c00",width:16}}>{i+1}</span>
            <span style={{fontWeight:700}}>{b.brand} {b.name}</span>
            <span style={{color:"#aaa",marginLeft:"auto"}}>{b.releaseDate}</span>
          </div>
        ))}
      </div>

      <div style={{fontSize:12,color:"#aaa",marginBottom:10}}>
        최신 출시순 전체 목록 ({ALL_BALLS.length}개) · 새 볼 추가 시 자동 반영
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="볼 이름, 브랜드 검색..."
        style={{width:"100%",background:"#f7f7f7",border:"1px solid #e8e8e8",
          borderRadius:12,color:"#1c1c1e",padding:"9px 14px",fontSize:13,
          outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}/>

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {filtered.map((ball,i)=>(
          <div key={ball.id} style={{background:"#fff",borderRadius:12,
            padding:"10px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            border:`1px solid ${i<5?"rgba(255,140,0,0.2)":"#f0f0f0"}`,
            display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
              background:i<5?"#ff8c00":"#f0f0f0",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,fontWeight:900,color:i<5?"#fff":"#aaa"}}>
              {i+1}
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",overflow:"hidden",flexShrink:0}}>
              <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={36} radius="50%"/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:1}}>
                {ball.brand.toUpperCase()}
              </div>
              <div style={{fontSize:13,fontWeight:700,color:"#111",
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {ball.name}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:11,color:i<5?"#ff8c00":"#aaa",fontWeight:700}}>
                {ball.releaseDate}
              </div>
              {i<5&&<div style={{fontSize:9,color:"#ff8c00",fontWeight:700}}>홈 노출</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ 관리자 인기순위 관리 뷰 ════════════════════════════
function AdminPopularityView({ dbPopularity, setDbPopularity, showToast, onBack }) {
  const [balls, setBalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(()=>{
    // DB에서 현재 순위 로드
    sbGet("ball_popularity","order=score.desc")
      .then(d=>{
        setBalls(d||[]);
        setLoading(false);
      }).catch(()=>setLoading(false));
  },[]);

  const updateScore = async (ball, newScore) => {
    const score = Math.min(100, Math.max(0, Number(newScore)));
    setSaving(ball.ball_id);
    try {
      await sbFetch(`/ball_popularity?ball_id=eq.${ball.ball_id}`,{
        method:"PATCH",
        body:JSON.stringify({score, updated_at:new Date().toISOString()}),
        prefer:"return=representation"
      });
      // 로컬 state 업데이트
      setBalls(prev=>prev.map(b=>b.ball_id===ball.ball_id?{...b,score}:b)
        .sort((a,b2)=>b2.score-a.score));
      setDbPopularity(prev=>({...prev,[ball.ball_name]:score}));
      showToast(`${ball.ball_name} 순위 업데이트 완료!`);
    } catch(e){ showToast("저장 오류","#ef5350"); }
    setSaving(null);
  };

  const addBall = async (ballName, ballId) => {
    // 새 볼 인기순위 추가
    try {
      const res = await sbInsert("ball_popularity",{
        ball_id:ballId, ball_name:ballName, score:50
      });
      setBalls(prev=>[...prev,{ball_id:ballId,ball_name:ballName,score:50}]
        .sort((a,b)=>b.score-a.score));
      setDbPopularity(prev=>({...prev,[ballName]:50}));
      showToast(`${ballName} 추가 완료!`);
    } catch(e){ showToast("이미 등록된 볼이에요","#fb8c00"); }
  };

  const filteredBalls = balls.filter(b=>
    b.ball_name.toLowerCase().includes(search.toLowerCase())
  );

  // DB에 없는 ALL_BALLS 목록
  const registeredIds = new Set(balls.map(b=>b.ball_id));

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      {/* 헤더 */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:"none",
          color:"#aaa",cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0}}>
          ← 홈
        </button>
        <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e"}}>🔥 인기순위 관리</div>
      </div>

      <div style={{fontSize:12,color:"#aaa",marginBottom:12}}>
        점수 0~100 | 높을수록 상위 노출 | TOP 5가 홈화면에 표시
      </div>

      {/* 검색 */}
      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="볼 이름 검색..."
        style={{width:"100%",background:"#f7f7f7",border:"1px solid #e8e8e8",
          borderRadius:12,color:"#1c1c1e",padding:"9px 14px",fontSize:13,
          outline:"none",fontFamily:"inherit",marginBottom:12,boxSizing:"border-box"}}/>

      {loading?(
        <div style={{textAlign:"center",padding:"30px",color:"#aaa"}}>로딩 중...</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {filteredBalls.map((ball,i)=>(
            <div key={ball.ball_id} style={{background:"#fff",borderRadius:14,
              padding:"10px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.06)",
              border:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:10}}>
              {/* 순위 */}
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                background:i<5?"#ff8c00":"#f0f0f0",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:900,color:i<5?"#fff":"#aaa"}}>{i+1}</div>
              {/* 볼 이름 */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:"#111",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {ball.ball_name}
                </div>
              </div>
              {/* 점수 입력 */}
              <input
                type="number" min={0} max={100}
                defaultValue={ball.score}
                onBlur={e=>e.target.value!==String(ball.score)&&updateScore(ball,e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&updateScore(ball,e.target.value)}
                style={{width:56,background:"#f7f7f7",border:"1px solid #e8e8e8",
                  borderRadius:8,color:"#1c1c1e",padding:"5px 8px",fontSize:13,
                  outline:"none",fontFamily:"inherit",textAlign:"center"}}/>
              {saving===ball.ball_id&&(
                <span style={{fontSize:11,color:"#43a047"}}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DB에 없는 볼 추가 */}
      {search && ALL_BALLS.filter(b=>
        b.name.toLowerCase().includes(search.toLowerCase()) &&
        !registeredIds.has(b.id)
      ).length > 0 && (
        <div style={{marginTop:8}}>
          <div style={{fontSize:11,color:"#aaa",marginBottom:6}}>미등록 볼 추가:</div>
          {ALL_BALLS.filter(b=>
            b.name.toLowerCase().includes(search.toLowerCase()) &&
            !registeredIds.has(b.id)
          ).slice(0,5).map(b=>(
            <button key={b.id} onClick={()=>addBall(b.name,b.id)}
              style={{display:"block",width:"100%",padding:"9px 14px",marginBottom:6,
                background:"rgba(255,140,0,0.06)",border:"1px dashed rgba(255,140,0,0.3)",
                borderRadius:12,color:"#ff8c00",fontFamily:"inherit",fontSize:12,
                fontWeight:700,cursor:"pointer",textAlign:"left"}}>
              + {b.brand} {b.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ══ 관리자 공지사항 패널 ════════════════════════════════
function AdminNoticePanel({ notices, setNotices, showToast }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if(!title.trim()) return;
    setSaving(true);
    try {
      const res = await sbInsert("notices", {title:title.trim(), content:body.trim(), is_active:true});
      setNotices(prev=>[...(res||[]), ...prev]);
      setTitle(""); setBody(""); setShow(false);
      showToast("공지사항 등록 완료! 📢");
    } catch(e){ showToast("오류 발생","#ef5350"); }
    setSaving(false);
  };

  return (
    <div style={{marginBottom:8}}>
      <button onClick={()=>setShow(s=>!s)} style={{
        width:"100%",padding:"8px 14px",
        background:show?"#f5f5f5":"rgba(255,140,0,0.08)",
        border:"1px dashed rgba(255,140,0,0.4)",borderRadius:12,
        color:"#ff8c00",fontFamily:"inherit",fontSize:12,fontWeight:700,
        cursor:"pointer",display:"flex",alignItems:"center",gap:6,
        justifyContent:"center"}}>
        <span>{show?"✕ 닫기":"📢 공지사항 추가"}</span>
      </button>
      {show&&(
        <div style={{background:"rgba(255,140,0,0.06)",borderRadius:14,padding:"12px",
          marginTop:6,border:"1px solid rgba(255,140,0,0.2)"}}>
          <input value={title} onChange={e=>setTitle(e.target.value)}
            placeholder="공지 제목"
            style={{width:"100%",background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,
              color:"#fff",padding:"8px 12px",fontSize:13,outline:"none",
              fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}/>
          <textarea value={body} onChange={e=>setBody(e.target.value)}
            placeholder="공지 내용" rows={2}
            style={{width:"100%",background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,
              color:"#fff",padding:"8px 12px",fontSize:13,outline:"none",
              fontFamily:"inherit",resize:"none",marginBottom:8,boxSizing:"border-box"}}/>
          <button onClick={save} disabled={saving} style={{
            width:"100%",padding:"9px",background:"#ff8c00",border:"none",
            borderRadius:10,color:"#fff",fontFamily:"inherit",
            fontSize:13,fontWeight:700,cursor:"pointer"}}>
            {saving?"등록 중...":"등록"}
          </button>
        </div>
      )}
    </div>
  );
}

// ══ 게시판 미리보기 (홈용) ══════════════════════════════
function BoardPreview({ nickname, onLoginRequest }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    sbGet("posts","order=created_at.desc&limit=3")
      .then(d=>setPosts(d||[]))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[]);

  if(loading) return <div style={{textAlign:"center",padding:"16px",color:"rgba(255,255,255,0.3)",fontSize:12}}>불러오는 중...</div>;
  if(!posts.length) return (
    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"16px",textAlign:"center"}}>
      <div style={{color:"#aaa",fontSize:12,marginBottom:8}}>아직 게시물이 없어요</div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {posts.map(p=>(
        <div key={p.id} style={{background:"#fff",borderRadius:12,
          padding:"10px 14px",border:"1px solid #e8e8e8",
          boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:3,
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:"#999"}}>{p.nickname}</span>
            <span style={{fontSize:10,color:"#ccc"}}>·</span>
            <span style={{fontSize:10,color:"#999"}}>
              {new Date(p.created_at).toLocaleDateString("ko-KR",{month:"short",day:"numeric"})}
            </span>
            {p.likes>0&&<span style={{fontSize:10,color:"#ff8c00",marginLeft:"auto"}}>❤️ {p.likes}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ══ 볼링 영상 게시판 ════════════════════════════════════
const BOWLING_VIDEOS = [
  {id:"yEBK3jAHbeU",title:"[PBA 투어] Jason Belmonte 퍼펙트게임 300점",channel:"PBA Bowling",thumb:"https://img.youtube.com/vi/yEBK3jAHbeU/mqdefault.jpg"},
  {id:"T7FBLxKBWpk",title:"볼링 스페어 처리 완벽 가이드 - 핀별 조준법",channel:"Bowling University",thumb:"https://img.youtube.com/vi/T7FBLxKBWpk/mqdefault.jpg"},
  {id:"Fy1TDZlgcpQ",title:"Storm vs Motiv vs Hammer 볼 비교 리뷰",channel:"BowlersMart",thumb:"https://img.youtube.com/vi/Fy1TDZlgcpQ/mqdefault.jpg"},
  {id:"HFoHRGlHric",title:"볼링 훅볼 마스터하기 - 릴리즈 완벽 분석",channel:"Radical Bowling",thumb:"https://img.youtube.com/vi/HFoHRGlHric/mqdefault.jpg"},
  {id:"FCNX_j7BAsQ",title:"오일 패턴별 라인 공략법 - 하우스부터 스포츠샷",channel:"MOTIV Bowling",thumb:"https://img.youtube.com/vi/FCNX_j7BAsQ/mqdefault.jpg"},
];

function VideoBoard({ preview=false }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    const cached = sessionStorage.getItem("bowling_videos");
    const cachedTime = sessionStorage.getItem("bowling_videos_time");
    if(cached && cachedTime && Date.now()-Number(cachedTime)<3600000){
      setVideos(JSON.parse(cached).slice(0,5));
      setLoading(false);
      return;
    }
    fetch("/api/youtube")
      .then(r=>r.json())
      .then(d=>{
        if(d.success && d.videos?.length){
          const v = d.videos.slice(0,5);
          setVideos(v);
          sessionStorage.setItem("bowling_videos", JSON.stringify(v));
          sessionStorage.setItem("bowling_videos_time", String(Date.now()));
        } else {
          setError(d.error||"영상을 불러올 수 없어요");
        }
      })
      .catch(()=>setError("네트워크 오류"))
      .finally(()=>setLoading(false));
  },[]);

  const openVideo = (v)=>{
    setPlaying(v);
    document.body.style.overflow="hidden";
  };
  const closeVideo = ()=>{
    setPlaying(null);
    document.body.style.overflow="";
  };

  if(loading) return (
    <div style={{textAlign:"center",padding:"16px",color:"#aaa",fontSize:12}}>영상 불러오는 중...</div>
  );
  if(error) return (
    <div style={{background:"#fff3e0",borderRadius:12,padding:"12px 14px",
      fontSize:12,color:"#e65100",border:"1px solid #ffcc80"}}>⚠️ {error}</div>
  );

  return (
    <div>
      {/* 전체화면 플레이어 */}
      {playing&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"#000",
          display:"flex",flexDirection:"column"}}>
          {/* 헤더 */}
          <div style={{display:"flex",alignItems:"center",gap:10,
            padding:"env(safe-area-inset-top,14px) 14px 12px",
            paddingTop:"max(14px,env(safe-area-inset-top))",
            background:"rgba(0,0,0,0.95)",flexShrink:0}}>
            <button onClick={closeVideo} style={{
              width:36,height:36,borderRadius:"50%",border:"none",
              background:"rgba(255,255,255,0.15)",color:"#fff",fontSize:20,
              cursor:"pointer",flexShrink:0,display:"flex",
              alignItems:"center",justifyContent:"center",fontWeight:300}}>✕</button>
            <div style={{flex:1,fontSize:12,fontWeight:600,
              color:"rgba(255,255,255,0.9)",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {playing.title}
            </div>
          </div>
          {/* 16:9 영상 영역 */}
          <div style={{flex:1,display:"flex",alignItems:"center",background:"#000"}}>
            <div style={{width:"100%",aspectRatio:"16/9",position:"relative"}}>
              <iframe
                style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}
                src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          {/* 하단 채널 정보 */}
          <div style={{padding:"12px 14px",
            paddingBottom:"max(12px,env(safe-area-inset-bottom))",
            background:"rgba(0,0,0,0.95)",flexShrink:0}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>
              {playing.channelName||playing.channel}
            </div>
          </div>
        </div>
      )}

      {/* 영상 목록 */}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {(preview ? videos.slice(0,3) : videos).map(v=>(
          <div key={v.id} onClick={()=>openVideo(v)}
            style={{display:"flex",gap:0,alignItems:"stretch",cursor:"pointer",
              background:"#fff",borderRadius:12,overflow:"hidden",
              border:"1px solid #e8e8e8",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            {/* 썸네일 */}
            <div style={{position:"relative",width:110,flexShrink:0,background:"#111"}}>
              <img src={v.thumb} alt={v.title}
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                onError={e=>{e.target.style.display="none";}}/>
              <div style={{position:"absolute",inset:0,display:"flex",
                alignItems:"center",justifyContent:"center",
                background:"rgba(0,0,0,0.15)"}}>
                <div style={{width:30,height:30,borderRadius:"50%",
                  background:"rgba(220,0,0,0.88)",display:"flex",
                  alignItems:"center",justifyContent:"center",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.4)"}}>
                  <div style={{width:0,height:0,marginLeft:3,
                    borderTop:"7px solid transparent",
                    borderBottom:"7px solid transparent",
                    borderLeft:"12px solid #fff"}}/>
                </div>
              </div>
            </div>
            {/* 텍스트 */}
            <div style={{flex:1,minWidth:0,padding:"10px 12px",
              display:"flex",flexDirection:"column",justifyContent:"center",gap:4}}>
              <div style={{fontSize:12,fontWeight:700,color:"#111",
                lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",
                display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
                {v.title}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontWeight:700,color:"#ff8c00",
                  background:"rgba(255,140,0,0.1)",padding:"1px 7px",borderRadius:4}}>
                  {v.channelName||v.channel}
                </span>
                <span style={{fontSize:10,color:"#bbb"}}>
                  {new Date(v.publishedAt).toLocaleDateString("ko-KR",{month:"short",day:"numeric"})}
                </span>
              </div>
            </div>
          </div>
        ))}
        {videos.length===0&&(
          <div style={{textAlign:"center",padding:"20px",color:"#aaa",fontSize:12}}>
            등록된 채널의 영상이 없어요
          </div>
        )}
      </div>
    </div>
  );
}

// ══ 자유게시판 전체 뷰 ═══════════════════════════════════
function BoardView({ nickname, onLoginRequest }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWrite, setShowWrite] = useState(false);
  const [selPost, setSelPost] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef();

  const load = ()=>{
    setLoading(true);
    sbGet("posts","order=created_at.desc")
      .then(d=>setPosts(d||[]))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const handleImg = (file)=>{
    if(!file) return;
    setImgFile(file);
    const reader = new FileReader();
    reader.onload = e => setImgPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const submit = async ()=>{
    if(!nickname){onLoginRequest();return;}
    if(!title.trim()) return;
    setPosting(true);
    try {
      let image_url = null;
      if(imgFile){
        // Supabase Storage 없을 경우 base64로 저장 (임시)
        const reader = new FileReader();
        image_url = await new Promise(res=>{ reader.onload=e=>res(e.target.result); reader.readAsDataURL(imgFile); });
      }
      await sbInsert("posts",{nickname,title:title.trim(),content:body.trim(),image_url,likes:0});
      setTitle(""); setBody(""); setImgFile(null); setImgPreview(null);
      setShowWrite(false);
      load();
    } catch(e){ alert("등록 오류"); }
    setPosting(false);
  };

  const likePost = async (post)=>{
    if(!nickname){onLoginRequest();return;}
    try {
      await sbInsert("post_likes",{post_id:post.id,nickname});
      await sbFetch(`/posts?id=eq.${post.id}`,{method:"PATCH",body:JSON.stringify({likes:post.likes+1}),prefer:"return=representation"});
      load();
    } catch(e){}
  };

  if(selPost) return <PostDetail post={selPost} nickname={nickname} onBack={()=>{setSelPost(null);load();}} onLoginRequest={onLoginRequest}/>;

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e"}}>자유게시판</div>
        <button onClick={()=>{ if(!nickname){onLoginRequest();return;} setShowWrite(w=>!w); }}
          style={{padding:"7px 14px",background:"#ff8c00",border:"none",borderRadius:20,
            color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          + 글쓰기
        </button>
      </div>

      {/* 글쓰기 */}
      {showWrite&&(
        <div style={{background:"#fff",borderRadius:16,padding:"14px",marginBottom:14,
          border:"1px solid rgba(255,140,0,0.2)",boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목"
            style={{width:"100%",background:"#f7f7f7",border:"1px solid #e8e8e8",
              borderRadius:10,color:"#1c1c1e",padding:"9px 12px",fontSize:13,outline:"none",
              fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}/>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="내용을 입력하세요..."
            rows={3} style={{width:"100%",background:"#f7f7f7",
              border:"1px solid #e8e8e8",borderRadius:10,color:"#1c1c1e",
              padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",
              resize:"none",boxSizing:"border-box",marginBottom:8}}/>
          {imgPreview&&(
            <div style={{position:"relative",marginBottom:8}}>
              <img src={imgPreview} style={{width:"100%",borderRadius:10,maxHeight:160,objectFit:"cover"}}/>
              <button onClick={()=>{setImgFile(null);setImgPreview(null);}}
                style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:"50%",
                  background:"rgba(0,0,0,0.6)",border:"none",color:"#fff",cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          )}
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>fileRef.current?.click()} style={{padding:"6px 12px",borderRadius:12,
              border:"1px solid #e8e8e8",background:"#f7f7f7",color:"#555",
              fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>📷 사진</button>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
              onChange={e=>handleImg(e.target.files[0])}/>
            <button onClick={submit} disabled={posting} style={{marginLeft:"auto",padding:"7px 18px",
              background:"#ff8c00",border:"none",borderRadius:12,color:"#fff",
              fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>
              {posting?"등록 중...":"등록"}
            </button>
          </div>
        </div>
      )}

      {/* 목록 */}
      {loading?(
        <div style={{textAlign:"center",padding:"30px",color:"#aaa",fontSize:13}}>불러오는 중...</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {posts.length===0?(
            <div style={{textAlign:"center",padding:"40px",color:"#bbb"}}>
              <div style={{fontSize:32,marginBottom:8}}>💬</div>
              <div style={{fontSize:13}}>첫 글을 남겨보세요!</div>
            </div>
          ):posts.map(p=>(
            <div key={p.id} style={{background:"#fff",borderRadius:16,
              overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",
              border:"1px solid #f0f0f0",cursor:"pointer"}}
              onClick={()=>setSelPost(p)}>
              {/* 사진 */}
              {p.image_url&&(
                <img src={p.image_url} style={{width:"100%",maxHeight:200,
                  objectFit:"cover",display:"block"}}/>
              )}
              <div style={{padding:"12px 14px"}}>
                {/* 제목 */}
                <div style={{fontSize:15,fontWeight:800,color:"#1c1c1e",marginBottom:4}}>{p.title}</div>
                {/* 글 내용 */}
                {p.content&&(
                  <div style={{fontSize:13,color:"#666",marginBottom:8,lineHeight:1.6,
                    overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",
                    WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.content}</div>
                )}
                {/* 하단 정보 */}
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:"#aaa"}}>{p.nickname}</span>
                  <span style={{fontSize:12,color:"#ddd"}}>·</span>
                  <span style={{fontSize:12,color:"#aaa"}}>
                    {new Date(p.created_at).toLocaleDateString("ko-KR",{month:"short",day:"numeric"})}
                  </span>
                  {/* 삭제 버튼 (관리자) */}
                  {nickname&&localStorage.getItem("rm_admin")==="1"&&(
                    <button onClick={async(e)=>{
                      e.stopPropagation();
                      if(!window.confirm("게시물을 삭제할까요?")) return;
                      await sbFetch(`/posts?id=eq.${p.id}`,{method:"DELETE"});
                      load();
                    }} style={{marginLeft:4,background:"rgba(239,83,80,0.12)",
                      border:"1px solid rgba(239,83,80,0.3)",borderRadius:8,
                      padding:"4px 12px",color:"#ef5350",
                      fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                      삭제
                    </button>
                  )}
                  {/* 하트 */}
                  <button onClick={e=>{e.stopPropagation();likePost(p);}} style={{
                    marginLeft:"auto",background:"none",border:"none",cursor:"pointer",
                    fontSize:16,color:p.likes>0?"#e91e63":"#ddd",
                    fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,
                    padding:"4px 8px"}}>
                    ❤️ <span style={{fontSize:14,fontWeight:700}}>{p.likes||0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══ 게시글 상세 ══════════════════════════════════════════
function PostDetail({ post, nickname, onBack, onLoginRequest }) {
  const [comments, setComments] = useState([]);
  const [cmtText, setCmtText] = useState("");

  useEffect(()=>{
    sbGet("comments",`post_id=eq.${post.id}&order=created_at.asc`)
      .then(d=>setComments(d||[])).catch(()=>{});
  },[post.id]);

  const submitComment = async()=>{
    if(!nickname){onLoginRequest();return;}
    if(!cmtText.trim()) return;
    await sbInsert("comments",{post_id:post.id,nickname,content:cmtText.trim()});
    const d = await sbGet("comments",`post_id=eq.${post.id}&order=created_at.asc`);
    setComments(d||[]);
    setCmtText("");
  };

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#aaa",
        cursor:"pointer",fontFamily:"inherit",fontSize:13,marginBottom:14,padding:0,display:"flex",
        alignItems:"center",gap:4}}>← 목록으로</button>
      <div style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:14,
        boxShadow:"0 1px 8px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
        <div style={{fontSize:16,fontWeight:800,color:"#1c1c1e",marginBottom:6}}>{post.title}</div>
        <div style={{fontSize:11,color:"#aaa",marginBottom:12}}>
          {post.nickname} · {new Date(post.created_at).toLocaleDateString("ko-KR")}
        </div>
        {post.image_url&&<img src={post.image_url} style={{width:"100%",borderRadius:10,marginBottom:10}}/>}
        {post.content&&<div style={{fontSize:13,color:"#444",lineHeight:1.7}}>{post.content}</div>}
      </div>
      <div style={{fontWeight:700,fontSize:13,color:"#888",marginBottom:8}}>
        댓글 {comments.length}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={cmtText} onChange={e=>setCmtText(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&submitComment()}
          placeholder="댓글을 입력하세요..."
          style={{flex:1,background:"#f7f7f7",border:"1px solid #e8e8e8",
            borderRadius:12,color:"#1c1c1e",padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={submitComment} style={{padding:"9px 14px",background:"#ff8c00",border:"none",
          borderRadius:12,color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>등록</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {comments.map(c=>(
          <div key={c.id} style={{background:"#f7f7f7",borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:11,color:"#ff8c00",fontWeight:700,marginBottom:3}}>{c.nickname}</div>
            <div style={{fontSize:13,color:"#333"}}>{c.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══ 볼링 점수판 컴포넌트 ══════════════════════════════
function BowlingScoreSheet({ frameShots, frameCumulative }) {
  // 볼링 스코어 기록지 스타일
  const shotColor = (s) => {
    if (s === "X") return "#c0392b";
    if (s === "/") return "#1565c0";
    if (s === "-") return "#999";
    return "#1c1c1e";
  };

  return (
    <div style={{width:"100%",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{
        display:"flex",
        border:"2px solid #333",
        borderRadius:6,
        overflow:"hidden",
        minWidth:300,
        background:"#fff",
        fontFamily:"'Courier New',monospace",
      }}>
        {Array.from({length:10}).map((_,f)=>{
          const frame = frameShots?.[f];
          const cum = frameCumulative?.[f];
          const isEmpty = !frame && (cum==null || cum===undefined);
          const is10th = f === 9;
          const shots = frame?.shots || [];

          return (
            <div key={f} style={{
              flex: is10th ? "1.5" : "1",
              borderRight: f < 9 ? "1.5px solid #333" : "none",
              display:"flex",
              flexDirection:"column",
              minWidth: is10th ? 44 : 30,
            }}>
              {/* 프레임 번호 */}
              <div style={{
                fontSize:9, color:"#555", fontWeight:700,
                textAlign:"center",
                padding:"2px 0",
                borderBottom:"1px solid #aaa",
                background:"#f0f0f0",
                letterSpacing:0,
              }}>{f+1}</div>

              {/* 투구 기호 박스 */}
              <div style={{
                display:"flex",
                justifyContent:"flex-end",
                alignItems:"center",
                borderBottom:"1px solid #aaa",
                minHeight:24,
                padding:"2px 3px",
                gap:1,
                background: isEmpty ? "#f9f9f9" : "#fff",
              }}>
                {isEmpty ? null : is10th ? (
                  // 10프레임: 3칸
                  <div style={{display:"flex",gap:2,width:"100%",justifyContent:"space-around"}}>
                    {[0,1,2].map(si=>{
                      const s = shots[si]||"";
                      return (
                        <span key={si} style={{
                          fontSize:12, fontWeight:900,
                          color: shotColor(s),
                          textAlign:"center",
                          minWidth:10,
                          lineHeight:1,
                          fontFamily:"'Courier New',monospace",
                        }}>{s}</span>
                      );
                    })}
                  </div>
                ) : (
                  // 1~9프레임: 오른쪽 정렬 2칸
                  [0,1].map(si=>{
                    const s = shots[si]||"";
                    return (
                      <span key={si} style={{
                        fontSize:12, fontWeight:900,
                        color: shotColor(s),
                        minWidth:10, textAlign:"center",
                        lineHeight:1,
                        fontFamily:"'Courier New',monospace",
                      }}>{s}</span>
                    );
                  })
                )}
              </div>

              {/* 누적점수 */}
              <div style={{
                textAlign:"center",
                fontSize:12, fontWeight:700,
                color: isEmpty ? "#ddd" : "#1c1c1e",
                padding:"3px 2px",
                minHeight:22,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                background: isEmpty ? "#f9f9f9" : "#fff",
                fontFamily:"'Courier New',monospace",
              }}>
                {isEmpty ? "" : (cum??"")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ══ 마이볼링 뷰 ══════════════════════════════════════════
function MyBowlingView({ nickname, arsenal, scores, setScores, dbLoading, setModal, setEditEnt, setView, myBowlingTab, setMyBowlingTab, onLoginRequest, showToast }) {
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split("T")[0]);
  const [scoreLane, setScoreLane] = useState("");
  const [scoreVal, setScoreVal] = useState("");
  const [scoreGames, setScoreGames] = useState("1");
  const [scoreMemo, setScoreMemo] = useState("");
  const [saving, setSaving] = useState(false);
  // 스캔 관련 state
  const [scanMode, setScanMode] = useState(false);
  const [scanImg, setScanImg] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [playerMap, setPlayerMap] = useState({}); // label → nickname
  const [scanSaving, setScanSaving] = useState(false);
  const scanFileRef = useRef();

  useEffect(()=>{
    if(!nickname) return;
    sbGet("scores",`nickname=eq.${encodeURIComponent(nickname)}&order=created_at.desc`)
      .then(d=>setScores(d||[])).catch(()=>{});
  },[nickname]);

  if(!nickname) return (
    <div style={{textAlign:"center",padding:"60px 20px",animation:"fadeUp .3s ease both"}}>
      <div style={{fontSize:48,marginBottom:14}}>🏆</div>
      <div style={{fontWeight:800,fontSize:17,color:"#1c1c1e",marginBottom:8}}>마이볼링</div>
      <div style={{fontSize:13,color:"#aaa",marginBottom:20}}>로그인 후 이용할 수 있어요</div>
      <button onClick={onLoginRequest} style={{padding:"12px 28px",background:"#ff8c00",border:"none",
        borderRadius:14,color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer"}}>
        로그인
      </button>
    </div>
  );

  const saveScore = async()=>{
    if(!scoreVal||isNaN(Number(scoreVal))) return;
    setSaving(true);
    try {
      const row={nickname,date:scoreDate,lane:scoreLane,score:Number(scoreVal),game_count:Number(scoreGames)||1,memo:scoreMemo};
      const res = await sbInsert("scores",row);
      setScores(prev=>[res[0],...prev]);
      setShowScoreForm(false);
      setScoreVal(""); setScoreLane(""); setScoreMemo(""); setScoreGames("1");
      showToast("점수 기록 완료! 🎳");
    } catch(e){ showToast("저장 오류","#ef5350"); }
    setSaving(false);
  };

  // ── 점수판 사진 처리 ─────────────────────────────────────
  const handleScanFile = (file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setScanImg(e.target.result);
      setScanResult(null);
      setPlayerMap({});
    };
    reader.readAsDataURL(file);
  };

  const runScan = async () => {
    if(!scanImg) return;
    setScanning(true);
    try {
      const b64 = scanImg.split(",")[1];
      const mime = scanImg.split(";")[0].split(":")[1] || "image/jpeg";
      const res = await fetch("/api/score-scan", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({imageBase64:b64, mimeType:mime})
      });
      const data = await res.json();
      if(data.success) {
        setScanResult(data);
        if(data.lane) setScoreLane(data.lane);
        if(data.date) setScoreDate(data.date);
      } else {
        showToast(data.error||"인식 실패","#ef5350");
        // 실패해도 fullText 표시
        if(data.fullText) setScanResult({...data, success:false, players:[]});
      }
    } catch(e){ showToast("오류 발생","#ef5350"); }
    setScanning(false);
  };

  const saveScanResult = async () => {
    if(!scanResult) return;
    const myLabel = Object.keys(playerMap).find(k=>playerMap[k]===nickname);
    if(!myLabel) { showToast("'내 점수' 체크를 해주세요","#fb8c00"); return; }

    const myPlayer = scanResult.players.find(p=>p.label===myLabel);
    if(!myPlayer?.totalScore) { showToast("점수를 인식하지 못했어요","#ef5350"); return; }

    setScanSaving(true);
    try {
      const row = {
        nickname,
        date: scoreDate,
        lane: scanResult.lane||scoreLane,
        score: myPlayer.totalScore,
        game_count: 1,
        frames: myPlayer.frameCumulative,
        player_label: myPlayer.label,
        memo: `📷 사진 스캔 (${myPlayer.label})`,
      };
      const res = await sbInsert("scores", row);
      setScores(prev=>[res[0],...prev]);
      setScanMode(false);
      setScanImg(null);
      setScanResult(null);
      setPlayerMap({});
      showToast(`${myPlayer.totalScore}점 기록 완료! 🎳`);
    } catch(e){ showToast("저장 오류","#ef5350"); }
    setScanSaving(false);
  };

  const avgScore = scores.length ? Math.round(scores.reduce((a,s)=>a+s.score,0)/scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores.map(s=>s.score)) : 0;
  const totalGames = scores.reduce((a,s)=>a+s.game_count,0);

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      {/* 헤더 */}
      <div style={{marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e"}}>마이볼링</div>
          <div style={{fontSize:12,color:"#aaa",marginTop:2}}>@{nickname}</div>
        </div>
      </div>

      {/* 탭 */}
      <div style={{display:"flex",background:"#f0f0f0",borderRadius:12,padding:3,marginBottom:14,gap:2}}>
        {[{k:"arsenal",l:"⊞ 내 장비함"},{k:"scores",l:"◉ 점수 기록"}].map(t=>(
          <button key={t.k} onClick={()=>setMyBowlingTab(t.k)} style={{
            flex:1,padding:"8px",borderRadius:9,border:"none",
            fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer",
            background:myBowlingTab===t.k?"#fff":"transparent",
            color:myBowlingTab===t.k?"#1c1c1e":"#aaa",
            boxShadow:myBowlingTab===t.k?"0 1px 6px rgba(0,0,0,0.1)":"none",
            transition:"all .15s"}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* 내 장비함 */}
      {myBowlingTab==="arsenal"&&(
        <ArsenalTab arsenal={arsenal} dbLoading={dbLoading} setModal={setModal}
          setEditEnt={setEditEnt} setView={setView} nickname={nickname}/>
      )}

      {/* 점수 기록 */}
      {myBowlingTab==="scores"&&(
        <div>
          {/* 통계 카드 */}
          {scores.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              {[
                {l:"총 게임",v:`${totalGames}G`,c:"#ff8c00"},
                {l:"평균",v:avgScore,c:"#1565c0"},
                {l:"최고",v:bestScore,c:"#2e7d32"},
              ].map(s=>(
                <div key={s.l} style={{background:"#fff",borderRadius:14,padding:"12px 8px",
                  textAlign:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",
                  borderTop:`3px solid ${s.c}`}}>
                  <div style={{fontSize:20,fontWeight:900,color:s.c,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:10,color:"#aaa",marginTop:3,fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* 버튼 영역 */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <button onClick={()=>{setScanMode(s=>!s);setShowScoreForm(false);setScanResult(null);setScanImg(null);}}
              style={{flex:1,padding:"11px",
                background:scanMode?"#f5f5f5":"#fff",
                border:"1.5px solid #1e88e5",borderRadius:14,
                color:"#1e88e5",fontFamily:"inherit",fontSize:13,fontWeight:700,
                cursor:"pointer",transition:"all .15s"}}>
              {scanMode?"✕ 닫기":"📷 사진으로 기록"}
            </button>
            <button onClick={()=>{setShowScoreForm(f=>!f);setScanMode(false);}}
              style={{flex:1,padding:"11px",
                background:showScoreForm?"#f5f5f5":"#fff",
                border:"1.5px solid #ff8c00",borderRadius:14,
                color:"#ff8c00",fontFamily:"inherit",fontSize:13,fontWeight:700,
                cursor:"pointer",transition:"all .15s"}}>
              {showScoreForm?"✕ 닫기":"✏️ 직접 입력"}
            </button>
          </div>

          {/* 사진 스캔 UI */}
          {scanMode&&(
            <div style={{background:"#fff",borderRadius:16,padding:"14px",
              marginBottom:12,boxShadow:"0 2px 12px rgba(0,0,0,0.08)"}}>
              {!scanImg?(
                <div>
                  <div style={{fontSize:12,color:"#666",marginBottom:10,lineHeight:1.7}}>
                    볼링장 전광판 사진을 찍거나 업로드해주세요.<br/>
                    점수판이 선명하게 보이도록 촬영해주세요.
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>scanFileRef.current?.click()}
                      style={{flex:1,padding:"12px",background:"#f7f7f7",
                        border:"1.5px dashed #ddd",borderRadius:12,
                        color:"#555",fontFamily:"inherit",fontSize:13,
                        fontWeight:700,cursor:"pointer"}}>
                      🖼️ 갤러리
                    </button>
                    <button onClick={()=>{
                      const input = document.createElement("input");
                      input.type="file"; input.accept="image/*"; input.capture="environment";
                      input.onchange=e=>handleScanFile(e.target.files[0]);
                      input.click();
                    }} style={{flex:1,padding:"12px",background:"#1e88e5",
                      border:"none",borderRadius:12,
                      color:"#fff",fontFamily:"inherit",fontSize:13,
                      fontWeight:700,cursor:"pointer"}}>
                      📷 카메라
                    </button>
                    <input ref={scanFileRef} type="file" accept="image/*"
                      style={{display:"none"}}
                      onChange={e=>handleScanFile(e.target.files[0])}/>
                  </div>
                </div>
              ):(
                <div>
                  {/* 이미지 미리보기 */}
                  <img src={scanImg} alt="scan"
                    style={{width:"100%",borderRadius:10,marginBottom:10,
                      maxHeight:200,objectFit:"cover"}}/>

                  {scanning&&(
                    <div style={{textAlign:"center",padding:"16px",color:"#1e88e5",
                      fontSize:13,fontWeight:700}}>
                      ⚙️ 점수판 분석 중...
                    </div>
                  )}

                  {/* 분석 버튼 - 이미지 있고 결과 없을 때 */}
                  {!scanning&&!scanResult&&(
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <button onClick={()=>{setScanImg(null);setScanResult(null);setPlayerMap({});}}
                        style={{flex:1,padding:"11px",background:"#f5f5f5",
                          border:"none",borderRadius:12,color:"#666",
                          fontFamily:"inherit",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                        🔄 다시 찍기
                      </button>
                      <button onClick={runScan}
                        style={{flex:2,padding:"11px",background:"#1e88e5",
                          border:"none",borderRadius:12,color:"#fff",
                          fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer"}}>
                        🔍 점수 분석
                      </button>
                    </div>
                  )}

                  {/* 스캔 결과 */}
                  {scanResult&&!scanning&&(
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:"#333",
                        marginBottom:8}}>
                        📋 인식 결과
                        {scanResult.lane&&<span style={{color:"#aaa",fontWeight:500,
                          marginLeft:6}}>레인 {scanResult.lane}</span>}
                      </div>

                      {scanResult.players.map((p,pi)=>(
                        <div key={pi} style={{background:"#fff",borderRadius:14,
                          padding:"12px",marginBottom:10,
                          border:"1px solid #e8e8e8",
                          boxShadow:"0 1px 6px rgba(0,0,0,0.06)"}}>

                          {/* 헤더 */}
                          <div style={{display:"flex",alignItems:"center",
                            gap:8,marginBottom:10}}>
                            <span style={{fontSize:13,fontWeight:800,
                              color:"#fff",background:"#1e88e5",
                              padding:"3px 10px",borderRadius:6}}>
                              {p.label}
                            </span>
                            <span style={{fontSize:24,fontWeight:900,color:"#ff8c00"}}>
                              {p.totalScore??"-"}
                            </span>
                            <span style={{fontSize:12,color:"#aaa"}}>점</span>
                            <div style={{flex:1}}/>
                            <label style={{display:"flex",alignItems:"center",
                              gap:5,fontSize:12,color:"#333",cursor:"pointer",fontWeight:600}}>
                              <input type="checkbox"
                                checked={playerMap[p.label]===nickname}
                                onChange={e=>setPlayerMap(prev=>({
                                  ...prev,[p.label]:e.target.checked?nickname:null
                                }))}/>
                              내 점수
                            </label>
                          </div>

                          {/* 볼링 점수판 */}
                          <BowlingScoreSheet frameShots={p.frameShots} frameCumulative={p.frameCumulative}/>
                        </div>
                      ))}

                      {/* 날짜 */}
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:10,color:"#aaa",fontWeight:600,marginBottom:4}}>날짜</div>
                        <input type="date" value={scoreDate}
                          onChange={e=>setScoreDate(e.target.value)}
                          style={{width:"100%",background:"#f7f7f7",
                            border:"1px solid #e8e8e8",borderRadius:10,
                            color:"#1c1c1e",padding:"8px 10px",fontSize:13,
                            outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                      </div>

                      {/* 저장 */}
                      <button onClick={saveScanResult} disabled={scanSaving}
                        style={{width:"100%",padding:"11px",
                          background:Object.values(playerMap).includes(nickname)?"#ff8c00":"#ddd",
                          border:"none",borderRadius:12,color:"#fff",
                          fontFamily:"inherit",fontSize:13,fontWeight:800,cursor:"pointer"}}>
                        {scanSaving?"저장 중...":
                          Object.values(playerMap).includes(nickname)?
                          "내 점수 저장하기":"'내 점수' 체크 후 저장"}
                      </button>
                    </div>
                  )}

                  {!scanning&&scanResult&&(
                    <div>
                      {/* OCR 원문 디버그 */}
                      <details style={{marginTop:8,marginBottom:4}}>
                        <summary style={{fontSize:11,color:"#aaa",cursor:"pointer",
                          padding:"4px 0"}}>
                          🔍 OCR 인식 원문 보기
                        </summary>
                        <div style={{background:"#f0f0f0",borderRadius:8,
                          padding:"8px",marginTop:4,fontSize:10,
                          color:"#555",whiteSpace:"pre-wrap",
                          maxHeight:120,overflowY:"auto",lineHeight:1.6}}>
                          {scanResult.fullText||"텍스트 없음"}
                        </div>
                      </details>
                      <button onClick={()=>{setScanImg(null);setScanResult(null);setPlayerMap({});}}
                        style={{width:"100%",padding:"9px",background:"#f5f5f5",
                          border:"none",borderRadius:10,color:"#666",
                          fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        🔄 다시 스캔
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 입력 폼 */}
          {showScoreForm&&(
            <div style={{background:"#fff",borderRadius:16,padding:"14px",marginBottom:12,
              boxShadow:"0 2px 12px rgba(0,0,0,0.08)",border:"1px solid #f0f0f0"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                {[
                  {l:"날짜",type:"date",val:scoreDate,set:setScoreDate},
                  {l:"레인",type:"text",val:scoreLane,set:setScoreLane,ph:"예: 5-6"},
                  {l:"점수",type:"number",val:scoreVal,set:setScoreVal,ph:"0~300"},
                  {l:"게임 수",type:"number",val:scoreGames,set:setScoreGames,ph:"1"},
                ].map(f=>(
                  <div key={f.l}>
                    <div style={{fontSize:10,color:"#aaa",fontWeight:600,marginBottom:4}}>{f.l}</div>
                    <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)}
                      placeholder={f.ph||""} min={f.type==="number"?0:undefined}
                      style={{width:"100%",background:"#f7f7f7",border:"1px solid #e8e8e8",
                        borderRadius:10,color:"#1c1c1e",padding:"8px 10px",fontSize:13,
                        outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                  </div>
                ))}
              </div>
              <input value={scoreMemo} onChange={e=>setScoreMemo(e.target.value)} placeholder="메모 (선택)"
                style={{width:"100%",background:"#f7f7f7",border:"1px solid #e8e8e8",
                  borderRadius:10,color:"#1c1c1e",padding:"8px 10px",fontSize:13,
                  outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:10}}/>
              <button onClick={saveScore} disabled={saving} style={{
                width:"100%",padding:"11px",background:"#ff8c00",border:"none",borderRadius:12,
                color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:800,cursor:"pointer",
                boxShadow:"0 3px 10px rgba(255,140,0,0.3)"}}>
                {saving?"저장 중...":"저장하기"}
              </button>
            </div>
          )}

          {/* 기록 목록 */}
          {scores.length===0?(
            <div style={{textAlign:"center",padding:"40px",background:"#f7f7f7",
              borderRadius:16,border:"2px dashed #e0e0e0"}}>
              <div style={{fontSize:32,marginBottom:8}}>🎳</div>
              <div style={{fontSize:13,color:"#aaa"}}>아직 기록이 없어요</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {scores.map(s=>(
                <div key={s.id} style={{background:"#fff",borderRadius:14,padding:"12px 14px",
                  boxShadow:"0 1px 6px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:s.frames?8:0}}>
                    <div style={{textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:26,fontWeight:900,color:"#ff8c00",lineHeight:1}}>{s.score}</div>
                      <div style={{fontSize:9,color:"#aaa",fontWeight:600}}>점</div>
                    </div>
                    <div style={{width:1,height:36,background:"#f0f0f0",flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#333",marginBottom:2}}>
                        {s.date}{s.lane&&<span style={{color:"#aaa",fontWeight:500}}> · 레인 {s.lane}</span>}
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{fontSize:10,color:"#ff8c00",fontWeight:700,
                          background:"rgba(255,140,0,0.1)",padding:"1px 6px",borderRadius:6}}>
                          {s.game_count}게임
                        </span>
                        {s.player_label&&<span style={{fontSize:10,color:"#1e88e5",
                          background:"rgba(30,136,229,0.1)",padding:"1px 6px",borderRadius:6,fontWeight:700}}>
                          {s.player_label}
                        </span>}
                        {s.memo&&<span style={{fontSize:11,color:"#aaa",overflow:"hidden",
                          textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.memo}</span>}
                      </div>
                    </div>
                  </div>
                  {/* 볼링 점수판 형식 */}
                  {s.frames&&Array.isArray(s.frames)&&(
                    <div style={{marginTop:8}}>
                      <BowlingScoreSheet
                        frameShots={null}
                        frameCumulative={s.frames}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══ 장비함 탭 (MyBowlingView 내부용) ════════════════════
function ArsenalTab({ arsenal, dbLoading, setModal, setEditEnt, setView, nickname }) {
  if(arsenal.length===0) return (
    <div style={{textAlign:"center",padding:"40px 20px",background:"rgba(255,255,255,0.03)",
      border:"2px dashed rgba(255,255,255,0.1)",borderRadius:18}}>
      <div style={{fontSize:48,marginBottom:10,opacity:.3}}>🎳</div>
      <div style={{fontWeight:800,fontSize:17,color:"rgba(255,255,255,0.3)"}}>장비함이 비어있어요</div>
      <button onClick={()=>setView("balls")} style={{marginTop:16,padding:"9px 22px",borderRadius:18,
        background:"#1c1c1e",border:"none",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:12,
        fontFamily:"inherit",boxShadow:"0 4px 14px rgba(0,0,0,.28)"}}>볼링공 둘러보기</button>
    </div>
  );
  return (
    <div className="rm-arsenal-grid" style={{display:"grid",gridTemplateColumns:"1fr",gap:10}}>
      {arsenal.map(entry=>{
        const ball=ALL_BALLS.find(b=>b.id===entry.ballId);
        if(!ball) return null;
        return <MyCard key={entry.addedAt} entry={entry} ball={ball}
          onRemove={async()=>{
            if(!window.confirm("삭제할까요?")) return;
            if(entry.dbId) await sbDelete("equipment",`id=eq.${entry.dbId}`);
          }}
          onEdit={()=>{setEditEnt(entry);setModal(ball);}}/>;
      })}
    </div>
  );
}

// ══ 마이페이지 슬라이드 패널 ════════════════════════════
function MyPagePanel({ nickname, arsenal, onClose, onPasswordChange, onNicknameChange, onDeleteAll, onLogout, isAdmin, pendingCount, onMemberManage, showToast }) {
  const [section, setSection] = useState(null);
  const [posts, setPosts] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(()=>{
    if(!nickname) return;
    sbGet("posts",`nickname=eq.${encodeURIComponent(nickname)}&order=created_at.desc`)
      .then(d=>setPosts(d||[])).catch(()=>{});
    sbGet("scores",`nickname=eq.${encodeURIComponent(nickname)}&order=created_at.desc`)
      .then(d=>setScores(d||[])).catch(()=>{});
  },[nickname]);

  useEffect(()=>{
    document.body.style.overflow="hidden";
    return ()=>{ document.body.style.overflow=""; };
  },[]);

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:5000,
      background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",
      display:"flex",justifyContent:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"85%",maxWidth:360,height:"100%",overflowY:"auto",
        background:"#1a1a1f",
        boxShadow:"-8px 0 40px rgba(0,0,0,0.5)",
        animation:"slideRight .3s cubic-bezier(.34,1.1,.64,1)"}}>
        <style>{`@keyframes slideRight{from{transform:translateX(100%)}to{transform:translateY(0)}}`}</style>

        {/* 헤더 */}
        <div style={{background:"linear-gradient(135deg,rgba(255,140,0,0.15),rgba(255,100,0,0.05))",
          padding:"50px 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:"50%",
              background:"linear-gradient(135deg,#ff8c00,#e65100)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:22,fontWeight:900,color:"#fff",
              boxShadow:"0 4px 16px rgba(255,140,0,0.45)"}}>
              {nickname.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>{nickname}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2}}>볼링공 {arsenal.length}개 등록</div>
            </div>
            <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",
              color:"rgba(255,255,255,0.4)",fontSize:20,cursor:"pointer"}}>✕</button>
          </div>
        </div>

        <div style={{padding:"16px"}}>
          {/* 활동 내역 */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700,
              letterSpacing:1.5,marginBottom:8}}>활동 내역</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              {[
                {l:"게시물",v:posts.length,icon:"📝"},
                {l:"점수기록",v:scores.length,icon:"🎳"},
                {l:"댓글",v:"-",icon:"💬"},
                {l:"관심볼",v:"-",icon:"❤️"},
              ].map(item=>(
                <div key={item.l} style={{background:"rgba(255,255,255,0.05)",borderRadius:12,
                  padding:"12px",textAlign:"center",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{item.icon}</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#ff8c00"}}>{item.v}</div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:2}}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 설정 메뉴 */}
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700,
            letterSpacing:1.5,marginBottom:8}}>계정 설정</div>
          {[
            {icon:"🔑",label:"비밀번호 변경",action:()=>setSection("pw")},
            {icon:"✏️",label:"닉네임 변경",action:()=>setSection("nick")},
          ].map(item=>(
            <button key={item.label} onClick={item.action} style={{
              width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
              background:"rgba(255,255,255,0.05)",color:"#fff",
              fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer",
              display:"flex",alignItems:"center",gap:10,marginBottom:6,textAlign:"left",
              borderLeft:"3px solid rgba(255,140,0,0.4)"}}>
              <span>{item.icon}</span>{item.label}
              <span style={{marginLeft:"auto",color:"rgba(255,255,255,0.2)"}}>›</span>
            </button>
          ))}

          <div style={{marginTop:12,marginBottom:6}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:700,
              letterSpacing:1.5,marginBottom:8}}>기타</div>
            {/* 관리자 전용 회원관리 버튼 */}
            {isAdmin&&(
              <button onClick={()=>{onClose();onMemberManage();}} style={{
                width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
                background:"rgba(255,140,0,0.1)",color:"#ff8c00",
                fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",gap:10,marginBottom:6,textAlign:"left",
                borderLeft:"3px solid rgba(255,140,0,0.6)"}}>
                <span>👥</span>
                회원 관리
                {pendingCount>0&&(
                  <span style={{marginLeft:4,background:"#ef5350",color:"#fff",
                    borderRadius:"50%",width:20,height:20,display:"flex",
                    alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:900,flexShrink:0}}>
                    {pendingCount}
                  </span>
                )}
                <span style={{marginLeft:"auto",color:"rgba(255,255,255,0.2)"}}>›</span>
              </button>
            )}
            <button onClick={()=>{onLogout();onClose();}} style={{
              width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
              background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.7)",
              fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer",
              display:"flex",alignItems:"center",gap:10,marginBottom:6,textAlign:"left"}}>
              <span>🚪</span> 로그아웃
            </button>
            <button onClick={()=>setSection("delete")} style={{
              width:"100%",padding:"13px 16px",borderRadius:14,border:"none",
              background:"rgba(239,83,80,0.08)",color:"#ef5350",
              fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer",
              display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
              <span>🗑️</span> 계정 삭제
            </button>
          </div>

          {/* 섹션별 입력 */}
          {section==="pw"&&<PwChangeSection onDone={()=>setSection(null)} nickname={nickname} showToast={showToast}/>}
          {section==="nick"&&<NickChangeSection onDone={()=>setSection(null)} nickname={nickname} showToast={showToast}/>}

          {section==="delete"&&(
            <div style={{marginTop:12,background:"rgba(239,83,80,0.1)",borderRadius:14,padding:"14px",
              border:"1px solid rgba(239,83,80,0.3)"}}>
              <div style={{fontSize:13,color:"#ef5350",fontWeight:700,marginBottom:10}}>
                정말 계정을 삭제하시겠어요? 모든 데이터가 삭제돼요.
              </div>
              <button onClick={()=>{onDeleteAll();onClose();}} style={{
                width:"100%",padding:"10px",background:"#ef5350",border:"none",borderRadius:10,
                color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:800,cursor:"pointer"}}>
                삭제 확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══ 볼 스캔 컴포넌트 (Gemini Vision + Vercel Serverless) ══
function BallScanner({ balls, onSelectBall }) {
  const [img, setImg] = useState(null);
  const [imgB64, setImgB64] = useState(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("idle"); // idle|analyzing|matching|done|nomatch|error
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef();
  const cameraRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const mime = file.type || "image/jpeg";
    const reader = new FileReader();
    reader.onload = (e) => {
      const originalDataUrl = e.target.result;
      setImg(originalDataUrl);
      // Canvas로 중앙 60% 크롭 → 배경 색상 노이즈 제거
      const imgEl = new Image();
      imgEl.onload = () => {
        const canvas = document.createElement("canvas");
        const cropRatio = 0.60;
        const sw = Math.floor(imgEl.width * cropRatio);
        const sh = Math.floor(imgEl.height * cropRatio);
        const sx = Math.floor((imgEl.width - sw) / 2);
        const sy = Math.floor((imgEl.height - sh) / 2);
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, sw, sh);
        const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setImgB64(croppedDataUrl.split(",")[1]);
        setMimeType("image/jpeg");
      };
      imgEl.src = originalDataUrl;
      setResults([]); setStep("idle"); setAnalysis(null); setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  // ── 유사도 매칭 (텍스트 + 색상 + 패턴) ────────────────
  const normalize = (s) => (s||"").toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g,"").replace(/\s+/g," ").trim();

  // 색상 키워드 맵
  const COLOR_MAP = {
    purple:["purple","violet","amethyst","plum"],
    black:["black","dark","shadow","night","midnight","noir"],
    red:["red","crimson","scarlet","ruby","blood","cherry"],
    blue:["blue","sapphire","cobalt","navy","azure","ocean"],
    green:["green","emerald","lime","jade","forest","mint"],
    orange:["orange","amber","fire","flame","blaze","copper"],
    gold:["gold","golden","maxx","bronze","honey"],
    pearl:["pearl","pearlescent","lustre"],
    white:["white","ivory","ghost","ice","frost","snow"],
    gray:["gray","grey","silver","slate","ash"],
    pink:["pink","rose","magenta","coral"],
    teal:["teal","cyan","aqua","turquoise"],
    silver:["silver","chrome","metallic"],
  };

  // 패턴 키워드 맵
  const PATTERN_MAP = {
    marble:["marble","stone"],
    swirl:["swirl","twist","vortex","spiral"],
    solid:["solid"],
    pearl:["pearl"],
    hybrid:["hybrid"],
    reactive:["reactive"],
  };

  const matchBalls = (res) => {
    const { brand, name, colors=[], pattern="" } = res;
    const nb = normalize(brand||"");
    const nn = normalize(name||"");

    const scored = ALL_BALLS.map(ball => {
      let score = 0;
      const ballBrand = normalize(ball.brand);
      const ballName  = normalize(ball.name);
      const ballCover = normalize(ball.cover||"");
      const ballColor = normalize(ball.color||""); // 볼 색상 필드

      // ① 브랜드 매칭 (25%)
      if (nb) {
        if (ballBrand === nb) score += 0.25;
        else if (ballBrand.includes(nb) || nb.includes(ballBrand)) score += 0.20;
        else if (ballBrand.split(" ").some(w=>nb.includes(w)&&w.length>2)) score += 0.10;
      }

      // ② 제품명 매칭 (45%)
      if (nn) {
        const nameWords = ballName.split(" ").filter(w=>w.length>1);
        const queryWords = nn.split(" ").filter(w=>w.length>1);
        if (ballName === nn) score += 0.55;
        else if (ballName.includes(nn) || nn.includes(ballName)) score += 0.40;
        else {
          const hits = nameWords.filter(w=>
            queryWords.some(q=> q===w || q.includes(w) || w.includes(q))
          ).length;
          if (nameWords.length > 0) score += (hits / nameWords.length) * 0.45;
        }
      }

      // ③ 색상 매칭 강화 (20%)
      if (colors.length > 0) {
        let colorScore = 0;
        const ballColors = (ball.colors || []).map(c => c.toLowerCase());
        colors.forEach(c => {
          const cl = c.toLowerCase();
          // ball.colors 필드와 직접 비교 (가장 정확)
          if (ballColors.includes(cl)) {
            colorScore += 0.08;
          } else {
            // 볼 이름에 색상 키워드 포함 (보조)
            const keywords = COLOR_MAP[cl] || [cl];
            if (keywords.some(k => ballName.includes(k))) colorScore += 0.04;
            else if (keywords.some(k => ballCover.includes(k))) colorScore += 0.02;
          }
        });
        score += Math.min(colorScore, 0.20);
      }

      // ④ 패턴 매칭 (10%)
      if (pattern) {
        const keywords = PATTERN_MAP[pattern.toLowerCase()] || [pattern.toLowerCase()];
        if (keywords.some(k => ballName.includes(k) || ballCover.includes(k))) score += 0.10;
        if (pattern==="solid" && ballCover.includes("solid")) score += 0.05;
        if (pattern==="pearl" && ballCover.includes("pearl")) score += 0.05;
        if (pattern==="hybrid" && ballCover.includes("hybrid")) score += 0.05;
      }

      return { ball, score };
    });

    return scored
      .sort((a,b) => b.score - a.score)
      .filter(x => x.score > 0.10)
      .slice(0, 3)
      .map(x => ({ ...x.ball, matchScore: Math.round(x.score * 100) }));
  };

  // ── 스캔 실행 ─────────────────────────────────────────
  const runScan = async () => {
    if (!imgB64) return;
    setLoading(true); setStep("analyzing"); setResults([]); setAnalysis(null); setErrorMsg("");

    try {
      // Vercel Serverless Function 호출
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imgB64, mimeType }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "서버 오류");
      }

      setAnalysis(data);
      setStep("matching");

      const matched = matchBalls(data);
      setResults(matched);
      setStep(matched.length > 0 ? "done" : "nomatch");

    } catch (e) {
      setErrorMsg(e.message || "스캔 중 오류 발생");
      setStep("error");
    }
    setLoading(false);
  };

  const reset = () => {
    setImg(null); setImgB64(null); setResults([]);
    setStep("idle"); setAnalysis(null); setErrorMsg("");
  };

  const COND_C = {
    "Heavy Oil":"#ef5350","Medium-Heavy Oil":"#fb8c00",
    "Medium Oil":"#fdd835","Light-Medium Oil":"#66bb6a","Light Oil":"#42a5f5",
  };

  return (
    <div style={{animation:"fadeUp .3s ease both"}}>
      <div style={{fontWeight:800,fontSize:22,color:"#111",marginBottom:4}}>📷 볼링공 스캔</div>
      <p style={{fontSize:13,color:"#666",marginBottom:16,lineHeight:1.6}}>
        볼링공 사진을 찍거나 업로드하면<br/>AI가 브랜드·제품명을 인식해서 DB와 매칭해드려요
      </p>

      {!img ? (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {/* 업로드 */}
          <div onClick={()=>fileRef.current?.click()} style={{
            background:"#fff",border:"2px dashed #e2e2e0",borderRadius:20,
            padding:"40px 20px",textAlign:"center",cursor:"pointer",transition:"border-color .2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor="#ff8c00"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e2e0"}>
            <div style={{fontSize:48,marginBottom:10}}>🎳</div>
            <div style={{fontWeight:700,fontSize:15,color:"#333",marginBottom:4}}>사진 업로드</div>
            <div style={{fontSize:12,color:"#aaa"}}>탭해서 갤러리에서 선택</div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
              onChange={e=>handleFile(e.target.files[0])}/>
          </div>
          {/* 카메라 */}
          <button onClick={()=>cameraRef.current?.click()} style={{
            padding:"14px",background:"#1c1c1e",border:"none",borderRadius:16,
            color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:700,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            📸 카메라로 촬영
            <input ref={cameraRef} type="file" accept="image/*" capture="environment"
              style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
          </button>
          {/* 팁 */}
          <div style={{background:"#f0f4ff",borderRadius:12,padding:"12px 14px",
            fontSize:12,color:"#5c6bc0",lineHeight:1.8,fontWeight:600}}>
            💡 <b>인식 팁</b><br/>
            · 볼 이름이 선명하게 보이도록 촬영<br/>
            · 조명이 밝은 환경에서 촬영<br/>
            · 볼을 가까이서 정면으로 찍어주세요
          </div>
        </div>
      ) : (
        <div>
          {/* 미리보기 */}
          <div style={{position:"relative",marginBottom:14}}>
            <img src={img} alt="scan" style={{width:"100%",borderRadius:18,
              maxHeight:280,objectFit:"contain",background:"#111"}}/>
            {step==="idle" && (
              <button onClick={reset} style={{position:"absolute",top:10,right:10,
                width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.6)",
                border:"none",color:"#fff",fontSize:16,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            )}
          </div>

          {/* 분석 전 */}
          {step==="idle" && (
            <button onClick={runScan} style={{
              width:"100%",padding:"14px",background:"#ff8c00",border:"none",
              borderRadius:16,color:"#fff",fontFamily:"inherit",
              fontSize:15,fontWeight:800,cursor:"pointer",
              boxShadow:"0 6px 20px rgba(255,140,0,0.35)"}}>
              🔍 AI 분석 시작
            </button>
          )}

          {/* 분석 중 */}
          {(step==="analyzing"||step==="matching") && (
            <div style={{background:"#fff",borderRadius:16,padding:"24px 20px",
              textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:36,marginBottom:12,display:"inline-block",
                animation:"spin 1s linear infinite"}}>⚙️</div>
              <div style={{fontWeight:700,fontSize:14,color:"#333",marginBottom:4}}>
                {step==="analyzing"?"AI 이미지 분석 중...":"DB 매칭 중..."}
              </div>
              <div style={{fontSize:12,color:"#aaa"}}>
                {step==="analyzing"?"Gemini Vision이 볼을 인식하고 있어요":"209개 볼과 비교 중"}
              </div>
              <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* 인식 결과 태그 */}
          {analysis && (step==="done"||step==="nomatch") && (
            <div style={{background:"#f7f7fc",borderRadius:14,padding:"12px 14px",
              marginBottom:12}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:10,color:"#aaa",fontWeight:700,letterSpacing:1}}>AI 인식</span>
                {analysis.brand && (
                  <span style={{fontSize:11,fontWeight:700,background:"#1c1c1e",color:"#fff",
                    padding:"2px 8px",borderRadius:8}}>{analysis.brand}</span>
                )}
                {analysis.name && (
                  <span style={{fontSize:11,fontWeight:700,background:"#ff8c0022",color:"#ff8c00",
                    padding:"2px 8px",borderRadius:8,border:"1px solid #ff8c0033"}}>{analysis.name}</span>
                )}
                {analysis.pattern && (
                  <span style={{fontSize:10,fontWeight:700,background:"#e3f2fd",color:"#1565c0",
                    padding:"2px 7px",borderRadius:8}}>{analysis.pattern}</span>
                )}
                <span style={{fontSize:10,marginLeft:"auto",fontWeight:700,
                  color:analysis.confidence==="high"?"#43a047":
                        analysis.confidence==="medium"?"#fb8c00":"#ef5350"}}>
                  {analysis.confidence==="high"?"높음":
                   analysis.confidence==="medium"?"보통":"낮음"}
                </span>
              </div>
              {/* 색상 칩 */}
              {analysis.colors?.length>0 && (
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:4}}>
                  {analysis.colors.map(c=>{
                    const colorMap={purple:"#9c27b0",black:"#333",red:"#e53935",blue:"#1e88e5",
                      green:"#43a047",orange:"#fb8c00",gold:"#fdd835",pearl:"#e0e0e0",
                      white:"#f5f5f5",gray:"#9e9e9e",pink:"#e91e63",teal:"#009688",silver:"#bdbdbd"};
                    const bg = colorMap[c.toLowerCase()]||"#ddd";
                    return (
                      <span key={c} style={{
                        fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,
                        background:bg,color:["white","pearl","gold","silver","gray"].includes(c)?"#333":"#fff",
                        border:"1px solid rgba(0,0,0,0.1)"}}>
                        {c}
                      </span>
                    );
                  })}
                </div>
              )}
              {/* 색상 설명 */}
              {analysis.colorDescription && (
                <div style={{fontSize:11,color:"#666",fontStyle:"italic"}}>
                  "{analysis.colorDescription}"
                </div>
              )}
            </div>
          )}

          {/* 매칭 결과 */}
          {step==="done" && results.length>0 && (
            <div>
              <div style={{fontSize:12,color:"#888",fontWeight:700,marginBottom:10,
                letterSpacing:1}}>매칭된 볼 ({results.length}개)</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {results.map((ball,idx)=>{
                  const d = ball.weightData?.[15]||ball.weightData?.[16];
                  const oilColor = COND_C[ball.condition]||"#aaa";
                  return (
                    <div key={ball.id}
                      onClick={()=>onSelectBall&&onSelectBall(ball)}
                      style={{
                      background:"#fff",borderRadius:16,overflow:"hidden",
                      boxShadow:"0 2px 12px rgba(0,0,0,0.07)",
                      cursor:"pointer",
                      border:`1.5px solid ${idx===0?ball.accent+"55":"#e2e2e0"}`}}>
                      {idx===0&&<div style={{height:3,background:ball.accent}}/>}
                      <div style={{padding:"12px 14px",display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{position:"relative",flexShrink:0}}>
                          <div style={{width:56,height:56,borderRadius:"50%",overflow:"hidden",
                            boxShadow:`0 4px 14px ${ball.accent}44`,
                            border:`2px solid ${ball.accent}33`}}>
                            <BowwwlImg
                              src={`https://www.bowwwl.com/sites/default/files/styles/ball_grid/public/balls/${ball.ballSlug}.png`}
                              alt={ball.name} size={56} radius="50%"/>
                          </div>
                          {idx===0&&(
                            <div style={{position:"absolute",top:-4,right:-4,
                              width:18,height:18,borderRadius:"50%",
                              background:"#ff8c00",border:"2px solid #fff",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:10,fontWeight:900,color:"#fff"}}>1</div>
                          )}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:10,color:"#888",fontWeight:700,
                            letterSpacing:1.2,marginBottom:2}}>{ball.brand.toUpperCase()}</div>
                          <div style={{fontSize:15,fontWeight:800,color:"#111",
                            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                            marginBottom:4}}>{ball.name}</div>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <span style={{fontSize:10,padding:"2px 7px",borderRadius:8,
                              background:`${oilColor}18`,color:oilColor,fontWeight:700}}>
                              {ball.condition?.replace(" Oil","")}
                            </span>
                            {d&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,
                              background:`${ball.accent}12`,color:ball.accent,fontWeight:700}}>
                              RG {d.rg} · DIFF {d.diff}
                            </span>}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:20,fontWeight:900,color:ball.accent,lineHeight:1}}>
                            {ball.matchScore}%
                          </div>
                          <div style={{fontSize:9,color:"#aaa",fontWeight:600}}>매칭률</div>
                          <div style={{fontSize:9,color:ball.accent,fontWeight:700,marginTop:2}}>
                            스펙보기 →
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 매칭 실패 */}
          {step==="nomatch" && (
            <div style={{background:"#fff3e0",borderRadius:14,padding:"18px",
              textAlign:"center",border:"1px solid #ffcc80"}}>
              <div style={{fontSize:28,marginBottom:8}}>🤔</div>
              <div style={{fontWeight:700,fontSize:14,color:"#e65100",marginBottom:6}}>
                매칭된 볼을 찾지 못했어요
              </div>
              <div style={{fontSize:12,color:"#888",lineHeight:1.7}}>
                {analysis?.brand||analysis?.name?
                  `"${[analysis.brand,analysis.name].filter(Boolean).join(" ")}" 으로 인식됐지만\nDB에 없는 제품이에요`:
                  "볼 이름이 보이도록 더 가까이서 촬영해보세요"}
              </div>
            </div>
          )}

          {/* 오류 */}
          {step==="error" && (
            <div style={{background:"#ffebee",borderRadius:14,padding:"18px",
              border:"1px solid #ffcdd2",textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:8}}>⚠️</div>
              <div style={{fontWeight:700,fontSize:14,color:"#c62828",marginBottom:4}}>오류 발생</div>
              <div style={{fontSize:12,color:"#888"}}>{errorMsg}</div>
            </div>
          )}

          {/* 다시 시도 */}
          {(step==="done"||step==="nomatch"||step==="error") && (
            <button onClick={reset} style={{
              marginTop:12,width:"100%",padding:"12px",background:"#f5f5f7",
              border:"none",borderRadius:14,color:"#555",fontFamily:"inherit",
              fontSize:13,fontWeight:700,cursor:"pointer"}}>
              🔄 다시 스캔하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}


export default function RollmateApp() {
  const [view,setView]       = useState("home");
  const [sel,setSel]         = useState(null);
  const [brand,setBrand]     = useState("전체");
  const [cond,setCond]       = useState("All");
  const [search,setSearch]   = useState("");
  const [cmpList,setCmpList] = useState([]);
  const [arsenal,setArsenal] = useState([]);
  const [modal,setModal]     = useState(null);
  const [editEnt,setEditEnt] = useState(null);
  const [toast,setToast]     = useState(null);
  const [splash,setSplash]   = useState(true);
  const [sortBy,setSortBy]   = useState("popular");
  const [rgOrder,setRgOrder]   = useState("asc");   // asc=낮은순 desc=높은순
  const [diffOrder,setDiffOrder] = useState("desc"); // asc=낮은순 desc=높은순
  const [nickname,setNickname] = useState(()=>localStorage.getItem("rm_nickname")||"");
  const [isAdmin,setIsAdmin]   = useState(()=>localStorage.getItem("rm_admin")==="1");
  const [dbLoading,setDbLoading] = useState(false);
  const [showLoginModal,setShowLoginModal] = useState(false);
  const [showCmpToast,setShowCmpToast]   = useState(false);
  const [arsenalFilter,setArsenalFilter] = useState(null);
  const [showMyPage,setShowMyPage]       = useState(false);
  const [myPageSection,setMyPageSection] = useState(null);
  const [posts,setPosts]                 = useState([]);
  const [scores,setScores]               = useState([]);
  const [ballLikes,setBallLikes]         = useState([]);
  const [myBowlingTab,setMyBowlingTab]   = useState("arsenal"); // arsenal | scores
  const [dbPopularity,setDbPopularity]   = useState({});
  const [pendingCount,setPendingCount]   = useState(0); // 가입신청 대기 수 // Supabase 인기순위 // null | 'Heavy' | 'Medium' | 'Light'
  const [notices,setNotices]   = useState([]);
  const scrollPos            = useRef(0);

  useEffect(()=>{setTimeout(()=>setSplash(false),2000);},[]);

  // 앱 시작 시 저장된 닉네임+비번 있으면 자동 로그인
  useEffect(()=>{
    const saved = localStorage.getItem("rm_nickname");
    const savedPw = localStorage.getItem("rm_pw");
    if(saved && savedPw && arsenal.length===0){
      setDbLoading(true);
      // 비밀번호 재확인
      sbGet("users", `nickname=eq.${encodeURIComponent(saved)}&select=password`)
        .then(users=>{
          if(users.length===0 || users[0].password !== savedPw){
            // 비번 불일치 → 로그아웃
            localStorage.removeItem("rm_nickname");
            localStorage.removeItem("rm_pw");
            setNickname("");
            setView("home");
            return;
          }
          return sbGet("equipment", `nickname=eq.${encodeURIComponent(saved)}&order=created_at.asc`);
        })
        .then(data=>{
          if(!data) return;
          const mapped = data.map(r=>({
            dbId: r.id,
            ballId: r.ball_id,
            nickname: r.ball_name_alias||"",
            weight: r.weight||15,
            grip: r.grip||"세미팁",
            drill_pin: r.drilling_pin||"",
            drill_cg: r.drilling_cg||"",
            drill_mb: r.drilling_mb_angle||"",
            drill_note: r.drilling_notes||"",
            purchase_date: r.purchase_date||"",
            purchase_price: r.purchase_price||"",
            memo: r.memo||"",
            surface_logs: r.surface_logs||[],
            addedAt: new Date(r.created_at).getTime(),
          }));
          setArsenal(mapped);
        })
        .catch(()=>{})
        .finally(()=>setDbLoading(false));
    }
    // 공지사항 불러오기
    sbGet("notices","is_active=eq.true&order=created_at.desc")
      .then(d=>setNotices(d)).catch(()=>{});
  },[]);

  // 공지사항 주기적 갱신 (30초)
  useEffect(()=>{
    if(!nickname || isAdmin) return;
    const timer = setInterval(()=>{
      sbGet("notices","is_active=eq.true&order=created_at.desc")
        .then(d=>setNotices(d)).catch(()=>{});
    }, 30000);
    return ()=>clearInterval(timer);
  },[nickname, isAdmin]);

  // 뷰 전환 시 스크롤 저장/복원
  const prevView = useRef("home");
  useEffect(()=>{
    // detail 진입 시 현재 스크롤 저장
    if(sel){
      scrollPos.current = window.scrollY;
    }
    // detail → 이전 뷰 복귀 시 스크롤 복원
    if(!sel && (view==="balls"||view==="home")){
      const saved = scrollPos.current;
      requestAnimationFrame(()=>{
        window.scrollTo({top:saved,behavior:"instant"});
      });
    }
    prevView.current = view;
  },[view, sel]);

  const showToast = (msg,color="#43a047")=>{
    setToast({msg,color}); setTimeout(()=>setToast(null),2300);
  };

  const brandCounts = BRANDS.slice(1).map(b=>({
    brand:b,count:ALL_BALLS.filter(x=>x.brand===b).length,icon:BRAND_ICON[b]||"🎳"
  })).sort((a,b)=>b.count-a.count);

  const filtered = ALL_BALLS.filter(b=>{
    const mB=brand==="전체"||b.brand===brand;
    const mC=cond==="All"||b.condition===cond;
    const _sq = search.toLowerCase().trim();
    const _en = koToEn(_sq);
    const _searchTarget = (s) => s.toLowerCase();
    const mS = !_sq ||
      _searchTarget(b.name).includes(_sq) ||
      _searchTarget(b.brand).includes(_sq) ||
      (_en && (_searchTarget(b.name).includes(_en.toLowerCase()) ||
               _searchTarget(b.brand).includes(_en.toLowerCase())));
    return mB&&mC&&mS;
  }).sort((a,b)=>{
    if(sortBy==="popular"){
      const pop = Object.keys(dbPopularity).length>0 ? dbPopularity : POPULARITY;
      return (pop[b.name]||0)-(pop[a.name]||0);
    }
    if(sortBy==="latest"){
      const parseDate=s=>{if(!s)return 0;const[m,y]=s.split(" ");const months={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};return parseInt(y)*100+(months[m]||0);};
      return parseDate(b.releaseDate)-parseDate(a.releaseDate);
    }
    if(sortBy==="rg") return rgOrder==="asc"
      ? (a.weightData?.[15]?.rg||9)-(b.weightData?.[15]?.rg||9)
      : (b.weightData?.[15]?.rg||9)-(a.weightData?.[15]?.rg||9);
    if(sortBy==="diff") return diffOrder==="desc"
      ? (b.weightData?.[15]?.diff||0)-(a.weightData?.[15]?.diff||0)
      : (a.weightData?.[15]?.diff||0)-(b.weightData?.[15]?.diff||0);
    return 0;
  });

  const inArsenal = id => arsenal.some(e=>e.ballId===id);
  const toggleCmp = ball => {
    if(cmpList.find(b=>b.id===ball.id)){
      const next = cmpList.filter(b=>b.id!==ball.id);
      setCmpList(next);
      if(next.length < 2) setShowCmpToast(false);
    } else if(cmpList.length<3){
      const next = [...cmpList, ball];
      setCmpList(next);
      if(next.length >= 2) setShowCmpToast(true);
    }
  };
  const handleSave = async form => {
    const dbRow = {
      nickname: nickname,
      ball_id: modal.id,
      ball_name: modal.name,
      ball_name_alias: form.nickname||"",
      weight: form.weight,
      grip: form.grip||"세미팁",
      drilling_pin: form.drill_pin||"",
      drilling_cg: form.drill_cg||"",
      drilling_mb_angle: form.drill_mb||"",
      drilling_notes: form.drill_note||"",
      purchase_date: form.purchase_date||null,
      purchase_price: form.purchase_price ? parseInt(form.purchase_price) : null,
      memo: form.memo||"",
      surface_logs: form.surface_logs||[],
    };
    try {
      if(editEnt && editEnt.dbId) {
        await sbUpdate("equipment", editEnt.dbId, {...dbRow, updated_at: new Date().toISOString()});
        setArsenal(prev=>prev.map(e=>e.addedAt===editEnt.addedAt?{...e,...form,dbId:editEnt.dbId}:e));
        showToast("✏️ 수정 완료");
      } else {
        const res = await sbInsert("equipment", dbRow);
        const newDbId = res[0]?.id;
        setArsenal(prev=>[...prev,{ballId:modal.id,...form,dbId:newDbId,addedAt:Date.now()}]);
        showToast(`🎳 ${modal.name} 등록 완료!`);
      }
    } catch(e) {
      showToast("저장 오류 발생","#ef5350");
    }
    setModal(null); setEditEnt(null);
  };

  const handleRemove = async (entry) => {
    try {
      if(entry.dbId) await sbDelete("equipment", entry.dbId);
      setArsenal(prev=>prev.filter(e=>e.addedAt!==entry.addedAt));
      showToast("🗑️ 삭제됨","#ef5350");
    } catch(e) {
      showToast("삭제 오류","#ef5350");
    }
  };

  const NAV=[
    {k:"home",     l:"홈",       i:"⌂"},
    {k:"balls",    l:"볼링공",    i:"◉"},
    {k:"compare",  l:"비교",      i:"⇌", badge:cmpList.length||null},
    {k:"scan",     l:"스캔",      i:"⬡"},
    {k:"mybowling",l:"마이볼링",  i:"◈", badge:arsenal.length||null},
  ];

  // SPLASH
  if(splash) return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",
      background:"linear-gradient(135deg,#0a0a08 0%,#121210 55%,#1c1c1e 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700;800;900&display=swap');
        @keyframes rollIn{from{transform:translateX(-90px) rotate(-300deg);opacity:0}to{transform:none;opacity:1}}
        @keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
        @keyframes trackLine{from{width:0}to{width:100%}}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
      `}</style>
      <div style={{animation:"rollIn .9s cubic-bezier(.34,1.26,.64,1) both",fontSize:80,
        filter:"drop-shadow(0 0 36px rgba(144,202,249,.55))"}}>🎳</div>
      <div style={{fontFamily:"'Bebas Neue','Inter',sans-serif",fontWeight:400,fontSize:52,
        color:"#fff",letterSpacing:8,
        animation:"fadeUp .6s .5s both",marginTop:8,
        textShadow:"0 0 30px rgba(255,140,0,0.35)"}}>
        ROLL<span style={{
          color:"#ff8c00",
          textShadow:"0 0 24px rgba(255,140,0,0.8)",
        }}>MATE</span>
      </div>
      <div style={{fontSize:15,color:"#ff8c00",letterSpacing:1.5,
        fontWeight:700,
        animation:"fadeUp .6s .7s both",marginTop:10}}>Ready to Roll?</div>
      <div style={{fontSize:12,color:"rgba(212,175,55,.75)",letterSpacing:2,
        fontStyle:"italic",fontWeight:400,
        animation:"fadeUp .6s .9s both",marginTop:6}}>Know before you throw.</div>
      <div style={{marginTop:26,width:130,height:2,background:"rgba(255,255,255,.1)",borderRadius:2,
        overflow:"hidden",animation:"fadeUp .6s 1s both"}}>
        <div style={{height:"100%",background:"#ff8c00",animation:"trackLine 1.1s 1s ease both"}}/>
      </div>
    </div>
  );

  // 로그인 후 콜백
  const handleLogin = (n, data, admin, noticeData) => {
    setNickname(n);
    setIsAdmin(!!admin);
    setShowLoginModal(false);
    if(noticeData) setNotices(noticeData);
    if(!data || data.length === 0){ setArsenal([]); return; }
    const mapped = data.map(r=>({
      dbId: r.id,
      ballId: r.ball_id,
      nickname: r.ball_name_alias||"",
      weight: r.weight||15,
      grip: r.grip||"세미팁",
      drill_pin: r.drilling_pin||"",
      drill_cg: r.drilling_cg||"",
      drill_mb: r.drilling_mb_angle||"",
      drill_note: r.drilling_notes||"",
      purchase_date: r.purchase_date||"",
      purchase_price: r.purchase_price||"",
      memo: r.memo||"",
      surface_logs: r.surface_logs||[],
      addedAt: new Date(r.created_at).getTime(),
    }));
    setArsenal(mapped);
  };

  // 관리자도 일반 화면 사용 (isAdmin으로 관리버튼만 추가)


  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#f2f2f0",minHeight:"100vh",overflowX:"hidden",maxWidth:"100vw",width:"100%"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{overflow-x:hidden;max-width:100vw;width:100%}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#b0b0ae;border-radius:2px}
        @keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
        @keyframes toastIn{from{transform:translateX(-50%) translateY(8px);opacity:0}to{transform:translateX(-50%);opacity:1}}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
        .bcard{background:#fff;border-radius:18px;padding:13px;cursor:pointer;
          transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden;
          box-shadow:0 1px 8px rgba(28,28,30,.06);border:1.5px solid rgba(15,37,87,.06)}
        .bcard:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(28,28,30,.12)}
        .tag{font-size:8px;font-weight:700;letter-spacing:.8px;padding:2px 6px;border-radius:4px;text-transform:uppercase}
        .sbar{height:5px;background:#e2e2e0;border-radius:3px;overflow:hidden}
        .nav-btn{display:flex;flex-direction:column;align-items:center;gap:1px;padding:6px 0;
          border:none;background:transparent;cursor:pointer;position:relative;flex:1;transition:all .2s;color:#fff}
        .nav-lbl{font-size:9px;font-weight:700;letter-spacing:.8px;color:#888886;transition:.18s}
        .nav-btn.act .nav-lbl{color:#1c1c1e;font-weight:800}
        .chip{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:11px;cursor:pointer;
          transition:all .17s;border:none;font-weight:700;font-size:11px;white-space:nowrap;flex-shrink:0}
        @media(max-width:360px){
          .bcard{padding:10px;border-radius:14px}
          .chip{padding:5px 8px;font-size:10px}
          .nav-btn{padding:4px 8px}
          .rm-topbar-logo{font-size:22px!important}
        }
        @media(min-width:600px){
          .bcard{padding:16px;border-radius:20px}
          .chip{padding:8px 14px;font-size:12px}
          .rm-ball-grid{grid-template-columns:repeat(3,1fr)!important}
          .rm-arsenal-grid{grid-template-columns:repeat(3,1fr)!important}
          .rm-stat-grid{grid-template-columns:repeat(3,1fr)!important}
        }
        @media(min-width:900px){
          .rm-ball-grid{grid-template-columns:repeat(4,1fr)!important}
          .rm-arsenal-grid{grid-template-columns:repeat(4,1fr)!important}
          .bcard{padding:18px}
        }
      `}</style>

      {toast&&<div style={{position:"fixed",bottom:84,left:"50%",background:"#ffffff",
        border:`1.5px solid ${toast.color}44`,color:toast.color,padding:"10px 18px",borderRadius:12,
        zIndex:9999,fontWeight:700,fontSize:12,boxShadow:`0 4px 20px ${toast.color}22`,
        animation:"toastIn .22s ease both",transform:"translateX(-50%)",whiteSpace:"nowrap"}}>{toast.msg}</div>}

      {modal&&<RegModal ball={modal} existing={editEnt} onSave={handleSave}
        onClose={()=>{setModal(null);setEditEnt(null);}}/>}

      {/* 비교 팝업 토스트 */}
      {showCmpToast&&view==="home"&&(
        <CmpToast
          cmpList={cmpList}
          onGo={()=>{setShowCmpToast(false);setView("compare");setSel(null);}}
          onDismiss={()=>setShowCmpToast(false)}
        />
      )}


      {/* 마이페이지 슬라이드 패널 */}
      {showMyPage&&nickname&&(
        <MyPagePanel
          nickname={nickname}
          arsenal={arsenal}
          isAdmin={isAdmin}
          pendingCount={pendingCount||0}
          onMemberManage={()=>setView("admin_members")}
          onClose={()=>setShowMyPage(false)}
          onPasswordChange={async(oldPw,newPw)=>{
            try {
              const users = await sbGet("users",`nickname=eq.${encodeURIComponent(nickname)}&select=password`);
              if(!users.length||users[0].password!==oldPw) return "현재 비밀번호가 틀렸어요";
              await sbFetch(`/users?nickname=eq.${encodeURIComponent(nickname)}`,
                {method:"PATCH",body:JSON.stringify({password:newPw}),prefer:"return=representation"});
              localStorage.setItem("rm_pw",newPw);
              return null;
            } catch(e){ return "오류 발생"; }
          }}
          onNicknameChange={async(newNick)=>{
            try {
              const exists = await sbGet("users",`nickname=eq.${encodeURIComponent(newNick)}&select=id`);
              if(exists.length) return "이미 사용 중인 닉네임이에요";
              await sbFetch(`/users?nickname=eq.${encodeURIComponent(nickname)}`,
                {method:"PATCH",body:JSON.stringify({nickname:newNick}),prefer:"return=representation"});
              localStorage.setItem("rm_nickname",newNick);
              setNickname(newNick);
              return null;
            } catch(e){ return "오류 발생"; }
          }}
          onDeleteAll={async()=>{
            if(!window.confirm("정말 삭제할까요?")) return;
            try {
              await sbFetch(`/equipment?nickname=eq.${encodeURIComponent(nickname)}`,{method:"DELETE"});
              await sbFetch(`/users?nickname=eq.${encodeURIComponent(nickname)}`,{method:"DELETE"});
              localStorage.removeItem("rm_nickname"); localStorage.removeItem("rm_pw"); localStorage.removeItem("rm_admin");
              setNickname(""); setArsenal([]); setIsAdmin(false); setView("home"); setShowMyPage(false);
            } catch(e){ showToast("오류 발생","#ef5350"); }
          }}
          onLogout={()=>{
            localStorage.removeItem("rm_nickname"); localStorage.removeItem("rm_pw"); localStorage.removeItem("rm_admin");
            setNickname(""); setArsenal([]); setIsAdmin(false); setView("home"); setShowMyPage(false);
            showToast("로그아웃 됐어요");
          }}
          showToast={showToast}
        />
      )}

      {/* 로그인 팝업 (비로그인 탭 접근 시) */}
      {showLoginModal&&(
        <LoginPopup
          onLogin={handleLogin}
          onClose={()=>setShowLoginModal(false)}
        />
      )}

      {/* TOP BAR */}
      <div style={{background:"rgba(28,28,30,.97)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(255,140,0,.2)",padding:"0 10px",position:"sticky",top:0,zIndex:100,overflow:"hidden",width:"100%",boxSizing:"border-box"}}>
        <div style={{width:"100%",display:"flex",alignItems:"center",height:50,gap:6}}>
          {/* 로고 */}
          <div onClick={()=>{setSel(null);setView("home");setBrand("전체");setSearch("");}}
            style={{display:"flex",alignItems:"center",gap:5,flexShrink:0,cursor:"pointer"}}>
            <span style={{fontSize:20}}>🎳</span>
            <span style={{fontFamily:"'Exo 2','Inter',sans-serif",fontWeight:900,
              fontSize:22,color:"#fff",letterSpacing:"0.01em",lineHeight:1,
              textTransform:"uppercase"}}>
              ROLL<span style={{color:"#ff8c00",textShadow:"0 0 12px rgba(255,140,0,0.6)"}}>MATE</span>
            </span>
            {isAdmin&&(
              <span style={{fontSize:9,fontWeight:800,background:"#ff8c00",color:"#fff",
                padding:"1px 5px",borderRadius:4,letterSpacing:0.5,marginLeft:2}}>
                ADMIN
              </span>
            )}
          </div>
          {/* 검색창 자리 - balls 뷰로 이동 */}
          <div style={{flex:1}}/>
          {/* 마이페이지 버튼 */}
          {nickname ? (
            <div onClick={()=>setShowMyPage(true)} style={{
              width:32,height:32,borderRadius:"50%",flexShrink:0,cursor:"pointer",
              background:"linear-gradient(135deg,#ff8c00,#e65100)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,fontWeight:900,color:"#fff",
              boxShadow:"0 2px 10px rgba(255,140,0,0.45)"}}>
              {nickname.charAt(0).toUpperCase()}
            </div>
          ):(
            <button onClick={()=>setShowLoginModal(true)} style={{
              flexShrink:0,padding:"5px 10px",borderRadius:16,border:"1px solid rgba(255,140,0,0.4)",
              background:"rgba(255,140,0,0.1)",color:"#ff8c00",
              fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
              로그인
            </button>
          )}
        </div>
      </div>

      <div style={{maxWidth:820,margin:"0 auto",padding:"16px 12px 98px"}}>

        {/* HOME */}
        {view==="home"&&!sel&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            {/* 공지사항 배너 */}
            <div style={{marginBottom:16}}>
              {/* 관리자 공지 추가 버튼 */}
              {isAdmin&&(
                <AdminNoticePanel
                  notices={notices}
                  setNotices={setNotices}
                  showToast={showToast}
                />
              )}
              {notices.filter(n=>n.is_active!==false).map(n=>(
                <div key={n.id} style={{
                  background:"linear-gradient(135deg,#18181b 0%,#1c1917 100%)",
                  borderRadius:16,marginBottom:8,overflow:"hidden",
                  boxShadow:"0 2px 16px rgba(0,0,0,0.18)"}}>
                  <div style={{height:2,background:"linear-gradient(90deg,#ff8c00,#e65100)"}}/>
                  <div style={{padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{background:"rgba(255,140,0,0.15)",borderRadius:8,padding:"5px 8px",
                      fontSize:10,color:"#ff8c00",fontWeight:800,letterSpacing:1,flexShrink:0}}>NOTICE</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#fff",marginBottom:2}}>{n.title}</div>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{n.content}</div>
                    </div>
                    {isAdmin&&(
                      <button onClick={async()=>{
                        if(!window.confirm("삭제할까요?")) return;
                        await sbFetch(`/notices?id=eq.${n.id}`,{method:"DELETE"});
                        setNotices(prev=>prev.filter(x=>x.id!==n.id));
                        showToast("공지 삭제 완료");
                      }} style={{background:"rgba(239,83,80,0.2)",border:"none",borderRadius:6,
                        padding:"3px 8px",color:"#ef5350",fontSize:10,cursor:"pointer",flexShrink:0,
                        fontFamily:"inherit",fontWeight:700}}>삭제</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* POPULAR */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:15,fontWeight:800,color:"#1c1c1e",display:"flex",alignItems:"center",gap:6}}>
                  🔥 <span>최신 볼링공</span>
                </div>
                {isAdmin&&(
                  <button onClick={()=>setView("admin_latest")}
                    style={{fontSize:11,color:"#ff8c00",background:"rgba(255,140,0,0.1)",
                      border:"1px solid rgba(255,140,0,0.3)",borderRadius:8,
                      padding:"3px 10px",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                    🔄 최신업데이트
                  </button>
                )}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[...ALL_BALLS].sort((a,b)=>{
                    const parseDate = (d) => {
                      if(!d) return 0;
                      const [mon,yr] = d.split(" ");
                      const months = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,
                        Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
                      return (parseInt(yr)||0)*100 + (months[mon]||0);
                    };
                    return parseDate(b.releaseDate) - parseDate(a.releaseDate);
                  }).slice(0,5).map((ball,i)=>{
                  const d=ball.weightData?.[15]||ball.weightData?.[16];
                  const oilColor=COND_COLOR[ball.condition]||"#aaa";
                  return (
                    <div key={ball.id} onClick={()=>{setSel(ball);setView("detail");}}
                      style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                        background:"#fff",borderRadius:14,cursor:"pointer",
                        border:`1px solid ${ball.accent}22`,
                        boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
                      <div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,
                        background:`linear-gradient(135deg,${ball.accent},${ball.accent}88)`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:11,fontWeight:900,color:"#fff"}}>{i+1}</div>
                      <div style={{width:40,height:40,borderRadius:"50%",overflow:"hidden",flexShrink:0,
                        boxShadow:`0 2px 10px ${ball.accent}44`,border:`1.5px solid ${ball.accent}33`}}>
                        <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={40} radius="50%"/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:9,color:"#888",fontWeight:700,letterSpacing:1}}>{ball.brand.toUpperCase()}</div>
                        <div style={{fontSize:13,fontWeight:700,color:"#222",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ball.name}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:9,color:oilColor,fontWeight:700}}>{ball.condition?.replace(" Oil","")}</div>
                        {d&&<div style={{fontSize:12,fontWeight:900,color:ball.accent}}>RG {d.rg}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 자유게시판 */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:15,fontWeight:800,color:"#1c1c1e",display:"flex",alignItems:"center",gap:6}}>
                  📋 <span>자유게시판</span>
                </div>
                <button onClick={()=>setView("board")} style={{fontSize:11,color:"#ff8c00",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                  전체보기 →
                </button>
              </div>
              <BoardPreview nickname={nickname} onLoginRequest={()=>setShowLoginModal(true)}/>
            </div>

            {/* 볼링 영상 */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <div style={{fontSize:15,fontWeight:800,color:"#1c1c1e",display:"flex",alignItems:"center",gap:6}}>
                  🎥 <span>볼링 영상</span>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {isAdmin&&(
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>setView("admin_youtube")}
                        style={{fontSize:11,color:"#1e88e5",background:"rgba(30,136,229,0.1)",
                          border:"1px solid rgba(30,136,229,0.3)",borderRadius:8,padding:"3px 10px",
                          cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                        📡 채널관리
                      </button>
                      <button onClick={()=>{
                        sessionStorage.removeItem("bowling_videos");
                        sessionStorage.removeItem("bowling_videos_time");
                        showToast("영상 업데이트 중...");
                        setTimeout(()=>window.location.reload(), 500);
                      }} style={{fontSize:11,color:"#43a047",background:"rgba(67,160,71,0.1)",
                        border:"1px solid rgba(67,160,71,0.3)",borderRadius:8,padding:"3px 10px",
                        cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                        🔄 최신업데이트
                      </button>
                    </div>
                  )}
                  <button onClick={()=>setView("videos")} style={{fontSize:12,color:"#ff8c00",
                    background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                    전체보기 →
                  </button>
                </div>
              </div>
              <VideoBoard preview={true}/>
            </div>
          </div>
        )}

        {/* DETAIL */}
        {view==="detail"&&sel&&(
          <Detail ball={sel} onBack={()=>{setView("balls");setSel(null);}}
            inArsenal={inArsenal} onReg={(b)=>{setModal(b);setEditEnt(null);}}/>
        )}

                {/* BALLS - 볼링공 리스트 */}
        {view==="balls"&&!sel&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <div style={{marginBottom:10}}>
              <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e",marginBottom:10}}>
                {brand==="전체"
                  ? `볼링공 (${ALL_BALLS.length})`
                  : `볼링공 (${ALL_BALLS.length}) › ${brand}(${({
  "Storm":"스톰","Hammer":"해머","Motiv":"모티브","Roto Grip":"로토그립",
  "900 Global":"900글로벌","Brunswick":"브런즈윅","Columbia 300":"콜롬비아300",
  "DV8":"디브이8","Ebonite":"에보나이트","Radical":"래디컬","Track":"트랙",
  "SWAG":"스왜그","Pyramid":"피라미드"
}[brand])||""}) (${ALL_BALLS.filter(b=>b.brand===brand).length})`
                }
              </div>
              {/* 검색창 */}
              <div style={{position:"relative",marginBottom:10}}>
                <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"#ff8c00"}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="볼 이름, 브랜드 검색..."
                  style={{width:"100%",background:"#fff",border:"1.5px solid #e8e8e8",borderRadius:20,
                    color:"#333",padding:"9px 12px 9px 30px",fontSize:13,fontWeight:500,
                    outline:"none",boxSizing:"border-box",fontFamily:"inherit",
                    boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}/>
                {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",
                  transform:"translateY(-50%)",background:"none",border:"none",
                  color:"#aaa",cursor:"pointer",fontSize:16}}>✕</button>}
              </div>
            </div>
            {/* 브랜드 필터 */}
            <div style={{marginBottom:10,overflowX:"auto",display:"flex",gap:6,
              msOverflowStyle:"none",scrollbarWidth:"none",paddingBottom:4}}>
              {brandCounts.map(({brand:b,count,icon})=>{
                const act=brand===b;
                const logo=BRAND_LOGO?.[b];
                return <button key={b} className="chip" onClick={()=>setBrand(act?"전체":b)} style={{
                  background:act?"#1c1c1e":"#fff",
                  color:act?"#fff":"#1a1a2e",flexShrink:0,
                  padding:"8px 14px",
                  boxShadow:act?"0 4px 14px rgba(55,65,81,.28)":"0 1px 4px rgba(0,0,0,0.07)",
                  border:`1px solid ${act?"#1c1c1e":"#e8e8e8"}`}}>
                  <BrandLogo brand={b} size={28} active={act}/>

                </button>;
              })}
            </div>
            {/* 정렬 */}
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {[{k:"popular",l:"🔥 인기순"},{k:"latest",l:"🆕 최신순"}].map(s=>(
                <button key={s.k} onClick={()=>setSortBy(s.k)} style={{
                  padding:"5px 12px",borderRadius:20,border:`1.5px solid ${sortBy===s.k?"#ff8c00":"rgba(255,255,255,0.15)"}`,
                  background:sortBy===s.k?"rgba(255,140,0,0.15)":"#fff",
                  color:sortBy===s.k?"#ff8c00":"#666",
                  fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {s.l}
                </button>
              ))}
              <select value={rgOrder==="none"?"none":rgOrder==="asc"?"rg_asc":"rg_desc"}
                onChange={e=>{const v=e.target.value;if(v==="none")setRgOrder("none");else if(v==="rg_asc"){setRgOrder("asc");setSortBy("rg");}else{setRgOrder("desc");setSortBy("rg");}}}
                style={{padding:"5px 8px",borderRadius:20,border:"1.5px solid rgba(255,255,255,0.15)",
                  background:"#fff",color:"#555",
                  fontFamily:"inherit",fontSize:12,cursor:"pointer",outline:"none"}}>
                <option value="none" style={{background:"#1c1c1e",color:"#aaa"}}>RG</option>
                <option value="rg_asc" style={{background:"#1c1c1e",color:"#fff"}}>낮은순</option>
                <option value="rg_desc" style={{background:"#1c1c1e",color:"#fff"}}>높은순</option>
              </select>
              <select value={diffOrder==="none"?"none":diffOrder==="desc"?"diff_desc":"diff_asc"}
                onChange={e=>{const v=e.target.value;if(v==="none")setDiffOrder("none");else if(v==="diff_desc"){setDiffOrder("desc");setSortBy("diff");}else{setDiffOrder("asc");setSortBy("diff");}}}
                style={{padding:"5px 8px",borderRadius:20,border:"1.5px solid rgba(255,255,255,0.15)",
                  background:"#fff",color:"#555",
                  fontFamily:"inherit",fontSize:12,cursor:"pointer",outline:"none"}}>
                <option value="none" style={{background:"#1c1c1e",color:"#aaa"}}>DIFF</option>
                <option value="diff_desc" style={{background:"#1c1c1e",color:"#fff"}}>높은순</option>
                <option value="diff_asc" style={{background:"#1c1c1e",color:"#fff"}}>낮은순</option>
              </select>
            </div>
            {/* 볼 그리드 */}
            <div className="rm-ball-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
               {filtered.map(ball=>(
                 <div key={ball.id} className="bcard"
                   style={{display:"flex",flexDirection:"column",minHeight:195}}
                   onClick={()=>{setSel(ball);setView("detail");}}
                 >
                   <div style={{position:"absolute",top:0,left:0,right:0,height:3,
                     background:`linear-gradient(90deg,${ball.accent},${ball.accent}44)`,borderRadius:"18px 18px 0 0"}}/>
                   <div style={{display:"flex",justifyContent:"center",marginBottom:7,marginTop:6}}>
                     <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={72} radius="50%"/>
                   </div>
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:4,height:16}}>
                      {BRAND_LOGO[ball.brand]?.img ? (
                        <img src={BRAND_LOGO[ball.brand].img} alt={ball.brand}
                          style={{height:13,maxWidth:56,objectFit:"contain",opacity:0.75}}/>
                      ):(
                        <span style={{fontSize:9,color:ball.accent,fontWeight:800,
                          letterSpacing:1}}>{ball.brand.toUpperCase()}</span>
                      )}
                    </div>
                   <div style={{fontWeight:800,fontSize:12,color:"#111",textAlign:"center",
                     lineHeight:1.35,height:32,overflow:"hidden",textOverflow:"ellipsis",
                     display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",
                     flexShrink:0,marginBottom:6}}>{ball.name}</div>
                   <div style={{flex:1}}/>
                  {cmpList.find(b=>b.id===ball.id)?(
                    <button onClick={e=>{e.stopPropagation();toggleCmp(ball);}} style={{
                      width:"100%",padding:"6px 0",background:"#ff8c00",border:"none",
                      borderRadius:8,color:"#fff",fontFamily:"inherit",fontSize:11,fontWeight:800,
                      cursor:"pointer",boxShadow:"0 2px 8px rgba(255,140,0,0.45)"}}>
                      ✓ 비교중
                    </button>
                  ):(
                    <button onClick={e=>{e.stopPropagation();toggleCmp(ball);}} style={{
                      width:"100%",padding:"6px 0",
                      background:"linear-gradient(135deg,#1c1c1e,#2d2d3d)",
                      border:`1.5px solid rgba(255,255,255,0.15)`,
                      borderRadius:8,color:"#fff",fontFamily:"inherit",fontSize:11,fontWeight:700,
                      cursor:"pointer",letterSpacing:0.5}}>
                      + 비교
                    </button>
                  )}
                  {inArsenal(ball.id)&&(
                    <div style={{position:"absolute",top:8,right:8,width:18,height:18,borderRadius:"50%",
                      background:ball.accent,display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:10,fontWeight:900,color:"#fff"}}>✓</div>
                  )}
                </div>
              ))}
            </div>
            {/* 비교 토스트 */}
            {cmpList.length>=1&&(
              <div style={{position:"fixed",bottom:72,left:0,right:0,
                zIndex:3000,padding:"0 14px",animation:"fadeUp .25s ease"}}>
                <div style={{background:"rgba(28,28,30,0.97)",backdropFilter:"blur(16px)",
                  borderRadius:20,padding:"10px 14px",
                  display:"flex",alignItems:"center",gap:10,
                  border:"1px solid rgba(255,140,0,0.3)",
                  boxShadow:"0 8px 32px rgba(0,0,0,0.35)"}}>
                  {/* 선택된 볼 아바타 */}
                  <div style={{display:"flex",alignItems:"center",gap:-4,flexShrink:0}}>
                    {cmpList.map((b,i)=>(
                      <div key={b.id} style={{width:32,height:32,borderRadius:"50%",
                        overflow:"hidden",border:"2px solid #1c1c1e",
                        marginLeft:i>0?-8:0,zIndex:cmpList.length-i}}>
                        <BowwwlImg src={BOWWWL_BALL(b.ballSlug)} alt={b.name} size={32} radius="50%"/>
                      </div>
                    ))}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>
                      {cmpList.length}개 선택됨
                    </div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>
                      {cmpList.length<2?"1개 더 선택하면 비교 가능":"비교 준비 완료!"}
                    </div>
                  </div>
                  {cmpList.length>=2&&(
                    <button onClick={()=>{setView("compare");setSel(null);}} style={{
                      padding:"9px 18px",background:"#ff8c00",border:"none",borderRadius:14,
                      color:"#fff",fontFamily:"inherit",fontSize:13,fontWeight:800,
                      cursor:"pointer",flexShrink:0,
                      boxShadow:"0 4px 14px rgba(255,140,0,0.45)"}}>
                      비교하기 ⚖️
                    </button>
                  )}
                  <button onClick={()=>setCmpList([])} style={{
                    width:28,height:28,background:"rgba(255,255,255,0.08)",border:"none",
                    borderRadius:"50%",color:"rgba(255,255,255,0.4)",fontSize:13,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADMIN MEMBERS - 회원 관리 */}
        {view==="admin_members"&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <button onClick={()=>setView("home")} style={{background:"none",border:"none",
                color:"#aaa",cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0}}>
                ← 홈
              </button>
              <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e"}}>👥 회원 관리</div>
              {pendingCount>0&&(
                <span style={{background:"#ef5350",color:"#fff",borderRadius:"50%",
                  width:22,height:22,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:12,fontWeight:900}}>
                  {pendingCount}
                </span>
              )}
            </div>
            <MemberManageSection
              showToast={showToast}
              onPendingChange={(count)=>setPendingCount(count)}
            />
          </div>
        )}

        {/* ADMIN YOUTUBE - 유튜브 채널 관리 */}
        {view==="admin_youtube"&&(
          <AdminYoutubeView
            showToast={showToast}
            onBack={()=>setView("home")}
          />
        )}

        {/* ADMIN LATEST - 최신볼링공 관리 */}
        {view==="admin_latest"&&(
          <AdminLatestView
            showToast={showToast}
            onBack={()=>setView("home")}
          />
        )}

        {/* ADMIN POPULARITY - 인기순위 관리 */}
        {view==="admin_popularity"&&(
          <AdminPopularityView
            dbPopularity={dbPopularity}
            setDbPopularity={setDbPopularity}
            showToast={showToast}
            onBack={()=>setView("home")}
          />
        )}

        {/* BOARD - 자유게시판 */}
        {view==="board"&&(
          <BoardView nickname={nickname} onLoginRequest={()=>setShowLoginModal(true)}/>
        )}

        {/* VIDEOS - 볼링영상 전체보기 */}
        {view==="videos"&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <button onClick={()=>setView("home")} style={{background:"none",border:"none",
                color:"#aaa",cursor:"pointer",fontSize:13,fontFamily:"inherit",padding:0}}>
                ← 홈
              </button>
              <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e"}}>🎥 볼링 영상</div>
            </div>
            <VideoBoard preview={false}/>
          </div>
        )}

        {/* MYBOWLING - 마이볼링 */}
        {view==="mybowling"&&(
          <MyBowlingView
            nickname={nickname}
            arsenal={arsenal}
            scores={scores}
            setScores={setScores}
            dbLoading={dbLoading}
            setModal={setModal}
            setEditEnt={setEditEnt}
            setView={setView}
            myBowlingTab={myBowlingTab}
            setMyBowlingTab={setMyBowlingTab}
            onLoginRequest={()=>setShowLoginModal(true)}
            showToast={showToast}
          />
        )}

        {/* ARSENAL */}
        {view==="arsenal"&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                    <div style={{fontFamily:"'Exo 2','Inter',sans-serif",fontWeight:900,fontSize:20,color:"#111",letterSpacing:"-0.02em"}}>내 장비함</div>
                    <div style={{background:"#ff8c00",color:"#fff",fontSize:10,fontWeight:800,
                      padding:"2px 8px",borderRadius:20,letterSpacing:0.5}}>@{nickname}</div>
                  </div>
                  <div style={{fontSize:12,color:"#aaa",fontWeight:600}}>
                    {dbLoading ? "☁️ 불러오는 중..." : arsenalFilter
                      ? `${arsenalFilter} Oil 필터 중 · 탭하면 해제`
                      : arsenal.length>0?`${arsenal.length}개 등록 · 카드를 탭하면 뒤집혀요`:"아직 등록된 볼링공이 없어요"}
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setView("home")} style={{padding:"8px 14px",borderRadius:20,border:"none",
                    background:"#1c1c1e",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit",
                    boxShadow:"0 3px 10px rgba(0,0,0,.2)"}}>+ 추가</button>
                  <button onClick={()=>{
                    if(window.confirm("로그아웃 하시겠어요?\n(데이터는 클라우드에 저장되어 있어요)")){
                      localStorage.removeItem("rm_nickname");
                      localStorage.removeItem("rm_pw");
                      localStorage.removeItem("rm_admin");
                      setNickname(""); setArsenal([]); setIsAdmin(false);
                      setView("home");
                    }
                  }} style={{padding:"8px 12px",borderRadius:20,border:"1.5px solid #e2e2e0",
                    background:"#fff",color:"#888",cursor:"pointer",fontWeight:700,fontSize:12,fontFamily:"inherit"}}>로그아웃</button>
                </div>
              </div>
            </div>
            {arsenal.length===0?(
              <div style={{textAlign:"center",padding:"55px 20px",background:"#ffffff",border:"2px dashed #e2e2e0",borderRadius:18}}>
                <div style={{fontSize:48,marginBottom:10,opacity:.22}}>🎳</div>
                <div style={{fontWeight:800,fontSize:17,color:"#ddd"}}>장비함이 비어있어요</div>
                <button onClick={()=>setView("home")} style={{marginTop:16,padding:"9px 22px",borderRadius:18,
                  background:"#1c1c1e",border:"none",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:12,fontFamily:"inherit",
                  boxShadow:"0 4px 14px rgba(15,37,87,.28)"}}>홈으로</button>
              </div>
            ):(
              <>
                {/* 오일별 통계 */}
                <div style={{marginBottom:14}}>
                  {/* 전체 등록 볼 */}
                  {/* 컴팩트 통계 + 오일 필터 */}
                  <div style={{display:"flex",gap:6,marginBottom:0,alignItems:"stretch"}}>
                    {/* TOTAL - 클릭 시 필터 해제 */}
                    <div onClick={()=>setArsenalFilter(null)}
                      style={{background:arsenalFilter===null?"#ff8c00":"linear-gradient(135deg,#1c1c1e,#2a2a3a)",
                        borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:8,flexShrink:0,
                        boxShadow:arsenalFilter===null?"0 4px 14px rgba(255,140,0,0.4)":"0 2px 8px rgba(0,0,0,0.15)",
                        cursor:"pointer",transition:"all .2s",border:`1.5px solid ${arsenalFilter===null?"#ff8c00":"transparent"}`}}>
                      <span style={{fontSize:16}}>🎳</span>
                      <div>
                        <div style={{fontSize:9,color:arsenalFilter===null?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.4)",fontWeight:700,letterSpacing:1}}>ALL</div>
                        <div style={{fontFamily:"'Exo 2',sans-serif",fontWeight:900,fontSize:20,color:"#fff",lineHeight:1}}>
                          {arsenal.length}<span style={{fontSize:10,color:arsenalFilter===null?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.4)",marginLeft:2}}>개</span>
                        </div>
                      </div>
                    </div>
                    {/* 오일 3개 - 클릭 필터 */}
                    {[
                      {l:"Heavy",full:"Heavy Oil",color:"#ef5350",bg:"rgba(239,83,80,0.1)",activeBg:"#ef5350"},
                      {l:"Medium",full:["Medium-Heavy Oil","Medium Oil"],color:"#fb8c00",bg:"rgba(251,140,0,0.1)",activeBg:"#fb8c00"},
                      {l:"Light",full:["Light-Medium Oil","Light Oil"],color:"#42a5f5",bg:"rgba(66,165,245,0.1)",activeBg:"#42a5f5"},
                    ].map(({l,full,color,bg,activeBg})=>{
                      const cnt = arsenal.filter(e=>{
                        const b=ALL_BALLS.find(x=>x.id===e.ballId);
                        return Array.isArray(full)?full.includes(b?.condition):b?.condition===full;
                      }).length;
                      const isActive = arsenalFilter===l;
                      return (
                        <div key={l} onClick={()=>setArsenalFilter(isActive?null:l)}
                          style={{flex:1,background:isActive?activeBg:bg,borderRadius:12,
                            padding:"10px 8px",cursor:"pointer",
                            border:`1.5px solid ${isActive?activeBg:color+"33"}`,
                            transition:"all .2s",textAlign:"center",
                            boxShadow:isActive?`0 4px 14px ${color}44`:"none"}}>
                          <div style={{fontFamily:"'Exo 2',sans-serif",fontWeight:900,fontSize:20,
                            color:isActive?"#fff":color,lineHeight:1,marginBottom:1}}>{cnt}</div>
                          <div style={{fontSize:9,fontWeight:700,letterSpacing:0.5,
                            color:isActive?"rgba(255,255,255,0.8)":color}}>{l.toUpperCase()}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rm-arsenal-grid" style={{display:"grid",gridTemplateColumns:"1fr",gap:10}}>
                  {arsenal.filter(entry=>{
                    if(!arsenalFilter) return true;
                    const b=ALL_BALLS.find(x=>x.id===entry.ballId);
                    if(arsenalFilter==="Heavy") return b?.condition==="Heavy Oil";
                    if(arsenalFilter==="Medium") return ["Medium-Heavy Oil","Medium Oil"].includes(b?.condition);
                    if(arsenalFilter==="Light") return ["Light-Medium Oil","Light Oil"].includes(b?.condition);
                    return true;
                  }).map(entry=>{
                    const ball=ALL_BALLS.find(b=>b.id===entry.ballId);
                    if(!ball) return null;
                    return <MyCard key={entry.addedAt} entry={entry} ball={ball}
                      onRemove={()=>handleRemove(entry)}
                      onEdit={()=>{setModal(ball);setEditEnt(entry);}}/>;
                  })}
                </div>
              </>
            )}
          </div>
        )}


        {/* SCAN - AI 볼 인식 */}
        {view==="scan"&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <BallScanner balls={ALL_BALLS} onSelectBall={(ball)=>{setSel(ball);setView("detail");}}/>
          </div>
        )}

        {/* COMPARE */}
        {view==="compare"&&(
          <CompareView cmpList={cmpList} setCmpList={setCmpList} toggleCmp={toggleCmp} setView={setView}/>
        )}

        {/* SETTINGS */}
        {view==="settings"&&(
          <SettingsView
            nickname={nickname}
            arsenal={arsenal}
            onPasswordChange={async (oldPw, newPw)=>{
              try {
                const users = await sbGet("users", `nickname=eq.${encodeURIComponent(nickname)}&select=password`);
                if(!users.length || users[0].password !== oldPw) return "현재 비밀번호가 틀렸어요.";
                await sbFetch(`/users?nickname=eq.${encodeURIComponent(nickname)}`, {
                  method:"PATCH", body:JSON.stringify({password:newPw}), prefer:"return=minimal"
                });
                localStorage.setItem("rm_pw", newPw);
                return "ok";
              } catch(e) { return "오류가 발생했어요."; }
            }}
            onNicknameChange={async (newNick, pw)=>{
              try {
                const users = await sbGet("users", `nickname=eq.${encodeURIComponent(nickname)}&select=password`);
                if(!users.length || users[0].password !== pw) return "비밀번호가 틀렸어요.";
                const dup = await sbGet("users", `nickname=eq.${encodeURIComponent(newNick)}&select=id`);
                if(dup.length) return "이미 사용 중인 닉네임이에요.";
                await sbFetch(`/users?nickname=eq.${encodeURIComponent(nickname)}`, {
                  method:"PATCH", body:JSON.stringify({nickname:newNick}), prefer:"return=minimal"
                });
                await sbFetch(`/equipment?nickname=eq.${encodeURIComponent(nickname)}`, {
                  method:"PATCH", body:JSON.stringify({nickname:newNick}), prefer:"return=minimal"
                });
                localStorage.setItem("rm_nickname", newNick);
                setNickname(newNick);
                return "ok";
              } catch(e) { return "오류가 발생했어요."; }
            }}
            onDeleteAll={async (pw)=>{
              try {
                const users = await sbGet("users", `nickname=eq.${encodeURIComponent(nickname)}&select=password`);
                if(!users.length || users[0].password !== pw) return "비밀번호가 틀렸어요.";
                await sbFetch(`/equipment?nickname=eq.${encodeURIComponent(nickname)}`, {
                  method:"DELETE", prefer:""
                });
                await sbFetch(`/users?nickname=eq.${encodeURIComponent(nickname)}`, {
                  method:"DELETE", prefer:""
                });
                localStorage.removeItem("rm_nickname");
                localStorage.removeItem("rm_pw");
                localStorage.removeItem("rm_admin");
                setNickname(""); setArsenal([]); setIsAdmin(false);
                return "ok";
              } catch(e) { return "오류가 발생했어요."; }
            }}
            onLogout={()=>{
              localStorage.removeItem("rm_nickname");
              localStorage.removeItem("rm_pw");
              localStorage.removeItem("rm_admin");
              setNickname(""); setArsenal([]); setIsAdmin(false);
              setView("home");
            }}
            showToast={showToast}
          />
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,
        background:"rgba(28,28,30,.97)",backdropFilter:"blur(20px)",
        borderTop:"1px solid rgba(255,140,0,.2)",padding:"7px 0 11px",
        boxShadow:"0 -4px 20px rgba(28,28,30,.2)"}}>
        <div style={{display:"flex",justifyContent:"center",gap:4,maxWidth:820,margin:"0 auto"}}>
          {NAV.map(n=>(
            <button key={n.k} className={`nav-btn ${view===n.k?"act":""}`}
              onClick={()=>{
                if(!nickname && ["compare","scan","mybowling"].includes(n.k)){
                  setShowLoginModal(true); return;
                }
                setView(n.k);setSel(null);
              }}>
              <span style={{fontSize:22,lineHeight:1,fontWeight:400,
                color:"#fff",
                opacity:view===n.k?1:0.45,transition:"all .2s",
                filter:view===n.k?"drop-shadow(0 0 5px rgba(255,140,0,0.7))":"none"}}>{n.i}</span>
              {view===n.k&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
                width:20,height:2,borderRadius:1,background:"#ff8c00",
                boxShadow:"0 0 6px rgba(255,140,0,0.6)"}}/>}
              <span className="nav-lbl" style={{fontSize:9,fontWeight:700,letterSpacing:0.3,
                color:view===n.k?"#ff8c00":"rgba(255,255,255,.55)"}}>{n.l}</span>
              {n.badge>0&&<span style={{position:"absolute",top:2,right:10,width:14,height:14,
                borderRadius:"50%",background:"#ff8c00",color:"#1c1c1e",fontSize:13,fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center"}}>{n.badge}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}// ══ 회원 관리 섹션 ══════════════════════════════════
function MemberManageSection({ showToast, onPendingChange }) {
  const [tab, setTab] = useState("pending"); // pending | members
  const [pending, setPending] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([
        sbGet("join_requests","order=created_at.desc"),
        sbGet("users","order=created_at.desc"),
      ]);
      setPending((p||[]).filter(r=>r.status==="pending"));
      setMembers(m||[]);
    } catch(e){ showToast("로드 오류","#ef5350"); }
    setLoading(false);
  };

  useEffect(()=>{ load(); },[]);

  // 가입 승인
  const approve = async (req) => {
    try {
      // users 테이블에 추가
      await sbInsert("users",{
        nickname: req.nickname,
        password: req.password,
        is_admin: false,
      });
      // 신청 상태 승인으로 변경
      await sbFetch(`/join_requests?id=eq.${req.id}`,{
        method:"PATCH",
        body:JSON.stringify({status:"approved"}),
        prefer:"return=representation"
      });
      const newPending = pending.filter(r=>r.id!==req.id);
      setPending(newPending);
      setMembers(prev=>[...prev,{nickname:req.nickname,is_admin:false}]);
      onPendingChange?.(newPending.length);
      showToast(`${req.nickname} 가입 승인 완료! ✅`);
    } catch(e){ showToast("이미 존재하는 닉네임이에요","#fb8c00"); }
  };

  // 가입 거절
  const reject = async (req) => {
    if(!window.confirm(`"${req.nickname}" 신청을 거절할까요?`)) return;
    await sbFetch(`/join_requests?id=eq.${req.id}`,{
      method:"PATCH",
      body:JSON.stringify({status:"rejected"}),
      prefer:"return=representation"
    });
    const newPending = pending.filter(r=>r.id!==req.id);
    setPending(newPending);
    onPendingChange?.(newPending.length);
    showToast("거절 완료");
  };

  // 회원 삭제
  const deleteMember = async (m) => {
    if(m.is_admin){ showToast("관리자는 삭제할 수 없어요","#fb8c00"); return; }
    if(!window.confirm(`"${m.nickname}" 회원을 삭제할까요?`)) return;
    await sbFetch(`/users?nickname=eq.${encodeURIComponent(m.nickname)}`,{method:"DELETE"});
    setMembers(prev=>prev.filter(u=>u.nickname!==m.nickname));
    showToast(`${m.nickname} 삭제 완료`);
  };

  // 관리자 권한 토글
  const toggleAdmin = async (m) => {
    if(!window.confirm(`"${m.nickname}" ${m.is_admin?"관리자 해제":"관리자 지정"}할까요?`)) return;
    await sbFetch(`/users?nickname=eq.${encodeURIComponent(m.nickname)}`,{
      method:"PATCH",
      body:JSON.stringify({is_admin:!m.is_admin}),
      prefer:"return=representation"
    });
    setMembers(prev=>prev.map(u=>u.nickname===m.nickname?{...u,is_admin:!u.is_admin}:u));
    showToast(m.is_admin?"관리자 해제":"관리자 지정 완료");
  };

  const btnStyle = (active) => ({
    flex:1,padding:"8px",borderRadius:10,border:"none",cursor:"pointer",
    fontFamily:"inherit",fontSize:12,fontWeight:700,
    background:active?"#ff8c00":"#f0f0f0",
    color:active?"#fff":"#666",
  });

  const cardStyle = {
    background:"#f7f7f7",borderRadius:12,
    padding:"10px 12px",marginBottom:6,
    border:"1px solid #e8e8e8",
  };

  return (
    <div style={{marginTop:12}}>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:800,color:"#1c1c1e",display:"none"}}>👥 회원 관리</div>
      </div>

      {/* 탭 */}
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        <button onClick={()=>setTab("pending")} style={btnStyle(tab==="pending")}>
          가입 신청 {pending.length>0&&`(${pending.length})`}
        </button>
        <button onClick={()=>setTab("members")} style={btnStyle(tab==="members")}>
          전체 회원 ({members.length})
        </button>
      </div>

      {loading?(
        <div style={{textAlign:"center",padding:"20px",color:"#aaa"}}>
          로딩 중...
        </div>
      ):tab==="pending"?(
        // 가입 신청 목록
        <div>
          {pending.length===0?(
            <div style={{textAlign:"center",padding:"30px",
              color:"#aaa",fontSize:13}}>
              대기 중인 가입 신청이 없어요
            </div>
          ):pending.map(req=>(
            <div key={req.id} style={cardStyle}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{fontSize:14,fontWeight:700,color:"#1c1c1e",flex:1}}>
                  {req.nickname}
                </div>
                <div style={{fontSize:10,color:"#aaa"}}>
                  {req.created_at?.slice(0,10)}
                </div>
              </div>
              {req.message&&(
                <div style={{fontSize:12,color:"#666",
                  marginBottom:8,fontStyle:"italic"}}>
                  "{req.message}"
                </div>
              )}
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>approve(req)} style={{
                  flex:2,padding:"7px",background:"rgba(67,160,71,0.2)",
                  border:"1px solid rgba(67,160,71,0.4)",borderRadius:8,
                  color:"#66bb6a",fontFamily:"inherit",fontSize:12,
                  fontWeight:700,cursor:"pointer"}}>
                  ✅ 승인
                </button>
                <button onClick={()=>reject(req)} style={{
                  flex:1,padding:"7px",background:"rgba(239,83,80,0.1)",
                  border:"1px solid rgba(239,83,80,0.3)",borderRadius:8,
                  color:"#ef5350",fontFamily:"inherit",fontSize:12,
                  fontWeight:700,cursor:"pointer"}}>
                  거절
                </button>
              </div>
            </div>
          ))}
        </div>
      ):(
        // 전체 회원 목록
        <div>
          {members.map(m=>(
            <div key={m.nickname} style={cardStyle}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                  background:m.is_admin?"rgba(255,140,0,0.15)":"#e8e8e8",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>
                  {m.is_admin?"👑":"👤"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1c1c1e"}}>
                    {m.nickname}
                    {m.is_admin&&<span style={{fontSize:10,color:"#ff8c00",
                      marginLeft:6,fontWeight:800}}>ADMIN</span>}
                  </div>
                  <div style={{fontSize:10,color:"#aaa"}}>
                    {m.created_at?.slice(0,10)||""}
                  </div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button onClick={()=>toggleAdmin(m)} style={{
                    padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",
                    fontFamily:"inherit",fontSize:10,fontWeight:700,
                    background:"rgba(255,140,0,0.15)",color:"#ff8c00"}}>
                    {m.is_admin?"해제":"관리자"}
                  </button>
                  {!m.is_admin&&(
                    <button onClick={()=>deleteMember(m)} style={{
                      padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",
                      fontFamily:"inherit",fontSize:10,fontWeight:700,
                      background:"rgba(239,83,80,0.1)",color:"#ef5350"}}>
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


