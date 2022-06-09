const buttons = document.querySelectorAll('div.button')
const output = document.querySelector('div.result')
const outputOld = document.querySelector('div.old')
const num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const modifiers = ['^', '/', '*', '-', '+']
let restrict = [true, true, true, true, true]
let value = ''
let leftBracketCount = 0
let lastNumbersCount = 0

let scrolls = document.querySelectorAll('div.sc')
scrolls.forEach( scroll => {
    scroll.addEventListener("wheel", (evt) => {
        console.log(scroll.scrollWidth)
        evt.preventDefault()
        scroll.scrollLeft += evt.deltaY
    })

})

calc = {

    restrictMaker : () => {
        const lastChar = value.charAt(value.length - 1)
        if (num.includes(lastChar)) {restrict = [true, true, false, true, true]}
        if (modifiers.includes(lastChar)) {restrict = [true, false, true, true, false]}
        if (lastChar === '(') {restrict = [true, false, true, true, false]}
        if (lastChar === ')') {restrict = [false, true, false, true, false]}
        if (lastChar === '.') {restrict = [true, false, false, true, false]}
    },

    outUpd: () => {
        output.textContent = value
    },

    adder: (btnC, lnc = 0, lbc = 0, lncCl = false, lbcCl = false) => {
        value = value.concat(btnC)
        lastNumbersCount += lnc
        leftBracketCount += lbc
        if (lncCl === true) {lastNumbersCount = 0}
        if (lbcCl === true) {leftBracketCount = 0}
        calc.outUpd()
    },

    numChar: (num) => value.charAt(value.length - lastNumbersCount + num - 1),

    addNum: (btnC) => {
        if (calc.numChar(1) === '0' && calc.numChar(2) === '.') {
            calc.adder(btnC, 1)
        } else if (calc.numChar(1) !== '0') {
            calc.adder(btnC, 1)
        }
    },

    addModify: (btnC) => calc.adder(btnC, 0, 0 , true),

    addOpBracket: (btnC) => calc.adder(btnC, 0, 1 , true),

    addClBracket: (btnC) => {
        if (leftBracketCount > 0) {
            calc.adder(btnC, 0, -1 , true)
        }
    },

    addDot: (btnC) => {
        let lastNumbers = value.slice(lastNumbersCount * -1 - 1)
        if (!lastNumbers.includes('.')) {
            calc.adder(btnC, 1, 0)
        }
    },

    operations : {

        clr: () => {
            value = ''
            lastNumbersCount = 0
            calc.outUpd()
        },

        clrEntry: () => {
            if (lastNumbersCount > 0) {
                value = value.slice(0, lastNumbersCount * -1 - 1)
                lastNumbersCount = 0
                calc.outUpd()
            }
        },

        root: () => {
            if (value === '') {calc.adder('0',1)}
            value = ['(',value,')^(1/2)'].join('')
            calc.operations.calculate()
            calc.outUpd()
        },

        backspace: () => {
            value = value.slice(0, -1)
            calc.outUpd()
        },

        changeMark : () => {
            const modifierPos = value.length - lastNumbersCount - 1
            const valueArr = [value.slice(0, modifierPos), value.slice(lastNumbersCount * -1)]
            console.log(modifierPos)
            console.log(modifiers.slice(0, 3))
            if (value.charAt(modifierPos) === '+') {
                value = [valueArr[0], '-', valueArr[1]].join('')
            } else if (value.charAt(modifierPos) === '-') {
                value = [valueArr[0], '+', valueArr[1]].join('')
            } else if (!modifiers.slice(0, 3).includes(value.charAt(modifierPos))) {
                value = ['-', valueArr[1]].join('')
            }
            calc.outUpd()
        },

        calculate: () => {
            if (modifiers.includes(value.charAt(0))) {
                value = '0'.concat(value)
            }
            if (modifiers.includes(value.charAt(value.length - 1))) {
                value = value.concat('0')
            }
            while (leftBracketCount !== 0) {
                calc.addClBracket(')')
            }
            outputOld.textContent = value
            const fixPow = value.replaceAll('^', '**')
            const fixStr = Function(`'use strict'; return (${fixPow})`)()
            const result = parseFloat(fixStr.toFixed(2)).toString()
            output.textContent = result
            value = result
            console.log(value !== 0)
            console.log(lastNumbersCount);
            lastNumbersCount = value.length
            console.log(lastNumbersCount);
        }

    }
}

buttons.forEach(btn => {

    btn.addEventListener('click', event => {
        const btnContent = event.target.attributes[1].value
        calc.restrictMaker()
        if (num.includes(btnContent) && restrict[0] ){calc.addNum(btnContent)}
        if (modifiers.includes(btnContent) && restrict[1]) {calc.addModify(btnContent)}
        if (btnContent === '(' && restrict[2]) {calc.addOpBracket((btnContent))}
        if (btnContent === ')' && restrict[3]) {calc.addClBracket((btnContent))}
        if (btnContent === '.' && restrict[4]) {calc.addDot(btnContent)}
        if (btnContent === 'C') {calc.operations.clr()}
        if (btnContent === 'CE') {calc.operations.clrEntry()}
        if (btnContent === 'root') {calc.operations.root()}
        if (btnContent === 'back') {calc.operations.backspace()}
        if (btnContent === 'ch_mark') {calc.operations.changeMark()}
        if (btnContent === '=') {calc.operations.calculate()}
        scrolls.forEach(scroll => {
            scroll.scrollLeft = scroll.scrollWidth
        })
    })
})
