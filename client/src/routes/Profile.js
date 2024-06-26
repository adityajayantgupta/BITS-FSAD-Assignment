import {
  deleteUser,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import { auth } from "../firebase";

export default function Profile() {
  const [user, setUser] = useState({ uid: null });
  const [email, setEmail] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const navigate = useNavigate();

  const _handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (user) {
      try {
        if (user.email !== email) {
          await updateEmail(user, email);
          alert("Email updated!");
        }
        if (newPassword) {
          await updatePassword(user, newPassword);
          alert("Password updated!");
        }
        if (user.displayName !== displayName) {
          await updateProfile(user, {
            displayName: displayName,
          });
          alert("Name updated!");
        }
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          alert("Please reauthenticate to perform this action.");
          navigate("/login");
        } else if (err.code === "auth/email-already-in-use") {
          return alert("The new email address is already in use.");
        } else if (err.code === "auth/invalid-email") {
          return alert("The new email address is invalid.");
        } else if (err.code === "auth/operation-not-allowed") {
          return alert(
            "Email/password updates are not enabled. Please verify your email or contact support."
          );
        } else {
          return alert("An error occurred: " + err.message);
        }
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        setDisplayName(user.displayName);
      }
    });
  }, []);

  const _handleDeleteUser = async () => {
    try {
      await deleteUser(user);
      navigate("/login");
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  return (
    <div className="flex max-w-screen-xl flex-wrap m-auto mt-10">
      <section className="w-1/3 border-solid border-r-gray-300 border-r-2 pr-4">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <form
          class="space-y-4 md:space-y-6"
          action="#"
          onSubmit={_handleUpdateProfile}
        >
          <div>
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your Name
            </label>
            <input
              type="displayName"
              name="displayName"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="Your Name"
              required=""
            />
          </div>
          <div>
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 "
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              placeholder="name@company.com"
              required=""
            />
          </div>

          <div>
            <label
              for="new-password"
              class="block mb-2 text-sm font-medium text-gray-900 "
            >
              Change password
            </label>
            <input
              type="password"
              name="new-password"
              id="new-password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
              required=""
            />
          </div>
          <div className="space-y-2">
            <button
              type="submit"
              class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Update Profile
            </button>
            <a
              href="/logout"
              class="w-full text-blue-600 border-blue-600 border-2 bg-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center block"
            >
              Sign out
            </a>
            <button
              onClick={_handleDeleteUser}
              class="w-full text-white bg-red-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
            >
              Delete Account
            </button>
          </div>
        </form>
      </section>
      <section className="w-2/3 px-4">
        <h1 className="text-2xl font-bold">Your Recipes</h1>
        <RecipeList uid={user.uid} />
      </section>
    </div>
  );
}
