import { Link, useLocation } from "react-router-dom";
import { Activity, LayoutGrid, ClipboardList, BookOpen, Clock } from "lucide-react";
import AliveLogo from "./AliveLogo";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="bg-slate-900 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <AliveLogo className="w-6 h-6" color="white" />
          </div>
          <span className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans'] tracking-tight flex items-baseline gap-0.5">
            ALIVE<span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse ml-0.5"></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" icon={<LayoutGrid size={18} />} label="Home" active={isActive("/")} />
          <NavLink to="/predict" icon={<Activity size={18} />} label="Predict" active={isActive("/predict")} />
          <NavLink to="/history" icon={<Clock size={18} />} label="History" active={isActive("/history")} />
          <NavLink to="/insights" icon={<BookOpen size={18} />} label="Insights" active={isActive("/insights")} />
          <NavLink to="/about" icon={<ClipboardList size={18} />} label="About" active={isActive("/about")} />
        </div>

        {/* Mobile Menu Button (Placeholder) */}
        <div className="md:hidden">
          {/* Mobile menu implementation can be added here */}
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <LayoutGrid size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
        ${active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}