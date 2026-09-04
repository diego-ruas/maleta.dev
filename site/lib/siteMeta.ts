export const SITE_URL = "https://maleta.dev";
export const SITE_NAME = "Maleta.dev";
export const CONTACT_EMAIL = "diegodruas@proton.me";
export const REPO_URL = "https://github.com/diego-ruas/maleta.dev";

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Construtor e catálogo de skills, plugins e configurações de IA instaláveis para Claude Code e Codex.",
  email: CONTACT_EMAIL,
  founder: { "@type": "Person", name: "Diego Ruas", url: "https://github.com/diego-ruas" },
  sameAs: [REPO_URL, "https://github.com/diego-ruas"],
  address: { "@type": "PostalAddress", addressCountry: "BR" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "technical support",
      email: CONTACT_EMAIL,
      url: `${REPO_URL}/issues`,
      availableLanguage: ["Portuguese", "English"],
    },
  ],
};

const softwareApplication = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Windows, macOS, Linux",
  description:
    "Coleção curada e instalável de skills, plugins e configurações de IA para Claude Code e Codex. 100% local, seguro e pronto em 1 comando.",
  softwareHelp: `${SITE_URL}/llms.txt`,
  downloadUrl: `${SITE_URL}/install.sh`,
  inLanguage: "pt-BR",
  license: `${REPO_URL}/blob/main/LICENSE`,
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "pt-BR",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [organization, website, softwareApplication],
};
