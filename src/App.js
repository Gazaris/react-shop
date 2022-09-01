import './App.css';
import { PureComponent, createRef } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import Header from './components/Header';
import NotFound from './components/NotFound';
import ProductDisplay from './components/ProductDisplay';
import CartPage from './components/CartPage';
import { client } from '@tilework/opus';
import { getCategoriesQuery, getCurrenciesQuery } from './Queries';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: {
        label: "",
        symbol: "-"
      },
      currencies: [],
      categories: [],
      error: false
    }
    this.appRef = createRef();
    this.cartCounterRef = createRef();
    this.cartRef = createRef();
    this.cartPageRef = createRef();
    this.darkenerRef = createRef();

    client.setEndpoint("http://localhost:4000/");

    this.findInCart = this.findInCart.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.subtrFromCart = this.subtrFromCart.bind(this);
    this.setCart = this.setCart.bind(this);

    this.getCurs = this.getCurs.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
  }
  componentDidMount() {
    this.getCtgrs();
    if(!this.state.error) 
      this.getCurs();
  }
  setCart(cartset) {
    localStorage.setItem("cart", JSON.stringify(cartset));
    let newCartCount = 0;
    if(cartset.length !== 0) {
      for(let item of cartset)
        newCartCount += item.quantity;
    }
    if(this.cartPageRef.current)
      this.cartPageRef.current.setState({ cart: cartset });
    if(this.cartCounterRef.current)
      this.cartCounterRef.current.setCount(newCartCount);
    if(this.cartRef.current)
      this.cartRef.current.setState({ cartCount: newCartCount, cart: cartset })
  }
  findInCart(item, cart) {
    // Searching for the identical item in cart
    return cart.findIndex(e => {
      let rightOne = true && e.id === item.id;
      if(!rightOne) return rightOne;
      for(let a in item.chosenAttributes) {
        rightOne &&= (item.chosenAttributes[a].chosenItemId === e.chosenAttributes[a].chosenItemId);
        if(!rightOne) return rightOne;
      }
      return rightOne;
    });
  }
  // Must pass item with all chosen attributes
  // and quantity of 1
  addToCart(item) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let newCart = [ ...cart ];
    const found = this.findInCart(item, cart);
    found === -1
      ? newCart.push(item)
      : newCart[found].quantity += 1
    return this.setCart(newCart);
  }
  // Must pass item that already exists in the cart
  subtrFromCart(item) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let newCart = [ ...cart ];
    const found = this.findInCart(item, cart);
    item.quantity === 1
      ? newCart.splice(found, 1)
      : newCart[found].quantity -= 1;
    if(newCart.length === 0) {
      this.cartRef.current.setState({ cartCount: 0 });
      return this.setCart([]);
    }
    return this.setCart(newCart);
  }
  async getCtgrs() {
    const res = await client.post(getCategoriesQuery());
    if(res.categories !== []) {
      let resCat = [];
      for(let cat of res.categories) {
        resCat.push(cat.name);
      }
      this.setState({ categories: resCat });
    }
    else {
      this.setState({ error: true })
    }
  }
  async getCurs() {
    const res = await client.post(getCurrenciesQuery());
    if(res.currencies !== []) {
      this.setState({ currencies: res.currencies});
      if(this.state.currency.symbol === "-") {
        let tempCur = localStorage.getItem("currency");
        if(tempCur !== null) {
          this.setState({ currency: JSON.parse(tempCur) });
        } else {
          this.setState({ currency: res.currencies[0] });
          localStorage.setItem("currency", JSON.stringify(res.currencies[0]));
        }
      }
    }
    else {
      this.setState({ error: true })
    }
  }
  setCurrency(cur) {
    this.setState({ currency: cur });
    localStorage.setItem("currency", JSON.stringify(cur));
  }
  render() {
    if(this.state.currency.label === "" ||
      this.state.currencies.length === 0 ||
      this.state.categories.length === 0)
      return <div />;
    return (
      <div id="App" ref={this.appRef} >
        <Header
          // Key for updating the component after props change
          key={Math.random()}
          appRef={this.appRef}
          counterRef={this.cartCounterRef}
          cartRef={this.cartRef}
          darkenerRef={this.darkenerRef}
          addtocart={this.addToCart}
          subtrfromcart={this.subtrFromCart}
          categories={this.state.categories}
          currencies={this.state.currencies}
          currency={this.state.currency}
          setcur={this.setCurrency}
        />
        <Switch>
          <Route path="/404">
            <NotFound />
          </Route>
          <Route path="/cart">
            <CartPage
              key={Math.random()}
              ref={this.cartPageRef}
              addtocart={this.addToCart}
              subtrfromcart={this.subtrFromCart}
              currency={this.state.currency}
            />
          </Route>
          <Route
            path="/item/:id"
            component={
              (props) => <ProductDisplay
                currency={this.state.currency}
                addtocart={this.addToCart}
                {...props}
                key={window.location.pathname} />
            }
          />
          <Route
            path="/:category"
            component={
              (props) => <ProductsList
                currency={this.state.currency}
                error={this.state.error}
                addtocart={this.addToCart}
                {...props}
                key={window.location.pathname} />
            }
          />
          <Route path="/">
            <Redirect to="/all" />
          </Route>
        </Switch>
        <div id="cart-darkener" ref={this.darkenerRef} />
      </div>
    );
  }
}
