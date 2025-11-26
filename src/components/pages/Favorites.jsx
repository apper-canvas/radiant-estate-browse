import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites();

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      clearFavorites();
    }
  };

  const handleEmptyAction = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-secondary to-primary/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ApperIcon name="Heart" size={32} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Your Favorite Properties
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {favorites.length === 0 
                ? "Start building your collection of dream homes"
                : `You've saved ${favorites.length} propert${favorites.length === 1 ? 'y' : 'ies'} to review later`
              }
            </p>
            
            {favorites.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-blue-100">
                  <ApperIcon name="BookmarkCheck" size={20} className="mr-2" />
                  <span>{favorites.length} Properties Saved</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <ApperIcon name="Clock" size={20} className="mr-2" />
                  <span>Easy to Compare</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">
                Saved Properties
              </h2>
              <p className="text-gray-600">
                Compare and review your favorite properties
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <ApperIcon name="Trash2" size={18} />
                <span>Clear All</span>
              </Button>
            </div>
          </div>
        )}

        {/* Favorites Grid */}
        <PropertyGrid
          properties={favorites}
          loading={false}
          error={null}
          emptyTitle="No favorites yet"
          emptyMessage="Browse our amazing properties and click the heart icon to save your favorites here. Start building your collection of dream homes!"
          emptyAction="Start Browsing"
          onEmptyAction={handleEmptyAction}
        />

        {/* Tips Section - Only show when there are favorites */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8"
          >
            <h3 className="text-xl font-display font-semibold text-gray-900 mb-6 text-center">
              Make the Most of Your Favorites
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="BarChart3" size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Compare Properties</h4>
                <p className="text-sm text-gray-600">
                  Review prices, sizes, and amenities side by side to find the perfect match
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="MessageCircle" size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Agents</h4>
                <p className="text-sm text-gray-600">
                  Reach out directly to listing agents for more information or to schedule viewings
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Share2" size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Share & Discuss</h4>
                <p className="text-sm text-gray-600">
                  Share your favorite properties with family and friends to get their input
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;