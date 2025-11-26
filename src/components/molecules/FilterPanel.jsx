import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const FilterPanel = ({ filters, onFiltersChange, onReset }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    type: true,
    bedsBaths: true,
    size: false,
    status: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const propertyTypes = [
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "apartment", label: "Apartment" }
  ];

  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "pending", label: "Pending" },
    { value: "sold", label: "Sold" }
  ];

  const bedroomOptions = [0, 1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4, 5];

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors duration-200"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ApperIcon 
          name="ChevronDown" 
          size={18} 
          className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-semibold text-gray-900">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="text-gray-500 hover:text-primary"
        >
          <ApperIcon name="RotateCcw" size={16} className="mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-0">
        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.priceMin || ""}
                  onChange={(e) => updateFilter('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.priceMax || ""}
                  onChange={(e) => updateFilter('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Property Type */}
        <FilterSection
          title="Property Type"
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <label key={type.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.propertyTypes?.includes(type.value) || false}
                  onChange={(e) => {
                    const currentTypes = filters.propertyTypes || [];
                    if (e.target.checked) {
                      updateFilter('propertyTypes', [...currentTypes, type.value]);
                    } else {
                      updateFilter('propertyTypes', currentTypes.filter(t => t !== type.value));
                    }
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-colors duration-200"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Bedrooms & Bathrooms */}
        <FilterSection
          title="Bedrooms & Bathrooms"
          isExpanded={expandedSections.bedsBaths}
          onToggle={() => toggleSection('bedsBaths')}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bedrooms (minimum)
              </label>
              <div className="flex flex-wrap gap-2">
                {bedroomOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => updateFilter('bedrooms', filters.bedrooms === count ? undefined : count)}
                    className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      filters.bedrooms === count
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {count}+
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bathrooms (minimum)
              </label>
              <div className="flex flex-wrap gap-2">
                {bathroomOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => updateFilter('bathrooms', filters.bathrooms === count ? undefined : count)}
                    className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      filters.bathrooms === count
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {count}+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Square Footage */}
        <FilterSection
          title="Square Footage"
          isExpanded={expandedSections.size}
          onToggle={() => toggleSection('size')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Square Feet
            </label>
            <Input
              type="number"
              placeholder="Any"
              value={filters.minSquareFeet || ""}
              onChange={(e) => updateFilter('minSquareFeet', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full"
            />
          </div>
        </FilterSection>

        {/* Status */}
        <FilterSection
          title="Listing Status"
          isExpanded={expandedSections.status}
          onToggle={() => toggleSection('status')}
        >
          <div className="space-y-3">
            {statusOptions.map((status) => (
              <label key={status.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status.value) || false}
                  onChange={(e) => {
                    const currentStatus = filters.status || [];
                    if (e.target.checked) {
                      updateFilter('status', [...currentStatus, status.value]);
                    } else {
                      updateFilter('status', currentStatus.filter(s => s !== status.value));
                    }
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition-colors duration-200"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default FilterPanel;