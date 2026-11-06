import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://sakethgoljana.tech";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/crm", "/crm/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
