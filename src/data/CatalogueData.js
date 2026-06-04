export const CATEGORIES = ["Toutes", "Classique", "Soirée", "Moderne", "Premium"];
export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const COLORS = [
  { name: "Noir",     hex: "#0D0D0D" },
  { name: "Blanc",    hex: "#F5F0E8" },
  { name: "Bleu",     hex: "#1A2A4A" },
  { name: "Bordeaux", hex: "#5C1A1A" },
  { name: "Beige",    hex: "#C8A97A" },
  { name: "Vert",     hex: "#1A3A2A" },
];
export const SORT_OPTIONS = [
  { value: "newest",     label: "Nouveautés" },
  { value: "price_asc",  label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];
export const PRICE_RANGE = { min: 0, max: 12000 };

export const catalogueProducts = [
  { id: 1,  name: "Abaya Noire Brodée",        category: "Classique", price: 3800,  oldPrice: null,  badge: "new",   color: "Noir",     sizes: ["S","M","L","XL"],       gradFrom: "#2A2418", gradTo: "#1A1612", accent: "rgba(201,168,76,0.3)" },
  { id: 2,  name: "Abaya Dorée Royal",          category: "Soirée",   price: 5200,  oldPrice: 6500,  badge: "promo", color: "Beige",    sizes: ["M","L","XL","XXL"],     gradFrom: "#3D2E0A", gradTo: "#1A1200", accent: "rgba(201,168,76,0.5)" },
  { id: 3,  name: "Abaya Bleu Nuit",            category: "Moderne",  price: 4100,  oldPrice: null,  badge: "new",   color: "Bleu",     sizes: ["XS","S","M","L"],       gradFrom: "#1A1A2E", gradTo: "#0D0D1A", accent: "rgba(100,100,180,0.4)" },
  { id: 4,  name: "Abaya Bordeaux Satin",       category: "Premium",  price: 4675,  oldPrice: 5500,  badge: "promo", color: "Bordeaux", sizes: ["S","M","L"],            gradFrom: "#2E1010", gradTo: "#1A0808", accent: "rgba(180,80,80,0.35)" },
  { id: 5,  name: "Abaya Blanche Cérémonie",    category: "Soirée",   price: 6200,  oldPrice: null,  badge: "new",   color: "Blanc",    sizes: ["XS","S","M","L","XL"],  gradFrom: "#2A2820", gradTo: "#1C1C18", accent: "rgba(230,220,190,0.4)" },
  { id: 6,  name: "Abaya Verte Émeraude",       category: "Moderne",  price: 3950,  oldPrice: null,  badge: null,    color: "Vert",     sizes: ["S","M","L","XL","XXL"], gradFrom: "#0F2018", gradTo: "#081410", accent: "rgba(80,160,100,0.35)" },
  { id: 7,  name: "Abaya Classique Élégante",   category: "Classique",price: 3200,  oldPrice: null,  badge: null,    color: "Noir",     sizes: ["XS","S","M","L"],       gradFrom: "#1E1C18", gradTo: "#0F0E0C", accent: "rgba(201,168,76,0.2)" },
  { id: 8,  name: "Abaya Premium Dentelle",     category: "Premium",  price: 7800,  oldPrice: 9200,  badge: "promo", color: "Bordeaux", sizes: ["S","M","L","XL"],       gradFrom: "#38120C", gradTo: "#1F0A08", accent: "rgba(200,100,80,0.4)" },
  { id: 9,  name: "Abaya Noire Perles",         category: "Soirée",   price: 8500,  oldPrice: null,  badge: "new",   color: "Noir",     sizes: ["M","L","XL"],           gradFrom: "#1A1610", gradTo: "#0D0C0A", accent: "rgba(201,168,76,0.6)" },
  { id: 10, name: "Abaya Beige Moderne",        category: "Moderne",  price: 4300,  oldPrice: null,  badge: null,    color: "Beige",    sizes: ["XS","S","M","L","XL"],  gradFrom: "#2C2010", gradTo: "#1A140A", accent: "rgba(201,160,80,0.4)" },
  { id: 11, name: "Abaya Blanche Brodée",       category: "Classique",price: 4100,  oldPrice: 4800,  badge: "promo", color: "Blanc",    sizes: ["S","M","L"],            gradFrom: "#252320", gradTo: "#181714", accent: "rgba(220,210,180,0.4)" },
  { id: 12, name: "Abaya Bleue Royale",         category: "Premium",  price: 6900,  oldPrice: null,  badge: "new",   color: "Bleu",     sizes: ["XS","S","M","L","XL"],  gradFrom: "#101828", gradTo: "#080E18", accent: "rgba(80,120,200,0.45)" },
  { id: 13, name: "Abaya Soirée Cristaux",      category: "Soirée",   price: 11500, oldPrice: null,  badge: "new",   color: "Noir",     sizes: ["S","M","L"],            gradFrom: "#1E1A12", gradTo: "#100E0A", accent: "rgba(201,168,76,0.7)" },
  { id: 14, name: "Abaya Verte Kaki",           category: "Classique",price: 3500,  oldPrice: null,  badge: null,    color: "Vert",     sizes: ["M","L","XL","XXL"],     gradFrom: "#141E14", gradTo: "#0A120A", accent: "rgba(100,140,80,0.35)" },
  { id: 15, name: "Abaya Bordeaux Velours",     category: "Premium",  price: 8200,  oldPrice: 9500,  badge: "promo", color: "Bordeaux", sizes: ["S","M","L","XL"],       gradFrom: "#2E0E10", gradTo: "#1A0808", accent: "rgba(180,60,70,0.45)" },
  { id: 16, name: "Abaya Moderne Géométrique",  category: "Moderne",  price: 4600,  oldPrice: null,  badge: null,    color: "Bleu",     sizes: ["XS","S","M","L"],       gradFrom: "#12141E", gradTo: "#0A0C14", accent: "rgba(100,120,200,0.4)" },
];