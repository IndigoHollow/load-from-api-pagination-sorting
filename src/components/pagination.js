import React from "react";

const Pagination = props => {
  let listItems = [];
  const pages = Math.ceil(props.productsArrayLength / props.productsOnPage);

  for (let i = 1; i <= pages; i++) {
    listItems.push(i);
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {listItems.map((item, key) => (
          <li
            key={key}
            onClick={() => props.changePage(item - 1)}
            className="page-item"
          >
            <a className="page-link" href="#">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
