import { publicSiteUrl } from '../utils/site';
const configuredSiteUrl = publicSiteUrl(import.meta.env.PUBLIC_SITE_URL);
export const business = {
  name: 'Kopi Senja', tagline: 'Every Sip Has a Story.', logo: '/branding/mark.svg',
  domain: configuredSiteUrl || 'https://kopisenja.example', isDemo: true,
  whatsappVerified: false,
  allowIndexing: false,
  description: 'A little pause. A beautiful cup. Discover Indonesian-inspired coffee, thoughtful brews, and something fresh from the oven at Kopi Senja.',
  whatsapp: '', instagram: '', mapsUrl: '',
  address: 'Alamat contoh — ganti dengan alamat kedai Anda, Indonesia.',
  images: {
    hero: '/images/hero.webp', heroSmall: '/images/hero-800.webp', heroAlt: 'A barista slowly pouring water over a paper-filter coffee brewer',
    story: '/images/hero.webp', storyAlt: 'Ilustrasi seduh kopi manual oleh Karl Fredrickson; bukan foto kedai ini',
  },
  bestsellers: ['americano', 'matcha', 'v60', 'pain'],
  coffeeQuality: { title: 'Curious about what’s in your cup?', body: 'Our sample menu explores espresso, Indonesian coffee traditions, and hand-poured brews. Each preparation offers a different way to enjoy coffee. Ask the shop about today’s beans, ingredients, and allergens before ordering.' },
  hours: [{ days: 'Senin – Jumat', time: '08.00 – 21.00' }, { days: 'Sabtu – Minggu', time: '09.00 – 22.00' }],
  promotion: { eyebrow: 'A LITTLE AFTERNOON RITUAL', title: 'Good coffee. Better company.', description: 'Take a slower afternoon. Find your favorite brew and a little something from the oven.', cta: 'Find your pairing' },
  story: { eyebrow: 'A WARM WELCOME', title: 'A place to slow down.\nA cup to come back to.', body: 'Kopi Senja is an imagined neighborhood coffee house, inspired by the warmth of Indonesian afternoons. A place for an unhurried conversation, a fresh idea, or a quiet moment all your own.', detail: 'Our demo menu brings familiar Indonesian flavors together with thoughtfully prepared classics. Simple ingredients, a little curiosity, and a lot of care.' },
  hero: { eyebrow: 'YOUR DAILY MOMENT OF SLOW', title: 'Good days begin\nwith good coffee.', body: 'Thoughtfully brewed. Warmly shared.\nFind a little comfort in every cup.' },
  philosophy: [
    { title: 'Thoughtful coffee', text: 'From a bright manual brew to a comforting kopi susu, there is a cup for your kind of day.' },
    { title: 'Room to unwind', text: 'An imagined space for catching up, settling into a book, and taking your time.' },
    { title: 'Made to be shared', text: 'Familiar flavors, fresh pairings, and a warm welcome. Everyone has a place at the table.' },
  ],
  gallery: [
    { src: '/images/hero.webp', alt: 'Ilustrasi proses seduh manual; foto stok oleh Karl Fredrickson' },
    { src: '/images/pastry.webp', alt: 'Ilustrasi croissant mentega; foto stok oleh Mae Mu' },
    { src: '/images/product-unavailable.svg', alt: 'Foto produk belum tersedia' },
  ],
  seo: {
    title: 'Kopi Senja — Every Sip Has a Story.', image: '/images/hero.webp', locale: 'en_ID',
    descriptions: {
      '/': 'Meet Kopi Senja, a fictional Indonesian coffee house demo. Explore coffee, pastries, and a slower daily ritual.',
      '/about/': 'Discover the idea and coffee philosophy behind Kopi Senja, an original fictional neighborhood coffee house.',
      '/visit/': 'View the example opening hours and clearly marked location and contact placeholders for the fictional Kopi Senja demo.',
      '/qr/': 'Pratinjau kode QR menu Kopi Senja. Unduh dan cetak hanya setelah URL publik yang benar dikonfigurasi.',
      '/privacy/': 'Ketahui cara keranjang disimpan di perangkat Anda dan bagaimana tautan WhatsApp membagikan rincian pesanan.',
    },
  },
} as const;
