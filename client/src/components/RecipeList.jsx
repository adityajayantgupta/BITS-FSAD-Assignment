import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import ListCard from "./ListCard";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const fetchRecipes = async () => {
    await getDocs(collection(db, "recipes")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecipes(newData);
      console.log(recipes, newData);
    });
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <section className="max-w-screen-xl flex flex-wrap m-auto mt-10">
      <ul className="grid grid-cols-4 gap-4">
        {recipes.map((recipe) => {
          return (
            <li key={recipe.id}>
              <ListCard card={recipe}></ListCard>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
