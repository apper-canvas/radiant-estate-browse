import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import propertyService from "@/services/api/propertyService";
import ImageGallery from "@/components/molecules/ImageGallery";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import { useFavorites } from "@/hooks/useFavorites";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (id) {
      loadProperty();
      loadSimilarProperties();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (err) {
      setError(err.message || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const loadSimilarProperties = async () => {
    try {
      const similar = await propertyService.getSimilar(id);
      setSimilarProperties(similar);
    } catch (err) {
      console.error("Error loading similar properties:", err);
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

  const getStatusVariant = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'error';
      default: return 'default';
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Your inquiry has been sent! The agent will contact you shortly.");
      setShowContactForm(false);
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmittingContact(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadProperty} />;
  if (!property) return <ErrorView message="Property not found" />;

  const isPropertyFavorite = isFavorite(property.Id);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-primary hover:text-secondary transition-colors duration-200">
              Browse Properties
            </Link>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <span className="text-gray-600 truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={property.images} title={property.title} />

            {/* Property Header */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={getStatusVariant(property.status)}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                    <Badge variant="default">
                      {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                    </Badge>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center mb-4">
                    <ApperIcon name="MapPin" size={18} className="mr-2 flex-shrink-0" />
                    {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                  </p>
                  <div className="text-3xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {formatPrice(property.price, property.priceType)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleFavorite(property)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-all duration-200"
                  >
                    <ApperIcon 
                      name="Heart" 
                      size={18} 
                      className={isPropertyFavorite ? "text-red-500 fill-current" : ""} 
                    />
                    <span>{isPropertyFavorite ? "Saved" : "Save"}</span>
                  </button>
                  <Button onClick={() => setShowContactForm(true)}>
                    <ApperIcon name="MessageCircle" size={18} className="mr-2" />
                    Contact Agent
                  </Button>
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{property.squareFeet.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Square Feet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{property.yearBuilt}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities and Features */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center text-gray-700">
                        <ApperIcon name="Check" size={16} className="text-success mr-3 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Features</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {property.features.map((feature) => (
                      <div key={feature} className="flex items-center text-gray-700">
                        <ApperIcon name="Check" size={16} className="text-success mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info Card */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Listed By</h3>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={property.agentInfo.photo}
                  alt={property.agentInfo.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{property.agentInfo.name}</h4>
                  <p className="text-gray-600 text-sm">{property.agentInfo.agency}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Phone" size={16} className="mr-3" />
                  <span>{property.agentInfo.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="Mail" size={16} className="mr-3" />
                  <span>{property.agentInfo.email}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => setShowContactForm(true)}
                >
                  <ApperIcon name="MessageCircle" size={18} className="mr-2" />
                  Send Message
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`tel:${property.agentInfo.phone}`)}
                >
                  <ApperIcon name="Phone" size={18} className="mr-2" />
                  Call Now
                </Button>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium text-gray-900">
                    {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lot Size:</span>
                  <span className="font-medium text-gray-900">
                    {property.lotSize ? `${property.lotSize} acres` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built:</span>
                  <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed On:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(property.dateAdded).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-gray-500">
                  <ApperIcon name="MapPin" size={32} className="mx-auto mb-2" />
                  <p>Interactive map coming soon</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {property.address.street}<br />
                {property.address.city}, {property.address.state} {property.address.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Similar Properties</h2>
              <p className="text-gray-600">You might also be interested in these properties</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {similarProperties.map((similarProperty, index) => (
                <motion.div
                  key={similarProperty.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PropertyCard property={similarProperty} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowContactForm(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <form onSubmit={handleContactSubmit}>
                <div className="bg-white px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-display font-semibold text-gray-900">
                      Contact Agent
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ApperIcon name="X" size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder={`I'm interested in ${property.title}. Please contact me with more information.`}
                        className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowContactForm(false)}
                    disabled={submittingContact}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingContact}
                    className="flex items-center space-x-2"
                  >
                    {submittingContact ? (
                      <>
                        <ApperIcon name="Loader2" size={18} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Send" size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;