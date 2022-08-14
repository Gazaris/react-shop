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
      error: false
    }
    this.getProduct = this.getProduct.bind(this);
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
    if(res.product !== null)
      this.setState({ product: res.product, loading: false })
    else {
      window.history.replaceState( {} , '', '/404' );
      window.location.reload();
    }
  }
  handleAttr(e) {
    let activated = e.target;
    while(!activated.classList.contains("item")) {
      activated = activated.parentElement;
    }
    activated.parentElement
      .getElementsByClassName("chosen")[0]
      .classList.remove("chosen");
    activated.classList.add("chosen");
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
      {error && <h1 className="content">Something went wrong...</h1>}
      {(!error && loading) && <h1 className="content">Loading...</h1>}
      {((!error && !loading) && product) && <div className="content">
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
                      onClick={this.handleAttr}
                    >
                      <div style={{
                        width: "calc(100% - 2px)",
                        height: "calc(100% - 2px)",
                        backgroundColor: item.value
                      }}/>
                    </div>
                  })}
                  {(attr.type === "text") && attr.items.map((item) => {
                    if(c === 0) cl = " chosen";
                    else cl = "";
                    c++;
                    return <div
                      key={item.id}
                      className={"item text" + cl}
                      onClick={this.handleAttr}
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
          <div className={"add-to-cart noselect" + (!product.inStock ? " disabled" : "")}>
            {product.inStock ? "ADD TO CART" : "NOT IN STOCK"}
          </div>
          <div id="product-description" dangerouslySetInnerHTML={{__html: product.description}}/>
        </div>
      </div>}
    </div>)
  }
}
