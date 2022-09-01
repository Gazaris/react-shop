import { PureComponent } from 'react';
import '../styles/ProductsList.css';
import { client } from '@tilework/opus';
import CircleCartIcon from '../svg/CircleCartIcon';
import { getCategorysProducts } from '../Queries';

export default class ProductsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.match.params.category,
      currency: this.props.currency,
      curError: this.props.error,
      error: false,
      loading: true
    };
    this.addToCart = this.props.addtocart.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.handleProductClick = this.handleProductClick.bind(this);
    this.handleAddToCartClick = this.handleAddToCartClick.bind(this);
  }
  componentDidMount() {
    if(!this.state.curError) {
      this.getProducts();
      return;
    }
    this.setState({
      error: true
    });
  }
  async getProducts() {
    const res = await client.post(getCategorysProducts(this.state.category));
    if(res.category !== null)
      this.setState({ category: res.category, loading: false });
    else {
      window.location.href('/404');
      window.location.reload();
    }
  }
  handleProductClick(product) {
    window.history.pushState( {} , '', '/item/' + product.id );
    window.location.reload();
  }
  handleAddToCartClick(product) {
    // Getting default items for all attributes
    let chosenAttrs = [];
    for(let attr of product.attributes) {
      let a = {
        id: attr.id,
        chosenItemId: attr.items[0].id
      };
      chosenAttrs.push(a);
    }
    let added = {
      id: product.id,
      brand: product.brand,
      name: product.name,
      prices: product.prices,
      attributes: product.attributes,
      chosenAttributes: chosenAttrs,
      gallery: product.gallery,
      quantity: 1
    };
    this.addToCart(added);
  }
  render() {
    const { category, currency, loading, error } = this.state;
    return (
      <div>
        {error && <h1 className="content">Something went wrong...</h1>}
        {(!error && loading) && <h1 className="content">Loading...</h1>}
        {((!error && !loading) && category) && <div className="content">
          <h1>{category.name[0].toUpperCase() + category.name.substring(1)}</h1>
          <div id="products">
            {category.products.map((product) => {
              let price = {
                currency: {
                  label: "",
                  symbol: "-"
                },
                price: "0.0"
              };
              for(let p of product.prices) {
                if(p.currency.label === currency.label) {
                  price = p;
                  break;
                }
              }
              return <div
                onClick={() => this.handleProductClick(product)}
                className={"product " + (!product.inStock ? "out-of-stock" : "available")}
                key={product.id}
              >
                <img src={product.gallery[0]} alt={product.id} />
                <div>
                  <span>{product.brand + " " +product.name}</span>
                  <span className='currency'>{price.currency.symbol + (price.amount || "0")}</span>
                </div>
                <CircleCartIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    this.handleAddToCartClick(product);
                  }}
                  className={"circle-cart"}
                />
                {!product.inStock && <span className="oos noselect">OUT OF STOCK</span>}
              </div>
            })}
          </div>
        </div>}
      </div>
    )
  }
}
