import Card from './Card';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between pb-4">
          <h2>{title}</h2>
          <button onClick={onClose} className="text-muted cursor-pointer">
            &times;
          </button>
        </div>
        <div>{children}</div>
      </Card>
    </div>
  );
}
