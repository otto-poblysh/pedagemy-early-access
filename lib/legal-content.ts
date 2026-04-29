export type LegalLocale = "en" | "fr" | "es"

type LegalSection = {
  title: string
  paragraphs: string[]
}

type LegalDocument = {
  backLabel: string
  contactLabel: string
  description: string
  intro: string[]
  sections: LegalSection[]
  title: string
  updatedAt: string
}

type LegalContentEntry = {
  privacy: LegalDocument
  terms: LegalDocument
}

export function normalizeLegalLocale(locale: string): LegalLocale {
  const baseLocale = locale.trim().toLowerCase().split("-")[0]

  if (baseLocale === "fr" || baseLocale === "es") {
    return baseLocale
  }

  return "en"
}

const legalContent: Record<LegalLocale, LegalContentEntry> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      description:
        "How Pedagemy collects, uses, stores, and protects data submitted through the early-access registration and raffle flow.",
      updatedAt: "Last updated: April 29, 2026",
      backLabel: "Back to registration",
      contactLabel: "Questions about privacy? Contact info@pedagemy.com.",
      intro: [
        "This Privacy Policy explains how Pedagemy, together with iCUBEFARM, handles personal information collected through this site and the early-access raffle registration form.",
        "By using this site or submitting an application, you agree to the practices described here."
      ],
      sections: [
        {
          title: "1. Information We Collect",
          paragraphs: [
            "We collect the information you submit directly to us, including your full name, email address, mobile phone number, selected programme, written motivation, preferred language, and confirmation that you accepted the legal terms.",
            "We also collect basic technical information needed to operate and improve the site, such as browser data, device information, IP address, referral information, and analytics events including LinkedIn Insight tracking."
          ]
        },
        {
          title: "2. How We Use Your Information",
          paragraphs: [
            "We use your information to review applications, administer the raffle or contest selection process, prevent duplicate or fraudulent entries, communicate with you about your application, and deliver access instructions if you are selected.",
            "We may also use aggregate or limited event data to understand campaign performance, improve the registration experience, and measure advertising effectiveness."
          ]
        },
        {
          title: "3. Legal Basis and Consent",
          paragraphs: [
            "We process your registration data because it is necessary to administer the early-access promotion you asked to enter and because you consent to the collection and use described in this policy when you submit the form.",
            "If you do not provide the required information or do not accept these terms, we cannot process your registration."
          ]
        },
        {
          title: "4. Sharing of Information",
          paragraphs: [
            "We may share your information with service providers who help us operate the site and registration workflow, including hosting, analytics, email delivery, and database infrastructure providers. They may process data only for the services they provide to us.",
            "We may disclose information when required by law, to enforce our legal rights, or to investigate abuse, fraud, or security incidents."
          ]
        },
        {
          title: "5. Data Retention",
          paragraphs: [
            "We retain registration records for as long as reasonably necessary to administer the promotion, resolve disputes, comply with legal obligations, and keep an internal record of programme interest and prior participation.",
            "If you ask us to delete your information, we will review the request and remove information unless we need to keep certain records for legal, security, or operational reasons."
          ]
        },
        {
          title: "6. Your Choices and Rights",
          paragraphs: [
            "You may request access to, correction of, or deletion of the personal information you submitted by contacting info@pedagemy.com.",
            "You may also opt out of marketing or follow-up communications at any time, although we may still send essential messages relating to your application status."
          ]
        },
        {
          title: "7. Cookies and Analytics",
          paragraphs: [
            "This site may use cookies, similar technologies, and third-party analytics tools to understand visits, conversions, and ad performance. That includes LinkedIn Insight Tag for campaign measurement.",
            "You can control some tracking through your browser settings or ad-platform preferences, but disabling those tools may reduce site functionality or reporting accuracy."
          ]
        },
        {
          title: "8. Security",
          paragraphs: [
            "We use reasonable administrative, technical, and organizational measures to protect personal information, but no method of transmission or storage is completely secure.",
            "You should avoid submitting sensitive information that is not requested through the registration form."
          ]
        },
        {
          title: "9. International Use",
          paragraphs: [
            "Pedagemy serves applicants across multiple countries. By using this site, you understand that your information may be processed in jurisdictions where Pedagemy, iCUBEFARM, or their service providers operate.",
            "Where needed, we will take reasonable steps to protect transferred data in line with applicable law."
          ]
        },
        {
          title: "10. Contact",
          paragraphs: [
            "For questions about this Privacy Policy or your personal information, contact Pedagemy at info@pedagemy.com."
          ]
        }
      ]
    },
    terms: {
      title: "Terms and Conditions",
      description:
        "Rules governing Pedagemy early-access registrations, including the raffle or contest selection process, eligibility, and participant responsibilities.",
      updatedAt: "Last updated: April 29, 2026",
      backLabel: "Back to registration",
      contactLabel: "Questions about these terms? Contact info@pedagemy.com.",
      intro: [
        "These Terms and Conditions govern access to the Pedagemy early-access registration site and participation in the related promotional raffle or contest administered with iCUBEFARM.",
        "By using this site or submitting an application, you agree to these terms."
      ],
      sections: [
        {
          title: "1. Promoter",
          paragraphs: [
            "This promotion is operated by Pedagemy in collaboration with iCUBEFARM. References to Pedagemy, we, our, or us in these terms refer to the organizer of the site and promotion."
          ]
        },
        {
          title: "2. Nature of the Promotion",
          paragraphs: [
            "The site offers users the opportunity to register for consideration in an early-access promotional selection for sponsored learning programmes. Depending on campaign operations, selection may include raffle-style draws, merit-based review, or a combination of both.",
            "Submitting an application does not guarantee selection, programme access, a prize, employment, or any commercial relationship with Pedagemy or iCUBEFARM."
          ]
        },
        {
          title: "3. Eligibility",
          paragraphs: [
            "Applicants must submit accurate, complete information and must be legally allowed to participate under the laws that apply to them. If local law restricts participation in raffles, contests, or promotional giveaways, you must not enter.",
            "Employees, contractors, or direct agents of Pedagemy or iCUBEFARM may be excluded from specific promotional rounds at our discretion."
          ]
        },
        {
          title: "4. No Purchase Necessary",
          paragraphs: [
            "No purchase, payment, or fee is required to submit an application or be considered for selection.",
            "Any attempt to buy, barter, or otherwise secure preferential treatment may result in immediate disqualification."
          ]
        },
        {
          title: "5. Entry Rules",
          paragraphs: [
            "Unless we state otherwise for a specific campaign, only one entry per person and per email address is permitted. Duplicate, automated, bulk, misleading, incomplete, or fraudulent entries may be rejected or removed.",
            "You are responsible for ensuring that your contact details remain valid and that your application explains your interest honestly."
          ]
        },
        {
          title: "6. Selection and Notification",
          paragraphs: [
            "Pedagemy may review entries manually, score them against programme fit, use raffle mechanics, or combine both methods depending on the campaign described on the site.",
            "Selected applicants will generally be contacted by email using the address provided in the form. If we cannot reach you within a reasonable period, we may withdraw the offer and select another applicant."
          ]
        },
        {
          title: "7. Programme Access and Restrictions",
          paragraphs: [
            "Any access, scholarship, sponsored seat, or promotional benefit awarded through the site is personal to the selected applicant and may not be sold, transferred, exchanged for cash, or reassigned without our written permission.",
            "Programme providers may impose separate learning-platform rules, availability limits, schedules, or access conditions."
          ]
        },
        {
          title: "8. Disqualification and Changes",
          paragraphs: [
            "We may suspend, reject, cancel, or disqualify any entry that violates these terms, contains false information, attempts to manipulate the process, or creates legal or reputational risk.",
            "We may update, pause, or end the promotion or change programme details where reasonably necessary, including where capacity, provider availability, fraud, platform failure, or legal requirements make changes necessary."
          ]
        },
        {
          title: "9. Liability",
          paragraphs: [
            "To the fullest extent allowed by law, Pedagemy and iCUBEFARM are not liable for lost entries, delayed messages, platform outages, third-party service failures, or indirect losses arising from use of the site or participation in the promotion.",
            "Nothing in these terms limits liability that cannot lawfully be excluded."
          ]
        },
        {
          title: "10. Privacy",
          paragraphs: [
            "Your use of the site and participation in the promotion are also governed by the Privacy Policy published on this site."
          ]
        },
        {
          title: "11. Governing Law",
          paragraphs: [
            "These terms are intended to be interpreted in a commercially reasonable manner consistent with applicable law. Unless mandatory local law requires otherwise, disputes relating to the site or promotion will be handled under the laws of Cameroon.",
            "You are responsible for ensuring that your participation is lawful in your own jurisdiction."
          ]
        }
      ]
    }
  },
  fr: {
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Comment Pedagemy collecte, utilise, conserve et protège les données soumises via l'inscription en accès anticipé et le tirage promotionnel.",
      updatedAt: "Dernière mise à jour : 29 avril 2026",
      backLabel: "Retour à l'inscription",
      contactLabel: "Questions sur la confidentialité ? Contactez info@pedagemy.com.",
      intro: [
        "Cette Politique de confidentialité explique comment Pedagemy, avec iCUBEFARM, traite les informations personnelles collectées sur ce site et via le formulaire d'inscription au tirage d'accès anticipé.",
        "En utilisant ce site ou en soumettant une candidature, vous acceptez les pratiques décrites ici."
      ],
      sections: [
        {
          title: "1. Informations que nous collectons",
          paragraphs: [
            "Nous collectons les informations que vous nous fournissez directement, notamment votre nom complet, votre adresse e-mail, votre numéro de téléphone mobile, le programme choisi, votre motivation écrite, votre langue préférée et la confirmation de votre acceptation des conditions légales.",
            "Nous collectons également des informations techniques de base nécessaires au fonctionnement et à l'amélioration du site, telles que les données du navigateur, les informations sur l'appareil, l'adresse IP, la provenance et les événements d'analyse, y compris le suivi LinkedIn Insight."
          ]
        },
        {
          title: "2. Utilisation de vos informations",
          paragraphs: [
            "Nous utilisons vos informations pour examiner les candidatures, administrer le processus de sélection du tirage ou du concours, prévenir les candidatures frauduleuses ou en double, communiquer avec vous au sujet de votre candidature et vous envoyer les instructions d'accès si vous êtes sélectionné.",
            "Nous pouvons également utiliser des données agrégées ou limitées sur les événements pour comprendre la performance de la campagne, améliorer l'expérience d'inscription et mesurer l'efficacité publicitaire."
          ]
        },
        {
          title: "3. Base légale et consentement",
          paragraphs: [
            "Nous traitons vos données d'inscription parce qu'elles sont nécessaires pour administrer la promotion d'accès anticipé à laquelle vous souhaitez participer et parce que vous consentez à la collecte et à l'utilisation décrites dans cette politique lorsque vous soumettez le formulaire.",
            "Si vous ne fournissez pas les informations requises ou si vous n'acceptez pas ces conditions, nous ne pouvons pas traiter votre inscription."
          ]
        },
        {
          title: "4. Partage des informations",
          paragraphs: [
            "Nous pouvons partager vos informations avec des prestataires qui nous aident à exploiter le site et le flux d'inscription, notamment les fournisseurs d'hébergement, d'analyse, d'envoi d'e-mails et d'infrastructure de base de données. Ils ne peuvent traiter les données que pour les services qu'ils nous fournissent.",
            "Nous pouvons divulguer des informations lorsque la loi l'exige, pour faire valoir nos droits, ou pour enquêter sur des abus, des fraudes ou des incidents de sécurité."
          ]
        },
        {
          title: "5. Conservation des données",
          paragraphs: [
            "Nous conservons les dossiers d'inscription aussi longtemps que raisonnablement nécessaire pour administrer la promotion, résoudre des litiges, respecter nos obligations légales et conserver un historique interne de l'intérêt pour les programmes et des participations antérieures.",
            "Si vous nous demandez de supprimer vos informations, nous examinerons la demande et supprimerons les données sauf si certaines informations doivent être conservées pour des raisons légales, de sécurité ou d'exploitation."
          ]
        },
        {
          title: "6. Vos choix et vos droits",
          paragraphs: [
            "Vous pouvez demander l'accès, la correction ou la suppression des informations personnelles que vous avez soumises en contactant info@pedagemy.com.",
            "Vous pouvez également vous désabonner des communications marketing ou de suivi à tout moment, même si nous pouvons continuer à envoyer des messages essentiels concernant l'état de votre candidature."
          ]
        },
        {
          title: "7. Cookies et analyses",
          paragraphs: [
            "Ce site peut utiliser des cookies, des technologies similaires et des outils d'analyse tiers pour comprendre les visites, les conversions et la performance publicitaire. Cela inclut LinkedIn Insight Tag pour la mesure des campagnes.",
            "Vous pouvez contrôler certains suivis via les paramètres de votre navigateur ou les préférences des plateformes publicitaires, mais la désactivation de ces outils peut réduire certaines fonctionnalités du site ou la précision des rapports."
          ]
        },
        {
          title: "8. Sécurité",
          paragraphs: [
            "Nous utilisons des mesures administratives, techniques et organisationnelles raisonnables pour protéger les informations personnelles, mais aucune méthode de transmission ou de stockage n'est totalement sûre.",
            "Vous devez éviter de soumettre via le formulaire des informations sensibles qui ne sont pas demandées."
          ]
        },
        {
          title: "9. Utilisation internationale",
          paragraphs: [
            "Pedagemy accueille des candidats de plusieurs pays. En utilisant ce site, vous comprenez que vos informations peuvent être traitées dans des juridictions où Pedagemy, iCUBEFARM ou leurs prestataires opèrent.",
            "Lorsque cela est nécessaire, nous prendrons des mesures raisonnables pour protéger les données transférées conformément au droit applicable."
          ]
        },
        {
          title: "10. Contact",
          paragraphs: [
            "Pour toute question concernant cette Politique de confidentialité ou vos informations personnelles, contactez Pedagemy à info@pedagemy.com."
          ]
        }
      ]
    },
    terms: {
      title: "Conditions générales",
      description:
        "Règles applicables aux inscriptions en accès anticipé Pedagemy, y compris le processus de tirage ou de concours, l'éligibilité et les responsabilités des participants.",
      updatedAt: "Dernière mise à jour : 29 avril 2026",
      backLabel: "Retour à l'inscription",
      contactLabel: "Questions sur ces conditions ? Contactez info@pedagemy.com.",
      intro: [
        "Les présentes Conditions générales régissent l'accès au site d'inscription en accès anticipé de Pedagemy et la participation à la promotion associée, administrée avec iCUBEFARM.",
        "En utilisant ce site ou en soumettant une candidature, vous acceptez ces conditions."
      ],
      sections: [
        {
          title: "1. Organisateur",
          paragraphs: [
            "Cette promotion est exploitée par Pedagemy en collaboration avec iCUBEFARM. Les références à Pedagemy, nous, notre ou nos dans ces conditions désignent l'organisateur du site et de la promotion."
          ]
        },
        {
          title: "2. Nature de la promotion",
          paragraphs: [
            "Le site offre aux utilisateurs la possibilité de s'inscrire pour être considérés dans une sélection promotionnelle d'accès anticipé à des programmes de formation sponsorisés. Selon le fonctionnement de la campagne, la sélection peut inclure un tirage au sort, une revue au mérite, ou une combinaison des deux.",
            "Le dépôt d'une candidature ne garantit ni sélection, ni accès au programme, ni prix, ni relation commerciale avec Pedagemy ou iCUBEFARM."
          ]
        },
        {
          title: "3. Éligibilité",
          paragraphs: [
            "Les candidats doivent fournir des informations exactes et complètes et doivent être légalement autorisés à participer en vertu des lois qui leur sont applicables. Si votre droit local limite la participation aux tirages, concours ou cadeaux promotionnels, vous ne devez pas participer.",
            "Les employés, prestataires ou agents directs de Pedagemy ou d'iCUBEFARM peuvent être exclus de certaines vagues promotionnelles à notre discrétion."
          ]
        },
        {
          title: "4. Aucun achat nécessaire",
          paragraphs: [
            "Aucun achat, paiement ou frais n'est requis pour soumettre une candidature ou être pris en considération pour une sélection.",
            "Toute tentative d'acheter, de négocier ou d'obtenir un traitement préférentiel peut entraîner une disqualification immédiate."
          ]
        },
        {
          title: "5. Règles d'inscription",
          paragraphs: [
            "Sauf indication contraire pour une campagne spécifique, une seule participation par personne et par adresse e-mail est autorisée. Les candidatures multiples, automatisées, massives, trompeuses, incomplètes ou frauduleuses peuvent être rejetées ou supprimées.",
            "Vous êtes responsable du maintien de la validité de vos coordonnées et de la sincérité de votre explication d'intérêt."
          ]
        },
        {
          title: "6. Sélection et notification",
          paragraphs: [
            "Pedagemy peut examiner les candidatures manuellement, les évaluer selon l'adéquation au programme, utiliser des mécanismes de tirage, ou combiner ces méthodes selon la campagne décrite sur le site.",
            "Les candidats sélectionnés seront généralement contactés par e-mail à l'adresse fournie dans le formulaire. Si nous ne pouvons pas vous joindre dans un délai raisonnable, nous pouvons retirer l'offre et sélectionner un autre candidat."
          ]
        },
        {
          title: "7. Accès au programme et restrictions",
          paragraphs: [
            "Tout accès, bourse, place sponsorisée ou avantage promotionnel accordé via le site est personnel au candidat sélectionné et ne peut être vendu, transféré, échangé contre de l'argent ou réattribué sans notre autorisation écrite.",
            "Les fournisseurs de programme peuvent imposer leurs propres règles de plateforme, limites de disponibilité, calendriers ou conditions d'accès."
          ]
        },
        {
          title: "8. Disqualification et changements",
          paragraphs: [
            "Nous pouvons suspendre, rejeter, annuler ou disqualifier toute participation qui viole ces conditions, contient de fausses informations, tente de manipuler le processus ou crée un risque juridique ou réputationnel.",
            "Nous pouvons mettre à jour, suspendre ou arrêter la promotion ou modifier les détails du programme lorsque cela est raisonnablement nécessaire, notamment en cas de capacité limitée, de disponibilité du fournisseur, de fraude, de défaillance technique ou d'exigences légales."
          ]
        },
        {
          title: "9. Responsabilité",
          paragraphs: [
            "Dans toute la mesure permise par la loi, Pedagemy et iCUBEFARM ne sont pas responsables des candidatures perdues, des messages retardés, des indisponibilités de plateforme, des défaillances de services tiers ou des pertes indirectes résultant de l'utilisation du site ou de la participation à la promotion.",
            "Aucune disposition des présentes ne limite une responsabilité qui ne peut pas être légalement exclue."
          ]
        },
        {
          title: "10. Confidentialité",
          paragraphs: [
            "Votre utilisation du site et votre participation à la promotion sont également régies par la Politique de confidentialité publiée sur ce site."
          ]
        },
        {
          title: "11. Droit applicable",
          paragraphs: [
            "Ces conditions doivent être interprétées de manière commercialement raisonnable conformément au droit applicable. Sauf disposition impérative contraire de votre droit local, les litiges relatifs au site ou à la promotion seront régis par le droit camerounais.",
            "Il vous appartient de vérifier que votre participation est licite dans votre propre juridiction."
          ]
        }
      ]
    }
  },
  es: {
    privacy: {
      title: "Aviso de privacidad",
      description:
        "Cómo Pedagemy recopila, usa, conserva y protege los datos enviados a través del registro de acceso anticipado y del sorteo promocional.",
      updatedAt: "Última actualización: 29 de abril de 2026",
      backLabel: "Volver al registro",
      contactLabel: "¿Preguntas sobre privacidad? Escribe a info@pedagemy.com.",
      intro: [
        "Este Aviso de privacidad explica cómo Pedagemy, junto con iCUBEFARM, trata la información personal recopilada a través de este sitio y del formulario de registro del sorteo de acceso anticipado.",
        "Al usar este sitio o enviar una solicitud, aceptas las prácticas descritas aquí."
      ],
      sections: [
        {
          title: "1. Información que recopilamos",
          paragraphs: [
            "Recopilamos la información que nos envías directamente, incluyendo tu nombre completo, correo electrónico, número de teléfono móvil, programa seleccionado, motivación escrita, idioma preferido y la confirmación de que aceptaste las condiciones legales.",
            "También recopilamos información técnica básica necesaria para operar y mejorar el sitio, como datos del navegador, información del dispositivo, dirección IP, origen de referencia y eventos analíticos, incluido el seguimiento de LinkedIn Insight."
          ]
        },
        {
          title: "2. Cómo usamos tu información",
          paragraphs: [
            "Usamos tu información para revisar solicitudes, administrar el proceso de selección del sorteo o concurso, evitar registros duplicados o fraudulentos, comunicarnos contigo sobre tu solicitud y enviarte instrucciones de acceso si resultas seleccionado.",
            "También podemos usar datos agregados o limitados de eventos para entender el rendimiento de la campaña, mejorar la experiencia de registro y medir la eficacia publicitaria."
          ]
        },
        {
          title: "3. Base legal y consentimiento",
          paragraphs: [
            "Tratamos tus datos de registro porque son necesarios para administrar la promoción de acceso anticipado en la que solicitaste participar y porque aceptas la recopilación y el uso descritos en este aviso cuando envías el formulario.",
            "Si no proporcionas la información requerida o no aceptas estas condiciones, no podremos procesar tu registro."
          ]
        },
        {
          title: "4. Compartición de información",
          paragraphs: [
            "Podemos compartir tu información con proveedores que nos ayudan a operar el sitio y el flujo de registro, incluyendo proveedores de hosting, analítica, envío de correo e infraestructura de base de datos. Solo podrán procesar datos para los servicios que nos prestan.",
            "Podemos divulgar información cuando la ley lo exija, para hacer valer nuestros derechos o para investigar abusos, fraude o incidentes de seguridad."
          ]
        },
        {
          title: "5. Conservación de datos",
          paragraphs: [
            "Conservamos los registros de inscripción durante el tiempo razonablemente necesario para administrar la promoción, resolver disputas, cumplir obligaciones legales y mantener un registro interno del interés por los programas y de la participación anterior.",
            "Si nos pides eliminar tu información, revisaremos la solicitud y eliminaremos los datos salvo que debamos conservar ciertos registros por razones legales, de seguridad u operativas."
          ]
        },
        {
          title: "6. Tus opciones y derechos",
          paragraphs: [
            "Puedes solicitar acceso, corrección o eliminación de la información personal que enviaste escribiendo a info@pedagemy.com.",
            "También puedes darte de baja de comunicaciones promocionales o de seguimiento en cualquier momento, aunque podremos seguir enviando mensajes esenciales sobre el estado de tu solicitud."
          ]
        },
        {
          title: "7. Cookies y analítica",
          paragraphs: [
            "Este sitio puede usar cookies, tecnologías similares y herramientas analíticas de terceros para entender visitas, conversiones y rendimiento publicitario. Eso incluye LinkedIn Insight Tag para medición de campañas.",
            "Puedes controlar parte del seguimiento mediante la configuración de tu navegador o las preferencias de las plataformas publicitarias, pero desactivar esas herramientas puede reducir algunas funciones del sitio o la precisión de los reportes."
          ]
        },
        {
          title: "8. Seguridad",
          paragraphs: [
            "Usamos medidas administrativas, técnicas y organizativas razonables para proteger la información personal, pero ningún método de transmisión o almacenamiento es completamente seguro.",
            "Debes evitar enviar información sensible que no sea solicitada a través del formulario de registro."
          ]
        },
        {
          title: "9. Uso internacional",
          paragraphs: [
            "Pedagemy recibe postulantes de varios países. Al usar este sitio, entiendes que tu información puede procesarse en jurisdicciones donde operan Pedagemy, iCUBEFARM o sus proveedores de servicios.",
            "Cuando sea necesario, tomaremos medidas razonables para proteger los datos transferidos de acuerdo con la ley aplicable."
          ]
        },
        {
          title: "10. Contacto",
          paragraphs: [
            "Si tienes preguntas sobre este Aviso de privacidad o sobre tu información personal, contacta a Pedagemy en info@pedagemy.com."
          ]
        }
      ]
    },
    terms: {
      title: "Términos y condiciones",
      description:
        "Reglas que rigen los registros de acceso anticipado de Pedagemy, incluido el proceso de sorteo o concurso, la elegibilidad y las responsabilidades de participación.",
      updatedAt: "Última actualización: 29 de abril de 2026",
      backLabel: "Volver al registro",
      contactLabel: "¿Preguntas sobre estos términos? Escribe a info@pedagemy.com.",
      intro: [
        "Estos Términos y condiciones rigen el acceso al sitio de registro de acceso anticipado de Pedagemy y la participación en la promoción relacionada administrada con iCUBEFARM.",
        "Al usar este sitio o enviar una solicitud, aceptas estos términos."
      ],
      sections: [
        {
          title: "1. Organizador",
          paragraphs: [
            "Esta promoción es operada por Pedagemy en colaboración con iCUBEFARM. Las referencias a Pedagemy, nosotros, nuestro o nos en estos términos se refieren al organizador del sitio y de la promoción."
          ]
        },
        {
          title: "2. Naturaleza de la promoción",
          paragraphs: [
            "El sitio ofrece a los usuarios la oportunidad de registrarse para ser considerados en una selección promocional de acceso anticipado a programas de aprendizaje patrocinados. Según la operación de la campaña, la selección puede incluir mecánicas de sorteo, revisión por mérito o una combinación de ambas.",
            "Enviar una solicitud no garantiza selección, acceso al programa, premio, empleo ni relación comercial alguna con Pedagemy o iCUBEFARM."
          ]
        },
        {
          title: "3. Elegibilidad",
          paragraphs: [
            "Los postulantes deben enviar información exacta y completa y deben poder participar legalmente conforme a las leyes que les resulten aplicables. Si la normativa local restringe la participación en sorteos, concursos o promociones, no debes participar.",
            "Los empleados, contratistas o agentes directos de Pedagemy o iCUBEFARM pueden quedar excluidos de determinadas rondas promocionales a nuestra discreción."
          ]
        },
        {
          title: "4. No es necesaria compra",
          paragraphs: [
            "No se requiere compra, pago ni tarifa para enviar una solicitud o ser considerado para selección.",
            "Cualquier intento de comprar, negociar u obtener trato preferencial puede dar lugar a descalificación inmediata."
          ]
        },
        {
          title: "5. Reglas de participación",
          paragraphs: [
            "Salvo que indiquemos otra cosa para una campaña específica, solo se permite una participación por persona y por correo electrónico. Las solicitudes duplicadas, automatizadas, masivas, engañosas, incompletas o fraudulentas pueden rechazarse o eliminarse.",
            "Eres responsable de que tus datos de contacto sigan siendo válidos y de explicar tu interés con veracidad."
          ]
        },
        {
          title: "6. Selección y notificación",
          paragraphs: [
            "Pedagemy puede revisar entradas manualmente, puntuarlas según su ajuste al programa, usar mecánicas de sorteo o combinar estos métodos según la campaña descrita en el sitio.",
            "Por lo general, las personas seleccionadas serán contactadas por correo electrónico a la dirección proporcionada en el formulario. Si no podemos localizarte dentro de un plazo razonable, podremos retirar la oferta y seleccionar a otra persona."
          ]
        },
        {
          title: "7. Acceso al programa y restricciones",
          paragraphs: [
            "Cualquier acceso, beca, cupo patrocinado o beneficio promocional otorgado a través del sitio es personal para la persona seleccionada y no puede venderse, transferirse, canjearse por dinero ni reasignarse sin nuestra autorización escrita.",
            "Los proveedores de programas pueden imponer reglas separadas de plataforma, límites de disponibilidad, calendarios o condiciones de acceso."
          ]
        },
        {
          title: "8. Descalificación y cambios",
          paragraphs: [
            "Podemos suspender, rechazar, cancelar o descalificar cualquier participación que infrinja estos términos, contenga información falsa, intente manipular el proceso o genere riesgo legal o reputacional.",
            "Podemos actualizar, pausar o finalizar la promoción o cambiar detalles del programa cuando sea razonablemente necesario, incluso por capacidad, disponibilidad del proveedor, fraude, fallos de plataforma o exigencias legales."
          ]
        },
        {
          title: "9. Responsabilidad",
          paragraphs: [
            "En la medida máxima permitida por la ley, Pedagemy e iCUBEFARM no serán responsables de registros perdidos, mensajes demorados, caídas de plataforma, fallos de servicios de terceros o pérdidas indirectas derivadas del uso del sitio o de la participación en la promoción.",
            "Nada en estos términos limita responsabilidades que no puedan excluirse legalmente."
          ]
        },
        {
          title: "10. Privacidad",
          paragraphs: [
            "Tu uso del sitio y tu participación en la promoción también se rigen por el Aviso de privacidad publicado en este sitio."
          ]
        },
        {
          title: "11. Ley aplicable",
          paragraphs: [
            "Estos términos deben interpretarse de forma comercialmente razonable y conforme a la ley aplicable. Salvo que una norma local obligatoria disponga otra cosa, las controversias relacionadas con el sitio o la promoción se regirán por las leyes de Camerún.",
            "Eres responsable de asegurarte de que tu participación sea lícita en tu propia jurisdicción."
          ]
        }
      ]
    }
  }
}

export function getLegalContent(locale: string) {
  return legalContent[normalizeLegalLocale(locale)]
}