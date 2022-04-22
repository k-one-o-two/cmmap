import { useState, useCallback } from "react";
import { useCatsLayout } from "../store/reducer";
import { BreedSortBy } from "types";

const BreedsSort = () => {
  const { setSort } = useCatsLayout();
  const [sortBy, setSortBy] = useState<BreedSortBy>("name");

  const handleChange = useCallback(
    (type: BreedSortBy) => {
      setSortBy(type);
      setSort(type);
    },
    [setSort]
  );

  return (
    <>
      <span>Sort breeds by:</span>

      <div className="form-check form-check-inline">
        <input
          checked={sortBy === "name"}
          onChange={() => handleChange("name")}
          type="radio"
          className="custom-control-input"
        />
        <label className="custom-control-label">Breed name</label>
      </div>

      <div className="form-check form-check-inline">
        <input
          checked={sortBy === "intellinegce"}
          onChange={() => handleChange("intellinegce")}
          type="radio"
          className="custom-control-input"
        />
        <label className="custom-control-label">Intelligence</label>
      </div>

      <div className="form-check form-check-inline">
        <input
          checked={sortBy === "energy"}
          onChange={() => handleChange("energy")}
          type="radio"
          className="custom-control-input"
        />
        <label className="custom-control-label">Energy level</label>
      </div>
    </>
  );
};

export default BreedsSort;
