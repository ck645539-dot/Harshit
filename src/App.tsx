/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UtensilsCrossed, Phone, Instagram, Facebook, Clock, MapPin, ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, FormEvent } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

interface MenuItem {
  name: string;
  desc: string;
  price: string | number;
  image?: string;
  category?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Preparing' | 'Out for Delivery' | 'Delivered';
}

// --- Components ---

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemove 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cart: CartItem[]; 
  onUpdateQuantity: (name: string, delta: number) => void;
  onRemove: (name: string) => void;
}) => {
  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity), 0)
  , [cart]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" 
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-cream z-[70] shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-brand-dark/10 flex justify-between items-center bg-brand-dark text-brand-gold">
          <div className="flex items-center space-x-3">
            <ShoppingBag size={24} />
            <h2 className="font-serif text-2xl uppercase tracking-widest">Your Royal Order</h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
              <UtensilsCrossed size={80} strokeWidth={1} />
              <p className="font-serif text-xl uppercase tracking-widest">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="text-brand-gold font-bold border-b border-brand-gold pb-1 text-sm tracking-widest uppercase"
              >
                Go to Menu
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.name} className="flex gap-4 p-4 bg-white shadow-sm border border-brand-dark/5 group hover:border-brand-gold/30 transition-all">
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-lg uppercase leading-tight mb-1">{item.name}</h4>
                  <p className="text-brand-dark/50 text-xs italic mb-3">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-brand-cream rounded-sm border border-brand-dark/5">
                      <button 
                        onClick={() => onUpdateQuantity(item.name, -1)}
                        className="p-1.5 hover:text-brand-gold transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-bold text-sm min-w-[2rem] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.name, 1)}
                        className="p-1.5 hover:text-brand-gold transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-brand-gold tracking-wider">₹{Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(item.name)}
                  className="text-brand-dark/20 hover:text-brand-red transition-colors self-start p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t border-brand-dark/10 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-brand-dark/50 uppercase tracking-widest text-sm font-bold">Subtotal</span>
              <span className="text-3xl font-serif text-brand-dark">₹{subtotal}</span>
            </div>
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="w-full bg-brand-dark text-brand-gold flex items-center justify-center py-5 uppercase tracking-[0.3em] font-black hover:bg-brand-gold hover:text-brand-dark transition-all group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
};

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number, onOpenCart: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Menu", path: "/menu" },
    { name: "Orders", path: "/orders" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-brand-dark/95 backdrop-blur-md py-3 shadow-xl" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex flex-col">
          <span className="font-serif text-2xl lg:text-3xl text-brand-gold tracking-widest font-bold leading-none">THE NAWAABS</span>
          <span className="text-[10px] tracking-[0.4em] text-brand-gold/70 mt-1 uppercase">Heritage Since 2006</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm uppercase tracking-widest font-medium hover:text-brand-gold transition-colors",
                location.pathname === link.path ? "text-brand-gold" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <button 
            onClick={onOpenCart}
            className="relative text-white hover:text-brand-gold transition-colors"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-dark text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/contact" className="bg-brand-gold text-brand-dark px-6 py-2 rounded-sm text-sm uppercase tracking-widest font-bold hover:bg-white transition-all transform hover:scale-105">
            Book a Table
          </Link>
        </div>

        {/* Mobile Toggle & Cart */}
        <div className="flex items-center space-x-6 md:hidden">
          <button 
            onClick={onOpenCart}
            className="relative text-brand-gold"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-brand-dark text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-brand-gold">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-brand-dark p-8 flex flex-col space-y-6 md:hidden border-t border-white/10"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg uppercase tracking-widest font-medium text-white hover:text-brand-gold"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop" 
          alt="Restaurant Ambiance" 
          className="w-full h-full object-cover brightness-50"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-brand-gold font-serif italic text-2xl lg:text-3xl mb-4">Experience the Royal Feast</h2>
          <h1 className="text-white font-serif text-5xl md:text-8xl lg:text-9xl mb-8 tracking-tight leading-none uppercase">
            Relish The <br />
            <span className="italic text-brand-gold">Nawaabi</span> legacy
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light tracking-wide">
            Two decades of culinary excellence, bringing the authentic flavors of royal kitchens to your table.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/menu" className="w-full sm:w-auto bg-brand-gold text-brand-dark px-10 py-4 rounded-sm text-sm uppercase tracking-[0.2em] font-black hover:bg-white transition-all">
              Discover Menu
            </Link>
            <Link to="/contact" className="w-full sm:w-auto border border-white/30 text-white px-10 py-4 rounded-sm text-sm uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-brand-dark transition-all">
              Reserve Now
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-gold cursor-pointer"
      >
        <span className="uppercase tracking-[0.3em] text-[10px] mb-2 block text-center">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-gold to-transparent mx-auto"></div>
      </motion.div>
    </div>
  );
};

const SectionHeading = ({ subtitle, title, dark = false }: { subtitle: string, title: string, dark?: boolean }) => (
  <div className="text-center mb-16 px-4">
    <motion.span 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-brand-gold font-serif italic text-xl mb-2 block uppercase tracking-widest"
    >
      {subtitle}
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={cn("text-4xl md:text-6xl font-serif tracking-tight uppercase", dark ? "text-white" : "text-brand-dark")}
    >
      {title}
    </motion.h2>
    <div className={cn("w-20 h-[2px] mx-auto mt-6", dark ? "bg-brand-gold/50" : "bg-brand-gold")}></div>
  </div>
);

const AboutPreview = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="relative z-10"
        >
          <img 
            src="https://images.unsplash.com/photo-1544126592-807daa2b5650?q=80&w=2670&auto=format&fit=crop" 
            alt="Chef Preparing Food" 
            className="rounded-sm shadow-2xl grayscale-[30%] hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-gold -z-0 rounded-sm"></div>
        <div className="absolute -top-6 -right-6 border-2 border-brand-gold w-48 h-48 -z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-dark/5 font-serif text-[180px] select-none">20</div>
      </div>
      
      <div>
        <SectionHeading subtitle="Our Story" title="Two Decades of Taste" />
        <p className="text-brand-dark/70 text-lg leading-relaxed mb-8 font-light">
          Founded in 2006, The Nawaabs has been a sanctuary for food connoisseurs seeking the authentic essence of Indian royal cuisine. Our journey began with a simple vision: to preserve and celebrate the culinary traditions of the Nawabs of India.
        </p>
        <p className="text-brand-dark/70 text-lg leading-relaxed mb-10 font-light">
          Every dish at The Nawaabs is a masterpiece, crafted using age-old recipes and the finest hand-picked spices. For 20 years, we have served not just meals, but experiences that linger on the palate and in the heart.
        </p>
        <Link to="/about" className="inline-flex items-center space-x-4 group text-brand-gold font-bold uppercase tracking-widest text-sm">
          <span>Read More About Us</span>
          <div className="w-12 h-[1px] bg-brand-gold group-hover:w-20 transition-all"></div>
        </Link>
      </div>
    </div>
  </section>
);

const MenuHighlights = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => {
  const specials: MenuItem[] = [
    { name: "Galouti Kebab", desc: "Melt-in-mouth minced lamb kebabs with secret spices.", price: "₹650", image: "https://images.unsplash.com/photo-1601050633423-e666bc072382?q=80&w=2574&auto=format&fit=crop", category: "Starters" },
    { name: "Dum Pukht Biryani", desc: "Fragrant basmati rice and tender goat slow-cooked in a sealed pot.", price: "₹850", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2574&auto=format&fit=crop", category: "Biryani" },
    { name: "Shahi Tukda", desc: "Royal bread pudding with saffron, nuts and silver leaf.", price: "₹450", image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=2670&auto=format&fit=crop", category: "Desserts" },
  ];

  return (
    <section className="py-24 bg-brand-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading subtitle="Signature Selections" title="The Nawaabi Specials" dark />
        
        <div className="grid md:grid-cols-3 gap-8">
          {specials.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden mb-6 aspect-[4/5]">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute top-4 right-4 bg-brand-gold text-brand-dark px-4 py-2 font-bold rounded-sm">
                  {item.price}
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); onAddToCart(item); }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 bg-brand-gold text-brand-dark py-3 font-bold uppercase tracking-widest text-xs opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0"
                >
                  Quick Add
                </button>
              </div>
              <h3 className="text-2xl font-serif text-brand-gold mb-2 uppercase">{item.name}</h3>
              <p className="text-white/60 font-light mb-4">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-20">
          <Link to="/menu" className="border-2 border-brand-gold text-brand-gold px-12 py-4 rounded-sm text-sm uppercase tracking-widest font-black hover:bg-brand-gold hover:text-brand-dark transition-all">
            Full Royal Menu
          </Link>
        </div>
      </div>
    </section>
  );
};

const Experience = () => (
  <section className="py-24 bg-brand-cream relative">
    <div className="absolute top-0 left-0 w-full h-full bg-pattern pointer-events-none"></div>
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="text-center p-8 bg-white shadow-xl hover:-translate-y-2 transition-transform">
          <UtensilsCrossed className="mx-auto text-brand-gold mb-6" size={48} />
          <h4 className="font-serif text-2xl mb-4 uppercase">Authentic Recipes</h4>
          <p className="text-brand-dark/60 font-light text-sm">Directly inherited from the royal kitchens of North India.</p>
        </div>
        <div className="text-center p-8 bg-white shadow-xl hover:-translate-y-2 transition-transform">
          <Clock className="mx-auto text-brand-gold mb-6" size={48} />
          <h4 className="font-serif text-2xl mb-4 uppercase">20 Years Legacy</h4>
          <p className="text-brand-dark/60 font-light text-sm">Serving excellence and authenticity since 2006.</p>
        </div>
        <div className="text-center p-8 bg-white shadow-xl hover:-translate-y-2 transition-transform">
          <Phone className="mx-auto text-brand-gold mb-6" size={48} />
          <h4 className="font-serif text-2xl mb-4 uppercase">Personal Service</h4>
          <p className="text-brand-dark/60 font-light text-sm">Our hospitality ensures every guest feels like a Nawaab.</p>
        </div>
        <div className="text-center p-8 bg-white shadow-xl hover:-translate-y-2 transition-transform">
          <MapPin className="mx-auto text-brand-gold mb-6" size={48} />
          <h4 className="font-serif text-2xl mb-4 uppercase">Prime Location</h4>
          <p className="text-brand-dark/60 font-light text-sm">Centrally located with a grand ambiance and ample parking.</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-brand-dark text-white pt-20 pb-10 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-20">
        <div className="md:col-span-2">
          <div className="flex flex-col mb-8">
            <span className="font-serif text-3xl text-brand-gold tracking-widest font-bold leading-none">THE NAWAABS</span>
            <span className="text-[10px] tracking-[0.4em] text-brand-gold/70 mt-1 uppercase">Heritage Since 2006</span>
          </div>
          <p className="text-white/50 max-w-md mb-8 leading-relaxed font-light">
            Bringing the authentic taste of Nawaabi heritage to the modern palate. Our commitment to quality and tradition has made us a cornerstone of Indian fine dining for two decades.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all"><Instagram size={18} /></a>
            <a href="#" className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all"><Facebook size={18} /></a>
          </div>
        </div>
        
        <div>
          <h5 className="font-serif text-xl mb-6 text-brand-gold uppercase">Opening Hours</h5>
          <ul className="space-y-4 text-white/40 font-light text-sm">
            <li className="flex justify-between"><span>Mon - Thu:</span> <span>12:00 PM - 11:00 PM</span></li>
            <li className="flex justify-between"><span>Fri - Sat:</span> <span>12:00 PM - 12:00 AM</span></li>
            <li className="flex justify-between"><span>Sunday:</span> <span>11:00 AM - 11:30 PM</span></li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-serif text-xl mb-6 text-brand-gold uppercase">Contact Us</h5>
          <ul className="space-y-4 text-white/40 font-light text-sm">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-brand-gold shrink-0 mt-1" />
              <span>12/A, Heritage Mile, Civil Lines, Agra, Uttar Pradesh</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-brand-gold" />
              <span>+91 98765 43210</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="pt-10 border-t border-white/10 text-center text-white/20 text-[10px] uppercase tracking-widest font-bold">
        &copy; 2026 The Nawaabs. All Rights Reserved. Crafted with Passion.
      </div>
    </div>
  </footer>
);

// --- Pages ---

const Testimonials = () => {
  const reviews = [
    { name: "Anand Sharma", text: "Truly royal experience. The Galouti Kebabs are exactly like what you find in the streets of Lucknow. Been visiting for 15 years.", rating: 5 },
    { name: "Priya Verma", text: "The ambiance is breath-taking. Perfect for family dinners and special occasions. The hospitality is unmatched in Agra.", rating: 5 },
    { name: "Rajiv Malhotra", text: "Best Dum Biryani I've had in a long time. The spices are authentic and the legacy of 20 years shows in every bite.", rating: 5 },
  ];

  return (
    <section className="py-24 bg-brand-dark overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading subtitle="Voices of Our Guests" title="Royal Testimonials" dark />
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 p-10 relative group hover:bg-white/10 transition-colors"
            >
              <div className="text-brand-gold mb-6 flex space-x-1">
                {[...Array(rev.rating)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-white/80 italic font-light leading-relaxed mb-8 text-lg">"{rev.text}"</p>
              <div>
                <p className="font-serif text-brand-gold text-xl">{rev.name}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Loyal Guest</p>
              </div>
              <div className="absolute top-10 right-10 text-white/5 font-serif text-8xl">"</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LegacyMarquee = () => (
  <div className="bg-brand-gold py-6 overflow-hidden border-y border-brand-dark/10">
    <div className="flex whitespace-nowrap animate-marquee">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center space-x-12 mx-12">
          <span className="font-serif text-2xl lg:text-3xl text-brand-dark uppercase tracking-[0.2em] font-bold">20 Years of Royal Legacy</span>
          <UtensilsCrossed className="text-brand-dark/30" />
          <span className="font-serif text-2xl lg:text-3xl text-brand-dark uppercase tracking-[0.2em] font-bold">Authentic Nawaabi Taste</span>
          <UtensilsCrossed className="text-brand-dark/30" />
        </div>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 40s linear infinite;
      }
    `}</style>
  </div>
);

const HomePage = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => (
  <main>
    <Hero />
    <LegacyMarquee />
    <AboutPreview />
    <MenuHighlights onAddToCart={onAddToCart} />
    <Experience />
    <Testimonials />
    <section className="py-24 bg-white">
      <SectionHeading subtitle="Captured Moments" title="Our Gallery" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 px-1">
        {[
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000",
          "https://images.unsplash.com/photo-1544126592-807daa2b5650?q=80&w=1000",
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000",
          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000",
          "https://images.unsplash.com/photo-1601050633423-e666bc072382?q=80&w=1000",
          "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1000",
          "https://images.unsplash.com/photo-1582169542939-95240292723c?q=80&w=1000",
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000"
        ].map((img, i) => (
          <div key={i} className="aspect-square relative group overflow-hidden">
             <img src={img} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
             <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all"></div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

const FullMenuPage = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => {
  const menu = [
    {
      category: "Shahi Ibtida (Royal Starters)",
      items: [
        { name: "Galouti Kebab", desc: "Melt-in-mouth minced lamb kebabs with exotic spices", price: "650" },
        { name: "Paneer Angara Tikka", desc: "Clay oven roasted cottage cheese with spicy marinade", price: "525" },
        { name: "Kakori Kebab", desc: "Famous melt-in-mouth long lean kebabs", price: "675" },
        { name: "Dahi Ke Sholay", desc: "Crispy bread rolls stuffed with spiced hung curd", price: "450" }
      ]
    },
    {
      category: "Nawaabi Dastarkhwan (Main Course)",
      items: [
        { name: "Mutton Rogan Josh", desc: "Traditional Kashmiri goat curry slow-cooked with ratanjot", price: "850" },
        { name: "Butter Chicken 2.0", desc: "Our secret 20-year-old recipe of creamy tomato chicken", price: "725" },
        { name: "Dal Maharani", desc: "Black lentils slow cooked overnight with white butter", price: "475" },
        { name: "Aloo Gobhi Adraki", desc: "Classic potato cauliflower with ginger juliennes", price: "395" }
      ]
    },
    {
      category: "Sultani Biryani",
      items: [
        { name: "Lucknowi Dum Biryani (Chicken)", desc: "Aromatic Awadhi style long grain basmati rice", price: "695" },
        { name: "Nawaabi Goat Biryani", desc: "Tender goat pieces with flavored saffron rice", price: "825" },
        { name: "Veg Subz Biryani", desc: "Assorted vegetables cooked with aromatic spices", price: "550" }
      ]
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <SectionHeading subtitle="Discover Flavors" title="The Royal Menu" />
      <div className="max-w-4xl mx-auto px-6">
        {menu.map((cat, idx) => (
          <div key={idx} className="mb-16">
            <h3 className="font-serif text-3xl text-brand-gold border-b-2 border-brand-gold/20 pb-4 mb-8 text-center uppercase">{cat.category}</h3>
            <div className="space-y-4">
              {cat.items.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white hover:shadow-lg transition-all rounded-sm border border-brand-dark/5 group">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold font-serif mb-1 uppercase text-brand-dark group-hover:text-brand-gold transition-colors">{item.name}</h4>
                    <p className="text-brand-dark/50 font-light text-sm italic">{item.desc}</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="font-bold text-lg">₹{item.price}</span>
                    <button 
                      onClick={() => onAddToCart({ ...item, category: cat.category })}
                      className="bg-brand-dark text-brand-gold p-3 rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all transform hover:scale-110 shadow-md"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2 People",
    date: "",
    time: "",
    requests: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 bg-brand-cream min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white p-12 shadow-2xl rounded-sm border-t-8 border-brand-gold text-center"
        >
          <div className="w-20 h-20 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock size={40} />
          </div>
          <h2 className="font-serif text-4xl mb-6 uppercase tracking-tight">Booking Requested</h2>
          <div className="text-brand-dark/60 font-light mb-10 text-lg leading-relaxed">
            Thank you, <span className="text-brand-dark font-bold">{formData.name}</span>. <br />
            We have received your request for <span className="text-brand-dark font-bold">{formData.guests}</span> on <span className="text-brand-dark font-bold">{formData.date}</span> at <span className="text-brand-dark font-bold">{formData.time}</span>.
          </div>
          <div className="bg-brand-cream p-6 rounded-sm mb-10 text-left space-y-2">
            <p className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Our team will call you shortly at</p>
            <p className="font-bold text-xl">{formData.phone}</p>
            <p className="text-xs text-brand-dark/40 italic">to confirm your table and any special arrangements.</p>
          </div>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-brand-gold font-bold uppercase tracking-[0.2em] text-sm border-b border-brand-gold pb-1 hover:text-brand-dark hover:border-brand-dark transition-all"
          >
            Make Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <SectionHeading subtitle="Reserve a Table" title="Visit The Nawaabs" />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div className="bg-white p-10 shadow-2xl rounded-sm">
          <h3 className="font-serif text-3xl mb-8 uppercase tracking-widest">Make a Reservation</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Your Name" 
                  className="w-full bg-brand-cream px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="you@email.com" 
                  className="w-full bg-brand-cream px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+91 00000 00000" 
                  className="w-full bg-brand-cream px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Number of Guests</label>
                <select 
                  className="w-full bg-brand-cream px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                >
                  <option>2 People</option>
                  <option>4 People</option>
                  <option>6 People</option>
                  <option>8+ People</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Preferred Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-brand-cream px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Preferred Time</label>
                <input 
                  type="time" 
                  required
                  className="w-full bg-brand-cream px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Special Requests</label>
              <textarea 
                rows={4} 
                placeholder="Any dietary restrictions or special occasions?" 
                className="w-full bg-brand-cream px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                value={formData.requests}
                onChange={(e) => setFormData({...formData, requests: e.target.value})}
              ></textarea>
            </div>
            <button className="w-full bg-brand-gold text-brand-dark py-5 uppercase tracking-[0.2em] font-black hover:bg-brand-dark hover:text-brand-gold transition-all shadow-lg transform hover:-translate-y-1">Submit Reservation Request</button>
          </form>
        </div>
      
      <div className="space-y-12">
        <div>
          <h3 className="font-serif text-3xl mb-6 uppercase">Our Location</h3>
          <p className="text-brand-dark/60 font-light mb-8 leading-relaxed">
            Nestled in the heart of Civil Lines, Agra, our grand establishment welcomes you to a world of royal ambiance and culinary excellence.
          </p>
          <div className="aspect-video bg-white shadow-xl flex items-center justify-center border-2 border-brand-gold/10">
             <div className="text-center p-8">
               <MapPin size={48} className="mx-auto text-brand-gold mb-4" />
               <p className="font-bold">12/A, Heritage Mile, Civil Lines</p>
               <p className="text-sm">Agra, Uttar Pradesh 282002</p>
               <a href="https://maps.google.com" target="_blank" className="text-brand-gold text-xs uppercase tracking-widest mt-4 inline-block font-bold outline-hidden">Open in Google Maps</a>
             </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-serif text-3xl mb-6 uppercase">Connect Directly</h3>
          <div className="flex flex-col space-y-4">
             <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-white flex items-center justify-center shadow-md rounded-full text-brand-gold"><Phone size={20} /></div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 font-black">Phone</p>
                 <p className="font-bold">+91 98765 43210</p>
               </div>
             </div>
             <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-white flex items-center justify-center shadow-md rounded-full text-brand-gold"><Instagram size={20} /></div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-brand-dark/40 font-black">Social</p>
                 <p className="font-bold">@thenawaabs_agra</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

const OrderHistoryPage = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeading subtitle="Royal Service" title="Your Order History" />
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white shadow-xl rounded-sm">
            <ShoppingBag size={64} className="mx-auto text-brand-gold/20 mb-6" />
            <p className="text-brand-dark/40 font-serif text-xl uppercase tracking-widest mb-8">No past orders found</p>
            <Link to="/menu" className="bg-brand-gold text-brand-dark px-10 py-4 uppercase tracking-widest font-black hover:bg-brand-dark hover:text-brand-gold transition-all">Start Your First Order</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.slice().reverse().map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 shadow-lg rounded-sm border-l-4 border-brand-gold"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-brand-dark/5 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40 mb-1">Order ID: {order.id}</p>
                    <p className="font-serif text-lg text-brand-dark uppercase tracking-widest">{order.date}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <span className="px-4 py-1 bg-brand-gold/10 text-brand-gold text-[10px] uppercase tracking-widest font-black rounded-full border border-brand-gold/20">
                      {order.status}
                    </span>
                    <span className="text-2xl font-serif font-bold text-brand-dark">₹{order.total}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-brand-dark/60 font-light">
                        <span className="text-brand-dark font-bold">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="text-brand-dark/40 italic text-xs">{item.category}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Link to="/menu" className="text-[10px] uppercase tracking-widest font-black text-brand-gold border-b border-brand-gold pb-1 hover:text-brand-dark hover:border-brand-dark transition-all">Order Again</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CheckoutPage = ({ cart, onOrdered }: { cart: CartItem[], onOrdered: (items: CartItem[], total: number, email: string) => void }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity), 0)
  , [cart]);

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="pt-48 pb-32 text-center">
        <SectionHeading subtitle="Your Cart" title="Is Empty" />
        <Link to="/menu" className="text-brand-gold font-bold uppercase tracking-widest border-b border-brand-gold pb-1">Back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-4 mb-12 text-sm uppercase tracking-widest font-bold overflow-x-auto whitespace-nowrap pb-4">
          <span className={cn(step >= 1 ? "text-brand-gold" : "text-brand-dark/30")}>01 Order Summary</span>
          <ChevronRight size={16} className="text-brand-dark/10" />
          <span className={cn(step >= 2 ? "text-brand-gold" : "text-brand-dark/30")}>02 Delivery & Payment</span>
          <ChevronRight size={16} className="text-brand-dark/10" />
          <span className={cn(step >= 3 ? "text-brand-gold" : "text-brand-dark/30")}>03 Confirmation</span>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.name} className="bg-white p-6 rounded-sm shadow-sm flex items-center justify-between border border-brand-dark/5">
                  <div>
                    <h4 className="font-serif text-xl uppercase font-bold">{item.name}</h4>
                    <p className="text-brand-dark/50 text-sm italic">{item.category} • Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-xl text-brand-gold tracking-widest">₹{Number(String(item.price).replace(/[^0-9]/g, '')) * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="bg-brand-dark text-white p-8 rounded-sm h-fit sticky top-32 shadow-2xl">
              <h3 className="font-serif text-2xl text-brand-gold mb-8 uppercase tracking-widest">Pricing Details</h3>
              <div className="space-y-4 mb-8 font-light text-sm">
                <div className="flex justify-between"><span>Subtotal</span> <span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>GST (5%)</span> <span>₹{(subtotal * 0.05).toFixed(0)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span> <span>₹45</span></div>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <div className="flex justify-between text-brand-gold font-bold text-lg uppercase tracking-widest">
                  <span>Grand Total</span>
                  <span>₹{(subtotal * 1.05 + 45).toFixed(0)}</span>
                </div>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-brand-gold text-brand-dark py-4 uppercase tracking-widest font-black hover:bg-white transition-all transform hover:scale-105"
              >
                Continue to Payment
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto bg-white p-10 shadow-2xl rounded-sm">
            <h3 className="font-serif text-3xl mb-10 uppercase tracking-widest text-brand-dark">Delivery Details</h3>
            <div className="grid md:grid-cols-2 gap-8 mb-12 text-brand-dark">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Full Name</label>
                <input type="text" required className="w-full border-b border-brand-dark/20 p-2 focus:border-brand-gold outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full border-b border-brand-dark/20 p-2 focus:border-brand-gold outline-none transition-colors" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Phone Number</label>
                <input type="tel" required className="w-full border-b border-brand-dark/20 p-2 focus:border-brand-gold outline-none transition-colors" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2 md:col-span-1">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-dark/40">Address</label>
                <textarea required className="w-full border-b border-brand-dark/20 p-2 focus:border-brand-gold outline-none transition-colors h-12" placeholder="Your delivery address in Agra..."></textarea>
              </div>
            </div>

            <h3 className="font-serif text-3xl mb-10 uppercase tracking-widest text-brand-dark">Payment Method</h3>
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="border border-brand-gold bg-brand-gold/5 p-6 flex flex-col items-center justify-center space-y-4 cursor-pointer rounded-sm">
                <CreditCard className="text-brand-gold" size={32} />
                <span className="uppercase text-[10px] font-black tracking-[0.2em]">UPI / Card</span>
              </div>
              <div className="border border-brand-dark/10 p-6 flex flex-col items-center justify-center space-y-4 cursor-pointer rounded-sm opacity-50 grayscale">
                <div className="text-2xl font-serif">₹</div>
                <span className="uppercase text-[10px] font-black tracking-[0.2em]">Cash on Delivery</span>
              </div>
            </div>

            <button 
              onClick={() => { 
                if (!email) {
                  alert("Please provide an email for confirmation.");
                  return;
                }
                const total = Number((subtotal * 1.05 + 45).toFixed(0));
                onOrdered([...cart], total, email);
                setStep(3);
              }}
              className="w-full bg-brand-dark text-brand-gold py-5 uppercase tracking-[0.4em] font-black hover:bg-brand-gold hover:text-brand-dark transition-all transform hover:-translate-y-1 shadow-xl"
            >
              Confirm Order for ₹{(subtotal * 1.05 + 45).toFixed(0)}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="max-w-3xl mx-auto text-center bg-white p-20 shadow-2xl rounded-sm border-t-8 border-brand-gold"
          >
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10">
              <Plus className="rotate-45 scale-150" strokeWidth={3} />
            </div>
            <h2 className="font-serif text-5xl mb-6 uppercase tracking-tight">Order Confirmed!</h2>
            <p className="text-brand-dark/60 font-light mb-12 text-lg leading-relaxed">
              Your royal feast is being prepared by our master chefs. <br /> Our delivery partner will reach you within 45 minutes.
            </p>
            <Link to="/" className="inline-block border-2 border-brand-gold text-brand-gold px-12 py-4 uppercase tracking-[0.3em] font-black hover:bg-brand-gold hover:text-brand-dark transition-all">
              Return Home
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- App Layout ---

import { Routes, Route } from "react-router-dom";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nawaabs_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nawaabs_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (name: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.name === name) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (name: string) => {
    setCart(prev => prev.filter(item => item.name !== name));
  };

  const handleOrderComplete = async (items: CartItem[], total: number, email: string) => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items,
      total,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Preparing'
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]);

    // Trigger email confirmation (async, don't block UI)
    try {
      await fetch('/api/confirm-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: newOrder,
          customerEmail: email
        })
      });
    } catch (err) {
      console.error("Order confirmation email failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-gold selection:text-brand-dark">
      <Navbar cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
      <Routes>
        <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
        <Route path="/menu" element={<FullMenuPage onAddToCart={addToCart} />} />
        <Route path="/orders" element={<OrderHistoryPage orders={orders} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} onOrdered={handleOrderComplete} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<div className="pt-48 pb-32"><SectionHeading subtitle="Discover Our" title="Heritage & Journey" /><div className="max-w-3xl mx-auto px-6 text-center text-brand-dark/60 font-light leading-relaxed text-lg">Founded 20 years ago, The Nawaabs has been dedicated to preserving the rich culinary traditions of royal Indian kitchens. Every spice is hand-picked, every recipe is time-tested, and every guest is treated like royalty. Join us on a journey through history.</div></div>} />
        <Route path="/gallery" element={<div className="pt-48 pb-32"><SectionHeading subtitle="Visual Feast" title="Our Gallery" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 px-1">
            {[
              "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000",
              "https://images.unsplash.com/photo-1544126592-807daa2b5650?q=80&w=1000",
              "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000",
              "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000",
              "https://images.unsplash.com/photo-1601050633423-e666bc072382?q=80&w=1000",
              "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1000",
              "https://images.unsplash.com/photo-1582169542939-95240292723c?q=80&w=1000",
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000"
            ].map((img, i) => (
              <div key={i} className="aspect-square relative group overflow-hidden">
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>} />
      </Routes>
      <Footer />
    </div>
  );
}
