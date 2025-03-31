export default class DisplayModes {
	static displayModeStrings = [
		'FIXED',
		'SCIENTIFIC',
		'ENGINEERING',
	]
	static {
        let count = 0
		this.displayModeStrings.forEach(str => this[str] = count++)
	}
    static lookup(value) {
        keyName = Object.keys(this).find(key => this[key] === value)
        return keyName
    }
}
