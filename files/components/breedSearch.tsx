import { useCallback } from "react";
import { useCatsLayout } from "../store/reducer";

const BreedSearch = () => {
  const { setSearch } = useCatsLayout();

  const onChange = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  return (
    <input
      placeholder="search by breed name"
      className="form-control"
      onChange={onChange}
      type="text"
    />
  );
};

export default BreedSearch;
