// src/app/recipes/CreateRecipeModal.tsx
import React, { useState, useEffect } from 'react';
import { useGetPantryItemsQuery } from '@/app/state/api';
import { PantryItem } from '@/types';
import Select from 'react-select';

type CreateRecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (ingredients: string[]) => void;
};

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const { data: pantryItems, isLoading, isError } = useGetPantryItemsQuery('');

  const handleIngredientChange = (selectedOptions: any) => {
    const selected = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setSelectedIngredients(selected);
  };

  const handleSubmit = () => {
    onCreate(selectedIngredients);
    onClose();
  };

  useEffect(() => {
    console.log("Pantry Items:", pantryItems);
  }, [pantryItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h2 className="text-xl font-bold mb-4">Create New Recipe</h2>
        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
            Select Ingredients
          </label>
          {isLoading ? (
            <p>Loading ingredients...</p>
          ) : isError ? (
            <p>Error loading ingredients</p>
          ) : (
            <Select
              isMulti
              options={pantryItems?.map((item: PantryItem) => ({
                value: item.name,
                label: item.name,
              }))}
              onChange={handleIngredientChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          )}
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipeModal;
