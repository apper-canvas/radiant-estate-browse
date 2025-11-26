import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import propertyService from "@/services/api/propertyService";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import FilterPanel from "@/components/molecules/FilterPanel";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    priceMin: undefined,
    priceMax: undefined,
    propertyTypes: [],
    bedrooms: undefined,
    bathrooms: undefined,
    minSquareFeet: undefined,
    location: "",
    status: ["available"]
  });

  const [sortBy, setSortBy] = useState("newest");

  // Load initial data
  useEffect(() => {
    loadProperties();
  }, []);

  // Apply filters whenever filters or properties change
  useEffect(() => {
    applyFilters();
  }, [properties, filters, sortBy]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAll();
      setProperties(data);
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (!properties.length) return;
    
    try {
      const filtered = await propertyService.search(filters);
      
      // Apply sorting
      const sorted = [...filtered].sort((a, b) => {
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
      
      setFilteredProperties(sorted);
    } catch (err) {
      console.error("Error applying filters:", err);
      setFilteredProperties([]);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      priceMin: undefined,
      priceMax: undefined,
      propertyTypes: [],
      bedrooms: undefined,
      bathrooms: undefined,
      minSquareFeet: undefined,
      location: "",
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
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent block">
                Dream Home
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Discover premium properties in California's most desirable neighborhoods. 
              From luxury estates to cozy condos, find the perfect place to call home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-blue-100">
                <ApperIcon name="MapPin" size={20} className="mr-2" />
                <span>{properties.length} Properties Available</span>
              </div>
              <div className="flex items-center text-blue-100">
                <ApperIcon name="TrendingUp" size={20} className="mr-2" />
                <span>Updated Daily</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-semibold text-gray-900">
                {filteredProperties.length} Properties Found
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
                  Available Properties
                </h2>
                <p className="text-gray-600">
                  {loading ? "Loading..." : `${filteredProperties.length} properties found`}
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

            {/* Property Grid */}
            <PropertyGrid
              properties={filteredProperties}
              loading={loading}
              error={error}
              onRetry={loadProperties}
              emptyTitle="No properties match your criteria"
              emptyMessage="Try adjusting your filters to see more results, or browse all available properties."
              emptyAction="Reset Filters"
              onEmptyAction={handleEmptyAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;