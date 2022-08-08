import { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Header.css";
import Logo from '../svg/Logo';
import EmptyCart from '../svg/EmptyCart';
import Drop from '../svg/Drop';

export default class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      category: "none"
    };
    this.state.category = window.location.pathname.split('/')[1];
  }
  render() {
    let { category } = this.state;
    return (
      <header>
        <div id="navigation">
          <Link
            to="/"
            onClick={() => this.setState({ category: "all" })}
            className={"opt noselect" + (category === "all" ?" chosen" : "")}
          >
            <span>ALL</span>
          </Link>
          <Link
            to="/tech"
            onClick={() => this.setState({ category: "tech" })}
            className={"opt noselect" + (category === "tech" ? " chosen" : "")}
          >
            <span>TECH</span>
          </Link>
          <Link
            to="/clothes"
            onClick={() => this.setState({ category: "clothes" })}
            className={"opt noselect" + (category === "clothes" ? " chosen" : "")}
          >
            <span>CLOTHES</span>
          </Link>
        </div>
        <Logo id="logo"/>
        <div id="actions">
          <div id="currency">
            <span className='noselect'>$</span>
            <Drop id="drop"/>
          </div>
          <EmptyCart />
        </div>
      </header>
    )
  }
}
