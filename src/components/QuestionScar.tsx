import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  value: string | null;
  analysis: any | null;
  onChange: (image: string, analysis: any) => void;
  step: number;
  totalSteps: number;
}

export function QuestionScar({ value, analysis, onChange, step, totalSteps }: Props) {
  const [preview, setPreview] = useState<string | null>(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<any | null>(analysis);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        await analyzeImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze-scar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      if (!res.ok) {
        throw new Error('Failed to analyze image');
      }
      const data = await res.json();
      setCurrentAnalysis(data);
      onChange(base64Image, data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col min-h-[calc(100vh-140px)]">
      <div className="flex-1">
        <div className="mb-8">
          <span className="text-on-surface-variant text-xs font-bold uppercase tracking-[0.05em]">Optional Feature</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mb-2">AI Scar Assessment</h2>
        <p className="text-on-surface-variant mb-8">
          Have a scar from a motorcycle incident where you weren't wearing adequate gear? Take a picture to have our AI analyze it and provide feedback.
        </p>

        <div className="space-y-6">
          {!preview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video md:aspect-[16/9] border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center gap-4 bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <div className="text-center">
                <p className="font-medium text-on-surface">Click to take a photo or upload</p>
                <p className="text-sm text-on-surface-variant mt-1">Supports JPG, PNG (Max 5MB)</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden aspect-video md:aspect-[16/9] bg-surface-container border border-outline-variant">
                <img src={preview} alt="Scar preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setPreview(null);
                    setCurrentAnalysis(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-4 right-4 px-4 py-2 bg-error text-on-error rounded-full text-sm font-medium hover:bg-error/90 transition-colors shadow-sm"
                >
                  Retake Photo
                </button>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-8 gap-4 bg-surface-container-lowest rounded-3xl border border-outline-variant">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-on-surface-variant font-medium">Analyzing injury severity...</p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-2xl bg-error-container text-on-error-container flex items-start gap-3 border border-error/20">
                  <AlertCircle className="shrink-0 mt-0.5" size={20} />
                  <p>{error}</p>
                </div>
              )}

              {currentAnalysis && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-secondary-container text-on-secondary-container p-6 rounded-3xl space-y-4 shadow-sm border border-secondary/20"
                >
                  <div className="flex items-center justify-between border-b border-on-secondary-container/10 pb-4">
                    <h3 className="font-bold text-lg">AI Assessment Result</h3>
                    <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full">
                      <span className="text-sm font-medium">Severity:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level}
                            className={`w-2 h-4 rounded-full ${
                              level <= currentAnalysis.severity 
                                ? (currentAnalysis.severity >= 4 ? 'bg-error' : currentAnalysis.severity >= 3 ? 'bg-primary' : 'bg-tertiary')
                                : 'bg-on-secondary-container/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="italic text-on-secondary-container/80 text-sm mb-1">Observation</p>
                    <p className="font-medium text-[15px] leading-relaxed">{currentAnalysis.empathyMessage}</p>
                  </div>
                  
                  <div className="bg-background/40 p-4 rounded-2xl border border-on-secondary-container/5">
                    <p className="italic text-on-secondary-container/80 text-sm mb-1">Safety Advice</p>
                    <p className="font-medium text-[15px] leading-relaxed">{currentAnalysis.advice}</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
