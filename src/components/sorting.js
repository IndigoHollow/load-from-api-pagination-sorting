import React from "react";

const Sorting = props => {
  return (
    <select size="1" name="pet" className="form-control" onClick={props.onSort}>
      <option value="default" defaultValue="selected">
        Сортировать
      </option>
      <option value="priceLowToHigh">По возрастанию цены</option>
      <option value="priceHighToLow">По убыванию цены</option>
    </select>
  );
};

export default Sorting;
