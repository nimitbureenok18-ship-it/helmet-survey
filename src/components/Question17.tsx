import { CheckCircle2, MapPin, Navigation, Navigation2 } from 'lucide-react';

interface Question17Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

const DISTANCES = [
  { id: 'always', label: 'ใส่เสมอ ไม่ว่าจะใกล้แค่ไหน (Always wear it)', icon: Navigation2 },
  { id: 'sometimes', label: 'ใส่บางครั้ง ถ้ารู้สึกว่าเส้นทางอันตราย (Sometimes)', icon: Navigation },
  { id: 'never', label: 'ไม่ใส่เลย สำหรับระยะทางใกล้ๆ (Never for short trips)', icon: MapPin },
];

export function Question17({ value, onChange, step, totalSteps }: Question17Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          สำหรับการเดินทาง "ระยะสั้น" (เช่น ไปปากซอย ไปซื้อของใกล้ๆ) คุณใส่หมวกกันน็อกหรือไม่?
        </h2>
        <p className="text-on-surface-variant mb-8">Trip Distance vs Helmet Use</p>

        <div className="grid grid-cols-1 gap-4">
          {DISTANCES.map((dist) => {
            const isSelected = value === dist.id;
            const Icon = dist.icon;
            
            return (
              <button 
                key={dist.id}
                onClick={() => onChange(dist.id)}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 active:scale-[0.98]
                  ${isSelected 
                    ? 'bg-secondary-fixed border-primary shadow-sm' 
                    : 'border-outline-variant bg-surface-container-low hover:border-secondary hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'bg-secondary-fixed text-primary'}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-lg font-semibold text-on-surface text-left">{dist.label}</span>
                </div>
                <CheckCircle2 
                  className={isSelected ? 'text-primary shrink-0 ml-2' : 'text-outline-variant opacity-50 shrink-0 ml-2'} 
                  size={24} 
                  fill={isSelected ? "currentColor" : "none"}
                  stroke={isSelected ? "white" : "currentColor"}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
