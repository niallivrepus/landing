import { useId, type FormEvent } from "react";

/**
 * **Purpose:** App-parity @handle composer — pill field with prefix chip and inline submit button.
 * **Connects to:** `ClaimIdentityLandingOverlay`, `landing-onboarding.css`.
 */
export function OnboardingHandleField({
  value,
  onChange,
  onSubmit,
  submitLabel = "Continue",
  disabled = false,
  placeholder = "handle",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  const inputId = useId();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="onboarding-bottom-bar" onSubmit={handleSubmit}>
      <div className="onboarding-bottom-bar__spacer" aria-hidden />
      <label className="onboarding-handle-field landing-control-surface" htmlFor={inputId}>
        <span className="onboarding-handle-prefix" aria-hidden>
          @
        </span>
        <input
          id={inputId}
          className="onboarding-handle-input"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="submit" className="onboarding-field-submit" disabled={disabled || !value.trim()}>
          {submitLabel}
        </button>
      </label>
      <div className="onboarding-bottom-bar__spacer" aria-hidden />
    </form>
  );
}
