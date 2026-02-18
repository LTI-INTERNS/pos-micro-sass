import React from 'react';

interface Step {
  id: string;
  label: string;
}

interface StepProgressBarProps {
  currentStep: number;
  completedSteps: number;
  steps: Step[];
  onStepClick: (step: number) => void;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  completedSteps,
  steps,
  onStepClick,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const stepNumber  = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent   = stepNumber === currentStep;
          const isClickable = stepNumber <= completedSteps + 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center relative z-10">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(stepNumber)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    ${isCompleted || isCurrent
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-md shadow-orange-500/40'
                      : 'bg-gray-700 border border-gray-600'}
                    ${isClickable && !isCurrent
                      ? 'cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30'
                      : ''}
                    ${!isClickable ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                  aria-label={`Go to step ${stepNumber}: ${step.label}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`
                        text-xs font-semibold
                        ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      {stepNumber}
                    </span>
                  )}
                </button>

                {/* Step Label */}
                <span
                  className={`
                    mt-2 text-[10px] md:text-xs font-medium text-center whitespace-nowrap
                    ${isCurrent   ? 'text-orange-400' : ''}
                    ${isClickable && !isCurrent ? 'text-gray-300' : ''}
                    ${!isClickable ? 'text-gray-500' : ''}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-1.5 relative">
                  <div className="absolute inset-0 bg-gray-700" />
                  <div
                    className={`
                      absolute inset-0 transition-all duration-500 ease-in-out
                      ${stepNumber < currentStep
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 w-full'
                        : 'w-0'}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgressBar;
export type { Step, StepProgressBarProps };