const JsonLdWebPage = ({
  url = 'https://www.lokmat.com/videos',
  name = '',
  description = '',
  keywords = '',
}) => {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: url,
    name: name,
    description: description,
    keywords: keywords,
    inLanguage: 'mr_IN',
    publisher: { '@type': 'Organization', name: 'Lokmat' },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  );
};

export default JsonLdWebPage;
