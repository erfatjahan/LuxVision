import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Image as ImageIcon, History, Download, Trash2, Wand2, Loader2 } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const Dashboard = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const useNavigateHook = useNavigate();
  const navigate = useNavigate();
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/image/history`, {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/image/history/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        setHistoryData(historyData.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete the item.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[90vh] animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back, User!</h1>
          <p className="text-muted-foreground mt-1">Here is an overview of your AI enhancements.</p>
        </div>
        <Link 
          to="/studio" 
          className="flex items-center gap-2 px-6 py-2.5 gradient-primary text-primary-foreground rounded-xl font-semibold shadow-glow hover:scale-105 transition-transform duration-300"
        >
          <Plus className="h-5 w-5" />
          New Enhancement
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6">
             <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-primary/10 rounded-full">
                  <ImageIcon className="h-6 w-6 text-primary" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-foreground">Total Enhanced</h3>
                 <p className="text-2xl font-extrabold text-primary">{historyData.length}</p>
               </div>
             </div>
             <p className="text-sm text-muted-foreground">Images processed using LuxAI Hybrid Engine.</p>
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center gap-2">
             <History className="h-5 w-5 text-primary" />
             <h2 className="text-xl font-bold text-foreground">Recent Enhancements</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : historyData.length > 0 ? (
              <div className="space-y-2">
                {historyData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
                         {item.enhanced_url ? (
                           <img src={item.enhanced_url} alt={item.name} className="h-full w-full object-cover" />
                         ) : (
                           <ImageIcon className="h-6 w-6 text-muted-foreground" />
                         )}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-xs">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.date} • <span className="text-green-500 font-medium">{item.status}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <a 
                         href={item.enhanced_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors" 
                         title="Download Image"
                       >
                         <Download className="h-4 w-4" />
                       </a>

                       <button 
                         onClick={() => navigate("/studio", { state: { imageUrl: item.original_url } })}
                         className="p-2 bg-accent/10 text-accent-foreground hover:bg-accent/20 rounded-lg transition-colors" 
                         title="Enhance Again"
                       >
                         <Wand2 className="h-4 w-4" />
                       </button>

                       <button 
                         onClick={() => handleDelete(item.id)}
                         className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" 
                         title="Delete History"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                 <ImageIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                 <h3 className="text-lg font-semibold text-foreground">No images yet</h3>
                 <p className="text-sm text-muted-foreground mt-2 max-w-sm mb-4">
                   You haven't enhanced any images yet.Head over to the studio to get started!
                 </p>
                 <Link 
                   to="/studio"
                   className="px-5 py-2 gradient-primary text-primary-foreground rounded-xl text-sm font-semibold"
                 >
                   Go to Studio
                 </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;