import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import propertyService from "@/services/api/propertyService";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPropertyList, setShowPropertyList] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAll();
      setProperties(data.filter(p => p.status === 'available'));
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, priceType) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return priceType === 'rent' ? `${formatted}/mo` : formatted;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadProperties} />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Map View</h1>
              <p className="text-gray-600">{properties.length} properties available</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={showPropertyList ? "primary" : "outline"}
                onClick={() => setShowPropertyList(!showPropertyList)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="List" size={18} />
                <span className="hidden sm:inline">Properties</span>
              </Button>
              
              <Link to="/">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ApperIcon name="Grid3x3" size={18} />
                  <span className="hidden sm:inline">Grid View</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Property List Sidebar */}
        <motion.div
          initial={false}
          animate={{ 
            width: showPropertyList ? 400 : 0,
            opacity: showPropertyList ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="bg-white border-r border-gray-200 overflow-hidden flex-shrink-0"
        >
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {properties.map((property) => (
              <motion.div
                key={property.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedProperty?.Id === property.Id
                    ? 'ring-2 ring-primary rounded-lg'
                    : ''
                }`}
                onClick={() => setSelectedProperty(property)}
              >
                <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover overflow-hidden">
                  <div className="relative h-32">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="success">Available</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-display font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
                      {property.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 flex items-center">
                      <ApperIcon name="MapPin" size={12} className="mr-1" />
                      {property.address.city}, {property.address.state}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <div className="flex space-x-3">
                        <span>{property.bedrooms} bed</span>
                        <span>{property.bathrooms} bath</span>
                      </div>
                    </div>
                    
                    <div className="text-lg font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {formatPrice(property.price, property.priceType)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {/* Map Placeholder */}
          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ApperIcon name="Map" size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Interactive Map Coming Soon
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We're building an amazing interactive map experience that will let you explore properties by location, 
                view neighborhood details, and get a better sense of each area.
              </p>
              
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50">
                  <h3 className="font-semibold text-gray-900 mb-2">Coming Features:</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="flex items-center">
                      <ApperIcon name="MapPin" size={16} className="mr-2 text-primary" />
                      <span>Property markers with details</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Layers" size={16} className="mr-2 text-primary" />
                      <span>Neighborhood insights</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Navigation" size={16} className="mr-2 text-primary" />
                      <span>Driving directions</span>
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="Search" size={16} className="mr-2 text-primary" />
                      <span>Location-based search</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/" className="flex-1">
                    <Button className="w-full">
                      <ApperIcon name="Grid3x3" size={18} className="mr-2" />
                      Browse Grid View
                    </Button>
                  </Link>
                  <Link to="/favorites" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <ApperIcon name="Heart" size={18} className="mr-2" />
                      View Favorites
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Property markers overlay (placeholder) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* This would contain actual map markers in a real implementation */}
            <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center text-white text-sm font-bold animate-pulse">
              3.7M
            </div>
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-accent rounded-full shadow-lg flex items-center justify-center text-white text-sm font-bold animate-pulse">
              2.8M
            </div>
            <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-secondary rounded-full shadow-lg flex items-center justify-center text-white text-sm font-bold animate-pulse">
              8.5K
            </div>
          </div>
        </div>
      </div>

      {/* Selected Property Modal */}
      {selectedProperty && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 z-10"
            >
              <ApperIcon name="X" size={16} className="text-gray-600" />
            </button>
            
            <PropertyCard property={selectedProperty} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MapView;