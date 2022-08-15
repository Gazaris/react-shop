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
      categories: this.props.categories,
      category: window.location.pathname.split('/')[1],
      currencies: this.props.currencies,
      currency: this.props.currency,
      setcur: this.props.setcur
    };
    this.clickEventFunc = this.clickEventFunc.bind(this);
    this.isMenu = this.isMenu.bind(this);
    this.closeCurMenu = this.closeCurMenu.bind(this);
    this.curSwitch = this.curSwitch.bind(this);
    // Fix for redirect from main page
    if(this.state.category === "") this.state.category = "all";
  }
  clickEventFunc(e) {
    let menu = document.getElementById("curmenu");
    if (menu.style.display === 'block'){
      if (!this.isMenu(e.target) && e.target.id !== "currency-switch")
        this.closeCurMenu(menu);
    }
  }
  isMenu(el) {
    if (el.id === "curmenu" || el.id === "currency-switch") return true;
    else if (el.tagName === "BODY") return false;
    else return this.isMenu(el.parentElement);
  }
  closeCurMenu(menu) {
    document.getElementById("drop").style.transform = "scaleY(1)";
    menu.style.transform = 'translateY(0)';
    menu.style.opacity = '0';
    setTimeout(() => {
      menu.style.display = 'none';
    }, 300);
    document.removeEventListener("click", this.clickEventFunc);
  }
  curSwitch() {
    let menu = document.getElementById("curmenu");
    if(menu.style.display === "none") {
      // Controlling the dropdown icon
      document.getElementById("drop").style.transform = "scaleY(-1)";

      // Controlling the menu
      menu.style.display = "block"
      setTimeout(() => {
        menu.style.transform = "translateY(10px)";
        menu.style.opacity = "1";
      }, 100);
      document.addEventListener("click", this.clickEventFunc);
    } else this.closeCurMenu(menu);
  }
  render() {
    let { categories, category, currencies, setcur } = this.state;
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
            <Drop id="drop"/>
          </div>
          <div id="curmenu" style={{display: "none", opacity: 0}}>
            {currencies.map((cur) => {
              return <div
                className="curopt noselect"
                onClick={() => setcur({label: cur.label, symbol: cur.symbol})}
                key={cur.label}
              >{cur.symbol + " " + cur.label}</div>
            })}
          </div>
          <EmptyCart />
        </div>
      </header>
    )
  }
}
