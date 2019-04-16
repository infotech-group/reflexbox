import sheet from './sheet'

const REG = /^([whmp][trblxy]?|minw|maxw|minh|maxh|flex|wrap|column|auto|align|justify|order)$/
const UNIT_REG = /^([-\d]+)([\D]+)$/
const cache = {}

/* Define unique classname prefix to prevent conflicts between different versions of the same package */
const version = (process.env.PACKAGE_VER || 'test')
  .replace(/\./g, '_');
const className = `reflexbox_${version}_`
const unitified = new WeakMap()
/* Convert custom unit to native */
const custom = (value, units) => {
  if (typeof value === `function`) {
    if (!unitified.has(units)) {
      unitified.set(units, new WeakMap())
    }
    if (unitified.get(units).has(value)) {
      return unitified.get(units).get(value)
    }
    const nextFn = (key, n) => {
      const nextN = custom(n, units)
      return value(key, nextN)
    }
    unitified.get(units).set(units, nextFn)
    return nextFn
  }

  const match = UNIT_REG.exec(value)
  if (!match) {
    return value
  }
  const unit = match[2]
  if (!units[unit]) {
    return value
  }
  const numeric = parseFloat(match[1], 10)

  return units[unit](numeric)
}

const css = (config) => (props) => {
  const next = {}
  const classNames = []

  const breaks = [null, ...config.breakpoints]
  const sx = stylers(config)
  const keys = Object.keys(props)

  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const key = keys[keyIndex]
    const val = props[key]
    if (!REG.test(key)) {
      next[key] = val
      continue // eslint-disable-line
    }
    const cx = createRule(breaks, sx)(key, val)
    cx.forEach((cn) => classNames.push(cn))
  }

  next.className = join(next.className, ...classNames)

  return next
}

css.reset = () => {
  Object.keys(cache).forEach((key) => {
    delete cache[key]
  })
  while (sheet.cssRules.length) {
    sheet.deleteRule(0)
  }
}

const createRule = (breaks, sx) => (key, val) => {
  const classNames = []
  const id = `_${className}_${sheet.cssRules.length.toString(36)}`
  const k = key.charAt(0)
  const style = sx[key] || sx[k]

  const rules = toArr(val).map((v, i) => {
    const bp = breaks[i]
    const decs = style(key, v)
    const cn = `${id}_${bp || ``}`
    const body = `.${cn}{${decs}}`
    const rule = media(bp, body)

    const _key = decs + (bp || ``)

    if (cache[_key]) {
      classNames.push(cache[_key])
      return null
    }
    classNames.push(cn)
    cache[_key] = cn
    return rule
  }).filter((r) => r !== null)

  sheet.insert(rules)

  return classNames
}

const toArr = (n) => Array.isArray(n) ? n : [n]
const num = (n) => typeof n === `number` && !Number.isNaN(n)

const join = (...args) => args
  .filter((a) => !!a)
  .join(` `)

const dec = (args) => args.join(`:`)
const rule = (args) => args.join(`;`)
const media = (bp, body) => bp ? `@media screen and (min-width:${bp}em){${body}}` : body

const px = (n) => num(n) ? `${n}px` : n
const width = (key, n) => dec([`width`, !num(n) || n > 1 ? px(n) : `${n * 100}%`])
const height = (key, n) => dec([`height`, !num(n) ? n : px(Math.abs(n))])
const minWidth = (key, n) => dec([`min-width`, !num(n) || n > 1 ? px(n) : `${n * 100}%`])
const maxWidth = (key, n) => dec([`max-width`, !num(n) || n > 1 ? px(n) : `${n * 100}%`])
const minHeight = (key, n) => dec([`min-height`, !num(n) ? n : px(Math.abs(n))])
const maxHeight = (key, n) => dec([`max-height`, !num(n) ? n : px(Math.abs(n))])

const directions = {
  t: [`-top`],
  r: [`-right`],
  b: [`-bottom`],
  l: [`-left`],
  x: [`-left`, `-right`],
  y: [`-top`, `-bottom`],
}

const space = (scale, units) => (key, n) => {
  const [a, b] = key.split(``)
  const prop = a === `m` ? `margin` : `padding`
  const dirs = directions[b] || [``]
  const neg = n < 0 ? -1 : 1
  const val = !num(n) ? custom(n, units) : px((scale[Math.abs(n)] || Math.abs(n)) * neg)
  return rule(dirs.map((d) => dec([prop + d, val])))
}

const flex = (key, n) => dec([`display`, n ? `flex` : `block`])
const wrap = (key, n) => dec([`flex-wrap`, n ? `wrap` : `nowrap`])
const auto = () => dec([`flex`, `1 1 auto`])
const column = (key, n) => dec([`flex-direction`, n ? `column` : `row`])
const align = (key, n) => dec([`align-items`, n])
const justify = (key, n) => dec([`justify-content`, n])
const order = (key, n) => dec([`order`, n])

const stylers = (config) => ({
  w   : custom(width, config.units),
  h   : custom(height, config.units),
  m   : space(config.space, config.units),
  p   : space(config.space, config.units),
  minw: custom(minWidth, config.units),
  maxw: custom(maxWidth, config.units),
  minh: custom(minHeight, config.units),
  maxh: custom(maxHeight, config.units),
  flex,
  wrap,
  auto,
  column,
  align,
  justify,
  order,
})

export default css
