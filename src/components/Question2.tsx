import { CheckCircle2, Shield, Gavel, Repeat, HelpCircle } from 'lucide-react';

interface Question2Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

const REASONS = [
  { id: 'safety', label: 'ความปลอดภัย', icon: Shield },
  { id: 'rules', label: 'กฎระเบียบวินัยจราจร', icon: Gavel },
  { id: 'habit', label: 'ความเคยชิน', icon: Repeat },
  { id: 'other', label: 'อื่นๆ', icon: HelpCircle },
];

export function Question2({ value, onChange, step, totalSteps }: Question2Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">
          เหตุผลหลักที่คุณสวมหมวกกันน็อคคืออะไร?
        </h2>
        <p className="text-on-surface-variant mb-8">Radio Button Group</p>

        <div className="grid grid-cols-1 gap-4">
          {REASONS.map((reason) => {
            const isSelected = value === reason.id;
            const Icon = reason.icon;
            
            return (
              <button 
                key={reason.id}
                onClick={() => onChange(reason.id)}
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
                  <span className="text-lg font-semibold text-on-surface">{reason.label}</span>
                </div>
                <CheckCircle2 
                  className={isSelected ? 'text-primary' : 'text-outline-variant opacity-50'} 
                  size={24} 
                  fill={isSelected ? "currentColor" : "none"}
                  stroke={isSelected ? "white" : "currentColor"}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-on-surface-variant text-sm px-4">
        ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้เพื่อการศึกษาค้นคว้าทางวิชาการเท่านั้น
      </p>
    </div>
  );
}
