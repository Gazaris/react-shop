import { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';
import EmptyCart from '../svg/EmptyCart';

export default class Cart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: this.props.currency,
      cart: this.props.cart,
      cartCount: 0
    };
    this.setCart = this.props.setcart.bind(this);
    this.getCartCount = this.getCartCount.bind(this);
    this.cartClickEvent = this.cartClickEvent.bind(this);
    this.isOverlay = this.isOverlay.bind(this);
    this.closeCartOverlay = this.closeCartOverlay.bind(this);
    this.handleCartClick = this.handleCartClick.bind(this);
  }
  componentDidMount() {
    this.getCartCount();
  }
  getCartCount() {
    if(this.state.cart.length !== 0) {
      let total = 0;
      for(let item of this.state.cart) {
        total += item.quantity;
      }
      this.setState({ cartCount: total });
    }
  }
  cartClickEvent(e) {
    let darkener = document.getElementById("cart-darkener");
    let overlay = document.getElementById("cart-overlay");
    if(darkener.style.display === "block") {
      if(!this.isOverlay(e.target) && !this.isSwitch(e.target))
        this.closeCartOverlay(darkener, overlay);
    }
  }
  isSwitch(el) {
    if(el.id === "cart") return true;
    else if(el.tagName === "BODY") return false;
    else return this.isSwitch(el.parentElement);
  }
  isOverlay(el) {
    if(el.id === "cart-overlay") return true;
    else if(el.tagName === "BODY") return false;
    else return this.isOverlay(el.parentElement);
  }
  closeCartOverlay(darkener, overlay) {
    darkener.style.opacity = "0";
    overlay.style.transform = "translateY(0)";
    overlay.style.opacity = "0";
    setTimeout(() => {
      darkener.style.display = "none";
      overlay.style.display = "none";
    }, 300);
    document.removeEventListener("click", this.cartClickEvent);
  }
  handleCartClick() {
    let darkener = document.getElementById("cart-darkener");
    let overlay = document.getElementById("cart-overlay");
    if(darkener.style.display === "none") {
      // Showing darkener and overlay
      darkener.style.display = "block";
      overlay.style.display = "flex";
      setTimeout(() => {
        darkener.style.opacity = "1";
        overlay.style.transform = "translateY(10px)";
        overlay.style.opacity = "1";
      }, 100);

      document.addEventListener("click", this.cartClickEvent);
    } else this.closeCartOverlay(darkener, overlay);
  }
  findItemInCart(item) {
    let newCart = [...this.state.cart];
    let foundItemIndex = newCart.findIndex(e => {
      let rightOne = true && e.id === item.id;
      if(!rightOne) return rightOne;
      for(let attr of item.chosenAttributes) {
        rightOne &&= attr;
        if(!rightOne) return rightOne;
      }
      return rightOne;
    });
    return { newCart, foundItemIndex };
  }
  increaseItemQuantity(item) {
    let { newCart, foundItemIndex } = this.findItemInCart(item);
    newCart[foundItemIndex].quantity += 1;
    // tempfix
    this.closeCartOverlay(
      document.getElementById("cart-darkener"),
      document.getElementById("cart-overlay")
    );
    setTimeout(() => this.setCart(newCart), 300);
  }
  decreaseItemQuantity(item) {
    let { newCart, foundItemIndex } = this.findItemInCart(item);
    if(newCart[foundItemIndex].quantity === 1)
      newCart.splice(foundItemIndex, 1);
    else
      newCart[foundItemIndex].quantity -= 1;
    // tempfix
    this.closeCartOverlay(
      document.getElementById("cart-darkener"),
      document.getElementById("cart-overlay")
    );
    setTimeout(() => this.setCart(newCart), 300);
  }
  render() {
    let { currency, cartCount, cart } = this.state;
    let totalCost = 0;
    let ic = -1;
    return (<div id="cart">
      <EmptyCart id="cart-icon" onClick={this.handleCartClick}/>
      {cartCount !== 0 && <div
        id="cart-counter"
        className="noselect"
        onClick={this.handleCartClick}
      >{ cartCount }</div>}
      <div id="cart-overlay" style={{display: "none", opacity: 0}}>
        <span className="heading">
          <strong>My Bag</strong>, {cartCount} items
        </span>
        {cartCount !== 0 && <div className="items">
          {cart.map(item => {
            let chosenPrice = {
              currency: {
                label: "",
                symbol: "-"
              },
              amount: "0.0"
            };
            for(let price of item.prices) {
              if(price.currency.label === currency.label)
                chosenPrice = price;
            }
            totalCost += chosenPrice.amount * item.quantity;
            totalCost = Math.floor(totalCost * 100) / 100;
            return <div key={item.id + (++ic)} className="cart-item">
              <div className="main-info">
                <span>{item.brand}</span>
                <span>{item.name}</span>
                <strong>
                  {chosenPrice.currency.symbol + chosenPrice.amount}
                </strong>
                {item.attributes.map(attr => {
                  // Since I can't directly reference an object
                  // with certain field value
                  let chosen = {
                    id: "",
                    chosenItemId: ""
                  };
                  for(let a of item.chosenAttributes) {
                    if(a.id === attr.id) {
                      chosen = { ...a };
                      break;
                    }
                  }
                  return <div className="c-attr" key={attr.id}>
                    <strong className="name">{attr.name}:</strong>
                    <div className="c-items">
                      {attr.type === "swatch" && attr.items.map(item => {
                        return <div 
                          key={item.id}
                          className={
                            "c-item swatch" + 
                            (item.id === chosen.chosenItemId ? " chosen" : "")
                          }
                        >
                          <div style={{ backgroundColor: item.value }}/>
                        </div>
                      })}
                      {attr.type === "text" && attr.items.map(item => {
                        return <div
                          key={item.id}
                          className={
                            "c-item text" + 
                            (item.id === chosen.chosenItemId ? " chosen" : "")
                          }
                        >
                          <span className="noselect">{item.value}</span>
                        </div>
                      })}
                    </div>
                  </div>
                })}
              </div>
              <div className="quantity">
                <div
                  className="cart-btn noselect" 
                  onClick={() => this.increaseItemQuantity(item)}
                >+</div>
                <span>{item.quantity}</span>
                <div
                  className="cart-btn noselect"
                  onClick={() => this.decreaseItemQuantity(item)}
                >-</div>
              </div>
              <img className="preview" src={item.gallery[0]} alt={item.id} />
            </div>
          })}
        </div>}
        {cartCount === 0 && <span className="empty">EMPTY</span>}
        <div className="total-cost">
          <strong>Total</strong>
          <strong>{this.state.currency.symbol + totalCost}</strong>
        </div>
        <div className="btns">
          <Link className="cart-btn noselect" to="/cart">VIEW BAG</Link>
          <div className="cart-btn noselect">CHECK OUT</div>
        </div>
      </div>
    </div>)
  }
}
