import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, Flag, RotateCcw } from "lucide-react";
import { type Exercise } from "@shared/schema";
import confetti from "canvas-confetti";
import { useProgress } from "@/hooks/use-progress";
import { Link } from "wouter";

interface QuizProps {
  lessonId: number;
  exercises: Exercise[];
  onComplete?: () => void;
}

export function Quiz({ lessonId, exercises, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  
  const { markLessonComplete } = useProgress();

  const currentExercise = exercises[currentIndex];
  const progressPercent = ((currentIndex) / exercises.length) * 100;

  const handleCheck = () => {
    if (!selectedOption) return;
    
    setIsRevealed(true);
    if (selectedOption === currentExercise.correctAnswer) {
      setCorrectCount(prev => prev + 1);
      // Success sound or subtle effect could go here
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    markLessonComplete(lessonId);
    
    // Celebrate!
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#059669', '#10b981', '#fbbf24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#059669', '#10b981', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    
    if (onComplete) onComplete();
  };

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center bg-muted rounded-2xl">
        <p className="text-muted-foreground">No exercises available for this lesson yet.</p>
        <button 
          onClick={finishQuiz}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-medium"
        >
          Mark Complete
        </button>
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((correctCount / exercises.length) * 100);
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-8 rounded-3xl border border-border shadow-xl text-center max-w-lg mx-auto"
      >
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Flag className="w-10 h-10 text-success" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">Lesson Complete!</h2>
        <p className="text-muted-foreground mb-8">
          You scored {correctCount} out of {exercises.length} ({accuracy}%)
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsRevealed(false);
              setIsFinished(false);
              setCorrectCount(0);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-muted text-foreground hover:bg-border transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
          
          <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <ArrowRight className="w-5 h-5" />
            Continue Learning
          </Link>
        </div>
      </motion.div>
    );
  }

  const isCorrect = selectedOption === currentExercise.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>Exercise {currentIndex + 1} of {exercises.length}</span>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-sm mb-6">
            <h3 className="text-2xl font-bold font-arabic mb-8 text-center leading-relaxed" dir="rtl">
              {currentExercise.question}
            </h3>

            <div className="grid gap-3">
              {currentExercise.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let optionStateClass = "border-border hover:border-primary/50 hover:bg-muted/50 bg-background";
                
                if (isRevealed) {
                  if (option === currentExercise.correctAnswer) {
                    optionStateClass = "border-success bg-success/10 text-foreground font-bold";
                  } else if (isSelected && option !== currentExercise.correctAnswer) {
                    optionStateClass = "border-destructive bg-destructive/10 text-foreground opacity-50";
                  } else {
                    optionStateClass = "border-border bg-background opacity-50";
                  }
                } else if (isSelected) {
                  optionStateClass = "border-primary bg-primary/5 ring-2 ring-primary/20";
                }

                return (
                  <button
                    key={idx}
                    disabled={isRevealed}
                    onClick={() => setSelectedOption(option)}
                    className={`
                      w-full p-4 rounded-2xl border-2 text-lg font-arabic transition-all duration-200 flex justify-between items-center
                      ${optionStateClass}
                    `}
                    dir="rtl"
                  >
                    <span>{option}</span>
                    {isRevealed && option === currentExercise.correctAnswer && (
                      <Check className="w-5 h-5 text-success" />
                    )}
                    {isRevealed && isSelected && option !== currentExercise.correctAnswer && (
                      <X className="w-5 h-5 text-destructive" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl mb-6 flex gap-4 ${isCorrect ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}
          >
            <div className={`mt-1 flex-shrink-0 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
              {isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                {isCorrect ? "Excellent!" : "Not quite right"}
              </h4>
              <p className="text-foreground/80 leading-relaxed text-sm">
                {currentExercise.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        {!isRevealed ? (
          <button
            onClick={handleCheck}
            disabled={!selectedOption}
            className="px-8 py-3 rounded-xl font-bold text-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all w-full sm:w-auto"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={`px-8 py-3 rounded-xl font-bold text-lg text-white shadow-lg transition-all w-full sm:w-auto ${
              isCorrect 
                ? 'bg-success shadow-success/25 hover:shadow-success/40' 
                : 'bg-primary shadow-primary/25 hover:shadow-primary/40'
            } hover:-translate-y-0.5`}
          >
            {currentIndex < exercises.length - 1 ? "Next Question" : "Finish Lesson"}
          </button>
        )}
      </div>
    </div>
  );
}
