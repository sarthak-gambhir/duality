import { cx } from "../../utils/cx";
import { Icon } from "../icon/Icon";
import { useIcons } from "../icon/IconsProvider";

/** Explicit per-step status override (beyond the computed progress state). */
export type StepStatusOverride = "error" | "warning";

export interface StepperStep {
  /** Short step label. */
  label: string;
  /** Optional secondary description. */
  description?: string;
  /** Flags the step as optional (renders an "Optional" caption). */
  optional?: boolean;
  /** Overrides the computed status to flag a problem on this step. */
  status?: StepStatusOverride;
}

export interface StepperProps {
  /** Ordered list of steps. */
  steps: StepperStep[];
  /** Index of the active (current) step. */
  activeStep: number;
  /** When provided, steps become clickable (see `allowAllSteps`). */
  onStepChange?: (index: number) => void;
  /** Allow clicking upcoming steps too (non-linear flows). Defaults to false. */
  allowAllSteps?: boolean;
  /** Layout direction. Defaults to horizontal. */
  orientation?: "horizontal" | "vertical";
  /** Accessible name for the step list. */
  "aria-label"?: string;
  className?: string;
}

type StepStatus = "complete" | "current" | "upcoming" | StepStatusOverride;

/**
 * Progress indicator for a multi-step flow. Steps are numbered pixel markers;
 * completed steps show a check, the current step is filled, upcoming steps are
 * outlined, and error/warning steps swap in a tone glyph - status is never
 * conveyed by color alone.
 */
export function Stepper({
  steps,
  activeStep,
  onStepChange,
  allowAllSteps = false,
  orientation = "horizontal",
  className,
  "aria-label": ariaLabel,
}: StepperProps) {
  const icons = useIcons();
  const progressOf = (index: number): "complete" | "current" | "upcoming" =>
    index < activeStep
      ? "complete"
      : index === activeStep
        ? "current"
        : "upcoming";

  return (
    <ol
      className={cx("du_stepper", `du_stepper_${orientation}`, className)}
      aria-label={ariaLabel}
    >
      {steps.map((step, index) => {
        const progress = progressOf(index);
        const status: StepStatus = step.status ?? progress;
        const isCurrent = index === activeStep;
        const interactive =
          Boolean(onStepChange) && (allowAllSteps || progress !== "upcoming");

        let markerContent;
        if (status === "error") {
          markerContent = (
            <Icon icon={icons.toneError} className="du_stepper_glyph" />
          );
        } else if (status === "warning") {
          markerContent = (
            <Icon icon={icons.toneWarning} className="du_stepper_glyph" />
          );
        } else if (status === "complete") {
          markerContent = (
            <Icon icon={icons.stepComplete} className="du_stepper_check" />
          );
        } else {
          markerContent = index + 1;
        }

        const marker = (
          <span className="du_stepper_marker" aria-hidden="true">
            {markerContent}
          </span>
        );

        const text = (
          <span className="du_stepper_text">
            <span className="du_stepper_label">{step.label}</span>
            {step.optional && (
              <span className="du_stepper_optional">Optional</span>
            )}
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
            aria-current={isCurrent ? "step" : undefined}
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
