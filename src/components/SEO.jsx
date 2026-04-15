import { Helmet } from 'react-helmet-async';

export function SEO({ title, description, keywords, ogUrl, ogType, canonical }) {
  const siteUrl = 'https://wootong.com';
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType || 'website'} />
      <meta property="og:url" content={ogUrl || siteUrl} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={`${siteUrl}/og-image.jpg`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={ogUrl || siteUrl} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={`${siteUrl}/og-image.jpg`} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#ebf4f5" />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Woo Tong",
          "url": siteUrl,
          "logo": `${siteUrl}/logo.svg`,
          "description": description || "Digital Design Agency",
          "sameAs": [
            "https://twitter.com/wootong",
            "https://www.linkedin.com/company/wootong",
            "https://dribbble.com/wootong"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "hello@wootong.com",
            "contactType": "customer service"
          }
        })}
      </script>
      
      {/* Structured Data - Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Woo Tong",
          "image": `${siteUrl}/og-image.jpg`,
          "url": siteUrl,
          "telephone": "",
          "priceRange": "$$$"
        })}
      </script>
    </Helmet>
  );
}

// HOC for page-level SEO
export function withSEO(WrappedComponent, seoData) {
  return function WithSEO(props) {
    return (
      <>
        <SEO {...seoData} />
        <WrappedComponent {...props} />
      </>
    );
  };
}
