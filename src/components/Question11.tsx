import { Star } from 'lucide-react';

interface Props {
  value: number | null;
  onChange: (value: number) => void;
  step: number;
  totalSteps: number;
}

export function Question11({ value, onChange, step, totalSteps }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">คุณให้คะแนนความปลอดภัยของถนนในมหาวิทยาลัยเท่าใด?</h2>
        <p className="text-on-surface-variant mb-8">Rating Scale (5 Stars)</p>
        
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onChange(star)}
              className={`p-2 transition-transform active:scale-90 hover:scale-110 ${(value || 0) >= star ? 'text-amber-400' : 'text-outline-variant'}`}
            >
              <Star size={48} fill={(value || 0) >= star ? 'currentColor' : 'none'} strokeWidth={1.5} />
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm font-medium text-on-surface-variant px-4">
          <span>แย่มาก</span>
          <span>ดีมาก</span>
        </div>
      </div>
    </div>
  );
}
