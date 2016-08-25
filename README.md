
# Senva

*Senva* is a programming language made for intellectual challenges. You can only perform a little amount of operations, and even though this language is a "high-level" language, it's like [BrainF*ck](https://fr.wikipedia.org/wiki/Brainfuck).

Here is an example :

```Senva
5.5;>1+8?<1->$<$:>>32+~<:
```

# Installation

## Method 1 : Web Interpreter

Simply download the GitHub repository archive and run the **index.html** page. Put your code on the left editor, the right one will display your program's output or the errors.

You can also test the interpreter at this adress : [https://clementnerma.github.io/Senva/](https://clementnerma.github.io/Senva/)

## Method 2 : Command-line

You can also run a Senva program from the command-line. For that, install [Node.js with NPM](https://nodejs.org). Then, just run :

```bash
npm install -g senva
```

**NOTE :** For Linux users, you may have to run this command with **sudo** privileges.

Then, you can use the command-line interface (CLI) to run your programs. If you want to run a code, type `senva "2.>"` (don't forget the quotes), or `senva -f program.snv` to run a program from your hard drive. Also, you can run the `senva` command alone to get an interpreter and type what you want.

# The language itself

Senva is made around operations. Each operation can be done by using a *symbol*. For example, the symbol for the addition operation is '+'. To divide, use '/'.
Some operations needs a value, also called *buffer*. The buffer must be placed before the symbol, like :

```Senva
5+
```

The `5` is the buffer, the `+` the operation symbol.
The operations are placed as a chain, like :

```Senva
5+2-
```

This code adds 5 to the memory, then substract 2. The Senva language works with a memory. The memory is an array which contains a number between 0 and 255 (only integers are allowed). The current cell is designed by the *pointer*, by default it points on the 1st cell (also called *memory 0*).

Here is the list of the operations :

Operation  | Default * | Description
-----------|-----------|-------------
    +      |     1     | Adds a value to the cell (if there is no buffer, adds 1)
    -      |     1     | Substract a value to the cell (if there is no buffer, substract 1)
    *      |     /     | Multiply the cell by a value
    /      |     /     | Divide the cell by a value
    .      |     0     | Assign a number to the cell
    <      |     -     | Point to the previous cell
    \>     |     -     | Point to the next cell
    '      |     0     | Point to a given cell
    \`     |     -     | Point to the last cell
    #      |     -     | Ask the user for a number (integer between 0 and 255)
    ?      |     /     | Condition
    !      |     /     | Inverted condition
    ;      |     /     | Loop
    ,      |     /     | Inverted loop
    $      |     -     | End of a condition/Loop
    @      |     -     | Store the pointer into the cell
    :      |     -     | Display the cell as a number
    _      |     /     | Convert the string in the buffer to ASCII code
    ~      |     -     | Display the cell as a string (ASCII code)
    =      |     -     | Reset the memory
    &      |     0     | Assign a number to the entire memory
    %      |    255    | Generate a random number between 0 and the value
    (      |     -     | Ask the user for a string, which will be stored into the memory
    "      |     /     | Go to the memory adress pointed by the current cell

**NOTE :** If the default value is '/' that means you need to specify a buffer, '-' means that no buffer is needed. The default value is the value taken if you DO NOT specify a buffer.

Let's take our example :

```Senva
5.5;>1+8?<1->$<$:>>32+~<:
```

Now, display it with a better style, and comment all lines to decrypt what is does :

```Senva
5. // Assign 5 to the cell 0
5; // Make a loop : while cell 0's value is 5...
  >  // Point to cell 1
  1+ // Add 1 to cell 1
  8? // If cell 1's value is 8
    <  // Point to cell 0
    1- // Decrease cell 0, the first loop will end
    >  // Point to cell 1
  $  // End of the condition
  <  // Point to cell 0
$  // End of loop
:  // Display the cell 0 as a number
>>  // Point to cell 2
32+ // Add 32 to cell 2
~  // Display cell 2 as a string (32 is the ASCII code for space)
<  // Point to cell 1
:  // Display cell 1 as a number
```

Better, isn't it :) ?

Here we made a loop which runs a code while the cell 0 is equal to 5. Next we increase the cell 1, if the cell is equal to 8, we decrease cell 0 : this break the loop which ends. Then we display cell 0, which was 5 before decreasing (now cell 0 equals to 4), a space, and cell 1 which is equal to the number of times the loop runned (8 times). So this script should display '4 8'.

To display the space ' ' character, we used its ASCII code, but you can also put the character and convert it as a code, then display it. Example :

```Senva
A_~
```

'A' is stored into the buffer, then the buffer is converted to an ASCII code and stored into the current cell (code is 65), then the cell is displayed as an ASCII character.

# Strict mode

The strict mode disallow numbers higher than 255. When you try to run this code : `256+` an error will be thrown.
Negative numbers are not allowed in strict mode.

When you run this code : `255+3+` the value of the cell will be 2, because when it exceeds 255, the cell comes to 0 for the operations. So `255+255+2+` will assign '2' to the cell.
Negative numbers are not supported, so when a cell is lower than 0, it comes to 255 and substract the rest of the value : `0.3-` will assign 253.

When you try to set the pointer under 0 in strict mode, an error will be thrown, in standard mode it will just set the pointer to the first cell (number 0).

The number inputs are limited to 255, else it will throw an error.

# Back-memory

Senva implements a feature that solves a big problem of the language. Imagine you are making a Fibonacci suite program, you will have to add the two previous terms. How will you do ? You can't add a value from a cell to another, that's impossible.

To do that, you will need to use the *back-memory*. It's a cell, like any other, but its adress is not 2 or 5, but -1. An adress impossible to reach. The back-memory is useful because you can perform any operation you perform on other cells, but without modifying the current adress. Here is an example :

```Senva
@:   // Display the current adress, says '0'
{1+} // Add 1 to the back-memory
@:   // Says '0'
```

You see ? This permit to manipulate values even if you can't jump to another cell. The operations performed on the back-memory must be between the symbols '{' and '}'. Back-memory also supports some "special" operations (* here *BM* means *Back-Memory*) :

Symbol | Description
-------|------------
   ^   | Store the current cell into the *BM*
   v   | Store the *BM* into the current cell
   +   | Add the current cell to the *BM*
   -   | Substract the current cell to the *BM*
   @   | Store the pointer to the *BM*
   '   | Go to the adress stored in the *BM*

Any other symbol will be considered as a standard operation. But be careful, if you just want to increase the back-memory, don't write `{+}` ! It will add the current cell's value instead of 1. You must write `{1+}`.

You will see the full utility of this feature on the Fibonacci program.

# Programs

Here are some demonstration programs to make you understanding better the Senva language.

## Fibonacci suite

```Senva
// Algorithm for standard mode (never ends)
0.>1.>0;{0.}<<{+}>{+}>{v}:{10.~}>$
// Algorithm for strict mode
0.>1.>0;{0.}<<{+}>{+}>{v}:{10.~}233?|$>$
```

Let's decrypt !

```Senva
0.> // Store the first  term, 0, and go the next cell
1.> // Store the second term, 1, and go the next cell
0;  // While this cell contains 0 (no ending, we always pass to the next before looping)
  {0.} // Reset the back-memory
  <<   // Go to the -2 term
  {+}  // Add it to the back-memory
  >    // Go to the -1 term (previous term)
  {+}  // Add it to the back-memory
  >    // Go to the current cell (which contains 0)
  {v}  // Paste the addition. Now this cell contains the addition of the two previous terms
  :    // Display it
  {10.~} // Display a new line. To do NOT modify the current cell, we put the
         // '10' value into the back-memory for displaying

  // For strict mode
  233? // Condition : if the cell is equals to 233
       // This condition is needed because when we put a higher number than 255,
       // the cell is reset to 0, so the next numbers will be wrong.
    |  // Stop the program
  $ // End of the condition
  // ===============

  > // Go to the next cell (which is empty). The loop's condition will be true because the cell contains 0.
$ // End of the loop
```

# Micro-programs

Here are a list of micro-programs that can help you while making Senva code :

```Senva
`>@
```
Get the number of cells into the memory and store it into a new cell (at the end).

```Senva
0,~>$
```
Display a string until encounter a zero.
Example of use : `('0,~>$` (input and display a string)

# License

This project is under [CC-BY-NC-ND 4.0 International](http://creativecommons.org/licenses/by-nc-nd/4.0/) license.
See the **LICENSE.md** files for more details.
