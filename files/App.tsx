import React from "react";
import Breeds from "./components/breeds";
import BreedsSort from "./components/breedsSort";
import BreedSearch from "./components/breedSearch";
import "./App.css";

function App() {
  const a = 5;
  return (
    <>
      <h2 className="text-center">Cat breeds</h2>
      <div className="mb-3 p-3">
        {a > 5 ? <BreedsSort /> : null}
        <BreedSearch />
        <AnotherCMP>
          <ClildCMP />
        </AnotherCMP>
      </div>
      <Breeds />
    </>
  );
}

export default App;
