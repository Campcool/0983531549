// Public service identifiers only. Customer input never belongs in a URL or event.
export const inquiryServices = [
  ['home', '居家清潔'],
  ['move-in', '退租入住'],
  ['moving', '搬家前後清潔'],
  ['deep', '大掃除'],
  ['renovation', '裝潢清潔'],
  ['kitchen', '廚房重油汙'],
  ['commercial-kitchen', '商業廚房清潔'],
  ['bathroom', '衛浴清潔'],
  ['local', '局部加強清潔'],
  ['waxing', '洗地打蠟'],
  ['awning', '洗雨棚'],
  ['wood-floor', '木地板清潔'],
  ['mold', '除霉'],
  ['adhesive', '地板除膠'],
  ['paint', '油漆清潔'],
  ['clearance', '垃圾清運'],
  ['special', '特殊清潔'],
  ['fire', '火燒屋'],
  ['restoration', '燒炭案件處理復原'],
]

export const validService = (value) => (inquiryServices.some(([id]) => id === value) ? value : '')
export const serviceLabel = (value) =>
  inquiryServices.find(([id]) => id === value)?.[1] || '尚未確定的清潔需求'
export const inquiryHref = (service = '') =>
  `${import.meta.env.BASE_URL}${validService(service) ? `?service=${service}` : ''}#inquiry-checklist`

export const albumServices = {
  'general-cleaning': 'renovation',
  'garbage-clearance': 'clearance',
  'mold-removal': 'mold',
  'paint-cleaning': 'paint',
  'grease-kitchen': 'kitchen',
  'awning-cleaning': 'awning',
  'floor-adhesive-removal': 'adhesive',
  'wood-floor-cleaning': 'wood-floor',
  'floor-waxing': 'waxing',
  'general-home-cleaning': 'home',
  'move-in-cleaning': 'move-in',
  'commercial-kitchen': 'commercial-kitchen',
}
