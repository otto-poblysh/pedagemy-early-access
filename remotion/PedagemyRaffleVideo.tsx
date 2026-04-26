import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion"

const REMOTION_BLUE = "#0B84F3"
const REMOTION_INK = "#282A36"
const PAPER = "#F8FAFC"
const LINE = "#EAEAEA"
const PEDAGEMY_BLUE = "#0056D2"
const GREEN = "#00B894"
const GOLD = "#F7B731"
const RED = "#E74C3C"

const programs = [
  {
    title: "Soft Skills Accelerator",
    value: "$300",
    benefit: "Build the modern workplace range employers reward.",
    topics: ["Leadership", "Communication", "AI literacy", "Productivity"],
    color: REMOTION_BLUE,
  },
  {
    title: "Tech Career Launchpad",
    value: "$325",
    benefit: "Move toward technical roles with hands-on practice.",
    topics: ["Python", "SQL", "Cloud", "Cybersecurity"],
    color: GREEN,
  },
  {
    title: "Leadership Accelerator",
    value: "$70",
    benefit: "Lead yourself, your team, and the business with confidence.",
    topics: ["Executive presence", "Strategy", "Coaching", "Decision-making"],
    color: GOLD,
  },
  {
    title: "Workplace Readiness",
    value: "$60",
    benefit: "Understand the rules and responsibilities of modern work.",
    topics: ["Ethics", "Data privacy", "Safety", "Compliance"],
    color: RED,
  },
]

const steps = [
  "Choose the programme that fits your next career move.",
  "Complete the short registration form in under 2 minutes.",
  "Tell Pedagemy why this programme matters to your goals.",
  "Selected candidates receive access instructions directly.",
]

type SceneProps = {
  start: number
  duration: number
  children: (localFrame: number) => React.ReactNode
}

export function PedagemyRaffleVideo() {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  return (
    <AbsoluteFill style={styles.stage}>
      <Background />
      <BrandBar />
      <Progress frame={frame} duration={durationInFrames} />

      <Scene start={0} duration={210}>
        {(localFrame) => <Opening localFrame={localFrame} />}
      </Scene>

      <Scene start={180} duration={270}>
        {(localFrame) => <RaffleValue localFrame={localFrame} />}
      </Scene>

      <Scene start={420} duration={330}>
        {(localFrame) => <RegistrationGuide localFrame={localFrame} />}
      </Scene>

      <Scene start={720} duration={570}>
        {(localFrame) => <ProgramHighlights localFrame={localFrame} />}
      </Scene>

      <Scene start={1260} duration={270}>
        {(localFrame) => <Benefits localFrame={localFrame} />}
      </Scene>

      <Scene start={1500} duration={300}>
        {(localFrame) => <Closing localFrame={localFrame} />}
      </Scene>
    </AbsoluteFill>
  )
}

function Scene({ start, duration, children }: SceneProps) {
  const frame = useCurrentFrame()
  const localFrame = frame - start
  const opacity = interpolate(
    frame,
    [start, start + 20, start + duration - 25, start + duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  const y = interpolate(frame, [start, start + 30], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  if (localFrame < -30 || localFrame > duration + 30) return null

  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${y}px)` }}>
      {children(localFrame)}
    </AbsoluteFill>
  )
}

function Background() {
  const frame = useCurrentFrame()
  const drift = interpolate(frame, [0, 1800], [0, 1])

  return (
    <AbsoluteFill style={styles.background}>
      <div
        style={{
          ...styles.grid,
          transform: `translateX(${-80 * drift}px) translateY(${-45 * drift}px)`,
        }}
      />
      <div style={{ ...styles.bluePanel, transform: `translateX(${28 * drift}px)` }} />
      <div style={{ ...styles.darkPanel, transform: `translateY(${-40 * drift}px)` }} />
    </AbsoluteFill>
  )
}

function BrandBar() {
  return (
    <div style={styles.brandBar}>
      <Img src={staticFile("pedagemy-logo.png")} style={styles.logo} />
      <div style={styles.brandDivider} />
      <span style={styles.brandText}>Pedagemy Raffle</span>
    </div>
  )
}

function Progress({ frame, duration }: { frame: number; duration: number }) {
  const width = interpolate(frame, [0, duration], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  return (
    <div style={styles.progressTrack}>
      <div style={{ ...styles.progressFill, width: `${width}%` }} />
    </div>
  )
}

function Opening({ localFrame }: { localFrame: number }) {
  const scale = spring({
    frame: Math.max(localFrame - 12, 0),
    fps: 30,
    config: { damping: 18, stiffness: 90 },
  })

  return (
    <AbsoluteFill style={styles.centerLayout}>
      <Kicker>Fully sponsored early access</Kicker>
      <h1 style={styles.heroTitle}>
        Win premium learning access worth up to{" "}
        <span style={styles.heroAccent}>$755</span>
      </h1>
      <p style={styles.heroSubcopy}>
        Four career-building programmes curated by iCUBEFARM. No payment
        required. Selected candidates are contacted directly.
      </p>
      <div style={{ ...styles.heroPillRow, transform: `scale(${scale})` }}>
        <Pill label="Applications open" color={GREEN} />
        <Pill label="Deadline: Friday, May 15, 2026" color={REMOTION_BLUE} />
        <Pill label="Open to ready learners" color={GOLD} />
      </div>
    </AbsoluteFill>
  )
}

function RaffleValue({ localFrame }: { localFrame: number }) {
  const count = Math.round(
    interpolate(localFrame, [25, 90], [0, 755], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  )

  return (
    <AbsoluteFill style={styles.splitLayout}>
      <div style={styles.leftColumn}>
        <Kicker>What is the Pedagemy Raffle?</Kicker>
        <h2 style={styles.sectionTitle}>
          A chance to access the same professional training organisations buy
          for employee growth.
        </h2>
        <p style={styles.bodyText}>
          Register free, choose one programme, and show how it aligns with your
          next career goal.
        </p>
      </div>
      <div style={styles.valueCard}>
        <span style={styles.valueLabel}>Potential sponsored value</span>
        <strong style={styles.valueNumber}>${count}</strong>
        <div style={styles.valueBars}>
          {programs.map((program, index) => (
            <div key={program.title} style={styles.valueBarRow}>
              <span style={styles.valueBarLabel}>{program.title}</span>
              <div style={styles.valueBarTrack}>
                <div
                  style={{
                    ...styles.valueBarFill,
                    width: `${interpolate(localFrame, [40 + index * 9, 105 + index * 9], [0, 100], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })}%`,
                    backgroundColor: program.color,
                  }}
                />
              </div>
              <b style={styles.valueBarAmount}>{program.value}</b>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}

function RegistrationGuide({ localFrame }: { localFrame: number }) {
  return (
    <AbsoluteFill style={styles.workflowLayout}>
      <div style={styles.workflowHeader}>
        <Kicker>How to register</Kicker>
        <h2 style={styles.sectionTitle}>One focused form. Four clear moves.</h2>
      </div>
      <div style={styles.stepGrid}>
        {steps.map((step, index) => {
          const active = localFrame > 35 + index * 45
          const enter = interpolate(
            localFrame,
            [10 + index * 20, 40 + index * 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
          return (
            <div
              key={step}
              style={{
                ...styles.stepCard,
                opacity: enter,
                transform: `translateY(${(1 - enter) * 30}px)`,
                borderColor: active ? REMOTION_BLUE : LINE,
              }}
            >
              <span
                style={{
                  ...styles.stepNumber,
                  backgroundColor: active ? REMOTION_BLUE : LINE,
                  color: active ? "#fff" : REMOTION_INK,
                }}
              >
                0{index + 1}
              </span>
              <p style={styles.stepText}>{step}</p>
            </div>
          )
        })}
      </div>
      <FormMockup localFrame={localFrame} />
    </AbsoluteFill>
  )
}

function FormMockup({ localFrame }: { localFrame: number }) {
  const fill = interpolate(localFrame, [80, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div style={styles.formMockup}>
      <div style={styles.formHeader}>
        <span>Registration form</span>
        <small>Under 2 minutes</small>
      </div>
      {["Full name", "Email address", "Phone number", "Programme"].map(
        (label, index) => (
          <div key={label} style={styles.inputRow}>
            <span>{label}</span>
            <div style={styles.inputTrack}>
              <div
                style={{
                  ...styles.inputFill,
                  width: `${Math.min(100, Math.max(0, fill * 120 - index * 18))}%`,
                }}
              />
            </div>
          </div>
        )
      )}
      <div style={styles.submitButton}>Submit Application</div>
    </div>
  )
}

function ProgramHighlights({ localFrame }: { localFrame: number }) {
  const activeIndex = Math.min(3, Math.floor(Math.max(localFrame, 0) / 135))
  const program = programs[activeIndex] ?? programs[0]!
  const sweep = interpolate(localFrame % 135, [0, 120], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill style={styles.programLayout}>
      <div style={styles.programHeader}>
        <Kicker>Programme highlights</Kicker>
        <h2 style={styles.sectionTitle}>Pick the path that moves you forward.</h2>
      </div>
      <div style={styles.programTabs}>
        {programs.map((item, index) => (
          <div
            key={item.title}
            style={{
              ...styles.programTab,
              borderColor: index === activeIndex ? item.color : LINE,
              color: index === activeIndex ? item.color : "#6B7280",
            }}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div style={styles.programFocus}>
        <div style={{ ...styles.programGlow, backgroundColor: program.color }} />
        <div style={styles.programCopy}>
          <span style={{ ...styles.programValue, color: program.color }}>
            Sponsored access value {program.value}
          </span>
          <h3 style={styles.programTitle}>{program.title}</h3>
          <p style={styles.programBenefit}>{program.benefit}</p>
          <div style={styles.topicGrid}>
            {program.topics.map((topic, index) => (
              <div key={topic} style={styles.topic}>
                <span
                  style={{
                    ...styles.topicDot,
                    backgroundColor: index % 2 ? REMOTION_BLUE : program.color,
                  }}
                />
                {topic}
              </div>
            ))}
          </div>
        </div>
        <div style={styles.orbitCard}>
          <div
            style={{
              ...styles.ring,
              borderColor: program.color,
              transform: `rotate(${sweep * 2.7}deg)`,
            }}
          />
          <div style={styles.orbitCenter}>
            <strong>{activeIndex + 1}/4</strong>
            <span>career path</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

function Benefits({ localFrame }: { localFrame: number }) {
  const benefits = [
    ["No payment step", "Apply free and wait for selection updates."],
    ["Career-relevant topics", "AI, leadership, compliance, tech, and workplace skills."],
    ["Professional providers", "Skillsoft, Codecademy, and iCUBEFARM curriculum."],
  ]

  return (
    <AbsoluteFill style={styles.benefitsLayout}>
      <Kicker>Why apply now?</Kicker>
      <h2 style={styles.sectionTitle}>This is the access window before the door gets crowded.</h2>
      <div style={styles.benefitGrid}>
        {benefits.map(([title, body], index) => {
          const enter = interpolate(localFrame, [20 + index * 25, 55 + index * 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
          return (
            <div
              key={title}
              style={{
                ...styles.benefitCard,
                opacity: enter,
                transform: `translateX(${(1 - enter) * -35}px)`,
              }}
            >
              <span style={styles.benefitMark}>{index + 1}</span>
              <h3 style={styles.benefitTitle}>{title}</h3>
              <p style={styles.benefitBody}>{body}</p>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

function Closing({ localFrame }: { localFrame: number }) {
  const pulse = interpolate(localFrame % 60, [0, 30, 60], [1, 1.035, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill style={styles.closingLayout}>
      <Img src={staticFile("pedagemy-logo.png")} style={styles.closingLogo} />
      <h2 style={styles.closingTitle}>Register to win by Friday, May 15, 2026</h2>
      <p style={styles.closingBody}>
        Choose your programme, tell us your goal, and take the first step toward
        sponsored professional learning.
      </p>
      <div style={{ ...styles.cta, transform: `scale(${pulse})` }}>
        Apply on the Pedagemy page
      </div>
      <p style={styles.contact}>Questions: training@icubefarm.com</p>
    </AbsoluteFill>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div style={styles.kicker}>{children}</div>
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ ...styles.pill, borderColor: color }}>
      <span style={{ ...styles.pillDot, backgroundColor: color }} />
      {label}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  stage: {
    backgroundColor: PAPER,
    color: REMOTION_INK,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: "hidden",
  },
  background: {
    background: `linear-gradient(135deg, ${PAPER} 0%, #FFFFFF 48%, #EEF6FF 100%)`,
  },
  grid: {
    position: "absolute",
    inset: -120,
    backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px), linear-gradient(90deg, ${LINE} 1px, transparent 1px)`,
    backgroundSize: "80px 80px",
    opacity: 0.5,
  },
  bluePanel: {
    position: "absolute",
    right: -150,
    top: -220,
    width: 780,
    height: 780,
    borderRadius: 120,
    background: REMOTION_BLUE,
    opacity: 0.13,
    rotate: "18deg",
  },
  darkPanel: {
    position: "absolute",
    left: -240,
    bottom: -260,
    width: 820,
    height: 620,
    borderRadius: 110,
    background: REMOTION_INK,
    opacity: 0.08,
    rotate: "-10deg",
  },
  brandBar: {
    position: "absolute",
    top: 42,
    left: 70,
    right: 70,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: 20,
    height: 58,
  },
  logo: {
    width: 210,
    height: 58,
    objectFit: "contain",
    objectPosition: "left center",
  },
  brandDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#C9D5E5",
  },
  brandText: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 0,
    color: REMOTION_INK,
  },
  progressTrack: {
    position: "absolute",
    left: 70,
    right: 70,
    bottom: 42,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#DCE5EF",
    overflow: "hidden",
    zIndex: 20,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: `linear-gradient(90deg, ${REMOTION_BLUE}, ${PEDAGEMY_BLUE})`,
  },
  centerLayout: {
    alignItems: "center",
    justifyContent: "center",
    padding: "130px 150px",
    textAlign: "center",
  },
  heroTitle: {
    margin: "28px 0 0",
    maxWidth: 1300,
    fontSize: 104,
    lineHeight: 0.95,
    fontWeight: 900,
    letterSpacing: 0,
  },
  heroAccent: {
    color: REMOTION_BLUE,
  },
  heroSubcopy: {
    margin: "34px 0 0",
    maxWidth: 980,
    fontSize: 34,
    lineHeight: 1.35,
    color: "#4B5563",
    fontWeight: 500,
  },
  heroPillRow: {
    display: "flex",
    gap: 18,
    marginTop: 56,
  },
  kicker: {
    display: "inline-flex",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: "12px 18px",
    border: `1px solid ${LINE}`,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    color: REMOTION_BLUE,
    fontSize: 19,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "13px 18px",
    border: "2px solid",
    borderRadius: 999,
    backgroundColor: "#fff",
    fontSize: 20,
    fontWeight: 800,
  },
  pillDot: {
    width: 11,
    height: 11,
    borderRadius: 99,
  },
  splitLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 720px",
    gap: 86,
    alignItems: "center",
    padding: "150px 140px 120px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sectionTitle: {
    margin: "26px 0 0",
    fontSize: 64,
    lineHeight: 1.03,
    fontWeight: 900,
    letterSpacing: 0,
    maxWidth: 980,
  },
  bodyText: {
    margin: "28px 0 0",
    fontSize: 31,
    lineHeight: 1.42,
    color: "#4B5563",
    maxWidth: 840,
  },
  valueCard: {
    backgroundColor: "#FFFFFF",
    border: `1px solid ${LINE}`,
    borderRadius: 24,
    padding: 46,
    boxShadow: "0 34px 90px rgba(40, 42, 54, 0.14)",
  },
  valueLabel: {
    display: "block",
    color: "#6B7280",
    fontSize: 22,
    fontWeight: 800,
  },
  valueNumber: {
    display: "block",
    marginTop: 10,
    color: REMOTION_BLUE,
    fontSize: 128,
    lineHeight: 1,
    fontWeight: 950,
  },
  valueBars: {
    display: "grid",
    gap: 22,
    marginTop: 42,
  },
  valueBarRow: {
    display: "grid",
    gridTemplateColumns: "210px 1fr 70px",
    alignItems: "center",
    gap: 16,
  },
  valueBarLabel: {
    fontSize: 18,
    lineHeight: 1.15,
    fontWeight: 800,
  },
  valueBarTrack: {
    height: 14,
    backgroundColor: "#E8EEF6",
    borderRadius: 999,
    overflow: "hidden",
  },
  valueBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  valueBarAmount: {
    fontSize: 20,
    textAlign: "right",
  },
  workflowLayout: {
    padding: "142px 140px 116px",
  },
  workflowHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  stepGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 22,
    marginTop: 54,
  },
  stepCard: {
    minHeight: 210,
    padding: 28,
    border: "2px solid",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 18px 44px rgba(40, 42, 54, 0.08)",
  },
  stepNumber: {
    display: "grid",
    placeItems: "center",
    width: 58,
    height: 58,
    borderRadius: 16,
    fontSize: 20,
    fontWeight: 950,
  },
  stepText: {
    marginTop: 26,
    fontSize: 25,
    lineHeight: 1.25,
    fontWeight: 850,
  },
  formMockup: {
    position: "absolute",
    right: 140,
    bottom: 105,
    width: 660,
    padding: 28,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    border: `1px solid ${LINE}`,
    boxShadow: "0 34px 90px rgba(40, 42, 54, 0.16)",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    fontSize: 25,
    fontWeight: 900,
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "165px 1fr",
    alignItems: "center",
    gap: 16,
    marginTop: 18,
    color: "#64748B",
    fontSize: 18,
    fontWeight: 800,
  },
  inputTrack: {
    height: 36,
    borderRadius: 9,
    backgroundColor: "#EEF3F8",
    overflow: "hidden",
  },
  inputFill: {
    height: "100%",
    backgroundColor: "#D4E8FF",
    borderRadius: 9,
  },
  submitButton: {
    marginTop: 24,
    height: 52,
    display: "grid",
    placeItems: "center",
    borderRadius: 10,
    backgroundColor: REMOTION_BLUE,
    color: "#fff",
    fontSize: 19,
    fontWeight: 900,
  },
  programLayout: {
    padding: "140px 120px 112px",
  },
  programHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  programTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
    marginTop: 34,
  },
  programTab: {
    border: "2px solid",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: "18px 20px",
    fontSize: 20,
    lineHeight: 1.1,
    fontWeight: 900,
    textAlign: "center",
  },
  programFocus: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1fr 500px",
    alignItems: "center",
    gap: 70,
    marginTop: 44,
    minHeight: 430,
    padding: 48,
    borderRadius: 28,
    border: `1px solid ${LINE}`,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 30px 80px rgba(40, 42, 54, 0.12)",
    overflow: "hidden",
  },
  programGlow: {
    position: "absolute",
    right: -180,
    top: -180,
    width: 520,
    height: 520,
    borderRadius: 520,
    opacity: 0.16,
  },
  programCopy: {
    position: "relative",
    zIndex: 2,
  },
  programValue: {
    fontSize: 25,
    fontWeight: 950,
  },
  programTitle: {
    margin: "16px 0 0",
    fontSize: 70,
    lineHeight: 0.98,
    fontWeight: 950,
    letterSpacing: 0,
  },
  programBenefit: {
    margin: "24px 0 0",
    maxWidth: 800,
    fontSize: 31,
    lineHeight: 1.3,
    color: "#4B5563",
  },
  topicGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginTop: 30,
    maxWidth: 760,
  },
  topic: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 18px",
    borderRadius: 14,
    backgroundColor: "#F4F7FB",
    fontSize: 22,
    fontWeight: 850,
  },
  topicDot: {
    width: 11,
    height: 11,
    borderRadius: 99,
    flex: "0 0 auto",
  },
  orbitCard: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    placeItems: "center",
    width: 420,
    height: 420,
    justifySelf: "center",
  },
  ring: {
    position: "absolute",
    inset: 18,
    borderRadius: 999,
    border: "15px solid",
    borderLeftColor: "transparent",
    borderBottomColor: "#E8EEF6",
  },
  orbitCenter: {
    display: "grid",
    placeItems: "center",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: REMOTION_INK,
    color: "#FFFFFF",
  },
  benefitsLayout: {
    padding: "154px 150px 120px",
    alignItems: "flex-start",
  },
  benefitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 24,
    marginTop: 58,
    width: "100%",
  },
  benefitCard: {
    minHeight: 300,
    borderRadius: 24,
    border: `1px solid ${LINE}`,
    backgroundColor: "#FFFFFF",
    padding: 36,
    boxShadow: "0 24px 70px rgba(40, 42, 54, 0.1)",
  },
  benefitMark: {
    display: "grid",
    placeItems: "center",
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: REMOTION_BLUE,
    color: "#fff",
    fontSize: 22,
    fontWeight: 950,
  },
  benefitTitle: {
    margin: "28px 0 0",
    fontSize: 38,
    lineHeight: 1,
    fontWeight: 950,
  },
  benefitBody: {
    margin: "18px 0 0",
    fontSize: 25,
    lineHeight: 1.35,
    color: "#4B5563",
    fontWeight: 600,
  },
  closingLayout: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "150px 170px",
  },
  closingLogo: {
    width: 360,
    height: 110,
    objectFit: "contain",
  },
  closingTitle: {
    margin: "42px 0 0",
    maxWidth: 1180,
    fontSize: 82,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: 0,
  },
  closingBody: {
    margin: "28px 0 0",
    maxWidth: 950,
    fontSize: 31,
    lineHeight: 1.38,
    color: "#4B5563",
  },
  cta: {
    marginTop: 44,
    padding: "24px 54px",
    borderRadius: 18,
    backgroundColor: REMOTION_BLUE,
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: 950,
    boxShadow: "0 24px 60px rgba(11, 132, 243, 0.28)",
  },
  contact: {
    marginTop: 28,
    fontSize: 24,
    color: "#6B7280",
    fontWeight: 750,
  },
}
