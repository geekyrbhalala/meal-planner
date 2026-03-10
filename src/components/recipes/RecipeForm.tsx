import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Recipe, CuisineType, MealType, DifficultyLevel, Ingredient, NutritionInfo, GroceryCategory } from '../../types/recipe';
import { CUISINE_LABELS } from '../../types/recipe';
import { GROCERY_CATEGORY_LABELS } from '../../types/grocery';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, 'id' | 'isDefault'>) => void;
  initialData?: Recipe | null;
}

const EMPTY_INGREDIENT: Ingredient = {
  name: '',
  quantity: 0,
  unit: 'g',
  category: 'vegetables',
};

const EMPTY_NUTRITION: NutritionInfo = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
};

const UNIT_OPTIONS = ['g', 'kg', 'ml', 'l', 'cups', 'tbsp', 'tsp', 'pieces'];

export function RecipeForm({ isOpen, onClose, onSave, initialData }: RecipeFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [nameGujarati, setNameGujarati] = useState(initialData?.nameGujarati ?? '');
  const [cuisine, setCuisine] = useState<CuisineType>(initialData?.cuisine ?? 'gujarati');
  const [mealType, setMealType] = useState<MealType>(initialData?.mealType ?? 'dinner');
  const [servings, setServings] = useState(initialData?.servings ?? 6);
  const [prepTime, setPrepTime] = useState(initialData?.prepTime ?? 10);
  const [cookTime, setCookTime] = useState(initialData?.cookTime ?? 30);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialData?.difficulty ?? 'medium');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients ?? [{ ...EMPTY_INGREDIENT }]
  );
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions ?? ['']
  );
  const [nutrition, setNutrition] = useState<NutritionInfo>(
    initialData?.nutrition ?? { ...EMPTY_NUTRITION }
  );
  const [tags, setTags] = useState(initialData?.tags.join(', ') ?? '');

  // Step tracking for the wizard-like form
  const [step, setStep] = useState(1);

  const addIngredient = () => {
    setIngredients([...ingredients, { ...EMPTY_INGREDIENT }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    setInstructions(instructions.map((s, i) => i === index ? value : s));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (nutrition.protein >= 15 && !parsedTags.includes('high-protein')) {
      parsedTags.push('high-protein');
    }

    const validIngredients = ingredients.filter(i => i.name.trim());
    const validInstructions = instructions.filter(s => s.trim());

    onSave({
      name: name.trim(),
      nameGujarati: nameGujarati.trim() || undefined,
      cuisine,
      mealType,
      servings,
      prepTime,
      cookTime,
      difficulty,
      ingredients: validIngredients,
      instructions: validInstructions,
      nutrition,
      tags: parsedTags,
    });

    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setNameGujarati('');
    setCuisine('gujarati');
    setMealType('dinner');
    setServings(6);
    setPrepTime(10);
    setCookTime(30);
    setDifficulty('medium');
    setIngredients([{ ...EMPTY_INGREDIENT }]);
    setInstructions(['']);
    setNutrition({ ...EMPTY_NUTRITION });
    setTags('');
    setStep(1);
  };

  const isStep1Valid = name.trim().length > 0;
  const isStep2Valid = ingredients.some(i => i.name.trim());
  const isStep3Valid = instructions.some(s => s.trim());

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { resetForm(); onClose(); }}
      title={initialData ? 'Edit Recipe' : 'Add New Recipe'}
      size="lg"
    >
      <div className="space-y-4">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[
            { num: 1, label: 'Basics' },
            { num: 2, label: 'Ingredients' },
            { num: 3, label: 'Instructions' },
            { num: 4, label: 'Nutrition' },
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step === s.num
                  ? 'bg-green-600 text-white'
                  : step > s.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {step > s.num ? '✓' : s.num}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Recipe Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Dal Dhokli, Khichdi, Paneer Bhurji..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name in Gujarati (optional)
              </label>
              <input
                type="text"
                value={nameGujarati}
                onChange={e => setNameGujarati(e.target.value)}
                placeholder="e.g., દાળ ઢોકળી"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine</label>
                <select
                  value={cuisine}
                  onChange={e => setCuisine(e.target.value as CuisineType)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {(Object.entries(CUISINE_LABELS) as [CuisineType, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meal Type</label>
                <select
                  value={mealType}
                  onChange={e => setMealType(e.target.value as MealType)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time (min)</label>
                <input
                  type="number"
                  value={prepTime}
                  onChange={e => setPrepTime(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cook Time (min)</label>
                <input
                  type="number"
                  value={cookTime}
                  onChange={e => setCookTime(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Servings</label>
                <input
                  type="number"
                  value={servings}
                  onChange={e => setServings(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  min={1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g., one-pot, quick, comfort-food"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!isStep1Valid}>
                Next: Ingredients →
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Ingredients */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              Add all ingredients needed for <strong>{name}</strong>. Each ingredient will appear in your grocery list.
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={e => updateIngredient(i, 'name', e.target.value)}
                    placeholder="Ingredient name"
                    className="flex-1 min-w-32 rounded border border-slate-300 px-2 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    value={ing.quantity || ''}
                    onChange={e => updateIngredient(i, 'quantity', Number(e.target.value))}
                    placeholder="Qty"
                    className="w-16 rounded border border-slate-300 px-2 py-1.5 text-sm"
                    min={0}
                  />
                  <select
                    value={ing.unit}
                    onChange={e => updateIngredient(i, 'unit', e.target.value)}
                    className="rounded border border-slate-300 px-1 py-1.5 text-sm"
                  >
                    {UNIT_OPTIONS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  <select
                    value={ing.category}
                    onChange={e => updateIngredient(i, 'category', e.target.value)}
                    className="rounded border border-slate-300 px-1 py-1.5 text-xs"
                  >
                    {(Object.entries(GROCERY_CATEGORY_LABELS) as [GroceryCategory, string][]).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeIngredient(i)}
                    className="text-slate-300 hover:text-red-400 shrink-0"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addIngredient}
              className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:border-green-400 hover:text-green-600 transition-colors"
            >
              + Add Ingredient
            </button>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button onClick={() => setStep(3)} disabled={!isStep2Valid}>
                Next: Instructions →
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Instructions */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              Add cooking steps for <strong>{name}</strong>.
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {instructions.map((step_text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    {i + 1}
                  </span>
                  <textarea
                    value={step_text}
                    onChange={e => updateInstruction(i, e.target.value)}
                    placeholder={`Step ${i + 1}...`}
                    rows={2}
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm resize-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    onClick={() => removeInstruction(i)}
                    className="text-slate-300 hover:text-red-400 mt-1"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addInstruction}
              className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:border-green-400 hover:text-green-600 transition-colors"
            >
              + Add Step
            </button>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
              <Button onClick={() => setStep(4)} disabled={!isStep3Valid}>
                Next: Nutrition →
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Nutrition */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Enter approximate nutrition values <strong>per serving</strong> for <strong>{name}</strong>.
              You can estimate or look up values online.
            </p>

            <div className="grid grid-cols-5 gap-3">
              {[
                { key: 'calories', label: 'Calories', unit: 'kcal', color: 'border-orange-300 focus:ring-orange-400' },
                { key: 'protein', label: 'Protein', unit: 'g', color: 'border-green-300 focus:ring-green-400' },
                { key: 'carbs', label: 'Carbs', unit: 'g', color: 'border-blue-300 focus:ring-blue-400' },
                { key: 'fat', label: 'Fat', unit: 'g', color: 'border-yellow-300 focus:ring-yellow-400' },
                { key: 'fiber', label: 'Fiber', unit: 'g', color: 'border-purple-300 focus:ring-purple-400' },
              ].map(n => (
                <div key={n.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{n.label}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={nutrition[n.key as keyof NutritionInfo] || ''}
                      onChange={e => setNutrition({ ...nutrition, [n.key]: Number(e.target.value) })}
                      className={`w-full rounded-lg border px-3 py-2 text-sm ${n.color}`}
                      min={0}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {n.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              <strong>Tip:</strong> Don't know the exact nutrition? Estimate roughly —
              a typical vegetarian dinner is ~300-450 cal, 12-25g protein per serving.
              You can always edit these later.
            </div>

            {/* Summary preview */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Recipe Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Cuisine:</strong> {CUISINE_LABELS[cuisine]}</p>
                <p><strong>Meal:</strong> {mealType}</p>
                <p><strong>Time:</strong> {prepTime + cookTime} min</p>
                <p><strong>Ingredients:</strong> {ingredients.filter(i => i.name.trim()).length} items</p>
                <p><strong>Steps:</strong> {instructions.filter(s => s.trim()).length}</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)}>← Back</Button>
              <Button onClick={handleSave}>
                {initialData ? 'Save Changes' : 'Add Recipe'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
