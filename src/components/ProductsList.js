import { PureComponent } from 'react';
import '../styles/ProductsList.css';
import { Query, Field, client } from '@tilework/opus';
import CircleCartIcon from '../svg/CircleCartIcon';

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
    this.getProducts = this.getProducts.bind(this);
  }
  componentDidMount() {
    if(!this.state.curError) {
      if(this.state.category) {
        this.getProducts();
        return;
      }
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
        .addField('name')
        .addField('inStock')
        .addField('gallery')
        .addField(new Field('prices', false)
          .addField(new Field('currency')
            .addField('label')
            .addField('symbol')
          )
          .addField('amount')
        )
        .addField('brand')
      )
    );
    if(res.category !== null)
      this.setState({ category: res.category, loading: false });
    else {
      window.history.replaceState( {} , '', '/404' );
      window.location.reload();
    }
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
                onClick={() => {
                  window.history.pushState( {} , '', '/item/' + product.id );
                  window.location.reload();
                }}
                className={"product " + (!product.inStock ? "out-of-stock" : "available")}
                key={product.id}
              >
                <img src={product.gallery[0]} alt={product.id} />
                <div>
                  <span>{product.brand + " " +product.name}</span>
                  <span className='currency'>{price.currency.symbol + (price.amount || "0")}</span>
                </div>
                <CircleCartIcon className={"circle-cart"}/>
                {!product.inStock && <span className="oos noselect">OUT OF STOCK</span>}
              </div>
            })}
          </div>
        </div>}
      </div>
    )
  }
}
