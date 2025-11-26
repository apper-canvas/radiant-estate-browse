import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const PropertyCard = ({ property }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isPropertyFavorite = isFavorite(property.Id);

  // Format price for display
  const formatPrice = (price, priceType) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return priceType === 'rent' ? `${formatted}/mo` : formatted;
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'error';
      default: return 'default';
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
    >
      <Link to={`/property/${property.Id}`} className="block">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={getStatusVariant(property.status)}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </Badge>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 transform hover:scale-110 shadow-sm"
          >
            <ApperIcon 
              name="Heart" 
              size={16} 
              className={isPropertyFavorite 
                ? "text-red-500 fill-current" 
                : "text-gray-600 hover:text-red-500"
              }
            />
          </button>

          {/* Image Count */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <ApperIcon name="Camera" size={12} />
            <span>{property.images.length}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title & Location */}
          <div className="mb-3">
            <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-1 mb-1 group-hover:text-primary transition-colors duration-200">
              {property.title}
            </h3>
            <p className="text-gray-600 text-sm flex items-center">
              <ApperIcon name="MapPin" size={14} className="mr-1 flex-shrink-0" />
              {property.address.city}, {property.address.state}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex space-x-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <ApperIcon name="Bed" size={14} className="mr-1" />
                  {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
                </div>
              )}
              <div className="flex items-center">
                <ApperIcon name="Bath" size={14} className="mr-1" />
                {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center">
                <ApperIcon name="Square" size={14} className="mr-1" />
                {property.squareFeet.toLocaleString()} sq ft
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatPrice(property.price, property.priceType)}
            </div>
            
            {/* Property Type */}
            <Badge variant="default">
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Badge>
          </div>

          {/* Featured Amenities */}
          {property.amenities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;