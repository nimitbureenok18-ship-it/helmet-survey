import { CheckCircle2, Sun, CloudRain, Umbrella, Cloud } from 'lucide-react';

interface Question18Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

const WEATHER_EFFECTS = [
  { id: 'heat', label: 'อากาศร้อนอบอ้าว ทำให้ไม่อยากใส่', icon: Sun },
  { id: 'rain', label: 'ฝนตกหนัก ทำให้ทัศนวิสัยแย่ลงเมื่อใส่', icon: CloudRain },
  { id: 'both', label: 'ทั้งร้อนและฝน เป็นอุปสรรคทั้งคู่', icon: Cloud },
  { id: 'no_effect', label: 'สภาพอากาศไม่มีผล ใส่เป็นประจำอยู่แล้ว', icon: Umbrella },
];

export function Question18({ value, onChange, step, totalSteps }: Question18Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          "สภาพอากาศ" มีผลต่อการตัดสินใจใส่หมวกกันน็อกของคุณหรือไม่?
        </h2>
        <p className="text-on-surface-variant mb-8">Weather Influence</p>

        <div className="grid grid-cols-1 gap-4">
          {WEATHER_EFFECTS.map((effect) => {
            const isSelected = value === effect.id;
            const Icon = effect.icon;
            
            return (
              <button 
                key={effect.id}
                onClick={() => onChange(effect.id)}
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
                  <span className="text-lg font-semibold text-on-surface text-left">{effect.label}</span>
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
