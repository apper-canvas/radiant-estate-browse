import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";

const PropertyGrid = ({ 
  properties, 
  loading, 
  error, 
  onRetry,
  emptyTitle,
  emptyMessage,
  emptyAction,
  onEmptyAction
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-card overflow-hidden animate-pulse">
            <div className="h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200"></div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex space-x-4">
                <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full">
        <ErrorView message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="col-span-full">
        <Empty
          title={emptyTitle}
          message={emptyMessage}
          actionLabel={emptyAction}
          onAction={onEmptyAction}
          icon="Home"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          <PropertyCard property={property} />
        </motion.div>
      ))}
    </div>
  );
};

export default PropertyGrid;