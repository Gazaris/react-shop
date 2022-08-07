import { PureComponent } from 'react';
import "../styles/NotFound.css";
import { Link } from "react-router-dom";

export default class NotFound extends PureComponent {
  render() {
    return (
      <div id="not-found">
        <h1>404</h1>
        <h2>This page doesn't exist!</h2>
        <Link to="/">Go back to the home page</Link>
      </div>
    )
  }
}
