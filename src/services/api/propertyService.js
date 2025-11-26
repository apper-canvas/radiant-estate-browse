import propertiesData from "@/services/mockData/properties.json";

class PropertyService {
  constructor() {
    this.properties = [...propertiesData];
  }

  // Add realistic delay for loading states
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all properties
  async getAll() {
    await this.delay();
    return [...this.properties];
  }

  // Get property by ID
  async getById(id) {
    await this.delay();
    const numericId = parseInt(id);
    const property = this.properties.find(p => p.Id === numericId);
    if (!property) {
      throw new Error(`Property with ID ${id} not found`);
    }
    return { ...property };
  }

  // Search properties with filters
  async search(filters = {}) {
    await this.delay(400);
    let results = [...this.properties];

    // Filter by price range
    if (filters.priceMin !== undefined) {
      results = results.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax !== undefined) {
      results = results.filter(p => p.price <= filters.priceMax);
    }

    // Filter by property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter(p => filters.propertyTypes.includes(p.propertyType));
    }

    // Filter by bedrooms
    if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
      results = results.filter(p => p.bedrooms >= filters.bedrooms);
    }

    // Filter by bathrooms
    if (filters.bathrooms !== undefined && filters.bathrooms > 0) {
      results = results.filter(p => p.bathrooms >= filters.bathrooms);
    }

    // Filter by minimum square feet
    if (filters.minSquareFeet !== undefined) {
      results = results.filter(p => p.squareFeet >= filters.minSquareFeet);
    }

    // Filter by location (search in city, state, or street)
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      results = results.filter(p => 
        p.address.city.toLowerCase().includes(searchTerm) ||
        p.address.state.toLowerCase().includes(searchTerm) ||
        p.address.street.toLowerCase().includes(searchTerm) ||
        p.title.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      results = results.filter(p => filters.status.includes(p.status));
    }

    return results;
  }

  // Get featured properties (first 4 available properties)
  async getFeatured() {
    await this.delay();
    return this.properties
      .filter(p => p.status === "available")
      .slice(0, 4)
      .map(p => ({ ...p }));
  }

  // Get properties by status
  async getByStatus(status) {
    await this.delay();
    return this.properties
      .filter(p => p.status === status)
      .map(p => ({ ...p }));
  }

  // Get similar properties (same type, similar price range)
  async getSimilar(propertyId, limit = 4) {
    await this.delay();
    const numericId = parseInt(propertyId);
    const property = this.properties.find(p => p.Id === numericId);
    
    if (!property) return [];

    const priceRange = property.price * 0.3; // 30% price range
    
    return this.properties
      .filter(p => 
        p.Id !== numericId &&
        p.propertyType === property.propertyType &&
        p.status === "available" &&
        Math.abs(p.price - property.price) <= priceRange
      )
      .slice(0, limit)
      .map(p => ({ ...p }));
  }

  // Get location suggestions for search
  async getLocationSuggestions(query) {
    await this.delay(100);
    if (!query || query.length < 2) return [];

    const searchTerm = query.toLowerCase();
    const suggestions = new Set();

    this.properties.forEach(property => {
      if (property.address.city.toLowerCase().includes(searchTerm)) {
        suggestions.add(`${property.address.city}, ${property.address.state}`);
      }
      if (property.address.state.toLowerCase().includes(searchTerm)) {
        suggestions.add(property.address.state);
      }
      if (property.address.zipCode.includes(searchTerm)) {
        suggestions.add(`${property.address.city}, ${property.address.state} ${property.address.zipCode}`);
      }
    });

    return Array.from(suggestions).slice(0, 5);
  }
}

export default new PropertyService();