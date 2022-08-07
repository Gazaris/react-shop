import { PureComponent } from 'react'

export default class Drop extends PureComponent {
  render() {
    return (
      <svg
        width={8}
        height={4}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...this.props}
      >
        <path
        d="m1 .5 3 3 3-3"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
      </svg>
    )
  }
}
