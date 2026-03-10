interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, className = '' }: CheckboxProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
      />
      {label && (
        <span className={`text-sm ${checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
}
