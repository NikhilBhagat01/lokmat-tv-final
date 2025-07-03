// test data

//   name: 'Latest Marathi News | Live Maharashtra, Mumbai & Pune News | ताज्या मराठी बातम्या लाइव | Marathi Newspaper | Marathi Samachar| Lokmat.com ',
//     description:
//       ' Lokmat.com: Latest Marathi News Headlines - Lokmat covers Latest Marathi News including Maharashtra, India, Mumbai, Pune & all other cities. Also, Find News on Entertainment, Business, World, Sports and Politics. Get all Live & Breaking headlines and Mumbai & Pune & other Metro Cities. Get ताज्या मराठी बातम्या लाइव at Lokmat.com ',
//     keywords:
//       ' Latest Marathi News, Marathi news, Mumbai news, Pune news, Maharashtra News, मराठी बातम्या, मराठी बातम्या लाइव, ताज्या मराठी बातम्या,Marathi Newspaper, News in Marathi, latest news in marathi, breaking news in marathi, pune news in marathi, pune news in Marathi ',

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
