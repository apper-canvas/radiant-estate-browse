import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class FavoritePropertyService {
  constructor() {
    this.tableName = 'favorite_property_c';
  }

  // Get user's favorite properties
  async getFavorites() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "title_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "description_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "price_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "price_type_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "property_type_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "status_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "bedrooms_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "bathrooms_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "square_feet_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "images_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "address_city_c"}
          }},
          {"field": {"Name": "property_id_c"}, "referenceField": {
            "field": {"Name": "address_state_c"}
          }}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(this.transformFavorite);
    } catch (error) {
      console.error("Error fetching favorites:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Add property to favorites
  async addToFavorites(propertyId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: `Favorite Property ${propertyId}`,
          property_id_c: parseInt(propertyId)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to add favorite:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      toast.success("Property added to favorites");
      return true;
    } catch (error) {
      console.error("Error adding to favorites:", error?.response?.data?.message || error);
      toast.error("Failed to add to favorites");
      return false;
    }
  }

  // Remove property from favorites
  async removeFromFavorites(propertyId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // First find the favorite record
      const favorites = await this.getFavorites();
      const favorite = favorites.find(f => f.Id === parseInt(propertyId));
      
      if (!favorite) {
        toast.info("Property not in favorites");
        return false;
      }

      const params = {
        RecordIds: [favorite.favoriteId]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to remove favorite:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      toast.success("Property removed from favorites");
      return true;
    } catch (error) {
      console.error("Error removing from favorites:", error?.response?.data?.message || error);
      toast.error("Failed to remove from favorites");
      return false;
    }
  }

  // Check if property is in favorites
  async isFavorite(propertyId) {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(f => f.Id === parseInt(propertyId));
    } catch (error) {
      console.error("Error checking favorite status:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Transform favorite to property format
  transformFavorite(dbFavorite) {
    const property = dbFavorite.property_id_c;
    if (!property) return null;

    return {
      Id: property.Id,
      favoriteId: dbFavorite.Id, // Keep favorite record ID for deletion
      title: property.title_c || property.Name || '',
      description: property.description_c || '',
      price: property.price_c || 0,
      priceType: property.price_type_c || 'sale',
      propertyType: property.property_type_c || 'house',
      status: property.status_c || 'available',
      bedrooms: property.bedrooms_c || 0,
      bathrooms: property.bathrooms_c || 0,
      squareFeet: property.square_feet_c || 0,
      images: this.parseJsonField(property.images_c) || [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
      ],
      address: {
        city: property.address_city_c || '',
        state: property.address_state_c || ''
      },
      isFavorite: true
    };
  }

  // Parse JSON field or return default
  parseJsonField(field) {
    if (!field) return null;
    try {
      return JSON.parse(field);
    } catch (e) {
      if (typeof field === 'string' && field.includes(',')) {
        return field.split(',').map(item => item.trim());
      }
      return field;
    }
  }
}

// Export singleton instance
export default new FavoritePropertyService();