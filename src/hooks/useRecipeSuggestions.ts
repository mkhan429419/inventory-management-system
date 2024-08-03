// src/hooks/useRecipeSuggestions.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

export const useRecipeSuggestions = () => {
  const { user, isLoaded } = useUser();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('/api/recipes/suggestions', {
          params: {
            userId: user.id,
          },
        });
        setSuggestions(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recipe suggestions:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [isLoaded, user]);

  return { suggestions, isLoading, isError };
};
