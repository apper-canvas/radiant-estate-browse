import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import propertyService from "@/services/api/propertyService";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import FilterPanel from "@/components/molecules/FilterPanel";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const searchQuery = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState({
    location: searchQuery,
    priceMin: undefined,
    priceMax: undefined,
    propertyTypes: [],
    bedrooms: undefined,
    bathrooms: undefined,
    minSquareFeet: undefined,
    status: ["available"]
  });

  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, filters, sortBy]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await propertyService.search({
        ...filters,
        location: searchQuery
      });
      
      // Apply sorting
      const sorted = [...results].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "size":
            return b.squareFeet - a.squareFeet;
          case "newest":
          default:
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        }
      });
      
      setProperties(sorted);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      location: searchQuery,
      priceMin: undefined,
      priceMax: undefined,
      propertyTypes: [],
      bedrooms: undefined,
      bathrooms: undefined,
      minSquareFeet: undefined,
      status: ["available"]
    });
  };

  const handleEmptyAction = () => {
    resetFilters();
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "size", label: "Largest First" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Search Results
            </h1>
            <p className="text-blue-100 mb-8">
              {searchQuery ? `Properties matching "${searchQuery}"` : "Browse all available properties"}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Refine your search..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link to="/" className="text-primary hover:text-secondary transition-colors duration-200">
            Browse Properties
          </Link>
          <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
          <span className="text-gray-600">
            Search Results {searchQuery && `for "${searchQuery}"`}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-gray-900">
                {loading ? "Searching..." : `${properties.length} Properties Found`}
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Filter" size={18} />
                <span>Filters</span>
              </Button>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6"
              >
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onReset={resetFilters}
                />
              </motion.div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">
                  {searchQuery ? `Results for "${searchQuery}"` : "All Properties"}
                </h2>
                <p className="text-gray-600">
                  {loading ? "Searching..." : `${properties.length} properties found`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.propertyTypes.length > 0 || filters.bedrooms || filters.bathrooms || filters.priceMin || filters.priceMax) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.propertyTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                    <button
                      onClick={() => {
                        const newTypes = filters.propertyTypes.filter(t => t !== type);
                        handleFiltersChange({ ...filters, propertyTypes: newTypes });
                      }}
                      className="ml-2 hover:text-primary/70"
                    >
                      <ApperIcon name="X" size={14} />
                    </button>
                  </span>
                ))}
                {(filters.bedrooms || filters.bathrooms) && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {filters.bedrooms && `${filters.bedrooms}+ bed`}
                    {filters.bedrooms && filters.bathrooms && ", "}
                    {filters.bathrooms && `${filters.bathrooms}+ bath`}
                    <button
                      onClick={() => handleFiltersChange({ ...filters, bedrooms: undefined, bathrooms: undefined })}
                      className="ml-2 hover:text-primary/70"
                    >
                      <ApperIcon name="X" size={14} />
                    </button>
                  </span>
                )}
                {(filters.priceMin || filters.priceMax) && (
                  <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {filters.priceMin && `$${filters.priceMin.toLocaleString()}+`}
                    {filters.priceMin && filters.priceMax && " - "}
                    {filters.priceMax && `$${filters.priceMax.toLocaleString()}`}
                    <button
                      onClick={() => handleFiltersChange({ ...filters, priceMin: undefined, priceMax: undefined })}
                      className="ml-2 hover:text-primary/70"
                    >
                      <ApperIcon name="X" size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Search Results Grid */}
            <PropertyGrid
              properties={properties}
              loading={loading}
              error={error}
              onRetry={performSearch}
              emptyTitle={searchQuery ? `No properties found for "${searchQuery}"` : "No properties found"}
              emptyMessage={searchQuery 
                ? "Try adjusting your search terms or filters to find more results." 
                : "Try using different search criteria or browse all available properties."
              }
              emptyAction="Clear Filters"
              onEmptyAction={handleEmptyAction}
            />

            {/* Search Tips */}
            {!loading && properties.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8"
              >
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-4 text-center">
                  Search Tips
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="MapPin" size={24} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Try Different Locations</h4>
                    <p className="text-sm text-gray-600">
                      Search for cities like "Beverly Hills", "Santa Monica", or "Malibu"
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                      <ApperIcon name="Filter" size={24} className="text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Adjust Your Filters</h4>
                    <p className="text-sm text-gray-600">
                      Expand price range, reduce bedroom requirements, or try different property types
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/">
                    <Button className="inline-flex items-center space-x-2">
                      <ApperIcon name="Home" size={18} />
                      <span>Browse All Properties</span>
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;