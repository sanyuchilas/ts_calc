//Vars

let inputString: string = ''
let previous: string = ''
let next: string = ''
let clickQ: boolean = false
let strictMode = true

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

const setCursor = (flag: (string[] | null | undefined), selectionStart: (number | undefined), selectionEnd: (number | undefined)): void => {
  if (flag && selectionEnd && selectionStart) {
    input.selectionEnd = selectionEnd - 1
    input.selectionStart = selectionStart - 1
  }
}

const fac = (n: number): number => {
  if (Number.isInteger(n)) return n ? n * (fac(n-1)) : 1
  return NaN
}

const log = (a: number, b: number): number => {
  return Number((Math.log(a) / Math.log(b)).toFixed(15))
}

const calcAllFac = (str: string): string => {
  if (str.includes('!')) {
    let newArr: (string | undefined)[] = []
    let arr: string[] = str.split('!')
    
    newArr = arr.map((el, i) => {
      if (arr.length - 1 !== i) {
        let facNum: number = Number(el.replace(/[\-\*\/\(\_log]/g, '+').split('+').pop())
        return el.slice(0, -1 * (String(facNum).length)) + String(fac(facNum))
      } else {
        if (el) return el
      }
    })

    return newArr.join('')
  }

  return str
}

const calcAllBracket = (str: string): string => {
  if (str.includes('(') && str.includes(')!')) {
    let last = str.indexOf(')!')
    let first = str.slice(0, last).lastIndexOf('(')

    let substr0 = str.slice(0, first)
    let substr = str.slice(first + 1, last)
    let substr1 = str.slice(last + 2)
    console.log(substr0 + fac(eval(substr)) + substr1)
    return calcAllBracket(substr0 + fac(eval(substr)) + substr1)
  }

  return str
}

const calcAllLog = (str: string): string => {
  if (str.includes('log') && str.includes('_')) {
    let last = str.indexOf('_')
    let first = str.slice(0, last).lastIndexOf('log')

    let substr0 = str.slice(0, first)
    let substr = str.slice(first + 3, last)
    let substr1 = str.slice(last + 1)
    if (substr1.includes('log') && substr1.includes('_')) substr1 = calcAllLog(substr1)
    let flag = substr1[0] === '('
    let substr2 = flag ? substr1.split(')') : substr1.split(/[\+\-\/\*]|(\*\*)/)
  
    return calcAllLog(substr0 + log(eval(substr2[0].replace('(', '')), eval(substr)) + substr1.slice(flag ? substr2[0].length + 1 : substr2[0].length))
  }
  
  return str
}

const calc = () => {
  try {
    if (!Number(input.value)) previous = input.value
    inputString = input.value.replace(',', '.')
    inputString = calcAllLog(calcAllFac(calcAllBracket(inputString)))
    input.value = inputString && String(eval(inputString)).replace('.', ',')
  } catch(e) {
    console.log('calc error')
  }
}

const clean = (str: string, hardMode: boolean): {} => {
  try {
    let flag = str.slice(input.selectionStart - 1, input.selectionEnd)
    .match(/[^0-9\-\/\*\+()\.\,\!elog\_]/g)
    let selectionStart: number = input.selectionStart
    let selectionEnd: number = input.selectionEnd 

    str = str.replace(/[^0-9\-\/\*\+()\.\,\!elog\_]/g, '')

    if (strictMode || hardMode) {
      str = str.replace(/(\*[\+\-\.\,\/\!])/g, '*')
      .replace(/(\*{3})/g, '**')
      .replace(/(\![0-9e])|(\!+)/g, '!')
      .replace(/(\+[\*\-\.\,\/\!])|(\++)/g, '+')
      .replace(/(\-[\+\*\.\,\/\!])|(\-+)/g, '-')
      .replace(/(\/[\+\-\.\,\*\!])|(\/+)/g, '/')
      .replace(/(\,[\+\-\.\*\/\!])|(\,+)/g, ',')
      .replace(/(\.[\+\-\*\,\/\!])|(\.+)/g, '.')
      .replace(/e[^\+]/g, 'e')
      .replace(/\([^\-0-9l\(\)]/g, '(')

      if (!['-', 'l', '(', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(str[0])) str = str.slice(1)
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

  if (['s', 'S', 'ы', 'Ы'].includes(event.key)) {
    event.preventDefault();
    input.selectionStart += 5
  }

  if (['w', 'W', 'ц', 'Ц'].includes(event.key)) {
    event.preventDefault();
    input.selectionEnd > 5 ? input.selectionEnd -= 5 : input.selectionEnd -= input.selectionEnd
  }

  if (['r', 'R', 'к', 'К'].includes(event.key)) {
    strictModeInput.checked = !strictModeInput.checked
    strictModeInputHandler(null)
  }
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