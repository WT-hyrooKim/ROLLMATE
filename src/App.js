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
    description:"RB 85 Hybrid on Magna A.I. dual-hemisphere symmetric core — smooth, continuous motion on medium-heavy."
  },
  {
    id:143, brand:"900 Global", name:"Ember",
    cover:"Pearl", coreType:"Symmetric", coreName:"Magna A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-ember", coreSlug:"900-global-magna-ai-core",
    weightData:{16:{rg:2.480,diff:0.048},15:{rg:2.480,diff:0.048},14:{rg:2.510,diff:0.046},13:{rg:2.580,diff:0.040},12:{rg:2.640,diff:0.033}},
    releaseDate:"Aug 2025",
    description:"RB 82 Pearl on Magna A.I. — stronger backend Cove companion, angular pearl for medium conditions."
  },
  {
    id:144, brand:"900 Global", name:"Mach Cruise",
    cover:"Solid", coreType:"Symmetric", coreName:"Cruise",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-mach-cruise", coreSlug:"900-global-cruise-core",
    weightData:{16:{rg:2.560,diff:0.035},15:{rg:2.560,diff:0.035},14:{rg:2.580,diff:0.033},13:{rg:2.640,diff:0.028},12:{rg:2.700,diff:0.023}},
    releaseDate:"Jul 2025",
    description:"Reserve Blend 93 Solid on Cruise symmetric core — overseas Mach Cruise for controlled medium-heavy oil."
  },
  {
    id:145, brand:"900 Global", name:"Honey Badger Black Edition",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-honey-badger-black-edition", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Jul 2025",
    description:"Reserve Blend 70E Hybrid on Grapnel 2.0 asymmetric — Black Edition HB for medium oil skid/flip shape."
  },
  {
    id:146, brand:"900 Global", name:"Reality Incursion",
    cover:"Solid", coreType:"Asymmetric", coreName:"Disturbance A.I.",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-reality-incursion", coreSlug:"900-global-disturbance-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.470,diff:0.056,moi:0.018},14:{rg:2.500,diff:0.054,moi:0.016},13:{rg:2.560,diff:0.048,moi:0.013},12:{rg:2.620,diff:0.041,moi:0.011}},
    releaseDate:"Sep 2025",
    description:"Reserve Blend 901 Solid on Disturbance A.I. — Reality's next chapter; lower RG, higher diff via A.I. outer core."
  },
  {
    id:147, brand:"900 Global", name:"Remaster Honey Badger",
    cover:"Solid", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-remaster-honey-badger", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Jan 2026",
    description:"Reserve Blend 70D Solid on Grapnel 2.0 — Remaster Honey Badger solid for medium-heavy oil dominance."
  },
  {
    id:148, brand:"900 Global", name:"Origin EX",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Ellipse A.I.",
    finish:"Power Edge", condition:"Medium-Heavy Oil", accent:"#1565c0",
    ballSlug:"900-global-origin-ex", coreSlug:"900-global-ellipse-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.480,diff:0.054,moi:0.017},14:{rg:2.510,diff:0.052,moi:0.015},13:{rg:2.570,diff:0.046,moi:0.012},12:{rg:2.630,diff:0.039,moi:0.010}},
    releaseDate:"Oct 2025",
    description:"Quantum Pearl on Ellipse A.I. — Origin's pearl companion with angular backend and same dual-precession power."
  },
  {
    id:149, brand:"900 Global", name:"Rev Matrix",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Matrix",
    finish:"Power Edge", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-rev-matrix", coreSlug:"900-global-matrix-core",
    weightData:{16:{rg:2.490,diff:0.048,moi:0.014},15:{rg:2.490,diff:0.048,moi:0.014},14:{rg:2.520,diff:0.046,moi:0.012},13:{rg:2.580,diff:0.040,moi:0.009},12:{rg:2.640,diff:0.033,moi:0.007}},
    releaseDate:"Oct 2025",
    description:"S86R Pearl on Matrix flip-block asymmetric core — overseas, designed by PWBA pro Daria Payonk for medium oil."
  },
  {
    id:150, brand:"900 Global", name:"Duty Majesty",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Duty",
    finish:"1500 Polished", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-duty-majesty", coreSlug:"900-global-duty-core",
    weightData:{16:{rg:2.540,diff:0.038},15:{rg:2.540,diff:0.038},14:{rg:2.560,diff:0.036},13:{rg:2.620,diff:0.030},12:{rg:2.680,diff:0.024}},
    releaseDate:"Feb 2025",
    description:"Reserve Blend 902 Hybrid on Duty symmetric core — overseas controlled motion for medium lane conditions."
  },
  {
    id:151, brand:"900 Global", name:"Honey Badger Blameless",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Grapnel 2.0",
    finish:"3000 Abralon", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"900-global-honey-badger-blameless", coreSlug:"900-global-grapnel-20-core",
    weightData:{16:{rg:2.540,diff:0.048,moi:0.012},15:{rg:2.540,diff:0.048,moi:0.012},14:{rg:2.560,diff:0.046,moi:0.010},13:{rg:2.620,diff:0.040,moi:0.008},12:{rg:2.680,diff:0.033,moi:0.006}},
    releaseDate:"Feb 2025",
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
    description:"Propulsion HVH Hybrid on Predator V2 — first hybrid Jackal in 3+ years, slots between Jackal Ghost and Crimson Jackal."
  },
  {
    id:153, brand:"Motiv", name:"Subzero Forge",
    cover:"Solid", coreType:"Symmetric", coreName:"Detonator",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#6a1b9a",
    ballSlug:"motiv-subzero-forge", coreSlug:"motiv-detonator-core",
    weightData:{16:{rg:2.470,diff:0.052},15:{rg:2.470,diff:0.052},14:{rg:2.500,diff:0.050},13:{rg:2.560,diff:0.044},12:{rg:2.620,diff:0.037}},
    releaseDate:"Sep 2025",
    description:"Leverage MXC Solid + Duramax on Detonator symmetric — ice-cold heavy oil force, strong early read with continuous motion."
  },
  {
    id:154, brand:"Motiv", name:"Max Thrill Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Halogen V2",
    finish:"5500 LSP", condition:"Light-Medium Oil", accent:"#6a1b9a",
    ballSlug:"motiv-max-thrill-pearl", coreSlug:"motiv-halogen-v2-core",
    weightData:{16:{rg:2.600,diff:0.035},15:{rg:2.600,diff:0.035},14:{rg:2.620,diff:0.033},13:{rg:2.680,diff:0.028},12:{rg:2.740,diff:0.022}},
    releaseDate:"Sep 2025",
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
    description:"A1S Pearl on Inverted Fe2 — 40th anniversary HyRoad, clean through the fronts with predictable angular backend."
  },
  {
    id:157, brand:"Storm", name:"!Q Spear",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-spear", coreSlug:"storm-c3-centripetal-ai-core",
    weightData:{16:{rg:2.550,diff:0.045},15:{rg:2.550,diff:0.045},14:{rg:2.550,diff:0.043},13:{rg:2.620,diff:0.037},12:{rg:2.680,diff:0.030}},
    releaseDate:"Jan 2026",
    description:"R2S Solid on C3 Centripetal A.I. — ultimate control and workability at the breakpoint, A.I. enhanced energy transfer."
  },
  {
    id:158, brand:"Storm", name:"Motor 30",
    cover:"Pearl", coreType:"Symmetric", coreName:"Torsion A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-motor-30", coreSlug:"storm-torsion-ai-core",
    weightData:{16:{rg:2.490,diff:0.048},15:{rg:2.490,diff:0.048},14:{rg:2.520,diff:0.046},13:{rg:2.590,diff:0.040},12:{rg:2.650,diff:0.033}},
    releaseDate:"Feb 2026",
    description:"RX Pro Pearl on Torsion A.I. — Motor line's 30th anniversary limited edition with explosive rev-up motion."
  },
  {
    id:159, brand:"Storm", name:"IDentity B-C-P",
    cover:"Hybrid", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"3000 Abralon", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-identity-bcp", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Jan 2026",
    description:"Hybrid cover on Ignition A.I. — B-C-P (Blue/Crimson/Purple) colorway IDentity, versatile medium oil performer."
  },
  {
    id:160, brand:"Storm", name:"Grand Gate",
    cover:"Pearl", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"Power Edge", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-grand-gate", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Mar 2025",
    description:"A1S Pearl on Ignition A.I. — Gate series' premium pearl for clean skid with sharp angular backend reaction."
  },
  {
    id:161, brand:"Storm", name:"Star Gate",
    cover:"Solid", coreType:"Symmetric", coreName:"Ignition A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-star-gate", coreSlug:"storm-ignition-ai-core",
    weightData:{16:{rg:2.490,diff:0.050},15:{rg:2.490,diff:0.050},14:{rg:2.520,diff:0.048},13:{rg:2.590,diff:0.042},12:{rg:2.650,diff:0.035}},
    releaseDate:"Oct 2024",
    description:"Hybrid cover on Ignition A.I. — Star Gate's blueberry-scented aggressive solid Gate series entry."
  },
  {
    id:162, brand:"Storm", name:"Marvel Flame",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-marvel-flame", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{16:{rg:2.460,diff:0.056},15:{rg:2.460,diff:0.056},14:{rg:2.460,diff:0.056},13:{rg:2.590,diff:0.045},12:{rg:2.650,diff:0.035}},
    releaseDate:"Feb 2025",
    description:"EXO Solid on Centripetal HD A.I. — 3rd Marvel A.I. series, stable arc with high scoreability on medium-heavy."
  },
  {
    id:163, brand:"Storm", name:"Code Impact",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"RAD4",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-impact", coreSlug:"storm-rad4-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.020},15:{rg:2.470,diff:0.057,moi:0.020},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Sep 2025",
    description:"NeX Hybrid on RAD4 — the Code series' heaviest hitter, highest diff in the Premier line for maximum heavy oil."
  },
  {
    id:164, brand:"Storm", name:"Summit World",
    cover:"Solid", coreType:"Symmetric", coreName:"Centripetal HD A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-summit-world", coreSlug:"storm-centripetal-hd-ai-core",
    weightData:{16:{rg:2.460,diff:0.056},15:{rg:2.460,diff:0.056},14:{rg:2.460,diff:0.056},13:{rg:2.590,diff:0.045},12:{rg:2.650,diff:0.035}},
    releaseDate:"Jul 2025",
    description:"R2S Solid on Centripetal HD A.I. — overseas Summit World, strong continuous roll on medium-heavy oil."
  },
  {
    id:165, brand:"Storm", name:"Wild Absolute",
    cover:"Solid", coreType:"Asymmetric", coreName:"Sentinel",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-wild-absolute", coreSlug:"storm-sentinel-core",
    weightData:{16:{rg:2.470,diff:0.053,moi:0.018},15:{rg:2.470,diff:0.052,moi:0.018},14:{rg:2.510,diff:0.049,moi:0.016},13:{rg:2.580,diff:0.043,moi:0.013},12:{rg:2.640,diff:0.036,moi:0.011}},
    releaseDate:"Dec 2024",
    description:"NeX Solid on Sentinel — overseas Wild Absolute, stable power axis movement for continuous heavy oil dominance."
  },
  {
    id:166, brand:"Storm", name:"DNA Strand",
    cover:"Solid", coreType:"Asymmetric", coreName:"G2",
    finish:"4000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-dna-strand", coreSlug:"storm-g2-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Mar 2025",
    description:"NeX Solid on G2 asymmetric — stronger midlane read than DNA Coil II, 11% more entry angle vs NRG cover."
  },
  {
    id:167, brand:"Storm", name:"Bite Panic A.I.",
    cover:"Pearl", coreType:"Asymmetric", coreName:"G2 A.I.",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-bite-panic-ai", coreSlug:"storm-g2-ai-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Jan 2025",
    description:"EXO Pearl on G2 A.I. — overseas Bite Panic A.I., improved oil-resistance front and boosted backend power."
  },
  {
    id:168, brand:"Storm", name:"Bite Panic X",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"G2",
    finish:"3000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-bite-panic-x", coreSlug:"storm-g2-core",
    weightData:{16:{rg:2.470,diff:0.058,moi:0.019},15:{rg:2.470,diff:0.057,moi:0.019},14:{rg:2.510,diff:0.054,moi:0.017},13:{rg:2.580,diff:0.048,moi:0.014},12:{rg:2.640,diff:0.041,moi:0.012}},
    releaseDate:"Jun 2024",
    description:"EXO Hybrid on G2 — overseas Bite Panic X, fine flare pattern with astonishing pin action on heavy oil."
  },
  {
    id:169, brand:"Storm", name:"PhysiX Power Elite IV",
    cover:"Solid", coreType:"Asymmetric", coreName:"Atomic A.I.",
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-physix-power-elite-iv", coreSlug:"storm-atomic-ai-core",
    weightData:{16:{rg:2.470,diff:0.056,moi:0.018},15:{rg:2.470,diff:0.055,moi:0.018},14:{rg:2.520,diff:0.054,moi:0.016},13:{rg:2.580,diff:0.047,moi:0.013},12:{rg:2.640,diff:0.040,moi:0.011}},
    releaseDate:"Oct 2024",
    description:"R2S Solid on Atomic A.I. — PhysiX Power Elite IV, overseas limited release for maximum heavy oil performance."
  },
  {
    id:170, brand:"Storm", name:"Blue !Q",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal A.I.",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-blue-iq", coreSlug:"storm-c3-centripetal-ai-core",
    weightData:{16:{rg:2.550,diff:0.045},15:{rg:2.550,diff:0.045},14:{rg:2.550,diff:0.043},13:{rg:2.620,diff:0.037},12:{rg:2.680,diff:0.030}},
    releaseDate:"Jun 2025",
    description:"R2S Solid on C3 A.I. — Blue !Q celebrating the iconic IQ lineage with A.I. enhanced control motion."
  },
  {
    id:171, brand:"Storm", name:"!Q Super G",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-super-g", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.550,diff:0.040},15:{rg:2.550,diff:0.040},14:{rg:2.550,diff:0.038},13:{rg:2.620,diff:0.032},12:{rg:2.680,diff:0.026}},
    releaseDate:"Aug 2024",
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
    description:"QR-12 Solid on Twist symmetric — Danger Zone Purple Ice colorway, same spec as the black version."
  },
  {
    id:173, brand:"Brunswick", name:"Melee Jab Void Black",
    cover:"Solid", coreType:"Symmetric", coreName:"Melee",
    finish:"500/1000/1500 Siaair Micro Pad", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-melee-jab-void-black", coreSlug:"brunswick-melee-core",
    weightData:{16:{rg:2.560,diff:0.030},15:{rg:2.560,diff:0.032},14:{rg:2.580,diff:0.030},13:{rg:2.640,diff:0.025},12:{rg:2.700,diff:0.020}},
    releaseDate:"Nov 2025",
    description:"Reactive Solid on Melee symmetric — Void Black colorway Melee Jab, entry-level medium oil performance."
  },
  {
    id:174, brand:"Brunswick", name:"Vapor Zone Red",
    cover:"Pearl", coreType:"Symmetric", coreName:"Vapor",
    finish:"Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-vapor-zone-red", coreSlug:"brunswick-vapor-core",
    weightData:{16:{rg:2.560,diff:0.032},15:{rg:2.560,diff:0.034},14:{rg:2.580,diff:0.032},13:{rg:2.640,diff:0.027},12:{rg:2.700,diff:0.022}},
    releaseDate:"Dec 2025",
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
    description:"HK22C Cohesion Solid on Huntsman asymmetric — follow-up to the Effect, slightly earlier read for medium-heavy oil with the same signature Huntsman power."
  },
  {
    id:176, brand:"Hammer", name:"Black Widow Mania",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Gas Mask",
    finish:"500/1000/1500 Siaair, Crown Factory Compound", condition:"Medium Oil", accent:"#d84315",
    ballSlug:"hammer-black-widow-mania", coreSlug:"hammer-gas-mask-core",
    weightData:{16:{rg:2.510,diff:0.048,moi:0.015},15:{rg:2.500,diff:0.058,moi:0.016},14:{rg:2.500,diff:0.056,moi:0.016},13:{rg:2.589,diff:0.043,moi:0.011},12:{rg:2.612,diff:0.043,moi:0.011}},
    releaseDate:"Jan 2025",
    description:"HK22C Cohesion Pearl on Gas Mask — longer and sharper than BW 2.0 Hybrid, perfect medium oil follow-up in the legendary Black Widow lineage."
  },
  {
    id:177, brand:"Motiv", name:"Primal Ghost",
    cover:"Solid", coreType:"Symmetric", coreName:"Impulse V2",
    finish:"3000 LSS", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"motiv-primal-ghost", coreSlug:"motiv-impulse-v2-core",
    weightData:{16:{rg:2.540,diff:0.049},15:{rg:2.550,diff:0.050},14:{rg:2.560,diff:0.054},13:{rg:2.600,diff:0.055},12:{rg:2.670,diff:0.040}},
    releaseDate:"Sep 2025",
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
    description:"Leverage MXC Solid on Overload asymmetric — tunable differential, smooth heavy oil benchmark control."
  },
  {
    id:179, brand:"Motiv", name:"Evoke Hysteria",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Overload",
    finish:"4000 LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-evoke-hysteria", coreSlug:"motiv-overload-core",
    weightData:{16:{rg:2.480,diff:0.050,moi:0.017},15:{rg:2.480,diff:0.050,moi:0.017},14:{rg:2.510,diff:0.047,moi:0.015},13:{rg:2.580,diff:0.042,moi:0.012},12:{rg:2.640,diff:0.035,moi:0.010}},
    releaseDate:"Mar 2025",
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
    description:"HK22C Micro Flex Hybrid on Ricochet core — skid/flip hybrid companion to the original pearl, versatile medium oil option."
  },
  {
    id:181, brand:"Columbia 300", name:"Pulse",
    cover:"Solid", coreType:"Symmetric", coreName:"Pulse PowerCOR",
    finish:"500/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#c62828",
    ballSlug:"columbia-300-pulse", coreSlug:"columbia-300-pulse-powercor-core",
    weightData:{16:{rg:2.481,diff:0.039},15:{rg:2.468,diff:0.045},14:{rg:2.481,diff:0.039},13:{rg:2.550,diff:0.034},12:{rg:2.610,diff:0.028}},
    releaseDate:"Aug 2025",
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
    description:"MXC Solid on Attention asymmetric — heavy oil workhorse with strong midlane read and predictable continuation."
  },
  {
    id:184, brand:"Roto Grip", name:"Hyped Super Pearl II",
    cover:"Pearl", coreType:"Symmetric", coreName:"Hyped",
    finish:"Power Edge", condition:"Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hyped-super-pearl-ii", coreSlug:"roto-grip-hyped-core",
    weightData:{16:{rg:2.560,diff:0.036},15:{rg:2.560,diff:0.036},14:{rg:2.580,diff:0.034},13:{rg:2.640,diff:0.029},12:{rg:2.700,diff:0.024}},
    releaseDate:"Nov 2025",
    description:"HK22 Pearl on Hyped symmetric — clean through the fronts with angular backend flip, ideal for medium and sport patterns."
  },
  {
    id:185, brand:"Roto Grip", name:"Gremlin",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Gremlin",
    finish:"Power Edge", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-gremlin", coreSlug:"roto-grip-gremlin-core",
    weightData:{16:{rg:2.500,diff:0.058,moi:0.019},15:{rg:2.500,diff:0.058,moi:0.019},14:{rg:2.530,diff:0.055,moi:0.017},13:{rg:2.600,diff:0.049,moi:0.014},12:{rg:2.660,diff:0.042,moi:0.012}},
    releaseDate:"Jul 2025",
    description:"EXO Pearl on Gremlin asymmetric — high differential mischief maker with explosive backend motion on heavier conditions."
  },
  {
    id:186, brand:"Roto Grip", name:"Exit Red",
    cover:"Solid", coreType:"Symmetric", coreName:"Exit",
    finish:"500/1500 Siaair", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-exit-red", coreSlug:"roto-grip-exit-core",
    weightData:{16:{rg:2.510,diff:0.040},15:{rg:2.510,diff:0.040},14:{rg:2.540,diff:0.038},13:{rg:2.610,diff:0.033},12:{rg:2.670,diff:0.027}},
    releaseDate:"Apr 2025",
    description:"R2S Solid on Exit symmetric — red colorway Exit, strong continuous arc for medium-heavy conditions."
  },
  {
    id:187, brand:"Roto Grip", name:"Hustle Teal/Black",
    cover:"Solid", coreType:"Symmetric", coreName:"Hustle",
    finish:"Crown Factory Compound", condition:"Light-Medium Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-hustle-tealblack", coreSlug:"roto-grip-hustle-core",
    weightData:{16:{rg:2.580,diff:0.028},15:{rg:2.580,diff:0.028},14:{rg:2.600,diff:0.026},13:{rg:2.660,diff:0.022},12:{rg:2.720,diff:0.018}},
    releaseDate:"Feb 2025",
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
    description:"R2S Solid on Velocity — 역대 가장 많이 팔린 스톰 볼 중 하나. 강한 미드레인 반응과 연속적인 백엔드, 전 세계 볼링선수들의 베이스볼."
  },
  {
    id:189, brand:"Storm", name:"Phaze III",
    cover:"Pearl", coreType:"Symmetric", coreName:"Velocity",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-phaze-iii", coreSlug:"storm-velocity-core",
    weightData:{16:{rg:2.480,diff:0.052},15:{rg:2.480,diff:0.052},14:{rg:2.510,diff:0.050},13:{rg:2.580,diff:0.044},12:{rg:2.640,diff:0.037}},
    releaseDate:"Jun 2020",
    description:"R2S Pearl on Velocity — Phaze II의 펄 버전. 깔끔한 프론트와 날카로운 백엔드 앵글로 미디엄 오일에서 폭발적인 인기."
  },
  {
    id:190, brand:"Storm", name:"IQ Tour",
    cover:"Solid", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon", condition:"Medium-Heavy Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.570,diff:0.034},15:{rg:2.570,diff:0.034},14:{rg:2.590,diff:0.032},13:{rg:2.650,diff:0.027},12:{rg:2.710,diff:0.022}},
    releaseDate:"Jan 2015",
    description:"R2S Solid on C3 Centripetal — 가장 오래 판매된 컨트롤 볼. 투어 선수들의 필수 아이템으로 10년 이상 베스트셀러 유지."
  },
  {
    id:191, brand:"Storm", name:"IQ Tour Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"C3 Centripetal",
    finish:"4000 Abralon Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-iq-tour-pearl", coreSlug:"storm-c3-centripetal-core",
    weightData:{16:{rg:2.570,diff:0.034},15:{rg:2.570,diff:0.034},14:{rg:2.590,diff:0.032},13:{rg:2.650,diff:0.027},12:{rg:2.710,diff:0.022}},
    releaseDate:"Mar 2016",
    description:"R2S Pearl on C3 Centripetal — IQ Tour의 펄 버전. 긴 활주와 예측 가능한 각도로 아마추어~프로까지 폭넓은 사랑."
  },
  {
    id:192, brand:"Storm", name:"Hy-Road",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Compound", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.590,diff:0.044},13:{rg:2.650,diff:0.038},12:{rg:2.710,diff:0.031}},
    releaseDate:"Jan 2010",
    description:"A1S Pearl on Inverted Fe2 — 스톰 역사상 가장 상징적인 볼. 15년 이상 꾸준히 팔리는 레전드. 볼 입문자의 첫 고성능볼로 전 세계 1위."
  },
  {
    id:193, brand:"Storm", name:"Hy-Road Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Inverted Fe2",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-hy-road-pearl", coreSlug:"storm-inverted-fe2-core",
    weightData:{16:{rg:2.570,diff:0.046},15:{rg:2.570,diff:0.046},14:{rg:2.590,diff:0.044},13:{rg:2.650,diff:0.038},12:{rg:2.710,diff:0.031}},
    releaseDate:"Jun 2014",
    description:"Pearl cover on Inverted Fe2 — HyRoad 패밀리의 펄 버전. 더 긴 활주와 선명한 앵글. 역대 스톰 판매 Top 5 안에 드는 볼."
  },
  {
    id:194, brand:"Storm", name:"Code Red",
    cover:"Solid", coreType:"Asymmetric", coreName:"RAD-X",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#00897b",
    ballSlug:"storm-code-red", coreSlug:"storm-rad-x-core",
    weightData:{16:{rg:2.480,diff:0.053,moi:0.017},15:{rg:2.480,diff:0.052,moi:0.017},14:{rg:2.510,diff:0.049,moi:0.015},13:{rg:2.580,diff:0.044,moi:0.012},12:{rg:2.640,diff:0.037,moi:0.010}},
    releaseDate:"Sep 2021",
    description:"NeX Solid on RAD-X — Code 시리즈의 역대 최고 판매작. 어시머트릭 고성능 헤비오일 볼로 투어 선수들 압도적 선택."
  },
  {
    id:195, brand:"Storm", name:"Marvel Pearl",
    cover:"Pearl", coreType:"Symmetric", coreName:"Centripetal HD",
    finish:"Power Edge Polish", condition:"Medium Oil", accent:"#00897b",
    ballSlug:"storm-marvel-pearl", coreSlug:"storm-centripetal-hd-core",
    weightData:{16:{rg:2.460,diff:0.054},15:{rg:2.460,diff:0.054},14:{rg:2.490,diff:0.052},13:{rg:2.560,diff:0.046},12:{rg:2.620,diff:0.039}},
    releaseDate:"Nov 2019",
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
    description:"HK22 Hybrid on Gas Mask — 블랙위도우 시리즈의 역대 판매 1위. 헤비~미디엄헤비 전천후 활약, 전 세계 볼링인의 사랑을 받은 레전드."
  },
  {
    id:197, brand:"Hammer", name:"Purple Pearl Urethane",
    cover:"Urethane", coreType:"Symmetric", coreName:"Offset",
    finish:"Rough Buff", condition:"Light-Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-purple-pearl-urethane", coreSlug:"hammer-offset-core",
    weightData:{16:{rg:2.600,diff:0.020},15:{rg:2.600,diff:0.020},14:{rg:2.620,diff:0.018},13:{rg:2.680,diff:0.015},12:{rg:2.740,diff:0.012}},
    releaseDate:"Jan 2017",
    description:"Urethane cover on Offset — 역대 가장 많이 팔린 우레탄 볼. 드라이~쇼트 패턴의 절대 강자, PBA 투어에서도 꾸준히 사용되는 영원한 베스트셀러."
  },
  {
    id:198, brand:"Hammer", name:"Vibe",
    cover:"Solid", coreType:"Symmetric", coreName:"Vibe",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-vibe", coreSlug:"hammer-vibe-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Mar 2019",
    description:"Reactive Solid on Vibe symmetric — 엔트리~미드 퍼포먼스 역대 판매 1위. 가성비 최강으로 입문자들이 가장 많이 선택하는 볼."
  },
  {
    id:199, brand:"Hammer", name:"Bubblegum Vibe",
    cover:"Solid", coreType:"Symmetric", coreName:"Vibe",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#1565c0",
    ballSlug:"hammer-bubblegum-vibe", coreSlug:"hammer-vibe-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Sep 2021",
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
    description:"Turmoil MFS Pearl on Sigma V2 — 모티브 역대 최고 판매 볼 중 하나. 강한 미드레인과 연속적인 백엔드로 리그~투어까지 압도적 사랑."
  },
  {
    id:201, brand:"Motiv", name:"Venom EXJ",
    cover:"Solid", coreType:"Symmetric", coreName:"Gear",
    finish:"2000 Siaair", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-venom-exj", coreSlug:"motiv-gear-core",
    weightData:{16:{rg:2.480,diff:0.038},15:{rg:2.480,diff:0.038},14:{rg:2.510,diff:0.036},13:{rg:2.580,diff:0.031},12:{rg:2.640,diff:0.025}},
    releaseDate:"Jun 2024",
    description:"Coercion HFS Solid on Gear — EJ Tackett 시그니처. 낮은 RG 벤치마크 볼로 2024 베스트셀러. 안정적이고 예측 가능한 미드레인 반응."
  },
  {
    id:202, brand:"Motiv", name:"Forge Fire",
    cover:"Solid", coreType:"Symmetric", coreName:"Impulse V2",
    finish:"3000 Grit LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-forge-fire", coreSlug:"motiv-impulse-v2-core",
    weightData:{16:{rg:2.530,diff:0.051},15:{rg:2.540,diff:0.050},14:{rg:2.550,diff:0.049},13:{rg:2.600,diff:0.041},12:{rg:2.650,diff:0.035}},
    releaseDate:"Sep 2022",
    description:"Coercion MXC Solid on Impulse V2 — 역대 모티브 스트레이트 셀러. 강한 미드레인 반응과 내구성으로 리그볼러들의 절대적 신뢰."
  },
  {
    id:203, brand:"Motiv", name:"Trident Odyssey",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Trident",
    finish:"4000 LSS", condition:"Medium-Heavy Oil", accent:"#7b1fa2",
    ballSlug:"motiv-trident-odyssey", coreSlug:"motiv-trident-core",
    weightData:{16:{rg:2.480,diff:0.053,moi:0.018},15:{rg:2.490,diff:0.052,moi:0.018},14:{rg:2.510,diff:0.049,moi:0.016},13:{rg:2.580,diff:0.044,moi:0.013},12:{rg:2.640,diff:0.037,moi:0.011}},
    releaseDate:"Jan 2022",
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
    description:"ECA-XR Solid on ECA-XR — 브런즈윅 헤비오일 역대 판매 1위. 강한 훅과 놀라운 핀 액션으로 2022~2023 투어 지배."
  },
  {
    id:205, brand:"Brunswick", name:"Rhino",
    cover:"Solid", coreType:"Symmetric", coreName:"Rhino",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#e65100",
    ballSlug:"brunswick-rhino", coreSlug:"brunswick-rhino-core",
    weightData:{16:{rg:2.540,diff:0.030},15:{rg:2.540,diff:0.030},14:{rg:2.560,diff:0.028},13:{rg:2.620,diff:0.024},12:{rg:2.680,diff:0.019}},
    releaseDate:"Jan 2016",
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
    description:"EXO Pearl on Nucleus — 로토그립 역대 미드퍼포먼스 최고 판매작. 깔끔한 활주와 예측 가능한 백엔드로 2022~2023 리그 1위."
  },
  {
    id:207, brand:"Roto Grip", name:"UFO Alert",
    cover:"Pearl", coreType:"Asymmetric", coreName:"Nucleus V2",
    finish:"Power Edge Polish", condition:"Medium-Heavy Oil", accent:"#b71c1c",
    ballSlug:"roto-grip-ufo-alert", coreSlug:"roto-grip-nucleus-v2-core",
    weightData:{16:{rg:2.490,diff:0.052,moi:0.018},15:{rg:2.490,diff:0.052,moi:0.018},14:{rg:2.520,diff:0.049,moi:0.016},13:{rg:2.590,diff:0.044,moi:0.013},12:{rg:2.650,diff:0.037,moi:0.011}},
    releaseDate:"Aug 2021",
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
    description:"HK22 Solid on Pitbull asymmetric — DV8 역대 판매 1위. 강력한 훅과 폭발적인 핀 액션으로 헤비오일 조건에서 절대 강자."
  },
  {
    id:209, brand:"DV8", name:"Thug",
    cover:"Hybrid", coreType:"Asymmetric", coreName:"Thug",
    finish:"500/1000/1500 Siaair", condition:"Heavy Oil", accent:"#bf360c",
    ballSlug:"dv8-thug", coreSlug:"dv8-thug-core",
    weightData:{16:{rg:2.480,diff:0.055,moi:0.019},15:{rg:2.481,diff:0.054,moi:0.019},14:{rg:2.510,diff:0.051,moi:0.017},13:{rg:2.580,diff:0.046,moi:0.014},12:{rg:2.640,diff:0.039,moi:0.012}},
    releaseDate:"Jan 2019",
    description:"Composite Hybrid on Thug asymmetric — DV8의 레전드 볼. 미드레인 강한 반응과 연속적인 백엔드 파워로 2019~2021 투어 인기."
  },
];

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
  "Storm":      {abbr:"STM", color:"#e53935", bg:"#fff0f0", textColor:"#e53935"},
  "Roto Grip":  {abbr:"RG",  color:"#1e88e5", bg:"#e3f2fd", textColor:"#1e88e5"},
  "Motiv":      {abbr:"MTV", color:"#6d1f7e", bg:"#f3e5f5", textColor:"#6d1f7e"},
  "Hammer":     {abbr:"HMR", color:"#d32f2f", bg:"#ffebee", textColor:"#c62828"},
  "Brunswick":  {abbr:"BRN", color:"#e65100", bg:"#fff3e0", textColor:"#e65100"},
  "900 Global": {abbr:"900", color:"#1565c0", bg:"#e8eaf6", textColor:"#1565c0"},
  "DV8":        {abbr:"DV8", color:"#212121", bg:"#f5f5f5", textColor:"#212121"},
  "Ebonite":    {abbr:"EBN", color:"#4a148c", bg:"#ede7f6", textColor:"#4a148c"},
  "Columbia 300":{abbr:"C3", color:"#0277bd", bg:"#e1f5fe", textColor:"#0277bd"},
  "SWAG":       {abbr:"SWG", color:"#558b2f", bg:"#f1f8e9", textColor:"#558b2f"},
  "Radical":    {abbr:"RAD", color:"#ef6c00", bg:"#fff8e1", textColor:"#e65100"},
  "Track":      {abbr:"TRK", color:"#00695c", bg:"#e0f2f1", textColor:"#00695c"},
};

function BrandLogo({ brand, size=28, active=false }) {
  const logo = BRAND_LOGO[brand];
  if (!logo) return <span style={{fontSize:14}}>{BRAND_ICON[brand]||"🎳"}</span>;
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
  // Hammer — 판매 1위 브랜드
  "Black Widow Mania":99,      // 2025 연간 #1 판매
  "Black Widow 3.0":97,        // 2024 연간 #1 판매
  "Black Widow 3.0 Dynasty":95,// 2026 출시 즉시 top5
  "Black Widow Tour V1":90,    // 2025 투어 인기
  "Maximum Effect":85,
  "Effect Tour":83,
  "Special Effect":78,
  "Hammerhead":75,
  "Hammerhead Pearl":73,
  "Zero Mercy Solid":70,
  "Zero Mercy Pearl":68,
  "Anger":65,
  "NU 2.0":60,
  "NU Blue Hammer":55,
  "Black Widow 2.0 Hybrid":50,
  // Storm
  "Phaze II Pearl":96,         // 2024 연간 top3
  "Ion Max Pearl":94,          // 2025 출시 즉시 #1
  "Ion Max":90,
  "Equinox Solid":89,
  "EquinoX":87,
  "Bionic":88,
  "Code Honor":85,
  "PhysiX Grandeur":84,
  "Absolute Reign":82,
  "Marvel Scale":80,
  "Concept":79,
  "Lock-On":77,
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
  // Motiv
  "Jackal Onyx":92,            // 2025 #3 전체 판매
  "Evoke Hysteria":88,         // 2025 투어 인기 급상승
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
  // 역대 클래식 베스트셀러
  "Hy-Road":98,
  "Hy-Road Pearl":93,
  "Phaze II":96,
  "Phaze III":88,
  "IQ Tour":91,
  "IQ Tour Pearl":87,
  "Code Red":86,
  "Marvel Pearl":95,
  "Black Widow 2.0":94,
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
      const existing=await sbGet("users",`nickname=eq.${encodeURIComponent(name.trim())}&select=id`);
      if(existing.length){setErr("이미 사용 중인 닉네임이에요");setLoading(false);return;}
      await sbInsert("users",{nickname:name.trim(),password:pw,is_admin:false});
      localStorage.setItem("rm_nickname",name.trim());
      localStorage.setItem("rm_pw",pw);
      localStorage.setItem("rm_admin","0");
      onLogin(name.trim(),[],false,[]);
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
        {[{k:"users",l:"👥 회원 관리"},{k:"notices",l:"📢 공지사항"}].map(t=>(
          <button key={t.k} onClick={()=>{setTab(t.k);setSelUser(null);}} style={{
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

function VideoBoard() {
  const openVideo = (id) => {
    window.open(`https://www.youtube.com/watch?v=${id}`, "_blank");
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {BOWLING_VIDEOS.map(v=>(
        <div key={v.id} onClick={()=>openVideo(v.id)}
          style={{display:"flex",gap:10,alignItems:"center",cursor:"pointer",
            background:"#fff",borderRadius:12,overflow:"hidden",
            border:"1px solid #e8e8e8",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            transition:"box-shadow .15s"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.12)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"}>
          {/* 썸네일 */}
          <div style={{position:"relative",width:96,height:60,flexShrink:0,background:"#000"}}>
            <img
              src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
              alt={v.title}
              style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.9}}
              onError={e=>{e.target.style.display="none";}}
            />
            {/* 재생 버튼 오버레이 */}
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
              justifyContent:"center"}}>
              <div style={{width:28,height:28,borderRadius:"50%",
                background:"rgba(255,0,0,0.85)",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>
                <div style={{width:0,height:0,borderTop:"6px solid transparent",
                  borderBottom:"6px solid transparent",
                  borderLeft:"10px solid #fff",marginLeft:2}}/>
              </div>
            </div>
          </div>
          {/* 정보 */}
          <div style={{flex:1,minWidth:0,padding:"8px 10px 8px 0"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#111",lineHeight:1.35,
              marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",
              display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{v.title}</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:10,color:"#999"}}>{v.channel}</span>
              <span style={{fontSize:9,color:"#ff8c00",fontWeight:700,
                background:"rgba(255,140,0,0.1)",padding:"1px 5px",borderRadius:4}}>YouTube ↗</span>
            </div>
          </div>
        </div>
      ))}
      <div style={{fontSize:11,color:"#aaa",textAlign:"center",marginTop:4}}>
        탭하면 유튜브에서 재생돼요
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
        <div style={{background:"rgba(255,255,255,0.06)",borderRadius:16,padding:"14px",marginBottom:14,
          border:"1px solid rgba(255,140,0,0.2)"}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="제목"
            style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:10,color:"#fff",padding:"9px 12px",fontSize:13,outline:"none",
              fontFamily:"inherit",marginBottom:8,boxSizing:"border-box"}}/>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="내용을 입력하세요..."
            rows={3} style={{width:"100%",background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,color:"#fff",
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
              border:"1px solid rgba(255,255,255,0.2)",background:"transparent",color:"rgba(255,255,255,0.6)",
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
        <div style={{textAlign:"center",padding:"30px",color:"rgba(255,255,255,0.3)",fontSize:13}}>불러오는 중...</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {posts.length===0?(
            <div style={{textAlign:"center",padding:"40px",color:"rgba(255,255,255,0.2)"}}>
              <div style={{fontSize:32,marginBottom:8}}>💬</div>
              <div style={{fontSize:13}}>첫 글을 남겨보세요!</div>
            </div>
          ):posts.map(p=>(
            <div key={p.id} onClick={()=>setSelPost(p)}
              style={{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"12px 14px",
                cursor:"pointer",border:"1px solid rgba(255,255,255,0.07)"}}>
              {p.image_url&&(
                <img src={p.image_url} style={{width:"100%",borderRadius:10,maxHeight:140,
                  objectFit:"cover",marginBottom:8}}/>
              )}
              <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>{p.title}</div>
              {p.content&&<div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:6,
                lineHeight:1.5,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",
                WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{p.content}</div>}
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{p.nickname}</span>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>·</span>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>
                  {new Date(p.created_at).toLocaleDateString("ko-KR",{month:"short",day:"numeric"})}
                </span>
                <button onClick={e=>{e.stopPropagation();likePost(p);}} style={{
                  marginLeft:"auto",background:"none",border:"none",cursor:"pointer",
                  fontSize:12,color:p.likes>0?"#ff8c00":"rgba(255,255,255,0.3)",fontFamily:"inherit"}}>
                  ❤️ {p.likes||0}
                </button>
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
      <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",
        cursor:"pointer",fontFamily:"inherit",fontSize:13,marginBottom:14,padding:0,display:"flex",
        alignItems:"center",gap:4}}>← 목록으로</button>
      <div style={{background:"rgba(255,255,255,0.05)",borderRadius:16,padding:"16px",marginBottom:14}}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:6}}>{post.title}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:12}}>
          {post.nickname} · {new Date(post.created_at).toLocaleDateString("ko-KR")}
        </div>
        {post.image_url&&<img src={post.image_url} style={{width:"100%",borderRadius:10,marginBottom:10}}/>}
        {post.content&&<div style={{fontSize:13,color:"rgba(255,255,255,0.75)",lineHeight:1.7}}>{post.content}</div>}
      </div>
      <div style={{fontWeight:700,fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:8}}>
        댓글 {comments.length}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input value={cmtText} onChange={e=>setCmtText(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&submitComment()}
          placeholder="댓글을 입력하세요..."
          style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:12,color:"#fff",padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={submitComment} style={{padding:"9px 14px",background:"#ff8c00",border:"none",
          borderRadius:12,color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:700,cursor:"pointer"}}>등록</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {comments.map(c=>(
          <div key={c.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontSize:11,color:"#ff8c00",fontWeight:700,marginBottom:3}}>{c.nickname}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>{c.content}</div>
          </div>
        ))}
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

          {/* 추가 버튼 */}
          <button onClick={()=>setShowScoreForm(f=>!f)} style={{
            width:"100%",padding:"11px",
            background:showScoreForm?"#f5f5f5":"#fff",
            border:"1.5px solid #ff8c00",borderRadius:14,
            color:"#ff8c00",fontFamily:"inherit",fontSize:13,fontWeight:700,
            cursor:"pointer",marginBottom:10,transition:"all .15s"}}>
            {showScoreForm?"✕ 닫기":"+ 점수 기록 추가"}
          </button>

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
                  boxShadow:"0 1px 6px rgba(0,0,0,0.06)",border:"1px solid #f0f0f0",
                  display:"flex",alignItems:"center",gap:12}}>
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
                      {s.memo&&<span style={{fontSize:11,color:"#aaa",overflow:"hidden",
                        textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.memo}</span>}
                    </div>
                  </div>
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
function MyPagePanel({ nickname, arsenal, onClose, onPasswordChange, onNicknameChange, onDeleteAll, onLogout, showToast }) {
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
function BallScanner({ balls }) {
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
      setImg(e.target.result);
      setImgB64(e.target.result.split(",")[1]);
      setMimeType(mime);
      setResults([]); setStep("idle"); setAnalysis(null); setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  // ── 유사도 매칭 (텍스트 + 색상 + 패턴) ────────────────
  const normalize = (s) => (s||"").toLowerCase()
    .replace(/[^a-z0-9가-힣\s]/g,"").replace(/\s+/g," ").trim();

  // 색상→볼이름 키워드 맵
  const COLOR_MAP = {
    purple:["purple","violet","amethyst"],
    black:["black","dark","shadow","night","midnight"],
    red:["red","crimson","scarlet","ruby","blood"],
    blue:["blue","sapphire","cobalt","navy","azure","sky"],
    green:["green","emerald","lime","jade","forest"],
    orange:["orange","amber","fire","flame","blaze"],
    gold:["gold","golden","maxx","silver"],
    pearl:["pearl","pearlescent"],
    white:["white","ivory","ghost","ice","frost"],
    gray:["gray","grey","silver","slate"],
    pink:["pink","rose","magenta"],
    teal:["teal","cyan","aqua","turquoise"],
  };

  // 패턴→볼이름 키워드 맵
  const PATTERN_MAP = {
    marble:["marble","stone","vein"],
    swirl:["swirl","twist","spiral","vortex"],
    solid:["solid","pure"],
    pearl:["pearl"],
    hybrid:["hybrid"],
    reactive:["reactive"],
  };

  const matchBalls = (res) => {
    const { brand, name, colors=[], pattern="" } = res;
    const nb = normalize(brand||"");
    const nn = normalize(name||"");

    const scored = balls.map(ball => {
      let score = 0;
      const ballBrand = normalize(ball.brand);
      const ballName  = normalize(ball.name);
      const ballCover = (ball.cover||"").toLowerCase();

      // ① 브랜드 매칭 (25%)
      if (nb) {
        if (ballBrand.includes(nb) || nb.includes(ballBrand)) score += 0.25;
        else if (ballBrand.split(" ").some(w=>nb.includes(w)&&w.length>2)) score += 0.12;
      }

      // ② 제품명 단어 매칭 (50%)
      if (nn) {
        const nameWords = ballName.split(" ").filter(w=>w.length>1);
        const queryWords = nn.split(" ").filter(w=>w.length>1);
        const hits = nameWords.filter(w=>
          queryWords.some(q=>q===w||q.includes(w)||w.includes(q))
        ).length;
        if (nameWords.length > 0) score += (hits / nameWords.length) * 0.50;
        // 완전 포함 보너스
        if (ballName.includes(nn)||nn.includes(ballName)) score += 0.10;
      }

      // ③ 색상 매칭 (15%)
      if (colors.length > 0) {
        let colorScore = 0;
        colors.forEach(c => {
          const cl = c.toLowerCase();
          const keywords = COLOR_MAP[cl] || [cl];
          if (keywords.some(k => ballName.includes(k) || ballCover.includes(k))) {
            colorScore += 0.05;
          }
        });
        score += Math.min(colorScore, 0.15);
      }

      // ④ 패턴 매칭 (10%)
      if (pattern) {
        const pl = pattern.toLowerCase();
        const keywords = PATTERN_MAP[pl] || [pl];
        if (keywords.some(k => ballName.includes(k) || ballCover.includes(k))) {
          score += 0.10;
        }
        // cover 타입과 패턴 비교
        if (pl==="solid" && ballCover.includes("solid")) score += 0.05;
        if (pl==="pearl" && ballCover.includes("pearl")) score += 0.05;
        if (pl==="hybrid" && ballCover.includes("hybrid")) score += 0.05;
      }

      return { ball, score };
    });

    return scored
      .sort((a,b) => b.score - a.score)
      .filter(x => x.score > 0.12)
      .slice(0, 3)
      .map(x => ({ ...x.ball, matchScore: Math.round(x.score * 100) }));
  };

  // ── 스캔 실행 ─────────────────────────────────────────
  const runScan = async () => {
    if (!imgB64) return;
    setLoading(true); setStep("analyzing"); setResults([]); setAnalysis(null); setErrorMsg("");

    try {
      // Vercel Serverless Function 호출
      const res = await fetch("/api/scan", {
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
                    <div key={ball.id} style={{
                      background:"#fff",borderRadius:16,overflow:"hidden",
                      boxShadow:"0 2px 12px rgba(0,0,0,0.07)",
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
  const [myBowlingTab,setMyBowlingTab]   = useState("arsenal"); // arsenal | scores // null | 'Heavy' | 'Medium' | 'Light'
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

  // 홈 복귀 시 이전 스크롤 위치 복원
  useEffect(()=>{
    if(view==="home"){
      const saved=scrollPos.current;
      requestAnimationFrame(()=>window.scrollTo({top:saved,behavior:"instant"}));
    }
  },[view]);

  const showToast = (msg,color="#43a047")=>{
    setToast({msg,color}); setTimeout(()=>setToast(null),2300);
  };

  const brandCounts = BRANDS.slice(1).map(b=>({
    brand:b,count:ALL_BALLS.filter(x=>x.brand===b).length,icon:BRAND_ICON[b]||"🎳"
  })).sort((a,b)=>b.count-a.count);

  const filtered = ALL_BALLS.filter(b=>{
    const mB=brand==="전체"||b.brand===brand;
    const mC=cond==="All"||b.condition===cond;
    const mS=b.name.toLowerCase().includes(search.toLowerCase())||b.brand.toLowerCase().includes(search.toLowerCase());
    return mB&&mC&&mS;
  }).sort((a,b)=>{
    if(sortBy==="popular") return (POPULARITY[b.name]||0)-(POPULARITY[a.name]||0);
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

  // 관리자면 관리자 화면
  if(nickname && isAdmin) return (
    <AdminView
      nickname={nickname}
      onLogout={()=>{
        localStorage.removeItem("rm_nickname");
        localStorage.removeItem("rm_pw");
        localStorage.removeItem("rm_admin");
        setNickname(""); setArsenal([]); setIsAdmin(false);
        setView("home");
      }}
      showToast={showToast}
    />
  );


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
            {notices.length>0&&(
              <div style={{marginBottom:16}}>
                {notices.map(n=>(
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
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* POPULAR */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1c1c1e",display:"flex",alignItems:"center",gap:6}}>
                  🔥 <span>인기 볼링공</span>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[...ALL_BALLS].sort((a,b)=>(POPULARITY[b.name]||0)-(POPULARITY[a.name]||0))
                  .slice(0,5).map((ball,i)=>{
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
                <div style={{fontSize:13,fontWeight:800,color:"#1c1c1e",display:"flex",alignItems:"center",gap:6}}>
                  💬 <span>자유게시판</span>
                </div>
                <button onClick={()=>setView("board")} style={{fontSize:11,color:"#ff8c00",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>
                  전체보기 →
                </button>
              </div>
              <BoardPreview nickname={nickname} onLoginRequest={()=>setShowLoginModal(true)}/>
            </div>

            {/* 볼링 영상 */}
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1c1c1e",display:"flex",alignItems:"center",gap:6}}>
                  🎬 <span>볼링 영상</span>
                </div>
              </div>
              <VideoBoard/>
            </div>
          </div>
        )}

        {/* DETAIL */}
        {view==="detail"&&sel&&(
          <Detail ball={sel} onBack={()=>{setView("home");setSel(null);}}
            inArsenal={inArsenal} onReg={(b)=>{setModal(b);setEditEnt(null);}}/>
        )}

                {/* BALLS - 볼링공 리스트 */}
        {view==="balls"&&!sel&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <div style={{marginBottom:10}}>
              <div style={{fontWeight:800,fontSize:18,color:"#1c1c1e",marginBottom:10}}>볼링공 ({ALL_BALLS.length})</div>
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
                return <button key={b} className="chip" onClick={()=>setBrand(b)} style={{
                  background:act?"#1c1c1e":"#fff",
                  color:act?"#fff":"#1a1a2e",flexShrink:0,
                  boxShadow:act?"0 4px 14px rgba(55,65,81,.28)":"0 1px 4px rgba(0,0,0,0.07)",
                  border:`1px solid ${act?"#1c1c1e":"#e8e8e8"}`}}>
                  <BrandLogo brand={b} size={22} active={act}/>
                  <span style={{fontSize:12,fontWeight:700,marginLeft:4}}>{b}</span>
                  <span style={{background:act?"rgba(255,255,255,.2)":"rgba(255,255,255,0.1)",
                    color:act?"#fff":"rgba(255,255,255,0.5)",
                    padding:"1px 5px",borderRadius:4,fontSize:12,fontWeight:800}}>{count}</span>
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
                   <div style={{fontSize:10,color:ball.accent,fontWeight:800,letterSpacing:1,
                     textAlign:"center",marginBottom:3}}>{ball.brand.toUpperCase()}</div>
                   <div style={{fontWeight:800,fontSize:12,color:"#111",textAlign:"center",
                     lineHeight:1.35,height:32,overflow:"hidden",textOverflow:"ellipsis",
                     display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",
                     flexShrink:0,marginBottom:6}}>{ball.name}</div>
                   <div style={{flex:1}}/>
                  {cmpList.find(b=>b.id===ball.id)?(
                    <button onClick={e=>{e.stopPropagation();toggleCmp(ball);}} style={{
                      width:"100%",padding:"6px 0",background:ball.accent,border:"none",
                      borderRadius:8,color:"#fff",fontFamily:"inherit",fontSize:11,fontWeight:800,
                      cursor:"pointer",boxShadow:`0 2px 8px ${ball.accent}55`}}>
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
            {cmpList.length>=2&&(
              <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",
                zIndex:3000,background:"rgba(28,28,30,0.97)",backdropFilter:"blur(12px)",
                borderRadius:50,padding:"8px 8px 8px 14px",display:"flex",alignItems:"center",gap:8,
                border:"1px solid rgba(255,140,0,0.3)",boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
                animation:"fadeUp .3s ease",whiteSpace:"nowrap"}}>
                <span style={{fontSize:13,color:"#fff",fontWeight:700}}>{cmpList.length}개 선택</span>
                <button onClick={()=>{setView("compare");setSel(null);}} style={{
                  padding:"7px 16px",background:"#ff8c00",border:"none",borderRadius:50,
                  color:"#fff",fontFamily:"inherit",fontSize:12,fontWeight:800,cursor:"pointer",
                  boxShadow:"0 3px 12px rgba(255,140,0,0.4)"}}>비교하기 ⚖️</button>
                <button onClick={()=>setCmpList([])} style={{
                  width:28,height:28,background:"rgba(255,255,255,0.1)",border:"none",
                  borderRadius:"50%",color:"rgba(255,255,255,0.5)",fontSize:14,cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            )}
          </div>
        )}

        {/* BOARD - 자유게시판 */}
        {view==="board"&&(
          <BoardView nickname={nickname} onLoginRequest={()=>setShowLoginModal(true)}/>
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
            <BallScanner balls={ALL_BALLS}/>
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
                if(!nickname && (n.k==="mybowling")){
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
}
