import { PureComponent, createRef } from 'react';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import "../styles/Header.css";
import Logo from '../svg/Logo';
import Drop from '../svg/Drop';

export default class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.categories,
      category: window.location.pathname.split('/')[1],
      currencies: this.props.currencies,
      currency: this.props.currency
    };
    this.curMenuRef = createRef();
    this.curDropRef = createRef();

    this.setcur = this.props.setcur.bind(this);
    this.addToCart = this.props.addtocart.bind(this);
    this.subtrFromCart = this.props.subtrfromcart.bind(this);
    this.clickEventFunc = this.clickEventFunc.bind(this);
    this.isMenu = this.isMenu.bind(this);
    this.closeCurMenu = this.closeCurMenu.bind(this);
    this.curSwitch = this.curSwitch.bind(this);
    this.curClickHandle = this.curClickHandle.bind(this);
    // Fix for redirect from main page
    if(this.state.category === "") this.state.category = "all";
  }
  clickEventFunc(e) {
    let menu = this.curMenuRef.current;
    if(menu.style.display === "block") {
      if(!this.isMenu(e.target) && e.target.id !== "currency-switch")
        this.closeCurMenu(menu);
    }
  }
  isMenu(el) {
    if(el.id === "curmenu" || el.id === "currency-switch") return true;
    else if(el.tagName === "BODY") return false;
    else return this.isMenu(el.parentElement);
  }
  closeCurMenu(menu) {
    this.curDropRef.current.style !== undefined
      ? this.curDropRef.current.style.transform = "scaleY(1)"
      : this.curDropRef.current.style = { transform: "scaleY(1)" };
    menu.style.transform = "translateY(0)";
    menu.style.opacity = "0";
    setTimeout(() => {
      menu.style.display = "none";
    }, 300);
    this.props.appRef.current.removeEventListener("click", this.clickEventFunc);
  }
  curSwitch() {
    let menu = this.curMenuRef.current;
    if(!menu.style.display || menu.style.display === "none") {
      // Controlling the dropdown icon
      if(!this.curDropRef.current.style)
        this.curDropRef.current.style = {transform: "scaleY(-1)"};
      else
        this.curDropRef.current.style.transform = "scaleY(-1)";

      // Controlling the menu
      menu.style.display = "block";
      setTimeout(() => {
        menu.style.transform = "translateY(10px)";
        menu.style.opacity = "1";
      }, 100);

      this.props.appRef.current.addEventListener("click", this.clickEventFunc);
    } else this.closeCurMenu(menu);
  }
  curClickHandle(curLabel, curSymbol) {
    if(this.state.currency.label === curLabel)
      this.closeCurMenu(this.curMenuRef.current);
    else {
      this.props.appRef.current
        .removeEventListener("click", this.clickEventFunc);
      this.setcur({label: curLabel, symbol: curSymbol});
    }
  }
  render() {
    let { categories, category, currencies } = this.state;
    return (
      <header >
        <div id="navigation">
          {categories.map((ctgr) => {
            return <Link
              key={ctgr}
              to={"/" + ctgr}
              onClick={() => this.setState({ category: ctgr })}
              className={"opt noselect" + (category === ctgr ? " chosen" : "")}
            >
              <span>{ctgr.toUpperCase()}</span>
            </Link>
          })}
        </div>
        <Logo id="logo"/>
        <div id="actions">
          <div id="currency-switch" onClick={this.curSwitch}>
            <span className="noselect">{this.props.currency.symbol}</span>
            <Drop id="drop" ref={this.curDropRef}/>
          </div>
          <div id="curmenu" ref={this.curMenuRef} >
            {currencies.map((cur) => {
              return <div
                className="curopt noselect"
                onClick={() => this.curClickHandle(cur.label, cur.symbol)}
                key={cur.label}
              >{cur.symbol + " " + cur.label}</div>
            })}
          </div>
          <Cart
            key={Math.random()}
            ref={this.props.cartRef}
            darkenerRef={this.props.darkenerRef}
            appRef={this.props.appRef}
            counterRef={this.props.counterRef}
            currency={this.state.currency}
            addtocart={this.addToCart}
            subtrfromcart={this.subtrFromCart}
          />
        </div>
      </header>
    )
  }
}
