import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Reorder } from 'motion/react';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  step: number;
  totalSteps: number;
}

const DEFAULT_RANKING = [
  'ราคา (Price)',
  'มาตรฐานความปลอดภัย (Safety Rating)',
  'ความสวยงาม (Design/Style)',
  'ความสบายในการสวมใส่ (Comfort)',
  'แบรนด์ (Brand)'
];

export function Question14({ value, onChange, step, totalSteps }: Props) {
  const currentRanking = value.length > 0 ? value : DEFAULT_RANKING;

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRanking = [...currentRanking];
    [newRanking[index - 1], newRanking[index]] = [newRanking[index], newRanking[index - 1]];
    onChange(newRanking);
  };

  const moveDown = (index: number) => {
    if (index === currentRanking.length - 1) return;
    const newRanking = [...currentRanking];
    [newRanking[index + 1], newRanking[index]] = [newRanking[index], newRanking[index + 1]];
    onChange(newRanking);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-white rounded-[24px] p-6 md:p-10 border border-outline-variant shadow-sm transition-all hover:border-secondary">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-[0.05em]">Required</span>
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Question {step} of {totalSteps}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">จัดอันดับปัจจัยที่สำคัญที่สุดในการเลือกซื้อหมวกกันน็อค</h2>
        <p className="text-on-surface-variant mb-8">Ranking (อันดับ 1 สำคัญที่สุด) - ลากและวางเพื่อจัดอันดับ</p>
        
        <Reorder.Group axis="y" values={currentRanking} onReorder={onChange} className="flex flex-col gap-3">
          {currentRanking.map((item, index) => (
            <Reorder.Item 
              key={item} 
              value={item} 
              className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm cursor-grab active:cursor-grabbing bg-white relative z-0"
            >
              <GripVertical className="text-outline-variant shrink-0" size={20} />
              <div className="w-8 h-8 rounded-full bg-secondary-fixed text-primary font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </div>
              <span className="flex-grow font-medium text-lg">{item}</span>
              <div className="flex flex-col gap-1">
                <button 
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); moveUp(index); }}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-surface-container-high disabled:opacity-30 transition-colors"
                >
                  <ArrowUp size={18} />
                </button>
                <button 
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); moveDown(index); }}
                  disabled={index === currentRanking.length - 1}
                  className="p-1 rounded hover:bg-surface-container-high disabled:opacity-30 transition-colors"
                >
                  <ArrowDown size={18} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
