import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { auth, db } from "../firebase";
import "./styles/AddReview.css";

const AddReview = ({ recipeId, recipeOwner, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is signed in
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    // Check if user is adding a review to their own recipe
    if (auth.currentUser.uid === recipeOwner.uid) {
      alert("You can't add a review to your own recipe.");
      return;
    }

    // Add review to the recipe's reviews array
    const reviewData = {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      rating: rating,
      comment: comment,
    };

    try {
      await updateDoc(doc(db, "recipes", recipeId), {
        reviews: arrayUnion(reviewData),
      });

      // Add review to the user's reviews array
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        reviews: arrayUnion({
          recipeId: recipeId,
          recipeName: "Recipe Name", // Replace with actual recipe name
          rating: rating,
          comment: comment,
        }),
      });

      alert("Review added successfully!");
      // Clear form fields after submission
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error adding review:", error);
      alert(
        "An error occurred while adding the review. Please try again later."
      );
    }
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content rounded-lg">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="text-2xl font-bold">Add Review</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <Rating
              onClick={handleRating}
              /* Available Props */
            />
          </label>
          <br />
          <label>
            Comment:
            <textarea
              rows={10}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border-2 rounded-xl block w-full p-2"
            ></textarea>
          </label>
          <br />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 px-4 rounded-xl"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
