import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { favoritePropertyService } from "@/services/favoritePropertyService";

const FAVORITES_KEY = "estate_browse_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }, [favorites]);

// Add property to favorites
  const addToFavorites = async (property) => {
    if (!property?.Id) {
      toast.error("Invalid property data");
      return;
    }
    
    if (isFavorite(property.Id)) {
      toast.info("Property is already in favorites");
      return;
    }

    setLoading(true);
    try {
      const success = await favoritePropertyService.addToFavorites(property.Id);
      if (success) {
        setFavorites(prev => [...prev, { ...property, isFavorite: true }]);
        toast.success("Added to favorites");
      } else {
        toast.error("Failed to add to favorites");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Failed to add to favorites");
    } finally {
      setLoading(false);
    }
  };

// Remove property from favorites
  const removeFromFavorites = async (propertyId) => {
    if (!propertyId) {
      toast.error("Invalid property ID");
      return;
    }
    
    setLoading(true);
    try {
      const success = await favoritePropertyService.removeFromFavorites(propertyId);
      if (success) {
        const numericId = parseInt(propertyId);
        setFavorites(prev => prev.filter(p => p.Id !== numericId));
        toast.success("Removed from favorites");
      } else {
        toast.error("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Failed to remove from favorites");
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (property) => {
    if (isFavorite(property.Id)) {
      removeFromFavorites(property.Id);
    } else {
      addToFavorites(property);
    }
  };

  // Check if property is in favorites
  const isFavorite = (propertyId) => {
    const numericId = parseInt(propertyId);
    return favorites.some(p => p.Id === numericId);
  };

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([]);
    toast.success("All favorites cleared");
  };

return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    loading,
    favoritesCount: favorites.length
  };
};