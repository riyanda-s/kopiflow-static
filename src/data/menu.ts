import { productPhotoAlt } from './product-photo-alt.ts';
export interface Option { id: string; label: string; price: number }
export interface Variant { id: string; label: string; options: Option[] }
export interface Product { id: string; name: string; category: string; description: string; price: number; image: string; imageAlt: string; imageGenerated?: boolean; available: boolean; badge?: string; featured?: boolean; variants: Variant[]; addons: Option[] }
export const categories = ['Espresso', 'Kopi Susu', 'Seduh Manual', 'Nonkopi', 'Teh', 'Pastri', 'Camilan'];
const size: Variant = { id: 'size', label: 'Ukuran', options: [{ id: 'regular', label: 'Reguler', price: 0 }, { id: 'large', label: 'Besar', price: 6000 }] };
const sugar: Variant = { id: 'sugar', label: 'Gula', options: [{ id: 'normal', label: '100%', price: 0 }, { id: 'half', label: '50%', price: 0 }, { id: 'none', label: 'Tanpa gula', price: 0 }] };
const temp: Variant = { id: 'temperature', label: 'Suhu', options: [{ id: 'iced', label: 'Es', price: 0 }, { id: 'hot', label: 'Panas', price: 0 }] };
const extras: Option[] = [{ id: 'shot', label: 'Tambahan espresso', price: 6000 }, { id: 'oat', label: 'Ganti susu oat', price: 8000 }];
type Seed = [string, string, string, number, string, string, string?];
const seeds: Seed[] = [
  ['kopi-aren', 'Es Kopi Susu Gula Aren', 'Kopi Susu', 24000, 'product-kopi-aren-ai', 'Espresso, susu segar, dan manis lembut gula aren. Kopi susu khas untuk menemani hari Anda.', 'PILIHAN KEDAI'],
  ['latte', 'Caffè Latte', 'Kopi Susu', 28000, 'product-latte', 'Espresso seimbang dengan susu lembut. Pilihan sederhana untuk jeda yang nyaman.', 'KLASIK FAVORIT'],
  ['croissant', 'Butter Croissant', 'Pastri', 22000, 'pastry', 'Pastri berlapis renyah dengan aroma mentega. Cocok dipadukan dengan kopi favorit Anda.', 'PASANGAN KOPI'],
  ['americano', 'Americano', 'Espresso', 22000, 'product-americano', 'Espresso dengan tambahan air. Rasa kopi yang tegas, bersih, dan ringan dinikmati.'],
  ['espresso', 'Double Espresso', 'Espresso', 18000, 'product-espresso-ai', 'Dua shot espresso pekat dengan crema dan rasa yang bertahan setelah tegukan terakhir.'],
  ['cappuccino', 'Cappuccino', 'Espresso', 28000, 'product-cappuccino', 'Perpaduan espresso, susu hangat, dan buih susu yang ringan.'],
  ['flat-white', 'Flat White', 'Espresso', 28000, 'product-flat-white', 'Dua shot espresso dengan susu bertekstur halus dan lembut.'],
  ['vanilla', 'Vanilla Latte', 'Kopi Susu', 30000, 'product-vanilla', 'Espresso dan susu dengan aroma vanila yang lembut.'],
  ['mocha', 'Caffè Mocha', 'Kopi Susu', 32000, 'product-mocha', 'Cokelat, espresso, dan susu dalam satu cangkir yang seimbang.'],
  ['pandan', 'Pandan Kopi Susu', 'Kopi Susu', 28000, 'product-pandan-ai', 'Aroma pandan, susu lembut, dan espresso disajikan dengan es.'],
  ['v60', 'V60 Filter Coffee', 'Seduh Manual', 32000, 'product-v60', 'Kopi Indonesia yang diseduh manual. Tanyakan pilihan biji kopi yang tersedia kepada kedai.'],
  ['tubruk', 'Kopi Tubruk', 'Seduh Manual', 18000, 'product-tubruk-ai', 'Kopi bubuk yang diseduh langsung dengan air panas, dengan rasa yang penuh.'],
  ['cold-brew', 'Slow Cold Brew', 'Seduh Manual', 30000, 'product-cold-brew', 'Kopi yang diseduh perlahan dengan air dingin untuk rasa lembut dan menyegarkan.'],
  ['matcha', 'Matcha Latte', 'Nonkopi', 32000, 'product-matcha', 'Teh hijau matcha yang dikocok hingga halus lalu dipadukan dengan susu.'],
  ['chocolate', 'Chocolate Milk', 'Nonkopi', 28000, 'product-chocolate-ai', 'Cokelat dan susu segar untuk minuman tanpa kopi yang menenangkan.'],
  ['lemon-tea', 'Lemon Tea', 'Teh', 20000, 'product-lemon-tea-ai', 'Teh hitam dengan perasan lemon yang segar.'],
  ['lychee', 'Lychee Iced Tea', 'Teh', 24000, 'product-lychee', 'Es teh dengan rasa leci yang manis dan harum.'],
  ['jasmine', 'Jasmine Tea', 'Teh', 18000, 'product-jasmine-ai', 'Teh melati ringan dengan aroma bunga untuk menemani waktu santai.'],
  ['pain', 'Pain au Chocolat', 'Pastri', 26000, 'product-pain', 'Pastri mentega dengan isian cokelat hitam di bagian tengah.'],
  ['banana', 'Banana Bread', 'Pastri', 22000, 'product-banana', 'Sepotong kue pisang lembut untuk teman minum kopi atau teh.'],
  ['toast', 'Kaya Butter Toast', 'Camilan', 24000, 'product-toast-ai', 'Roti panggang renyah dengan selai kaya dan mentega.'],
  ['fries', 'Sea Salt Fries', 'Camilan', 25000, 'product-fries-ai', 'Kentang goreng renyah dengan taburan garam laut.'],
  ['singkong', 'Singkong Goreng', 'Camilan', 22000, 'product-singkong', 'Singkong goreng renyah di luar dan lembut di dalam, cocok untuk berbagi.'],
];
export const menu: Product[] = seeds.map(([id, name, category, price, photo, description, badge], index) => ({
  id, name, category, price,
  image: photo === 'product-unavailable' ? '/images/product-unavailable.svg' : `/images/${photo}.webp`,
  imageGenerated: photo.endsWith('-ai'),
  imageAlt: photo === 'product-unavailable' ? `Foto ${name} belum tersedia` : (productPhotoAlt[photo] ?? `Ilustrasi ${name}; penyajian dapat berbeda`), description,
  available: id !== 'banana', badge, featured: index < 3,
  variants: ['Pastri', 'Camilan'].includes(category) ? [] : category === 'Kopi Susu' ? [size, sugar, temp] : category === 'Nonkopi' || category === 'Teh' ? [size, sugar] : category === 'Espresso' && id !== 'espresso' ? [temp] : [],
  addons: ['Kopi Susu', 'Espresso'].includes(category) ? extras : [],
}));
