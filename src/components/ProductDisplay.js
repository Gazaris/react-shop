import { client, Query, Field } from '@tilework/opus';
import { PureComponent } from 'react';
import '../styles/ProductDisplay.css';

export default class ProductDisplay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      product: this.props.match.params.id,
      currency: this.props.currency,
      loading: true,
      error: false,
      chosenAttrs: [],
      cart: this.props.cart
    };
    this.setCart = this.props.setcart.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.handleAttr = this.handleAttr.bind(this);
    this.handleSmallPreview = this.handleSmallPreview.bind(this);
  }
  componentDidMount() {
    if(this.state.product) {
      this.getProduct();
    } else {
      this.setState({ error: true });
    }
  }
  async getProduct() {
    const res = await client.post(
      new Query('product', false)
      .addArgument('id', 'String!', this.state.product)
      .addField('id')
      .addField('gallery')
      .addField('brand')
      .addField('name')
      .addField(new Field('attributes', true)
        .addField('id')
        .addField('name')
        .addField('type')
        .addField(new Field('items')
          .addField('displayValue')
          .addField('value')
          .addField('id')
        )
      )
      .addField(new Field('prices', false)
        .addField(new Field('currency')
          .addField('label')
          .addField('symbol')
        )
        .addField('amount')
      )
      .addField('inStock')
      .addField('description')
    );
    if(res.product !== null){
      let defaultAttrs = [];
      for(let attr of res.product.attributes) {
        let at = {
          id: attr.id,
          chosenItemId: attr.items[0].id
        };
        defaultAttrs.push(at);
      }
      this.setState({
        product: res.product,
        loading: false,
        chosenAttrs: defaultAttrs
      });
    }
    else {
      window.history.replaceState( {} , '', '/404' );
      window.location.reload();
    }
  }
  handleAttr(e, item, attr) {
    let activated = e.target;
    while(!activated.classList.contains("item")) {
      activated = activated.parentElement;
    }
    activated.parentElement
      .getElementsByClassName("chosen")[0]
      .classList.remove("chosen");
    activated.classList.add("chosen");

    let attrIndex = this.state.chosenAttrs.findIndex(i => i.id === attr.id);
    let newChosenAttrs = [...this.state.chosenAttrs];
    newChosenAttrs[attrIndex] = {
      id: attr.id,
      chosenItemId: item.id
    };
    this.setState({ chosenAttrs: newChosenAttrs });
  }
  handleSmallPreview(e) {
    document
      .getElementById("small-preview")
      .getElementsByClassName("chosen")[0]
      .classList.remove("chosen");
    e.target.classList.add("chosen");
    let big = document.getElementById("big-preview");
    big.style.opacity = "0";
    setTimeout(() => {
      big.src = e.target.src;
      big.style.opacity = "1";
    }, 200);
  }
  addToCart() {
    let newCart = [...this.state.cart];
    let foundItemIndex = newCart.findIndex(e => {
      let rightOne = true && e.id === this.state.product.id;
      if(!rightOne) return rightOne;
      for(let a in this.state.chosenAttrs) {
        rightOne &&= (this.state.chosenAttrs[a].chosenItemId === e.chosenAttributes[a].chosenItemId);
        if(!rightOne) return rightOne;
      }
      return rightOne;
    });
    if(foundItemIndex === -1) {
      let newItem = {
        id: this.state.product.id,
        brand: this.state.product.brand,
        name: this.state.product.name,
        prices: this.state.product.prices,
        attributes: this.state.product.attributes,
        chosenAttributes: this.state.chosenAttrs,
        gallery: this.state.product.gallery,
        quantity: 1
      };
      newCart.push(newItem);
      this.setCart(newCart);
    } else {
      newCart[foundItemIndex].quantity += 1;
      this.setCart(newCart);
    }
  }
  render() {
    let { product, currency, loading, error } = this.state;
    let c = 0; // Map counter
    let cl = ""; // Added class
    let price = {
      currency: {
        label: "",
        symbol: "-"
      },
      price: "0.0"
    };
    if(typeof product !== "string"){
      for(let p of product.prices) {
        if(p.currency.label === currency.label) {
          price = p;
          break;
        }
      }
    }
    return (<div>
      {error && <h1 className="content item-content">Something went wrong...</h1>}
      {(!error && loading) && <h1 className="content item-content">Loading...</h1>}
      {((!error && !loading) && product) && <div className="content item-content">
        <div id="small-preview">
          {product.gallery.map((pic) => {
            if(c === 0) cl = "chosen";
            else cl = "";
            return <img
              key={c++}
              src={pic}
              alt={product.id}
              className={cl}
              onClick={this.handleSmallPreview}
            />
          })}
        </div>
        <img id="big-preview" src={product.gallery[0]} alt={product.id} />
        <div id="main-info">
          <h1 className="brand">{product.brand}</h1>
          <h1 className="name">{product.name}</h1>
          <div className="attributes">
            {product.attributes.map((attr) => {
              c = 0;
              return <div className="attr" key={attr.id}>
                <p className="heading">{attr.name.toUpperCase()}:</p>
                <div className="items">
                  {(attr.type === "swatch") && attr.items.map((item) => {
                    if(c === 0) cl = " chosen";
                    else cl = "";
                    c++;
                    return <div
                      key={item.id}
                      className={"item swatch" + cl}
                      onClick={(e) => this.handleAttr(e, item, attr)}
                    >
                      <div style={{ backgroundColor: item.value }}/>
                    </div>
                  })}
                  {(attr.type === "text") && attr.items.map((item) => {
                    if(c === 0) cl = " chosen";
                    else cl = "";
                    c++;
                    return <div
                      key={item.id}
                      className={"item text" + cl}
                      onClick={(e) => this.handleAttr(e, item, attr)}
                    >
                      <p className="noselect">{item.value}</p>
                    </div>
                  })}
                </div>
              </div>
            })}
          </div>
          <div className="price attr">
            <p className="heading">PRICE:</p>
            <p className="amount">{price.currency.symbol + price.amount}</p>
          </div>
          {product.inStock && 
            <div
              className="add-to-cart noselect"
              onClick={this.addToCart}
            >
              ADD TO CART
            </div>
          }
          {!product.inStock && 
            <div className="add-to-cart noselect disabled">
              NOT IN STOCK
            </div>
          }
          <div id="product-description" dangerouslySetInnerHTML={{__html: product.description}}/>
        </div>
      </div>}
    </div>)
  }
}
