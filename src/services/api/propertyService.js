import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class PropertyService {
  constructor() {
    this.tableName = 'property_c';
  }

  // Get all properties
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "price_type_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "address_country_c"}},
          {"field": {"Name": "coordinates_lat_c"}},
          {"field": {"Name": "coordinates_lng_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "agent_info_id_c"}},
          {"field": {"Name": "agent_info_name_c"}},
          {"field": {"Name": "agent_info_email_c"}},
          {"field": {"Name": "agent_info_phone_c"}},
          {"field": {"Name": "agent_info_photo_c"}},
          {"field": {"Name": "agent_info_agency_c"}},
          {"field": {"Name": "date_added_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match existing UI expectations
      return response.data.map(this.transformProperty);
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get property by ID
  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "price_type_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "address_country_c"}},
          {"field": {"Name": "coordinates_lat_c"}},
          {"field": {"Name": "coordinates_lng_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "agent_info_id_c"}},
          {"field": {"Name": "agent_info_name_c"}},
          {"field": {"Name": "agent_info_email_c"}},
          {"field": {"Name": "agent_info_phone_c"}},
          {"field": {"Name": "agent_info_photo_c"}},
          {"field": {"Name": "agent_info_agency_c"}},
          {"field": {"Name": "date_added_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response?.data) {
        throw new Error(`Property with ID ${id} not found`);
      }

      return this.transformProperty(response.data);
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Search properties with filters
  async search(filters = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const where = [];
      
      // Filter by price range
      if (filters.priceMin !== undefined) {
        where.push({
          "FieldName": "price_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.priceMin]
        });
      }
      if (filters.priceMax !== undefined) {
        where.push({
          "FieldName": "price_c",
          "Operator": "LessThanOrEqualTo", 
          "Values": [filters.priceMax]
        });
      }

      // Filter by property types
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        where.push({
          "FieldName": "property_type_c",
          "Operator": "ExactMatch",
          "Values": filters.propertyTypes
        });
      }

      // Filter by bedrooms
      if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
        where.push({
          "FieldName": "bedrooms_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.bedrooms]
        });
      }

      // Filter by bathrooms
      if (filters.bathrooms !== undefined && filters.bathrooms > 0) {
        where.push({
          "FieldName": "bathrooms_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.bathrooms]
        });
      }

      // Filter by minimum square feet
      if (filters.minSquareFeet !== undefined) {
        where.push({
          "FieldName": "square_feet_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [filters.minSquareFeet]
        });
      }

      // Filter by location (search in city, state, or title)
      if (filters.location) {
        where.push({
          "FieldName": "address_city_c",
          "Operator": "Contains",
          "Values": [filters.location]
        });
      }

      // Filter by status
      if (filters.status && filters.status.length > 0) {
        where.push({
          "FieldName": "status_c",
          "Operator": "ExactMatch",
          "Values": filters.status
        });
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "price_type_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "lot_size_c"}},
          {"field": {"Name": "year_built_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "address_country_c"}},
          {"field": {"Name": "coordinates_lat_c"}},
          {"field": {"Name": "coordinates_lng_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "features_c"}},
          {"field": {"Name": "agent_info_id_c"}},
          {"field": {"Name": "agent_info_name_c"}},
          {"field": {"Name": "agent_info_email_c"}},
          {"field": {"Name": "agent_info_phone_c"}},
          {"field": {"Name": "agent_info_photo_c"}},
          {"field": {"Name": "agent_info_agency_c"}},
          {"field": {"Name": "date_added_c"}}
        ],
        where: where
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(this.transformProperty);
    } catch (error) {
      console.error("Error searching properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get featured properties (first 4 available properties)
  async getFeatured() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "price_type_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "date_added_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": ["available"]
        }],
        pagingInfo: {
          "limit": 4,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(this.transformProperty);
    } catch (error) {
      console.error("Error fetching featured properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get properties by status
  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "price_type_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "date_added_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(this.transformProperty);
    } catch (error) {
      console.error("Error fetching properties by status:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get similar properties (same type, similar price range)
  async getSimilar(propertyId, limit = 4) {
    try {
      const property = await this.getById(propertyId);
      if (!property) return [];

      const priceRange = property.price * 0.3; // 30% price range
      const minPrice = property.price - priceRange;
      const maxPrice = property.price + priceRange;

      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "price_type_c"}},
          {"field": {"Name": "property_type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "bedrooms_c"}},
          {"field": {"Name": "bathrooms_c"}},
          {"field": {"Name": "square_feet_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "date_added_c"}}
        ],
        where: [
          {
            "FieldName": "Id",
            "Operator": "NotEqualTo",
            "Values": [parseInt(propertyId)]
          },
          {
            "FieldName": "property_type_c",
            "Operator": "EqualTo",
            "Values": [property.propertyType]
          },
          {
            "FieldName": "status_c",
            "Operator": "EqualTo",
            "Values": ["available"]
          },
          {
            "FieldName": "price_c",
            "Operator": "GreaterThanOrEqualTo",
            "Values": [minPrice]
          },
          {
            "FieldName": "price_c",
            "Operator": "LessThanOrEqualTo",
            "Values": [maxPrice]
          }
        ],
        pagingInfo: {
          "limit": limit,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(this.transformProperty);
    } catch (error) {
      console.error("Error fetching similar properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get location suggestions for search
  async getLocationSuggestions(query) {
    try {
      if (!query || query.length < 2) return [];

      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}}
        ],
        where: [{
          "FieldName": "address_city_c",
          "Operator": "Contains",
          "Values": [query]
        }],
        pagingInfo: {
          "limit": 5,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return [];
      }

      const suggestions = new Set();
      response.data.forEach(property => {
        if (property.address_city_c) {
          suggestions.add(`${property.address_city_c}, ${property.address_state_c}`);
        }
      });

      return Array.from(suggestions).slice(0, 5);
    } catch (error) {
      console.error("Error fetching location suggestions:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Transform database property to UI format
  transformProperty(dbProperty) {
    return {
      Id: dbProperty.Id,
      title: dbProperty.title_c || dbProperty.Name,
      description: dbProperty.description_c || '',
      price: dbProperty.price_c || 0,
      priceType: dbProperty.price_type_c || 'sale',
      propertyType: dbProperty.property_type_c || 'house',
      status: dbProperty.status_c || 'available',
      bedrooms: dbProperty.bedrooms_c || 0,
      bathrooms: dbProperty.bathrooms_c || 0,
      squareFeet: dbProperty.square_feet_c || 0,
      lotSize: dbProperty.lot_size_c || 0,
      yearBuilt: dbProperty.year_built_c || new Date().getFullYear(),
      address: {
        street: dbProperty.address_street_c || '',
        city: dbProperty.address_city_c || '',
        state: dbProperty.address_state_c || '',
        zipCode: dbProperty.address_zip_code_c || '',
        country: dbProperty.address_country_c || 'USA'
      },
      coordinates: {
        lat: dbProperty.coordinates_lat_c || 34.0522,
        lng: dbProperty.coordinates_lng_c || -118.2437
      },
      images: this.parseJsonField(dbProperty.images_c) || [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
      ],
      amenities: this.parseJsonField(dbProperty.amenities_c) || [],
      features: this.parseJsonField(dbProperty.features_c) || [],
      agentInfo: {
        id: dbProperty.agent_info_id_c || "agent1",
        name: dbProperty.agent_info_name_c || "Real Estate Agent",
        email: dbProperty.agent_info_email_c || "agent@example.com",
        phone: dbProperty.agent_info_phone_c || "(555) 123-4567",
        photo: dbProperty.agent_info_photo_c || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
        agency: dbProperty.agent_info_agency_c || "Real Estate Agency"
      },
      dateAdded: dbProperty.date_added_c || new Date().toISOString().split('T')[0],
      isFavorite: false
    };
  }

  // Parse JSON field or return default
  parseJsonField(field) {
    if (!field) return null;
    try {
      return JSON.parse(field);
    } catch (e) {
      // If it's not JSON, treat as comma-separated string
      if (typeof field === 'string' && field.includes(',')) {
        return field.split(',').map(item => item.trim());
      }
      return field;
    }
  }
}

// Export singleton instance
export default new PropertyService();