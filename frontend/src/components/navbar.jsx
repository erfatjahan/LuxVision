import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, LayoutDashboard, Wand2 } from "lucide-react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("user_email"); 
    if (onLogout) {
      onLogout(); 
    }
    navigate("/login"); 
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* Glassmorphism Navbar */}
      <div className="glass max-w-7xl mx-auto px-6 py-3 rounded-2xl flex items-center justify-between">
        
        {/* Logo*/}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          LuxVision
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            
            {/* Main Menu Links */}
            <div className="hidden sm:flex items-center gap-5">
              <Link 
                to="/dashboard"
                className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link 
                to="/studio" 
                className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${location.pathname === '/studio' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Wand2 className="h-4 w-4" /> Studio
              </Link>
            </div>

            {/* Profile & Logout Section */}
           {/* Profile & Logout Section */}
<div className="flex items-center gap-4 pl-4 border-l border-border">
  <Link to="/profile" className="flex items-center gap-2 cursor-pointer group">

    {localStorage.getItem("user_avatar") ? (
      <img
        src={localStorage.getItem("user_avatar")}
        alt="Profile"
        className="h-8 w-8 rounded-full object-cover border border-primary group-hover:scale-105 transition-transform"
      />
    ) : (
      <UserCircle className="h-8 w-8 text-primary group-hover:scale-105 transition-transform" />
    )}

    <div className="hidden md:block text-left">
      <p className="text-sm font-bold text-foreground leading-none truncate max-w-[130px]">
        {localStorage.getItem("user_name") || (localStorage.getItem("user_email") ? localStorage.getItem("user_email").split('@')[0] : "Profile")}
      </p>
      <p className="text-xs text-muted-foreground">Pro Plan</p>
    </div>
  </Link>
         
              <button 
                onClick={handleLogoutClick}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer" 
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-medium px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Get Started
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;