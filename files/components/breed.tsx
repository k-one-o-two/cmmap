import { useMemo } from "react";
import { IBreed } from "types";
import ImageCard from "../atoms/card";

export interface IBreedProps {
  breed: IBreed;
}

const Breed = ({ breed }: IBreedProps) => {
  const intelligenceStr = useMemo(() => {
    return (
      <>
        <span className="fw-bold">Intelligence</span>: {breed.intelligence}
      </>
    );
  }, [breed]);

  const energyStr = useMemo(() => {
    return (
      <>
        <span className="fw-bold">Energy level</span>: {breed.energy_level}
      </>
    );
  }, [breed]);

  return (
    <ImageCard
      image={breed.image}
      imageDescription={breed.name}
      cardTitle={breed.name}
      cardContentLines={[intelligenceStr, energyStr, breed.description]}
    />
  );
};

export default Breed;
