import { useState } from "react";
import axios from "axios";

export default function AskAI() {
  const [type, setType] = useState("vegetarian");
  const [time, setTime] = useState(10);
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const _handleDeleteIngredient = (ingredientToDelete) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient !== ingredientToDelete)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ingredients.length < 1) {
      return alert("Add at least one ingredient!");
    }
    try {
      setLoading(true);
      const response = await axios.get("http://0.0.0.0:8000/v1/ask", {
        params: {
          ingredients: ingredients.join(", "),
          time: time + " mins",
          type,
        },
      });
      const formattedRecipes = parseResponse(response.data);
      setRecipes(formattedRecipes);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the recipes!", error);
      setLoading(false);
    }
  };

  const parseResponse = (response) => {
    const dishes = response.answer
      .split("\n\nDish ")
      .map((dish) => dish.trim())
      .filter((dish) => dish);
    const recipes = dishes.map((dish) => {
      const lines = dish
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
      const titleLine = lines.find((line) => line.startsWith("Title: "));
      const descriptionLine = lines.find((line) =>
        line.startsWith("Description: ")
      );
      const ingredientsLine = lines.find((line) =>
        line.startsWith("Ingredients: ")
      );
      const metadataLines = lines.slice(
        lines.findIndex((line) => line.startsWith("Metadata:")) + 1
      );

      const stepsStartIndex =
        lines.findIndex((line) => line.startsWith("Steps:")) + 1;
      const stepsEndIndex = lines.findIndex((line) =>
        line.startsWith("Metadata:")
      );
      const steps = lines
        .slice(stepsStartIndex, stepsEndIndex)
        .map((step) => step.replace(/^\d+\.\s*/, ""));

      const metadata = {};
      metadataLines.forEach((line) => {
        const [key, value] = line.split(":").map((item) => item.trim());
        metadata[key.toLowerCase()] = value;
      });

      return {
        title: titleLine.replace("Title: ", ""),
        description: descriptionLine.replace("Description: ", ""),
        ingredients: ingredientsLine.replace("Ingredients: ", "").split(", "),
        steps: steps,
        imageURL: "", // Assuming imageURL is not provided
        reviews: [], // Assuming reviews are not provided
        metadata: {
          type: metadata.type,
          difficulty: metadata.difficulty,
          time: metadata.time,
        },
      };
    });

    return recipes;
  };

  const LoadingIndicator = () => {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    );
  };

  return (
    <div className="max-w-screen-xl flex flex-col flex-wrap m-auto mt-10 items-center justify-center">
      <h1 className="text-4xl font-bold my-2">Ask the AI! </h1>
      <p className="mb-8">
        Got a handful of ingredients but can't decide what to make? Don't fret!
        Ask out AI for some possible recipes!
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 w-2/3">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700">Type of Dish</label>
              <select
                className="w-full p-2 border rounded"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="pescetarian">Pescetarian</option>
                <option value="no preference">No Preference</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Time (mins)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-bold">Ingredients</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add an ingredient"
              className="flex-1 p-2 border rounded"
              name="name"
              value={ingredient}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!ingredients.includes(ingredient)) {
                    setIngredients([...ingredients, ingredient]);
                    setIngredient("");
                  } else {
                    return alert("Ingredient already exists!");
                  }
                }
              }}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Use regex to allow only letters, numbers, and spaces
                const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, "");
                setIngredient(filteredValue);
              }}
            />

            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => {
                if (!ingredients.includes(ingredient)) {
                  setIngredients([...ingredients, ingredient]);
                  setIngredient("");
                } else {
                  return alert("Ingredient already exists!");
                }
              }}
            >
              +
            </button>
          </div>
          <ul className="flex space-x-2">
            {ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex p-2 space-x-2 bg-gray-100 rounded-lg"
              >
                {ingredient}
                <button
                  onClick={() => _handleDeleteIngredient(ingredient)}
                  className="ml-2 text-red-600"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Get Recipes {loading ? <LoadingIndicator /> : ""}
        </button>
      </form>

      <div className="mt-8">
        {recipes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold">Recipes</h2>
            {recipes.map((recipe, index) => (
              <div key={index} className="mt-4 p-4 border rounded">
                <h3 className="text-xl font-bold">{recipe.title}</h3>
                <p>{recipe.description}</p>
                <p>
                  <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
                </p>
                <p>
                  <strong>Steps:</strong>
                </p>
                <ol className="list-decimal list-inside">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
                <div id="recipe-tags" className="flex justify-end">
                  <span
                    className={`tag font-bold p-2 m-2 rounded ${
                      recipe.metadata.difficulty.toLowerCase() === "beginner"
                        ? "bg-green-500 bg-opacity-15 text-green-700"
                        : recipe.metadata.difficulty.toLowerCase() ===
                          "intermediate"
                        ? "bg-orange-500 bg-opacity-15 text-orange-700"
                        : "bg-red-500 bg-opacity-15 text-red-700"
                    }`}
                  >
                    {recipe.metadata.difficulty}
                  </span>
                  <span
                    className={`tag font-bold p-2 m-2 rounded ${
                      recipe.metadata.time.split(" ")[0] <= 30
                        ? "bg-green-500 bg-opacity-15 text-green-700"
                        : recipe.metadata.time.split(" ")[0] <= 60
                        ? "bg-orange-500 bg-opacity-15 text-orange-700"
                        : "bg-red-500 bg-opacity-15 text-red-700"
                    }`}
                  >
                    {recipe.metadata.time}
                  </span>
                  <span
                    className={`tag font-bold p-2 m-2 rounded ${
                      recipe.metadata.type.toLowerCase() === "vegetarian"
                        ? "bg-green-500 bg-opacity-15 text-green-700"
                        : recipe.metadata.type.toLowerCase() ===
                          "non-vegetarian"
                        ? "bg-red-500 bg-opacity-15 text-red-700"
                        : "bg-blue-500 bg-opacity-15 text-blue-700"
                    }`}
                  >
                    {recipe.metadata.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
