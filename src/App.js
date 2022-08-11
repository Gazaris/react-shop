import './App.css';
import { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import Header from './components/Header';
import NotFound from './components/NotFound';
import { Query, client } from '@tilework/opus';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: {
        label: "",
        symbol: ""
      },
      currencies: [],
      categories: [],
      error: false
    }
    client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT);
    this.getCurs = this.getCurs.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
  }
  componentDidMount() {
    this.getCtgrs();
    if(!this.state.error) 
      this.getCurs();
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
      if(this.state.currency.symbol === "") {
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
      <div className="App">
        <Header
          // Key for updating the component after props change
          key={Math.random()}
          categories={this.state.categories}
          setcur={this.setCurrency}
          currencies={this.state.currencies}
          currency={this.state.currency} />
        <Switch>
          <Route path="/404">
            <NotFound />
          </Route>
          <Route
            path="/:category"
            component={
              (props) => <ProductsList
                currency={this.state.currency}
                error={this.state.error}
                {...props}
                key={window.location.pathname} />
            }
          />
          <Route path="/">
            <Redirect to="/all" />
          </Route>
        </Switch>
      </div>
    );
  }
}
