import { PureComponent } from 'react';
import '../styles/ProductsList.css';
import { Query, Field, client } from '@tilework/opus';
import CircleCartIcon from '../svg/CircleCartIcon';

export default class ProductsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: this.props.cart,
      category: this.props.match.params.category,
      currency: this.props.currency,
      curError: this.props.error,
      error: false,
      loading: true
    };
    this.setCart = this.props.setcart.bind(this);
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
    const res = await client.post(
      new Query('category', true)
      .addArgument('input', 'CategoryInput', {
        title: this.state.category
      })
      .addField('name')
      .addField(new Field('products', true)
        .addField('id')
        .addField('gallery')
        .addField('brand')
        .addField('name')
        .addField(new Field('prices', false)
          .addField(new Field('currency')
            .addField('label')
            .addField('symbol')
          )
          .addField('amount')
        )
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
        .addField('inStock')
      )
    );
    if(res.category !== null)
      this.setState({ category: res.category, loading: false });
    else {
      window.location.href('/404');
      window.location.reload();
    }
  }
  handleProductClick(e, product) {
    // Checking if clicked on add-cart button or on the product card
    let clicked = e.target;
    while(!clicked.classList.contains("circle-cart")) {
      if(clicked.classList.contains("product")) {
        window.history.pushState( {} , '', '/item/' + product.id );
        window.location.reload();
        return;
      }
      clicked = clicked.parentElement;
    }
  }
  handleAddToCartClick(product) {
    // Getting default items for all attributes
    let chosenAttrs = [];
    for(let attr of product.attributes) {
      let at = {
        id: attr.id,
        chosenItemId: attr.items[0].id
      };
      chosenAttrs.push(at);
    }

    // Creating new cart item
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
    let newCart = [ ...this.state.cart ];

    // Getting the item from cart if exists
    let found = this.state.cart.find(e => e.id === added.id);
    if(found) {
      let identical = true;
      for(let attr of found.chosenAttributes) {
        // Finding the same attribute in the found cart item
        let fa = found.chosenAttributes.find(e => e.id === attr.id);
        if(attr.chosenItemId !== fa.chosenItemId) {
          identical = false;
          break;
        }
      }
      if(identical) {
        newCart = newCart.map(item => {
          if(item.id === product.id)
            return { ...item, quantity: item.quantity + 1};
          return item;
        });
        this.setCart(newCart);
        return;
      }
    }

    // Adding to the cart if item(s) wasn't found
    // or the attributes didn't match
    newCart.push(added);
    this.setCart(newCart);
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
                onClick={(e) => this.handleProductClick(e, product)}
                className={"product " + (!product.inStock ? "out-of-stock" : "available")}
                key={product.id}
              >
                <img src={product.gallery[0]} alt={product.id} />
                <div>
                  <span>{product.brand + " " +product.name}</span>
                  <span className='currency'>{price.currency.symbol + (price.amount || "0")}</span>
                </div>
                <CircleCartIcon onClick={() => this.handleAddToCartClick(product)} className={"circle-cart"}/>
                {!product.inStock && <span className="oos noselect">OUT OF STOCK</span>}
              </div>
            })}
          </div>
        </div>}
      </div>
    )
  }
}
