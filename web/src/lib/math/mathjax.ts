import { mathjax } from 'mathjax-full/js/mathjax'
import { TeX } from 'mathjax-full/js/input/tex'
import { SVG } from 'mathjax-full/js/output/svg'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html'
import { parse } from 'mathjs'
import { fractionMath } from './math';

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

export function displayAnswerAsTex(answer: string): string {
    // 1. 입력 중인 미완성 상태 처리 (마지막이 /, ^ 거나 부호만 있는 경우)
    const incompleteMarkers = ['/', '^', '-', '+'];
    if (!answer || incompleteMarkers.some(marker => answer.endsWith(marker))) {
        // 미완성 상태일 때는 TeX 변환을 하지 않고 일반 텍스트(또는 간단한 문자열)로 반환
        return answer; 
    }

    // 2. ^ 기호가 포함된 경우 (거듭제곱)
    if (answer.includes('^')) {
        try {
            // parse().toTex()를 통해 지수 형태로 변환 시도
            const node = fractionMath.parse(answer);
            return node.toTex();
        } catch (e) {
            return answer;
        }
    }

    // 3. 분수 형태 처리 (기존 로직)
    if (answer.includes('/')) {
        try {
            const f = fractionMath.simplifyCore(answer);
            let tex = f.toTex();
            
            if (tex.includes('{-')) {
                tex = tex.replace('{-', '{').replace('\\frac', '-\\frac');
            }
            return tex;
        } catch (e) {
            return answer;
        }
    }

    return answer;
}