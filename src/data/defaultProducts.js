export const CATEGORIES = [
  {
    key: 'water',
    name: 'Water',
    description: 'Cold, refreshing bottles',
    emoji: '💧',
    gradient: 'from-sky-400 to-blue-500',
    soft: 'from-sky-50 to-blue-50',
  },
  {
    key: 'icecream',
    name: 'Ice Cream',
    description: 'Sweet frozen treats',
    emoji: '🍦',
    gradient: 'from-pink-400 to-fuchsia-500',
    soft: 'from-pink-50 to-fuchsia-50',
  },
  {
    key: 'crepe-pancake',
    name: 'Crepe & Pancake',
    description: 'Crispy & fluffy classics',
    emoji: '🥞',
    gradient: 'from-amber-400 to-orange-500',
    soft: 'from-amber-50 to-orange-50',
  },
]

export const DEFAULT_PRODUCTS = [
  // Water
  { id: 'water-big',         name: 'Big Water Bottle',     price: 50, category: 'water',         emoji: '💧' },
  { id: 'water-small',       name: 'Small Water Bottle',   price: 30, category: 'water',         emoji: '💧' },
  // Ice Cream
  { id: 'icecream-corny',    name: 'Corny Ice Cream',      price: 40, category: 'icecream',      emoji: '🍦' },
  { id: 'icecream-cup',      name: 'Ice Cream Cup',        price: 70, category: 'icecream',      emoji: '🍨' },
  // Crepe & Pancake
  { id: 'crepe-normal',      name: 'Normal Crepe',         price: 150, category: 'crepe-pancake', emoji: '🥞' },
  { id: 'crepe-banana',      name: 'Banana Crepe',         price: 250, category: 'crepe-pancake', emoji: '🍌' },
  { id: 'pancake-small',     name: 'Small Normal Pancake', price: 20, category: 'crepe-pancake', emoji: '🥞' },
  { id: 'pancake-special',   name: 'Small Special Pancake', price: 30, category: 'crepe-pancake', emoji: '✨' },
]
