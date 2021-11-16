const MAX_SAFE_ARRAY_LENGTH = 4294967296;

class Interpreter {
    constructor({ config, data }) {
        this.cursor = 0;
        this.outCursor = 0;
        this.out = [];
        const { commandsMap } = JSON.parse(config);
        const matchPattern = Object.keys(commandsMap).map(command => `(${command})`).join('|');
        this.commandMap = commandsMap;
        this.commands = data.match(new RegExp(matchPattern, 'g'));
        const [_closeToOpenMap, _openToCloseMap] = this.buildBracketMap();
        this.closeToOpenMap = _closeToOpenMap;
        this.openToCloseMap = _openToCloseMap;
    }

    static getChar() {
        let buffer = Buffer.alloc(1)
        fs.readSync(0, buffer, 0, 1)
        return buffer.toString('utf8')
    }

    get currentCommand() {
        return this.commandMap[this.commands[this.cursor]];
    }
    get currentValue() {
        return this.out[this.outCursor] || 0;
    }
    
    buildBracketMap() {
        const openStack = [];
        return this.commands.reduce((acc, command, index) => {
            if (this.commandMap[command] === 'startLoop') {
                openStack.push(index);
            } else if (this.commandMap[command] === 'endLoop') {
                const openIdx = openStack.pop();
                acc[0][index] = openIdx;
                acc[1][openIdx] = index;
            }
            return acc;
        }, [{}, {}])
    }
    
    increment() {
        if (this.currentValue === Number.MAX_SAFE_INTEGER) {
            throw new Error("Can't safely increment value. Value is MAX_SAFE_INTEGER")
        }
        this.out[this.outCursor] = this.currentValue  + 1;
    }
    
    decrement() { 
        if (this.currentValue === Number.MIN_SAFE_INTEGER) {
            throw new Error("Can't safely decrement value. Value is MIN_SAFE_INTEGER")
        }
        this.out[this.outCursor] = this.currentValue - 1;
    }
    
    moveRight() {
        if (this.outCursor === MAX_SAFE_ARRAY_LENGTH) {
            throw new Error("Can't move outCursor right. Max length")
        }
        this.outCursor = this.outCursor + 1;
    }
    
    moveLeft() {
        if (this.outCursor === 0) {
            throw new Error("Can't move outCursor left. Currently at index 0")
        }
        this.outCursor = this.outCursor - 1;
    }
    
    write() {
        process.stdout.write(String.fromCharCode(this.currentValue));
    }
    
    read() { 
        this.out[this.outCursor] = Interpreter.getChar().charCodeAt(0);
    }
    
    startLoop() {
        if (!this.currentValue) {
            this.cursor = this.openToCloseMap[this.cursor];
        }
    }
    
    endLoop() {
        if (this.currentValue) {
            this.cursor = Number(this.closeToOpenMap[this.cursor]) - 1;
        }
    }

    run() {
        while (this.cursor !== this.commands.length) {
            const func = this.currentCommand;
            this[func]?.()
            this.cursor++;
        }
    }
}


const configPath = process.argv[2];
const path = process.argv[3];
const fs = require('fs');

try {
    const config = fs.readFileSync(configPath, 'utf8');
    const data = fs.readFileSync(path, 'utf8');
    new Interpreter({ data, config }).run();
} catch (err) {
    console.error(err);
}