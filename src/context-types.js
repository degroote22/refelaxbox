import { shape, arrayOf, number, object } from 'prop-types'

const contextTypes = {
  reflexbox: shape({
    breakpoints: arrayOf(number),
    space: arrayOf(number)
  }),
  renderer: object,
}

export default contextTypes
