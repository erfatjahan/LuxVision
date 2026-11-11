import { Users, Image as ImageIcon, DollarSign, Activity, ShieldAlert, ArrowUpRight } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "1,245", change: "+12% this month", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Processed Images", value: "8,432", change: "+24% this week", icon: ImageIcon, color: "text-primary", bg: "bg-primary/10" },
    { title: "Total Revenue", value: "$3,420", change: "+18% this month", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "System Status", value: "99.9%", change: "All systems normal", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const recentUsers = [
    { id: 1, name: "Most Erfat Jahan", email: "erfat@luxai.com", plan: "Pro", joined: "Nov 7, 2026" },
    { id: 2, name: "Diba Dey", email: "diba@example.com", plan: "Free", joined: "Nov 6, 2026" },
    { id: 3, name: "Tanvir Ahmed", email: "tanvir@example.com", plan: "Pro", joined: "Nov 5, 2026" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[90vh] animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-primary" /> Admin Control Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor platform metrics,user activities,and system performance.
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
        <h3 className="text-xl font-bold text-foreground mb-4">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{user.name}</td>
                  <td className="py-3.5 px-4 text-muted-foreground text-sm">{user.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${user.plan === 'Pro' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground text-sm">{user.joined}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs text-primary hover:underline font-medium">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;