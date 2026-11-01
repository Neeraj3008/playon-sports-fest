// Reusable Bootstrap form field that shows a red/green border and the error text
export default function Field({ label, name, error, touched, hint, as = "input", children, ...props }) {
  const state = touched ? (error ? " is-invalid" : " is-valid") : "";
  const Tag = as;
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-medium">{label}</label>
      {children ? (
        children(state)
      ) : (
        <Tag id={name} name={name} className={`form-${as === "select" ? "select" : "control"}${state}`} {...props} />
      )}
      {touched && error ? (
        <div className="invalid-feedback d-block">{error}</div>
      ) : (
        hint && <div className="form-text">{hint}</div>
      )}
    </div>
  );
}
