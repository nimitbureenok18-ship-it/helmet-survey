/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { BottomBar } from './components/BottomBar';
import { DynamicQuestionRenderer } from './components/DynamicQuestionRenderer';
import { QuestionFileManagerModal } from './components/QuestionFileManagerModal';
import { SuccessScreen } from './components/SuccessScreen';
import { SurveyData, QuestionItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';
import defaultQuestionsData from './data/questions.json';

const initialSurveyData: SurveyData = {
  gender: null,
  age: null,
  academicYear: null,
  major: '',
  ridingExperience: null,
  attitude_1: null,
  attitude_2: null,
  attitude_3: null,
  attitude_4: null,
  social_1: null,
  social_2: null,
  social_3: null,
  social_4: null,
  control_1: null,
  control_2: null,
  control_3: null,
  control_4: null,
  intent_1: null,
  intent_2: null,
  intent_3: null,
  intent_4: null,
};

export default function App() {
  const [questions, setQuestions] = useLocalStorage<QuestionItem[]>(
    'nrruResearchSurveyQuestions_v2',
    defaultQuestionsData as QuestionItem[]
  );
  const [step, setStep] = useLocalStorage<number>('nrruResearchSurveyStep_v1', 1);
  const [data, setData] = useLocalStorage<SurveyData>('nrruResearchSurveyData_v1', initialSurveyData);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const totalSteps = questions.length;
  const progress = totalSteps > 0 ? (Math.min(step, totalSteps) / totalSteps) * 100 : 0;
  const currentQuestion = questions[step - 1];

  const handleReset = () => {
    setData(initialSurveyData);
    setStep(1);
  };

  const triggerVibration = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleNext = useCallback(() => {
    triggerVibration();
    setStep((s) => Math.min(s + 1, totalSteps + 1));
  }, [totalSteps, setStep]);

  const handleBack = () => {
    triggerVibration();
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleValueChange = (val: any, extraData?: any) => {
    triggerVibration();
    if (!currentQuestion) return;

    setData((prev) => {
      const updated = { ...prev, [currentQuestion.key]: val };
      if (extraData !== undefined && currentQuestion.key === 'scarPhoto') {
        updated.scarAnalysis = extraData;
      }
      return updated;
    });
  };

  const isNextDisabled = (): boolean => {
    if (!currentQuestion) return false;
    if (step > totalSteps) return false;

    if (currentQuestion.required) {
      const val = data[currentQuestion.key];
      if (val === null || val === undefined) return true;
      if (typeof val === 'string' && val.trim() === '') return true;
      if (Array.isArray(val) && val.length === 0) return true;
      if (currentQuestion.type === 'number_input' && (val === null || val === undefined || val === '' || isNaN(val))) return true;
      if (currentQuestion.type === 'contact_form') {
        if (!val.name && !val.phone) return true;
      }
      if (currentQuestion.type === 'boolean' && typeof val !== 'boolean') return true;
    }
    return false;
  };

  const getNextLabel = (): string => {
    if (step === totalSteps) {
      const val = currentQuestion ? data[currentQuestion.key] : null;
      const hasValue = val !== null && val !== undefined && val !== '' && (!Array.isArray(val) || val.length > 0);
      return hasValue ? 'Submit' : currentQuestion?.required ? 'Submit' : 'Skip & Submit';
    }

    if (currentQuestion && !currentQuestion.required) {
      const val = data[currentQuestion.key];
      const hasValue =
        val !== null &&
        val !== undefined &&
        val !== '' &&
        (!Array.isArray(val) || val.length > 0) &&
        (currentQuestion.type !== 'contact_form' || (val && (val.name || val.phone || val.relation)));

      return hasValue ? 'Next' : 'Skip';
    }

    return 'Next';
  };

  const handleUpdateQuestions = (newQuestions: QuestionItem[]) => {
    setQuestions(newQuestions);
    setStep(1);
    setData(initialSurveyData);
  };

  const handleResetToDefault = () => {
    setQuestions(defaultQuestionsData as QuestionItem[]);
    setStep(1);
    setData(initialSurveyData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface overflow-x-hidden font-sans">
      <TopBar
        progress={progress}
        onOpenFileManager={() => setIsFileManagerOpen(true)}
        onReset={handleReset}
        questionCount={questions.length}
      />

      <main className="flex-grow flex items-start justify-center pt-24 pb-32 px-4 md:px-0 w-full max-w-3xl mx-auto overflow-hidden">
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              {step <= totalSteps && currentQuestion ? (
                <DynamicQuestionRenderer
                  question={currentQuestion}
                  step={step}
                  totalSteps={totalSteps}
                  value={data[currentQuestion.key]}
                  scarAnalysis={data.scarAnalysis}
                  onChange={handleValueChange}
                  onAutoAdvance={handleNext}
                />
              ) : (
                <SuccessScreen
                  data={data}
                  onReset={handleReset}
                  questions={questions}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomBar
        onBack={handleBack}
        onNext={handleNext}
        disableNext={isNextDisabled()}
        showBack={step > 1}
        hidden={step > totalSteps}
        isLastStep={step === totalSteps}
        nextLabel={getNextLabel()}
      />

      <QuestionFileManagerModal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        questions={questions}
        onUpdateQuestions={handleUpdateQuestions}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}
