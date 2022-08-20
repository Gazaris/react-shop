import { PureComponent } from 'react';
import '../styles/CartPage.css';

export default class CartPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: this.props.cart,
      currency: this.props.currency
    };
    this.setCart = this.props.setcart.bind(this);
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
                >+</div>
                <span>{item.quantity}</span>
                <div
                  className="cart-btn noselect"
                >-</div>
              </div>
              <div className="preview">
                <img src={item.gallery[0]} alt={item.id} />
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
