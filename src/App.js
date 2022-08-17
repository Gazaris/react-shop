import './App.css';
import { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import Header from './components/Header';
import NotFound from './components/NotFound';
import ProductDisplay from './components/ProductDisplay';
import { Query, client } from '@tilework/opus';

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
      cart: JSON.parse(localStorage.getItem("cart")),
      error: false
    }
    if(this.state.cart === null) {
      this.state.cart = [];
      localStorage.setItem("cart", JSON.stringify([]));
    }
    client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT);
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
    this.setState({ cart: cartset });
    localStorage.setItem("cart", JSON.stringify(cartset));
  }
  async getCtgrs() {
    const res = await client.post(
      new Query('categories', true)
        .addField('name')
    );
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
    const res = await client.post(
      new Query('currencies', true)
        .addField('label')
        .addField('symbol')
    );
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
    return (
      <div id="App">
        <Header
          // Key for updating the component after props change
          key={Math.random()}
          cart={this.state.cart}
          setcart={this.setCart}
          categories={this.state.categories}
          currencies={this.state.currencies}
          currency={this.state.currency}
          setcur={this.setCurrency}
        />
        <Switch>
          <Route path="/404">
            <NotFound />
          </Route>
          <Route
            path="/item/:id"
            component={
              (props) => <ProductDisplay
                currency={this.state.currency}
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
                cart={this.state.cart}
                setcart={this.setCart}
                {...props}
                key={window.location.pathname} />
            }
          />
          <Route path="/">
            <Redirect to="/all" />
          </Route>
        </Switch>
        <div id="cart-darkener" style={{display: "none", opacity: 0}} />
      </div>
    );
  }
}
