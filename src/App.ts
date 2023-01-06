import './styles/App.css'

//Vars

let inputString: string = ''
let previous: string = ''
let next: string = ''
let clickQ: boolean = false
let strictMode = false

interface Obj {
  readonly str?: string,
  readonly selectionStart?: number,
  readonly selectionEnd?: number,
  readonly flag?: (null | string[])
}


//Elements

const input: any = document.querySelector('#result')
const cleanBtn: any = document.querySelector('#clean')
const calcBtn: any = document.querySelector('#calc')
const strictModeInput: any = document.querySelector('#strict_mode_input')


//Functions

function isInt(n: number): boolean{
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n: number): boolean{
  return Number(n) === n && n % 1 !== 0;
}

const findAppropriateBracketIndex = (substr: string, bracketIndex: number = -1): number => {
  let chars = substr.split('')
  let len = chars.length
  let stack = []
  let open = '('
  let close = ')'

  if (bracketIndex === -1) {
    for (let i = len - 1; i !== -1; i--) {
      if (close === chars[i]) {
        stack.push(close)
        continue
      }
  
      if (open === chars[i] && stack.pop() !== close) {
        return -1
      }
  
      if (stack.length === 0) return i
    }
  } else if (substr[0] === open) {
    for (let i = 0; i < len; i++) {
      if (open === chars[i]) {
        stack.push(open)
        continue
      }
  
      if (close === chars[i] && stack.pop() !== open) {
        return -1
      }
  
      if (stack.length === 0) return i + bracketIndex
    }
  } 

  return -1
}

const correct = () => {
  if (!('ontouchstart' in window)) document.body.classList.add('notouch')
}

const setCursor = (flag: (string[] | null | undefined), selectionStart: (number | undefined), selectionEnd: (number | undefined)): void => {
  if (flag && selectionEnd && selectionStart) {
    input.selectionEnd = selectionEnd - 1
    input.selectionStart = selectionStart - 1
  }
}

const fac = (n: number): bigint => {
  if (Number.isInteger(n)) return BigInt(n) ? BigInt(n) * (fac(n-1)) : BigInt(1)
  return BigInt(NaN)
}

const log = (a: number, b: number): number => {
  return Number((Math.log(a) / Math.log(b)).toFixed(15))
}

const rad = (a: number | string) => +(Math.PI / 180 * +a).toFixed(15)

const sin = (a: number | string): number => +Math.sin(rad(a)).toFixed(15)

const cos = (a: number | string): number => +Math.cos(rad(a)).toFixed(15)

const tg = (a: number | string): number => sin(a) / cos(a)

const ctg = (a: number | string): number => cos(a) / sin(a)

function calcAllTrigonometry(str: string): string {
  if (!str.includes('tg') && !str.includes('ctg') && !str.includes('cos')
    && !str.includes('sin')) {
      return str
  }

  const calcFunc = (str: string, func: typeof sin): string => {
    const name = func.name

    if (!str.includes(name)) {
      return str
    }

    let first = str.indexOf(name) + name.length

    if (str[first] === '(') {
      let bracketIndex = findAppropriateBracketIndex(str.slice(first), 
        first)
      let substr0 = str.slice(0, first - name.length)
      let substr = calcAllLog(
        calcAllFac(calcAllTrigonometry(str.slice(first + 1, bracketIndex)))
      );
      let substr1 = str.slice(bracketIndex + 1)

      return calcAllTrigonometry(substr0 + func(eval(substr)) + substr1)
    } else {
      let substr = calcAllTrigonometry(
        str.slice(first).split(/[\+\-\*\/\(_!]/).shift() ?? ''
      );
      let substr0 = str.slice(0, first - name.length)
      let substr1 = str.slice(first + substr.length)

      return calcAllTrigonometry(substr0 + func(eval(substr)) + substr1)
    }
  }

  return calcFunc(calcFunc(calcFunc(calcFunc(str, ctg), tg), cos), sin)
}

function calcAllFac(str: string): string {
  if (str.includes('!')) {
    let first: number = str.indexOf('!')

    if (str[first - 1] === ')') {

      let bracketIndex = findAppropriateBracketIndex(str.slice(0, first))
      let substr0 = str.slice(0, bracketIndex)
      let substr = calcAllLog(str.slice(bracketIndex, first))
      let substr1 = str.slice(first + 1)

      return calcAllFac(substr0 + fac(eval(substr)) + substr1)
    } else {
      
      let substr = str.slice(0, first).split(/[\+\-\*\/\(_]|(log)/).pop() ?? ''
      let substr0 = str.slice(0, first - substr.length)
      let substr1 = str.slice(first + 1)
      
      return calcAllFac(substr0 + fac(eval(substr)) + substr1)
    }
  }

  return str
}

function calcAllLog(str: string): string {
  if (str.includes('log')) {
    let first: number = str.indexOf('_')

    if (str[first + 1] === '(') {

      let bracketIndex = findAppropriateBracketIndex(str.slice(first + 1), first + 1)
      let substr = str.slice(0, first).split('log').pop() ?? ''
      let substr0 = str.slice(0, first - substr.length - 3)
      let substr1 = str.slice(first + 1, bracketIndex + 1)
      let substr2 = str.slice(first + 1 + substr1.length)
      
      substr1 = calcAllLog(substr1)

      return calcAllLog(substr0 + log(eval(substr1), eval(substr)) + substr2)
    } else {
      
      let flag = '_'

      if (str[first + 1] === 'l') flag = ''

      let re = new RegExp(`[\\+\\-\\*\\/\\)${flag}]`)

      let substr = str.slice(0, first).split('log').pop() ?? ''
      let substr0 = str.slice(0, first - substr.length - 3)
      let substr1 = str.slice(first + 1).split(re).shift() ?? ''
      let substr2 = str.slice(first + 1 + substr1.length)

      substr1 = calcAllLog(substr1)

      console.log(substr0, substr, substr1, substr2)

      return calcAllLog(substr0 + log(eval(substr1), eval(substr)) + substr2)
    }
  }
  
  return str
}

const calc = () => {
  try {
    if (!Number(input.value)) previous = input.value
    inputString = input.value.replace(',', '.')
    inputString = calcAllLog(calcAllFac(calcAllTrigonometry(inputString)))
    const ans = eval(inputString)
    input.value = inputString 
      && String(
        isInt(ans) ? BigInt(eval(inputString)) : eval(inputString)
      ).replace('.', ',')
  } catch(e) {
    console.log('calc error')
  }
}

const clean = (str: string, hardMode: boolean): Obj => {

  try {
    let flag = str.slice(input.selectionStart - 1, input.selectionEnd)
    .match(/[^0-9\-\/\*\+()\.\,\!elogsIyfincotg%\_]/g)
    let selectionStart: number = input.selectionStart
    let selectionEnd: number = input.selectionEnd
    let prev = ''

    while (str !== prev) {
      prev = str
      str = str.replace(/[^0-9\-\/\*\+()\.\,\!elogsiIfyncotg%\_]/g, '')

      if (strictMode || hardMode) {
        str = str.replace(/(\*[\+\-\.\,\/\!])/g, '*')
        .replace(/(\*{3})/g, '**')
        .replace(/(\![0-9])|(\!+)/g, '!')
        .replace(/(\+[\*\-\.\,\/\!])|(\++)/g, '+')
        .replace(/(\-[\+\*\.\,\/\!])|(\-+)/g, '-')
        .replace(/(\/[\+\-\.\,\*\!])|(\/+)/g, '/')
        .replace(/(\,[\+\-\.\*\/\!])|(\,+)/g, ',')
        .replace(/(\.[\+\-\*\,\/\!])|(\.+)/g, '.')
        .replace(/e[^0-9]/g, 'e')
        .replace(/\([^\-0-9l\(\)]/g, '(')

        if (!['c', 's', 't', '-', 'l', '(', '0', '1', '2', 
          '3', '4', '5', '6', '7', '8', '9']
          .includes(str[0])) str = str.slice(1)
      }
    }

    let obj: Obj = {str, selectionStart, selectionEnd, flag}

    return obj
  } catch(e) {
    console.log('filter error')
    return {str}
  }
}
const showInputErrors = () => {
  input.setSelectionRange(2, 5)
}


//Handlers

const cleanBtnHandler = (event: any) => {
  let cleanInput: Obj = clean(input.value, true)
  input.value = cleanInput.str
}

const inputHandler = (event: any) => {
  let value: any = event.target.value
  
  let cleanInput: Obj = clean(value, false)
  input.value = cleanInput.str

  setCursor(cleanInput.flag, cleanInput.selectionStart, cleanInput.selectionEnd)
}

const calcBtnHandler = (event: any) => {
  calc()
}

const onkeydownHandler = (event: KeyboardEvent)  => {

  if (event.key === 'Enter') {
    event.preventDefault();
    calc()
  }

  if (event.ctrlKey && ['z', 'Z', 'я', 'Я'].includes(event.key)) {
    event.preventDefault();
    if (input.value !== previous ) {
      next = input.value
      input.value = previous
    }
  }

  if ((event.ctrlKey && event.shiftKey && ['z', 'Z', 'я', 'Я'].includes(event.key)
      || event.ctrlKey && ['y', 'Y', 'н', 'Н'].includes(event.key))) {
    event.preventDefault();
    if (input.value !== next) {
      previous = input.value
      input.value = next
    }
  }

  if (event.key === ' ') {
    event.preventDefault();
    let cleanInput: Obj = clean(input.value, true)

    input.value = cleanInput.str
    setCursor(cleanInput.flag, cleanInput.selectionStart, cleanInput.selectionEnd)
  }

  if (['r', 'R', 'к', 'К'].includes(event.key)) {
    strictModeInput.checked = !strictModeInput.checked
    strictModeInputHandler(null)
  }
  
  // console.log(event.key)
}

const onkeypressHandler = (event: KeyboardEvent) => {
  if (['q', 'Q', 'й', 'Й'].includes(event.key)) {
    event.preventDefault();
    if (clickQ) {
      input.setSelectionRange(input.value.length, input.value.length)
      clickQ = false
    } else {
      showInputErrors()
      clickQ = true
    }
  }

  if (['d', 'D', 'в', 'В'].includes(event.key)) {
    event.preventDefault();
    input.selectionStart += 1
  }

  if (['a', 'A', 'ф', 'Ф'].includes(event.key)) {
    event.preventDefault();
    if (input.selectionEnd > 0) input.selectionEnd -= 1
  }

  // if (['s', 'S', 'ы', 'Ы'].includes(event.key)) {
  //   event.preventDefault();
  //   input.selectionStart += 5
  // }

  // if (['w', 'W', 'ц', 'Ц'].includes(event.key)) {
  //   event.preventDefault();
  //   input.selectionEnd > 5 ? input.selectionEnd -= 5 : input.selectionEnd -= input.selectionEnd
  // }

  // console.log(event.key)
}

const strictModeInputHandler = (event: any) => {
  strictMode = strictModeInput.checked 
  if (strictMode) {
    let cleanInput: Obj = clean(input.value, false)
    input.value = cleanInput.str
  }
}


//Listeners

cleanBtn.addEventListener('click', cleanBtnHandler)
calcBtn.addEventListener('click', calcBtnHandler)
input.addEventListener('input', inputHandler)
document.body.onkeydown = onkeydownHandler
input.onkeypress = onkeypressHandler
strictModeInput.addEventListener('click', strictModeInputHandler)


//Code

correct()

// 2.6525285981219103e+32/(1307674368000*1307674368000)