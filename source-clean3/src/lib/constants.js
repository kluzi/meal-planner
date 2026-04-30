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
  'Thon': 1, 'Cuisses poulet': 1, 'Poulet': 1, 'Lardons': 1, 'Jambon': 1,
  'Tofu': 1, 'Bœuf': 1, 'Bœuf haché': 1, 'Saumon fumé': 1, 'Saumon': 1,
  'Œufs': 4, 'Feta': 4, 'Crème fraîche': 4, 'Crème': 4, 'Lait': 4,
  'Parmesan': 4, 'Mozzarella': 4, 'Gruyère': 4, 'Béchamel': 4, 'Beurre': 4,
  'Œuf': 4, 'Chèvre': 4, 'Fromage râpé': 4,
  'Penne': 2, 'Riz': 2, 'Farine': 2, 'Tortilla': 2, 'Tortillas': 2,
  'Pain': 2, 'Pain de mie': 2, 'Pâtes lasagne': 2, 'Quinoa': 2,
  "Sauce soja": 3, 'Miel': 3, 'Pâte brisée': 3, 'Vin rouge': 3,
  'Haricots noirs': 3, 'Bouillon': 3, "Huile d'olive": 3, 'Pois chiches': 3,
  'Tomates cerises': 0, 'Tomates': 0, 'Brocoli': 0, 'Courgette': 0,
  'Épinards': 0, 'Poivron': 0, 'Haricots verts': 0, 'Avocat': 0,
  'Ail': 0, 'Carottes': 0, 'Poireaux': 0, 'Pommes de terre': 0,
  'Légumes variés': 0, 'Concombre': 0,
  'Fines herbes': 5, 'Basilic': 5, 'Persil': 5, 'Paprika': 5,
  'Cumin': 5, 'Herbes de Provence': 5,
}

export const DEMO_MEALS = [
  { id: 'd1',  name: 'Bœuf bourguignon',       tags: ['fave','wknd'],        ings: ['Bœuf','Vin rouge','Carottes','Bouillon'],           steps: ['Faire revenir la viande.','Ajouter les légumes.','Mijoter 2h.'] },
  { id: 'd2',  name: 'Buddha bowl quinoa',      tags: ['veg','fast'],         ings: ['Quinoa','Avocat','Tomates cerises','Pois chiches'],  steps: ['Cuire le quinoa.','Assembler le bol.'] },
  { id: 'd3',  name: 'Carbonara',               tags: ['fave','fast','kids'], ings: ['Penne','Lardons','Œufs','Parmesan'],                steps: ['Cuire les pâtes.','Préparer la sauce.','Mélanger hors du feu.'] },
  { id: 'd4',  name: 'Croque-monsieur',         tags: ['fast','kids'],        ings: ['Pain de mie','Jambon','Gruyère','Beurre'],           steps: ['Monter.','Dorer à la poêle.'] },
  { id: 'd5',  name: 'Curry de lentilles',      tags: ['veg','fave'],         ings: ['Lentilles vertes','Tomates','Lait de coco','Cumin'], steps: ['Faire revenir les épices.','Ajouter lentilles et tomates.','Cuire 25 min.'] },
  { id: 'd6',  name: 'Frittata épinards',       tags: ['veg','fast'],         ings: ['Épinards','Feta','Œufs'],                           steps: ['Battre les œufs.','Ajouter épinards et feta.','Cuire 10 min.'] },
  { id: 'd7',  name: 'Gratin dauphinois',       tags: ['fave','wknd'],        ings: ['Pommes de terre','Crème','Gruyère'],                steps: ['Trancher.','Monter en couches.','Cuire 1h.'] },
  { id: 'd8',  name: 'Lasagnes maison',         tags: ['wknd','fave','kids'], ings: ['Pâtes lasagne','Bœuf haché','Béchamel'],            steps: ['Préparer viande.','Monter couches.','Cuire 40 min.'] },
  { id: 'd9',  name: 'Pasta primavera',         tags: ['veg','fave','kids'],  ings: ['Penne','Courgette','Tomates','Parmesan'],            steps: ['Cuire les pâtes.','Faire revenir les légumes.','Mélanger.'] },
  { id: 'd10', name: 'Pizza 4 fromages',        tags: ['fave','kids','wknd'], ings: ['Farine','Tomates','Mozzarella'],                    steps: ['Préparer la pâte.','Garnir.','Cuire 15 min.'] },
  { id: 'd11', name: 'Poulet miel-ail & riz',   tags: ['fave'],               ings: ['Cuisses poulet','Miel','Ail','Riz'],                steps: ['Mélanger miel et ail.','Badigeonner.','Enfourner 35 min.'] },
  { id: 'd12', name: 'Quiche lorraine',         tags: ['fave','wknd'],        ings: ['Pâte brisée','Lardons','Crème fraîche','Œufs'],     steps: ['Foncer le moule.','Mélanger garniture.','Cuire 30 min.'] },
  { id: 'd13', name: 'Riz sauté poulet',        tags: ['fast'],               ings: ['Riz','Poulet','Sauce soja','Œuf'],                  steps: ['Sauter le riz.','Ajouter.','Assaisonner.'] },
  { id: 'd14', name: 'Salade niçoise',          tags: ['veg','fast'],         ings: ['Thon','Œufs','Haricots verts'],                     steps: ['Cuire les œufs.','Blanchir les haricots.','Assembler.'] },
  { id: 'd15', name: 'Soupe poireaux',          tags: ['veg','fast'],         ings: ['Poireaux','Pommes de terre','Crème'],               steps: ['Faire revenir.','Ajouter eau.','Mixer.'] },
  { id: 'd16', name: 'Tacos bœuf',              tags: ['fave','kids'],        ings: ['Bœuf haché','Haricots noirs','Tortillas'],          steps: ['Dorer le bœuf.','Ajouter haricots.','Garnir.'] },
  { id: 'd17', name: 'Tarte poireaux & chèvre', tags: ['wknd','veg'],         ings: ['Pâte brisée','Poireaux','Chèvre'],                  steps: ['Foncer.','Préparer garniture.','Cuire 30 min.'] },
  { id: 'd18', name: 'Tofu & brocoli sauté',    tags: ['veg','fave'],         ings: ['Tofu','Brocoli','Sauce soja','Riz'],                steps: ['Dorer le tofu.','Ajouter brocoli.','Servir sur le riz.'] },
  { id: 'd19', name: 'Wrap thon & avocat',      tags: ['fast'],               ings: ['Thon','Avocat','Tortilla'],                         steps: ['Écraser avocat.','Mélanger.','Rouler.'] },
]
