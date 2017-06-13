import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { Provider } from 'react-fela'
import { createRenderer } from 'fela'
const renderer = createRenderer()

console.log('hello')
render(<Provider renderer={renderer}><App /></Provider>, app)
