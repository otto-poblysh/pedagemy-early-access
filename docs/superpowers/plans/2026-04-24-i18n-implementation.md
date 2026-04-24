# Internationalisation (i18n) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English, French, and Spanish support to the site with locale detection, persistent language switching, and transactional emails sent in the user's chosen language.

**Architecture:**

- i18next with react-i18next for client-side translation
- Middleware detects locale from URL prefix (`/fr/`, `/es/`) → cookie → `Accept-Language` header
- Cookie (`NEXT_LOCALE`) persists the user's choice
- Translation files stored in `i18n/locales/{lng}/translation.json`
- Registration form captures and stores `locale`; confirmation email is sent in that locale

**Tech Stack:** i18next, react-i18next, i18next-browser-languagedetector, i18next-http-backend

---

## Task 1: Install i18n dependencies

**Files:**

- Modify: `apps/web/package.json`

- [ ] **Step 1: Install packages**

Run: `cd apps/web && bun add i18next react-i18next i18next-browser-languagedetector i18next-http-backend`

Expected: packages added without errors

---

## Task 2: Create i18n config

**Files:**

- Create: `apps/web/i18n/index.ts`

- [ ] **Step 1: Create i18n config**

```typescript
// apps/web/i18n/index.ts
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"

constDetector = new LanguageDetector(null, {
  order: ["cookies", "htmlTag", "navigator"],
  caches: ["cookies"],
  cookieOptions: {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  },
})

i18n
  .use(Backend)
  .use(Detector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    supportedLngs: ["en", "fr", "es"],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      cookieDomain: "",
      cookieName: "NEXT_LOCALE",
    },
  })

export default i18n
```

---

## Task 3: Create translation JSON files

**Files:**

- Create: `apps/web/public/locales/en/translation.json`
- Create: `apps/web/public/locales/fr/translation.json`
- Create: `apps/web/public/locales/es/translation.json`

- [ ] **Step 1: Create English translation**

```json
// apps/web/public/locales/en/translation.json
{
  "nav": {
    "applyNow": "Apply Now",
    "registrationsOngoing": "Early access registrations ongoing"
  },
  "hero": {
    "headline": "Win the career upgrade worth $755. Yours free.",
    "subheadline": "Most people wait for their employer to invest in them. This is your chance to get there first — fully sponsored, no cost to you.",
    "questionLabel": "One question before you apply",
    "questionPrompt": "Which of these would move the needle most for you right now? Pick the one that makes you think \"I need that.\"",
    "questionContext": "Someone is going to claim this spot. It may as well be the person who decided today was the day.",
    "programmesIncluded": "4 programmes included",
    "applyForAccess": "Apply for Access",
    "applyCaveat": "Free. Reviewed personally. Open to anyone ready to grow."
  },
  "courses": {
    "softSkills": {
      "label": "Soft Skills Accelerator",
      "description": [
        "This program is designed for learners who want a wide foundation across today's workplace skills.",
        "It covers leadership, communication, productivity, digital transformation, data literacy, Artificial Intelligence (AI), cybersecurity, cloud, DevOps, project management, customer service, and career development.",
        "It is useful for students, professionals, and job seekers who want flexible access to many career-relevant learning paths."
      ]
    },
    "techCareer": {
      "label": "Tech Career Launchpad",
      "description": [
        "This program is built for learners who want to grow into technical roles or strengthen their existing tech skills.",
        "It includes topics such as artificial intelligence, big data, data science, machine learning, business intelligence, Python, Java, SQL, HTML5, GitHub, full-stack development, cloud computing, DevOps, cybersecurity, API security, and application security.",
        "It also supports hands-on learning through interactive courses, coding labs, and AI-powered practice tools."
      ]
    },
    "leadership": {
      "label": "Leadership Accelerator",
      "description": [
        "This program is designed for professionals who want to become stronger leaders at work.",
        "It covers three areas: leading yourself, leading your team, and leading the business.",
        "Learners explore executive presence, emotional intelligence, ethical leadership, team building, cross-cultural leadership, coaching, conflict management, customer-first leadership, decision-making, innovation, strategy, and leadership in the age of AI.",
        "It is suitable for emerging leaders, managers, team leads, and professionals preparing for more responsibility."
      ]
    },
    "workplaceReadiness": {
      "label": "Workplace Readiness",
      "description": [
        "This program is designed to help learners understand the rules, responsibilities, and safe practices required in modern workplaces.",
        "It covers legal and compliance topics such as anti-harassment, code of conduct, ethics, data privacy, GDPR compliance, HIPAA, cybersecurity, and workplace security.",
        "It also includes environmental, health, and safety topics such as ergonomics, home office safety, sustainability, transportation, workforce security, and post-pandemic workplace practices.",
        "It is useful for professionals, job seekers, and organizations that want stronger workplace readiness."
      ]
    }
  },
  "form": {
    "title": "Registration form",
    "subtitle": "All fields required. Takes under 2 minutes.",
    "fullName": "Full name",
    "fullNamePlaceholder": "Your full name",
    "email": "Email address",
    "emailPlaceholder": "you@email.com",
    "phone": "Phone number",
    "phonePlaceholder": "+237 000 000 0000",
    "programme": "Programme",
    "reason": "Why this programme?",
    "reasonPlaceholder": "Describe how this programme aligns with your career goals…",
    "submit": "Submit Application",
    "submitting": "Submitting…",
    "successTitle": "Application received.",
    "successBody": "If selected, Pedagemy will contact you directly with access instructions.",
    "noPayment": "No payment required. Selected candidates are contacted directly.",
    "errorRequired": "All fields are required",
    "errorInvalidEmail": "Invalid email address",
    "errorGeneric": "Something went wrong. Please try again.",
    "errorNetwork": "Network error. Please try again."
  },
  "photoCard": {
    "statusLabel": "Applications open",
    "subtitle": "Curated by iCUBEFARM",
    "cardHeadline": "The skills employers invest in — now available to you at no cost."
  },
  "stats": {
    "programmes": "Programmes",
    "value": "Value",
    "free": "Free"
  },
  "process": {
    "sectionTitle": "Three steps from where you are to where you want to be.",
    "sectionSubtitle": "Visualise the version of yourself on the other side of this. Higher earning, more confident, further ahead. That person took step one. So can you.",
    "futureContext": "Your future self is already in this room.",
    "futurePrompt": "The only question is whether you show up.",
    "steps": [
      {
        "n": "01",
        "title": "Seize the opening",
        "body": "Apply in under two minutes. Tell us which programme you chose and why it matters to you right now. That decision alone puts you ahead of everyone who scrolled past."
      },
      {
        "n": "02",
        "title": "Do the work that changes you",
        "body": "Complete a world-class programme — the same training organisations invest in for their top people. This is not passive learning. It is the version of you you have been putting off becoming."
      },
      {
        "n": "03",
        "title": "Step into a different future",
        "body": "A promotion you stopped waiting for. A salary conversation you can now have. A business move you finally feel ready to make. That future starts the moment you finish step one."
      }
    ]
  },
  "socialProof": {
    "sectionTitle": "Real outcomes from the same programmes, inside real organisations.",
    "outcomes": [
      {
        "outcome": "First role secured",
        "detail": "Graduates who completed iCUBEFARM training went on to land their first professional positions — in organisations they had been targeting for months."
      },
      {
        "outcome": "First internship won",
        "detail": "Students with no prior corporate experience used the skills from these programmes to compete — and win — against candidates with longer CVs."
      },
      {
        "outcome": "Promoted from within",
        "detail": "Employees who upskilled through iCUBEFARM's corporate programmes made the case for promotion with new capabilities their managers could see."
      },
      {
        "outcome": "Switched careers",
        "detail": "Professionals who felt stuck used targeted training to pivot into roles that paid more and aligned with where they actually wanted to go."
      }
    ],
    "trainingLabel": "iCUBEFARM's training initiatives delivered across leading organisations in Africa, including:"
  },
  "faq": {
    "sectionTitle": "Before you apply.",
    "items": [
      {
        "q": "Why is this free?",
        "a": "Pedagemy is launching as a dedicated e-learning platform that partners with companies, training institutions, and professional bodies across Africa to make quality career development accessible. This is our early access programme — we are opening the training iCUBEFARM has delivered inside corporates to the public for the first time. There is no catch. No cost to apply, no cost to access, no upsell."
      },
      {
        "q": "Who can apply?",
        "a": "Applications are open to students, job seekers, and working professionals at any career stage. There are no eligibility restrictions."
      },
      {
        "q": "What makes these programmes different?",
        "a": "Each is from an established professional training provider — Skillsoft, Codecademy, or iCUBEFARM's own leadership curriculum. These are the same accredited programmes organisations purchase for employee development, not generic self-study content."
      },
      {
        "q": "Who is iCUBEFARM?",
        "a": "iCUBEFARM is a career development organisation curating professional training for students and working professionals. Pedagemy is their dedicated learning platform."
      },
      {
        "q": "How are candidates selected?",
        "a": "Applications are personally reviewed. Priority is given to candidates who articulate clearly how the programme aligns with their specific career goals."
      },
      {
        "q": "What happens after selection?",
        "a": "You receive an email with activation instructions. There is no payment step — just your programme."
      },
      {
        "q": "Can I apply for more than one programme?",
        "a": "Each application covers one programme. Choose the one that best fits your goals."
      },
      {
        "q": "When does the selection window close?",
        "a": "Seats are limited and reviewed in order of submission. Apply early to be considered before capacity is reached."
      }
    ]
  },
  "contact": {
    "footerEmail": "training@icubefarm.com",
    "englishPhone": "+237 683 064 880",
    "frenchSpanishPhone": "+240 555 79 65 52"
  },
  "footer": {
    "copyright": "© 2026 Pedagemy. All rights reserved."
  },
  "email": {
    "subject": "Application received — {{course}}",
    "greeting": "Hi {{name}},",
    "confirmation": "Your application for <strong>{{course}}</strong> has been received.",
    "timeline": "We will reach out to you with updates on the selection process by <strong>Friday, May 15, 2026</strong>.",
    "contactLabel": "If you have any questions before then, reach out to us:",
    "contactEmail": "training@icubefarm.com",
    "contactEnglishWhatsApp": "+237 683 064 880",
    "contactFrenchSpanishWhatsApp": "+240 555 79 65 52",
    "closing": "Best regards,",
    "team": "The Pedagemy Team"
  }
}
```

- [ ] **Step 2: Create French translation**

```json
// apps/web/public/locales/fr/translation.json
{
  "nav": {
    "applyNow": "Postuler maintenant",
    "registrationsOngoing": "Inscriptions en accès anticipé en cours"
  },
  "hero": {
    "headline": "Gagnez la mise à niveau professionnelle qui vaut 755 $. Gratuite pour vous.",
    "subheadline": "La plupart attendent que leur employeur investisse en eux. C'est votre chance d'arriver en premier — entièrement financée, sans frais pour vous.",
    "questionLabel": "Une question avant de postuler",
    "questionPrompt": "Laquelle de ces options ferait le plus bouger les choses pour vous en ce moment ? Choisissez celle qui vous fait penser « J'en ai besoin. »",
    "questionContext": "Quelqu'un va claimed cette place. Autant que ce soit la personne qui a décidé que c'était aujourd'hui.",
    "programmesIncluded": "4 programmes inclus",
    "applyForAccess": "Faire une demande d'accès",
    "applyCaveat": "Gratuit. Examiné personnellement. Ouvert à tous ceux qui sont prêts à progresser."
  },
  "courses": {
    "softSkills": {
      "label": "Accélérateur de compétences douces",
      "description": [
        "Ce programme est conçu pour les apprenants qui veulent une large base de compétences actuelles en milieu de travail.",
        "Il couvre le leadership, la communication, la productivité, la transformation numérique, la culture des données, l'intelligence artificielle (IA), la cybersécurité, le cloud, DevOps, la gestion de projet, le service client et le développement de carrière.",
        "Il est utile pour les étudiants, les professionnels et les chercheurs d'emploi qui veulent un accès flexible à de nombreux parcours d'apprentissage pertinents pour leur carrière."
      ]
    },
    "techCareer": {
      "label": "Lance-palette de carrière tech",
      "description": [
        "Ce programme est construit pour les apprenants qui veulent évoluer vers des rôles techniques ou renforcer leurs compétences tech existantes.",
        "Il inclut des sujets tels que l'intelligence artificielle, le big data, la science des données, l'apprentissage automatique, la business intelligence, Python, Java, SQL, HTML5, GitHub, le développement full-stack, l'informatique en cloud, DevOps, la cybersécurité, la sécurité des API et la sécurité des applications.",
        "Il prend également en charge l'apprentissage pratique grâce à des cours interactifs, des laboratoires de codage et des outils de pratique alimentés par l'IA."
      ]
    },
    "leadership": {
      "label": "Accélérateur de leadership",
      "description": [
        "Ce programme est conçu pour les professionnels qui veulent devenir de meilleurs leaders au travail.",
        "Il couvre trois domaines : se diriger soi-même, diriger son équipe et diriger l'entreprise.",
        "Les apprenants explorent la présence exécutive, l'intelligence émotionnelle, le leadership éthique, le développement d'équipe, le leadership interculturel, le coaching, la gestion des conflits, le leadership orienté client, la prise de décision, l'innovation, la stratégie et le leadership à l'ère de l'IA.",
        "Il convient aux dirigeants émergents, aux managers, aux responsables d'équipe et aux professionnels qui se préparent à plus de responsabilités."
      ]
    },
    "workplaceReadiness": {
      "label": "Préparation au milieu de travail",
      "description": [
        "Ce programme est conçu pour aider les apprenants à comprendre les règles, les responsabilités et les pratiques sécuritaires requises dans les milieux de travail modernes.",
        "Il couvre les sujets juridiques et de conformité tels que la lutte contre le harcèlement, le code de conduite, l'éthique, la protection des données, la conformité au RGPD, HIPAA, la cybersécurité et la sécurité au travail.",
        "Il comprend également des sujets environnementaux, de santé et de sécurité tels que l'ergonomie, la sécurité du bureau à domicile, la durabilité, le transport, la sécurité de la main-d'œuvre et les pratiques de milieu de travail post-pandémiques.",
        "Il est utile pour les professionnels, les chercheurs d'emploi et les organisations qui veulent une meilleure préparation au milieu de travail."
      ]
    }
  },
  "form": {
    "title": "Formulaire d'inscription",
    "subtitle": "Tous les champs sont obligatoires. Prend moins de 2 minutes.",
    "fullName": "Nom complet",
    "fullNamePlaceholder": "Votre nom complet",
    "email": "Adresse e-mail",
    "emailPlaceholder": "vous@email.com",
    "phone": "Numéro de téléphone",
    "phonePlaceholder": "+237 000 000 0000",
    "programme": "Programme",
    "reason": "Pourquoi ce programme ?",
    "reasonPlaceholder": "Décrivez comment ce programme s'aligne avec vos objectifs de carrière…",
    "submit": "Soumettre ma candidature",
    "submitting": "Soumission en cours…",
    "successTitle": "Candidature reçue.",
    "successBody": "Si vous êtes sélectionné, Pedagemy vous contactera directement avec les instructions d'accès.",
    "noPayment": "Aucun paiement requis. Les candidats sélectionnés sont contactés directement.",
    "errorRequired": "Tous les champs sont obligatoires",
    "errorInvalidEmail": "Adresse e-mail invalide",
    "errorGeneric": "Une erreur s'est produite. Veuillez réessayer.",
    "errorNetwork": "Erreur réseau. Veuillez réessayer."
  },
  "photoCard": {
    "statusLabel": "Candidatures ouvertes",
    "subtitle": "Sélectionné par iCUBEFARM",
    "cardHeadline": "Les compétences dans lesquelles les employeurs investissent — maintenant disponibles pour vous sans frais."
  },
  "stats": {
    "programmes": "Programmes",
    "value": "Valeur",
    "free": "Gratuit"
  },
  "process": {
    "sectionTitle": "Trois étapes pour passer de là où vous êtes à là où vous voulez être.",
    "sectionSubtitle": "Visualisez la version de vous-même de l'autre côté de ceci. Mieux rémunéré, plus confiant, plus avancé. Cette personne a pris la première étape. Vous aussi.",
    "futureContext": "Votre futur vous est déjà dans cette pièce.",
    "futurePrompt": "La seule question est de savoir si vous vous présentez.",
    "steps": [
      {
        "n": "01",
        "title": "Saisir l'ouverture",
        "body": "Postulez en moins de deux minutes. Dites-nous quel programme vous avez choisi et pourquoi il compte pour vous en ce moment. Cette décision seule vous met devant tous ceux qui ont scrollé."
      },
      {
        "n": "02",
        "title": "Faire le travail qui vous transforme",
        "body": "Complétez un programme de classe mondiale — la même formation que les organisations investissent pour leurs meilleurs éléments. Ce n'est pas un apprentissage passif. C'est la version de vous que vous avez reportée."
      },
      {
        "n": "03",
        "title": "Entrez dans un avenir différent",
        "body": "Une promotion que vous avez cessé d'attendre. Une conversation salariale que vous pouvez maintenant avoir. Un mouvement d'entreprise que vous vous sentez enfin prêt à faire. Cet avenir commence au moment où vous terminez la première étape."
      }
    ]
  },
  "socialProof": {
    "sectionTitle": "Résultats réels des mêmes programmes, dans de vraies organisations.",
    "outcomes": [
      {
        "outcome": "Premier rôle obtenu",
        "detail": "Les diplômés qui ont suivi la formation iCUBEFARM ont obtenu leurs premiers postes professionnels — dans des organisations qu'ils visaient depuis des mois."
      },
      {
        "outcome": "Premier stage gagné",
        "detail": "Les étudiants sans expérience corporate préalable ont utilisé les compétences de ces programmes pour compétitionner — et gagner — contre des candidats avec des CV plus longs."
      },
      {
        "outcome": "Promu depuis l'intérieur",
        "detail": "Les employés qui se sont perfectionnés grâce aux programmes corporate d'iCUBEFARM ont fait valoir leur promotion avec de nouvelles compétences visibles par leurs managers."
      },
      {
        "outcome": "Reconversion réussie",
        "detail": "Les professionnels qui se sentaient bloqués ont utilisé une formation ciblée pour pivoter vers des rôles mieux rémunérés et alignés avec leurs aspirations."
      }
    ],
    "trainingLabel": "Les initiatives de formation d'iCUBEFARM dispensées dans des organisations leaders en Afrique, notamment :"
  },
  "faq": {
    "sectionTitle": "Avant de postuler.",
    "items": [
      {
        "q": "Pourquoi est-ce gratuit ?",
        "a": "Pedagemy se lance comme une plateforme e-learning dédiée qui s'associe à des entreprises, des institutions de formation et des organismes professionnels en Afrique pour rendre le développement de carrière accessible. C'est notre programme d'accès anticipé — nous ouvrons pour la première fois au public la formation qu'iCUBEFARM dispensait en entreprise. Pas de piège. Pas de frais pour postuler, pas de frais pour accéder, pas de vente forcée."
      },
      {
        "q": "Qui peut postuler ?",
        "a": "Les candidatures sont ouvertes aux étudiants, chercheurs d'emploi et professionnels en activité à tout stade de carrière. Aucune restriction d'éligibilité."
      },
      {
        "q": "Qu'est-ce qui rend ces programmes différents ?",
        "a": "Chacun provient d'un fournisseur de formation professionnelle établi — Skillsoft, Codecademy ou le curriculum de leadership propre à iCUBEFARM. Ce sont les mêmes programmes accrédités que les organisations achètent pour le développement de leurs employés, pas du contenu générique d'auto-formation."
      },
      {
        "q": "Qui est iCUBEFARM ?",
        "a": "iCUBEFARM est une organisation de développement de carrière qui sélectionne des formations professionnelles pour les étudiants et les professionnels en activité. Pedagemy est leur plateforme d'apprentissage dédiée."
      },
      {
        "q": "Comment les candidats sont-ils sélectionnés ?",
        "a": "Les candidatures sont examinées personnellement. La priorité est donnée aux candidats qui expliquent clairement comment le programme s'aligne avec leurs objectifs de carrière spécifiques."
      },
      {
        "q": "Que se passe-t-il après la sélection ?",
        "a": "Vous recevez un e-mail avec les instructions d'activation. Aucune étape de paiement — juste votre programme."
      },
      {
        "q": "Puis-je postuler à plusieurs programmes ?",
        "a": "Chaque candidature couvre un programme. Choisissez celui qui correspond le mieux à vos objectifs."
      },
      {
        "q": "Quand la fenêtre de sélection se ferme-t-elle ?",
        "a": "Les places sont limitées et examinées dans l'ordre de soumission. Postulez tôt pour être considéré avant que la capacité soit atteinte."
      }
    ]
  },
  "contact": {
    "footerEmail": "training@icubefarm.com",
    "englishPhone": "+237 683 064 880",
    "frenchSpanishPhone": "+240 555 79 65 52"
  },
  "footer": {
    "copyright": "© 2026 Pedagemy. Tous droits réservés."
  },
  "email": {
    "subject": "Candidature reçue — {{course}}",
    "greeting": "Bonjour {{name}},",
    "confirmation": "Votre candidature pour <strong>{{course}}</strong> a été reçue.",
    "timeline": "Nous vous contacterons avec des mises à jour sur le processus de sélection avant le <strong>vendredi 15 mai 2026</strong>.",
    "contactLabel": "Si vous avez des questions d'ici là, contactez-nous :",
    "contactEmail": "training@icubefarm.com",
    "contactEnglishWhatsApp": "+237 683 064 880",
    "contactFrenchSpanishWhatsApp": "+240 555 79 65 52",
    "closing": "Cordialement,",
    "team": "L'équipe Pedagemy"
  }
}
```

- [ ] **Step 3: Create Spanish translation**

```json
// apps/web/public/locales/es/translation.json
{
  "nav": {
    "applyNow": "Aplicar ahora",
    "registrationsOngoing": "Registro de acceso anticipado en curso"
  },
  "hero": {
    "headline": "Gana la mejora profesional que vale $755. Gratis para ti.",
    "subheadline": "La mayoría espera a que su empleador invierta en ellos. Esta es tu oportunidad de llegar primero — totalmente patrocinada, sin costo para ti.",
    "questionLabel": "Una pregunta antes de aplicar",
    "questionPrompt": "¿Cuál de estas movería más las cosas para ti ahora mismo? Elige la que te haga pensar «Lo necesito.»",
    "questionContext": "Alguien va a reclamar esta plaza. Mejor que sea la persona que decidió que hoy era el día.",
    "programmesIncluded": "4 programas incluidos",
    "applyForAccess": "Solicitar acceso",
    "applyCaveat": "Gratis. Revisado personalmente. Abierto a cualquiera listo para crecer."
  },
  "courses": {
    "softSkills": {
      "label": "Acelerador de habilidades blandas",
      "description": [
        "Este programa está diseñado para estudiantes que quieren una amplia base de habilidades laborales actuales.",
        "Cubre liderazgo, comunicación, productividad, transformación digital, alfabetización en datos, Inteligencia Artificial (IA), ciberseguridad, cloud, DevOps, gestión de proyectos, servicio al cliente y desarrollo profesional.",
        "Es útil para estudiantes, profesionales y buscadores de empleo que quieren acceso flexible a muchas rutas de aprendizaje relevantes para su carrera."
      ]
    },
    "techCareer": {
      "label": "Impulso de carrera tech",
      "description": [
        "Este programa está construido para estudiantes que quieren crecer en roles técnicos o fortalecer sus habilidades tech existentes.",
        "Incluye temas como inteligencia artificial, big data, ciencia de datos, aprendizaje automático, business intelligence, Python, Java, SQL, HTML5, GitHub, desarrollo full-stack, computación en la nube, DevOps, ciberseguridad, seguridad de API y seguridad de aplicaciones.",
        "También apoya el aprendizaje práctico a través de cursos interactivos, laboratorios de programación y herramientas de práctica impulsadas por IA."
      ]
    },
    "leadership": {
      "label": "Acelerador de liderazgo",
      "description": [
        "Este programa está diseñado para profesionales que quieren convertirse en líderes más fuertes en el trabajo.",
        "Cubre tres áreas: liderarse a sí mismo, liderar a tu equipo y liderar el negocio.",
        "Los estudiantes exploran presencia ejecutiva, inteligencia emocional, liderazgo ético, construcción de equipos, liderazgo intercultural, coaching, gestión de conflictos, liderazgo orientado al cliente, toma de decisiones, innovación, estrategia y liderazgo en la era de la IA.",
        "Es adecuado para líderes emergentes, gerentes, líderes de equipo y profesionales que se preparan para mayor responsabilidad."
      ]
    },
    "workplaceReadiness": {
      "label": "Preparación laboral",
      "description": [
        "Este programa está diseñado para ayudar a los estudiantes a entender las reglas, responsabilidades y prácticas seguras requeridas en los lugares de trabajo modernos.",
        "Cubre temas legales y de cumplimiento como anti-acoso, código de conducta, ética, privacidad de datos, cumplimiento del RGPD, HIPAA, ciberseguridad y seguridad laboral.",
        "También incluye temas ambientales, de salud y seguridad como ergonomía, seguridad de oficina en casa, sostenibilidad, transporte, seguridad laboral y prácticas laborales post-pandemia.",
        "Es útil para profesionales, buscadores de empleo y organizaciones que quieren una mejor preparación laboral."
      ]
    }
  },
  "form": {
    "title": "Formulario de registro",
    "subtitle": "Todos los campos son obligatorios. Toma menos de 2 minutos.",
    "fullName": "Nombre completo",
    "fullNamePlaceholder": "Tu nombre completo",
    "email": "Correo electrónico",
    "emailPlaceholder": "tu@email.com",
    "phone": "Número de teléfono",
    "phonePlaceholder": "+237 000 000 0000",
    "programme": "Programa",
    "reason": "¿Por qué este programa?",
    "reasonPlaceholder": "Describe cómo este programa se alinea con tus metas de carrera…",
    "submit": "Enviar solicitud",
    "submitting": "Enviando…",
    "successTitle": "Solicitud recibida.",
    "successBody": "Si eres seleccionado, Pedagemy te contactará directamente con las instrucciones de acceso.",
    "noPayment": "No se requiere pago. Los candidatos seleccionados son contactados directamente.",
    "errorRequired": "Todos los campos son obligatorios",
    "errorInvalidEmail": "Dirección de correo inválida",
    "errorGeneric": "Algo salió mal. Por favor intenta de nuevo.",
    "errorNetwork": "Error de red. Por favor intenta de nuevo."
  },
  "photoCard": {
    "statusLabel": "Solicitudes abiertas",
    "subtitle": "Seleccionado por iCUBEFARM",
    "cardHeadline": "Las habilidades en las que los empleadores invierten — ahora disponibles para ti sin costo."
  },
  "stats": {
    "programmes": "Programas",
    "value": "Valor",
    "free": "Gratis"
  },
  "process": {
    "sectionTitle": "Tres pasos de donde estás a donde quieres estar.",
    "sectionSubtitle": "Visualiza la versión de ti mismo al otro lado de esto. Mejor pagado, más seguro, más avanzado. Esa persona dio el primer paso. Tú también puedes.",
    "futureContext": "Tu yo del futuro ya está en esta habitación.",
    "futurePrompt": "La única pregunta es si te presentas.",
    "steps": [
      {
        "n": "01",
        "title": "Aprovecha la oportunidad",
        "body": "Aplica en menos de dos minutos. Dinos qué programa elegiste y por qué importa para ti ahora mismo. Esa decisión sola te pone por delante de todos los que scrollearon."
      },
      {
        "n": "02",
        "title": "Haz el trabajo que te cambia",
        "body": "Completa un programa de clase mundial — la misma formación en la que invierten las organizaciones para sus mejores empleados. Esto no es aprendizaje pasivo. Es la versión de ti que has estado posponiendo."
      },
      {
        "n": "03",
        "title": "Da el paso hacia un futuro diferente",
        "body": "Una promoción que dejaste de esperar. Una conversación salarial que ahora puedes tener. Un movimiento de carrera que finalmente te sientes listo para hacer. Ese futuro comienza en el momento en que terminas el primer paso."
      }
    ]
  },
  "socialProof": {
    "sectionTitle": "Resultados reales de los mismos programas, dentro de organizaciones reales.",
    "outcomes": [
      {
        "outcome": "Primer empleo obtenido",
        "detail": "Los graduados que completaron la formación de iCUBEFARM lograron obtener sus primeros puestos profesionales — en organizaciones que habían estado apuntando durante meses."
      },
      {
        "outcome": "Primera pasantía ganada",
        "detail": "Estudiantes sin experiencia corporativa previa usaron las habilidades de estos programas para competir — y ganar — contra candidatos con CV más largos."
      },
      {
        "outcome": "Promovido desde dentro",
        "detail": "Los empleados que se capacitaron a través de los programas corporativos de iCUBEFARM hicieron válido su caso de ascenso con nuevas habilidades que sus gerentes podían ver."
      },
      {
        "outcome": "Cambió de carrera",
        "detail": "Profesionales que se sentían estancados usaron formación dirigida para pivocar hacia roles mejor pagados y alineados con donde querían estar."
      }
    ],
    "trainingLabel": "Las iniciativas de formación de iCUBEFARM entregadas en organizaciones líderes en África, incluyendo:"
  },
  "faq": {
    "sectionTitle": "Antes de aplicar.",
    "items": [
      {
        "q": "¿Por qué es gratis?",
        "a": "Pedagemy se lanza como una plataforma de e-learning dedicada que se asocia con empresas, instituciones de formación y organismos profesionales en África para hacer accesible el desarrollo profesional. Este es nuestro programa de acceso anticipado — estamos abriendo al público por primera vez la formación que iCUBEFARM ha entregado dentro de corporaciones. No hay trampa. Sin costo para aplicar, sin costo para acceder, sin venta adicional."
      },
      {
        "q": "¿Quién puede aplicar?",
        "a": "Las solicitudes están abiertas para estudiantes, buscadores de empleo y profesionales en cualquier etapa de carrera. No hay restricciones de elegibilidad."
      },
      {
        "q": "¿Qué hace diferentes a estos programas?",
        "a": "Cada uno es de un proveedor de formación profesional establecido — Skillsoft, Codecademy o el currículo de liderazgo propio de iCUBEFARM. Estos son los mismos programas acreditados que las organizaciones compran para el desarrollo de empleados, no contenido genérico de autoestudio."
      },
      {
        "q": "¿Quién es iCUBEFARM?",
        "a": "iCUBEFARM es una organización de desarrollo profesional que curadora formación profesional para estudiantes y profesionales en actividad. Pedagemy es su plataforma de aprendizaje dedicada."
      },
      {
        "q": "¿Cómo se seleccionan los candidatos?",
        "a": "Las solicitudes son revisadas personalmente. Se da prioridad a los candidatos que articulan claramente cómo el programa se alinea con sus metas de carrera específicas."
      },
      {
        "q": "¿Qué pasa después de la selección?",
        "a": "Recibes un correo con las instrucciones de activación. No hay paso de pago — solo tu programa."
      },
      {
        "q": "¿Puedo aplicar a más de un programa?",
        "a": "Cada solicitud cubre un programa. Elige el que mejor se ajuste a tus metas."
      },
      {
        "q": "¿Cuándo se cierra la ventana de selección?",
        "a": "Los asientos son limitados y revisados en orden de envío. Aplica temprano para ser considerado antes de que se alcance la capacidad."
      }
    ]
  },
  "contact": {
    "footerEmail": "training@icubefarm.com",
    "englishPhone": "+237 683 064 880",
    "frenchSpanishPhone": "+240 555 79 65 52"
  },
  "footer": {
    "copyright": "© 2026 Pedagemy. Todos los derechos reservados."
  },
  "email": {
    "subject": "Solicitud recibida — {{course}}",
    "greeting": "Hola {{name}},",
    "confirmation": "Tu solicitud para <strong>{{course}}</strong> ha sido recibida.",
    "timeline": "Te contactaremos con actualizaciones sobre el proceso de selección antes del <strong>viernes 15 de mayo de 2026</strong>.",
    "contactLabel": "Si tienes preguntas antes de entonces, comunícate con nosotros:",
    "contactEmail": "training@icubefarm.com",
    "contactEnglishWhatsApp": "+237 683 064 880",
    "contactFrenchSpanishWhatsApp": "+240 555 79 65 52",
    "closing": "Saludos cordiales,",
    "team": "El equipo de Pedagemy"
  }
}
```

---

## Task 4: Create middleware for locale detection

**Files:**

- Create: `apps/web/middleware.ts`

- [ ] **Step 1: Create middleware**

```typescript
// apps/web/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const LOCALES = ["en", "fr", "es"] as const
const DEFAULT_LOCALE = "en"

function getLocale(request: NextRequest): string {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  const segments = pathname.split("/")
  const maybeLocale = segments[1]
  if (
    maybeLocale &&
    LOCALES.includes(maybeLocale as (typeof LOCALES)[number])
  ) {
    return maybeLocale
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (
    cookieLocale &&
    LOCALES.includes(cookieLocale as (typeof LOCALES)[number])
  ) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get("Accept-Language") ?? ""
  const preferred = acceptLanguage.split(",")[0]?.split("-")[0]?.toLowerCase()
  if (preferred && LOCALES.includes(preferred as (typeof LOCALES)[number])) {
    return preferred
  }

  return DEFAULT_LOCALE
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  const locale = getLocale(request)

  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`

  const response = NextResponse.redirect(newUrl)
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
```

---

## Task 5: Update root layout with i18n provider and lang attribute

**Files:**

- Modify: `apps/web/app/layout.tsx`

- [ ] **Step 1: Update layout**

```typescript
// apps/web/app/layout.tsx
import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import "./i18n"
import { I18nProvider } from "@/components/i18n-provider"

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }]
}

export const metadata: Metadata = {
  title: {
    default: "Pedagemy — Sponsored Career Programme Access",
    template: "%s | Pedagemy",
  },
  description:
    "Pedagemy and iCUBEFARM are awarding sponsored access to four premium workplace learning programmes. Apply free — reviewed personally.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
})

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, dmSans.variable)}
    >
      <body>
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## Task 6: Create I18nProvider component

**Files:**

- Create: `apps/web/components/i18n-provider.tsx`

- [ ] **Step 1: Create I18nProvider**

```typescript
// apps/web/components/i18n-provider.tsx
"use client"

import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export function I18nProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
```

---

## Task 7: Create LanguageSwitcher component

**Files:**

- Create: `apps/web/components/language-switcher.tsx`

- [ ] **Step 1: Create LanguageSwitcher**

```typescript
// apps/web/components/language-switcher.tsx
"use client"

import { useTranslation } from "react-i18next"

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = (locale: string) => {
    i18n.changeLanguage(locale)
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
    window.location.href = `/${locale}`
  }

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors duration-200 ${
            i18n.language === lang.code
              ? "bg-[#0056D2] text-white"
              : "text-[#1A1A2E]/40 hover:text-[#0056D2]"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
```

---

## Task 8: Update landing-page.tsx to use translations

**Files:**

- Modify: `apps/web/components/landing-page.tsx` (full refactor from hardcoded strings to `t()`)

- [ ] **Step 1: Add imports**

Add at the top of the file:

```typescript
import { useTranslation } from "react-i18next"
```

- [ ] **Step 2: Replace hardcoded strings with t() calls**

This is the most extensive task. Every hardcoded string on the page is replaced with `t("key")`. The `courseOptions` descriptions are replaced with `t("courses.xxx.description")` arrays.

Key changes:

- Add `const { t } = useTranslation()` inside `PedagemyEarlyAccessLandingPage`
- `courseOptions` descriptions pulled from translations: `t("courses.softSkills.description", { returnObjects: true })`
- All UI text replaced with translation keys
- The `LanguageSwitcher` component added to the nav bar next to "Apply Now"

- [ ] **Step 3: Add LanguageSwitcher to nav**

In the nav section, add `LanguageSwitcher` component and replace hardcoded nav strings with `t("nav.applyNow")` and `t("nav.registrationsOngoing")`.

---

## Task 9: Update registration route to send email in user's locale

**Files:**

- Modify: `apps/web/app/api/register/route.ts`

- [ ] **Step 1: Update registration to accept and store locale, send email in user's language**

```typescript
// apps/web/app/api/register/route.ts (revised)
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getRaffleStore } from "@/lib/raffle-store"
import { getTranslations } from "next-intl/server"

const resend = new Resend(process.env.RESEND_API_KEY)

interface RegisterBody {
  course: string
  email: string
  name: string
  phone: string
  reason: string
  locale?: string
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type EmailContent = {
  subject: string
  greeting: string
  confirmation: string
  timeline: string
  contactLabel: string
  contactEmail: string
  contactEnglishWhatsApp: string
  contactFrenchSpanishWhatsApp: string
  closing: string
  team: string
}

const emailContent: Record<string, EmailContent> = {
  en: {
    subject: "Application received — {{course}}",
    greeting: "Hi {{name}},",
    confirmation:
      "Your application for <strong>{{course}}</strong> has been received.",
    timeline:
      "We will reach out to you with updates on the selection process by <strong>Friday, May 15, 2026</strong>.",
    contactLabel: "If you have any questions before then, reach out to us:",
    contactEmail: "training@icubefarm.com",
    contactEnglishWhatsApp: "+237 683 064 880",
    contactFrenchSpanishWhatsApp: "+240 555 79 65 52",
    closing: "Best regards,",
    team: "The Pedagemy Team",
  },
  fr: {
    subject: "Candidature reçue — {{course}}",
    greeting: "Bonjour {{name}},",
    confirmation:
      "Votre candidature pour <strong>{{course}}</strong> a été reçue.",
    timeline:
      "Nous vous contacterons avec des mises à jour sur le processus de sélection avant le <strong>vendredi 15 mai 2026</strong>.",
    contactLabel: "Si vous avez des questions d'ici là, contactez-nous :",
    contactEmail: "training@icubefarm.com",
    contactEnglishWhatsApp: "+237 683 064 880",
    contactFrenchSpanishWhatsApp: "+240 555 79 65 52",
    closing: "Cordialement,",
    team: "L'équipe Pedagemy",
  },
  es: {
    subject: "Solicitud recibida — {{course}}",
    greeting: "Hola {{name}},",
    confirmation:
      "Tu solicitud para <strong>{{course}}</strong> ha sido recibida.",
    timeline:
      "Te contactaremos con actualizaciones sobre el proceso de selección antes del <strong>viernes 15 de mayo de 2026</strong>.",
    contactLabel:
      "Si tienes preguntas antes de entonces, comunícate con nosotros:",
    contactEmail: "training@icubefarm.com",
    contactEnglishWhatsApp: "+237 683 064 880",
    contactFrenchSpanishWhatsApp: "+240 555 79 65 52",
    closing: "Saludos cordiales,",
    team: "El equipo de Pedagemy",
  },
}

function buildEmailHtml(
  content: EmailContent,
  name: string,
  course: string
): string {
  return `
    <p>${content.greeting.replace("{{name}}", name)},</p>
    <p>${content.confirmation.replace("{{course}}", course)}</p>
    <p>${content.timeline}</p>
    <p>${content.contactLabel}</p>
    <ul>
      <li>Email: <a href="mailto:${content.contactEmail}">${content.contactEmail}</a></li>
      <li>WhatsApp (English): <a href="https://wa.me/237683064880">${content.contactEnglishWhatsApp}</a></li>
      <li>WhatsApp (French/Spanish): <a href="https://wa.me/240555796552">${content.contactFrenchSpanishWhatsApp}</a></li>
    </ul>
    <p>${content.closing}<br/>${content.team}</p>
  `
}

export async function POST(request: Request) {
  let body: RegisterBody

  try {
    body = (await request.json()) as RegisterBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (
    !isNonEmpty(body.name) ||
    !isNonEmpty(body.phone) ||
    !isNonEmpty(body.email) ||
    !isNonEmpty(body.course) ||
    !isNonEmpty(body.reason)
  ) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    )
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    )
  }

  const locale =
    body.locale && ["en", "fr", "es"].includes(body.locale) ? body.locale : "en"

  try {
    getRaffleStore().saveRegistration({ ...body, locale })

    const content = emailContent[locale]
    const subject = content.subject.replace("{{course}}", body.course)
    const html = buildEmailHtml(content, body.name, body.course)

    const { error } = await resend.emails.send(
      {
        from: "Pedagemy <onboarding@resend.dev>",
        to: [body.email],
        cc: ["training@icubefarm.com"],
        subject,
        html,
      },
      {
        idempotencyKey: `registration-confirmation/${body.email}/${body.course}`,
      }
    )

    if (error) {
      console.error("Failed to send confirmation email:", error.message)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to process registration", error)
    return NextResponse.json(
      { error: "Failed to process registration" },
      { status: 500 }
    )
  }
}
```

---

## Task 10: Add language switcher to the landing page nav

**Files:**

- Modify: `apps/web/components/landing-page.tsx` (nav section)

- [ ] **Step 1: Add LanguageSwitcher to nav**

In the sticky nav, add the LanguageSwitcher component between the status label and the Apply Now button.

---

## Task 11: Ensure form passes locale to API

**Files:**

- Modify: `apps/web/components/landing-page.tsx` (form submission)

- [ ] **Step 1: Include locale in form payload**

In `handleSubmit`, add `locale: i18n.language` to the payload sent to `/api/register`.

---

## Verification Steps

- [ ] Run `cd apps/web && bun run typecheck` — no type errors
- [ ] Run `bun run dev` — site loads in all three locales (`/en/`, `/fr/`, `/es/`)
- [ ] Language switcher changes locale, persists across page refresh
- [ ] Submit form in French — email arrives in French
- [ ] Submit form in Spanish — email arrives in Spanish
- [ ] Submit form in English — email arrives in English
- [ ] Middleware correctly redirects root to detected locale
- [ ] No hardcoded English strings remain in landing-page.tsx
