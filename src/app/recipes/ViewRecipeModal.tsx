// src/app/recipes/ViewRecipeModal.tsx
import React from 'react';
import { Recipe } from '@/types';

type ViewRecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
};

const ViewRecipeModal: React.FC<ViewRecipeModalProps> = ({ isOpen, onClose, recipe }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-xl font-bold mb-4">{recipe.title}</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Ingredients</h3>
          <ul className="list-disc pl-5">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Instructions</h3>
          <p>{recipe.instructions}</p>
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRecipeModal;
