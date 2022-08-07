import './App.css';
import { PureComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import Header from './components/Header';
import { client } from '@tilework/opus';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    client.setEndpoint(process.env.REACT_APP_GRAPHQL_ENDPOINT);
  }
  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route path="/:category" component={(props) => <ProductsList {...props} key={window.location.pathname} />} />
          <Route path="/">
            <Redirect to="/all" />
          </Route>
        </Switch>
      </div>
    );
  }
}
