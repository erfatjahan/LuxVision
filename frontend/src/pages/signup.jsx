import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        alert("Registration successful! Please sign in.");
        navigate("/login");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail || "Signup failed! Email might already exist.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px]"></div>

      {/* Main Glass Panel */}
      <div className="glass-panel w-full max-w-md relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join LuxAI and start creating</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 gradient-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 glow-on-hover hover:scale-[1.02] transition-all duration-300 mt-2"
          >
            <UserPlus className="h-5 w-5" />
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;