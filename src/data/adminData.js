import { catalogueProducts } from "./catalogueData";
import { mockOrders } from "./accountData";

// ── Stats ──
export const adminStats = {
  revenue:      { value: "1 248 500 DA", change: "+12%",  up: true  },
  orders:       { value: "84",           change: "+8%",   up: true  },
  clients:      { value: "312",          change: "+23%",  up: true  },
  avgOrder:     { value: "14 863 DA",    change: "-3%",   up: false },
};

// ── Revenue chart data (last 7 days) ──
export const revenueData = [
  { day: "Lun", value: 42000  },
  { day: "Mar", value: 67000  },
  { day: "Mer", value: 38000  },
  { day: "Jeu", value: 91000  },
  { day: "Ven", value: 125000 },
  { day: "Sam", value: 148000 },
  { day: "Dim", value: 83000  },
];

// ── Products (from catalogue + extra fields) ──
export const adminProducts = catalogueProducts.map((p, i) => ({
  ...p,
  stock:     Math.floor(Math.random() * 50) + 1,
  sold:      Math.floor(Math.random() * 100),
  status:    i % 7 === 0 ? "inactif" : "actif",
  createdAt: `${Math.floor(Math.random() * 28) + 1} Mai 2025`,
}));

// ── Orders (extended) ──
export const adminOrders = [
  { id: "CMD-2025-001", client: "Fatima Benali",   date: "12 Mai 2025",    status: "livré",    total: 9800,  items: 2, wilaya: "Alger"      },
  { id: "CMD-2025-002", client: "Meriem Hadj",     date: "11 Mai 2025",    status: "expédié",  total: 4675,  items: 1, wilaya: "Oran"       },
  { id: "CMD-2025-003", client: "Amina Cherif",    date: "10 Mai 2025",    status: "en_cours", total: 8200,  items: 2, wilaya: "Constantine" },
  { id: "CMD-2025-004", client: "Sara Boudiaf",    date: "09 Mai 2025",    status: "livré",    total: 3800,  items: 1, wilaya: "Blida"      },
  { id: "CMD-2025-005", client: "Nadia Meziane",   date: "08 Mai 2025",    status: "annulé",   total: 5200,  items: 1, wilaya: "Tizi Ouzou" },
  { id: "CMD-2025-006", client: "Houria Bensalem", date: "07 Mai 2025",    status: "en_cours", total: 12400, items: 3, wilaya: "Sétif"      },
  { id: "CMD-2025-007", client: "Karima Slimani",  date: "06 Mai 2025",    status: "livré",    total: 7800,  items: 2, wilaya: "Annaba"     },
  { id: "CMD-2025-008", client: "Dalila Oukil",    date: "05 Mai 2025",    status: "expédié",  total: 4100,  items: 1, wilaya: "Batna"      },
];

// ── Clients ──
export const adminClients = [
  { id: 1,  name: "Fatima Benali",   email: "fatima@email.com",   orders: 5,  total: 32400, joined: "Mars 2024",    status: "actif"   },
  { id: 2,  name: "Meriem Hadj",     email: "meriem@email.com",   orders: 3,  total: 18200, joined: "Avril 2024",   status: "actif"   },
  { id: 3,  name: "Amina Cherif",    email: "amina@email.com",    orders: 8,  total: 56700, joined: "Jan 2024",     status: "actif"   },
  { id: 4,  name: "Sara Boudiaf",    email: "sara@email.com",     orders: 1,  total: 3800,  joined: "Mai 2025",     status: "actif"   },
  { id: 5,  name: "Nadia Meziane",   email: "nadia@email.com",    orders: 2,  total: 9400,  joined: "Fév 2025",     status: "inactif" },
  { id: 6,  name: "Houria Bensalem", email: "houria@email.com",   orders: 4,  total: 28900, joined: "Oct 2024",     status: "actif"   },
  { id: 7,  name: "Karima Slimani",  email: "karima@email.com",   orders: 6,  total: 41200, joined: "Juil 2024",    status: "actif"   },
  { id: 8,  name: "Dalila Oukil",    email: "dalila@email.com",   orders: 2,  total: 8100,  joined: "Avril 2025",   status: "actif"   },
];

export const STATUS_COLORS = {
  livré:    { color: "#44aa66", bg: "rgba(68,170,102,0.1)"  },
  expédié:  { color: "#4488cc", bg: "rgba(68,136,204,0.1)"  },
  en_cours: { color: "#C9A84C", bg: "rgba(201,168,76,0.1)"  },
  annulé:   { color: "#cc4444", bg: "rgba(204,68,68,0.1)"   },
  actif:    { color: "#44aa66", bg: "rgba(68,170,102,0.1)"  },
  inactif:  { color: "#cc4444", bg: "rgba(204,68,68,0.1)"   },
};