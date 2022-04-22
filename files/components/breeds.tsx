import { useCallback, useState, useEffect, useMemo } from "react";
import { useGetBreedsQuery } from "../services/cats";
import Breed from "./breed";
import Loader from "../atoms/loader";
import { IBreed, BreedSortBy } from "types";
import { useCatsLayout } from "../store/reducer";

const COLS = 4;
const ROWS = 3;

const Breeds = () => {
  const { catsLayoutState } = useCatsLayout();
  const { data, error, isLoading } = useGetBreedsQuery();
  const [breedList, setBreedList] = useState<IBreed[]>([]);

  const sortPredicate = (
    breedA: IBreed,
    breedB: IBreed,
    sortBy: BreedSortBy
  ) => {
    if (sortBy === "energy") {
      return breedB.energy_level - breedA.energy_level;
    } else if (sortBy === "intellinegce") {
      return breedB.intelligence - breedA.intelligence;
    } else if (sortBy === "name") {
      return breedA.name > breedB.name ? 1 : -1;
    }

    return 0;
  };

  const mostAndLeastIntelligentBreeds = useMemo(() => {
    if (!data) {
      return null;
    }
    const sorted = [...data].sort((breedA, breedB) =>
      sortPredicate(breedA, breedB, "intellinegce")
    );

    return {
      most: `Most Intelligent cat breed is "${sorted[0].name}", with intelligence of ${sorted[0].intelligence}`,
      least: `Least  Intelligent cat breed is "${
        sorted[sorted.length - 1].name
      }", with intelligence of ${sorted[sorted.length - 1].intelligence}`,
    };
  }, [data]);

  useEffect(() => {
    setBreedList(
      data
        ?.filter((breed) =>
          breed.name
            .toLowerCase()
            .includes(catsLayoutState.searchStr.toLocaleLowerCase())
        )
        .sort((breedA, breedB) =>
          sortPredicate(breedA, breedB, catsLayoutState.sortBy)
        ) || []
    );
  }, [data, catsLayoutState.searchStr, catsLayoutState.sortBy]);

  const gridRow = useCallback(
    (index: number) => {
      if (!breedList) {
        return null;
      }
      return (
        <div className="row">
          {breedList
            .slice(COLS * index, COLS * index + COLS)
            .map((item: IBreed) => (
              <div className="col">
                <Breed key={item.id} breed={item} />
              </div>
            ))}
        </div>
      );
    },
    [breedList]
  );

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center">
        <h3>sorry, no cats today</h3>
        <span>there was an error calling the api, please try again later</span>
      </div>
    );
  }

  return data ? (
    <div className="container">
      <span className="d-block">{mostAndLeastIntelligentBreeds?.most}</span>
      <span className="d-block">{mostAndLeastIntelligentBreeds?.least}</span>
      {Array.from({ length: ROWS }, (_, i: number) => i).map((index: number) =>
        gridRow(index)
      )}
    </div>
  ) : null;
};

export default Breeds;
