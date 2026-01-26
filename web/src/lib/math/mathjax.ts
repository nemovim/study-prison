import { mathjax } from 'mathjax-full/js/mathjax'
import { TeX } from 'mathjax-full/js/input/tex'
import { SVG } from 'mathjax-full/js/output/svg'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html'
import { parse } from 'mathjs'

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)

const mathjax_document = mathjax.document('', {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: 'local' })
})

const mathjax_options = {
  em: 16,
  ex: 8,
  containerWidth: 1280
}

export function getMathjaxSvgByTex(tex: string): string {
  const node = mathjax_document.convert(tex, mathjax_options)
  return adaptor.innerHTML(node)
}

export function getMathjaxSvgByString(math: string): string {
  let tex: string;
  try {
    tex = parse(math).toTex();
  } catch (e) {
    tex = math;
  }
  if (tex === 'undefined') tex = '';

  tex = tex.replaceAll('\\cdot', '\\times');

  const node = mathjax_document.convert(tex, mathjax_options)
  return adaptor.innerHTML(node)
}