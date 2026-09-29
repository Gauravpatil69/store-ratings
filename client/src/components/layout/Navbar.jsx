import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-border bg-surface border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-text font-semibold">
          Store Ratings
        </Link>
        <div className="flex items-center gap-4">
          {user?.role === 'ADMIN' && (
            <>
              <Link to="/admin" className="text-muted hover:text-text">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-muted hover:text-text">
                Users
              </Link>
              <Link to="/admin/stores" className="text-muted hover:text-text">
                Stores
              </Link>
            </>
          )}
          {user?.role === 'USER' && (
            <Link to="/stores" className="text-muted hover:text-text">
              Stores
            </Link>
          )}
          {user?.role === 'OWNER' && (
            <Link to="/owner" className="text-muted hover:text-text">
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="text-muted hover:text-text cursor-pointer p-2"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
          </button>
          {user ? (
            <Button variant="ghost" onClick={logout}>
              Log out
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="primary">Log in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
