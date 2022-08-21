import { PureComponent } from 'react';

export default class ArrowWhite extends PureComponent {
  render() {
    return (
      <svg
        width={8}
        height={14}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...this.props}
      >
        <path
          d="m.75 1.069 5.625 5.619L.75 12.307"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
}
