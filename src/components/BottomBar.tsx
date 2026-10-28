import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface BottomBarProps {
  onBack: () => void;
  onNext: () => void;
  disableNext: boolean;
  showBack: boolean;
  hidden?: boolean;
  isLastStep?: boolean;
  nextLabel?: string;
}

export function BottomBar({ onBack, onNext, disableNext, showBack, hidden, isLastStep, nextLabel }: BottomBarProps) {
  const label = nextLabel || (isLastStep ? 'Submit' : 'Next');
  const isSkip = label.includes('Skip');

  return (
    <nav className={`fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-surface border-t border-outline-variant transition-transform duration-500 ${hidden ? 'translate-y-full' : 'translate-y-0'}`}>
      <button 
        onClick={onBack}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 text-on-surface-variant ${showBack ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onNext}
          disabled={disableNext}
          className={`rounded-xl px-6 py-2.5 flex items-center gap-2 transition-all duration-200 active:scale-95 font-semibold text-sm shadow-sm ${
            disableNext 
              ? 'bg-primary-container text-on-primary-container opacity-50 cursor-not-allowed'
              : isSkip
                ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white'
                : 'bg-primary text-white hover:bg-secondary'
          }`}
        >
          <span>{label}</span>
          {isLastStep ? <Check size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </nav>
  );
}
