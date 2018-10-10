import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Product from "./components/product";
import Pagination from "./components/pagination";
import Sorting from "./components/sorting";

import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      refresh: "",
      city: "",
      products: null,
      dictionary: {},
      productsLoaded: 20,
      firstItemIndex: 0,
      shownProductsArray: null,
      actionsArray: null,
      sortingMethod: "default"
    };
  }

  componentDidMount() {
    const urlToken = "https://dev.rest.adamas.ru/v1/user/start",
      urlDictionaries = "https://dev.rest.adamas.ru/v1/dictionaries",
      urlProducts = "https://dev.rest.adamas.ru/v1/products";

    // Берем токен и записываем в state
    axios.get(urlToken).then(response => {
      this.setState({
        token: response.data.token,
        refresh: response.data.refresh,
        cityCode: response.data.city,
        city: ""
      });

      const authCode = "Bearer ".concat(this.state.token);

      // Возвращаем промис загрузки словаря
      const getDictionaries = () => {
        return axios
          .get(urlDictionaries, { headers: { authorization: authCode } })
          .then(response => {
            this.setState({
              dictionary: response.data,
              city:
                response.data.references.cities.items[this.state.cityCode]
                  .title,
              actionsArray: response.data.data.actions.items
            });
          });
      };

      // возвращаем токен загрузки продуктов
      const getProducts = () => {
        return axios
          .get(urlProducts, { headers: { authorization: authCode } })
          .then(response => {
            this.setState({
              products: response.data
            });
          });
      };

      // комбинируем промисы
      function getDictsAndProds() {
        return Promise.all([getDictionaries(), getProducts()]);
      }

      // когда промисы загрузились, заполняем массив показываемых товаров
      getDictsAndProds().then(([dicts, prods]) => {
        console.log("Промисы загрузились");
        this.fillProductsArray();
      });
    });
  }

  // Загружает массив 20 продуктов, выводимых на экран, в state
  fillProductsArray = () => {
    const state = this.state,
      newArray = state.products.data.filter((item, key) => {
        return (
          key >= state.firstItemIndex &&
          key < state.firstItemIndex + state.productsLoaded
        );
      });

    // Добавляем в массив продукта свойство с текстом акции
    newArray.map(
      (item, key) =>
        (item.action = this.findActionById(
          item.labels[item.labels.length - 1].id
        ))
    );

    this.setState({
      shownProductsArray: newArray
    });
  };

  // Находит текст акции в словаре по label id продукта
  findActionById = actionId => {
    const action = this.state.actionsArray.filter(obj => {
      return obj.id === actionId;
    });

    return action[0].title;
  };

  // Обработка выбора варианта сортировки
  handleSort = e => {
    const state = this.state;
    if (
      e.target.value !== "default" &&
      state.sortingMethod !== e.target.value
    ) {
      const myData = [].concat(state.products.data);
      let sortedProducts = [],
        sortingFunction;

      if (e.target.value === "priceLowToHigh") {
        sortingFunction = function(a, b) {
          return myData[a].price - myData[b].price;
        };
      } else if (e.target.value === "priceHighToLow") {
        sortingFunction = function(a, b) {
          return myData[b].price - myData[a].price;
        };
      }

      Object.keys(myData)
        .sort(sortingFunction)
        .forEach(function(key) {
          sortedProducts.push(myData[key]);
        });

      const products = state.products;
      products.data = sortedProducts;

      this.handleChangePage(0);

      this.setState(
        {
          sortingMethod: e.target.value,
          products
        },
        this.fillProductsArray
      );
    }
  };

  // Обработка клика по элементу пагинации
  handleChangePage = page => {
    const firstItem = page * this.state.productsLoaded;

    this.setState(
      {
        firstItemIndex: firstItem
      },
      this.fillProductsArray
    );
  };

  // Обработка добавления в корзину
  handleAddToCart = (id, title, price) => {
    console.log(
      `Добавление в корзину: id: ${id}, title: ${title}, price: ${price}`
    );

    const urlAddToCart = "https://rest.adamas.ru/v1/cart",
      authCode = "Bearer ".concat(this.state.token),
      data = {
        offers: [0]
      },
      headers = {
        "Content-Type": "application/json",
        authorization: authCode
      };

    axios
      .post(urlAddToCart, data, headers)
      .then(response => console.log(response.data))
      .catch(err => console.log(err));

    /*
    (async () => {
      const rawResponse = await fetch(urlAddToCart, {
        method: "POST",
        headers: head,
        body: data
      });
      const content = await rawResponse.json();

      console.log(content);
    })();*/
  };

  render() {
    if (!this.state.shownProductsArray) {
      return <p>Loading...</p>;
    } else {
      return (
        <React.Fragment>
          <h4 className="city">
            Город: <span>{this.state.city}</span>
          </h4>
          <Pagination
            productsArrayLength={this.state.products.data.length}
            firstItemIndex={this.state.firstItemIndex}
            productsOnPage={this.state.productsLoaded}
            changePage={this.handleChangePage}
          />
          <Sorting onSort={this.handleSort} />
          <div className="productsLayout">
            <div className="view-container">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    {this.state.shownProductsArray.map((item, key) => (
                      <Product
                        img={this.state.shownProductsArray[key].photo[0]}
                        title={this.state.shownProductsArray[key].title}
                        url={this.state.shownProductsArray[key].url}
                        id={this.state.shownProductsArray[key].id}
                        price={this.state.shownProductsArray[key].price}
                        actionId={this.state.shownProductsArray[key].action}
                        onAddToCart={this.handleAddToCart}
                        key={key}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Pagination
            productsArrayLength={this.state.products.data.length}
            firstItemIndex={this.state.firstItemIndex}
            productsOnPage={this.state.productsLoaded}
            changePage={this.handleChangePage}
          />
        </React.Fragment>
      );
    }
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
