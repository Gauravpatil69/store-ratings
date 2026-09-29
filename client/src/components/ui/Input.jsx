export default function Input({ error, className = '', ...props }) {
  return (
    <div className="w-full">
      <input className={`input ${className}`.trim()} {...props} />
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
