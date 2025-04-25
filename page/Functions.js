export default class Functions {
    static strings = [
        'ZERO',
        'ONE',
        'TWO',
        'THREE',
        'FOUR',
        'FIVE',
        'SIX',
        'SEVEN',
        'EIGHT',
        'NINE',
        'DOT',
        'FIRST_ONE_INPUT_FUNCTION',
        'ENTER',
        'SQUARE',
        'SQRT',
        'NEGATIVE',
        'LOG',
        'TEN_TO_X',
        'E_TO_X',
        'LN',
        'INV',
        'LOG2',
        'SIN',
        'COS',
        'TAN',
        'ASIN',
        'ACOS',
        'ATAN',
        'ONE_INPUT_NO_OUTPUT',
        'FIX',
        'SCI',
        'ENG',
        'STACK_POP',
        'LAST_ONE_INPUT_FUNCTION',
        'FIRST_TWO_INPUT_FUNCTION',
        'PLUS',
        'MINUS',
        'TIMES',
        'DIVIDE',
        'Y_TO_X',
        'LOG_X_OF_Y',
        'STACK_SWAP',
        'MOD',
        'LAST_TWO_INPUT_FUNCTION',
        'FUNCTION',
        'FUNCTION2',
        'EE',
        'NORMAL',
        'TAU',
    ]
	static {
        let count = 0
		this.strings.forEach(str => this[str] = count++)
	}
    static lookup(value) {
        keyName = Object.keys(this).find(key => this[key] === value)
        return keyName
    }
}
