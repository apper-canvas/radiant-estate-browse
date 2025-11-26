import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import propertyService from "@/services/api/propertyService";

const SearchBar = ({ onSearch, placeholder = "Search by location, city, or property name..." }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Get location suggestions as user types
  useEffect(() => {
    const getSuggestions = async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const results = await propertyService.getLocationSuggestions(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error getting suggestions:", error);
          setSuggestions([]);
        }
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(getSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle search submission
  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative flex-1 max-w-lg">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-12 h-12 text-base border-gray-300 focus:border-primary focus:ring-primary/20"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
            if (e.key === "Escape") {
              setShowSuggestions(false);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary hover:text-secondary transition-colors duration-200"
          disabled={!query.trim()}
        >
          {loading ? (
            <ApperIcon name="Loader2" size={20} className="animate-spin" />
          ) : (
            <ApperIcon name="ArrowRight" size={20} />
          )}
        </button>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              <ApperIcon name="MapPin" size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick search suggestions */}
{!query && !showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10">
          <div className="flex flex-wrap gap-2">
            {["Beverly Hills", "Santa Monica", "Malibu", "Pasadena"].map((location) => (
              <button
                key={location}
                onClick={() => handleSuggestionClick(location)}
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-colors duration-200"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;