// src/lib/constants.js

export const TAG_META = {
  fave: { label: 'Favori',    tcls: 't-fave', dot: '#C0244A', scls: 'on-fave' },
  fast: { label: 'Rapide',    tcls: 't-fast', dot: '#A05A00', scls: 'on-fast' },
  wknd: { label: 'Week-end',  tcls: 't-wknd', dot: '#3543C4', scls: 'on-wknd' },
  kids: { label: 'Enfants',   tcls: 't-kids', dot: '#1A4FC4', scls: 'on-kids' },
  veg:  { label: 'Végé',      tcls: 't-veg',  dot: '#0A6E58', scls: 'on-veg'  },
}

export const FILTERS = Object.entries(TAG_META).map(([key, v]) => ({ key, ...v }))

export const RECAP_FILTERS = [
  { key: 'fave', label: 'favoris',     dot: '#C0244A' },
  { key: 'fast', label: 'rapides',     dot: '#A05A00' },
  { key: 'kids', label: 'enfants',     dot: '#1A4FC4' },
  { key: 'veg',  label: 'végétariens', dot: '#0A6E58' },
  { key: 'wknd', label: 'week-end',    dot: '#3543C4' },
]

export const GROCERY_CATS = [
  { label: 'Fruits & légumes',  icon: '🥦', id: 0 },
  { label: 'Protéines',         icon: '🥩', id: 1 },
  { label: 'Féculents',         icon: '🌾', id: 2 },
  { label: 'Épicerie',          icon: '🫙', id: 3 },
  { label: 'Produits frais',    icon: '🧀', id: 4 },
  { label: 'Herbes & épices',   icon: '🌿', id: 5 },
]

export const ING_CAT = {
  // Protéines (1)
  'Thon': 1, 'Thon en boîte': 1, 'Cuisses poulet': 1, 'Poulet': 1, 'Poulet grillé': 1,
  'Lardons': 1, 'Jambon': 1, 'Tofu': 1, 'Bœuf': 1, 'Bœuf haché': 1, 'Boeuf haché': 1,
  'Saumon fumé': 1, 'Saumon': 1, 'Sardines': 1, 'Escalope de poulet': 1,
  'Escalope de veau': 1, 'Escalope panée': 1, 'Cordons bleus': 1, 'Nuggets': 1,
  'Poissons panés': 1, 'Steak haché': 1, 'Viande hachée': 1, 'Blanc de poulet': 1,
  'Crevettes': 1, 'Anchois': 1, 'Maquereau': 1, 'Halloumi': 1,
  // Produits frais (4)
  'Œufs': 4, 'Œuf': 4, 'Feta': 4, 'Crème fraîche': 4, 'Crème': 4, 'Lait': 4,
  'Parmesan': 4, 'Mozzarella': 4, 'Gruyère': 4, 'Béchamel': 4, 'Beurre': 4,
  'Chèvre': 4, 'Fromage râpé': 4, 'Yaourt nature': 4, 'Yaourt': 4,
  'Ricotta': 4, 'Mascarpone': 4, 'Burrata': 4, 'Philadelphia': 4,
  'Crème liquide': 4, 'Lait de coco': 4,
  // Féculents (2)
  'Penne': 2, 'Riz': 2, 'Farine': 2, 'Tortilla': 2, 'Tortillas': 2,
  'Pain': 2, 'Pain de mie': 2, 'Pain burger': 2, 'Pâtes lasagne': 2, 'Quinoa': 2,
  'Spaghetti': 2, 'Spaghettis': 2, 'Ravioles': 2, 'Gnocchis': 2, 'Coquillettes': 2,
  'Lasagnes Picard': 2, 'Frites surgelées': 2, 'Pommes noisettes': 2,
  'Tagliatelles': 2, 'Fusilli': 2, 'Rigatoni': 2, 'Orzo': 2,
  // Épicerie (3)
  'Sauce soja': 3, 'Miel': 3, 'Pâte brisée': 3, 'Vin rouge': 3,
  'Haricots noirs': 3, 'Bouillon': 3, "Huile d'olive": 3, 'Huile olive': 3,
  'Pois chiches': 3, 'Haricots rouges': 3, 'Haricots blancs': 3, 'Lentilles': 3,
  'Lentilles vertes': 3, 'Sauce tomate': 3, 'Sauce tomate BM': 3,
  'Concentré de tomate': 3, 'Tomates pelées': 3, 'Tomates concassées': 3,
  'Ketchup': 3, 'Mayonnaise': 3, 'Moutarde': 3, 'Vinaigre': 3,
  'Pizza Picard ou Scugnizzo': 3, 'Chips': 3, 'Légumes cuisinés Picard': 3,
  'Haricots rouges en boîte': 3, 'Sauce au choix': 3, 'Mélange herbes': 3,
  'Noix de muscade': 3, 'Sel': 3, 'Poivre': 3, 'Pesto': 3,
  'Huile': 3, 'Vinaigre balsamique': 3, 'Câpres': 3, 'Olives': 3,
  'Tabasco': 3, 'Curry': 3, 'Cumin': 3, 'Paprika': 3,
  // Fruits & légumes (0)
  'Tomates cerises': 0, 'Tomates': 0, 'Tomate': 0, 'Brocoli': 0, 'Courgette': 0,
  'Courgettes': 0, 'Épinards': 0, 'Poivron': 0, 'Haricots verts': 0,
  'Avocat': 0, 'Ail': 0, 'Carottes': 0, 'Carotte': 0, 'Poireaux': 0,
  'Pommes de terre': 0, 'Pomme de terre': 0, 'Légumes variés': 0,
  'Concombre': 0, 'Oignon': 0, 'Oignons': 0, 'Échalote': 0,
  'Champignons': 0, 'Champignon': 0, 'Citron': 0, 'Citrons': 0,
  'Chou-fleur': 0, 'Salade': 0, 'Laitue': 0, 'Roquette': 0,
  'Betterave': 0, 'Radis': 0, 'Céleri': 0, 'Fenouil': 0,
  'Asperges': 0, 'Artichaut': 0, 'Patates douces': 0,
  'Pommes au four': 0, 'Pommes rissolées': 0,
  // Herbes & épices (5)
  'Fines herbes': 5, 'Basilic': 5, 'Persil': 5, 'Coriandre': 5,
  'Thym': 5, 'Romarin': 5, 'Herbes de Provence': 5, 'Menthe': 5,
  'Ciboulette': 5,
}

export const DEMO_MEALS = []
