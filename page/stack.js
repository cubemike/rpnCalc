export default class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) {
      return 0;
    }
    return this.items.pop();
  }

  peekX() {
    if (this.hasX()) {
        return this.items[this.items.length - 1];
    } else {
        return 0
    }
  }

  peekY() {
    if (this.hasY()) {
        return this.items[this.items.length - 2];
    } else {
        return 0
    }
  }

  peekZ() {
    if (this.hasZ()) {
        return this.items[this.items.length - 3];
    } else {
        return 0
    }
  }

  peekT() {
    if (this.hasT()) {
        return this.items[this.items.length - 4];
    } else {
        return 0
    }
  }

  hasX() {
    return this.items.length >= 1;
  }

  hasY() {
    return this.items.length >= 2;
  }

  hasZ() {
    return this.items.length >= 3;
  }

  hasT() {
    return this.items.length >= 4;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

}
