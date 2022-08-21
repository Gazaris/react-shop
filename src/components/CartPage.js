import { PureComponent } from 'react';
import '../styles/CartPage.css';
import ArrowWhite from '../svg/ArrowWhite';

export default class CartPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: this.props.cart,
      currency: this.props.currency
    };
    this.setCart = this.props.setcart.bind(this);
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
    this.setCart(newCart);
  }
  decreaseItemQuantity(item) {
    let { newCart, foundItemIndex } = this.findItemInCart(item);
    if(newCart[foundItemIndex].quantity === 1)
      newCart.splice(foundItemIndex, 1);
    else
      newCart[foundItemIndex].quantity -= 1;
    this.setCart(newCart);
  }
  getImg(el) {
    while(!el.classList.contains("preview")) {
      el = el.parentElement;
    }
    return el.children[0];
  }
  prevPreview(e, item) {
    let img = this.getImg(e.target);
    let imgIndex = item.gallery.findIndex(e => e === img.src)
    if(imgIndex === -1) imgIndex = 0;
    else if(imgIndex === 0) imgIndex = item.gallery.length - 1;
    else imgIndex -= 1;
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = item.gallery[imgIndex];
      img.style.opacity = "1";
    }, 300);
  }
  nextPreview(e, item) {
    let img = this.getImg(e.target);
    let imgIndex = item.gallery.findIndex(e => e === img.src)
    if(imgIndex === -1) imgIndex = 0;
    else if(imgIndex === item.gallery.length - 1) imgIndex = 0;
    else imgIndex += 1;
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = item.gallery[imgIndex];
      img.style.opacity = "1";
    }, 300);
  }
  render() {
    let { cart, currency } = this.state;
    let ic = 0;
    let cartCount = 0;
    let totalCost = 0;
    let chosenPrice = {
      currency: {
        label: "",
        symbol: "-"
      },
      amount: 0
    };

    for(let i of cart) {
      cartCount += i.quantity;
    }

    return (<div id="cart-page" className="content">
      <h1>Cart</h1>
      {cartCount === 0 && <div className="empty">
        EMPTY
      </div>}
      {cartCount > 0 && <div className="items">
        {cart.map(item => {
          // Getting the right price of item
          for(let p of item.prices) {
            if(p.currency.label === currency.label)
              chosenPrice = p;
              break;
          }
          totalCost += chosenPrice.amount * item.quantity;
          totalCost = Math.floor(totalCost * 100) / 100;
          // To preload images
          let previews = [];
          for(let i in item.gallery) {
            previews[i] = new Image();
            previews[i].src = item.gallery[i];
          }
          return <div key={item.id + (ic++)} className="cart-item">
            <div className="main">
              <span className="brand">{item.brand}</span>
              <span className="name">{item.name}</span>
              <strong className="cp-price">
                {currency.symbol + chosenPrice.amount}
              </strong>
              <div className="attrs">
                {item.attributes.map(attr => {
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
                  return <div className="cp-attr" key={attr.id}>
                    <strong className="name">{attr.name}:</strong>
                    <div className="cp-items">
                      {attr.type === "swatch" && attr.items.map(item => {
                        return <div 
                          key={item.id}
                          className={
                            "cp-item swatch" + 
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
                            "cp-item text" + 
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
            </div>
            <div className="secondary">
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
              <div className="preview">
                <img className="noselect" src={item.gallery[0]} alt={item.id} />
                {item.gallery.length > 1 && <div className="gallery-scroll">
                  <div className="prev" onClick={(e) => this.prevPreview(e, item)}>
                    <ArrowWhite style={{transform: "scaleX(-1)"}}/>
                  </div>
                  <div className="next" onClick={(e) => this.nextPreview(e, item)}>
                    <ArrowWhite />
                  </div>
                </div>}
              </div>
            </div>
          </div>
        })}
      </div>}
      <div className="total-box">
        <div className="info">
          <div className="headings">
            <span>Tax 21%:</span>
            <span>Quantity:</span>
            <strong>Total:</strong>
          </div>
          <div className="values">
            <strong>{this.state.currency.symbol + (Math.floor(totalCost * 21) / 100)}</strong>
            <strong>{cartCount}</strong>
            <strong>{this.state.currency.symbol + totalCost}</strong>
          </div>
        </div>
        <div className="cart-btn">ORDER</div>
      </div>
    </div>)
  }
}
