import { useState, useEffect } from "react";
import { UserCircle, Shield, CreditCard, Loader2, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", credits: 0, avatar_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/profile/me", {
          headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || "",
            email: data.email || "",
            credits: data.credits || 0,
            avatar_url: data.avatar_url || ""
          });
          if (data.email) localStorage.setItem("user_email", data.email);
          if (data.name) localStorage.setItem("user_name", data.name);
          if (data.avatar_url) localStorage.setItem("user_avatar", data.avatar_url);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          name: profile.name,
          email: profile.email 
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("Profile updated successfully!");
        if (data.name) {
          localStorage.setItem("user_name", data.name);
        }
        if (data.email) {
          localStorage.setItem("user_email", data.email);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessage(errData.detail || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/profile/avatar", {
        method: "POST",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({ ...prev, avatar_url: data.avatar_url }));
        
        if (data.avatar_url) {
          localStorage.setItem("user_avatar", data.avatar_url);
        }
        
        alert("Avatar uploaded successfully!");
      } else {
        alert("Failed to upload avatar.");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Error uploading avatar image.");
    }
  };
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[80vh] animate-fade-in-up">
      <h1 className="text-3xl font-bold text-foreground mb-8">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="glass-panel p-4 h-fit md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors cursor-pointer ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
          >
            <UserCircle className="h-5 w-5" /> Profile
          </button>
          <Link to="/billing" className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:bg-muted/50 rounded-xl font-medium transition-colors">
            <CreditCard className="h-5 w-5" /> Billing
          </Link>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors cursor-pointer ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
          >
            <Shield className="h-5 w-5" /> Security
          </button>
        </div>

        {/* Main Content Area based on Active Tab */}
        <div className="glass-panel p-6 md:col-span-3">
          {activeTab === "profile" ? (
            <>
              {/* Avatar Upload Section */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="relative h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden group">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle className="h-12 w-12 text-primary" />
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Profile Picture</h3>
                  <p className="text-xs text-muted-foreground mb-1">Click the avatar to upload a new image</p>
                  <p className="text-sm text-muted-foreground">Available Credits: <span className="font-bold text-primary">{profile.credits}</span></p>
                </div>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                 {message && <p className="text-sm font-medium text-green-500">{message}</p>}
                 <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <input 
                      type="text" 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Enter your name" 
                      className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" 
                    />
                 </div>
                 <div>
                    <label className="text-sm font-medium">Email Address (Editable)</label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="Enter your email" 
                      className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground" 
                    />
                 </div>
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity cursor-pointer"
                 >
                   {saving ? "Saving..." : "Save Changes"}
                 </button>
              </form>
            </>
          ) : (
            /* Security Tab Content */
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Security Settings</h3>
              <p className="text-sm text-muted-foreground mb-6">Manage your password and account security preferences.</p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full mt-1 p-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <button 
                  onClick={() => alert("Password update feature coming soon!")}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-medium cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;