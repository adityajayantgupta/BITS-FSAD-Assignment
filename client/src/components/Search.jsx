import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";

export default function Search({ updateSearchResults }) {
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilters, setTypeFilters] = useState({
    vegetarian: false,
    "non-vegetarian": false,
    pescetarian: false,
  });

  const [difficultyFilters, setDifficultyFilters] = useState({
    beginner: false,
    intermediate: false,
    expert: false,
  });

  const [timeValue, setTimeValue] = useState(999);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (typeFilters.hasOwnProperty(name)) {
      setTypeFilters((prevFilters) => ({
        ...prevFilters,
        [name]: checked,
      }));
    } else if (difficultyFilters.hasOwnProperty(name)) {
      setDifficultyFilters((prevFilters) => ({
        ...prevFilters,
        [name]: checked,
      }));
    }
    console.log(typeFilters, difficultyFilters);
  };

  const handleTimeChange = (event) => {
    const value = parseInt(event.target.value);
    setTimeValue(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct Firestore query filters
    let recipesRef = collection(db, "recipes");

    // Apply filters
    if (
      typeFilters.vegetarian ||
      typeFilters["non-vegetarian"] ||
      typeFilters.pescetarian
    ) {
      recipesRef = query(
        recipesRef,
        where(
          "metadata.type",
          "in",
          Object.entries(typeFilters)
            .filter(([_, value]) => value)
            .map(([key]) => key)
        )
      );
    }

    if (
      difficultyFilters.beginner ||
      difficultyFilters.intermediate ||
      difficultyFilters.expert
    ) {
      recipesRef = query(
        recipesRef,
        where(
          "metadata.difficulty",
          "in",
          Object.entries(difficultyFilters)
            .filter(([_, value]) => value)
            .map(([key]) => key)
        )
      );
    }

    // Apply search term filter
    if (searchTerm.trim() !== "") {
      recipesRef = query(
        recipesRef,
        orderBy("title"),
        startAt(searchTerm.toLowerCase()),
        endAt(searchTerm.toLowerCase() + "\uf8ff")
      );
    }

    // Execute Firestore query
    try {
      const querySnapshot = await getDocs(recipesRef);
      let recipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const timeInMinutes = parseInt(timeValue);
      if (timeInMinutes > 0) {
        recipes = recipes.filter((recipe) => {
          return parseInt(recipe.metadata.time) <= timeInMinutes;
        });
      }

      setSearchResult(recipes);
      updateSearchResults(recipes);
      console.log(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      updateSearchResults([]);
    }
  };
  return (
    <form class="max-w-md mx-auto" onSubmit={handleSubmit}>
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only "
      >
        Search
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-gray-500 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search Mockups, Logos..."
          name="searchTerm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
        >
          Search
        </button>
      </div>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative"></div>

      {/* Type checkboxes */}
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Type:
        </label>
        <div className="flex items-center space-x-4">
          {Object.entries(typeFilters).map(([type, checked]) => (
            <React.Fragment key={type}>
              <input
                type="checkbox"
                id={`${type}`}
                name={`${type}`}
                checked={checked}
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <label
                htmlFor={`${type}`}
                className="text-sm font-medium text-gray-700"
              >
                {type}
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Difficulty checkboxes */}
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Difficulty:
        </label>
        <div className="flex items-center space-x-4">
          {Object.entries(difficultyFilters).map(([difficulty, checked]) => (
            <React.Fragment key={difficulty}>
              <input
                type="checkbox"
                id={`${difficulty}`}
                name={`${difficulty}`}
                checked={checked}
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <label
                htmlFor={`${difficulty}`}
                className="text-sm font-medium text-gray-700"
              >
                {difficulty}
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="time-select" className="mr-2">
          Time:
        </label>
        <select
          id="time-select"
          className="border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          onChange={handleTimeChange}
          value={timeValue}
        >
          <option value="5">5 minutes</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="999">&gt; 1 hour</option>
        </select>
      </div>
    </form>
  );
}
