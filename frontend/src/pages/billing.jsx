import { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Lock, Sparkles } from "lucide-react";

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    city: "Dhaka"
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:8000/api/profile/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setFormData((prev) => ({
            ...prev,
            email: userData.email || ""
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (selectedPlan === 'free') {
      alert("You are already on the Free Tier!");
      return;
    }

    if (!formData.phone || !formData.email) {
      alert("Please give your email");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8000/api/payment/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          plan: selectedPlan, 
          amount: 1500,
          phone: formData.phone,
          email: formData.email,
          city: formData.city
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.gateway_url) {
          window.location.href = data.gateway_url;
        } else {
          alert("Payment gateway URL not received.");
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.detail || "Payment initialization failed.");
      }
    } catch (error) {
      console.error("Payment connection error:", error);
      alert("Could not connect to the payment server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[80vh]">
      <h1 className="text-3xl font-bold text-foreground mb-6">Billing & Subscription</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div 
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${selectedPlan === 'free' ? 'border-primary shadow-glow' : 'border-border'}`} 
          onClick={() => setSelectedPlan('free')}
        >
          <h3 className="text-xl font-bold">Free Tier</h3>
          <p className="text-sm mt-1">Basic low-light image enhancements.</p>
          <p className="text-2xl font-extrabold mt-4">৳0</p>
        </div>

        <div 
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${selectedPlan === 'pro' ? 'border-primary shadow-glow' : 'border-border'}`} 
          onClick={() => setSelectedPlan('pro')}
        >
          <h3 className="text-xl font-bold">Pro Plan</h3>
          <p className="text-sm mt-1">Unlimited AI enhancements & priority processing.</p>
          <p className="text-2xl font-extrabold mt-4">৳1,500 <span className="text-xs">/ month</span></p>
        </div>
      </div>

      {selectedPlan === 'pro' && (
        <form onSubmit={handleCheckout} className="p-6 border rounded-xl space-y-4 max-w-md mx-auto bg-card">
          <h2 className="text-lg font-bold">Billing Details (for Admin Records)</h2>
          
          {/* Email Field  */}
          <div>
            <label className="block text-sm mb-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="user@example.com" 
              value={formData.email} 
              onChange={handleChange}
              required
              className="w-full p-2.5 border rounded-lg bg-background text-foreground"
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              placeholder="017xxxxxxxx" 
              value={formData.phone} 
              onChange={handleChange}
              required
              className="w-full p-2.5 border rounded-lg bg-background text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 gradient-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-glow"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Redirecting..." : "Proceed to Secure Checkout (৳1,500)"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Billing;