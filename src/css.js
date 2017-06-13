const REG = /^([wmp][trblxy]?|flex|wrap|column|auto|align|justify|order)$/

const css = config => props => {
  const next = {}
  let fela = {}

  const breaks = [null, ...config.breakpoints]
  const sx = stylers(config)
  for (let key in props) {
    const val = props[key]
    if (!REG.test(key)) {
      next[key] = val
      continue
    }
    const cx = createRule(breaks, sx)(key, val)
    fela = ({ ...fela, ...cx })
  }

  return { next, fela }
}

css.reset = () => {

}

const createRule = (breaks, sx) => (key, val) => {
  const k = key.charAt(0)
  const style = sx[key] || sx[k]

  const rules = toArr(val).map((v, i) => {
    const bp = breaks[i]
    const decs = style(key, v)
    return media(bp, decs)
  }).reduce((sum, n) => ({ ...sum, ...n }), {})

  return rules
}

const toArr = n => Array.isArray(n) ? n : [n]
const num = n => typeof n === 'number' && !isNaN(n)

const join = (...args) => args
  .filter(a => !!a)
  .join(' ')

const dec = args => ({ [args[0]]: args[1] })
const rule = args => args.reduce((sum, n) => ({ ...sum, ...n }), {})
const media = (bp, body) => bp ? { [`@media screen and (min-width:${bp}em)`]: body } : body

const width = (key, n) => dec(['width', !num(n) || n > 1 ? px(n) : (n * 100) + '%'])
const px = n => num(n) ? n + 'px' : n

const space = scale => (key, n) => {
  const [a, b] = key.split('')
  const prop = a === 'm' ? 'margin' : 'padding'
  const dirs = directions[b] || ['']
  const neg = n < 0 ? -1 : 1
  const val = !num(n) ? n : px((scale[Math.abs(n)] || Math.abs(n)) * neg)
  return rule(dirs.map(d => dec([prop + d, val])))
}

const directions = {
  t: ['Top'],
  r: ['Right'],
  b: ['Bottom'],
  l: ['Left'],
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom'],
}

const flex = (key, n) => dec(['display', n ? 'flex' : 'block'])
const wrap = (key, n) => dec(['flexWrap', n ? 'wrap' : 'nowrap'])
const auto = (key, n) => dec(['flex', '1 1 auto'])
const column = (key, n) => dec(['flexDirection', n ? 'column' : 'row'])
const align = (key, n) => dec(['alignItems', n])
const justify = (key, n) => dec(['justifyContent', n])
const order = (key, n) => dec(['order', n])

const stylers = config => ({
  w: width,
  m: space(config.space),
  p: space(config.space),
  flex,
  wrap,
  auto,
  column,
  align,
  justify,
  order
})

export default css
