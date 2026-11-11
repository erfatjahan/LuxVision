import { useState, useEffect } from "react";
import { Image as ImageIcon, Download, Trash2, Calendar, Sparkles, Search } from "lucide-react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/api/image/history", {
          headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          const data = await response.json();
       

const formattedImages = data.map((img) => ({
  id: img.id,
  name: img.name || "Enhanced_Image.png",
  date: img.date || "Recent", 
  after: img.enhanced_url,   
  status: "Enhanced",
}));
          setImages(formattedImages);
        } else {
          console.error("Failed to fetch gallery history");
        }
      } catch (error) {
        console.error("Error connecting to gallery API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      setImages(images.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[90vh] animate-fade-in-up">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" /> My Gallery & History
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse,download,or manage all your enhanced photos.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground animate-pulse">Loading your gallery...</p>
        </div>
      ) : filteredImages.length > 0 ? (
        /* Gallery Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="glass-panel overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-300"
            >
              {/* Image Preview Container */}
              <div className="relative h-60 w-full overflow-hidden bg-black/40">
                <img
                  src={img.after}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-full font-semibold shadow-md">
                  {img.status}
                </span>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-md">
                <div>
                  <h3 className="font-semibold text-foreground truncate max-w-[180px]">
                    {img.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" /> {img.date}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={img.after}
                    download={img.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                    title="Download HD"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel h-96 flex flex-col items-center justify-center text-center p-8">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4 opacity-40" />
          <h3 className="text-xl font-bold text-foreground">No images found</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {searchTerm ? "No results match your search term." : "You haven't enhanced any photos yet.Head over to the Studio to start enhancing!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;