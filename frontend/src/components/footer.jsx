import { Link } from "react-router-dom";
import { Mail } from "lucide-react"; 

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
              <span>LuxVision</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Next-generation AI image enhancement and restoration platform.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/studio" className="hover:text-primary transition-colors">AI Studio</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Updated</h4>
            <div className="flex items-center bg-background border border-border rounded-xl p-1">
              <Mail className="h-5 w-5 text-muted-foreground ml-2" />
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-transparent border-none outline-none px-3 py-1 text-sm text-foreground"
              />
              <button className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                Subscribe
              </button>
            </div>
          </div>

        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LuxVision Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;