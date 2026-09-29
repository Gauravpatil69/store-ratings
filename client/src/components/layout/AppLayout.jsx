import Navbar from './Navbar';

export default function AppLayout({ children }) {
  return (
    <div className="bg-bg text-text min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
