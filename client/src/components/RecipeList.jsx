import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import ListCard from "./ListCard";
import Search from "./Search";

export default function RecipeList({ uid }) {
  const [recipes, setRecipes] = useState([]);
  const fetchRecipes = async () => {
    let q;
    if (uid) {
      q = query(collection(db, "recipes"), where("uid", "==", uid));
    } else {
      q = collection(db, "recipes");
    }

    await getDocs(q).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecipes(newData);
    });
  };

  const updateSearchResults = (results) => {
    setRecipes(results);
  };

  useEffect(() => {
    fetchRecipes();
  }, [uid]);

  return (
    <section className="max-w-screen-xl flex flex-col flex-wrap m-auto mt-10 items-center justify-center">
      <h1 className="text-4xl font-bold mb-5">
        Explore our collection of recipes!
      </h1>
      <div className="mb-10 w-full">
        <Search updateSearchResults={updateSearchResults} />
      </div>
      {recipes.length < 0 ? (
        "No recipes found!"
      ) : (
        <ul className="grid grid-cols-4 gap-4">
          {recipes.map((recipe) => {
            return (
              <li key={recipe.id}>
                <ListCard card={recipe}></ListCard>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
