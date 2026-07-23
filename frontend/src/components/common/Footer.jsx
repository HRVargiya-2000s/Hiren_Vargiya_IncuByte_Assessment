import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Send } from "lucide-react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Scroll to Top Circle Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Back to Top"
          className="absolute -top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg transition duration-300 hover:scale-105 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                NOVA <span className="font-light text-cyan-400">ONE</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Transforming the automotive purchase experience with zero-hassle transparent pricing, live digital showroom inventory, and professional premium delivery.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#browse" className="transition hover:text-cyan-400">Browse Inventory</a>
              </li>
              <li>
                <Link to="/catalog" className="transition hover:text-cyan-400">Digital Showroom</Link>
              </li>
              <li>
                <a href="#three-showcase-section" className="transition hover:text-cyan-400">Explore 3D Configurator</a>
              </li>
              <li>
                <a href="#why-choose-us" className="transition hover:text-cyan-400">Why Choose Us</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Newsletter</h3>
            <p className="text-sm text-slate-400">
              Subscribe to stay updated on latest stock arrivals and exclusive dealership offers.
            </p>
            {subscribed ? (
              <p className="text-sm font-medium text-cyan-400">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  required
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Your Email"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2.5 text-slate-950 font-bold hover:bg-cyan-400 transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright section */}
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} NOVA ONE Dealership. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
