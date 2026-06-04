// Données normalisées — champs uniformes avec catalogueData.js
// (gradFrom / gradTo / accent au lieu de gradientFrom / gradientTo / accentColor)

export const featuredProducts = [
  {
    id: 1,
    name: "Abaya Noire Brodée",
    category: "Classique",
    price: 3800,
    oldPrice: null,
    badge: "new",
    image: "/images/abaya1.jpg",
    badgeLabel: "Nouveau",
    color: "Noir",
    gradFrom: "#2A2418",
    gradTo: "#1A1612",
    accent: "rgba(201,168,76,0.3)",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Abaya Dorée Royal",
    category: "Soirée",
    price: 5200,
    oldPrice: 6500,
    badge: "promo",
    badgeLabel: "-20%",
    color: "Beige",
    gradFrom: "#3D2E0A",
    gradTo: "#1A1200",
    accent: "rgba(201,168,76,0.5)",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    id: 3,
    name: "Abaya Bleu Nuit",
    category: "Moderne",
    price: 4100,
    oldPrice: null,
    badge: "new",
    badgeLabel: "Nouveau",
    color: "Bleu",
    gradFrom: "#1A1A2E",
    gradTo: "#0D0D1A",
    accent: "rgba(100,100,180,0.4)",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 4,
    name: "Abaya Bordeaux Satin",
    category: "Premium",
    price: 4675,
    oldPrice: 5500,
    badge: "promo",
    badgeLabel: "-15%",
    color: "Bordeaux",
    gradFrom: "#2E1010",
    gradTo: "#1A0808",
    accent: "rgba(180,80,80,0.35)",
    sizes: ["S", "M", "L"],
  },
];

export const promotions = [
  {
    id: 1,
    tag: "Offre Limitée",
    title: "Soldes de Fin de Saison",
    description:
      "Profitez de réductions exceptionnelles sur toute la collection d'été. Des pièces élégantes à prix réduit.",
    percent: "30%",
    deadline: "⏳ Expire dans 3 jours",
    ctaLabel: "Profiter de l'offre",
    ctaVariant: "primary",
  },
  {
    id: 2,
    tag: "Nouveauté",
    title: "Collection Ramadan 2025",
    description:
      "Découvrez notre nouvelle collection Ramadan. Des créations exclusives alliant tradition et modernité.",
    percent: "20%",
    deadline: "✨ Collection exclusive",
    ctaLabel: "Voir la collection",
    ctaVariant: "outline",
  },
];

export const marqueeItems = [
  "Livraison gratuite dès 5000 DA",
  "Nouvelles collections chaque semaine",
  "Retours gratuits sous 14 jours",
  "Qualité artisanale garantie",
];

export const heroStats = [
  { num: "200+", label: "Modèles" },
  { num: "4.9★", label: "Avis clientes" },
  { num: "48h",  label: "Livraison" },
];

export const footerLinks = {
  Navigation:   ["Accueil", "Collection", "Nouveautés", "Promotions"],
  Aide:         ["FAQ", "Livraison", "Retours", "Contact"],
  "Mon Compte": ["Connexion", "Inscription", "Mes commandes", "Mes adresses"],
};
