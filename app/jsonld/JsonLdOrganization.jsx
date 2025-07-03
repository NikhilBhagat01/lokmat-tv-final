export default function JsonLdOrganization() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lokmat',
    url: 'https://www.lokmat.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://d3pc1xvrcw35tl.cloudfront.net/assets/images/lokmat-logo-v0.1.png',
      width: 224,
      height: 58,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1301/2, Lodha Supremus,Dr. E. Moses Rd, Worli Circle, Mumbai',
      addressLocality: 'Mumbai',
      addressRegion: 'India',
      postalCode: '400018',
    },
    sameAs: [
      'https://facebook.com/lokmat',
      'https://twitter.com/milokmat',
      'https://plus.google.com/111681016749225054815',
      'https://www.instagram.com/milokmat/?hl=en',
      'https://www.youtube.com/user/LokmatNews',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
