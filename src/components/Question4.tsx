import { Type } from 'lucide-react';

interface Question4Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

export function Question4({ value, onChange, step, totalSteps }: Question4Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Optional</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          คุณมีข้อเสนอแนะเพิ่มเติมเพื่อเพิ่มความปลอดภัยหรือไม่?
        </h2>
        <p className="text-on-surface-variant mb-8">Long Text</p>

        <div className="flex flex-col gap-4">
          <textarea
            className="w-full h-32 p-4 rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            placeholder="พิมพ์คำตอบของคุณที่นี่..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
