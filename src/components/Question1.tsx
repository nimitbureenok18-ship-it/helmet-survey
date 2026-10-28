import { CheckCircle2, Info } from 'lucide-react';

interface Question1Props {
  value: string | null;
  onChange: (value: string) => void;
  step: number;
  totalSteps: number;
}

const HELMET_TYPES = [
  {
    id: 'full_face',
    title: 'แบบเต็มใบ',
    subtitle: '(Full Face)',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOC4_RbYViSdwoAHAtegr-Uy4Na9KAqq3Ph4NJKSdwNmrA16o_Sr5HNnKx6HJwBoYh5WaqRc0CrzLtN6_clUOhDt_t4qeeVt9vYVS3NDHP_X8MC4abj83GcbQ-4ehHjN1gXzYwciGMYepLROpbsG3x42iWMTabbrn8KnAp0FQGgYW7z7t1iOPsyIMhDbRLimp5vhmkErCR_kIQH--A8uP08-nb8mknMW7RMvvExwEx0u3wKNXxfb2zxhHXZmLpbLrDrkxNtep7R-o'
  },
  {
    id: 'open_face',
    title: 'แบบเปิดหน้า',
    subtitle: '(Open Face)',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNB2CELsJCQw6m3LU2J9luc-AfqvmgXsLMFzWLhCuYRa4xZqg9q9-gRGmRRQsvjln7NonlCYBRpylv5yHI5PWCVqDfbR_dxM6N9yoaPuDkgxO_V6bngOTeBBB_94C2HHAvu0Te6LnCcZpkC8ZSEg92j-19myz8KvVSzPXrFQ2tKZN7MatAK0pUwf3rZn7WoCCW0J_p1Ws2jt-hVJINqY841AlnoPdHSL0w3A8vKGCV7tPEtHJPJJxI9M9f0Ql37Og4PTvKislwjcM'
  },
  {
    id: 'half_shell',
    title: 'แบบครึ่งใบ',
    subtitle: '(Half Shell)',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoZI4qdR7RXF_vRsf3VvznEyEyoQIfCMT6op_ZeMBCC-rcWYI92iLdE4uVTrHBtSjDQN5dLx3BA6pJEvXMGmYzcoz98TNhTvSwYJoMOcEfQxNr_NbRrlAPbOjKQ7TZ34MrXVOq-o1iyC6nq-e-UxhDzGq9bRkgHKAWg4chX3vlYMSmfUKJjqwuPTfzSKBNOg6NTp82l0aQUbRpQUuZN0ReL2o6gFHgsF8bQAwuL9nMQZ4LdVTbU7sHdenlQVN2Eb4N3lvBo0binqg'
  }
];

export function Question1({ value, onChange, step, totalSteps }: Question1Props) {
  const percentage = Math.round((step / totalSteps) * 100);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90">
            <circle className="text-surface-variant stroke-current" cx="40" cy="40" fill="transparent" r="34" strokeWidth="6" />
            <circle 
              className="text-primary stroke-current transition-all duration-500 ease-out" 
              cx="40" cy="40" fill="transparent" r="34" strokeWidth="6" 
              strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * (percentage / 100))} 
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-semibold text-primary">{percentage}%</span>
        </div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.05em]">Step {step} of {totalSteps}</p>
      </div>

      <div className="bg-white rounded-[24px] p-8 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
        </div>
        <h2 className="text-2xl font-semibold text-on-surface mb-2 text-center">
          ประเภทของหมวกกันน็อคที่คุณใช้งานเป็นประจำ?
        </h2>
        <p className="text-on-surface-variant text-center mb-8">Image Picker / Radio Group</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HELMET_TYPES.map((type) => {
            const isSelected = value === type.id;
            return (
              <label key={type.id} className="group relative cursor-pointer">
                <input 
                  type="radio" 
                  name="helmet_type" 
                  className="sr-only" 
                  value={type.id}
                  checked={isSelected}
                  onChange={() => onChange(type.id)}
                />
                <div className={`h-full flex flex-col items-center p-6 bg-surface-container-low border rounded-2xl transition-all duration-200 
                  ${isSelected 
                    ? 'border-primary bg-secondary-fixed ring-1 ring-primary shadow-sm' 
                    : 'border-outline-variant hover:border-secondary hover:shadow-md'
                  }`}>
                  <div className="w-24 h-24 mb-4 overflow-hidden rounded-lg bg-white p-2">
                    <img src={type.img} alt={type.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-sm font-bold text-on-surface text-center">{type.title}</span>
                  <span className="text-xs text-on-surface-variant text-center">{type.subtitle}</span>
                  <div className={`mt-4 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    <CheckCircle2 className="text-primary" size={24} />
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-tertiary-container/10 border border-tertiary-container/30 rounded-lg">
        <Info className="text-tertiary shrink-0" size={20} />
        <p className="text-sm text-tertiary">
          ข้อมูลของคุณจะถูกเก็บเป็นความลับเพื่อใช้ในการศึกษาเท่านั้น
        </p>
      </div>
    </div>
  );
}
