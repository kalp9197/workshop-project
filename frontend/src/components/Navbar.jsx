import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-8">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight text-slate-900">
          ScaleMetrics
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" to="/dashboard">
                Dashboard
              </Link>
              <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" to="/products">
                Products
              </Link>
              <span className="hidden text-slate-600 md:block">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100" to="/login">
                Login
              </Link>
              <Link className="rounded-md bg-brand px-3 py-2 text-white hover:opacity-90" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
