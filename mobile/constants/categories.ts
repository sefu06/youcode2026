export type Category = {
  id: string;
  label: string;
  emoji: string; // kept for legacy compat
  icon: string;  // MaterialCommunityIcons name
};

export const CATEGORIES: Category[] = [
  { id: 'all',             label: 'All',     emoji: '🌿', icon: 'view-grid-outline'     },
  { id: 'Produce',         label: 'Produce', emoji: '🥦', icon: 'leaf'                  },
  { id: 'Dairy',           label: 'Dairy',   emoji: '🥛', icon: 'cup-water'             },
  { id: 'Meat & Seafood',  label: 'Meat',    emoji: '🥩', icon: 'food-steak'            },
  { id: 'Bakery',          label: 'Bakery',  emoji: '🍞', icon: 'bread-slice'           },
  { id: 'Canned Goods',    label: 'Canned',  emoji: '🥫', icon: 'package-variant'       },
  { id: 'Grains & Pasta',  label: 'Grains',  emoji: '🌾', icon: 'grain'                 },
  { id: 'Snacks & Sweets', label: 'Snacks',  emoji: '🍪', icon: 'cookie-outline'        },
  { id: 'Beverages',       label: 'Drinks',  emoji: '🥤', icon: 'bottle-soda-outline'   },
  { id: 'Condiments',      label: 'Sauces',  emoji: '🧴', icon: 'bottle-tonic-outline'  },
  { id: 'Frozen Foods',    label: 'Frozen',  emoji: '🧊', icon: 'snowflake'             },
  { id: 'Other',           label: 'Other',   emoji: '📦', icon: 'shape-outline'         },
];

export const CATEGORY_IDS = CATEGORIES.slice(1).map((c) => c.id);
