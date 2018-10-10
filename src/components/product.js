import React from "react";

const Product = props => {
  return (
    <div className="col-md-4 productItem" key={props.id}>
      <div className="thumbnail">
        <img
          src={`https://rest.adamas.ru/img/m/1000/${props.img}`}
          alt={props.title}
        />
      </div>
      <h5 className="product-title">{props.title}</h5>
      <div className="badge badge-primary">{props.actionId}</div>
      <div className="productPrice">
        <span>Цена:</span> {props.price} руб
      </div>
      <button
        className="addToCart"
        onClick={() => props.onAddToCart(props.id, props.title, props.price)}
      >
        Добавить в корзину
      </button>
    </div>
  );
};

export default Product;
