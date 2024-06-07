import React from "react";
import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <MainContent />
    </div>
  );
}

function MainContent() {
  return (
    <main className="main-content max-w-screen-xl flex h-screen m-auto">
      <div className="m-auto flex">
        <div className="w-1/2">
          <h1 className="text-7xl my-6 font-bold">AI Powered Recipes</h1>
          <p className="text-lg text-gray-400">
            Explore recipes added by our users, submit your own creations!{" "}
            <br />
            Not sure what to make with the ingredients at hand? Just ask our AI
            to make a recipe tailored to your needs!
          </p>
          <button className="get-started rounded-3xl text-white bg-green-500 px-10 py-3 my-8">
            Get Started
          </button>
        </div>
        <div className="w-1/2">
          <img src="hero-image.jpg" alt="" srcset="" className="m-auto" />
        </div>
      </div>
    </main>
  );
}

export default App;
