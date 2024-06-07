import { addDoc, doc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import { auth, db, storage } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";

export default function RecipeForm({ recipeId }) {
  const navigate = useNavigate();
  const fileTypes = ["JPG", "PNG"];
  const [user, setUser] = useState({ uid: null });
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    measure: "",
    quantity: "",
  });
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState("");
  const [formData, setFormData] = useState({
    userRef: doc(db, "users/" + user.uid),
    title: "",
    description: "",
    ingredients: ingredients,
    steps: steps,
    imageURL: "",
    reviews: [],
    metadata: {
      type: "",
      difficulty: "",
      time: "",
    },
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    if (recipeId) {
      prepopulateEditForm();
    }
  }, []);

  const prepopulateEditForm = async () => {
    const docRef = doc(db, "recipes", recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const recipeData = docSnap.data();
      formData.title = recipeData.title;
      formData.description = recipeData.description;
      setIngredients(recipeData.ingredients);
      setSteps(recipeData.steps);
      formData.imageURL = recipeData.imageURL;
      formData.reviews = recipeData.reviews;
      formData.metadata = recipeData.metadata;
    } else {
      navigate("/404");
    }
  };

  const _handleAddIngredient = () => {
    if (
      !newIngredient.name ||
      !newIngredient.measure ||
      !newIngredient.quantity
    ) {
      alert("Please fill in all fields for the ingredient");
      return;
    }
    if (
      ingredients.some((ingredient) => ingredient.name === newIngredient.name)
    ) {
      alert("Ingredient already exists");
      return;
    }

    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    setNewIngredient({ name: "", measure: "", quantity: "" });
  };

  const _handleDeleteIngredient = (ingredientToDelete) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient !== ingredientToDelete)
    );
  };

  const _handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient((prevIngredient) => ({
      ...prevIngredient,
      [name.split("-")[1]]: value,
    }));
  };

  const _handleAddStep = () => {
    if (newStep.trim() === "") {
      alert("Step cannot be empty");
      return;
    }

    setSteps((prevSteps) => [...prevSteps, newStep]);
    setNewStep("");
  };

  const _handleDeleteStep = (stepToDelete) => {
    setSteps((prevSteps) => prevSteps.filter((step) => step !== stepToDelete));
  };

  const _handleKeyPressIngredient = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      _handleAddIngredient();
    }
  };

  const _handleImageChange = (file) => {
    setImage(file);
  };

  const _handleSubmit = async (event) => {
    event.preventDefault();

    if (user) {
      formData.userRef = doc(db, "users/" + user.uid);
    }

    if (ingredients.length < 1 || steps.length < 1) {
      return alert(
        "Please add one or more ingredients and steps to your recipe"
      );
    }

    // Upload image to Firebase Storage if provided
    let imageURL = "";
    if (image) {
      const imageRef = storage.ref(`users/a1/images/public/${image.name}`);
      await imageRef.put(image);
      imageURL = await imageRef.getDownloadURL();
      setFormData({ ...formData, imageURL: imageURL });
    }

    try {
      // Add recipe data to Firestore
      await addDoc(collection(db, "recipes"), formData);
    } catch (err) {
      console.log(err);
      return alert("Error adding recipe to Firestore!");
    }

    setIngredients([]);
    setSteps([]);
    setFormData({
      title: "",
      description: "",
      ingredients: ingredients,
      steps: steps,
      imageURL: "",
    });
  };
  return (
    <form
      action=""
      className="w-1/2 flex-col flex-wrap justify-between m-auto my-10"
      onSubmit={_handleSubmit}
    >
      <h1 className="text-4xl font-bold">Create a new Recipe!</h1>
      <h2 className="text-2xl mt-10 mb-3">Basic Info</h2>
      <div className="flex mb-5 space-x-5">
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="rounded-lg p-2 px-4 bg-gray-100 w-1/2"
          placeholder="Title"
          required
        />
        <input
          name="description"
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="rounded-lg p-2 px-4 bg-gray-100 w-1/2"
          placeholder="Description"
          required
        />
      </div>
      <div className="flex space-x-2">
        <div className="w-full">
          <label htmlFor="type">Type of Dish</label>
          <select name="type" className="block bg-gray-100 w-full p-2">
            <option value="vegetarian">Vegetarian</option>
            <option value="non-vegetarian">Non-Vegetarian</option>
            <option value="pescetarian">Pescetarian</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="difficulty">Difficulty Level</label>
          <select name="difficulty" className="block bg-gray-100 w-full p-2">
            <option value="vegetarian">Beginner</option>
            <option value="non-vegetarian">Intermediate</option>
            <option value="pescetarian">Expert Chef!</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="time">Time</label>
          <input
            type="number"
            name="time"
            placeholder="mins"
            className="block rounded-lg p-2 px-4 bg-gray-100 w-full"
            required
          />
        </div>
      </div>
      <h2 className="text-2xl mt-10 mb-3">Ingredients</h2>
      <div className="flex justify-between space-x-2">
        <input
          name="ingredient-name"
          type="text"
          value={newIngredient.name}
          onChange={_handleInputChange}
          onKeyDown={_handleKeyPressIngredient}
          className="rounded-lg p-2 px-4 bg-gray-100 w-full"
          placeholder="Add an ingredient"
        />
        <input
          name="ingredient-measure"
          type="text"
          value={newIngredient.measure}
          onChange={_handleInputChange}
          onKeyDown={_handleKeyPressIngredient}
          className="rounded-lg p-2 px-4 bg-gray-100 w-full"
          placeholder="How to measure"
        />
        <input
          name="ingredient-quantity"
          type="number"
          value={newIngredient.quantity}
          onChange={_handleInputChange}
          onKeyDown={_handleKeyPressIngredient}
          className="rounded-lg p-2 px-4 bg-gray-100 w-full"
          placeholder="Quantity"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            _handleAddIngredient();
          }}
          className="bg-gray-100 py-2 px-4 rounded-lg"
        >
          +
        </button>
      </div>
      <ul className="flex space-x-2 my-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex p-2 space-x-2 bg-gray-100 rounded-lg">
            {ingredient.quantity} {ingredient.measure} {ingredient.name}
            <button
              onClick={() => _handleDeleteIngredient(ingredient)}
              className="ml-2 text-red-600"
            >
              x
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl mt-10 mb-3">Steps</h2>
      <div className="flex justify-between space-x-2">
        <input
          name="step"
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              _handleAddStep();
            }
          }}
          className="rounded-lg p-2 px-4 bg-gray-100 w-full"
          placeholder="Add a step to your recipe"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            _handleAddStep();
          }}
          className="bg-gray-100 py-2 px-4 rounded-lg"
        >
          +
        </button>
      </div>
      <ol className="list-decimal my-2 space-y-2">
        {steps.map((step, index) => (
          <li
            key={index}
            className="flex w-full justify-between p-2 space-x-2 bg-gray-100 rounded-lg"
          >
            {step}
            <button
              onClick={() => _handleDeleteStep(step)}
              className="ml-2 text-red-600"
            >
              x
            </button>
          </li>
        ))}
      </ol>

      <h2 className="text-2xl mt-10 mb-3">Add an Image (optional)</h2>
      <div className="flex">
        <FileUploader
          handleChange={_handleImageChange}
          name="file"
          types={fileTypes}
          classes="!h-[100px] !w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-lg w-1/5 py-5 mt-10"
      >
        Post!
      </button>
    </form>
  );
}
