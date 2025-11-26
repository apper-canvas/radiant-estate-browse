import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FAVORITES_KEY = "estate_browse_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

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
  const addToFavorites = (property) => {
    if (isFavorite(property.Id)) {
      toast.info("Property is already in favorites");
      return;
    }

    setFavorites(prev => [...prev, { ...property, isFavorite: true }]);
    toast.success("Property added to favorites");
  };

  // Remove property from favorites
  const removeFromFavorites = (propertyId) => {
    const numericId = parseInt(propertyId);
    setFavorites(prev => prev.filter(p => p.Id !== numericId));
    toast.success("Property removed from favorites");
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
    favoritesCount: favorites.length
  };
};