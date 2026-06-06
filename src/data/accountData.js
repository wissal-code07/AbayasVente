export const mockUser = {
  firstName: "Fatima",
  lastName:  "Benali",
  email:     "fatima.benali@email.com",
  phone:     "+213 555 123 456",
  joinDate:  "Mars 2024",
  avatar:    "FB",
};

export const mockOrders = [
  {
    id: "CMD-2025-001",
    date: "12 Mai 2025",
    status: "livré",
    total: 9800,
    items: [
      { name: "Abaya Noire Brodée",   size: "M", color: "Noir",  qty: 1, price: 3800 },
      { name: "Abaya Dorée Royal",    size: "L", color: "Beige", qty: 1, price: 6000 },
    ],
  },
  {
    id: "CMD-2025-002",
    date: "28 Avril 2025",
    status: "en_cours",
    total: 4675,
    items: [
      { name: "Abaya Bordeaux Satin", size: "S", color: "Bordeaux", qty: 1, price: 4675 },
    ],
  },
  {
    id: "CMD-2025-003",
    date: "10 Avril 2025",
    status: "livré",
    total: 8200,
    items: [
      { name: "Abaya Bleu Nuit",      size: "M", color: "Bleu", qty: 2, price: 4100 },
    ],
  },
  {
    id: "CMD-2025-004",
    date: "02 Mars 2025",
    status: "annulé",
    total: 3200,
    items: [
      { name: "Abaya Classique",      size: "L", color: "Noir", qty: 1, price: 3200 },
    ],
  },
];

export const mockAddresses = [
  {
    id: 1,
    label: "Domicile",
    default: true,
    firstName: "Fatima",
    lastName:  "Benali",
    address:   "12 Rue des Jasmins, Hydra",
    city:      "Alger",
    wilaya:    "Alger (16)",
    phone:     "+213 555 123 456",
  },
  {
    id: 2,
    label: "Bureau",
    default: false,
    firstName: "Fatima",
    lastName:  "Benali",
    address:   "45 Avenue Didouche Mourad",
    city:      "Alger Centre",
    wilaya:    "Alger (16)",
    phone:     "+213 555 123 456",
  },
];

export const STATUS_LABELS = {
  livré:    { label: "Livré",     color: "#44aa66" },
  en_cours: { label: "En cours",  color: "#C9A84C" },
  annulé:   { label: "Annulé",    color: "#cc4444" },
  expédié:  { label: "Expédié",   color: "#4488cc" },
};
