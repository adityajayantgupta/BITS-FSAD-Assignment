import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import AddReview from "./Review";

export default function RecipeDetail({ recipeId }) {
  const navigate = useNavigate();
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  const handleReviewClick = () => {
    setIsAddReviewOpen(true);
  };

  const handleCloseReview = () => {
    setIsAddReviewOpen(false);
  };
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

  const _handleDeleteRecipe = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (confirmDelete) {
      try {
        // Delete the recipe document
        await deleteDoc(doc(db, "recipes", recipeId));
        navigate("/profile");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        // Handle any errors that occur during deletion
        alert(
          "An error occurred while deleting the recipe. Please try again later."
        );
      }
    }
  };

  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(2);
  };

  const renderStars = (averageRating) => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current text-yellow-500 inline"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.68 5.26 6.02.87-4.36 4.24 1.03 6.01L10 15.4l-5.38 2.78 1.03-6.01L1.3 7.13l6.02-.87L10 1z" />
        </svg>
      );
    }

    if (halfStar) {
      stars.push(
        <svg
          key="half"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current text-yellow-500 inline"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.68 5.26 6.02.87-4.36 4.24 1.03 6.01L10 15.4l-5.38 2.78 1.03-6.01L1.3 7.13l6.02-.87L10 1z" />
        </svg>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current text-gray-300 inline"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.68 5.26 6.02.87-4.36 4.24 1.03 6.01L10 15.4l-5.38 2.78 1.03-6.01L1.3 7.13l6.02-.87L10 1z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <section className="max-w-screen-xl flex flex-wrap justify-between m-auto my-10">
      {isAddReviewOpen && (
        <AddReview
          recipeId={recipeId}
          recipeOwner={{ uid: recipe.uid }}
          isOpen={isAddReviewOpen}
          onClose={handleCloseReview}
        />
      )}

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
          <div>
            {renderStars(calculateAverageRating(recipe.reviews))} (
            {recipe.reviews.length} reviews)
          </div>
          <div className="flex justify-between">
            <div
              id="action-buttons"
              className="flex items-center justify-center"
            >
              <button onClick={handleReviewClick} title="Review">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 fill-current inline"
                  viewBox="0 0 24 24"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    id="comment"
                  >
                    <path
                      fill="#231F20"
                      d="M25.784 21.017A10.992 10.992 0 0 0 27 16c0-6.065-4.935-11-11-11S5 9.935 5 16s4.935 11 11 11c1.742 0 3.468-.419 5.018-1.215l4.74 1.185a.996.996 0 0 0 .949-.263 1 1 0 0 0 .263-.95l-1.186-4.74zm-2.033.11.874 3.498-3.498-.875a1.006 1.006 0 0 0-.731.098A8.99 8.99 0 0 1 16 25c-4.963 0-9-4.038-9-9s4.037-9 9-9 9 4.038 9 9a8.997 8.997 0 0 1-1.151 4.395.995.995 0 0 0-.098.732z"
                    ></path>
                  </svg>
                </svg>
              </button>
              {user.uid === recipe.uid && (
                <a href={"/recipes/edit/" + recipeId} title="Edit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 30 30"
                    className="h-6 w-6 fill-current inline"
                  >
                    <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
                  </svg>
                </a>
              )}
              {user.uid === recipe.uid && (
                <button onClick={_handleDeleteRecipe} title="Delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    enable-background="new 0 0 60 60"
                    viewBox="0 0 60 60"
                    id="delete"
                    className="h-6 w-6 fill-current inline"
                  >
                    <path
                      d="M18.3,56h23.6c2.7,0,4.8-2.2,4.8-4.8V18.7h2.1c0.6,0,1-0.4,1-1v-2.3c0-2.1-1.7-3.7-3.7-3.7h-8.5V9.1c0-1.7-1.4-3.1-3.1-3.1
	h-8.9c-1.7,0-3.1,1.4-3.1,3.1v2.6H14c-2.1,0-3.7,1.7-3.7,3.7v2.3c0,0.6,0.4,1,1,1h2.1v32.5C13.4,53.8,15.6,56,18.3,56z M44.7,51.2
	c0,1.6-1.3,2.8-2.8,2.8H18.3c-1.6,0-2.8-1.3-2.8-2.8V18.7h29.3V51.2z M24.5,9.1C24.5,8.5,25,8,25.6,8h8.9c0.6,0,1.1,0.5,1.1,1.1v2.6
	h-11V9.1z M12.3,15.4c0-1,0.8-1.7,1.7-1.7h32c1,0,1.7,0.8,1.7,1.7v1.3H12.3V15.4z"
                    ></path>
                    <path d="M37.9 49.2c.6 0 1-.4 1-1V24.4c0-.6-.4-1-1-1s-1 .4-1 1v23.8C36.9 48.8 37.4 49.2 37.9 49.2zM30.1 49.2c.6 0 1-.4 1-1V24.4c0-.6-.4-1-1-1s-1 .4-1 1v23.8C29.1 48.8 29.5 49.2 30.1 49.2zM22.2 49.2c.6 0 1-.4 1-1V24.4c0-.6-.4-1-1-1s-1 .4-1 1v23.8C21.2 48.8 21.6 49.2 22.2 49.2z"></path>
                  </svg>{" "}
                </button>
              )}
            </div>
            <div id="recipe-tags" className="flex justify-end">
              <span
                className={`tag font-bold p-2 m-2 rounded ${
                  recipe.metadata.difficulty === "beginner"
                    ? "bg-green-500 bg-opacity-15 text-green-700"
                    : recipe.metadata.difficulty === "intermediate"
                    ? "bg-orange-500 bg-opacity-15 text-orange-700"
                    : "bg-red-500 bg-opacity-15 text-red-700"
                }`}
              >
                {recipe.metadata.difficulty}
              </span>
              <span
                className={`tag font-bold p-2 m-2 rounded ${
                  recipe.metadata.time <= 30
                    ? "bg-green-500 bg-opacity-15 text-green-700"
                    : recipe.metadata.time <= 60
                    ? "bg-orange-500 bg-opacity-15 text-orange-700"
                    : "bg-red-500 bg-opacity-15 text-red-700"
                }`}
              >
                {recipe.metadata.time} mins
              </span>
              <span
                className={`tag font-bold p-2 m-2 rounded ${
                  recipe.metadata.type === "vegetarian"
                    ? "bg-green-500 bg-opacity-15 text-green-700"
                    : recipe.metadata.type === "non-vegetarian"
                    ? "bg-red-500 bg-opacity-15 text-red-700"
                    : "bg-blue-500 bg-opacity-15 text-blue-700"
                }`}
              >
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
        {recipe.reviews.length > 0 && (
          <section name="reviews" className="bg-gray-100 p-4 rounded-xl">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <ul className="my-2 bg-white rounded-xl p-4">
              {recipe.reviews.map((review) => {
                return (
                  <li className="">
                    <h2 className="font-bold">{review.userName}</h2>
                    <div>
                      {renderStars(calculateAverageRating(recipe.reviews))} (
                      {recipe.reviews.length} reviews)
                    </div>
                    {review.comment}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
