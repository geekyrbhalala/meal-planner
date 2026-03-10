const SYNONYMS: Record<string, string> = {
  'cilantro': 'coriander leaves',
  'dhania': 'coriander leaves',
  'fresh coriander': 'coriander leaves',
  'coriander': 'coriander leaves',
  'dahi': 'yogurt',
  'curd': 'yogurt',
  'capsicum': 'bell pepper',
  'shimla mirch': 'bell pepper',
  'adrak': 'ginger',
  'lehsun': 'garlic',
  'pyaz': 'onion',
  'tamatar': 'tomato',
  'haldi': 'turmeric',
  'jeera': 'cumin seeds',
  'rai': 'mustard seeds',
  'mirch': 'green chili',
  'hari mirch': 'green chili',
  'chana dal': 'split chickpea dal',
  'besan': 'gram flour',
  'chickpea flour': 'gram flour',
  'maida': 'all-purpose flour',
  'atta': 'whole wheat flour',
  'chawal': 'rice',
  'basmati rice': 'rice',
};

export function normalizeIngredientName(name: string): string {
  const lower = name.toLowerCase().trim();
  return SYNONYMS[lower] ?? lower;
}

const UNIT_TO_GRAMS: Record<string, number> = {
  'kg': 1000,
  'g': 1,
  'cups': 150,
  'cup': 150,
  'tbsp': 15,
  'tsp': 5,
  'l': 1000,
  'ml': 1,
};

export function canConvertUnits(unit1: string, unit2: string): boolean {
  const u1 = unit1.toLowerCase();
  const u2 = unit2.toLowerCase();
  if (u1 === u2) return true;

  const weightUnits = ['kg', 'g', 'cups', 'cup', 'tbsp', 'tsp'];
  const volumeUnits = ['l', 'ml'];

  if (weightUnits.includes(u1) && weightUnits.includes(u2)) return true;
  if (volumeUnits.includes(u1) && volumeUnits.includes(u2)) return true;
  return false;
}

export function convertToBaseUnit(quantity: number, unit: string): { quantity: number; unit: string } {
  const u = unit.toLowerCase();
  const factor = UNIT_TO_GRAMS[u];
  if (!factor) return { quantity, unit };

  const volumeUnits = ['l', 'ml'];
  if (volumeUnits.includes(u)) {
    return { quantity: quantity * factor, unit: 'ml' };
  }
  return { quantity: quantity * factor, unit: 'g' };
}

export function formatQuantity(quantity: number, unit: string): string {
  if (unit === 'g' && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(1)} kg`;
  }
  if (unit === 'ml' && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(1)} L`;
  }
  if (unit === 'pieces' || unit === 'pcs') {
    return `${Math.ceil(quantity)} pcs`;
  }
  return `${Math.round(quantity)} ${unit}`;
}

export function roundUpForShopping(quantity: number, unit: string): number {
  if (unit === 'g') {
    if (quantity <= 100) return Math.ceil(quantity / 50) * 50;
    if (quantity <= 500) return Math.ceil(quantity / 100) * 100;
    return Math.ceil(quantity / 250) * 250;
  }
  if (unit === 'ml') {
    if (quantity <= 500) return Math.ceil(quantity / 100) * 100;
    return Math.ceil(quantity / 250) * 250;
  }
  if (unit === 'pieces' || unit === 'pcs') {
    return Math.ceil(quantity);
  }
  return Math.ceil(quantity * 10) / 10;
}
