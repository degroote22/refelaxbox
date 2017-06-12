import React from 'react'
import { Box } from '../src'

const Border = props => (
  <Box
    {...props}
    style={{
      ...props.style,
      boxShadow: 'inset 0 0 0 3px'
    }}
  />
)

export default Border
