
# Senva

*Senva* is a programming language made for intellectual challenges. You can only perform a little amount of operations, and even though this language is a "high-level" language, it's like [BrainF*ck](https://fr.wikipedia.org/wiki/Brainfuck).

Here is an example :

```Senva
5.5;>1+8?<1->$<$:>>32+~<:
```

# Installation

Simply download the GitHub repository archive and run the **index.html** page. Put your code on the left editor, the right one will display your program's output or the errors.

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
    .      |     /     | Assign a number to the cell
    <      |     -     | Point to the previous cell
    \>     |     -     | Point to the next cell
    '      |     -     | Point to the first cell
    \`     |     -     | Point to the last cell
    #      |     -     | Ask the user for a number (integer between 0 and 255)
    ?      |     /     | Condition
    !      |     /     | Inverted condition
    ;      |     /     | Loop
    $      |     -     | End of a condition/Loop
    ^      |     -     | Store the pointer into the cell
    :      |     -     | Display the cell as a number
    ,      |     /     | Convert the string in the buffer to ASCII code
    ~      |     -     | Display the cell as a string (ASCII code)
    %      |     -     | Reset the memory

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
A,~
```

'A' is stored into the buffer, then the buffer is converted to an ASCII code and stored into the current cell (code is 65), then the cell is displayed as an ASCII character.

# License

This project is under [CC-BY-NC-ND 4.0 International](http://creativecommons.org/licenses/by-nc-nd/4.0/) license.
See the **LICENSE.md** files for more details.
