import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, LayoutDashboard, Wand2, ShieldAlert, Menu, X } from "lucide-react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("user_role"); 

  const handleLogoutClick = () => {
    localStorage.removeItem("user_email"); 
    localStorage.removeItem("token");
    localStorage.removeItem("user_avatar");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    if (onLogout) {
      onLogout(); 
    }
    navigate("/login"); 
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4">
      {/* Glassmorphism Navbar */}
      <div className="glass max-w-7xl mx-auto px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-primary">
          LuxVision
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-5">
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

              {userRole === "admin" && (
                <Link 
                  to="/admin" 
                  className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-amber-500 hover:text-amber-600'}`}
                >
                  <ShieldAlert className="h-4 w-4" /> Admin Panel
                </Link>
              )}
            </div>

            {/* Profile & Logout Section */}
            <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-border">
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
                  <p className="text-xs text-muted-foreground">
                    {userRole === "admin" ? "Administrator" : "Pro Plan"}
                  </p>
                </div>
              </Link>
         
              <button 
                onClick={handleLogoutClick}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer hidden sm:block" 
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-medium px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Get Started
            </Link>
          </div>
        )}

      </div>

      {isAuthenticated && isOpen && (
        <div className="md:hidden glass max-w-7xl mx-auto mt-2 px-4 py-4 rounded-2xl space-y-2 border border-border animate-fade-in-up shadow-xl bg-background/95 backdrop-blur-md">
          <Link 
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'}`}
          >
            <LayoutDashboard className="h-5 w-5 text-primary" /> Dashboard
          </Link>
          <Link 
            to="/studio" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/studio' ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted/50'}`}
          >
            <Wand2 className="h-5 w-5 text-primary" /> Studio
          </Link>

          {userRole === "admin" && (
            <Link 
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/admin' ? 'bg-amber-500/10 text-amber-500' : 'text-amber-500 hover:bg-muted/50'}`}
            >
              <ShieldAlert className="h-5 w-5 text-amber-500" /> Admin Panel
            </Link>
          )}
          
          <div className="pt-2 border-t border-border">
            <button 
              onClick={() => { setIsOpen(false); handleLogoutClick(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;