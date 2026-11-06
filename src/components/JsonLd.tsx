export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://sakethgoljana.tech/#person",
    name: "Saketh Goljana",
    givenName: "Saketh",
    familyName: "Goljana",
    jobTitle: "Lead Architect & Mobile Software Engineer",
    description:
      "Lead Architect & Mobile Software Engineer building production mobile apps (React Native 0.88, Expo SDK 58), modern web systems (Next.js), and intelligent automation.",
    url: "https://sakethgoljana.tech",
    email: "hello@sakethgoljana.tech",
    telephone: "+919059478739",
    sameAs: [
      "https://github.com/SakethGoljana",
      "https://www.linkedin.com/in/saketh-goljana/",
    ],
    knowsAbout: [
      "React Native",
      "Expo SDK 58",
      "TypeScript",
      "Next.js",
      "Meta Cloud API",
      "SheetJS",
      "Mobile Architecture",
      "System Design",
      "WhatsApp Automation",
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://sakethgoljana.tech/#dispatch",
    name: "Dispatch — Bulk WhatsApp Automation Engine",
    operatingSystem: "Android",
    applicationCategory: "BusinessApplication",
    description:
      "High-performance Android mobile application that turns raw Excel, CSV, and Google Sheets into personalized WhatsApp messages with 1-tap dispatch, dynamic filters, and zero account ban risk.",
    author: {
      "@type": "Person",
      name: "Saketh Goljana",
      url: "https://sakethgoljana.tech",
    },
    downloadUrl:
      "https://github.com/SakethGoljana/Dispatch/releases/latest/download/dispatch-v1.0.0.apk",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sakethgoljana.tech/#website",
    url: "https://sakethgoljana.tech",
    name: "Saketh Goljana · Lead Architect & Mobile Software Engineer",
    description:
      "Portfolio of Saketh Goljana featuring the Dispatch WhatsApp automation engine, production mobile apps, and full-stack systems.",
    publisher: {
      "@id": "https://sakethgoljana.tech/#person",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
