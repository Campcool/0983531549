import { mkdir, writeFile } from 'node:fs/promises'
import { servicePages } from '../src/service-content.js'
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
for (const service of servicePages) {
  const url = `https://jjf.tw/services/${service.slug}/`
  const schema = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'Service', '@id': `${url}#service`, name: service.name, url,
        description: service.description, provider: { '@id': 'https://jjf.tw/#business', '@type': 'HomeAndConstructionBusiness', name: '潔淨坊清潔工作室', url: 'https://jjf.tw/', telephone: '+886983531549' },
        areaServed: ['新北市林口區', '桃園市龜山區', '台北市', '新北市', '桃園市', '基隆市'],
        termsOfService: service.cost },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: '潔淨坊清潔工作室', item: 'https://jjf.tw/' },
        { '@type': 'ListItem', position: 2, name: service.name, item: url } ] },
    ],
  }
  const image = `https://jjf.tw/cases/${service.image}`
  const html = `<!doctype html>
<html lang="zh-Hant"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(service.title)}</title><meta name="description" content="${escape(service.description)}">
<link rel="canonical" href="${url}"><link rel="icon" href="/brand/favicon-transparent.png">
<meta property="og:type" content="website"><meta property="og:locale" content="zh_TW">
<meta property="og:title" content="${escape(service.title)}"><meta property="og:description" content="${escape(service.description)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:alt" content="${service.name}案場實拍">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(service.title)}"><meta name="twitter:description" content="${escape(service.description)}"><meta name="twitter:image" content="${image}">
<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
</head><body><div id="root" data-service="${service.slug}"></div><script type="module" src="/src/service.jsx"></script></body></html>
`
  await mkdir(`services/${service.slug}`, { recursive: true })
  await writeFile(`services/${service.slug}/index.html`, html)
}
console.log(`Generated ${servicePages.length} service entries from shared content`)
