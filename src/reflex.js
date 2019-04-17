import React from 'react'
import css from './css'
import defaultConfig from './config'
import contextTypes from './context-types'

const reflex = (Component) => {
  const Reflex = ({ reflexProxyRef, ...props }, context) => {
    const config = Object.assign({}, defaultConfig, context.reflexbox)
    const next = css(config)(props)

    return React.createElement(Component, {
      ...next,
      ref: reflexProxyRef,
    })
  }

  Reflex.contextTypes = contextTypes

  const ReflexRefForwarder = React.forwardRef((props, ref) => (<Reflex
    {...props}
    reflexProxyRef={ref}
  />))

  return ReflexRefForwarder
}

export default reflex
