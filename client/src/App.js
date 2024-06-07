import React from "react";
import "./App.css";

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
          <h1 className="text-7xl my-6 font-bold">AI Powered Recipes!</h1>
          <p className="text-lg text-gray-400">
            Explore recipes added by our users, submit your own creations, or
            ask our AI for suggestions based on your available ingredients!{" "}
            <br />
          </p>
          <a
            href="/askAI"
            className="inline-block rounded-3xl text-white bg-green-500 px-10 py-3 my-8 mr-3"
          >
            Ask the AI
          </a>
          <a
            href="/recipes"
            className="inline-block rounded-3xl text-green-500 border-2 border-green-500 px-10 py-3 my-8"
          >
            Explore recipes
          </a>
        </div>
        <div className="w-1/2">
          <img src="hero-image.jpg" alt="" srcset="" className="m-auto" />
        </div>
      </div>
    </main>
  );
}

export default App;
