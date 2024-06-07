import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function RecipeDetail({ recipeId }) {
  const navigate = useNavigate();
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    imageURL: "",
    reviews: [],
    metadata: {
      type: "",
      difficulty: "",
      time: "",
    },
  });
  const [user, setUser] = useState({ uid: null });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const fetchRecipe = async () => {
    const docRef = doc(db, "recipes", recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setRecipe(docSnap.data());
      console.log(docSnap.data());
    } else {
      navigate("/404");
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, []);

  return (
    <section className="max-w-screen-xl flex flex-wrap justify-between m-auto my-10">
      <div className="w-1/2">
        <img
          src={recipe.imageURL || "/recipe-placeholder.jpg"}
          alt="placeholder"
          className="rounded-xl aspect-square h-[500px]"
        />
      </div>
      <div className="w-1/2 space-y-2">
        <section name="recipe information">
          <h1 className="text-4xl font-bold">{recipe.title}</h1>
          <p className="text-lg">{recipe.description}</p>
          <div className="flex justify-between">
            <div id="action-buttons">
              <button>save</button>
              <button>review</button>
              <a href={"/recipes/edit/" + recipeId}>edit</a>
            </div>
            <div id="recipe-tags" className="flex justify-end">
              <span className="tag font-bold p-2 m-2 rounded bg-green-500 bg-opacity-15 text-green-700">
                {recipe.metadata.difficulty}
              </span>
              <span className="tag font-bold p-2 m-2 rounded bg-green-500 bg-opacity-15 text-green-700">
                {recipe.metadata.time} mins
              </span>
              <span className="tag font-bold p-2 m-2 rounded bg-green-500 bg-opacity-15 text-green-700">
                {recipe.metadata.type}
              </span>
            </div>
          </div>
        </section>
        <section
          name="recipe ingredients"
          className="bg-gray-100 p-4 rounded-3xl"
        >
          <div className="flex">
            <h2 className="text-2xl font-bold mr-4">Ingredients</h2>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              className="rounded-3xl px-4 w-14"
            />
          </div>

          <ul className="list-disc ml-5">
            {recipe.ingredients.map((ingredient) => {
              return (
                <li>
                  {ingredient.quantity * numberOfPeople} {ingredient.measure}{" "}
                  {ingredient.name}
                </li>
              );
            })}
          </ul>
        </section>
        <section name="recipe steps" className="bg-gray-100 p-4 rounded-3xl">
          <h2 className="text-2xl font-bold">Steps</h2>
          <ol className="list-decimal ml-5">
            {recipe.steps.map((step) => {
              return <li>{step}</li>;
            })}
          </ol>
        </section>
      </div>
    </section>
  );
}
