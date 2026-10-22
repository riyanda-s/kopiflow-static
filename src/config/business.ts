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
  home: {
    rituals: ['KOPI PILIHAN', 'JEDA SEJENAK', 'CERITA HANGAT', 'DISEDUH SEPENUH HATI'],
    favorites: { eyebrow: 'UNTUK DINIKMATI LAGI', title: 'Temukan teman jeda Anda.', text: 'Rasa yang akrab, dengan sesuatu yang baru untuk dicoba.', cta: 'Lihat semua menu' },
    menuFootnote: 'Harga dalam Rupiah. Ketersediaan dan total akhir dikonfirmasi kedai.',
    demoMenuFootnote: 'Pilihan menu untuk demo kedai fiktif. ',
    storyCta: 'Kenali cerita kami', signature: 'Sampai bertemu di secangkir kopi.',
    storyStamp: ['JEDA SEJENAK', 'NIKMATI MOMENNYA'],
    selection: { eyebrow: 'PILIHAN KEDAI', title: 'Alasan untuk tinggal sejenak.', text: 'Dari seduhan berkarakter, rasa baru untuk dijelajahi, hingga teman manis di akhir.', cta: 'Temukan pilihan Anda', demoNote: 'Pilihan ilustratif untuk kedai fiktif ini, bukan klaim penjualan.' },
    values: { eyebrow: 'LEBIH DARI SECANGKIR KOPI', title: 'Hal kecil, kenangan hangat.' },
    gallery: { eyebrow: 'SEKILAS MOMEN HANGAT', title: 'Sudut kecil untuk melepas penat.', note: 'Kopi, teman cerita, dan jeda di antaranya.', demoNote: 'Foto ilustratif untuk konsep kedai fiktif, bukan foto lokasi kedai.' },
    opening: { eyebrow: 'SINGGAH DAN MERASA NYAMAN', title: 'Selalu ada waktu\nuntuk secangkir kopi.', demoNote: 'Contoh jam buka untuk demo kedai fiktif.', holidayNote: 'Hubungi kedai untuk memastikan jam buka saat hari libur.', cta: 'Hubungi lewat WhatsApp' },
  },
  menuIllustrationNote: 'Foto menu merupakan ilustrasi. Tampilan penyajian dapat berbeda.',
  coffeeQuality: { title: 'Curious about what’s in your cup?', body: 'Our sample menu explores espresso, Indonesian coffee traditions, and hand-poured brews. Each preparation offers a different way to enjoy coffee. Ask the shop about today’s beans, ingredients, and allergens before ordering.' },
  hours: [{ days: 'Senin – Jumat', time: '08.00 – 21.00' }, { days: 'Sabtu – Minggu', time: '09.00 – 22.00' }],
  promotion: { eyebrow: 'TEMAN JEDA SORE', title: 'Kopi hangat, cerita mengalir.', description: 'Luangkan sore untuk seduhan favorit dan sesuatu yang baru dari oven.', cta: 'Temukan paduan rasa' },
  story: { eyebrow: 'SELAMAT SINGGAH', title: 'Tempat untuk melambat.\nRasa untuk kembali.', body: 'Kopi Senja adalah konsep kedai fiktif yang terinspirasi kehangatan sore di Indonesia. Tempat untuk berbagi cerita, menemukan ide, atau menikmati waktu sendiri.', detail: 'Menu demo kami mempertemukan cita rasa Indonesia dengan sajian klasik. Bahan sederhana, rasa ingin tahu, dan perhatian pada setiap seduhan.' },
  hero: { eyebrow: 'JEDA KECIL SETIAP HARI', title: 'Hari yang hangat\nbermula dari kopi.', body: 'Diseduh dengan perhatian. Dinikmati bersama.\nTemukan nyaman dalam setiap cangkir.', storyCta: 'Cerita di balik secangkir kopi', caption: ['JEDA SEJENAK.', 'SECANGKIR KEHANGATAN.'], scroll: 'NIKMATI LEBIH DEKAT' },
  philosophy: [
    { title: 'Seduhan penuh perhatian', text: 'Dari seduhan manual yang ringan hingga kopi susu yang akrab, selalu ada rasa untuk menemani hari.' },
    { title: 'Ruang untuk melepas penat', text: 'Bayangan ruang untuk bertukar cerita, membuka buku, dan menikmati waktu tanpa terburu-buru.' },
    { title: 'Lebih hangat saat berbagi', text: 'Rasa yang akrab, paduan baru, dan sambutan hangat untuk setiap cerita.' },
  ],
  gallery: [
    { src: '/images/hero.webp', alt: 'Ilustrasi proses seduh manual; foto stok oleh Karl Fredrickson', caption: 'Temukan jeda Anda.' },
    { src: '/images/pastry.webp', alt: 'Ilustrasi croissant mentega; foto stok oleh Mae Mu', caption: 'Nikmati hal-hal sederhana.' },
    { src: '/images/product-latte.webp', alt: 'Ilustrasi latte dalam gelas dengan seni susu; foto stok oleh Nathan Dumlao', caption: 'Sediakan waktu untuk rasa yang baik.' },
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
