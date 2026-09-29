export default function Select({ children, error, className = '', ...props }) {
  return (
    <div className="w-full">
      <select className={`input ${className}`.trim()} {...props}>
        {children}
      </select>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
