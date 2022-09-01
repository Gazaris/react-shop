import React, { PureComponent } from 'react'

export default class CartCounter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.cartCount
    }
  }
  setCount(i) {
    this.setState({ count: i });
  }
  render() {
    let { count } = this.state;
    return (
      <div
        id="cart-counter"
        className="noselect"
        onClick={this.props.handleCartClick}
      >{ count }</div>
    )
  }
}
