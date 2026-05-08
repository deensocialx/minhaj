import React, { useState } from 'react'
import { usePrayer } from '../context/PrayerContext'

const CAT = {
  prayer:    { label: 'Prayer',    dot: '#D4A843', badge: 'bg-[#D4A843]/15 text-[#D4A843]' },
  sleep:     { label: 'Sleep',     dot: '#818CF8', badge: 'bg-[#818CF8]/15 text-[#818CF8]' },
  exercise:  { label: 'Exercise',  dot: '#2ECC71', badge: 'bg-[#2ECC71]/15 text-[#2ECC71]' },
  work:      { label: 'Work',      dot: '#F59E0B', badge: 'bg-[#F59E0B]/15 text-[#F59E0B]' },
  nutrition: { label: 'Nutrition', dot: '#F97316', badge: 'bg-[#F97316]/15 text-[#F97316]' },
  spiritual: { label: 'Spiritual', dot: '#A78BFA', badge: 'bg-[#A78BFA]/15 text-[#A78BFA]' },
  recovery:  { label: 'Recovery',  dot: '#94A3B8', badge: 'bg-[#94A3B8]/15 text-[#94A3B8]' },
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_FOCUS = {
  0: 'Long Run',
  1: 'Push Day',
  2: 'Intervals + Pull',
  3: 'Leg Day',
  4: 'Rest & Recovery',
  5: 'Arms Day',
  6: 'Easy Run + Chest & Back',
}

function toSortMin(t) {
  if (!t) return 9999
  const [h, m] = t.split(':').map(Number)
  return (h < 6 ? h + 24 : h) * 60 + (m || 0)
}

function buildSchedule(dow, times) {
  const fajr     = times?.fajr     || '05:15'
  const sunrise  = times?.sunrise  || '06:48'
  const maghrib  = times?.maghrib  || '20:38'
  const isha     = times?.isha     || '22:05'
  const napEnd   = times?.napEnd   || '22:08'
  const lastThird = times?.lastThirdStart || '01:30'

  const isWeekend = [0, 6].includes(dow)

  const common = [
    {
      time: lastThird,
      end: '02:30',
      title: 'Tahajjud Prayer',
      category: 'prayer',
      brief: 'The night prayer — last third of the night',
      science: `Tahajjud timing aligns with the natural intrasleep awakening pattern documented in pre-industrial biphasic sleep research by historian Roger Ekirch (2005). His analysis of hundreds of pre-1800 European texts reveals that humans naturally woke mid-night, prayed, reflected, and slept again — exactly this structure.\n\nAt 1:30 AM melatonin is elevated but cortisol hasn't yet risen — the body is in deep physiological calm, making this one of the most neurologically quiet hours of the day. Prayer in this state strongly activates the parasympathetic nervous system. The Prophet ﷺ said: "The Lord descends every night to the lowest heaven when the last third of the night remains, and says: Who is calling upon Me that I may answer? Who is asking of Me that I may give?" (Bukhari & Muslim)`,
    },
    {
      time: '02:30',
      end: fajr,
      title: 'Sleep Block 2',
      category: 'sleep',
      brief: '~90 min · REM-dominant final phase',
      science: `The second half of the night is disproportionately rich in REM sleep. Dr. Matthew Walker (Why We Sleep, 2017) documents that REM cycles lengthen with each successive cycle — meaning this final block before Fajr contains your highest-quality REM of the night.\n\nREM sleep is critical for:\n• Emotional regulation (processing the day's experiences)\n• Procedural memory consolidation\n• Creative insight and problem-solving\n• Synaptic homeostasis\n\nBy completing your deep sleep quota in Block 1, this final block can fully devote itself to cognitive restoration. Waking naturally with Fajr — rather than an alarm mid-cycle — means you exit sleep near the natural cycle end, keeping sleep inertia minimal.`,
    },
    {
      time: fajr,
      title: 'Fajr Prayer',
      category: 'prayer',
      brief: 'Dawn prayer · The most virtuous of the five',
      science: `Rising for Fajr aligns precisely with the cortisol awakening response (CAR) — a 50–100% cortisol spike in the 20–30 minutes after waking that primes the immune system, upregulates metabolism, and sharpens cognition for the day ahead. This is the body's natural alarm system.\n\nCold wudu water further activates the sympathetic nervous system via thermoreceptors, accelerating full wakefulness without caffeine. The Prophet ﷺ said: "Whoever prays Fajr is under the protection of Allah." (Muslim)\n\nBeyond the spiritual — the discipline of rising at this hour, day after day, trains willpower through what psychologists call "implementation intentions" at the hardest time: sleep inertia.`,
    },
    {
      time: fajr,
      end: sunrise,
      title: 'Post-Fajr Dhikr',
      category: 'spiritual',
      brief: 'Until sunrise · Anchors the circadian clock',
      science: `This may be the most scientifically underappreciated spiritual practice in the entire routine. Light exposure in the first 30–60 minutes after sunrise directly resets the suprachiasmatic nucleus (SCN) — the brain's master circadian clock.\n\nResearch by Dr. Charles Czeisler at Harvard (1989, 2002) established that morning light signals to the SCN precisely determine melatonin onset 14–16 hours later. Sitting in dawn light while making dhikr is not just Sunnah — it is optimal circadian hygiene. Sleeping through this window delays melatonin offset, causing afternoon grogginess and poor sleep the following night.\n\nThe Prophet ﷺ disliked sleeping after Fajr prayer. Science now confirms why.`,
    },
    {
      time: '07:00',
      end: '09:00',
      title: 'DeenSocial Work Session',
      category: 'work',
      brief: 'Deep work · Peak cognitive window',
      science: `In the 2–4 hours after full waking, two things converge: adenosine (sleep pressure) is at its daily nadir, and dopamine + norepinephrine are rising sharply via the cortisol curve. This creates the ideal neurochemical environment for deep, focused work.\n\nDr. Andrew Huberman's research at Stanford confirms the post-sunrise window as optimal for high-cognitive tasks. Separately, Cal Newport's research on "deep work" shows that creative and analytical output follows Parkinson's Law — protect this window and it compounds over months into meaningful output.\n\nFor a side project like DeenSocial, consistency in this window beats occasional marathon sessions.`,
    },
    {
      time: isWeekend ? '10:00' : '12:00',
      end: isWeekend ? '12:30' : '17:00',
      title: isWeekend ? 'Biggest Meal (by 12:30 PM)' : 'Biggest Meal Window (by 5 PM)',
      category: 'nutrition',
      brief: isWeekend ? 'Weekend — front-load calories' : 'Weekday — largest meal before 17:00',
      science: `Insulin sensitivity follows a strict circadian rhythm, peaking in the morning and declining sharply after 3 PM. A landmark study by Jakubowicz et al. (2013) gave two groups identical calories — one group ate their largest meal at breakfast, the other at dinner. The breakfast group lost 2.5× more weight, had 58% lower insulin levels, and reported significantly less hunger.\n\nLate evening meals (after 8 PM) shift peripheral circadian clocks in the liver and adipose tissue out of sync with the SCN master clock. This circadian misalignment impairs metabolic regulation even when total caloric intake is identical.\n\nLight dinner is essential: a full stomach during the post-Maghrib nap suppresses deep sleep quality by activating digestive processes that compete with the rest cycle.`,
    },
    {
      time: maghrib,
      title: 'Maghrib Prayer',
      category: 'prayer',
      brief: 'Sunset prayer · Marks the circadian shift',
      science: `Maghrib coincides with a key circadian transition: as sunlight dims, photoreceptors in the retina signal the SCN to begin ramping up melatonin production. Core body temperature starts its descent, and the body begins preparing for sleep.\n\nThis is why the post-Maghrib nap is effective — you're not fighting biology, you're riding the body's natural melatonin initiation. Praying Maghrib punctuates the productive day and creates a deliberate transition ritual, which research on sleep hygiene shows significantly improves sleep onset.`,
    },
    {
      time: maghrib,
      end: napEnd,
      title: 'Post-Maghrib Nap',
      category: 'sleep',
      brief: `${maghrib} → ${napEnd} · 90 min · One full sleep cycle`,
      science: `90 minutes = one complete sleep cycle (NREM1 → NREM2 → NREM3 → REM). Waking at the end of a full cycle avoids sleep inertia — the groggy, disoriented state caused by interrupting mid-cycle.\n\nNASA research (Rosekind et al., 1995) found strategic napping improves alertness by 100% and performance by 34% in pilots. The specific 90-minute timing here is deliberate: it allows you to wake refreshed for Isha, complete the evening, then sleep again at 10:30 PM having already banked one full cycle of sleep pressure relief.\n\nThis nap is also the physiological bridge between the day and the modified biphasic night sleep that follows. Without it, fatigue accumulates to the point where tahajjud becomes impossible.`,
    },
    {
      time: isha,
      title: 'Isha Prayer',
      category: 'prayer',
      brief: 'Night prayer · Make niyyah for tahajjud',
      science: `Isha is the formal seal of the day. Making niyyah (firm intention) for tahajjud before sleeping is a powerful cognitive tool — research by Gollwitzer (1999) on implementation intentions shows that mentally pre-committing to a future action in specific terms ("I will wake at 1:30 AM and pray") increases follow-through by over 200% compared to vague goals.\n\nThis isn't mystical — it's how the brain's prefrontal cortex encodes future intentions into long-term memory during sleep, effectively "scheduling" the wake event as a priority task.`,
    },
    {
      time: '22:30',
      end: '01:30',
      title: 'Sleep Block 1',
      category: 'sleep',
      brief: '10:30 PM → 1:30 AM · Deep sleep dominant · 3 hours',
      science: `This is the most physically restorative block of the entire 24 hours. The first half of the night is disproportionately rich in slow-wave deep sleep (NREM3), the phase during which:\n\n• Human growth hormone is secreted in its largest daily pulse — critical for muscle repair and fat metabolism\n• The glymphatic system activates, flushing toxic metabolic waste (including beta-amyloid) from the brain (Xie et al., Science, 2013)\n• Immune cytokine production peaks, strengthening adaptive immunity\n• Long-term memory consolidation occurs\n\nSleeping at 10:30 PM captures the highest density of deep sleep, which clusters in cycles 1–2. Three hours (two full 90-min cycles) is sufficient to complete your entire deep sleep quota for the night, freeing Block 2 to be pure REM.`,
    },
    {
      time: '02:00',
      title: 'Muraqaba',
      category: 'spiritual',
      brief: 'Islamic contemplative awareness · 10–20 min',
      science: `Muraqaba (مُراقَبة — divine watchfulness) is a sustained practice of present-moment awareness in the presence of Allah. Neurologically, it activates the prefrontal cortex while downregulating the amygdala, reducing cortisol and shifting the nervous system toward parasympathetic dominance.\n\nResearch by Hölzel et al. (2011) in NeuroImage found that 8 weeks of mindfulness practice produced measurable increases in gray matter density in the hippocampus (memory), prefrontal cortex (decision-making), and posterior cingulate (self-awareness).\n\nPracticed at 2 AM — after tahajjud, when the parasympathetic nervous system is naturally dominant — this is one of the deepest states of neurological calm available. The Sufi tradition has practiced this for over a thousand years. Science is catching up.`,
    },
  ]

  const daySpecific = {
    0: [
      {
        time: '06:30',
        end: '08:00',
        title: 'Long Run',
        category: 'exercise',
        brief: 'Before 8 AM · Aerobic base building · 60–90 min',
        science: `Long Slow Distance (LSD) running targets Zone 1–2 intensity (<75% max HR), primarily oxidising fat as fuel. This trains mitochondrial biogenesis — the creation of new mitochondria within muscle cells — the fundamental mechanism of endurance improvement (Holloszy, 1967).\n\nDr. Stephen Seiler's research on elite endurance athletes shows ~80% of total training volume should be at low intensity for optimal long-term development. The remaining 20% high-intensity work (Tuesday intervals) provides the performance ceiling lift.\n\nSunday morning cortisol is naturally elevated and glycogen stores are restored — ideal for extended aerobic effort. Running before 8 AM also avoids heat buildup and leverages the fasted morning metabolic state.`,
      },
    ],
    1: [
      {
        time: '18:00',
        end: '19:30',
        title: 'Push — Chest · Shoulders · Triceps',
        category: 'exercise',
        brief: 'Evening gym · Exploit circadian strength peak',
        science: `Muscle force production, reaction time, and core body temperature all peak between 4–7 PM according to circadian physiology research (Chtourou & Souissi, Journal of Strength & Conditioning Research, 2012). This timing window produces measurably better strength performance than morning training.\n\nMonday's Push follows Sunday's complete rest day, meaning glycogen stores are maximally replenished and the nervous system is fully recovered. Chest, shoulders, and triceps share overlapping motor patterns and neuromuscular innervation — training them in the same session maximises mechanical tension, which is the primary driver of hypertrophy (Schoenfeld, 2010). The compound-to-isolation sequencing (bench → OHP → lateral raise → tricep pushdown) follows the principle of largest movement patterns first when neuromuscular output is highest.`,
      },
    ],
    2: [
      {
        time: '11:00',
        end: '11:45',
        title: 'Interval Run',
        category: 'exercise',
        brief: '11 AM · HIIT · 30–40 min',
        science: `HIIT at mid-morning captures the tail of the cortisol awakening response and a semi-fasted metabolic state (assuming a light pre-workout meal). Research by Trapp et al. (2008) found HIIT burns 3× more subcutaneous fat than steady-state cardio when matched for session time.\n\nHIIT also increases VO₂ max — the single best predictor of long-term health outcomes — more efficiently than volume training (Helgerud et al., Medicine & Science in Sports, 2007). Just 4 × 4-minute intervals at 90–95% max HR, twice per week, produced equivalent VO₂ max gains to 3× more moderate-intensity training.\n\nThe 6+ hour separation between this morning run and the evening Pull session allows full glycogen replenishment via the day's meals, so each session is independent and fully loaded.`,
      },
      {
        time: '18:00',
        end: '19:30',
        title: 'Pull — Back · Biceps',
        category: 'exercise',
        brief: 'Evening gym · Post-run · Antagonist to Monday',
        science: `Back and biceps are the posterior chain antagonists to Monday's push muscles. This push/pull alternation is fundamental to balanced muscular development — neglecting the pull pattern relative to push is the most common source of shoulder impingement and postural dysfunction in recreational lifters.\n\nEvening core body temperature is at its daily peak by 6 PM, improving joint mobility and muscle contractile efficiency. Post-interval run, the aerobic and glycolytic systems have had 7 hours to replenish, so lifting performance is not compromised. Compound pulls (deadlift, barbell row) before isolation work (cable row, curls) maintains quality of movement patterns when neuromuscular output is highest.`,
      },
    ],
    3: [
      {
        time: '18:00',
        end: '19:30',
        title: 'Legs — Quads · Hamstrings · Calves · Glutes',
        category: 'exercise',
        brief: 'Evening gym · Largest systemic stimulus',
        science: `Leg training generates the highest acute hormonal response of any training session — testosterone, growth hormone, and IGF-1 all spike significantly higher after heavy lower body work compared to upper body sessions. This systemic anabolic signal benefits the whole body, including muscle groups trained earlier in the week.\n\nScheduling legs mid-week (Wednesday) provides 48-hour separation from Monday's push and 72 hours before Saturday's next upper body work. The major compound movements (squat, Romanian deadlift, leg press) followed by isolation work (leg curl, calf raise) exploit the progressive fatigue curve — neurologically demanding movements when fresh, metabolic isolation work when fatigued.\n\nLegs are the largest muscle group. Training them is the single highest ROI session of the week.`,
      },
    ],
    4: [
      {
        time: '10:00',
        end: '11:00',
        title: 'Active Recovery',
        category: 'recovery',
        brief: 'Rest day · Walk, stretch, mobility work',
        science: `Strategic rest is not passive — it's when adaptation occurs. Supercompensation theory describes how the body, after a training stimulus, goes through: fatigue → recovery → supercompensation (returning above baseline). Rest days are the supercompensation phase.\n\nActive recovery (light walking, foam rolling, dynamic stretching, mobility work) accelerates lactate clearance and reduces delayed onset muscle soreness (DOMS) without impeding the structural repair process. Blood flow from light activity delivers nutrients to repairing tissue without creating new micro-damage.\n\nThursday's rest after three consecutive training days (Mon, Tue, Wed) is strategically placed to allow maximum recovery before the final push of Friday arms, Saturday run/chest, Sunday long run.`,
      },
    ],
    5: [
      {
        time: '18:00',
        end: '19:30',
        title: 'Arms — Biceps · Triceps · Forearms',
        category: 'exercise',
        brief: 'Evening gym · Accumulated pre-fatigue advantage',
        science: `Arms receive substantial indirect stimulus throughout the week — triceps from Monday Push, biceps from Tuesday Pull. This cumulative pre-fatigue means the muscles arrive on Friday already partially stimulated, requiring less absolute load to reach the growth threshold.\n\nResearch by Currier & Nelson (1992) showed that isolated arm training following compound movements produces superior hypertrophy to isolation training alone — the prior compound movements create metabolic stress and muscle damage that the isolation work then compounds.\n\nFriday placement also means arms have the entire weekend to recover before Monday's Push recruits triceps again. The evening time slot exploits the same circadian strength peak as Monday and Wednesday.`,
      },
    ],
    6: [
      {
        time: '06:30',
        end: '07:30',
        title: 'Easy Run',
        category: 'exercise',
        brief: 'Before 8 AM · Zone 2 · 30–45 min',
        science: `Zone 2 aerobic running (<75% max HR, conversational pace) primarily oxidises fat as fuel, improving metabolic flexibility — the ability to efficiently switch between fat and carbohydrate oxidation based on demand. Dr. Iñigo San Millán's research shows Zone 2 training is the most effective method for improving mitochondrial function in slow-twitch fibres.\n\nEarly morning fasted Zone 2 amplifies this effect: overnight fasting lowers insulin and glycogen, forcing the aerobic system to rely on fat oxidation, effectively training those metabolic pathways more intensely.\n\nCritically, Zone 2 does not deplete glycolytic stores needed for afternoon lifting — they use entirely different energy systems. Saturday's double session works because the morning run and afternoon gym are metabolically non-competing.`,
      },
      {
        time: '15:30',
        end: '17:00',
        title: 'Chest & Back Superset',
        category: 'exercise',
        brief: 'After 3 PM · Antagonist supersets · High density',
        science: `Chest and back are antagonistic muscle pairs — as the pecs contract concentrically (bench press), the lats perform eccentric work and vice versa (row). This antagonistic relationship means one can rest while the other works, enabling minimal rest periods without performance compromise.\n\nAntonist supersets increase training density (volume per unit time) by ~30–40% without sacrificing load. Research by Paz et al. (2017) found antagonist supersets produced equivalent strength gains to traditional sets but with significantly less total time.\n\nThe 8-hour separation from the morning easy run ensures full glycogen restoration via post-run meals. Peak body temperature at 3–5 PM provides the circadian strength advantage for maximal lifting performance.`,
      },
    ],
  }

  const all = [...common, ...(daySpecific[dow] || [])]
  return all.sort((a, b) => toSortMin(a.time) - toSortMin(b.time))
}

function TimelineItem({ item, isLast }) {
  const [open, setOpen] = useState(false)
  const cat = CAT[item.category]

  return (
    <div className="flex gap-4">
      {/* Time column */}
      <div className="w-14 flex-shrink-0 pt-1 text-right">
        <span className="text-xs font-medium text-[#6B7A8D]">{item.time}</span>
      </div>

      {/* Line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 z-10"
          style={{ backgroundColor: cat.dot }}
        />
        {!isLast && <div className="w-px flex-1 mt-1" style={{ backgroundColor: '#243044', minHeight: '32px' }} />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-5 min-w-0">
        <button
          className="w-full text-left"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`pill text-[10px] font-medium ${cat.badge}`}>{cat.label}</span>
                {item.end && (
                  <span className="text-[10px] text-[#4A5568]">→ {item.end}</span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#E8EDF2] mt-1">{item.title}</p>
              <p className="text-xs text-[#6B7A8D] mt-0.5 leading-relaxed">{item.brief}</p>
            </div>
            <div className={`flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${open ? 'bg-[#243044]' : ''}`}>
              <svg
                viewBox="0 0 12 12"
                className={`w-3 h-3 text-[#4A5568] transition-transform ${open ? 'rotate-180' : ''}`}
                fill="none"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </button>

        {open && (
          <div className="mt-3 bg-[#243044] rounded-xl p-4 border border-[#2E3D52]">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: cat.dot }} />
              <span className="text-xs font-semibold text-[#A0AABB] uppercase tracking-wider">The Science</span>
            </div>
            <div className="space-y-2">
              {item.science.split('\n\n').map((para, i) => (
                <p key={i} className="text-xs text-[#A0AABB] leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const SYSTEM_PRINCIPLES = [
  {
    title: 'Biphasic Sleep',
    icon: '🌙',
    desc: "This schedule is built on biphasic sleep — two sleep blocks separated by waking. Pre-industrial humans did this naturally. It's not a hack; it's recovering the default.",
  },
  {
    title: 'Deep Before REM',
    icon: '🧠',
    desc: 'Block 1 captures all your deep sleep (physical repair, growth hormone). Block 2 captures REM (emotional processing, memory). Each block serves a distinct biological function.',
  },
  {
    title: 'Circadian Alignment',
    icon: '☀️',
    desc: "Every element — meal timing, exercise slots, light exposure, prayer times — aligns with the body's natural hormonal rhythms rather than fighting them.",
  },
  {
    title: 'Nap as Architecture',
    icon: '⏱',
    desc: 'The 90-min post-Maghrib nap is structural, not optional. It completes one full sleep cycle, funds the tahajjud waking, and maintains alertness through Isha.',
  },
  {
    title: 'Sunnah as Bioscience',
    icon: '📖',
    desc: "Each sunnah practice in this schedule has now been confirmed by modern research: post-Fajr wakefulness for circadian reset, biphasic night sleep, fasting and meal timing, mindful contemplation.",
  },
]

export default function Plan() {
  const today = new Date().getDay()
  const [selectedDay, setSelectedDay] = useState(today)
  const { times } = usePrayer()

  const schedule = buildSchedule(selectedDay, times)

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[#E8EDF2]">Daily Blueprint</h2>
        <p className="text-sm text-[#6B7A8D] mt-0.5">The full architecture — every block, and why it works</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-all
              ${selectedDay === i
                ? 'bg-[#D4A843] border-[#D4A843] text-[#0F1621]'
                : i === today
                  ? 'border-[#D4A843]/50 text-[#D4A843] bg-transparent'
                  : 'border-[#243044] text-[#6B7A8D] bg-[#1E2A3A] hover:border-[#2E3D52] hover:text-[#A0AABB]'
              }`}
          >
            <span className="text-[10px] font-medium">{d}</span>
          </button>
        ))}
      </div>

      {/* Day header */}
      <div className="card py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-[#E8EDF2]">{DAY_LABELS[selectedDay]}</p>
            <p className="text-sm text-[#D4A843] mt-0.5">{DAY_FOCUS[selectedDay]}</p>
          </div>
          {selectedDay === today && (
            <span className="pill bg-[#2ECC71]/15 text-[#2ECC71] text-xs font-medium">Today</span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="card pt-5 pb-2">
        <p className="label-sm mb-5">Full Day Timeline</p>
        <div className="space-y-0">
          {schedule.map((item, i) => (
            <TimelineItem
              key={`${item.time}-${item.title}`}
              item={item}
              isLast={i === schedule.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <p className="label-sm mb-3">Categories</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CAT).map(([key, val]) => (
            <span key={key} className={`pill text-xs ${val.badge}`}>{val.label}</span>
          ))}
        </div>
      </div>

      {/* System principles */}
      <div className="card space-y-4">
        <p className="label-sm">System Principles</p>
        {SYSTEM_PRINCIPLES.map((p) => (
          <div key={p.title} className="flex gap-3">
            <span className="text-lg flex-shrink-0 mt-0.5">{p.icon}</span>
            <div>
              <p className="text-sm font-semibold text-[#E8EDF2]">{p.title}</p>
              <p className="text-xs text-[#6B7A8D] mt-0.5 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sources note */}
      <p className="text-xs text-[#4A5568] text-center pb-2 leading-relaxed">
        References: Ekirch (2005), Walker (2017), Czeisler (1989), Schoenfeld (2010), Chtourou & Souissi (2012),
        Rosekind et al. (1995), Hölzel et al. (2011), Trapp et al. (2008), Jakubowicz et al. (2013), Holloszy (1967)
      </p>
    </div>
  )
}
