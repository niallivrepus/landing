import { useId, type FormEvent } from "react";
import { tidyUsernameFieldInput } from "../../lib/jokuh-username";

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
      <div className="onboarding-bottom-composer">
      <label className="onboarding-handle-field" htmlFor={inputId}>
        <span className="onboarding-handle-prefix" aria-hidden>
          @
        </span>
        <input
          id={inputId}
          className="onboarding-handle-input"
          type="text"
          autoComplete="username webauthn"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const tidied = tidyUsernameFieldInput(event.target.value);
            if (tidied !== event.target.value) {
              event.target.value = tidied;
            }
            onChange(tidied);
          }}
        />
        <button type="submit" className="onboarding-field-submit" disabled={disabled || !value.trim()}>
          {submitLabel}
        </button>
      </label>
      </div>
      <div className="onboarding-bottom-bar__spacer" aria-hidden />
    </form>
  );
}
