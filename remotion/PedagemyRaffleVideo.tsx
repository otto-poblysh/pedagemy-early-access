import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion"

const BLUE = "#0056D2"
const REMOTION_BLUE = "#0B84F3"
const INK = "#1A1A2E"
const MUTED = "#6B7280"
const PAPER = "#F7F9FC"
const LINE = "rgba(26, 26, 46, 0.08)"
const SOFT_LINE = "rgba(26, 26, 46, 0.10)"
const GREEN = "#10B981"

const programs = [
  {
    label: "Soft Skills Accelerator",
    value: "$300",
    icon: "people",
    topics: ["Leadership", "Communication", "AI literacy", "Productivity"],
    body: "A wide foundation across today's workplace skills.",
  },
  {
    label: "Tech Career Launchpad",
    value: "$325",
    icon: "screen",
    topics: ["Python", "SQL", "Cloud", "Cybersecurity"],
    body: "Hands-on learning for technical roles and stronger tech skills.",
  },
  {
    label: "Leadership Accelerator",
    value: "$70",
    icon: "case",
    topics: ["Executive presence", "Strategy", "Coaching", "Decision-making"],
    body: "Lead yourself, your team, and the business with more confidence.",
  },
  {
    label: "Workplace Readiness",
    value: "$60",
    icon: "shield",
    topics: ["Ethics", "Data privacy", "Safety", "Compliance"],
    body: "Understand the rules, responsibilities, and safe practices of work.",
  },
]

const scene = {
  hero: { start: 0, duration: 270 },
  registration: { start: 240, duration: 360 },
  mobile: { start: 570, duration: 330 },
  programs: { start: 870, duration: 450 },
  benefits: { start: 1260, duration: 270 },
  close: { start: 1500, duration: 300 },
}

type SceneProps = {
  start: number
  duration: number
  children: (localFrame: number) => React.ReactNode
}

export function PedagemyRaffleVideo() {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={styles.stage}>
      <PageTexture />
      <Progress frame={frame} />
      <Scene {...scene.hero}>
        {(localFrame) => <HeroScene localFrame={localFrame} />}
      </Scene>
      <Scene {...scene.registration}>
        {(localFrame) => <RegistrationScene localFrame={localFrame} />}
      </Scene>
      <Scene {...scene.mobile}>
        {(localFrame) => <MobileScene localFrame={localFrame} />}
      </Scene>
      <Scene {...scene.programs}>
        {(localFrame) => <ProgramsScene localFrame={localFrame} />}
      </Scene>
      <Scene {...scene.benefits}>
        {(localFrame) => <BenefitsScene localFrame={localFrame} />}
      </Scene>
      <Scene {...scene.close}>
        {(localFrame) => <ClosingScene localFrame={localFrame} />}
      </Scene>
    </AbsoluteFill>
  )
}

function Scene({ start, duration, children }: SceneProps) {
  const frame = useCurrentFrame()
  const localFrame = frame - start
  const opacity = interpolate(
    frame,
    [start, start + 24, start + duration - 28, start + duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  )
  const y = interpolate(frame, [start, start + 34], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  if (localFrame < -40 || localFrame > duration + 40) return null

  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${y}px)` }}>
      {children(localFrame)}
    </AbsoluteFill>
  )
}

function PageTexture() {
  const frame = useCurrentFrame()
  const drift = interpolate(frame, [0, 1800], [0, 1])

  return (
    <AbsoluteFill style={styles.textureWrap}>
      <div
        style={{
          ...styles.grid,
          transform: `translate(${-72 * drift}px, ${-40 * drift}px)`,
        }}
      />
      <div
        style={{
          ...styles.topGlow,
          transform: `translateX(${24 * drift}px) rotate(-8deg)`,
        }}
      />
      <div
        style={{
          ...styles.bottomGlow,
          transform: `translateY(${-28 * drift}px) rotate(8deg)`,
        }}
      />
    </AbsoluteFill>
  )
}

function Progress({ frame }: { frame: number }) {
  const width = interpolate(frame, [0, 1800], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div style={styles.progressTrack}>
      <div style={{ ...styles.progressFill, width: `${width}%` }} />
    </div>
  )
}

function HeroScene({ localFrame }: { localFrame: number }) {
  const cardScale = spring({
    frame: Math.max(localFrame - 18, 0),
    fps: 30,
    config: { damping: 21, stiffness: 86 },
  })

  return (
    <AbsoluteFill style={styles.heroScene}>
      <div style={styles.heroCopy}>
        <Kicker>Pedagemy Raffle</Kicker>
        <h1 style={styles.heroTitle}>
          Win premium learning access worth up to{" "}
          <span style={styles.blueText}>$755.</span>
        </h1>
        <p style={styles.heroBody}>
          The video now starts where learners start: the actual registration
          page, the programme choices, and the form that takes under 2 minutes.
        </p>
        <div style={styles.pillRow}>
          <Pill>Free to apply</Pill>
          <Pill>Friday, May 15, 2026</Pill>
          <Pill>Curated by iCUBEFARM</Pill>
        </div>
      </div>
      <div style={{ ...styles.desktopHeroWrap, transform: `scale(${cardScale})` }}>
        <DesktopPagePreview localFrame={localFrame} focus="home" />
      </div>
    </AbsoluteFill>
  )
}

function RegistrationScene({ localFrame }: { localFrame: number }) {
  const zoom = interpolate(localFrame, [20, 110], [0.78, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const cursorY = interpolate(localFrame, [45, 260], [330, 690], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill style={styles.registrationScene}>
      <div style={styles.sceneHeader}>
        <Kicker>How to register</Kicker>
        <h2 style={styles.sectionTitle}>Show the form. Make the action obvious.</h2>
      </div>
      <div style={styles.registrationGrid}>
        <div style={{ ...styles.registrationBrowser, transform: `scale(${zoom})` }}>
          <DesktopPagePreview localFrame={localFrame} focus="form" />
          <div style={{ ...styles.cursorDot, top: cursorY }} />
        </div>
        <div style={styles.calloutStack}>
          {[
            ["01", "Choose one programme", "The dropdown mirrors the live form."],
            ["02", "Enter contact details", "Name, email, phone, and your reason."],
            ["03", "Submit application", "No payment required after the click."],
          ].map(([n, title, body], index) => {
            const active = localFrame > 55 + index * 62
            return (
              <div
                key={n}
                style={{
                  ...styles.callout,
                  borderColor: active ? BLUE : LINE,
                  transform: `translateX(${active ? 0 : 18}px)`,
                  opacity: active ? 1 : 0.62,
                }}
              >
                <span style={styles.calloutNumber}>{n}</span>
                <div>
                  <h3 style={styles.calloutTitle}>{title}</h3>
                  <p style={styles.calloutBody}>{body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}

function MobileScene({ localFrame }: { localFrame: number }) {
  const phoneY = interpolate(localFrame, [0, 80], [50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  return (
    <AbsoluteFill style={styles.mobileScene}>
      <div style={styles.mobileCopy}>
        <Kicker>Mobile-first registration</Kicker>
        <h2 style={styles.sectionTitle}>The form becomes a clean phone shot.</h2>
        <p style={styles.sectionBody}>
          This gives the video a practical middle: viewers see the exact fields
          they will complete and the blue submit button they should tap.
        </p>
      </div>
      <div style={{ ...styles.phoneFrame, transform: `translateY(${phoneY}px)` }}>
        <MobileFormPreview localFrame={localFrame} />
      </div>
      <div style={styles.mobileNote}>
        <strong>No floating footer.</strong>
        <span>The page now scrolls naturally, so the form has room to breathe.</span>
      </div>
    </AbsoluteFill>
  )
}

function ProgramsScene({ localFrame }: { localFrame: number }) {
  const activeIndex = Math.min(3, Math.floor(Math.max(localFrame, 0) / 108))
  const active = programs[activeIndex] ?? programs[1]!

  return (
    <AbsoluteFill style={styles.programsScene}>
      <div style={styles.sceneHeader}>
        <Kicker>Programme highlights</Kicker>
        <h2 style={styles.sectionTitle}>Use the accordion as the visual rhythm.</h2>
      </div>
      <div style={styles.programSceneGrid}>
        <div style={styles.accordionBoard}>
          {programs.map((program, index) => (
            <CourseAccordionPreview
              key={program.label}
              program={program}
              active={index === activeIndex}
            />
          ))}
        </div>
        <div style={styles.topicPanel}>
          <span style={styles.topicEyebrow}>Selected path</span>
          <h3 style={styles.topicTitle}>{active.label}</h3>
          <p style={styles.topicBody}>{active.body}</p>
          <div style={styles.topicGrid}>
            {active.topics.map((topic, index) => (
              <div key={topic} style={styles.topicChip}>
                <span
                  style={{
                    ...styles.topicDot,
                    backgroundColor: index % 2 === 0 ? BLUE : REMOTION_BLUE,
                  }}
                />
                {topic}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

function BenefitsScene({ localFrame }: { localFrame: number }) {
  const benefits = [
    "No payment required",
    "World-class professional courses",
    "Selection reviewed personally",
    "Access instructions sent directly",
  ]

  return (
    <AbsoluteFill style={styles.benefitsScene}>
      <Kicker>Why this matters</Kicker>
      <h2 style={styles.benefitsTitle}>
        The site UI does the selling: calm, credible, and action-focused.
      </h2>
      <div style={styles.benefitGrid}>
        {benefits.map((benefit, index) => {
          const enter = interpolate(localFrame, [20 + index * 22, 58 + index * 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
          return (
            <div
              key={benefit}
              style={{
                ...styles.benefitCard,
                opacity: enter,
                transform: `translateY(${(1 - enter) * 30}px)`,
              }}
            >
              <span style={styles.benefitMark}>0{index + 1}</span>
              <h3 style={styles.benefitCardTitle}>{benefit}</h3>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

function ClosingScene({ localFrame }: { localFrame: number }) {
  const pulse = interpolate(localFrame % 64, [0, 32, 64], [1, 1.025, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <AbsoluteFill style={styles.closingScene}>
      <Img src={staticFile("pedagemy-logo.png")} style={styles.closingLogo} />
      <h2 style={styles.closingTitle}>Register to win by Friday, May 15, 2026</h2>
      <p style={styles.closingBody}>
        Choose your programme, explain your career goal, and submit the
        application in under 2 minutes.
      </p>
      <div style={{ ...styles.cta, transform: `scale(${pulse})` }}>
        Apply on the Pedagemy page
      </div>
      <p style={styles.contact}>training@icubefarm.com</p>
    </AbsoluteFill>
  )
}

function DesktopPagePreview({
  localFrame,
  focus,
}: {
  localFrame: number
  focus: "home" | "form"
}) {
  const selected = focus === "form" ? Math.min(1, localFrame / 90) : 1

  return (
    <div style={styles.browserFrame}>
      <SiteNav />
      <div style={styles.siteGrid}>
        <div style={styles.siteLeft}>
          <h2 style={styles.siteHeadline}>
            Win Premium Learning Access - Worth up to $755.
          </h2>
          <p style={styles.siteKicker}>Register to win by Friday, May 15, 2026</p>
          <p style={styles.siteContext}>
            Enter the Pedagemy Raffle for a chance to access world-class courses
            curated by iCUBEFARM.
          </p>
          <div style={styles.siteAccordionList}>
            {programs.map((program, index) => (
              <CourseAccordionPreview
                key={program.label}
                program={program}
                active={index === 1 && selected > 0.2}
                compact
              />
            ))}
          </div>
        </div>
        <div style={styles.siteFormRail}>
          <RegistrationFormPreview filled={focus === "form"} />
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}

function SiteNav() {
  return (
    <div style={styles.siteNavWrap}>
      <div style={styles.siteNav}>
        <Img src={staticFile("pedagemy-logo.png")} style={styles.siteLogo} />
        <div style={styles.navRight}>
          <span style={styles.greenDot} />
          <span style={styles.registrationOngoing}>Early access registrations ongoing</span>
          <span style={styles.langActive}>EN</span>
          <span style={styles.lang}>FR</span>
          <span style={styles.lang}>ES</span>
        </div>
      </div>
    </div>
  )
}

function SiteFooter() {
  return (
    <div style={styles.siteFooter}>
      <Img src={staticFile("pedagemy-logo.png")} style={styles.footerLogo} />
      <span>training@icubefarm.com</span>
      <span>English: +237 683 064 880</span>
      <span>French and Spanish: +240 555 79 65 52</span>
    </div>
  )
}

function RegistrationFormPreview({ filled }: { filled: boolean }) {
  const fields = [
    ["Full name", filled ? "Amina Okoro" : "Your full name"],
    ["Email address", filled ? "amina@example.com" : "you@email.com"],
    ["Phone number", filled ? "+237 683 064 880" : "+237 000 000 0000"],
    ["Programme", "Codecademy Expert - $325"],
  ]

  return (
    <div style={styles.formCard}>
      <div style={styles.formHeader}>
        <h3 style={styles.formTitle}>Registration form</h3>
        <p style={styles.formSubtitle}>All fields required. Takes under 2 minutes.</p>
      </div>
      <div style={styles.formBody}>
        {fields.map(([label, value], index) => (
          <label key={label} style={styles.formLabel}>
            <span>{label}</span>
            <div style={styles.inputBox}>
              <span style={{ color: filled || index === 3 ? INK : "#A8B0BE" }}>
                {value}
              </span>
              {index === 3 ? <span style={styles.selectChevron}>⌄</span> : null}
            </div>
          </label>
        ))}
        <label style={styles.formLabel}>
          <span>Why this programme?</span>
          <div style={styles.textAreaBox}>
            <span style={{ color: filled ? INK : "#A8B0BE" }}>
              {filled
                ? "I want to build practical tech skills for a stronger career move this year."
                : "Describe how this programme aligns with your career goals..."}
            </span>
          </div>
        </label>
        <div style={styles.submitButton}>
          Submit Application
          <span style={styles.submitBadge}>↗</span>
        </div>
        <p style={styles.noPayment}>No payment required. Selected candidates are contacted directly.</p>
      </div>
    </div>
  )
}

function MobileFormPreview({ localFrame }: { localFrame: number }) {
  const filled = localFrame > 105

  return (
    <div style={styles.phoneScreen}>
      <SiteNavMini />
      <RegistrationFormPreview filled={filled} />
    </div>
  )
}

function SiteNavMini() {
  return (
    <div style={styles.mobileNav}>
      <Img src={staticFile("pedagemy-logo.png")} style={styles.mobileLogo} />
      <div style={styles.mobileLangs}>
        <span style={styles.langActive}>EN</span>
        <span style={styles.lang}>FR</span>
        <span style={styles.lang}>ES</span>
      </div>
    </div>
  )
}

function CourseAccordionPreview({
  program,
  active,
  compact = false,
}: {
  program: (typeof programs)[number]
  active: boolean
  compact?: boolean
}) {
  return (
    <div
      style={{
        ...styles.courseCard,
        ...(active ? styles.courseCardActive : {}),
        minHeight: active && !compact ? 250 : compact ? 82 : 96,
      }}
    >
      <div style={styles.courseHeader}>
        <div
          style={{
            ...styles.courseIcon,
            backgroundColor: active ? BLUE : "rgba(26, 26, 46, 0.06)",
            color: active ? "#fff" : "rgba(26, 26, 46, 0.45)",
          }}
        >
          {iconFor(program.icon)}
        </div>
        <strong style={{ ...styles.courseName, color: active ? BLUE : "rgba(26,26,46,0.62)" }}>
          {program.label}
        </strong>
        <b style={{ ...styles.courseValue, color: active ? "#003A8C" : "rgba(26,26,46,0.32)" }}>
          {program.value}
        </b>
        <span style={{ ...styles.courseToggle, backgroundColor: active ? BLUE : "rgba(26,26,46,0.08)" }}>
          ⌃
        </span>
      </div>
      {active ? (
        <ul style={styles.courseBullets}>
          <li>{program.body}</li>
          <li>{program.topics.join(", ")}</li>
          <li>Interactive courses, guided practice, and career-relevant learning.</li>
        </ul>
      ) : null}
    </div>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <div style={styles.kicker}>{children}</div>
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.pill}>
      <span style={styles.pillDot} />
      {children}
    </div>
  )
}

function iconFor(name: string) {
  if (name === "screen") return "▭"
  if (name === "case") return "▣"
  if (name === "shield") return "◇"
  return "◌"
}

const styles: Record<string, React.CSSProperties> = {
  stage: {
    width: "100%",
    height: "100%",
    backgroundColor: PAPER,
    color: INK,
    fontFamily:
      'DM Sans, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: "hidden",
  },
  textureWrap: {
    background: "linear-gradient(135deg, #F7F9FC 0%, #FFFFFF 56%, #EDF6FF 100%)",
  },
  grid: {
    position: "absolute",
    inset: -120,
    backgroundImage:
      "linear-gradient(rgba(26,26,46,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,46,0.045) 1px, transparent 1px)",
    backgroundSize: "80px 80px",
  },
  topGlow: {
    position: "absolute",
    right: -170,
    top: -260,
    width: 820,
    height: 820,
    borderRadius: 130,
    backgroundColor: "rgba(11,132,243,0.14)",
  },
  bottomGlow: {
    position: "absolute",
    left: -320,
    bottom: -270,
    width: 860,
    height: 620,
    borderRadius: 120,
    backgroundColor: "rgba(26,26,46,0.055)",
  },
  progressTrack: {
    position: "absolute",
    left: 72,
    right: 72,
    bottom: 42,
    zIndex: 30,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,86,210,0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: `linear-gradient(90deg, ${REMOTION_BLUE}, ${BLUE})`,
  },
  heroScene: {
    display: "grid",
    gridTemplateColumns: "0.92fr 1.08fr",
    gap: 58,
    alignItems: "center",
    padding: "100px 84px 92px",
  },
  heroCopy: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroTitle: {
    margin: "26px 0 0",
    fontSize: 76,
    lineHeight: 0.98,
    fontWeight: 950,
    letterSpacing: 0,
  },
  blueText: {
    color: BLUE,
  },
  heroBody: {
    margin: "28px 0 0",
    maxWidth: 720,
    color: "#465368",
    fontSize: 28,
    lineHeight: 1.38,
    fontWeight: 600,
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 38,
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: `1px solid ${SOFT_LINE}`,
    borderRadius: 999,
    backgroundColor: "#fff",
    padding: "12px 16px",
    fontSize: 18,
    fontWeight: 850,
    boxShadow: "0 12px 30px rgba(26,26,46,0.05)",
  },
  pillDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: GREEN,
  },
  kicker: {
    display: "inline-flex",
    alignItems: "center",
    border: `1px solid ${SOFT_LINE}`,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.86)",
    padding: "10px 16px",
    color: BLUE,
    fontSize: 18,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  desktopHeroWrap: {
    transformOrigin: "center",
  },
  browserFrame: {
    position: "relative",
    width: 1030,
    height: 720,
    borderRadius: 26,
    border: `1px solid ${LINE}`,
    backgroundColor: PAPER,
    boxShadow: "0 36px 110px rgba(26,26,46,0.16)",
    overflow: "hidden",
  },
  siteNavWrap: {
    display: "flex",
    justifyContent: "center",
    padding: "18px 34px 0",
  },
  siteNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 54,
    borderRadius: 10,
    border: `1px solid ${SOFT_LINE}`,
    backgroundColor: "rgba(247,249,252,0.92)",
    padding: "0 20px",
    boxShadow: "0 2px 24px rgba(26,26,46,0.06)",
  },
  siteLogo: {
    width: 165,
    height: 32,
    objectFit: "contain",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 12,
    color: "rgba(26,26,46,0.42)",
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: GREEN,
  },
  registrationOngoing: {
    whiteSpace: "nowrap",
  },
  langActive: {
    display: "grid",
    placeItems: "center",
    minWidth: 34,
    height: 30,
    borderRadius: 6,
    backgroundColor: BLUE,
    color: "#fff",
    fontWeight: 950,
  },
  lang: {
    fontWeight: 800,
    color: "rgba(26,26,46,0.38)",
  },
  siteGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 390px",
    gap: 44,
    padding: "46px 58px 30px",
  },
  siteLeft: {
    minWidth: 0,
  },
  siteHeadline: {
    margin: 0,
    fontSize: 48,
    lineHeight: 1.08,
    fontWeight: 950,
    letterSpacing: 0,
  },
  siteKicker: {
    margin: "34px 0 0",
    color: BLUE,
    fontSize: 17,
    fontWeight: 950,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  siteContext: {
    margin: "16px 0 0",
    color: INK,
    fontSize: 18,
    lineHeight: 1.45,
    fontWeight: 500,
  },
  siteAccordionList: {
    display: "grid",
    gap: 12,
    marginTop: 22,
  },
  siteFormRail: {
    minWidth: 0,
  },
  formCard: {
    borderRadius: 18,
    border: `1px solid ${LINE}`,
    backgroundColor: "#fff",
    boxShadow: "0 18px 70px rgba(26,26,46,0.10)",
    overflow: "hidden",
  },
  formHeader: {
    padding: "26px 30px 20px",
    borderBottom: "1px solid rgba(26,26,46,0.06)",
  },
  formTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 950,
    color: INK,
  },
  formSubtitle: {
    margin: "8px 0 0",
    fontSize: 13,
    color: "rgba(26,26,46,0.42)",
  },
  formBody: {
    padding: "22px 30px 24px",
  },
  formLabel: {
    display: "block",
    marginBottom: 12,
    color: "rgba(26,26,46,0.62)",
    fontSize: 13,
    fontWeight: 700,
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 38,
    marginTop: 7,
    borderRadius: 5,
    border: `1px solid ${SOFT_LINE}`,
    backgroundColor: PAPER,
    padding: "0 14px",
    fontSize: 14,
    fontWeight: 650,
  },
  selectChevron: {
    color: "rgba(26,26,46,0.45)",
    fontSize: 18,
  },
  textAreaBox: {
    height: 62,
    marginTop: 7,
    borderRadius: 5,
    border: `1px solid ${SOFT_LINE}`,
    backgroundColor: PAPER,
    padding: "13px 14px",
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 650,
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 44,
    borderRadius: 5,
    backgroundColor: BLUE,
    color: "#fff",
    fontSize: 14,
    fontWeight: 950,
    boxShadow: "0 8px 22px rgba(0,86,210,0.25)",
  },
  submitBadge: {
    display: "grid",
    placeItems: "center",
    width: 20,
    height: 20,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.14)",
    fontSize: 11,
  },
  noPayment: {
    margin: "12px 0 0",
    textAlign: "center",
    color: "rgba(26,26,46,0.30)",
    fontSize: 12,
    lineHeight: 1.35,
  },
  siteFooter: {
    height: 66,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    borderTop: `1px solid ${LINE}`,
    backgroundColor: "rgba(255,255,255,0.92)",
    color: "rgba(26,26,46,0.45)",
    fontSize: 12,
  },
  footerLogo: {
    width: 148,
    height: 29,
    objectFit: "contain",
  },
  courseCard: {
    borderRadius: 10,
    border: `1px solid ${LINE}`,
    backgroundColor: "rgba(255,255,255,0.72)",
    padding: 1,
    overflow: "hidden",
  },
  courseCardActive: {
    borderColor: "rgba(0,86,210,0.30)",
    backgroundColor: "#fff",
    boxShadow: "0 4px 24px rgba(0,86,210,0.10)",
  },
  courseHeader: {
    display: "grid",
    gridTemplateColumns: "40px 1fr auto 24px",
    alignItems: "center",
    gap: 13,
    padding: "16px 18px",
  },
  courseIcon: {
    display: "grid",
    placeItems: "center",
    width: 35,
    height: 35,
    borderRadius: 7,
    fontSize: 20,
    fontWeight: 950,
  },
  courseName: {
    fontSize: 15,
    fontWeight: 950,
  },
  courseValue: {
    fontSize: 16,
    fontWeight: 950,
  },
  courseToggle: {
    display: "grid",
    placeItems: "center",
    width: 22,
    height: 22,
    borderRadius: 99,
    color: "#fff",
    fontSize: 13,
    fontWeight: 950,
  },
  courseBullets: {
    margin: "0 22px 22px 74px",
    padding: 0,
    color: "rgba(26,26,46,0.54)",
    fontSize: 14,
    lineHeight: 1.62,
  },
  registrationScene: {
    padding: "96px 92px 90px",
  },
  sceneHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  sectionTitle: {
    margin: "22px 0 0",
    maxWidth: 920,
    fontSize: 58,
    lineHeight: 1.02,
    fontWeight: 950,
    letterSpacing: 0,
  },
  sectionBody: {
    margin: "26px 0 0",
    maxWidth: 700,
    color: "#465368",
    fontSize: 28,
    lineHeight: 1.38,
    fontWeight: 650,
  },
  registrationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 480px",
    alignItems: "center",
    gap: 56,
    marginTop: 34,
  },
  registrationBrowser: {
    transformOrigin: "left center",
  },
  cursorDot: {
    position: "absolute",
    right: 150,
    width: 28,
    height: 28,
    borderRadius: 99,
    border: "5px solid #fff",
    backgroundColor: REMOTION_BLUE,
    boxShadow: "0 12px 30px rgba(11,132,243,0.28)",
  },
  calloutStack: {
    display: "grid",
    gap: 18,
  },
  callout: {
    display: "grid",
    gridTemplateColumns: "58px 1fr",
    gap: 18,
    border: "2px solid",
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: 24,
    boxShadow: "0 20px 50px rgba(26,26,46,0.08)",
  },
  calloutNumber: {
    display: "grid",
    placeItems: "center",
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: BLUE,
    color: "#fff",
    fontSize: 18,
    fontWeight: 950,
  },
  calloutTitle: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.05,
    fontWeight: 950,
  },
  calloutBody: {
    margin: "8px 0 0",
    color: MUTED,
    fontSize: 19,
    lineHeight: 1.34,
    fontWeight: 650,
  },
  mobileScene: {
    display: "grid",
    gridTemplateColumns: "1fr 460px 350px",
    gap: 58,
    alignItems: "center",
    padding: "98px 110px 90px",
  },
  mobileCopy: {
    alignSelf: "center",
  },
  phoneFrame: {
    width: 390,
    height: 790,
    borderRadius: 42,
    border: "12px solid #111827",
    backgroundColor: "#111827",
    boxShadow: "0 40px 110px rgba(17,24,39,0.25)",
    overflow: "hidden",
  },
  phoneScreen: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: PAPER,
    padding: "18px 18px 26px",
  },
  mobileNav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    borderRadius: 9,
    border: `1px solid ${SOFT_LINE}`,
    backgroundColor: "rgba(247,249,252,0.94)",
    padding: "0 12px",
    marginBottom: 14,
  },
  mobileLogo: {
    width: 160,
    height: 31,
    objectFit: "contain",
  },
  mobileLangs: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 10,
  },
  mobileNote: {
    display: "grid",
    gap: 14,
    alignSelf: "end",
    marginBottom: 120,
    color: "#465368",
    fontSize: 24,
    lineHeight: 1.3,
    fontWeight: 650,
  },
  programsScene: {
    padding: "96px 104px 88px",
  },
  programSceneGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 650px",
    gap: 42,
    alignItems: "stretch",
    marginTop: 38,
  },
  accordionBoard: {
    display: "grid",
    gap: 16,
  },
  topicPanel: {
    borderRadius: 24,
    border: `1px solid ${LINE}`,
    backgroundColor: "#fff",
    padding: 46,
    boxShadow: "0 30px 80px rgba(26,26,46,0.12)",
  },
  topicEyebrow: {
    color: BLUE,
    fontSize: 22,
    fontWeight: 950,
  },
  topicTitle: {
    margin: "16px 0 0",
    fontSize: 58,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: 0,
  },
  topicBody: {
    margin: "22px 0 0",
    color: "#465368",
    fontSize: 27,
    lineHeight: 1.32,
    fontWeight: 650,
  },
  topicGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginTop: 34,
  },
  topicChip: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    backgroundColor: PAPER,
    padding: "16px 18px",
    fontSize: 21,
    fontWeight: 900,
  },
  topicDot: {
    width: 10,
    height: 10,
    borderRadius: 99,
  },
  benefitsScene: {
    alignItems: "flex-start",
    padding: "128px 128px 110px",
  },
  benefitsTitle: {
    margin: "28px 0 0",
    maxWidth: 1340,
    fontSize: 76,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: 0,
  },
  benefitGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 18,
    width: "100%",
    marginTop: 62,
  },
  benefitCard: {
    minHeight: 230,
    borderRadius: 20,
    border: `1px solid ${LINE}`,
    backgroundColor: "#fff",
    padding: 28,
    boxShadow: "0 24px 70px rgba(26,26,46,0.09)",
  },
  benefitMark: {
    display: "grid",
    placeItems: "center",
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: BLUE,
    color: "#fff",
    fontSize: 18,
    fontWeight: 950,
  },
  benefitCardTitle: {
    margin: "28px 0 0",
    fontSize: 30,
    lineHeight: 1.08,
    fontWeight: 950,
  },
  closingScene: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "140px 180px",
  },
  closingLogo: {
    width: 380,
    height: 74,
    objectFit: "contain",
  },
  closingTitle: {
    margin: "44px 0 0",
    maxWidth: 1200,
    fontSize: 82,
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: 0,
  },
  closingBody: {
    margin: "28px 0 0",
    maxWidth: 980,
    color: "#465368",
    fontSize: 30,
    lineHeight: 1.35,
    fontWeight: 650,
  },
  cta: {
    marginTop: 44,
    borderRadius: 10,
    backgroundColor: BLUE,
    color: "#fff",
    padding: "22px 44px",
    fontSize: 30,
    fontWeight: 950,
    boxShadow: "0 24px 60px rgba(0,86,210,0.28)",
  },
  contact: {
    marginTop: 24,
    color: "rgba(26,26,46,0.48)",
    fontSize: 22,
    fontWeight: 750,
  },
}
