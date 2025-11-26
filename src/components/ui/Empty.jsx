import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No properties found", 
  message = "Try adjusting your filters or search criteria to find more properties.",
  actionLabel = "Browse All Properties",
  onAction,
  icon = "Home"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <ApperIcon name={icon} size={32} className="text-primary" />
        </div>
        
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Search" size={20} className="mr-2" />
          {actionLabel}
        </button>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="Filter" size={16} className="mr-1" />
          Clear filters
        </div>
        <div className="flex items-center">
          <ApperIcon name="MapPin" size={16} className="mr-1" />
          Try different location
        </div>
        <div className="flex items-center">
          <ApperIcon name="DollarSign" size={16} className="mr-1" />
          Adjust price range
        </div>
      </div>
    </div>
  );
};

export default Empty;