import { CheckSquare } from 'lucide-react';

interface Question3Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

const FREQUENCIES = [
  { id: 'every_time', label: 'ทุกครั้ง' },
  { id: 'often', label: 'บ่อยครั้ง' },
  { id: 'sometimes', label: 'บางครั้ง' },
  { id: 'rarely', label: 'นานๆ ครั้ง' },
  { id: 'never', label: 'ไม่เคยเลย' },
];

export function Question3({ value, onChange, step, totalSteps }: Question3Props) {
  return (
    <div className="flex flex-col w-full">
      <div className="mb-8 rounded-[24px] overflow-hidden shadow-sm aspect-[21/9] border border-outline-variant transition-all hover:border-secondary">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj-qlCgHVkJnvpUbgiDaHjmQR7szHRA0GdCYk_utB_VbeHASmXHYzEZEhL-ZkctVu8gBygCPvP4JUu0FqTeCVunByCv006se99hW9HQswn0E8J8C7egeRxi68ELlg1pHWc_564nqO3OoHsFa5L5_xzBUHT7Dj-UtqlhMXqmfsUVVBbv4ww1VYBobdgyegdJcc6mD8J_fYlZ84CPH8VJGgOWzjO7xLLYGyggcmhNnD1j9MZoU14mJ82TdFWjexYqdW4drOpj39auZA" 
          alt="Campus"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-lg">
            <CheckSquare size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.05em]">Required Question {step} of {totalSteps}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface leading-tight">
            คุณสวมหมวกกันน็อคบ่อยแค่ไหนเมื่อขับขี่รถจักรยานยนต์ในมหาวิทยาลัย?
          </h2>
          <p className="text-base text-on-surface-variant">
            Radio Button Group (Vertical)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {FREQUENCIES.map((freq) => {
            const isSelected = value === freq.id;
            return (
              <label 
                key={freq.id}
                className="group relative flex items-center p-6 bg-white border border-outline-variant rounded-[20px] cursor-pointer hover:border-secondary hover:shadow-md transition-all"
              >
                <input 
                  type="radio" 
                  name="helmet_frequency" 
                  className="hidden peer" 
                  value={freq.id}
                  checked={isSelected}
                  onChange={() => onChange(freq.id)}
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isSelected ? 'border-primary bg-primary' : 'border-outline group-hover:border-primary'}`}>
                  <div className={`w-2 h-2 bg-white rounded-full transition-transform ${isSelected ? 'scale-100' : 'scale-0'}`} />
                </div>
                <span className={`ml-4 text-lg transition-colors ${isSelected ? 'text-primary' : 'text-on-surface group-hover:text-primary'}`}>
                  {freq.label}
                </span>
                {isSelected && (
                  <div className="absolute inset-0 rounded-xl bg-secondary-fixed/10 pointer-events-none" />
                )}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
