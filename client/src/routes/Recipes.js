import { useParams } from "react-router-dom";
import RecipeDetail from "../components/RecipeDetail";
import RecipeList from "../components/RecipeList";

export default function Recipe() {
  const { recipeId } = useParams();

  return (
    <div>
      {recipeId ? <RecipeDetail recipeId={recipeId} /> : <RecipeList />}
    </div>
  );
}
