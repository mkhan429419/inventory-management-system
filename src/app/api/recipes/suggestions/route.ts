// src/app/api/recipes/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { ingredients } = await req.json();
    console.log("Received ingredients:", ingredients);

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing");
    }

    // Define the correct Gemini API endpoint and model with API key as a query parameter
    const geminiApiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    // Make a request to the Gemini API
    const response = await axios.post(
      geminiApiEndpoint,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a recipe using the following ingredients: ${ingredients.join(
                  ", "
                )}. Make sure the recipe utilizes ONLY the provided ingredients.`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const suggestedRecipes = response.data;
    console.log("Suggested Recipes:", suggestedRecipes);

    // Return the suggested recipes
    return new NextResponse(JSON.stringify(suggestedRecipes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "Error fetching recipes:",
      (error as any).response?.data || (error as any).message
    );
    return new NextResponse(
      JSON.stringify({
        message: "Error fetching recipes",
        details: (error as any).response?.data || (error as any).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
