require('browser-env')()
const test = require('ava')
const React = require('react')
const render = require('react-test-renderer').create
const {
  css,
  config,
  ReflexProvider,
  Box,
  Flex
} = require('./src')

const fela = require('fela')
const renderer = fela.createRenderer()
const ReactFela = require('react-fela')
const Provider = ReactFela.Provider

const props = {
  children: 'Hello',
  title: 'Boop',
  w: [1, 1 / 2, 1 / 4],
  m: 2,
  flex: true,
  px: 3
}

const cx = css({ ...config, renderer })

test.afterEach(t => {
  renderer.clear()
})

test('css returns props', t => {
  const a = cx(props)
  t.is(typeof a, 'object')
})

test('css passes props through', t => {
  const a = cx(props)
  t.is(a.children, 'Hello')
  t.is(a.title, 'Boop')
})

test('css strips style props', t => {
  const a = cx(props)
  t.is(a.w, undefined)
  t.is(a.m, undefined)
  t.is(a.flex, undefined)
  t.is(a.px, undefined)
})

test('css adds a className prop', t => {
  const a = cx(props)
  t.is(typeof a.className, 'string')
})

test('css inserts styles to sheet', t => {
  const a = cx({ m: 2 })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('css inserts responsive styles', t => {
  const a = css({ ...config, renderer })({ m: [1, 2] })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('css dedupes repeated styles', t => {
  const a = cx({ p: 2 })
  const b = cx({ p: 2 })
  const rules = renderer.renderToString()
  t.snapshot(rules)
  t.deepEqual(a, b)
})

test('css parses widths', t => {
  const a = cx({ w: 1 })
  const b = cx({ w: 1 / 2 })
  const c = cx({ w: 0 })
  const d = cx({ w: 24 })
  const e = cx({ w: 'auto' })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('css parses margins', t => {
  cx({ m: 1 })
  cx({ m: -2 })
  cx({ m: 24 })
  cx({ m: -24 })
  cx({ m: 'auto' })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('css parses margin directions', t => {
  cx({ m: 1 })
  cx({ mt: 1 })
  cx({ mr: 1 })
  cx({ mb: 1 })
  cx({ ml: 1 })
  cx({ mx: 1 })
  cx({ my: 1 })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('css parses paddings', t => {
  cx({ p: 1 })
  cx({ p: 24 })
  cx({ p: '20%' })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('css parses padding directions', t => {
  cx({ p: 1 })
  cx({ pt: 1 })
  cx({ pr: 1 })
  cx({ pb: 1 })
  cx({ pl: 1 })
  cx({ px: 1 })
  cx({ py: 1 })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('css parses flexbox styles', t => {
  cx({
    flex: true,
    wrap: true,
    column: true,
    auto: true,
    order: 5,
    align: 'center',
    justify: 'space-between'
  })
  const rules = renderer.renderToString()
  t.snapshot(rules)
})

test('snapshot and fela provider', t => {
  const box = render(<Provider renderer={renderer}><Box /></Provider>).toJSON()
  const flex = render(<Provider renderer={renderer}><Flex /></Provider>).toJSON()
  t.snapshot(box)
  t.snapshot(flex)
})

test('react context for reflex and fela provider', t => {
  const ctx = {
    space: [0, 6, 12, 18, 24, 30],
    breakpoints: [32, 48, 64]
  }
  const box = render(
    <Provider renderer={renderer}>
      <ReflexProvider {...ctx}>
        <Box m={1} w={[1, 1 / 2]} />
      </ReflexProvider>
    </Provider>
  ).toJSON()
  t.snapshot(box)
  const rules = renderer.renderToString()
  t.snapshot(rules)
})
