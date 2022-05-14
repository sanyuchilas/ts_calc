//Vars

let inputString: string = ''
let previous: string = ''
let next: string = ''
let clickQ: boolean = false


//Elements

const input: any = document.querySelector('#result')
const cleanBtn: any = document.querySelector('#clean')
const calcBtn: any = document.querySelector('#calc')


//Functions

const fac = (n: number): number => {
  if (Number.isInteger(n)) return n ? n * (fac(n-1)) : 1
  return NaN
}
const calcAllFac = (str: string): string => {
  let newArr: (string | undefined)[] = []

  if (inputString.includes('!')) {
    let arr: string[] = inputString.split('!')
    newArr = arr.map((el, i) => {
      if (arr.length - 1 !== i) {
        let facNum: number = Number(el.replace(/[\-\*\/]/g, '+').split('+').pop())
        return el.slice(0, -1 * (String(facNum).length)) + String(fac(facNum))
      } else {
        if (el) return el
      }
    })

    return newArr.join('')
  }

  return str
}
const calc = () => {
  try {
    if (!Number(input.value)) previous = input.value
    inputString = input.value.replace(',', '.')
    inputString = calcAllFac(inputString)
    input.value = String(eval(inputString || '0')).split('.').join()
  } catch(e) {
    console.log('calc error')
  }
}
const clean = (str: string): string => {
  try {
    str = str.replace(/[^0-9\-\/\*\+()\.\,\!e]/g, '')
    .replace(/(\*[\+\-\.\,\/\!])|(\*+)/g, '*')
    .replace(/(\![0-9e])|(\!+)/g, '!')
    .replace(/(\+[\*\-\.\,\/\!])|(\++)/g, '+')
    .replace(/(\-[\+\*\.\,\/\!])|(\-+)/g, '-')
    .replace(/(\/[\+\-\.\,\*\!])|(\/+)/g, '/')
    .replace(/(\,[\+\-\.\*\/\!])|(\,+)/g, ',')
    .replace(/(\.[\+\-\*\,\/\!])|(\.+)/g, '.')

    return str
  } catch(e) {
    console.log('filter error')
    return str
  }
}
const showInputErrors = () => {
  input.setSelectionRange(2, 5)
}


//Handlers

const cleanBtnHandler = (event: any) => {
  input.value = clean(input.value)
}
const inputHandler = (event: any) => {
  let value: any = event.target.value

  if (['+', '/', '*', '!', '.', ','].includes(value[0])) value = value.slice(1)

  input.value = clean(value)
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
    input.value = clean(input.value)
  }
  
  console.log(event.key)
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
    event.preventDefault();1
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
}

//Listeners

cleanBtn.addEventListener('click', cleanBtnHandler)
calcBtn.addEventListener('click', calcBtnHandler)
input.addEventListener('input', inputHandler)
document.body.onkeydown = onkeydownHandler
input.onkeypress = onkeypressHandler