import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-6 shadow-xl">
            <span className="text-4xl font-display font-bold text-white">404</span>
          </div>
          
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. The property listing may have been moved, sold, or the URL might be incorrect.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto flex items-center justify-center space-x-2">
                <ApperIcon name="Home" size={18} />
                <span>Browse Properties</span>
              </Button>
            </Link>
            
            <Link to="/favorites">
              <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center space-x-2">
                <ApperIcon name="Heart" size={18} />
                <span>View Favorites</span>
              </Button>
            </Link>
          </div>

          <div className="flex justify-center">
            <Link to="/search" className="text-primary hover:text-secondary transition-colors duration-200 flex items-center space-x-1">
              <ApperIcon name="Search" size={16} />
              <span>Search Properties</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border border-blue-100"
        >
          <h2 className="text-lg font-display font-semibold text-gray-900 mb-3">
            Popular Searches
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Beverly Hills", "Santa Monica", "Malibu", "Luxury Homes", "Condos", "New Listings"].map((search) => (
              <Link
                key={search}
                to={`/search?q=${encodeURIComponent(search)}`}
                className="px-3 py-1.5 text-sm bg-white text-gray-700 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors duration-200"
              >
                {search}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@estatebrowse.com" className="text-primary hover:text-secondary">
              support@estatebrowse.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;