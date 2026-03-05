import { useState, useEffect } from "react";

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
    cover:"Pearl", coreType:"Symmetric", coreName:"Crown",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#c62828",
    ballSlug:"brunswick-crown-victory-pearl", coreSlug:"brunswick-crown-victory-core",
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
    cover:"Solid", coreType:"Symmetric", coreName:"Predator V2",
    finish:"4000 LSS", condition:"Light-Medium Oil", accent:"#ef6c00",
    ballSlug:"motiv-supra-sport", coreSlug:"motiv-predator-v2",
    weightData:{
      16:{rg:2.550,diff:0.043}, 15:{rg:2.560,diff:0.041},
      14:{rg:2.570,diff:0.038}, 13:{rg:2.650,diff:0.034}, 12:{rg:2.710,diff:0.028}
    },
    releaseDate:"Feb 2026",
    description:"Sport performance solid symmetric — the ultimate control ball for medium to light oil."
  },
  {
    id:8, brand:"Motiv", name:"Evoke Mayhem",
    cover:"Solid", coreType:"Asymmetric", coreName:"Turbulent V2",
    finish:"2000 LSS", condition:"Heavy Oil", accent:"#b71c1c",
    ballSlug:"motiv-evoke-mayhem", coreSlug:"motiv-turbulent-v2-core",
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
    finish:"500/1000/2000 Siaair", condition:"Heavy Oil", accent:"#1a237e",
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
    finish:"2000 Abralon", condition:"Heavy Oil", accent:"#1a237e",
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
    cover:"Solid", coreType:"Symmetric", coreName:"Misfit",
    finish:"Crown Factory Compound", condition:"Medium Oil", accent:"#4e342e",
    ballSlug:"dv8-dark-side-curse", coreSlug:"dv8-misfit-core",
    weightData:{
      16:{rg:2.480,diff:0.036}, 15:{rg:2.490,diff:0.034},
      14:{rg:2.500,diff:0.031}, 13:{rg:2.585,diff:0.027}, 12:{rg:2.645,diff:0.022}
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

// bowwwl.com 이미지 컴포넌트 — 실제 제품 이미지 로드
function BowwwlImg({ src, alt, size, radius="50%", style={} }) {
  const [ok, setOk] = useState(null);
  return (
    <div style={{width:size,height:size,borderRadius:radius,overflow:"hidden",flexShrink:0,
      background:"linear-gradient(135deg,#f0f0f8,#e8e8f4)",position:"relative",...style}}>
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
          background:"linear-gradient(135deg,#ebebf5,#f5f5fb)",
          animation:"shimmer 1.5s ease infinite"}}/>
      )}
      {ok===false&&(
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:size*0.38,background:"#f5f5fa",
          color:"#ccc"}}>🎳</div>
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
      <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
        {wts.map(w=>(
          <button key={w} onClick={()=>onSel(w)} style={{
            padding:"5px 12px",borderRadius:8,cursor:"pointer",fontWeight:800,fontSize:12,
            border:"none",fontFamily:"inherit",
            background:sel===w?ball.accent:"#f0f0f8",color:sel===w?"#fff":"#888",
            boxShadow:sel===w?`0 3px 10px ${ball.accent}44`:"none"}}>
            {w}lb
          </button>
        ))}
      </div>
      {d&&(
        <div style={{background:`linear-gradient(135deg,${ball.accent}09,${ball.accent}04)`,
          borderRadius:14,padding:"16px 18px",border:`1.5px solid ${ball.accent}22`,marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${hasMoi&&d.moi?"3":"2"},1fr)`,gap:12,marginBottom:14}}>
            {[
              {l:"RG",v:d.rg,desc:"Radius of Gyration"},
              {l:"DIFF",v:d.diff,desc:"Total Differential"},
              ...(d.moi?[{l:"MOI",v:d.moi,desc:"Mass Bias Diff"}]:[]),
            ].map(item=>(
              <div key={item.l} style={{textAlign:"center"}}>
                <div style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:1.5,marginBottom:4}}>{item.l}</div>
                <div style={{fontSize:28,fontWeight:800,color:ball.accent,lineHeight:1}}>{item.v}</div>
                <div style={{fontSize:8,color:"#ccc",marginTop:3}}>{item.desc}</div>
              </div>
            ))}
          </div>
          {[{l:"RG",v:d.rg,mx:2.80,mn:2.40},{l:"DIFF",v:d.diff,mx:0.060,mn:0.000}].map(s=>(
            <div key={s.l} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:8,color:"#bbb",fontWeight:700}}>{s.l}</span>
                <span style={{fontSize:9,color:ball.accent,fontWeight:700}}>{s.v}</span>
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
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,fontFamily:"inherit"}}>
          <thead>
            <tr>{["LB","RG","DIFF",...(hasMoi?["MOI"]:[])].map(h=>(
              <th key={h} style={{padding:"5px 8px",textAlign:"center",fontSize:8,color:"#bbb",
                fontWeight:700,letterSpacing:1.2,borderBottom:"1px solid #f0f0f8"}}>{h}</th>
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
                      fontWeight:act?800:600,color:act?ball.accent:"#666",
                      borderBottom:"1px solid #fafafa",fontSize:12}}>{v}</td>
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

// 등록 모달
function RegModal({ ball, existing, onSave, onClose }) {
  const [form, setForm] = useState({
    nickname:existing?.nickname||"", weight:existing?.weight||15,
    grip:existing?.grip||"세미팁", surface:existing?.surface||"팩토리", memo:existing?.memo||""
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,
      background:"rgba(10,10,30,0.6)",backdropFilter:"blur(14px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff",borderRadius:24,padding:"22px 20px",width:"100%",maxWidth:380,
        boxShadow:"0 32px 80px rgba(0,0,0,0.25)",animation:"modalIn .28s cubic-bezier(.34,1.56,.64,1)"}}>
        <style>{`@keyframes modalIn{from{transform:scale(.88) translateY(20px);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <BallImg ball={ball} size={50}/>
          <div style={{flex:1}}>
            <div style={{fontSize:8,color:"#ccc",fontWeight:700,letterSpacing:1.5}}>{ball.brand.toUpperCase()}</div>
            <div style={{fontSize:18,fontWeight:800,color:"#111",lineHeight:1.1}}>{ball.name}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#ddd",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <div>
            <label style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:1.5,display:"block",marginBottom:5}}>별명 (선택)</label>
            <input value={form.nickname} onChange={e=>set("nickname",e.target.value)} placeholder="나만의 이름" maxLength={20}
              style={{width:"100%",background:"#f7f7fc",border:"1.5px solid #ebebf5",borderRadius:10,
                color:"#333",padding:"8px 12px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div>
            <label style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:1.5,display:"block",marginBottom:5}}>무게</label>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {[10,11,12,13,14,15,16].map(w=>(
                <button key={w} onClick={()=>set("weight",w)} style={{padding:"4px 10px",borderRadius:7,cursor:"pointer",
                  fontSize:11,fontWeight:700,border:"none",fontFamily:"inherit",
                  background:form.weight===w?ball.accent:"#f0f0f8",color:form.weight===w?"#fff":"#888"}}>{w}lb</button>
              ))}
            </div>
          </div>
          {[
            {label:"인서트",key:"grip",opts:["파워리프트","오발","세미팁"]},
            {label:"표면 상태",key:"surface",opts:["팩토리","폴리싱","샌딩"]},
          ].map(({label,key,opts})=>(
            <div key={key}>
              <label style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:1.5,display:"block",marginBottom:5}}>{label}</label>
              <div style={{display:"flex",gap:4}}>
                {opts.map(o=>(
                  <button key={o} onClick={()=>set(key,o)} style={{flex:1,padding:"7px",borderRadius:7,cursor:"pointer",
                    fontSize:11,fontWeight:700,border:"none",fontFamily:"inherit",
                    background:form[key]===o?ball.accent:"#f0f0f8",color:form[key]===o?"#fff":"#888"}}>{o}</button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <label style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:1.5,display:"block",marginBottom:5}}>메모</label>
            <textarea value={form.memo} onChange={e=>set("memo",e.target.value)} placeholder="레인 조건, 세팅 팁, 사용 기록..." rows={3}
              style={{width:"100%",background:"#f7f7fc",border:"1.5px solid #ebebf5",borderRadius:10,
                color:"#333",padding:"8px 12px",fontSize:12,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
          </div>
        </div>
        <button onClick={()=>onSave(form)} style={{
          marginTop:14,width:"100%",padding:"13px",background:ball.accent,border:"none",borderRadius:12,
          color:"#fff",fontFamily:"inherit",fontSize:14,fontWeight:800,cursor:"pointer",
          boxShadow:`0 6px 20px ${ball.accent}55`}}>내 장비로 등록하기 →</button>
      </div>
    </div>
  );
}

// 내 볼 플립 카드
function MyCard({ entry, ball, onRemove, onEdit }) {
  const [flip, setFlip] = useState(false);
  const d = ball.weightData[entry.weight];
  return (
    <div style={{perspective:1000,height:188,cursor:"pointer"}} onClick={()=>setFlip(f=>!f)}>
      <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",
        transition:"transform .5s cubic-bezier(.4,0,.2,1)",transform:flip?"rotateY(180deg)":"none"}}>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"#fff",
          borderRadius:18,border:`1.5px solid ${ball.accent}22`,padding:13,overflow:"hidden",
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:ball.accent,borderRadius:"18px 18px 0 0"}}/>
          <div style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:7,marginTop:2}}>
            <BallImg ball={ball} size={42}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:7,color:"#ccc",fontWeight:700,letterSpacing:1.3}}>{ball.brand.toUpperCase()}</div>
              <div style={{fontWeight:800,fontSize:13,color:"#111",lineHeight:1.2,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ball.name}</div>
              {entry.nickname&&<div style={{fontSize:9,color:ball.accent,fontWeight:600}}>"{entry.nickname}"</div>}
            </div>
            <span style={{fontSize:7,color:"#ddd"}}>탭↺</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:5}}>
            {[{v:`${entry.weight}lb`,i:"⚖️"},{v:entry.grip,i:"🤙"},{v:entry.surface,i:"🔧"}].map(p=>(
              <span key={p.v} style={{fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:4,
                background:`${ball.accent}12`,color:ball.accent}}>{p.i} {p.v}</span>
            ))}
          </div>
          {d&&(
            <div style={{display:"flex",gap:8,borderTop:"1px solid #f5f5f8",paddingTop:6}}>
              {[{l:"RG",v:d.rg},{l:"DIFF",v:d.diff},...(d.moi?[{l:"MOI",v:d.moi}]:[])].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:2}}>
                  <span style={{fontSize:7,color:"#ccc",fontWeight:700}}>{x.l}</span>
                  <span style={{fontSize:11,fontWeight:800,color:ball.accent}}>{x.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",
          transform:"rotateY(180deg)",background:`linear-gradient(135deg,#fff,${ball.accent}07)`,
          border:`1.5px solid ${ball.accent}22`,borderRadius:18,padding:13,
          display:"flex",flexDirection:"column",justifyContent:"space-between",
          boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div>
            <div style={{fontSize:7,color:"#ccc",fontWeight:700,letterSpacing:1.5,marginBottom:5}}>MY MEMO</div>
            <p style={{fontSize:11,color:"#777",lineHeight:1.65}}>{entry.memo||"메모가 없어요."}</p>
          </div>
          <div style={{display:"flex",gap:5}}>
            <button onClick={e=>{e.stopPropagation();onEdit();}} style={{flex:1,padding:"6px",borderRadius:7,
              border:`1.5px solid ${ball.accent}44`,background:"transparent",color:ball.accent,
              cursor:"pointer",fontWeight:700,fontSize:10}}>✏️ 수정</button>
            <button onClick={e=>{e.stopPropagation();onRemove();}} style={{flex:1,padding:"6px",borderRadius:7,
              border:"1.5px solid #ef535044",background:"transparent",color:"#ef5350",
              cursor:"pointer",fontWeight:700,fontSize:10}}>🗑️ 삭제</button>
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
      <button onClick={onBack} style={{background:"#fff",border:"1.5px solid #e4e4f0",color:"#888",
        padding:"6px 14px",borderRadius:18,cursor:"pointer",fontWeight:700,fontSize:11,marginBottom:13,
        boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>← 목록</button>

      {/* 헤더 카드 */}
      <div style={{background:"#fff",borderRadius:22,overflow:"hidden",
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
              <div style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:2,marginBottom:2}}>{ball.brand.toUpperCase()}</div>
              <div style={{fontWeight:800,fontSize:24,color:"#111",lineHeight:1.1,marginBottom:4}}>{ball.name}</div>
              <div style={{fontSize:10,color:"#bbb",marginBottom:7}}>
                {ball.releaseDate}{ball.fragrance?` · 🍒 ${ball.fragrance}`:""}
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {[ball.cover,ball.coreType,ball.condition].map(t=>(
                  <span key={t} style={{fontSize:8,fontWeight:700,letterSpacing:.8,padding:"2px 7px",
                    borderRadius:4,background:`${ball.accent}14`,color:ball.accent,textTransform:"uppercase"}}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <p style={{fontSize:12,color:"#888",lineHeight:1.7,marginBottom:13}}>{ball.description}</p>
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
            flex:1,padding:"9px",borderRadius:11,cursor:"pointer",fontWeight:800,fontSize:11,
            border:"none",fontFamily:"inherit",
            background:tab===t.k?"#1a237e":"#fff",color:tab===t.k?"#fff":"#888",
            boxShadow:tab===t.k?"0 4px 14px rgba(26,35,126,0.28)":"0 1px 4px rgba(0,0,0,0.06)"}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* 스펙 탭 */}
      {tab==="specs"&&(
        <div style={{background:"#fff",borderRadius:18,padding:"16px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.07)",animation:"fadeUp .22s ease both"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
            {[{l:"커버스탁",v:ball.cover},{l:"코어 타입",v:ball.coreType},
              {l:"코어 이름",v:ball.coreName},{l:"마감 처리",v:ball.finish},
              {l:"오일 조건",v:ball.condition},{l:"출시일",v:ball.releaseDate}].map(s=>(
              <div key={s.l} style={{background:"#f8f8fc",borderRadius:11,padding:"9px 12px"}}>
                <div style={{fontSize:7,color:"#ccc",fontWeight:700,letterSpacing:1.3,marginBottom:2}}>{s.l.toUpperCase()}</div>
                <div style={{fontSize:12,color:"#333",fontWeight:700}}>{s.v}</div>
              </div>
            ))}
          </div>
          {ball.weightData[16]&&[
            {l:"RG (16lb)",v:ball.weightData[16].rg,mx:2.80,mn:2.40,d:"낮을수록 빠른 회전 시작"},
            {l:"Diff (16lb)",v:ball.weightData[16].diff,mx:0.060,mn:0,d:"높을수록 강한 훅 포텐셜"},
          ].map(s=>(
            <div key={s.l} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:11,color:"#999",fontWeight:700}}>{s.l}</span>
                <span style={{fontSize:22,fontWeight:800,color:ball.accent}}>{s.v}</span>
              </div>
              <div style={{height:7,background:"#f0f0f8",borderRadius:4,overflow:"hidden",marginBottom:3}}>
                <div style={{height:"100%",borderRadius:4,
                  width:`${((s.v-s.mn)/(s.mx-s.mn))*100}%`,
                  background:`linear-gradient(90deg,${ball.accent}66,${ball.accent})`}}/>
              </div>
              <div style={{fontSize:9,color:"#ccc"}}>{s.d}</div>
            </div>
          ))}
        </div>
      )}

      {/* 파운드별 탭 */}
      {tab==="weights"&&(
        <div style={{background:"#fff",borderRadius:18,padding:"16px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.07)",animation:"fadeUp .22s ease both"}}>
          <div style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:1.5,marginBottom:12}}>파운드별 코어 데이터</div>
          <WeightTable ball={ball} sel={selW} onSel={setSelW}/>
        </div>
      )}

      {/* 코어 탭 — 실제 코어 이미지 */}
      {tab==="core"&&(
        <div style={{background:"#fff",borderRadius:18,padding:"16px",
          boxShadow:"0 2px 12px rgba(0,0,0,0.07)",animation:"fadeUp .22s ease both"}}>
          <div style={{fontSize:8,color:"#bbb",fontWeight:700,letterSpacing:1.5,marginBottom:12}}>
            {ball.coreName.toUpperCase()} CORE
          </div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <div style={{width:200,height:200,borderRadius:20,overflow:"hidden",
              background:"linear-gradient(135deg,#f5f5fc,#ebebf5)",
              border:"1.5px solid #e8e8f4",boxShadow:`0 8px 24px ${ball.accent}22`}}>
              <BowwwlImg src={BOWWWL_CORE(ball.coreSlug)} alt={ball.coreName+" Core"} size={200} radius="20px"/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{l:"코어 타입",v:ball.coreType},{l:"코어 이름",v:ball.coreName}].map(s=>(
              <div key={s.l} style={{background:`${ball.accent}09`,borderRadius:11,padding:"12px",
                border:`1.5px solid ${ball.accent}18`,textAlign:"center"}}>
                <div style={{fontSize:7,color:"#bbb",fontWeight:700,letterSpacing:1.3,marginBottom:4}}>{s.l.toUpperCase()}</div>
                <div style={{fontSize:15,fontWeight:800,color:ball.accent}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ══ GEMINI AI 볼 추천 컴포넌트 ══
function GeminiAdvisor({ balls }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer]     = useState("");
  const [loading, setLoading]   = useState(false);

  const ask = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    try {
      const apiKey = process.env.REACT_APP_GEMINI_KEY;
      if (!apiKey) { setAnswer("⚠️ REACT_APP_GEMINI_KEY 환경변수를 설정해주세요."); setLoading(false); return; }

      const ballList = balls.map(b =>
        `${b.brand} ${b.name} (커버:${b.cover}, 코어:${b.coreType}, RG:${b.weightData[16]?.rg}, Diff:${b.weightData[16]?.diff}, 조건:${b.condition})`
      ).join("\n");

      const prompt = `당신은 볼링 전문가입니다. 아래 볼링공 목록을 참고해서 사용자 질문에 한국어로 답해주세요. 간결하게 150자 이내로.\n\n볼 목록:\n${ballList}\n\n질문: ${question}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setAnswer(text || "답변을 가져오지 못했어요.");
    } catch (e) {
      setAnswer("AI 연결 오류가 발생했어요. API 키를 확인해주세요.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background:"linear-gradient(135deg,#1a237e08,#1976d208)",
      border:"1.5px solid #1a237e22", borderRadius:18, padding:"14px 16px", marginBottom:14
    }}>
      <div style={{fontSize:8,color:"#1a237e",fontWeight:700,letterSpacing:1.5,marginBottom:9}}>
        ✨ AI 볼 추천 (Gemini)
      </div>
      <div style={{display:"flex",gap:6}}>
        <input
          value={question}
          onChange={e=>setQuestion(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&ask()}
          placeholder="예: 헤비 오일에서 쓸 볼 추천해줘"
          style={{flex:1,background:"#fff",border:"1.5px solid #e4e4f0",borderRadius:10,
            padding:"8px 12px",fontSize:12,outline:"none",fontFamily:"inherit",color:"#333"}}
        />
        <button onClick={ask} disabled={loading} style={{
          padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",
          background:"#1a237e",color:"#fff",fontWeight:800,fontSize:12,
          opacity:loading?0.6:1,transition:"opacity .15s",whiteSpace:"nowrap"
        }}>{loading?"⏳":"질문"}</button>
      </div>
      {answer&&(
        <div style={{marginTop:10,padding:"10px 12px",background:"#fff",borderRadius:10,
          fontSize:12,color:"#444",lineHeight:1.7,border:"1px solid #e8e8f4"}}>
          {answer}
        </div>
      )}
    </div>
  );
}

// ══ MAIN APP ══
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

  useEffect(()=>{setTimeout(()=>setSplash(false),2000);},[]);

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
  });

  const inArsenal = id => arsenal.some(e=>e.ballId===id);
  const toggleCmp = ball => {
    if(cmpList.find(b=>b.id===ball.id)) setCmpList(cmpList.filter(b=>b.id!==ball.id));
    else if(cmpList.length<3) setCmpList([...cmpList,ball]);
  };
  const handleSave = form => {
    if(editEnt) {
      setArsenal(prev=>prev.map(e=>e.addedAt===editEnt.addedAt?{...e,...form}:e));
      showToast("✏️ 수정 완료");
    } else {
      setArsenal(prev=>[...prev,{ballId:modal.id,...form,addedAt:Date.now()}]);
      showToast(`🎳 ${modal.name} 등록 완료!`);
    }
    setModal(null); setEditEnt(null);
  };

  const NAV=[
    {k:"home",l:"볼 탐색",i:"🔍"},
    {k:"arsenal",l:"내 장비",i:"🎳",badge:arsenal.length||null},
    {k:"compare",l:"비교",i:"⚖️",badge:cmpList.length||null},
  ];

  // SPLASH
  if(splash) return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",
      background:"linear-gradient(135deg,#0a0a1a 0%,#1a237e 55%,#0d47a1 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        @keyframes rollIn{from{transform:translateX(-90px) rotate(-300deg);opacity:0}to{transform:none;opacity:1}}
        @keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}
        @keyframes trackLine{from{width:0}to{width:100%}}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
      `}</style>
      <div style={{animation:"rollIn .9s cubic-bezier(.34,1.26,.64,1) both",fontSize:80,
        filter:"drop-shadow(0 0 36px rgba(144,202,249,.55))"}}>🎳</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:"#fff",letterSpacing:3,
        animation:"fadeUp .6s .5s both",marginTop:8}}>
        ROLL<span style={{color:"#90caf9"}}>MATE</span>
      </div>
      <div style={{fontSize:10,color:"rgba(255,255,255,.32)",letterSpacing:4,
        animation:"fadeUp .6s .75s both",marginTop:5}}>BOWLING BALL DATABASE</div>
      <div style={{fontSize:10,color:"rgba(144,202,249,.5)",letterSpacing:2,
        animation:"fadeUp .6s .9s both",marginTop:4}}>powered by bowwwl.com</div>
      <div style={{marginTop:26,width:130,height:2,background:"rgba(255,255,255,.1)",borderRadius:2,
        overflow:"hidden",animation:"fadeUp .6s 1s both"}}>
        <div style={{height:"100%",background:"#90caf9",animation:"trackLine 1.1s 1s ease both"}}/>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"'Syne',sans-serif",background:"#eef1f8",minHeight:"100vh",overflowX:"hidden",maxWidth:"100vw",width:"100%"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body,#root{overflow-x:hidden;max-width:100vw}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d8daee;border-radius:2px}
        @keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
        @keyframes toastIn{from{transform:translateX(-50%) translateY(8px);opacity:0}to{transform:translateX(-50%);opacity:1}}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
        .bcard{background:#fff;border-radius:18px;padding:13px;cursor:pointer;
          transition:transform .2s,box-shadow .2s;position:relative;overflow:hidden;
          box-shadow:0 1px 8px rgba(0,0,0,.07);border:1.5px solid rgba(0,0,0,.05)}
        .bcard:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,.13)}
        .tag{font-size:8px;font-weight:700;letter-spacing:.8px;padding:2px 6px;border-radius:4px;text-transform:uppercase}
        .sbar{height:5px;background:#ebebf5;border-radius:3px;overflow:hidden}
        .nav-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 14px;
          border:none;background:transparent;cursor:pointer;position:relative}
        .nav-lbl{font-size:9px;font-weight:700;letter-spacing:.8px;color:#bbb;transition:.18s}
        .nav-btn.act .nav-lbl{color:#1a237e}
        .chip{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:11px;cursor:pointer;
          transition:all .17s;border:none;font-weight:700;font-size:11px;white-space:nowrap;flex-shrink:0}
      `}</style>

      {toast&&<div style={{position:"fixed",bottom:84,left:"50%",background:"#fff",
        border:`1.5px solid ${toast.color}44`,color:toast.color,padding:"10px 18px",borderRadius:12,
        zIndex:9999,fontWeight:700,fontSize:12,boxShadow:`0 4px 20px ${toast.color}22`,
        animation:"toastIn .22s ease both",transform:"translateX(-50%)",whiteSpace:"nowrap"}}>{toast.msg}</div>}

      {modal&&<RegModal ball={modal} existing={editEnt} onSave={handleSave}
        onClose={()=>{setModal(null);setEditEnt(null);}}/>}

      {/* TOP BAR */}
      <div style={{background:"rgba(255,255,255,.94)",backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(0,0,0,.07)",padding:"0 12px",position:"sticky",top:0,zIndex:100,overflow:"hidden",width:"100%",boxSizing:"border-box"}}>
        <div style={{width:"100%",display:"flex",alignItems:"center",height:52,gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginRight:"auto"}}>
            <span style={{fontSize:22}}>🎳</span>
            <span style={{fontWeight:800,fontSize:18,letterSpacing:2,color:"#1a237e"}}>
              ROLL<span style={{color:"#1976d2"}}>MATE</span>
            </span>
            <span style={{fontSize:7,color:"#ccc",fontWeight:600,letterSpacing:.8,marginLeft:2}}>bowwwl.com</span>
          </div>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#bbb"}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="볼 검색..."
              style={{background:"#f2f2fa",border:"1.5px solid #e4e4f0",borderRadius:20,color:"#333",
                padding:"6px 12px 6px 26px",fontSize:11,fontWeight:600,outline:"none",width:"min(128px,30vw)",fontFamily:"inherit"}}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:820,margin:"0 auto",padding:"16px 12px 98px"}}>

        {/* HOME */}
        {view==="home"&&!sel&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <GeminiAdvisor balls={ALL_BALLS}/>
            {/* 브랜드 필터 칩 — 바 차트 제거 */}
            <div style={{marginBottom:14}}>
              <div style={{fontSize:8,color:"#aaa",fontWeight:700,letterSpacing:2,marginBottom:9}}>
                BRANDS · {ALL_BALLS.length} BALLS
              </div>
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,
                msOverflowStyle:"none",scrollbarWidth:"none"}}>
                <button className="chip" onClick={()=>setBrand("전체")} style={{
                  background:brand==="전체"?"#1a237e":"#fff",color:brand==="전체"?"#fff":"#888",
                  boxShadow:brand==="전체"?"0 4px 14px rgba(26,35,126,.28)":"0 1px 4px rgba(0,0,0,.07)"}}>
                  전체 <span style={{background:"rgba(255,255,255,.2)",padding:"1px 5px",borderRadius:4,fontSize:9}}>{ALL_BALLS.length}</span>
                </button>
                {brandCounts.map(({brand:b,count,icon})=>{
                  const act=brand===b;
                  return <button key={b} className="chip" onClick={()=>setBrand(b)} style={{
                    background:act?"#1a237e":"#fff",color:act?"#fff":"#555",
                    boxShadow:act?"0 4px 14px rgba(26,35,126,.28)":"0 1px 4px rgba(0,0,0,.07)"}}>
                    {icon} {b}
                    <span style={{background:act?"rgba(255,255,255,.2)":"#f0f0f8",color:act?"#fff":"#aaa",
                      padding:"1px 5px",borderRadius:4,fontSize:9,fontWeight:800}}>{count}</span>
                  </button>;
                })}
              </div>
              {/* 바 차트 완전 제거 */}
            </div>

            {/* 오일 필터 */}
            <div style={{display:"flex",gap:5,marginBottom:13,flexWrap:"wrap"}}>
              {["All","Heavy Oil","Medium-Heavy Oil","Medium Oil","Light-Medium Oil"].map(c=>{
                const act=cond===c; const col=c==="All"?"#1a237e":COND_COLOR[c];
                return <button key={c} onClick={()=>setCond(c)} style={{
                  padding:"5px 11px",borderRadius:18,cursor:"pointer",fontSize:10,fontWeight:700,
                  border:"none",fontFamily:"inherit",
                  background:act?col:"#fff",color:act?"#fff":"#bbb",
                  boxShadow:act?`0 3px 10px ${col}44`:"0 1px 4px rgba(0,0,0,.06)"}}>
                  {c!=="All"&&<span style={{width:5,height:5,borderRadius:"50%",display:"inline-block",
                    marginRight:4,verticalAlign:"middle",background:act?"#fff":col}}/>}
                  {c==="All"?"전체":c}
                </button>;
              })}
            </div>

            {(brand!=="전체"||search)&&(
              <div style={{fontSize:11,color:"#aaa",fontWeight:600,marginBottom:9}}>
                {brand!=="전체"&&<span style={{background:"#1a237e",color:"#fff",padding:"2px 7px",
                  borderRadius:4,marginRight:5,fontSize:9}}>{brand}</span>}
                {search&&<span>"{search}" · </span>}
                <span style={{color:"#1a237e",fontWeight:800}}>{filtered.length}개</span>
              </div>
            )}

            {/* 볼 그리드 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {filtered.map((ball,i)=>{
                const inA=inArsenal(ball.id); const inC=!!cmpList.find(b=>b.id===ball.id);
                return (
                  <div key={ball.id} className="bcard"
                    style={{animationDelay:`${i*20}ms`,animation:"fadeUp .36s ease both"}}
                    onClick={()=>{setSel(ball);setView("detail");}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:3,
                      background:ball.accent,borderRadius:"18px 18px 0 0"}}/>
                    {inA&&<div style={{position:"absolute",top:8,left:8,fontSize:11,zIndex:2}}>⭐</div>}
                    <div onClick={e=>{e.stopPropagation();toggleCmp(ball);}} style={{
                      position:"absolute",top:8,right:8,width:20,height:20,borderRadius:"50%",
                      cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:11,fontWeight:800,zIndex:2,
                      background:inC?ball.accent:"#ebebf5",color:inC?"#fff":"#ccc",
                      boxShadow:inC?`0 2px 8px ${ball.accent}55`:"none"}}>{inC?"✓":"+"}</div>

                    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8,marginTop:3}}>
                      {/* 실제 볼 이미지 */}
                      <div style={{width:50,height:50,borderRadius:"50%",overflow:"hidden",flexShrink:0,
                        boxShadow:`0 4px 16px ${ball.accent}44`,border:`2px solid ${ball.accent}33`}}>
                        <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={50} radius="50%"/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:7,color:"#ccc",fontWeight:700,letterSpacing:1.2}}>{ball.brand.toUpperCase()}</div>
                        <div style={{fontWeight:800,fontSize:13,color:"#111",lineHeight:1.25,
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ball.name}</div>
                        <div style={{display:"flex",gap:3,marginTop:3,flexWrap:"wrap"}}>
                          {[ball.cover,ball.coreType].map(t=>(
                            <span key={t} className="tag" style={{background:`${ball.accent}14`,color:ball.accent}}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {ball.weightData[16]&&(
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:7}}>
                        {[{l:"RG",v:ball.weightData[16].rg,mx:2.8,mn:2.4},
                          {l:"DIFF",v:ball.weightData[16].diff,mx:.06,mn:0}].map(s=>(
                          <div key={s.l}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                              <span style={{fontSize:7,color:"#ccc",fontWeight:700}}>{s.l}</span>
                              <span style={{fontSize:9,color:"#555",fontWeight:700}}>{s.v}</span>
                            </div>
                            <div className="sbar">
                              <div style={{height:"100%",borderRadius:3,
                                width:`${((s.v-s.mn)/(s.mx-s.mn))*100}%`,
                                background:`linear-gradient(90deg,${ball.accent}77,${ball.accent})`}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:COND_COLOR[ball.condition]}}/>
                      <span style={{fontSize:8,color:"#bbb",fontWeight:600}}>{ball.condition}</span>
                      <button onClick={e=>{e.stopPropagation();setModal(ball);setEditEnt(null);}} style={{
                        marginLeft:"auto",padding:"3px 8px",borderRadius:5,cursor:"pointer",
                        fontSize:8,fontWeight:700,border:"none",fontFamily:"inherit",
                        background:inA?`${ball.accent}14`:"#f0f0f8",color:inA?ball.accent:"#bbb"}}>{inA?"✓ 등록됨":"+ 등록"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length===0&&(
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:36,marginBottom:10}}>🔍</div>
                <div style={{fontWeight:800,fontSize:16,color:"#ccc"}}>검색 결과 없음</div>
              </div>
            )}
          </div>
        )}

        {/* DETAIL */}
        {view==="detail"&&sel&&(
          <Detail ball={sel} onBack={()=>{setView("home");setSel(null);}}
            inArsenal={inArsenal} onReg={(b)=>{setModal(b);setEditEnt(null);}}/>
        )}

        {/* ARSENAL */}
        {view==="arsenal"&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
              <div>
                <div style={{fontWeight:800,fontSize:22,color:"#111"}}>내 장비함</div>
                <div style={{fontSize:10,color:"#bbb",marginTop:2}}>
                  {arsenal.length>0?`${arsenal.length}개 등록됨 · 탭하면 뒤집혀요`:"아직 등록된 볼이 없어요"}
                </div>
              </div>
              <button onClick={()=>setView("home")} style={{padding:"7px 13px",borderRadius:18,border:"none",
                background:"#1a237e",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:10,fontFamily:"inherit",
                boxShadow:"0 3px 10px rgba(26,35,126,.28)"}}>+ 볼 추가</button>
            </div>
            {arsenal.length===0?(
              <div style={{textAlign:"center",padding:"55px 20px",background:"#fff",border:"2px dashed #e4e4f0",borderRadius:18}}>
                <div style={{fontSize:48,marginBottom:10,opacity:.22}}>🎳</div>
                <div style={{fontWeight:800,fontSize:17,color:"#ddd"}}>장비함이 비어있어요</div>
                <button onClick={()=>setView("home")} style={{marginTop:16,padding:"9px 22px",borderRadius:18,
                  background:"#1a237e",border:"none",color:"#fff",cursor:"pointer",fontWeight:800,fontSize:12,fontFamily:"inherit",
                  boxShadow:"0 4px 14px rgba(26,35,126,.28)"}}>볼 탐색하기</button>
              </div>
            ):(
              <>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:14}}>
                  {[{l:"등록 볼",v:arsenal.length,c:"#1a237e",i:"🎳"},
                    {l:"평균 무게",v:`${(arsenal.reduce((a,e)=>a+e.weight,0)/arsenal.length).toFixed(1)}lb`,c:"#1976d2",i:"⚖️"},
                    {l:"주요 커버",v:(()=>{const cv=arsenal.map(e=>ALL_BALLS.find(b=>b.id===e.ballId)?.cover).filter(Boolean);const f=cv.reduce((a,v)=>({...a,[v]:(a[v]||0)+1}),{});return Object.entries(f).sort((a,b)=>b[1]-a[1])[0]?.[0]||"-"})(),c:"#0288d1",i:"🔷"}
                  ].map(s=>(
                    <div key={s.l} style={{background:"#fff",borderRadius:13,padding:"11px",boxShadow:"0 1px 8px rgba(0,0,0,.06)"}}>
                      <div style={{fontSize:15,marginBottom:2}}>{s.i}</div>
                      <div style={{fontWeight:800,fontSize:19,color:s.c,lineHeight:1}}>{s.v}</div>
                      <div style={{fontSize:7,color:"#ccc",fontWeight:700,letterSpacing:.8,marginTop:2}}>{s.l.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
                  {arsenal.map(entry=>{
                    const ball=ALL_BALLS.find(b=>b.id===entry.ballId);
                    if(!ball) return null;
                    return <MyCard key={entry.addedAt} entry={entry} ball={ball}
                      onRemove={()=>{setArsenal(prev=>prev.filter(e=>e.addedAt!==entry.addedAt));showToast("🗑️ 삭제됨","#ef5350");}}
                      onEdit={()=>{setModal(ball);setEditEnt(entry);}}/>;
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* COMPARE */}
        {view==="compare"&&(
          <div style={{animation:"fadeUp .3s ease both"}}>
            <div style={{fontWeight:800,fontSize:22,color:"#111",marginBottom:2}}>볼 비교</div>
            <p style={{fontSize:10,color:"#bbb",marginBottom:14}}>
              {cmpList.length===0?"볼 탐색에서 + 버튼으로 최대 3개 선택":`${cmpList.length}개 비교 중`}
            </p>
            {cmpList.length===0?(
              <div style={{textAlign:"center",padding:"50px 20px",background:"#fff",border:"2px dashed #e4e4f0",borderRadius:18}}>
                <div style={{fontSize:40,marginBottom:10,opacity:.22}}>⚖️</div>
                <div style={{fontWeight:800,fontSize:17,color:"#ddd"}}>선택된 볼 없음</div>
                <button onClick={()=>setView("home")} style={{marginTop:13,padding:"8px 20px",background:"#1a237e",
                  border:"none",color:"#fff",borderRadius:18,cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit",
                  boxShadow:"0 3px 10px rgba(26,35,126,.28)"}}>볼 탐색으로</button>
              </div>
            ):(
              <>
                <div style={{display:"grid",gridTemplateColumns:`repeat(${cmpList.length},1fr)`,gap:8}}>
                  {cmpList.map(ball=>(
                    <div key={ball.id} style={{background:"#fff",borderRadius:16,overflow:"hidden",
                      boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}>
                      <div style={{height:4,background:ball.accent}}/>
                      <div style={{padding:"12px 10px",textAlign:"center",borderBottom:"1px solid #f5f5f8"}}>
                        <div style={{display:"flex",justifyContent:"center",marginBottom:7}}>
                          <div style={{width:60,height:60,borderRadius:"50%",overflow:"hidden",
                            boxShadow:`0 4px 16px ${ball.accent}44`,border:`2px solid ${ball.accent}33`}}>
                            <BowwwlImg src={BOWWWL_BALL(ball.ballSlug)} alt={ball.name} size={60} radius="50%"/>
                          </div>
                        </div>
                        <div style={{fontSize:7,color:"#ccc",fontWeight:700,letterSpacing:1.2}}>{ball.brand.toUpperCase()}</div>
                        <div style={{fontWeight:800,fontSize:12,color:"#111",lineHeight:1.2}}>{ball.name}</div>
                        <button onClick={()=>toggleCmp(ball)} style={{marginTop:5,padding:"2px 8px",
                          background:"#f0f0f8",border:"none",color:"#bbb",borderRadius:5,cursor:"pointer",
                          fontWeight:700,fontSize:9,fontFamily:"inherit"}}>제거</button>
                      </div>
                      {/* 코어 이미지 미니 */}
                      <div style={{padding:"9px 10px",borderBottom:"1px solid #f8f8fc",display:"flex",justifyContent:"center"}}>
                        <div style={{width:54,height:54,borderRadius:10,overflow:"hidden",
                          background:"#f5f5f8",border:"1px solid #ebebf5"}}>
                          <BowwwlImg src={BOWWWL_CORE(ball.coreSlug)} alt="Core" size={54} radius="10px"/>
                        </div>
                      </div>
                      <div style={{padding:"9px 10px"}}>
                        {[{k:"RG",v:ball.weightData[16]?.rg||"-"},{k:"Diff",v:ball.weightData[16]?.diff||"-"},
                          {k:"Cover",v:ball.cover},{k:"Core",v:ball.coreType}].map(r=>(
                          <div key={r.k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",
                            borderBottom:"1px solid #f8f8fc",fontSize:9}}>
                            <span style={{color:"#ccc",fontWeight:700}}>{r.k}</span>
                            <span style={{color:"#333",fontWeight:700,textAlign:"right",
                              maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:8}}>{r.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {cmpList.length>1&&(
                  <div style={{marginTop:11,background:"#fff",borderRadius:14,padding:"14px 16px",
                    boxShadow:"0 1px 8px rgba(0,0,0,.06)"}}>
                    <div style={{fontSize:7,color:"#ccc",fontWeight:700,letterSpacing:2,marginBottom:10}}>수치 비교 (16lb)</div>
                    {[{l:"RG",k:"rg",mx:2.8,mn:2.4},{l:"DIFF",k:"diff",mx:.06,mn:0}].map(m=>(
                      <div key={m.k} style={{marginBottom:12}}>
                        <div style={{fontSize:7,color:"#bbb",fontWeight:700,letterSpacing:1.3,marginBottom:7}}>{m.l}</div>
                        {cmpList.map(ball=>(
                          <div key={ball.id} style={{marginBottom:5}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                              <span style={{fontSize:9,color:"#999"}}>{ball.name}</span>
                              <span style={{fontSize:9,color:ball.accent,fontWeight:800}}>{ball.weightData[16]?.[m.k]}</span>
                            </div>
                            <div className="sbar">
                              <div style={{height:"100%",borderRadius:3,
                                width:`${((ball.weightData[16]?.[m.k]||m.mn)-m.mn)/(m.mx-m.mn)*100}%`,
                                background:`linear-gradient(90deg,${ball.accent}77,${ball.accent})`}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,
        background:"rgba(255,255,255,.97)",backdropFilter:"blur(20px)",
        borderTop:"1px solid rgba(0,0,0,.07)",padding:"7px 0 11px",
        boxShadow:"0 -4px 20px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",justifyContent:"center",gap:4,maxWidth:820,margin:"0 auto"}}>
          {NAV.map(n=>(
            <button key={n.k} className={`nav-btn ${view===n.k?"act":""}`}
              onClick={()=>{setView(n.k);setSel(null);}}>
              <span style={{fontSize:20}}>{n.i}</span>
              <span className="nav-lbl">{n.l}</span>
              {n.badge&&<span style={{position:"absolute",top:2,right:10,width:14,height:14,
                borderRadius:"50%",background:"#1a237e",color:"#fff",fontSize:7,fontWeight:800,
                display:"flex",alignItems:"center",justifyContent:"center"}}>{n.badge}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
