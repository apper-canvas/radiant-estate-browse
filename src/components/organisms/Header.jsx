import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { useFavorites } from "@/hooks/useFavorites";

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  const navigation = [
    { name: "Browse Properties", href: "/" },
    { name: "Map View", href: "/map" },
    { name: "Favorites", href: "/favorites" }
  ];

  const isActivePath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowMobileMenu(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                <ApperIcon name="Home" size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Estate Browse
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Premium Real Estate</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.href)
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {item.name}
                {item.href === "/favorites" && favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-yellow-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
                    {favoritesCount}
                  </span>
                )}
                {isActivePath(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/favorites" className="relative">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ApperIcon name="Heart" size={18} />
                <span>Favorites</span>
                {favoritesCount > 0 && (
                  <span className="w-5 h-5 bg-gradient-to-r from-accent to-yellow-500 text-white text-xs rounded-full flex items-center justify-center shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button size="sm" className="flex items-center space-x-2">
              <ApperIcon name="Phone" size={16} />
              <span>Contact</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name={showMobileMenu ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
        >
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActivePath(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{item.name}</span>
                {item.href === "/favorites" && favoritesCount > 0 && (
                  <span className="w-6 h-6 bg-gradient-to-r from-accent to-yellow-500 text-white text-sm rounded-full flex items-center justify-center shadow-sm">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <Button className="w-full flex items-center justify-center space-x-2">
                <ApperIcon name="Phone" size={18} />
                <span>Contact Agent</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;