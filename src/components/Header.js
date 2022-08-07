import { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Header.css";
import Logo from '../svg/Logo';
import EmptyCart from '../svg/EmptyCart';
import Drop from '../svg/Drop';

export default class Header extends PureComponent {
  render() {
    return (
      <header>
        <div id="navigation">
          <Link to="/" className="opt noselect chosen">
            <span>ALL</span>
          </Link>
          <Link to="/tech" className="opt noselect">
            <span>TECH</span>
          </Link>
          <Link to="/clothes" className="opt noselect">
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
