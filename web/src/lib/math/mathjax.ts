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
  const trimmedMath = math.trim();

  // 1. 순수 숫자(소수점 포함)인지 확인하는 정규식
  // 시작과 끝이 숫자로 구성되어 있고, 소수점이 있거나 없는 경우
  const isPureNumber = /^-?\d*\.?\d+$/.test(trimmedMath);

  try {
    if (isPureNumber) {
      // 순수 숫자라면 parse를 거치지 않고 그대로 사용
      // (이미 지수 표기가 제거된 상태라면 더더욱 안전합니다)
      tex = trimmedMath;
    } else {
      tex = parse(trimmedMath).toTex();
    }
  } catch (e) {
    tex = trimmedMath;
  }

  if (tex === 'undefined') tex = '';

  // 곱셈 기호 표준화
  tex = tex.replaceAll('\\cdot', '\\times');

  const node = mathjax_document.convert(tex, mathjax_options);
  return adaptor.innerHTML(node);
}

export function displayAnswerAsTex(answer: string): string {

    // 1. 입력 중인 미완성 상태 처리
    const incompleteMarkers = ['/', '^', '-', '+'];
    if (!answer || incompleteMarkers.some(marker => answer.endsWith(marker))) {
        return answer; 
    }

    // 2. ^ 기호가 포함된 경우 (거듭제곱)
    if (answer.includes('^')) {
        try {
            const node = fractionMath.parse(answer);
            return node.toTex();
        } catch (e) {
            return answer;
        }
    }

    // 3. 분수 형태 처리
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