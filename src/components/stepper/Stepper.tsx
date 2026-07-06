import { cx } from '../../utils/cx';

export interface StepperStep {
  /** Short step label. */
  label: string;
  /** Optional secondary description. */
  description?: string;
}

export interface StepperProps {
  /** Ordered list of steps. */
  steps: StepperStep[];
  /** Index of the active (current) step. */
  activeStep: number;
  /** When provided, completed/current steps become clickable. */
  onStepChange?: (index: number) => void;
  /** Layout direction. Defaults to horizontal. */
  orientation?: 'horizontal' | 'vertical';
  /** Accessible name for the step list. */
  'aria-label'?: string;
  className?: string;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

/**
 * Progress indicator for a multi-step flow. Steps are numbered pixel markers;
 * completed steps show a check, the current step is filled, upcoming steps are
 * outlined - status is never conveyed by color alone.
 */
export function Stepper({
  steps,
  activeStep,
  onStepChange,
  orientation = 'horizontal',
  className,
  'aria-label': ariaLabel,
}: StepperProps) {
  const statusOf = (index: number): StepStatus =>
    index < activeStep ? 'complete' : index === activeStep ? 'current' : 'upcoming';

  return (
    <ol
      className={cx('du_stepper', `du_stepper_${orientation}`, className)}
      aria-label={ariaLabel}
    >
      {steps.map((step, index) => {
        const status = statusOf(index);
        const isCurrent = status === 'current';
        const interactive = Boolean(onStepChange) && status !== 'upcoming';

        const marker = (
          <span className="du_stepper_marker" aria-hidden="true">
            {status === 'complete' ? (
              <span className="du_stepper_check" />
            ) : (
              index + 1
            )}
          </span>
        );

        const text = (
          <span className="du_stepper_text">
            <span className="du_stepper_label">{step.label}</span>
            {step.description && (
              <span className="du_stepper_description">{step.description}</span>
            )}
          </span>
        );

        return (
          <li
            key={index}
            className="du_stepper_item"
            data-status={status}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {interactive ? (
              <button
                type="button"
                className="du_stepper_button"
                onClick={() => onStepChange?.(index)}
              >
                {marker}
                {text}
              </button>
            ) : (
              <span className="du_stepper_button">
                {marker}
                {text}
              </span>
            )}
            {index < steps.length - 1 && (
              <span className="du_stepper_connector" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
