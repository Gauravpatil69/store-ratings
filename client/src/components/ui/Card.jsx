export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card p-6 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
