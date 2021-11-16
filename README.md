# BF Alike Language Interpreter
BF is a language that relies on 8 simple commands.
1. `>` Move the data pointer right
2. `<` Move the data pointer left
3. `+` Increment the current value
4. `-` Decrement the current value
5. `[` Start loop
    - If the current value at the start of the loop is 0, then move to the corresponding end of the loop
6. `]` End loop
    - If the current value at the end of the loop is not 0, then move back to the corresponding start of the loop
7. `.` Output 1 byte of data
8. `,` Accept 1 byte of data

This makes the BF language very easy to learn, but very difficult to use.
It also makes it trivial to build your own BFalike language by simply swapping out the tokens. By providing a simple mapping of tokens to commands, we can build an interpreter that can run any variations of BF that we like.

## How to run
To run the interpreter you only need to have `node`.

```
node bfAlikeInterpreter.js config.json bottles.rose
```

The first argument is the relative path to the config which tells the interpreter how to map the commands. The second is the relative path to the code to run.

## Example Program
The example program will sing 99 bottles of beer on the wall to you.