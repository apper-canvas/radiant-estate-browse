import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <ApperIcon name="AlertTriangle" size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}. Don't worry, our team has been notified and we're working to fix this.
          </p>
        </div>

        <div className="space-y-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="RefreshCw" size={20} className="mr-2" />
              Try Again
            </button>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = "/"}
              className="inline-flex items-center px-4 py-2 text-primary hover:text-secondary font-medium transition-colors duration-200"
            >
              <ApperIcon name="Home" size={18} className="mr-2" />
              Go Home
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 text-primary hover:text-secondary font-medium transition-colors duration-200"
            >
              <ApperIcon name="RotateCcw" size={18} className="mr-2" />
              Refresh Page
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <ApperIcon name="Info" size={16} className="inline mr-1" />
            If the problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;