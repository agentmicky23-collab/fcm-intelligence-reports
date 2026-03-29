// components/StructuredData.jsx
// Drop this component into app/layout.js inside <body>, before the main content

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FCM Intelligence',
    legalName: 'Firstclass Managerial Ltd',
    alternateName: 'FCM Intelligence',
    url: 'https://fcmreport.com',
    logo: 'https://fcmreport.com/images/logo-transparent.png',
    description:
      'Data-driven intelligence reports for Post Office business acquisitions. 15 years industry experience, 40 branches operated.',
    foundingDate: '2009',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@fcmreport.com',
      contactType: 'sales',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GB',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchemaInsight() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'FCM Insight Report',
    description:
      'Due diligence report for Post Office business acquisitions. 10 verified sections covering crime, competition, demographics, footfall, infrastructure, and more. Delivered within 48 hours.',
    brand: {
      '@type': 'Brand',
      name: 'FCM Intelligence',
    },
    offers: {
      '@type': 'Offer',
      price: '199',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: 'https://fcmreport.com/reports',
      priceValidUntil: '2026-12-31',
    },
    category: 'Business Intelligence Report',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchemaIntelligence() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'FCM Intelligence Report',
    description:
      'Comprehensive due diligence report for Post Office business acquisitions. 15 sections including financial analysis, due diligence pack, profit improvement, future outlook, and negotiation strategy. Includes 60-minute consultation call. Delivered within 48 hours.',
    brand: {
      '@type': 'Brand',
      name: 'FCM Intelligence',
    },
    offers: {
      '@type': 'Offer',
      price: '499',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      url: 'https://fcmreport.com/reports',
      priceValidUntil: '2026-12-31',
    },
    category: 'Business Intelligence Report',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FCM Intelligence',
    url: 'https://fcmreport.com',
    description: 'Post Office due diligence reports and business listings.',
    publisher: {
      '@type': 'Organization',
      name: 'FCM Intelligence',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ──────────────────────────────────────────────
// HOW TO USE:
// ──────────────────────────────────────────────
//
// In app/layout.js, inside <body>:
//
//   import { OrganizationSchema, WebsiteSchema } from '@/components/StructuredData';
//
//   <body>
//     <OrganizationSchema />
//     <WebsiteSchema />
//     {children}
//   </body>
//
// In app/reports/page.jsx:
//
//   import { ProductSchemaInsight, ProductSchemaIntelligence } from '@/components/StructuredData';
//
//   export default function ReportsPage() {
//     return (
//       <>
//         <ProductSchemaInsight />
//         <ProductSchemaIntelligence />
//         {/* ... existing page content ... */}
//       </>
//     );
//   }
