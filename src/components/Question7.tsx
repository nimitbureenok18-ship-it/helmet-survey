import { CheckSquare } from 'lucide-react';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  step: number;
  totalSteps: number;
}

const OPTIONS = [
  { id: 'gloves', label: 'ถุงมือการ์ด (Riding Gloves)' },
  { id: 'jacket', label: 'เสื้อการ์ด (Riding Jacket)' },
  { id: 'boots', label: 'รองเท้าขับขี่ (Riding Boots)' },
  { id: 'kneepads', label: 'สนับเข่า/ศอก (Knee/Elbow Pads)' },
];

export function Question7({ value, onChange, step, totalSteps }: Props) {
  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter(v => v !== id));
    else onChange([...value, id]);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Optional</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          คุณสวมใส่อุปกรณ์ป้องกันอื่นๆ นอกเหนือจากหมวกกันน็อคหรือไม่?
        </h2>
        <p className="text-on-surface-variant mb-8">เลือกได้มากกว่า 1 ข้อ (Checkboxes)</p>
        <div className="grid grid-cols-1 gap-4">
          {OPTIONS.map((opt) => {
            const isSelected = value.includes(opt.id);
            return (
              <button 
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${isSelected ? 'bg-secondary-fixed border-primary shadow-sm' : 'border-outline-variant bg-surface-container-low hover:border-secondary hover:shadow-md'}`}
              >
                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-outline bg-white'}`}>
                  {isSelected && <CheckSquare size={16} />}
                </div>
                <span className={`text-lg font-semibold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
