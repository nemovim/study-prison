let score = 0;
let wrong = 0;
let level = 1;
let now_answer = '';

function addSimilarTerms(_aArr, _xArr) {
    let aArr = [],
        xArr = [];

    for (let i = 0; i < _aArr.length; i++) {
        if (xArr.indexOf(_xArr[i]) === -1) {
            xArr.push(_xArr[i]);
            aArr.push(_aArr[i]);
        } else {
            aArr[xArr.indexOf(_xArr[i])] += _aArr[i];
        }
    }

    return [aArr, xArr];
}

function distributeTerms(aCoef, xCoef, _aArr, _xArr) {
    let aArr = [],
        xArr = [];

    for (let i = 0; i < _aArr.length; i++) {
        if (xCoef === _xArr[i] && xCoef !== '') {
            xArr.push(_xArr[i] + '^2');
        } else {
            xArr.push(xCoef + _xArr[i]);
        }
        aArr.push(aCoef * _aArr[i]);
    }

    return [aArr, xArr];
}

function joinTerms(aArr, xArr, isQuiz = true) {
    let result = '';
    for (let i = 0; i < aArr.length; i++) {
        // if ((isQuiz && aArr[i] >= 0) || (!isQuiz && aArr[i] > 0)) {
        if (aArr[i] > 0) {
            if (aArr[i] === 1 && xArr[i] !== '') {
                if (result === '') {
                    result += xArr[i];
                } else {
                    result += '+' + xArr[i];
                }
            } else {
                if (result === '') {
                    result += aArr[i] + xArr[i];
                } else {
                    result += '+' + aArr[i] + xArr[i];
                }
            }
        } else if (aArr[i] < 0) {
            if (aArr[i] === -1 && xArr[i] !== '') {
                result += '-' + xArr[i];
            } else {
                result += aArr[i] + xArr[i];
            }
        }
    }
    if (result === '') {
        result = '0';
    }
    return result;
}

function splitTerms(exp) {
    const termArr = exp.match(/(?:\+|-)?[0-9]*[a-z]*/g);
    termArr.splice(termArr.length - 1, 1);
    if (!termArr[0].startsWith('-')) {
        termArr[0] = '+' + termArr[0];
    }
    return termArr;
}

function isSameTerm(term1, term2) {
    let [a1, x1] = term1.match(/((?:\+|-)?[0-9]*)([a-z]*)/).splice(1, 2);
    let [a2, x2] = term2.match(/((?:\+|-)?[0-9]*)([a-z]*)/).splice(1, 2);

    if (a1 === a2) {
        const x1Arr = x1.split('');
        const x2Arr = x2.split('');
        x1Arr.sort();
        x2Arr.sort();
        if (JSON.stringify(x1Arr) === JSON.stringify(x2Arr)) {
            return true;
        }
    }
    return false;
}

function isSameExpression(exp1, exp2) {
    console.log(exp1);
    console.log(exp2);
    const termArr1 = splitTerms(exp1);
    const termArr2 = splitTerms(exp2);
    termArr1.sort();
    termArr2.sort();

    console.log(termArr1);
    console.log(termArr2);

    let isEqual = true;
    if (termArr1.length != termArr2.length) {
        isEqual = false;
    } else {
        for (let i = 0; i < termArr1.length; i++) {
            if (!isSameTerm(termArr1[i], termArr2[i])) {
                isEqual = false;
            }
        }
    }
    return isEqual;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const alphabets = ['', 'x', 'y', 'z', 'a'];
function getRandomVar(min, max) {
    return alphabets[getRandomInt(min, max)];
}

function getRandomTerms(cnt, intMin = -9, intMax = 9, varMin = 0, varMax = 2) {
    let aArr = [];
    for (let i = 0; i < cnt; i++) {
        aArr.push(getRandomInt(intMin, intMax));
    }
    let xArr = [];
    for (let i = 0; i < cnt; i++) {
        xArr.push(getRandomVar(varMin, varMax));
    }
    return [aArr, xArr];
}

function make_quiz() {
    let quiz = '';
    let answer = '';

    if (level === 1) {
        let [aArr, xArr] = getRandomTerms(2, -5, 5, 0, 0);

        quiz = joinTerms(aArr, xArr) + '=?';
        answer = joinTerms(...addSimilarTerms(aArr, xArr));
    } else if (level === 2) {
        let [aArr, xArr] = getRandomTerms(2, -30, 15, 0, 0);

        quiz = joinTerms(aArr, xArr) + '=?';
        answer = joinTerms(...addSimilarTerms(aArr, xArr));
    } else if (level === 3) {
        let [aArr, xArr] = getRandomTerms(2, -5, 5, 1, 1);

        quiz = joinTerms(aArr, xArr) + '=?';
        answer = joinTerms(...addSimilarTerms(aArr, xArr));
    } else if (level === 4) {
        let [aArr, xArr] = getRandomTerms(3, -3, 3, 0, 1);

        quiz = joinTerms(aArr, xArr) + '=?';
        answer = joinTerms(...addSimilarTerms(aArr, xArr));
    } else if (level === 5) {
        let [aArr, xArr] = getRandomTerms(2, -6, 4, 0, 2);
        let aCoef = aArr.pop();
        let xCoef = xArr.pop();

        quiz = `${joinTerms([aCoef], [xCoef])}(${joinTerms(aArr, xArr)})=?`;
        answer = joinTerms(
            ...distributeTerms(aCoef, xCoef, ...addSimilarTerms(aArr, xArr))
        );
    } else if (level === 6) {
        let [aArr, xArr] = getRandomTerms(3, -3, 3, 0, 1);
        let aCoef = aArr.pop();
        let xCoef = xArr.pop();

        quiz = `${joinTerms([aCoef], [xCoef])}(${joinTerms(aArr, xArr)})=?`;
        answer = joinTerms(
            ...distributeTerms(aCoef, xCoef, ...addSimilarTerms(aArr, xArr))
        );
    } else if (level === 7) {
        let [aArr, xArr] = getRandomTerms(5, -3, 3, 0, 3);

        quiz = joinTerms(aArr, xArr) + '=?';
        answer = joinTerms(...addSimilarTerms(aArr, xArr));
    } else if (level === 8) {
        let [aArr, xArr] = getRandomTerms(4, -3, 3, 0, 2);
        let aCoef = aArr.pop();
        let xCoef = xArr.pop();

        quiz = `${joinTerms([aCoef], [xCoef])}(${joinTerms(aArr, xArr)})=?`;
        answer = joinTerms(
            ...distributeTerms(aCoef, xCoef, ...addSimilarTerms(aArr, xArr))
        );
    } else if (level === 9) {
        let [aArr1, xArr1] = getRandomTerms(3, -3, 3, 0, 2);
        let [aArr2, xArr2] = getRandomTerms(3, -3, 3, 0, 2);
        let aCoef1 = aArr1.pop();
        let aCoef2 = aArr2.pop();
        let xCoef1 = xArr1.pop();
        let xCoef2 = xArr2.pop();

        if (aCoef2 >= 0) {
            quiz = `${joinTerms([aCoef1], [xCoef1])}(${joinTerms(
                aArr1,
                xArr1
            )})+${joinTerms([aCoef2], [xCoef2])}(${joinTerms(aArr2, xArr2)})=?`;
        } else {
            quiz = `${joinTerms([aCoef1], [xCoef1])}(${joinTerms(
                aArr1,
                xArr1
            )})${joinTerms([aCoef2], [xCoef2])}(${joinTerms(aArr2, xArr2)})=?`;
        }

        [aArr1, xArr1] = distributeTerms(
            aCoef1,
            xCoef1,
            ...addSimilarTerms(aArr1, xArr1)
        );
        [aArr2, xArr2] = distributeTerms(
            aCoef2,
            xCoef2,
            ...addSimilarTerms(aArr2, xArr2)
        );

        let aArr = [...aArr1, ...aArr2];
        let xArr = [...xArr1, ...xArr2];

        answer = joinTerms(...addSimilarTerms(aArr, xArr));
    } else if (level === 10) {
        let [aLeft, xLeft] = getRandomTerms(2, -3, 3, 1, 1);
        let [aRight, xRight] = getRandomTerms(1, -3, 3, 0, 0);

        while (joinTerms(aLeft, xLeft) === '0') {
            [aLeft, xLeft] = getRandomTerms(2, -3, 3, 1, 1);
        }

        quiz = `${joinTerms(aLeft, xLeft)}=${joinTerms(aRight, xRight)}, x=?`;
        let [a, b] = addSimilarTerms(aLeft, xLeft);

        if (aRight === 0) {
            answer = 0;
        } else {
            if (aRight * a < 0) {
                answer = `-${Math.abs(aRight)}/${Math.abs(a)}`;
            } else {
                answer = `${Math.abs(aRight)}/${Math.abs(a)}`;
            }
        }
    }
    return [quiz, answer];
}

const quizH2 = document.getElementById('quiz-h2');

const scoreP = document.getElementById('score-p');
const wrongP = document.getElementById('wrong-p');
const levelP = document.getElementById('level-p');

const answerP = document.getElementById('answer-p');
const answerInput = document.getElementById('answer-input');

function checkLevel() {
    // level = getRandomInt(1, 4);
    level = Math.floor(score / 20) + 1;
    if (level <= 0) {
        level = 1;
    }
}

let checkAnswer = false;
let isWating = false;
function doNext() {
    if (!checkAnswer && !isWating) {
        submitAnswer();
        answerInput.disabled = 'disabled';
        submitBtn.disabled = 'disabled';
        submitBtn.innerText = '다음';
        checkAnswer = true;
        isWating = true;
        setTimeout(() => {
            submitBtn.disabled = '';
            isWating = false;
        }, 1000);
    } else if (!isWating) {
        answerP.innerHTML = '';
        showQuiz();
        answerInput.disabled = '';
        answerInput.focus();
        submitBtn.innerText = '제출';
        checkAnswer = false;
    }
}

function submitAnswer() {
    if (isSameExpression(answerInput.value || '0', now_answer)) {
        answerP.innerHTML = `<span style="color: green">정답: ${now_answer} (+1점)</span>`;
        score += 1;
        scoreP.innerText = '점수: ' + score + '점';
    } else {
        answerP.innerHTML = `<span style="color: red">정답: ${now_answer} (-2점)</span>`;
        score -= 2;
        wrong += 1;
        scoreP.innerText = '점수: ' + score + '점';
    }

    checkLevel();
    refreshUI();
}

function refreshUI() {
    wrongP.innerText = `(${wrong})`;
    scoreP.innerText = '점수: ' + score + '점';
    levelP.innerText = `~${level}단계~`;
}

function showQuiz() {
    let [quiz, answer] = make_quiz();
    quizH2.innerText = quiz;
    now_answer = answer;
    answerInput.value = '';
}

onkeydown = (e) => {
    if (e.key === 'Enter') {
        doNext();
    }
};

const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', () => {
    doNext();
});

checkLevel();
showQuiz();
refreshUI();
