export type Category = {
  id: string;
  label: string;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { id: 'all',             label: 'All',         emoji: '🌿' },
  { id: 'Produce',         label: 'Produce',      emoji: '🥦' },
  { id: 'Dairy',           label: 'Dairy',        emoji: '🥛' },
  { id: 'Meat & Seafood',  label: 'Meat',         emoji: '🥩' },
  { id: 'Bakery',          label: 'Bakery',       emoji: '🍞' },
  { id: 'Canned Goods',    label: 'Canned',       emoji: '🥫' },
  { id: 'Grains & Pasta',  label: 'Grains',       emoji: '🌾' },
  { id: 'Snacks & Sweets', label: 'Snacks',       emoji: '🍪' },
  { id: 'Beverages',       label: 'Drinks',       emoji: '🥤' },
  { id: 'Condiments',      label: 'Sauces',       emoji: '🧴' },
  { id: 'Frozen Foods',    label: 'Frozen',       emoji: '🧊' },
  { id: 'Other',           label: 'Other',        emoji: '📦' },
];

export const CATEGORY_IDS = CATEGORIES.slice(1).map((c) => c.id);
