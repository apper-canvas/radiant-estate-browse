const Loading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar skeleton */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-card p-6 space-y-6">
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              
              {/* Price range skeleton */}
              <div className="space-y-4">
                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="flex space-x-4">
                  <div className="h-10 flex-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  <div className="h-10 flex-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Property type skeleton */}
              <div className="space-y-4">
                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-4 w-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bedrooms/Bathrooms skeleton */}
              <div className="space-y-4">
                <div className="h-4 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Property grid skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-card overflow-hidden">
                  {/* Image skeleton */}
                  <div className="h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                  
                  {/* Content skeleton */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      </div>
                      <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex space-x-4">
                        <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>

                    <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;