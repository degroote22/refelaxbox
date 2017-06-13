import React from 'react'
import css from './css'
import defaultConfig from './config'
import contextTypes from './context-types'
import { createComponent } from 'react-fela'

const reflex = Component => {
  const Reflex = (props, context) => {
    const config = Object.assign({}, defaultConfig, context.reflexbox)
    const { next, fela } = css(config)(props)
    const felaComp = createComponent(() => fela, Component)
    return React.createElement(felaComp, next)
  }

  Reflex.contextTypes = contextTypes

  return Reflex
}

export default reflex
