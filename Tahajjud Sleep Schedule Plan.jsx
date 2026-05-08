import { useState, useEffect } from "react";

// ─── Day config ────────────────────────────────────────────────────────────────
const DAYS = [
  {
    short:"MON", label:"Monday", icon:"💪", intensity:"high",
    type:"weekday",
    workout:"Push", muscle:"Chest · Shoulders · Triceps",
    run: null,
    gymTime:"6:00 PM", gymDur:"~60 min",
    gymNote:"Heavy compound pressing. Bench press, OHP, dips. 5 PM meal is your primary fuel — eat it all.",
    mealTime:"5:00 PM", mealNote:"Biggest meal. Carbs + protein to fuel the push session at 6 PM.",
  },
  {
    short:"TUE", label:"Tuesday", icon:"🏃", intensity:"highest",
    type:"weekday",
    workout:"Intervals + Pull", muscle:"HIIT Cardio + Back · Biceps",
    run: { time:"11:00 AM", end:"11:45 AM", label:"Interval Run", note:"Sprint 30s / walk 90s × 8 rounds. ~20-25 min active. Work break run — keep kit at the office or a bag ready the night before.", zone:"HIIT" },
    gymTime:"6:00 PM", gymDur:"~60 min",
    gymNote:"Pull session after work. Back, biceps, rows, pull-downs. You've already run midday — pace yourself on the pull, focus on form over weight.",
    mealTime:"5:00 PM", mealNote:"Critical fuel between run (11 AM) and pull session (6 PM). Biggest meal of the day — carbs + protein.",
  },
  {
    short:"WED", label:"Wednesday", icon:"🦵", intensity:"highest",
    type:"weekday",
    workout:"Legs", muscle:"Quads · Hamstrings · Glutes",
    run: null,
    gymTime:"6:00 PM", gymDur:"~70 min",
    gymNote:"Heaviest systemic load of the week. Squats, RDL, leg press, lunges. 5 PM meal is critical. Full 90-min post-Maghrib nap tonight is non-negotiable — CNS recovery.",
    mealTime:"5:00 PM", mealNote:"Your most important meal of the week. Carbs are essential before legs. Rice, potatoes, protein. Don't skip or go light.",
  },
  {
    short:"THU", label:"Thursday", icon:"🌿", intensity:"rest",
    type:"weekday",
    workout:"Rest", muscle:"Active recovery · mobility",
    run: null,
    gymTime:null, gymDur:null,
    gymNote:"No gym. Light walk, stretching, or mobility work if desired. Use the 6 PM slot for DeenSocial deep work — lowest fatigue of the week.",
    mealTime:"5:00 PM", mealNote:"Slightly smaller portion — caloric need is lower on rest day. Still prioritise protein for muscle repair from Wed legs.",
  },
  {
    short:"FRI", label:"Friday", icon:"💪", intensity:"moderate",
    type:"weekday",
    workout:"Arms", muscle:"Biceps · Triceps · Forearms",
    run: null,
    gymTime:"6:00 PM", gymDur:"~50 min",
    gymNote:"Isolation work, lowest systemic fatigue of the training week. Jumu'ah barakah into your session. Curl variations, tricep pushdowns, grip work.",
    mealTime:"5:00 PM", mealNote:"Standard pre-workout meal. Arms day has lower energy demands — moderate carbs + protein is sufficient.",
  },
  {
    short:"SAT", label:"Saturday", icon:"🏃", intensity:"moderate",
    type:"weekend",
    workout:"Easy Run + Chest & Back", muscle:"Cardio + Chest · Back compounds",
    run: { time:"6:45 AM", end:"7:30 AM", label:"Easy Run", note:"45 min at conversational pace. Zone 2 — you should be able to hold a sentence. Do this right after Fajr + DeenSocial work. The air is still, the barakah is fresh.", zone:"ZONE 2" },
    gymTime:"3:00 PM", gymDur:"~60 min",
    gymNote:"Chest and back compounds. Bench, rows, pull-ups. Weekend gym is at 3 PM — earlier than weekdays. Biggest meal shifts to 12:30 PM to fuel the 3 PM session.",
    mealTime:"12:30 PM", mealNote:"Weekend meal shift — biggest meal at 12:30 PM (2 hrs before 3 PM gym). Then light meal at 5 PM post-gym, light dinner at 8 PM.",
  },
  {
    short:"SUN", label:"Sunday", icon:"🏃", intensity:"high",
    type:"weekend",
    workout:"Long Run", muscle:"Cardiovascular endurance",
    run: { time:"6:30 AM", end:"8:00 AM", label:"Long Run", note:"60-90 min easy. Zone 2 the whole way — aerobic base building. Your hardest cardio of the week. Hydrate before you leave and carry water. The city is quiet and the morning is yours.", zone:"ZONE 2" },
    gymTime:null, gymDur:null,
    gymNote:"No gym today — long run is sufficient stimulus. Focus on recovery: full post-Maghrib nap, solid hydration all day, biggest meal at 12:30 PM.",
    mealTime:"12:30 PM", mealNote:"Post-run recovery meal. Biggest of the day — carbs to replenish glycogen, protein for repair. Eat within 90 min of finishing the run.",
  },
];

const IC = { highest:"#EF4444", high:"#F59E0B", moderate:"#10B981", rest:"#6366F1" };
const IL = { highest:"MAX LOAD", high:"HIGH", moderate:"MODERATE", rest:"RECOVERY" };

function toAMPM(m){ const n=((m%1440)+1440)%1440,h=Math.floor(n/60),mn=n%60; return `${h%12===0?12:h%12}:${String(mn).padStart(2,"0")} ${h>=12?"PM":"AM"}`; }
function toMins(s){ const [h,m]=s.split(":").map(Number); return h*60+m; }

function buildTimes(fajrRaw,maghribRaw,ishaRaw){
  const mag=toMins(maghribRaw);
  let fajr=toMins(fajrRaw); if(fajr<mag) fajr+=1440;
  const isha=toMins(ishaRaw);
  const nightDur=fajr-mag, third=Math.round(nightDur/3), lastThird=mag+2*third;
  const napEnd=mag+90, block1End=toMins("22:30")+180;
  const tahajjudStart=lastThird, tahajjudEnd=tahajjudStart+45;
  const block2End=tahajjudEnd+90, deenStart=fajr+15, deenEnd=deenStart+75;
  const block3Mins=Math.max(0,toMins("06:30")+1440-deenEnd);
  const totalSleep=90+180+90+block3Mins;
  return { mag,fajr,isha,nightDur,third,lastThird,napEnd,block1End,tahajjudStart,tahajjudEnd,block2End,deenStart,deenEnd,
    totalSleepHrs:(totalSleep/60).toFixed(1), lastThirdStr:toAMPM(lastThird),
    napEndStr:toAMPM(napEnd), nightHrs:(nightDur/60).toFixed(1), thirdStr:`${Math.floor(third/60)}h ${third%60}m`,
    tahajjudEndStr:toAMPM(tahajjudEnd), block2EndStr:toAMPM(block2End), deenEndStr:toAMPM(deenEnd),
  };
}

// ─── Timeline block builder per day ───────────────────────────────────────────
function getBlocks(day, t, pt) {
  const isWeekend = day.type === "weekend";
  const ic = IC[day.intensity];

  const always = [
    { time:"4:26 AM", label:"Fajr Prayer", icon:"🕌", color:"#D4A843", tag:"FARD", note:"Pray, make dhikr. If time allows, stay until sunrise — reward of full Hajj & Umrah (Hadith)." },
    { time:toAMPM(t.deenStart), dur:"75 min", label:"DeenSocial Work", icon:"✦", color:"#10B981", tag:"RIZQ", note:"Barakah window. Build your ummah platform before the world wakes up." },
    { time:toAMPM(t.deenEnd), dur:"~30 min", label:"Sleep · Block 3", icon:"😴", color:"#3B6EA8", tag:"REST", note:"Light recovery top-up." },
    { time:"6:30 AM", label:"Up · Shower · Ready", icon:"☀️", color:"#D97706", tag:"DAY", note: isWeekend ? "Weekend — you're already ahead. Run done or about to go." : "Shower, breakfast, out by 7:30 AM. At work by 8:00 AM." },
  ];

  const weekdayWork = [
    { time:"8:00 AM", dur:"~9 hrs", label:"Work", icon:"💼", color:"#6B7280", tag:"WORK", note:"Light snack mid-morning. Stay hydrated." },
  ];

  // Tuesday run at 11 AM
  const tuesdayRun = day.run && day.type === "weekday" ? [
    { time:day.run.time, dur:"45 min", label:day.run.label, icon:"🏃", color:ic, tag:day.run.zone, note:day.run.note },
    { time:"11:45 AM", label:"Back to Work", icon:"💼", color:"#6B7280", tag:"WORK", note:"Shower/freshen up if possible. Refuel with water." },
  ] : [];

  // Weekend early run
  const weekendRun = day.run && isWeekend ? [
    { time:day.run.time, dur: day.short==="SUN"?"~90 min":"~45 min", label:day.run.label, icon:"🏃", color:ic, tag:day.run.zone, note:day.run.note },
    { time:day.run.end, label:"Post-Run Recovery", icon:"🥤", color:"#10B981", tag:"REFUEL", note:"Rehydrate immediately. Light recovery snack — banana + protein within 30 min of finishing." },
    { time:"8:30 AM", dur: day.short==="SUN"?"~3.5 hrs":"~4 hrs", label:"DeenSocial / Rest / Quran", icon:"📖", color:"#7C6FCD", tag:"FREE", note:"Longer free block on weekends. Extend DeenSocial work, read Quran, rest. No commute." },
  ] : [];

  const meal = { time:day.mealTime, label: day.mealTime === "12:30 PM" ? "Main Meal (Weekend shift)" : "Biggest Meal", icon:"🍽️", color:"#10B981", tag:"FUEL", note:day.mealNote };

  const gymBlock = day.gymTime ? [
    { time:day.gymTime, dur:day.gymDur, label:`Gym · ${day.workout}`, icon:day.icon, color:ic, tag:IL[day.intensity], note:day.gymNote },
  ] : [
    { time: isWeekend ? "3:00 PM" : "6:00 PM", label:"Rest / Light Walk", icon:day.icon, color:ic, tag:"RECOVERY", note:day.gymNote },
  ];

  const eveningBlocks = [
    ...(isWeekend && day.gymTime ? [{ time:"5:00 PM", label:"Light Post-Workout Meal", icon:"🥗", color:"#6B7280", tag:"MEAL", note:"Post-gym protein + light carbs. Not the biggest — that was at 12:30 PM." }] : []),
    ...(!isWeekend ? [{ time:"8:00 PM", label:"Light Dinner", icon:"🥗", color:"#6B7280", tag:"MEAL", note:"Light protein + veg. Avoid heavy carbs before the nap — it will impair sleep quality." }] : [{ time:"8:00 PM", label:"Light Dinner", icon:"🥗", color:"#6B7280", tag:"MEAL", note:"Light protein + veg. Eating light improves nap quality — heavier digestion delays sleep onset." }]),
    { time:pt.maghrib, label:"Maghrib Prayer", icon:"🕌", color:"#7C6FCD", tag:"FARD", note:"Pray, then straight to nap. Don't linger on the phone." },
    { time:pt.maghrib, dur:"90 min", label:"Post-Maghrib Nap", icon:"🌙", color:"#1E3A6A", tag:"SUNNAH", note:`Sunnah rest. Full 90-min cycle ends ~${t.napEndStr}. ${day.intensity==="highest"?"MAX LOAD day — this nap is non-negotiable for CNS recovery.":"Set a gentle alarm. Go straight to sleep after Maghrib."}`},
    { time:pt.isha, label:"Isha Prayer", icon:"🕌", color:"#9B6FCD", tag:"FARD", note:"Make niyyah for tahajjud before closing your eyes." },
    { time:"10:30 PM", dur:"3 hrs", label:"Sleep · Block 1", icon:"🌑", color:"#1E3A6A", tag:"DEEP", note:"2 full NREM cycles. Deepest physical restoration." },
    { time:toAMPM(t.block1End), label:"Wake · Wudu", icon:"💧", color:"#4A9B8E", tag:"WUDU", note:`Last third opens ${t.lastThirdStr}. Use these minutes for wudu — entering the sacred window.` },
    { time:t.lastThirdStr, dur:"45 min", label:"Tahajjud + Muraqaba", icon:"🤲", color:"#D4A843", tag:"LAST THIRD", note:"Allah descends to the lowest heaven. 8 rakaat + witr, then 20 min muraqaba." },
    { time:t.tahajjudEndStr, dur:"90 min", label:"Sleep · Block 2", icon:"🌒", color:"#1E3A6A", tag:"REM", note:"REM-rich. Emotional regulation, creativity, performance. Never skip this." },
  ];

  if (isWeekend) {
    return [...always, ...weekendRun, meal, ...gymBlock, ...eveningBlocks];
  } else {
    return [...always, ...weekdayWork, ...tuesdayRun, meal, ...gymBlock, ...eveningBlocks];
  }
}

// ─── Timeline component ────────────────────────────────────────────────────────
function Timeline({ day, t, pt }) {
  const [open, setOpen] = useState(null);
  const blocks = getBlocks(day, t, pt);
  return (
    <div>
      {/* Day header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:`${IC[day.intensity]}08`, border:`1px solid ${IC[day.intensity]}22`, borderRadius:"12px", marginBottom:"18px" }}>
        <div>
          <div style={{ fontSize:"10px", letterSpacing:"2px", color:IC[day.intensity], marginBottom:"3px" }}>{IL[day.intensity]}</div>
          <div style={{ fontSize:"20px", color:"#F0E6D0" }}>{day.label}</div>
          <div style={{ fontSize:"12px", color:"#5A4A38", marginTop:"2px" }}>{day.muscle}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:"30px" }}>{day.icon}</div>
          <div style={{ fontSize:"10px", color:"#3A2E1A", marginTop:"2px", letterSpacing:"0.5px" }}>{day.workout}</div>
          <div style={{ fontSize:"10px", color:"#3A2E1A", marginTop:"1px" }}>{day.type === "weekend" ? "Weekend" : "Weekday"}</div>
        </div>
      </div>

      {/* Key times callout */}
      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"16px" }}>
        {[
          day.run && { label: day.type==="weekend" ? "Run" : "Midday Run", val: day.run.time, color:"#F59E0B" },
          day.gymTime && { label:"Gym", val:day.gymTime, color:IC[day.intensity] },
          { label:"Biggest Meal", val:day.mealTime, color:"#10B981" },
          { label:"Maghrib Nap", val:pt.maghrib, color:"#2E4A7A" },
          { label:"Tahajjud", val:t.lastThirdStr, color:"#D4A843" },
        ].filter(Boolean).map((item,i)=>(
          <div key={i} style={{ flex:"1 0 auto", minWidth:"80px", background:`${item.color}10`, border:`1px solid ${item.color}25`, borderRadius:"8px", padding:"7px 10px", textAlign:"center" }}>
            <div style={{ fontSize:"9px", color:"#3A2E1A", letterSpacing:"0.5px", marginBottom:"2px" }}>{item.label}</div>
            <div style={{ fontSize:"12px", color:item.color }}>{item.val}</div>
          </div>
        ))}
      </div>

      {/* Vertical line + blocks */}
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:"17px", top:"16px", bottom:"16px", width:"1px", background:"linear-gradient(to bottom, rgba(212,168,67,0.1), rgba(212,168,67,0.4) 50%, rgba(16,185,129,0.2))" }} />
        {blocks.map((b,i)=>(
          <div key={i} onClick={()=>setOpen(open===i?null:i)} style={{ display:"flex", gap:"12px", marginBottom:"8px", cursor:"pointer" }}>
            <div style={{ width:"34px", height:"34px", borderRadius:"50%", flexShrink:0, background:`${b.color}12`, border:`1px solid ${b.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", position:"relative", zIndex:1 }}>{b.icon}</div>
            <div style={{ flex:1, background:open===i?`${b.color}07`:"rgba(255,255,255,0.02)", border:`1px solid ${open===i?b.color+"28":"rgba(255,255,255,0.05)"}`, borderRadius:"9px", padding:"10px 13px", transition:"all 0.2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"2px" }}>
                    <span style={{ fontSize:"11px", color:b.color }}>{b.time}</span>
                    {b.dur && <span style={{ fontSize:"10px", color:"#3A2E18" }}>· {b.dur}</span>}
                  </div>
                  <div style={{ fontSize:"13.5px", color:"#EAD9C0" }}>{b.label}</div>
                </div>
                <div style={{ fontSize:"9px", color:b.color, background:`${b.color}10`, border:`1px solid ${b.color}20`, padding:"2px 6px", borderRadius:"7px", letterSpacing:"0.5px", whiteSpace:"nowrap", marginLeft:"8px", flexShrink:0 }}>{b.tag}</div>
              </div>
              {open===i && <div style={{ fontSize:"12px", color:"#5A4A38", lineHeight:"1.7", marginTop:"8px", paddingTop:"8px", borderTop:`1px solid ${b.color}15` }}>{b.note}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center", marginTop:"6px", fontSize:"10px", color:"#2A1E10", letterSpacing:"2px" }}>TAP ANY ROW TO EXPAND</div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function FullDayPlan() {
  const [pt, setPt] = useState({ fajr:"4:26 AM", maghrib:"8:38 PM", isha:"10:17 PM", sunrise:"6:04 AM", dateLabel:"Saint John, NB" });
  const [times, setTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState("loading");
  const [activeDay, setActiveDay] = useState(()=>{ const d=new Date().getDay(); return d===0?6:d-1; });
  const [tab, setTab] = useState("day");
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    async function load(){
      try{
        const d=new Date(), dd=String(d.getDate()).padStart(2,"0"), mm=String(d.getMonth()+1).padStart(2,"0");
        const res=await fetch(`https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${d.getFullYear()}?city=Saint%20John&country=CA&state=NB&method=2`);
        if(!res.ok) throw new Error();
        const json=await res.json(), t=json.data.timings;
        const fmt=(r)=>{ const[h,m]=r.split(":").map(Number); return `${h%12===0?12:h%12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`; };
        setPt({ fajr:fmt(t.Fajr), maghrib:fmt(t.Maghrib), isha:fmt(t.Isha), sunrise:fmt(t.Sunrise), dateLabel:d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}) });
        setTimes(buildTimes(t.Fajr,t.Maghrib,t.Isha));
        setLiveStatus("live");
      } catch {
        setTimes(buildTimes("04:26","20:38","22:17"));
        setLiveStatus("cached");
      }
      setLoading(false); setTimeout(()=>setVisible(true),80);
    }
    load();
  },[]);

  if(loading) return (
    <div style={{ minHeight:"100vh", background:"#08090F", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"14px" }}>
      <div style={{ width:"34px", height:"34px", border:"2px solid rgba(212,168,67,0.15)", borderTop:"2px solid #D4A843", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <div style={{ fontSize:"10px", color:"#3A2E18", letterSpacing:"3px" }}>LOADING PRAYER TIMES</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const ptForTimeline = {
    maghrib: pt.maghrib.replace(/ AM| PM/,""),
    isha: pt.isha.replace(/ AM| PM/,""),
    fajr: pt.fajr.replace(/ AM| PM/,""),
  };

  return (
    <div style={{ minHeight:"100vh", background:"#08090F", fontFamily:"'Palatino Linotype', Georgia, serif", color:"#DDD5C8" }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 70% 35% at 50% 0%, rgba(212,168,67,0.04) 0%, transparent 60%)" }} />
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes tw{from{opacity:0.05}to{opacity:0.45}}
        @keyframes pulse2{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.4)}}
        .tbtn{transition:all 0.18s;cursor:pointer;border:none;font-family:inherit;}
      `}</style>
      <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {Array.from({length:35}).map((_,i)=>(
          <div key={i} style={{ position:"absolute", borderRadius:"50%", width:i%8===0?"2px":"1px", height:i%8===0?"2px":"1px", background:i%5===0?"#D4A843":"#fff", left:`${(i*19+5)%100}%`, top:`${(i*11+3)%75}%`, opacity:0.06+(i%5)*0.05, animation:`tw ${2+i%3}s ease-in-out ${i*0.2}s infinite alternate` }} />
        ))}
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:"660px", margin:"0 auto", padding:"26px 14px 60px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"20px", opacity:visible?1:0, transition:"opacity 0.6s" }}>
          <div style={{ fontSize:"10px", letterSpacing:"5px", color:"#3A2E50", marginBottom:"7px" }}>FULL DAY ARCHITECTURE · LIVE</div>
          <h1 style={{ fontSize:"clamp(17px,4vw,27px)", fontWeight:"normal", color:"#F0E6D0", margin:"0 0 3px" }}>Islamic Life Plan</h1>
          <div style={{ fontSize:"11px", color:"#3A2E1A", marginBottom:"12px" }}>{pt.dateLabel}</div>

          {/* Live status */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"5px", padding:"4px 11px", border:`1px solid ${liveStatus==="live"?"rgba(16,185,129,0.3)":"rgba(212,168,67,0.3)"}`, borderRadius:"20px", fontSize:"10px", color:liveStatus==="live"?"#10B981":"#D4A843", marginBottom:"16px" }}>
            <span style={{ display:"inline-block", width:"5px", height:"5px", borderRadius:"50%", background:liveStatus==="live"?"#10B981":"#D4A843", animation:"pulse2 2s infinite" }} />
            {liveStatus==="live"?"Live · Aladhan API · ISNA · Saint John NB":"Cached · ISNA · Saint John NB"}
          </div>

          {/* Prayer strip */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"5px", marginBottom:"12px" }}>
            {[["Fajr",pt.fajr,"#D4A843"],["Sunrise",pt.sunrise,"#F59E0B"],["Maghrib",pt.maghrib,"#7C6FCD"],["Isha",pt.isha,"#9B6FCD"]].map(([n,v,c])=>(
              <div key={n} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"8px", padding:"8px 5px", textAlign:"center" }}>
                <div style={{ fontSize:"9px", color:"#3A2E1A", letterSpacing:"1px", marginBottom:"2px" }}>{n}</div>
                <div style={{ fontSize:"13px", color:c, fontWeight:"bold" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Sleep summary */}
          <div style={{ display:"flex", gap:"5px", justifyContent:"center", flexWrap:"wrap" }}>
            {[["Nap","90 min","#1E3A6A"],["Block 1","3 hrs","#1E3A6A"],["Block 2","1.5 hrs","#1E3A6A"],["Block 3","~30 min","#3B6EA8"],["Total",`${times?.totalSleepHrs} hrs`,"#D4A843"]].map(([l,v,c])=>(
              <div key={l} style={{ background:`${c}14`, border:`1px solid ${c}28`, borderRadius:"7px", padding:"5px 9px", textAlign:"center", minWidth:"60px" }}>
                <div style={{ fontSize:"9px", color:"#3A2E1A", marginBottom:"1px" }}>{l}</div>
                <div style={{ fontSize:"12px", color:c }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"3px", marginBottom:"16px", background:"rgba(255,255,255,0.02)", borderRadius:"9px", padding:"3px" }}>
          {[["day","Day View"],["week","Week Map"]].map(([t,l])=>(
            <button key={t} className="tbtn" onClick={()=>setTab(t)} style={{ flex:1, padding:"8px", borderRadius:"7px", fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", background:tab===t?"rgba(212,168,67,0.1)":"transparent", color:tab===t?"#D4A843":"#3A3028", border:tab===t?"1px solid rgba(212,168,67,0.2)":"1px solid transparent" }}>{l}</button>
          ))}
        </div>

        {/* Day selector */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px", marginBottom:"18px" }}>
          {DAYS.map((d,i)=>{
            const ic=IC[d.intensity];
            return (
              <button key={i} className="tbtn" onClick={()=>setActiveDay(i)} style={{ padding:"8px 2px", borderRadius:"8px", textAlign:"center", background:activeDay===i?`${ic}14`:"rgba(255,255,255,0.02)", border:activeDay===i?`1px solid ${ic}40`:"1px solid rgba(255,255,255,0.05)", color:activeDay===i?ic:"#3A2E1A" }}>
                <div style={{ fontSize:"9px", marginBottom:"3px" }}>{d.short}</div>
                <div style={{ fontSize:"14px" }}>{d.icon}</div>
                {d.run && <div style={{ fontSize:"8px", color:activeDay===i?ic:"#2A2010", marginTop:"2px" }}>run</div>}
              </button>
            );
          })}
        </div>

        {/* DAY VIEW */}
        {tab==="day" && times && (
          <div style={{ opacity:visible?1:0, transition:"opacity 0.5s" }}>
            <Timeline day={DAYS[activeDay]} t={times} pt={ptForTimeline} />
          </div>
        )}

        {/* WEEK MAP */}
        {tab==="week" && (
          <div style={{ opacity:visible?1:0, transition:"opacity 0.5s" }}>
            <div style={{ fontSize:"10px", letterSpacing:"3px", color:"#5A4E7A", marginBottom:"14px" }}>WEEKLY SCHEDULE AT A GLANCE</div>

            {DAYS.map((d,i)=>{
              const ic=IC[d.intensity];
              return (
                <div key={i} onClick={()=>{ setActiveDay(i); setTab("day"); }} style={{ padding:"12px 14px", background:"rgba(255,255,255,0.02)", border:`1px solid rgba(255,255,255,0.05)`, borderRadius:"10px", marginBottom:"7px", cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                      <div style={{ fontSize:"20px" }}>{d.icon}</div>
                      <div>
                        <div style={{ display:"flex", gap:"8px", alignItems:"center", marginBottom:"2px" }}>
                          <span style={{ fontSize:"14px", color:"#EAD9C0" }}>{d.label}</span>
                          <span style={{ fontSize:"9px", color:ic, background:`${ic}12`, border:`1px solid ${ic}20`, padding:"2px 6px", borderRadius:"6px" }}>{IL[d.intensity]}</span>
                        </div>
                        <div style={{ fontSize:"11px", color:"#4A3A28" }}>{d.workout} · {d.muscle}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:"10px", color:"#3A2E1A" }}>→</div>
                  </div>
                  {/* Time pills */}
                  <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                    {[
                      d.run && { label: d.type==="weekend"?"🏃 Run":"🏃 Run (11AM)", val: d.run.time, c:"#F59E0B" },
                      d.gymTime && { label:`💪 Gym`, val:d.gymTime, c:ic },
                      !d.gymTime && d.type!=="weekend" && { label:"🌿 Rest", val:"6:00 PM", c:"#6366F1" },
                      { label:"🍽️ Main meal", val:d.mealTime, c:"#10B981" },
                      { label:"🌙 Nap", val:pt.maghrib, c:"#2E4A7A" },
                      { label:"🤲 Tahajjud", val:times?.lastThirdStr||"1:50 AM", c:"#D4A843" },
                    ].filter(Boolean).map((p,j)=>(
                      <div key={j} style={{ fontSize:"10px", background:`${p.c}10`, border:`1px solid ${p.c}20`, color:p.c, padding:"3px 8px", borderRadius:"6px", whiteSpace:"nowrap" }}>
                        {p.label} {p.val}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop:"16px", padding:"14px 16px", background:"rgba(212,168,67,0.04)", border:"1px solid rgba(212,168,67,0.12)", borderRadius:"10px" }}>
              <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#D4A843", marginBottom:"10px" }}>◈ KEY DISTINCTIONS</div>
              {[
                ["Tuesday","Interval run at 11 AM (work break) + Pull at 6 PM. Two sessions — hardest total day. Full nap."],
                ["Wednesday","Legs only at 6 PM. Heaviest single session. Full nap, biggest meal mandatory."],
                ["Saturday","Easy run before 8 AM + Chest & Back at 3 PM. Biggest meal shifts to 12:30 PM."],
                ["Sunday","Long run before 8 AM only. No gym. Biggest meal at 12:30 PM post-run."],
                ["Thursday","Full rest. Use 6 PM window for extended DeenSocial or muraqaba."],
              ].map(([day,note],i)=>(
                <div key={i} style={{ display:"flex", gap:"10px", marginBottom:i<4?"10px":"0" }}>
                  <span style={{ color:"#D4A843", fontSize:"10px", flexShrink:0, marginTop:"2px" }}>◇</span>
                  <div><span style={{ fontSize:"12px", color:"#C8A870" }}>{day}</span><span style={{ fontSize:"12px", color:"#5A4A38" }}> — {note}</span></div>
                </div>
              ))}
            </div>

            <div style={{ textAlign:"center", marginTop:"20px", padding:"18px", borderTop:"1px solid rgba(212,168,67,0.1)" }}>
              <div style={{ fontSize:"13px", color:"#7A6A55", fontStyle:"italic", lineHeight:"1.9", marginBottom:"8px" }}>"The most beloved deeds to Allah are the most consistent ones, even if they are small."</div>
              <div style={{ fontSize:"10px", color:"#3A2E18", letterSpacing:"2px" }}>SAHIH AL-BUKHARI · 6465</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
