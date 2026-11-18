import { useState, useEffect } from "react";
import { Users, Image as ImageIcon, DollarSign, Activity, ShieldAlert, ArrowUpRight, Trash2, Edit3, X } from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [creditAmount, setCreditAmount] = useState(10);
  const [newRole, setNewRole] = useState("user");

  const API_URL = import.meta.env.VITE_API_URL || "https://luxvision-backend.onrender.com";
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddCredits = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/add-credit/${userId}?amount=${creditAmount}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        setSelectedUser(null);
      } else {
        alert(data.detail || "Failed to add credits");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateRole = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${userId}/role`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        setSelectedUser(null);
      } else {
        alert(data.detail || "Failed to update role");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setUsers(users.filter(u => u.id !== userId));
        setSelectedUser(null);
      } else {
        alert(data.detail || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stats = [
    { title: "Total Users", value: users.length > 0 ? users.length : "1,245", change: "+12% this month", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Processed Images", value: "8,432", change: "+24% this week", icon: ImageIcon, color: "text-primary", bg: "bg-primary/10" },
    { title: "Total Revenue", value: "$3,420", change: "+18% this month", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "System Status", value: "99.9%", change: "All systems normal", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[90vh] animate-fade-in-up relative">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-primary" /> Admin Control Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor platform metrics, user activities, and manage platform permissions.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="glass-panel p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                <h3 className="text-2xl font-extrabold text-foreground mt-1">{item.value}</h3>
                <p className="text-xs text-green-500 font-medium mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> {item.change}
                </p>
              </div>
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users Table */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Platform Users ({users.length})</h3>
        
        {loading ? (
          <p className="text-muted-foreground text-sm py-4">Loading users from database...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">#{user.id}</td>
                    <td className="py-3.5 px-4 text-muted-foreground text-sm">{user.email}</td>
                    <td className="py-3.5 px-4 text-muted-foreground text-sm font-semibold">{user.credits}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => { setSelectedUser(user); setNewRole(user.role); }}
                        className="text-xs px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="glass max-w-md w-full p-6 rounded-2xl border border-border bg-background shadow-2xl relative animate-fade-in-up">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-foreground mb-1">Manage User</h3>
            <p className="text-xs text-muted-foreground mb-6">{selectedUser.email}</p>

            {/* Add Credits Section */}
            <div className="mb-6 space-y-2">
              <label className="text-sm font-semibold text-foreground">Add Credits</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={creditAmount} 
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm"
                />
                <button 
                  onClick={() => handleAddCredits(selectedUser.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Update Role Section */}
            <div className="mb-6 space-y-2">
              <label className="text-sm font-semibold text-foreground">Change Role</label>
              <div className="flex gap-2">
                <select 
                  value={newRole} 
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
                <button 
                  onClick={() => handleUpdateRole(selectedUser.id)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer whitespace-nowrap"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Delete User Section */}
            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="text-xs text-destructive font-medium">Danger Zone</span>
              <button 
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;