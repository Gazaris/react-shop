import { createRef, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';
import EmptyCart from '../svg/EmptyCart';
import CartCounter from './CartCounter';

export default class Cart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currency: this.props.currency,
      cart: JSON.parse(localStorage.getItem("cart")) || [],
      cartCount: 0
    };
    this.overlayRef = createRef();
    this.increaseItemQuantity = this.props.addtocart.bind(this);
    this.decreaseItemQuantity = this.props.subtrfromcart.bind(this);
    this.cartClickEvent = this.cartClickEvent.bind(this);
    this.isOverlay = this.isOverlay.bind(this);
    this.closeCartOverlay = this.closeCartOverlay.bind(this);
    this.handleCartClick = this.handleCartClick.bind(this);
  }
  componentDidMount() {
    // Setting initial cart count
    if(this.state.cart.length !== 0) {
      let total = 0;
      for(let item of this.state.cart)
        total += item.quantity;
      this.setState({ cartCount: total });
    }
  }
  cartClickEvent(e) {
    let darkener = this.props.darkenerRef.current;
    if(darkener.style.display === "block") {
      if(!this.isOverlay(e.target) && !this.isSwitch(e.target))
        this.closeCartOverlay();
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
  closeCartOverlay() {
    let darkener = this.props.darkenerRef.current;
    let overlay = this.overlayRef.current;
    darkener.style.opacity = "0";
    overlay.style.transform = "translateY(0)";
    overlay.style.opacity = "0";
    setTimeout(() => {
      darkener.style = {};
      overlay.style = {};
    }, 300);
    this.props.appRef.current.removeEventListener("click", this.cartClickEvent);
  }
  handleCartClick() {
    let darkener = this.props.darkenerRef.current;
    let overlay = this.overlayRef.current;
    if(!darkener.style.display || darkener.style.display === "none") {
      // Showing darkener and overlay
      darkener.style.display = "block";
      overlay.style.display = "flex";
      setTimeout(() => {
        darkener.style.opacity = "1";
        overlay.style.transform = "translateY(10px)";
        overlay.style.opacity = "1";
      }, 100);

      this.props.appRef.current.addEventListener("click", this.cartClickEvent);
    } else this.closeCartOverlay();
  }
  render() {
    let { currency, cartCount, cart } = this.state;
    let totalCost = 0;
    let ic = -1;
    return (<div id="cart">
      <EmptyCart id="cart-icon" onClick={this.handleCartClick}/>
      {cartCount !== 0 && <CartCounter
        ref={this.props.counterRef}
        handleCartClick={this.handleCartClick}
        cartCount={cartCount}
      />}
      <div id="cart-overlay" ref={this.overlayRef}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    this.increaseItemQuantity(item);
                  }}
                >+</div>
                <span>{item.quantity}</span>
                <div
                  className="cart-btn noselect"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.decreaseItemQuantity(item);
                  }}
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
          <Link
            className="cart-btn noselect"
            to="/cart"
            onClick={() => this.closeCartOverlay()}
          >VIEW BAG</Link>
          <div className="cart-btn noselect">CHECK OUT</div>
        </div>
      </div>
    </div>)
  }
}
