import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import * as SplashScreen from "expo-splash-screen";

void SplashScreen.preventAutoHideAsync().catch(() => {});

interface Props {
  onFinished?: () => void;
}

async function loadBase64FromModule(moduleId: number) {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const uri = asset.localUri;
  if (!uri) throw new Error(`localUri null for module ${moduleId}`);
  return await FileSystem.readAsStringAsync(uri, { encoding: "base64" as any });
}

const HTML = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<style>
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body {
    width:100%;
    height:100%;
    overflow:hidden;
    touch-action:none;

    /* ✅ brak jakiegokolwiek overlayu / koloru tła */
    background: transparent;
  }

  /* ✅ PNG jako JEDYNE tło */
  body::before{
    content:"";
    position:fixed;
    inset:0;
    background-image:url("data:image/png;base64,__BG_PNG_BASE64__");
    background-size:cover;
    background-position:center;
    background-repeat:no-repeat;
    z-index:0;
  }

  /* ✅ canvas przeźroczysty nad tłem */
  canvas {
    display:block;
    position:fixed;
    inset:0;
    z-index:1;
    background:transparent;
  }
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');

window.addEventListener('error', (e) => {
  try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage('JS_ERROR: '+(e.message||'unknown')); } catch {}
});
window.addEventListener('unhandledrejection', (e) => {
  try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage('JS_REJECTION: '+(e.reason?.message||e.reason||'unknown')); } catch {}
});

function resize() {
  const dpr=window.devicePixelRatio||1;
  const cssW=window.innerWidth, cssH=window.innerHeight;
  canvas.width=Math.round(cssW*dpr); canvas.height=Math.round(cssH*dpr);
  canvas.style.width=cssW+'px'; canvas.style.height=cssH+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  // ważne: brak czyszczenia tłem — tylko transform
}
resize();
window.addEventListener('resize', resize);

const W  = () => window.innerWidth;
const H  = () => window.innerHeight;
const CX = () => W()/2;
const CY = () => H()/2;

const clamp    = (v,a,b) => Math.max(a,Math.min(b,v));
const lerp     = (a,b,t) => a+(b-a)*t;
const easeOut3 = t => 1-Math.pow(1-t,3);
const easeOut5 = t => 1-Math.pow(1-t,5);
function easeInOutQuart(t) { return t<0.5 ? 8*t*t*t*t : 1-Math.pow(-2*t+2,4)/2; }
function easeOutQuart(t)   { return 1-Math.pow(1-t,4); }
function smoothstep(t) { t=clamp(t,0,1); return t*t*(3-2*t); }

const W0=9.0, DT=0.001, SPIN_DURATION=4.0, DECEL_START=1.0;
const STEPS=Math.ceil(SPIN_DURATION/DT)+5;
const ringAngleArr=new Float64Array(STEPS);
const eAngleArr=new Float64Array(STEPS);
for (let i=1;i<STEPS;i++) {
  const t=i*DT;
  const tN=clamp((t-DECEL_START)/(SPIN_DURATION-DECEL_START),0,1);
  const w=W0*(1-smoothstep(tN));
  ringAngleArr[i]=ringAngleArr[i-1]-w*DT;
  eAngleArr[i]=eAngleArr[i-1]+w*DT;
}
function normAngle(arr) {
  const last=arr[STEPS-1], turns=Math.round(last/(Math.PI*2));
  const delta=turns*Math.PI*2-last;
  for (let i=0;i<STEPS;i++) arr[i]+=delta*(i/(STEPS-1));
}
normAngle(ringAngleArr); normAngle(eAngleArr);
function spinAngle(arr,spinT) {
  if (spinT>=SPIN_DURATION) return 0;
  if (spinT<0) return arr[0];
  return arr[clamp(Math.floor(spinT/DT),0,STEPS-1)];
}

const SERIF="'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif";

function layout() {
  const scBase=Math.min(W(),H())/600;
  const cx=CX(), cy=CY();
  const MARGIN=32;
  const fsBase=122*scBase, lsBase=4*scBase, rOutBase=124*scBase, gapBase=2*scBase;
  ctx.font=\`300 \${fsBase}px \${SERIF}\`;
  ctx.textBaseline='alphabetic';
  const LETTERS=['t','i','q','u','e','t','t','e'];
  const lwBase=LETTERS.map(ch=>ctx.measureText(ch).width+lsBase);
  const tiqWBase=lwBase.reduce((a,b)=>a+b,0)-lsBase;
  const totalWBase=rOutBase*2+gapBase+tiqWBase;
  const sc=scBase*(totalWBase>W()-MARGIN*2?(W()-MARGIN*2)/totalWBase:1);
  const fs=122*sc, ls=4*sc, rOut=124*sc, rIn=96*sc, gap=2*sc;
  ctx.font=\`300 \${fs}px \${SERIF}\`;
  const lw=LETTERS.map(ch=>ctx.measureText(ch).width+ls);
  const tiqW=lw.reduce((a,b)=>a+b,0)-ls;
  const totalW=rOut*2+gap+tiqW, compLeft=cx-totalW/2;
  const ringFX=compLeft+rOut, tiqStartX=compLeft+rOut*2+gap;
  const baselineY=cy+fs*0.72/2;
  const tfs=22*sc, tsp=3*sc;
  ctx.font=\`300 \${tfs}px \${SERIF}\`;
  const TLETTERS='THE ART OF REFINED LIVING'.split('');
  const tlw=TLETTERS.map(ch=>ctx.measureText(ch).width+tsp);
  const tTotalW=tlw.reduce((a,b)=>a+b,0)-tsp;
  return { sc,cx,cy,fs,ls,rOut,rIn,gap,LETTERS,lw,tiqW,totalW,
           compLeft,ringFX,tiqStartX,baselineY,
           tfs,tsp,TLETTERS,tlw,tTotalW,tStartX:cx-tTotalW/2,tY:cy+120*sc };
}

function drawRing(lyt, cx, cy, scaleX, alpha, glowBlur, highlightAngle, highlightAmp) {
  if (alpha<=0) return;
  const {rOut,rIn}=lyt;
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(cx,cy); ctx.scale(scaleX,1);
  const absX=Math.abs(scaleX);
  const ep=Math.max(0,1-absX/0.14);
  if (ep>0.005) {
    const eg=ctx.createLinearGradient(-rOut,0,rOut,0);
    eg.addColorStop(0,'rgba(26,12,0,0)');
    eg.addColorStop(0.25,\`rgba(138,80,8,\${ep*0.9})\`);
    eg.addColorStop(0.5,\`rgba(255,210,60,\${ep})\`);
    eg.addColorStop(0.75,\`rgba(138,80,8,\${ep*0.9})\`);
    eg.addColorStop(1,'rgba(26,12,0,0)');
    ctx.beginPath(); ctx.ellipse(0,0,rOut,Math.max(rOut*0.12,(rOut-rIn)*0.85),0,0,Math.PI*2);
    ctx.fillStyle=eg; ctx.fill();
  }
  const g=ctx.createLinearGradient(-rOut,-rOut,rOut,rOut);
  g.addColorStop(0.00,'#1a0c00'); g.addColorStop(0.12,'#8a5008');
  g.addColorStop(0.28,'#d89018'); g.addColorStop(0.44,'#ffd040');
  g.addColorStop(0.50,'#fff4a0'); g.addColorStop(0.56,'#ffd040');
  g.addColorStop(0.72,'#b07010'); g.addColorStop(0.88,'#6a3a00'); g.addColorStop(1.00,'#1a0c00');
  ctx.beginPath(); ctx.arc(0,0,rOut,0,Math.PI*2); ctx.arc(0,0,rIn,Math.PI*2,0,true);
  ctx.shadowColor=\`rgba(255,185,30,\${0.6*alpha})\`; ctx.shadowBlur=glowBlur;
  ctx.fillStyle=g; ctx.fill(); ctx.shadowBlur=0;

  ctx.save(); ctx.globalAlpha=0.25;
  ctx.beginPath(); ctx.arc(0,0,rOut-1,Math.PI*1.08,Math.PI*1.92);
  ctx.arc(0,0,rIn+1,Math.PI*1.92,Math.PI*1.08,true);
  ctx.fillStyle='rgba(255,250,185,0.9)'; ctx.fill(); ctx.restore();

  if (highlightAmp>0.01) {
    const mid=(rOut+rIn)/2, thick=(rOut-rIn)*0.55;
    const hx=Math.cos(highlightAngle)*mid, hy=Math.sin(highlightAngle)*mid;
    ctx.save();
    ctx.beginPath(); ctx.arc(0,0,rOut,0,Math.PI*2); ctx.arc(0,0,rIn,Math.PI*2,0,true); ctx.clip();
    const hr=ctx.createRadialGradient(hx,hy,0,hx,hy,thick*1.8);
    hr.addColorStop(0,\`rgba(255,255,220,\${0.82*highlightAmp})\`);
    hr.addColorStop(0.35,\`rgba(255,240,160,\${0.38*highlightAmp})\`);
    hr.addColorStop(1,'rgba(255,200,60,0)');
    ctx.beginPath(); ctx.arc(hx,hy,thick*1.8,0,Math.PI*2);
    ctx.fillStyle=hr; ctx.fill(); ctx.restore();
  }
  ctx.restore();
}

function drawShimmer(lyt,cx,cy,progress,alpha) {
  if (alpha<=0||progress<=0) return;
  const {rOut,rIn}=lyt, mid=(rOut+rIn)/2, thick=(rOut-rIn)*0.65;
  const startAngle=-Math.PI/2, endAngle=startAngle+progress*Math.PI*2;
  const trailStart=Math.max(startAngle,endAngle-Math.PI*0.5);
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(cx,cy);
  ctx.beginPath(); ctx.arc(0,0,rOut+thick,0,Math.PI*2); ctx.arc(0,0,rIn-thick,Math.PI*2,0,true); ctx.clip();
  const headX=Math.cos(endAngle)*mid, headY=Math.sin(endAngle)*mid;
  const hg=ctx.createRadialGradient(headX,headY,0,headX,headY,thick*2.2);
  hg.addColorStop(0,'rgba(255,255,230,0.98)'); hg.addColorStop(0.25,'rgba(255,230,100,0.75)');
  hg.addColorStop(0.6,'rgba(255,190,40,0.25)'); hg.addColorStop(1,'rgba(255,160,0,0)');
  ctx.beginPath(); ctx.arc(headX,headY,thick*2.2,0,Math.PI*2); ctx.fillStyle=hg; ctx.fill();
  const tg=ctx.createLinearGradient(Math.cos(trailStart)*mid,Math.sin(trailStart)*mid,headX,headY);
  tg.addColorStop(0,'rgba(255,200,60,0)'); tg.addColorStop(0.5,'rgba(255,228,100,0.45)');
  tg.addColorStop(1,'rgba(255,252,200,0.9)');
  ctx.beginPath(); ctx.arc(0,0,mid,trailStart,endAngle);
  ctx.strokeStyle=tg; ctx.lineWidth=thick; ctx.lineCap='round'; ctx.stroke(); ctx.restore();
}

function drawBeamUnderTiquette(lyt,progress,alpha) {
  if (alpha<=0||progress<=0) return;
  const {tiqStartX,tiqW,baselineY,fs,sc}=lyt;
  const y=baselineY+fs*0.12, x0=tiqStartX, x1=tiqStartX+tiqW;
  const headX=lerp(x0,x1,progress), trail=Math.max(40*sc,tiqW*0.22);
  ctx.save(); ctx.globalAlpha=alpha;
  const hg=ctx.createRadialGradient(headX,y,0,headX,y,26*sc);
  hg.addColorStop(0,'rgba(255,255,230,0.95)'); hg.addColorStop(0.3,'rgba(255,230,100,0.65)');
  hg.addColorStop(0.7,'rgba(255,190,40,0.18)'); hg.addColorStop(1,'rgba(255,160,0,0)');
  ctx.fillStyle=hg; ctx.beginPath(); ctx.arc(headX,y,26*sc,0,Math.PI*2); ctx.fill();
  const gx0=Math.max(x0,headX-trail);
  const tg=ctx.createLinearGradient(gx0,y,headX,y);
  tg.addColorStop(0,'rgba(255,200,60,0)'); tg.addColorStop(0.55,'rgba(255,228,100,0.42)');
  tg.addColorStop(1,'rgba(255,252,200,0.9)');
  ctx.strokeStyle=tg; ctx.lineWidth=6*sc; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(gx0,y); ctx.lineTo(headX,y); ctx.stroke(); ctx.restore();
}

function drawE(lyt,cx,cy,scaleX,alpha) {
  if (alpha<=0) return;
  const {fs,sc}=lyt;
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(cx,cy); ctx.scale(scaleX,1);
  ctx.font=\`300 \${fs}px \${SERIF}\`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor='rgba(255,255,255,0.8)'; ctx.shadowBlur=12*sc;
  ctx.fillStyle='#ffffff'; ctx.fillText('E',0,0); ctx.shadowBlur=0; ctx.restore();
}

function drawTiquette(lyt,alphas,offsets) {
  const {fs,sc,LETTERS,lw,tiqStartX,baselineY}=lyt;
  ctx.save(); ctx.font=\`300 \${fs}px \${SERIF}\`; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  let x=tiqStartX;
  for (let i=0;i<LETTERS.length;i++) {
    if (alphas[i]>0) {
      ctx.globalAlpha=alphas[i]; ctx.shadowColor='rgba(255,255,255,0.3)'; ctx.shadowBlur=5*sc;
      ctx.fillStyle='#ffffff'; ctx.fillText(LETTERS[i],x+(offsets[i]||0),baselineY); ctx.shadowBlur=0;
    }
    x+=lw[i];
  }
  ctx.restore();
}

function drawTagline(lyt,count,showCursor,cursorOn) {
  const {tfs,TLETTERS,tlw,tStartX,tY}=lyt;
  ctx.save(); ctx.font=\`300 \${tfs}px \${SERIF}\`; ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  ctx.fillStyle='rgba(255,215,80,0.85)';
  let x=tStartX; const n=Math.min(count,TLETTERS.length);
  for (let i=0;i<n;i++) { ctx.fillText(TLETTERS[i],x,tY); x+=tlw[i]; }
  if (showCursor&&cursorOn) { ctx.fillStyle='rgba(255,215,80,0.55)'; ctx.fillText('|',x,tY); }
  ctx.restore();
}

function drawSparkle(cx,cy,size,alpha) {
  if (alpha<=0||size<=0) return;
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(cx,cy);
  const glow=ctx.createRadialGradient(0,0,0,0,0,size*2.8);
  glow.addColorStop(0,'rgba(255,252,220,0.5)'); glow.addColorStop(0.5,'rgba(255,220,100,0.15)');
  glow.addColorStop(1,'rgba(255,180,30,0)');
  ctx.beginPath(); ctx.arc(0,0,size*2.8,0,Math.PI*2); ctx.fillStyle=glow; ctx.fill();
  const drawRay=(rot)=>{
    const L=size,T=size*0.07;
    ctx.save(); ctx.rotate(rot);
    ctx.beginPath(); ctx.moveTo(0,-L);
    ctx.quadraticCurveTo(T,-T,L,0); ctx.quadraticCurveTo(T,T,0,L);
    ctx.quadraticCurveTo(-T,T,-L,0); ctx.quadraticCurveTo(-T,-T,0,-L); ctx.closePath();
    const sg=ctx.createLinearGradient(0,-L,0,L);
    sg.addColorStop(0,'rgba(255,255,245,0.95)'); sg.addColorStop(0.5,'rgba(255,248,200,1.0)');
    sg.addColorStop(1,'rgba(255,255,245,0.95)');
    ctx.fillStyle=sg; ctx.fill(); ctx.restore();
  };
  drawRay(0); drawRay(Math.PI/4); ctx.restore();
}

function getSparklePos(lyt) {
  const {LETTERS,lw,tiqStartX,baselineY,fs}=lyt;
  let x=tiqStartX;
  for (let i=0;i<LETTERS.length-1;i++) x+=lw[i];
  return { x:x+lw[LETTERS.length-1]*0.78, y:baselineY-fs*0.70 };
}

// ─── TIMELINE ────────────────────────────────────────────────
const P_DROP_END      = 0.3;
const P_SPIN_END      = P_DROP_END + SPIN_DURATION;
const P_SLIDE_START   = P_SPIN_END;
const P_SLIDE_END     = P_SLIDE_START + 1.00;
const P_TIQ_START     = P_SLIDE_START + 0.60;
const P_TIQ_STAGGER   = 0.12;
const P_TIQ_DUR       = 0.55;
const P_TAG_START     = 7.22;
const P_TAG_CHAR_MS   = 0.080;
const P_TAG_TYPING_DUR= 0.4 + 25 * P_TAG_CHAR_MS;
const P_TAG_END       = P_TAG_START + P_TAG_TYPING_DUR;
const P_SHIMMER_START = P_TAG_END + 0.3;
const P_SHIMMER_DUR   = 1.20;
const P_SHIMMER_END   = P_SHIMMER_START + P_SHIMMER_DUR;
const P_SPARKLE_START = P_SHIMMER_END;
const P_SPARKLE_DUR   = 0.93;
const P_SPARKLE_END   = P_SPARKLE_START + P_SPARKLE_DUR;
const P_PAUSE_END     = P_SPARKLE_END + 1.10;
const P_FADE_DUR      = 1.60;
const P_FADE_END      = P_PAUSE_END + P_FADE_DUR;

const TYPEN2_RATE = P_TAG_TYPING_DUR / 2.8;

// ─── AUDIO SYSTEM (bez zmian logicznych) ─────────────────────
const AudioSystem = (() => {
  let audioCtx=null, master=null, fxBus=null, convolver=null, limiter=null, dry=null;
  let started=false;
  const fired=new Set();
  const clamp01=(x)=>Math.max(0,Math.min(1,x));
  const expMap=(x,a,b)=>a*Math.pow(b/a,clamp01(x));
  const now=()=>audioCtx.currentTime;

  let bladeBuf=null, wooshBuf=null, woobamBuf=null, typen2Buf=null, putuBuf=null;

  let bladeSrc=null, bladeGain=null, bladeFilter=null;
  let wooshSpinSrc=null, wooshSpinGain=null, wooshSpinPlaying=false;
  let wooshDropSrc=null;
  let woobamFired=false;
  let typen2Src=null, typen2Playing=false;

  const LOOP_START=0.07, LOOP_END=2.62;

  function ensure() {
    if (audioCtx) return;
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    master=audioCtx.createGain(); master.gain.value=0.88;
    fxBus=audioCtx.createGain(); fxBus.gain.value=0.95;
    convolver=audioCtx.createConvolver(); convolver.buffer=makeImpulse(2.6,3.2);
    const verbReturn=audioCtx.createGain(); verbReturn.gain.value=0.0;
    const verbHP=audioCtx.createBiquadFilter(); verbHP.type="highpass"; verbHP.frequency.value=200;
    limiter=audioCtx.createWaveShaper();
    const curve=new Float32Array(2048);
    for (let i=0;i<curve.length;i++) { const x=(i/(curve.length-1))*2-1; curve[i]=Math.tanh(2.0*x); }
    limiter.curve=curve; limiter.oversample="4x";
    dry = audioCtx.createGain();
    dry.gain.value = 1.0;
    const fxSend=audioCtx.createGain(); fxSend.gain.value=0.10;
    fxBus.connect(dry); fxBus.connect(fxSend);
    fxSend.connect(convolver); convolver.connect(verbHP); verbHP.connect(verbReturn);
    dry.connect(master); verbReturn.connect(master);
    master.connect(limiter); limiter.connect(audioCtx.destination);
  }

  function makeImpulse(sec,decay) {
    const rate=audioCtx.sampleRate, len=Math.max(1,Math.floor(sec*rate));
    const ir=audioCtx.createBuffer(2,len,rate);
    for (let ch=0;ch<2;ch++) {
      const d=ir.getChannelData(ch);
      for (let i=0;i<len;i++) { const t=i/len; d[i]=(Math.random()*2-1)*Math.pow(1-t,decay); }
    }
    return ir;
  }

  const BLADE_B64="";
  const WOOSH_B64="__WOOSH_MP3_BASE64__";
  const PUTU_B64="__PUTU_MP3_BASE64__";
  const WOOBAM_B64="__WOOBAM_MP3_BASE64__";
  const TYPEN2_B64="__TYPEN2_MP3_BASE64__";

  async function decodeBuf(b64,label) {
    if (!b64||b64.length<50) return null;
    try {
      const bin=atob(b64), bytes=new Uint8Array(bin.length);
      for (let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
      const buf=await audioCtx.decodeAudioData(bytes.buffer.slice(0));
      try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(label+"_OK dur="+buf.duration.toFixed(2)+"s"); } catch {}
      return buf;
    } catch(e) {
      try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(label+"_ERR: "+(e?.message||e)); } catch {}
      return null;
    }
  }

  let loadP=null;
  function loadAll() {
    if (loadP) return loadP;
    loadP=(async()=>{
      if (!bladeBuf)  bladeBuf  = await decodeBuf(BLADE_B64,  "BLADE");
      if (!wooshBuf)  wooshBuf  = await decodeBuf(WOOSH_B64,  "WOOSH");
      if (!woobamBuf) woobamBuf = await decodeBuf(WOOBAM_B64, "WOOBAM");
      if (!typen2Buf) typen2Buf = await decodeBuf(TYPEN2_B64, "TYPEN2");
      if (!putuBuf)   putuBuf   = await decodeBuf(PUTU_B64,   "PUTU");
      loadP=null;
    })();
    return loadP;
  }

  function bladeStop() {
    if (!bladeSrc) return;
    const t=now();
    try { bladeGain.gain.cancelScheduledValues(t); bladeGain.gain.setValueAtTime(Math.max(0.0001,bladeGain.gain.value),t); bladeGain.gain.exponentialRampToValueAtTime(0.0001,t+0.12); } catch {}
    try { bladeSrc.stop(t+0.15); } catch {}
    bladeSrc=null; bladeGain=null; bladeFilter=null;
  }

  function playWooshDrop() {
    const buf=putuBuf||wooshBuf;
    if (!audioCtx||!buf) return;
    const at=now()+0.015;
    const src=audioCtx.createBufferSource();
    src.buffer=buf; src.loop=false;
    src.playbackRate.value=1.0;
    const g=audioCtx.createGain();
    g.gain.setValueAtTime(0.0001,at);
    g.gain.exponentialRampToValueAtTime(0.10,at+0.035);
    g.gain.setValueAtTime(0.06,at+buf.duration*0.5);
    g.gain.exponentialRampToValueAtTime(0.0001,at+buf.duration);
    src.connect(g);
    if (dry) g.connect(dry);
    else g.connect(fxBus);
    src.start(at);
    src.stop(at+buf.duration+0.05);
    wooshDropSrc=src;
  }

  function wooshSpinStart() {
    if (!audioCtx||!wooshBuf||wooshSpinSrc) return;
    wooshSpinPlaying=true;
    wooshSpinSrc=audioCtx.createBufferSource();
    wooshSpinSrc.buffer=wooshBuf; wooshSpinSrc.loop=true;
    wooshSpinSrc.loopStart=0.01; wooshSpinSrc.loopEnd=wooshBuf.duration-0.01;
    wooshSpinSrc.playbackRate.value=1.2;
    wooshSpinGain=audioCtx.createGain();
    const hp=audioCtx.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=1200;
    wooshSpinSrc.connect(hp); hp.connect(wooshSpinGain); wooshSpinGain.connect(fxBus);
    const at=now()+0.01;
    wooshSpinSrc.start(at);
    wooshSpinGain.gain.setValueAtTime(0.0001,at);
    wooshSpinGain.gain.exponentialRampToValueAtTime(0.065,at+0.35);
  }
  function wooshSpinStop() {
    if (!wooshSpinSrc||!wooshSpinGain) return;
    const t=now();
    wooshSpinGain.gain.cancelScheduledValues(t);
    wooshSpinGain.gain.setValueAtTime(Math.max(0.0001,wooshSpinGain.gain.value),t);
    wooshSpinGain.gain.exponentialRampToValueAtTime(0.0001,t+0.4);
    try { wooshSpinSrc.stop(t+0.45); } catch {}
    wooshSpinSrc=null; wooshSpinGain=null; wooshSpinPlaying=false;
  }
  function wooshSpinUpdate(spinW) {
    if (!wooshSpinSrc||!wooshSpinGain) return;
    const t=now();
    const rps=Math.max(0,spinW/(Math.PI*2)), norm=Math.min(1,rps/1.43);
    wooshSpinSrc.playbackRate.cancelScheduledValues(t);
    wooshSpinSrc.playbackRate.setTargetAtTime(0.6+norm*1.1,t,0.08);
    wooshSpinGain.gain.cancelScheduledValues(t);
    wooshSpinGain.gain.setTargetAtTime(0.015+norm*0.075,t,0.10);
  }

  function playWoobam() {
    if (!audioCtx||!woobamBuf||woobamFired) return;
    woobamFired=true;
    const at=now()+0.01;
    const src=audioCtx.createBufferSource();
    src.buffer=woobamBuf; src.loop=false;
    src.playbackRate.value=1.0;
    const g=audioCtx.createGain();
    g.gain.setValueAtTime(0.0001,at);
    g.gain.exponentialRampToValueAtTime(0.10,at+0.025);
    g.gain.setValueAtTime(0.30,at+woobamBuf.duration*0.4);
    g.gain.exponentialRampToValueAtTime(0.0001,at+woobamBuf.duration);
    src.connect(g); g.connect(fxBus);
    src.start(at);
  }

  function typen2Start() {
    if (!audioCtx||!typen2Buf||typen2Src) return;
    typen2Playing=true;
    typen2Src=audioCtx.createBufferSource();
    typen2Src.buffer=typen2Buf; typen2Src.loop=false;
    typen2Src.playbackRate.value=TYPEN2_RATE;
    const g=audioCtx.createGain();
    const at=now()+0.01;
    g.gain.setValueAtTime(0.0001,at);
    g.gain.exponentialRampToValueAtTime(0.28,at+0.035);
    const endAt=at+P_TAG_TYPING_DUR-0.18;
    g.gain.setValueAtTime(0.68,endAt);
    g.gain.exponentialRampToValueAtTime(0.0001,at+P_TAG_TYPING_DUR);
    typen2Src.connect(g); g.connect(fxBus);
    typen2Src.start(at);
    typen2Src.onended=()=>{ typen2Src=null; typen2Playing=false; };
  }

  const pent=[0,3,5,7,10,12,15,17];
  const mtof=(m)=>440*Math.pow(2,(m-69)/12);
  function dropletTone(at,midi,amp=0.078) {
    const osc=audioCtx.createOscillator(); osc.type="sine";
    osc.frequency.setValueAtTime(mtof(midi),at);
    const lp=audioCtx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=2200;
    const g=audioCtx.createGain(); g.gain.value=0.0001;
    osc.connect(lp); lp.connect(g); g.connect(fxBus);
    g.gain.setValueAtTime(0.0001,at); g.gain.exponentialRampToValueAtTime(amp,at+0.012);
    g.gain.exponentialRampToValueAtTime(0.0001,at+0.45);
    osc.start(at); osc.stop(at+0.6);
  }
  function crystalSweep(at,dur) {
    const osc=audioCtx.createOscillator(); osc.type="sine";
    const bp=audioCtx.createBiquadFilter(); bp.type="bandpass"; bp.Q.value=1.2;
    const g=audioCtx.createGain(); g.gain.value=0.0001;
    osc.connect(bp); bp.connect(g); g.connect(fxBus);
    osc.frequency.setValueAtTime(420,at); osc.frequency.exponentialRampToValueAtTime(2200,at+dur);
    bp.frequency.setValueAtTime(900,at); bp.frequency.exponentialRampToValueAtTime(3200,at+dur);
    g.gain.setValueAtTime(0.0001,at); g.gain.exponentialRampToValueAtTime(0.18,at+0.10);
    g.gain.exponentialRampToValueAtTime(0.0001,at+dur);
    osc.start(at); osc.stop(at+dur+0.05);
  }
  function finalChime(at) {
    const o1=audioCtx.createOscillator(), o2=audioCtx.createOscillator();
    o1.type="sine"; o2.type="sine";
    o1.frequency.setValueAtTime(3520,at); o2.frequency.setValueAtTime(5280,at);
    const hp=audioCtx.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=900;
    const g=audioCtx.createGain(); g.gain.value=0.0001;
    o1.connect(hp); o2.connect(hp); hp.connect(g); g.connect(fxBus);
    g.gain.setValueAtTime(0.0001,at); g.gain.exponentialRampToValueAtTime(0.01,at+0.004);
    g.gain.exponentialRampToValueAtTime(0.0001,at+1.6);
    o1.start(at); o2.start(at); o1.stop(at+1.8); o2.stop(at+1.8);
  }

  function scheduleOnce(key,fn) { if (fired.has(key)) return; fired.add(key); fn(); }

  function update(elapsed,spinW,tl) {
    if (!started||!audioCtx) return;
    const t=now();
    loadAll().catch(()=>{});
    bladeStop();

    if (elapsed>=tl.P_DROP_END&&elapsed<tl.P_SPIN_END) {
      if (wooshBuf) {
        if (!wooshSpinPlaying) wooshSpinStart();
        else wooshSpinUpdate(spinW);
      }
    }
    if (elapsed>=tl.P_SPIN_END&&wooshSpinPlaying) wooshSpinStop();

    if (elapsed>=tl.P_SLIDE_START&&!woobamFired) {
      if (woobamBuf) playWoobam();
    }

    if (elapsed>=tl.P_TAG_START&&!typen2Playing&&!fired.has("typen2")) {
      fired.add("typen2");
      if (typen2Buf) typen2Start();
    }

    if (elapsed>=tl.P_TIQ_START) {
      for (let i=0;i<8;i++) {
        scheduleOnce("tiq_"+i,()=>{
          const at=t+Math.max(0,(tl.P_TIQ_START+i*tl.P_TIQ_STAGGER-elapsed))+0.01;
          dropletTone(at,72+pent[i],0.078);
        });
      }
    }
    scheduleOnce("crystalSweep",()=>{
      const at=t+Math.max(0,(tl.P_SHIMMER_START-elapsed))+0.02;
      crystalSweep(at,tl.P_SHIMMER_DUR*0.98);
    });
    scheduleOnce("finalChime",()=>{
      const at=t+Math.max(0,(tl.P_SPARKLE_START-elapsed))+0.02;
      finalChime(at);
    });
  }

  function startOnGesture() {
    ensure();
    if (started) return;
    started=true;
    try { audioCtx.resume(); } catch {}
    loadAll().catch(()=>{});
  }

  async function tapAndDrop() {
    ensure();
    started=true;
    try { audioCtx.resume(); } catch {}
    await loadAll().catch(()=>{});
    playWooshDrop();
  }

  return { startOnGesture, tapAndDrop, update, get started() { return started; } };
})();

// ─── STATE ───────────────────────────────────────────────────
let phase='waiting', t0=null;

function getCoinIdlePos() {
  const sc=Math.min(W(),H())/600, rOut=124*sc;
  return { x:CX(), y:rOut*5+(W()>H()?0:20*sc) };
}

function hitTestCoin(px,py) {
  const lyt=layout(), pos=getCoinIdlePos(), rOut=lyt.rOut;
  const dx=px-pos.x, dy=py-pos.y;
  return (dx*dx+dy*dy)<=(rOut*rOut*1.35);
}

function handleTap(cx,cy) {
  if (phase!=='waiting') return;
  const rect=canvas.getBoundingClientRect();
  if (!hitTestCoin(cx-rect.left,cy-rect.top)) return;
  phase='animating';
  t0=null;
  AudioSystem.tapAndDrop().catch(()=>{});
}

canvas.addEventListener('pointerdown',(e)=>handleTap(e.clientX,e.clientY),{passive:true});
canvas.addEventListener('touchstart',(e)=>{ if(e.touches.length>0) handleTap(e.touches[0].clientX,e.touches[0].clientY); },{passive:true});
window.__startSplashAudio=()=>{ try{AudioSystem.startOnGesture();}catch{} return true; };

// ─── WAITING ────────────────────────────────────────────────
let waitingT0=performance.now();

function drawWaitingFrame(ts) {
  if (phase!=='waiting') return;
  const elapsed=(ts-waitingT0)/1000;
  const cx=CX(), cy=CY();

  // ✅ JEDYNE co robimy: czyścimy canvas do przezroczystości
  ctx.clearRect(0,0,W(),H());

  const lyt=layout(), sc=lyt.sc, pos=getCoinIdlePos();

  const APPEAR=1.4;
  const appearAlpha=clamp(elapsed/0.5,0,1);
  const appearY=lerp(-lyt.rOut*2.2,pos.y,easeOutQuart(clamp(elapsed/APPEAR,0,1)));

  const t=elapsed;
  const floatY = Math.sin(t*Math.PI*2*0.38)*5;
  const tiltAngle = Math.sin(t*Math.PI*2*0.22+1.2)*(1.5*Math.PI/180);
  const glowRaw = (Math.sin(t*Math.PI*2*0.31)+Math.sin(t*Math.PI*2*0.47+0.8))/2;
  const glowNorm = (glowRaw+1)/2;
  const glowBlur = lerp(15*sc,27*sc,glowNorm);

  const highlightAngle = t*Math.PI*2*0.125;
  const highlightAmp = (Math.sin(t*Math.PI*2*0.55+0.4)+1)/2*0.75+0.10;

  const coinDrawY=appearY+floatY;

  ctx.save();
  ctx.globalAlpha=appearAlpha;
  ctx.translate(pos.x, coinDrawY);
  ctx.rotate(tiltAngle);
  ctx.translate(-pos.x, -coinDrawY);
  drawRing(lyt,pos.x,coinDrawY,1,1,glowBlur,highlightAngle,highlightAmp);
  drawE(lyt,pos.x,coinDrawY,1,1);
  ctx.restore();

  requestAnimationFrame(drawWaitingFrame);
}

function notifyDone() {
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage('ANIMATION_DONE');
}

// ─── MAIN ANIMATION ──────────────────────────────────────────
function frame(ts) {
  if (phase!=='animating') { requestAnimationFrame(frame); return; }
  if (!t0) t0=ts;
  const elapsed=(ts-t0)/1000;

  if (elapsed>=P_FADE_END&&!frame.notified) { frame.notified=true; notifyDone(); }

  // ✅ brak rysowania tła — tło jest PNG (CSS), canvas transparent
  ctx.clearRect(0,0,W(),H());

  const lyt=layout(), sc=lyt.sc;
  const globalAlpha=elapsed>=P_PAUSE_END ? 1-clamp((elapsed-P_PAUSE_END)/P_FADE_DUR,0,1) : 1;
  if (globalAlpha<=0) { requestAnimationFrame(frame); return; }

  const cx=CX(), cy=CY();
  const idlePos=getCoinIdlePos();
  let ringDrawY=cy, dropAlpha=1;
  if (elapsed<P_DROP_END) {
    ringDrawY=lerp(idlePos.y,cy,easeOutQuart(clamp(elapsed/P_DROP_END,0,1)));
    dropAlpha=clamp(elapsed/0.25,0,1);
  }

  const spinT=clamp(elapsed-P_DROP_END,0,SPIN_DURATION);
  const ringScX=elapsed<P_SPIN_END ? Math.cos(spinAngle(ringAngleArr,spinT)) : 1;
  const eScX   =elapsed<P_SPIN_END ? Math.cos(spinAngle(eAngleArr,spinT))    : 1;

  let spinW=0;
  if (elapsed<P_SPIN_END) {
    const tN=clamp((spinT-DECEL_START)/(SPIN_DURATION-DECEL_START),0,1);
    spinW=W0*(1-smoothstep(tN));
  }

  try {
    if (AudioSystem&&AudioSystem.started) {
      AudioSystem.update(elapsed,spinW,{
        P_DROP_END,P_SPIN_END,P_SLIDE_START,P_SLIDE_END,
        P_TIQ_START,P_TIQ_STAGGER,P_SHIMMER_START,P_SHIMMER_DUR,
        P_SPARKLE_START,P_TAG_START,
      });
    }
  } catch(e) {
    try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage('AUDIO_ERR: '+(e?.message||e)); } catch {}
  }

  const ringCX=lerp(cx,lyt.ringFX,easeInOutQuart(clamp((elapsed-P_SLIDE_START)/(P_SLIDE_END-P_SLIDE_START),0,1)));

  let glowBlur=26*sc;
  if (elapsed>=P_SHIMMER_END) {
    const p=(Math.sin((elapsed-P_SHIMMER_END)*2*Math.PI*0.45)+1)/2;
    glowBlur=lerp(16*sc,36*sc,p);
  }

  ctx.save(); ctx.globalAlpha=globalAlpha;
  drawRing(lyt,ringCX,ringDrawY,ringScX,dropAlpha,glowBlur,0,0);
  drawE(lyt,ringCX,ringDrawY,eScX,dropAlpha);
  ctx.restore();

  if (elapsed>=P_TIQ_START) {
    const alphas=[],offsets=[];
    for (let i=0;i<8;i++) {
      const e=easeOut5(clamp((elapsed-P_TIQ_START-i*P_TIQ_STAGGER)/P_TIQ_DUR,0,1));
      alphas.push(e); offsets.push((1-e)*14*sc);
    }
    ctx.save(); ctx.globalAlpha=globalAlpha; drawTiquette(lyt,alphas,offsets); ctx.restore();
  }

  if (elapsed>=P_TAG_START) {
    const tagE=elapsed-P_TAG_START-0.0;
    const count=tagE<0?0:Math.floor(tagE/P_TAG_CHAR_MS);
    const done=count>=lyt.TLETTERS.length;
    const showCursor=elapsed<(done?P_TAG_END+1.5:Infinity);
    const cursorBlink=Math.floor(elapsed*1000/600)%2===0;
    ctx.save(); ctx.globalAlpha=globalAlpha;
    drawTagline(lyt,Math.min(count,lyt.TLETTERS.length),showCursor,cursorBlink);
    ctx.restore();
  }

  if (elapsed>=P_SHIMMER_START&&elapsed<P_SHIMMER_END) {
    const p=clamp((elapsed-P_SHIMMER_START)/P_SHIMMER_DUR,0,1);
    const a=globalAlpha*smoothstep(Math.min(p*6,1))*smoothstep(Math.min((1-p)*6,1));
    ctx.save(); drawShimmer(lyt,ringCX,cy,p,a); drawBeamUnderTiquette(lyt,p,a); ctx.restore();
  }

  if (elapsed>=P_SPARKLE_START&&elapsed<P_SPARKLE_END) {
    const t=clamp((elapsed-P_SPARKLE_START)/P_SPARKLE_DUR,0,1);
    const bloom=t<0.25?easeOut5(t/0.25):t<0.65?1:easeOut3(1-(t-0.65)/0.35);
    const pos=getSparklePos(lyt);
    drawSparkle(pos.x,pos.y,lyt.sc*16*bloom,globalAlpha*bloom*0.90);
  }

  requestAnimationFrame(frame);
}

// ─── BOOT ────────────────────────────────────────────────────
phase='waiting';
waitingT0=performance.now();

(function preWarm(){
  const onFirst = () => {
    try { AudioSystem.startOnGesture(); } catch {}
    window.removeEventListener('pointerdown', onFirst, true);
    window.removeEventListener('touchstart', onFirst, true);
  };
  window.addEventListener('pointerdown', onFirst, { capture:true, passive:true });
  window.addEventListener('touchstart', onFirst, { capture:true, passive:true });
})();

requestAnimationFrame(drawWaitingFrame);
requestAnimationFrame(frame);
</script>
</body>
</html>
`;

export default function EtiquetteSplashCanvas({ onFinished }: Props) {
  const webViewRef = useRef<WebView>(null);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      const [
        b64bg,
        b64woosh,
        b64woobam,
        b64putu,
        b64typen2,
      ] = await Promise.all([
        // ✅ tło PNG (wstaw swój docelowy path w assets)
        loadBase64FromModule(require("../assets/images/patesplash.png")).catch((e: any) => {
          console.log("[Splash] background png failed:", e?.message);
          return "";
        }),

        loadBase64FromModule(require("../assets/audio/wooshidl.mp3")).catch((e: any) => {
          console.log("[Splash] wooshidl failed:", e?.message);
          return "";
        }),
        loadBase64FromModule(require("../assets/audio/woobam.mp3")).catch((e: any) => {
          console.log("[Splash] woobam failed:", e?.message);
          return "";
        }),
        loadBase64FromModule(require("../assets/audio/putu.mp3")).catch((e: any) => {
          console.log("[Splash] putu failed:", e?.message);
          return "";
        }),
        loadBase64FromModule(require("../assets/audio/typen2.mp3")).catch((e: any) => {
          console.log("[Splash] typen2 failed:", e?.message);
          return "";
        }),
      ]);

      if (!alive) return;

      setHtml(
        HTML
          .replace("__BG_PNG_BASE64__", b64bg)
          .replace("__WOOSH_MP3_BASE64__", b64woosh)
          .replace("__WOOBAM_MP3_BASE64__", b64woobam)
          .replace("__TYPEN2_MP3_BASE64__", b64typen2)
          .replace("__PUTU_MP3_BASE64__", b64putu)
      );
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!html) return;
    SplashScreen.hideAsync().catch(() => {});
  }, [html]);

  const handleMessage = useCallback(
    (event: any) => {
      const msg = event?.nativeEvent?.data;
      if (msg === "ANIMATION_DONE") {
        onFinished?.();
        return;
      }
      if (typeof msg === "string") console.log("[SplashAudio]", msg);
    },
    [onFinished]
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <WebView
        ref={webViewRef}
        source={{ html: html ?? "<html><body style='background:transparent;'></body></html>" }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onMessage={handleMessage}
        originWhitelist={["*"]}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        // ✅ ważne: bez czarnego tła WebView
      
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  webview: { flex: 1, backgroundColor: "transparent" },
});