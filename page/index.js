import { getText } from '@zos/i18n'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import * as hmUI from '@zos/ui'
import DisplayModes from './DisplayModes.js'
import Functions from './Functions.js'
import Stack from './stack.js'

keyboard = [ 
    Key(Coords(0, 0), KeyFunc("1",   Functions.ONE),      KeyFunc("y^x",   Functions.Y_TO_X),     KeyFunc("sin", Functions.SIN)),
    Key(Coords(1, 0), KeyFunc("2",   Functions.TWO),      KeyFunc("10^x",  Functions.TEN_TO_X),   KeyFunc("cos", Functions.COS)),
    Key(Coords(2, 0), KeyFunc("3",   Functions.THREE),    KeyFunc("e^x",   Functions.E_TO_X),     KeyFunc("tan", Functions.TAN)),
    Key(Coords(0, 1), KeyFunc("4",   Functions.FOUR),     KeyFunc("log x", Functions.LOG_X_OF_Y), KeyFunc("asin", Functions.ASIN)),
    Key(Coords(1, 1), KeyFunc("5",   Functions.FIVE),     KeyFunc("log",   Functions.LOG),        KeyFunc("acos", Functions.ACOS)),
    Key(Coords(2, 1), KeyFunc("6",   Functions.SIX),      KeyFunc("ln",    Functions.LN),         KeyFunc("atan", Functions.ATAN)),
    Key(Coords(0, 2), KeyFunc("7",   Functions.SEVEN),    KeyFunc("1/x",   Functions.INV),        null),
    Key(Coords(1, 2), KeyFunc("8",   Functions.EIGHT),    KeyFunc("log2",  Functions.LOG2),       null),
    Key(Coords(2, 2), KeyFunc("9",   Functions.NINE),     KeyFunc("mod",   Functions.MOD),        null),
    Key(Coords(1, 3), KeyFunc("0",   Functions.ZERO),     KeyFunc('FIX',   Functions.FIX),        null),
    Key(Coords(2, 3), KeyFunc(".",   Functions.DOT),      KeyFunc('SCI',   Functions.SCI),        null),
    Key(Coords(3, 3), KeyFunc("+",   Functions.PLUS),     KeyFunc("ENG",   Functions.ENG),        null),
    Key(Coords(3, 2), KeyFunc("-",   Functions.MINUS),    KeyFunc("EE",    Functions.EE),         null),
    Key(Coords(3, 1), KeyFunc("*",   Functions.TIMES),    KeyFunc("√x",    Functions.SQRT),       null),
    Key(Coords(3, 0), KeyFunc("/",   Functions.DIVIDE),   KeyFunc('x²',    Functions.SQUARE),     null),
    Key(Coords(4, 2), KeyFunc("=",   Functions.ENTER),    KeyFunc("v",     Functions.STACK_POP),  null),
    Key(Coords(4, 0), KeyFunc("+/-", Functions.NEGATIVE), KeyFunc('<->',   Functions.STACK_SWAP), KeyFunc("TAU", Functions.TAU)),
    Key(Coords(4, 1), KeyFunc("fn",  Functions.FUNCTION), KeyFunc("fn",    Functions.FUNCTION2),  KeyFunc("fn", Functions.NORMAL)),
]

function Key(coords, keyFuncA, keyFuncB, keyFuncC) {
	return {coords:coords, funcs:[keyFuncA, keyFuncB, keyFuncC]}
}

function Coords(x, y) {
	return {x: x, y: y}
}

function KeyFunc(text, func) {
	return {text:text, func:func}
}

displayMode = DisplayModes.FIXED
decimalPlaces = 2

buttons = []

keyWidth =72
keyHeight = 70
keyGapX = 10
keyGapY = 10
keyGridStartX = 33
keyGridStartY = 118

let stack = new Stack()

let input_buffer = ''

function getKeyCoords(coord) {
    return { x:keyGridStartX + coord.x*(keyWidth+keyGapX), y:keyGridStartY + coord.y*(keyHeight+keyGapY) }
}

function apply_function(func) {
    for (idx = 0; idx < buttons.length; idx++) {
		//console.log(`idx: ${idx} obj: ${keyboard[idx].funcs[func]}`)
        if (keyboard[idx].funcs[func] != null) {
            console.log(keyboard[idx].funcs[func].text + " " + keyboard[idx].funcs[func].func)
            buttons[idx].text = keyboard[idx].funcs[func].text
            buttons[idx].click_func = press_key.bind(null, keyboard[idx].funcs[func].func)
        } else {
            //buttons[idx].text = keyboard[idx].funcs[0].text
            //buttons[idx].click_func = press_key.bind(null, keyboard[idx].funcs[0].func)
            buttons[idx].text = ""
            buttons[idx].click_func = (() => {})
		}
    }
}

functionMode = 0
function press_key(key) {
    console.log("Debug: Key pressed: " + Functions.lookup(key))
    appliedFunction = 0
    if (key >= Functions.ZERO && key <= Functions.NINE) {
        input_buffer += key
    } else if (key == Functions.DOT) {
        input_buffer += '.'
    } else if (key == Functions.TAU) {
        input_buffer = ''
        stack.push(2*Math.PI)
    } else if (key == Functions.NEGATIVE) {
        if (input_buffer.length == 0) {
            x = stack.pop()
            stack.push(-x)
        } else {
            input_buffer = "-" + input_buffer
        }
    } else if (key == Functions.ENTER) {
        if (input_buffer.length == 0) {
			x = stack.peekX()
			stack.push(x)
		} else {
			stack.push(Number(input_buffer))
			input_buffer = ''
		}
    } else if (key == Functions.EE) {
        if (input_buffer.length == 0) {
            input_buffer = stack.pop()
        }
        input_buffer += 'e'
    } else if (key >= Functions.FIRST_ONE_INPUT_FUNCTION && key <= Functions.LAST_ONE_INPUT_FUNCTION) {
        if (input_buffer.length == 0) {
            x = stack.pop()
        } else {
            x = Number(input_buffer)
            input_buffer = ''
        }
        result = 0
        switch (key) {
            case Functions.SQUARE:
                result = x*x
                break
            case Functions.SQRT:
                result = Math.sqrt(x)
                break
            case Functions.LN:
                result = Math.log(x)
                break
            case Functions.E_TO_X:
                result = Math.exp(x)
                break
            case Functions.LOG:
                result = Math.log10(x)
                break
            case Functions.TEN_TO_X:
                result = Math.pow(10, x)
                break
            case Functions.INV:
                result = 1/x
                break
            case Functions.LOG2:
                result = Math.log2(x)
                break
            case Functions.FIX:
				displayMode = DisplayModes.FIXED
                decimalPlaces = x
                break;
            case Functions.SCI:
				displayMode = DisplayModes.SCIENTIFIC
                decimalPlaces = x
                break;
            case Functions.ENG:
				displayMode = DisplayModes.ENGINEERING
                decimalPlaces = x
                break;
            case Functions.STACK_POP:
                break;
            case Functions.SIN:
                result = Math.sin(x);
                break;
            case Functions.COS:
                result = Math.cos(x);
                break;
            case Functions.TAN:
                result = Math.tan(x);
                break;
            case Functions.ASIN:
                result = Math.asin(x);
                break;
            case Functions.ACOS:
                result = Math.acos(x);
                break;
            case Functions.ATAN:
                result = Math.atan(x);
                break;
        }
        if (key < Functions.ONE_INPUT_NO_OUTPUT)
            stack.push(result)
    } else if (key >= Functions.FIRST_TWO_INPUT_FUNCTION && key <= Functions.LAST_TWO_INPUT_FUNCTION) {
        if (input_buffer.length > 0) {
            x = Number(input_buffer)
            input_buffer = ''
        } else {
            x = stack.pop()
        }
        y = stack.pop()
        result = 0
        switch (key) {
            case Functions.PLUS:
                result = y+x
                break;
            case Functions.MINUS:
                result = y-x
                break;
            case Functions.TIMES:
                result = y*x
                break;
            case Functions.DIVIDE:
                result = y/x
                break;
            case Functions.LOG_X_OF_Y:
                result = Math.log(y)/Math.log(x)
                break;
            case Functions.Y_TO_X:
                result = Math.pow(y, x)
                break;
            case Functions.MOD:
                result = y % x
                break;
            case Functions.STACK_SWAP:
                result = y
				stack.push(x)
                break;
        }
        stack.push(result)
    } else if (key == Functions.FUNCTION) {
        apply_function(1)
        appliedFunction = 1
        functionMode = 1
    } else if (key == Functions.FUNCTION2) {
        apply_function(2)
        appliedFunction = 1
        functionMode = 2
    } else if (key == Functions.NORMAL) {
		apply_function(0)
		appliedFunction = 0
		functionMode = 0
	}

    if (!appliedFunction && functionMode) {
        apply_function(0)
        functionMode = 0
    }

    update_display()
}

function formatDefault(x) {
	return "" + x
}

function formatFixed(x) {
	return x.toFixed(decimalPlaces)
}

function formatScientific(x) {

	if (x == 0) {
		a = 1
		x_sci = 0
		log10_sci = 0
		unit = ' '
	} else {
		a = x/Math.abs(x)

		log10_sci = Math.floor(Math.log10(x))

        unit = "e" + (log10_sci<0?"-":"+") + (Math.abs(log10_sci)<10?"0":"") + Math.abs(log10_sci)
		
		x_sci = x/Math.pow(10, log10_sci)
	}

	formatted = (a*x_sci).toFixed(decimalPlaces) + " " + unit
	return formatted
}

function formatEngineering(x) {
	units = {
        '-30'   : 'q',
        '-27'   : 'r',
        '-24'   : 'y',
        '-21'   : 'z',
        '-18'   : 'a',
		'-15'	: 'f',
		 '-12'	: 'p',
		 '-9'	: 'n',
		 '-6'	: 'u',
		 '-3'	: 'm',
		 '0'	: ' ', 
		 '3'	: 'k', 
		 '6'	: 'M',
		 '9'	: 'G',
		 '12'	: 'T',
		 '15'	: 'P',
         '18'   : 'E',
         '21'   : 'Z',
         '24'   : 'Y',
         '27'   : 'R',
         '30'   : 'Q'}

	if (x == 0) {
		a = 1
		x_eng = 0
		log10_eng = 0
		unit = ' '
	} else {
		a = x/Math.abs(x)

		log10_eng = Math.floor(Math.log10(x)/3)*3

		if (Math.abs(log10_eng) <= 30)
			unit = units[log10_eng]
		else
			unit = "e" + log10_eng
		
		x_eng = x/Math.pow(10, log10_eng)
	}

	formatted = (a*x_eng).toFixed(decimalPlaces) + " " + unit
	return formatted
}

function update_display() {

	switch (displayMode) {
		case DisplayModes.DEFAULT:
			formatFunction = formatDefault
			break;
		case DisplayModes.FIXED:
			formatFunction = formatFixed
			break
		case DisplayModes.SCIENTIFIC:
			formatFunction = formatScientific
			break;
		case DisplayModes.ENGINEERING:
			formatFunction = formatEngineering
			break;
	}

	if (input_buffer === '') {
        console.log(`Y: ${stack.peekY()} X: ${stack.peekX()} input_buffer: ${input_buffer}`)
        x_reg.setProperty(hmUI.prop.ALIGN_H, hmUI.align.RIGHT)
		x_reg.setProperty(hmUI.prop.TEXT, formatFunction(stack.peekX()));
		y_reg.setProperty(hmUI.prop.TEXT, formatFunction(stack.peekY()));
		//z_reg.setProperty(hmUI.prop.TEXT, formatFunction(stack.peekZ()));
		//t_reg.setProperty(hmUI.prop.TEXT, formatFunction(stack.peekT()));
	} else {
        console.log(`Y: ${stack.peekY()} X: ${stack.peekX()} input_buffer: ${input_buffer}`)
        x_reg.setProperty(hmUI.prop.ALIGN_H, hmUI.align.LEFT)
    	x_reg.setProperty(hmUI.prop.TEXT, input_buffer);
		y_reg.setProperty(hmUI.prop.TEXT, formatFunction(stack.peekX()));
		//z_reg.setProperty(hmUI.prop.TEXT, formatFunction(stack.peekY()));
		//t_reg.setProperty(hmUI.prop.TEXT, formatFunction(stack.peekZ()));
	}
	console.log('')
}


Page({
    build() {
		
        chars =  "-pnumkMGPT0123456789.eNa "
        Array.from(chars).forEach(c => {
            hmUI.createWidget(hmUI.widget.TEXT, {
                x: 400,
                y: 0,
                w: 20,
                h: 100,
                color: 0xffffff,
                text: c,
                align_h: hmUI.align.RIGHT,
                font: "UbuntuMono-Regular.ttf",
                text_style: hmUI.text_style.WRAP,
                text_size: 40
            });
        })

        //t_reg = hmUI.createWidget(hmUI.widget.TEXT, {
		//	...Styles.TEXT_STYLE,
        //    y: 35,
        //});
        //z_reg = hmUI.createWidget(hmUI.widget.TEXT, {
		//	...Styles.TEXT_STYLE,
        //    y: 55,
        //});
        y_reg = hmUI.createWidget(hmUI.widget.TEXT, {
			...Styles.TEXT_STYLE,
            y: 45,
        });
        x_reg = hmUI.createWidget(hmUI.widget.TEXT, {
			...Styles.TEXT_STYLE,
            y: 75,
        });

        console.log(keyboard[0].coords.x)
        for (idx = 0; idx < keyboard.length; idx++) {
            buttons.push(
                hmUI.createWidget(hmUI.widget.BUTTON, {
                    x: getKeyCoords(keyboard[idx].coords).x,
                    y: getKeyCoords(keyboard[idx].coords).y,
                    w: keyWidth,
                    h: keyHeight,
                    text: keyboard[idx].funcs[0].text,
                    color: 0xffffff,
                    normal_color: 0x707070,
                    press_color: 0xc0c0c0,
                    radius: 10,
                    click_func: press_key.bind(null, keyboard[idx].funcs[0].func),
                    text_size: 30
                })
            )
        }

		//stack.push(8e10)
		//stack.push(8e10)

		update_display()

    }
})
