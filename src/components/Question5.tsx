import { Gauge } from 'lucide-react';

interface Question5Props {
  value: number | null;
  onChange: (value: number) => void;
  step: number;
  totalSteps: number;
}

export function Question5({ value, onChange, step, totalSteps }: Question5Props) {
  const displayValue = value ?? 5;

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          คุณมีความมั่นใจในการขับขี่ในมหาวิทยาลัยระดับใด?
        </h2>
        <p className="text-on-surface-variant mb-8">Slider</p>

        <div className="flex flex-col items-center gap-8 mt-4">
          <div className="text-5xl font-bold text-primary">
            {displayValue}
          </div>
          <div className="w-full max-w-md flex flex-col gap-4">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={displayValue} 
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between w-full text-sm text-on-surface-variant font-medium">
              <span>ไม่มั่นใจเลย (1)</span>
              <span>มั่นใจมาก (10)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
