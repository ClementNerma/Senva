// Use the strict mode for better performances
'use strict';

/**
  * Senva interface
  * @type {object}
  */
const Senva = (new (function() {

  /**
    * Run a Senva script
    * @param {string} script
    * @param {boolean} [strict] Enable to strict mode
    * @param {number} [timeout] Give a timeout to prevent infinite loops
    */
  this.exec = (script, strict = false, timeout = 5000) => {
    /**
      * Display an error
      * @param {string} message
      * @return {void}
      */
    function error(message) {
      // Define the part to display
      let part   = script.substr(i < 10 ? 0 : i - 10, 21);
      // Define the cursor's position
      let cursor = i < 10 ? i : 10;

      // Return the error
      return {
        failed : true,
        content: `ERROR : At column ${i + 1} : \n\n${part}\n${' '.repeat(cursor)}^\n${' '.repeat(cursor)}${message}`
      };
    }

    // Define some local variables
    let i      , // Column number
        mem    , // The memory
        buff   , // Data buffer
        display, // The output data
        m      , // The memory index
        opened , // The number of opened conditions/loops
        started; // The start hour

    // The moment when the prompt started
    // This variable permit to don't take the time passed during the input in
    // consideration
    /** @type {number} */
    let prompt_start;

    // Initialize the memory
    mem     = [0];
    m       = 0 ;
    display = '';
    buff    = '';
    opened  = [];
    started = window.performance.now();

    // Remove all comments, tabulations and empty lines
    script = script.replace(/\/\/(.*)$/gm, '').replace(/\r\n|\r|\n|\t| /g, '');

    // For each character in the script...
    for(i = 0; i < script.length; i++) {
      // The current character
      let char = script[i], isLetter /* is the character a letter ? */;

      // If the character is not a known symbol
      if(!".+-*/<>'`#?!;$:,~0123456789=&%_()@".includes(char) && !(isLetter = char.match(/[a-zA-Z ]/)))
        return error(`Unknown symbol ${char}`);

      // Do actions depending on the char...
      // If the buffer is not empty but is not an integer and the operation
      // is not character displaying
      let int_buff = parseInt(buff);

      if(buff.length && !isLetter && !'0123456789_'.includes(char) && (Number.isNaN(int_buff) || Math.floor(int_buff) !== parseFloat(buff) || int_buff < 0)) {
        i -= buff.length;
        return error('Bad value specified');
      }

      // If that's a char
      if(isLetter) {
        buff += char;
      } else {
        switch(char) {
          // Add a digit to the buffer
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            buff += char;

            // If strict mode is enabled, limit the value to 255
            // The second part of the condition checks if the buffer contains at
            // least 3 digits, else it does not perform the parseInt() because
            // this operation costs performances
            if(strict && buff.length >= 3 && parseInt(buff) > 255)
              return error('Too high value, limit is 255 in strict mode');
            break;

          // Reset the memory
          case '=':
            mem = [];
            m   = 0;
            break;

          // Set a value to the memory
          case '.':
            mem[m] = parseInt(buff) || 0;
            break;

          // Increase the memory
          case '+':
            mem[m] += parseInt(buff) || 1;

            if(strict && mem[m] > 255)
              mem[m] -= Math.floor(mem[m] / 256) * 256;

            buff = '';
            break;

          // Decrease the memory
          case '-':
            mem[m] -= parseInt(buff) || 1;

            if(strict && mem[m] < 0)
              mem[m] += (Math.floor(-mem[m] / 256) + 1) * 256

            buff = '';
            break;

          // Multiply the memory
          case '*':
            if(!buff.length)
              return error('Missing a value for multiplying');

            mem[m] *= parseInt(buff);

            if(strict && mem[m] > 255)
              mem[m] -= Math.floor(mem[m] / 256) * 256;

            buff = '';
            break;

          // Divide the memory
          case '/':
            if(!buff.length)
              return error('Missing a value for dividing');

            // e.g. 255 / 5 = 51
            // e.g. 1 / 5   = 0
            // e.g. 4 / 5   = 1
            mem[m] = Math.round(mem[m] / parseInt(buff));
            buff = '';
            break;

          // Go to the previous memory
          case '<':
            // If strict mode is enabled, going to the -1 memory is not allowed
            if(strict && m === 0)
              return error('Can\'t go before the memory index 0 in strict mode');

            // If the current pointer is not 0...
            if(m !== 0)
              // Decrease the memory pointer
              m -= 1;

            break;

          // Go to the next memory
          case '>':
            // Increase the memory pointer
            m += 1;

            // If this memory doesn't exist...
            if(mem.length < m + 1)
             // Initialize it
             mem.push(0);

            break;

          // Go to a given memory adress
          case '\'':
            // If there is no buffer...
            if(!buff.length)
              // Go to the first memory adress
              m = 0;
            else
              // Go to the given memory adress
              m = parseInt(buff);
            break;

          // Go to the last memory
          case '`':
            m = mem.length - 1;
            break;

          // Ask the user for a number and place it into the buffer
          case '#':
            // If the 'prompt' fonction is not found...
            if(typeof prompt !== 'function')
              return error('Can\'t prompt a value to the user.');

            // Ask for the value
            // The first and third line permit to ignore the time passed for the input to don't exceed the timeout
            prompt_start = window.performance.now();
            buff = prompt('Please input an integer.' + (strict ? '\nStrict mode is enabled, limit is 255.' : ''), '0');
            started += (window.performance.now() - prompt_start);

            // If the value is incorrect...
            let num = parseInt(buff);

            if(num < 0 || (strict && num > 255) || Math.floor(num) !== num || num.toString() !== buff)
              return error('Input number must an integer [0...' + (strict ? '255' : 'Infinity') + ']');
            break;

          // Condition
          case '?':
          case '!':
          // Loop
          case ';':
          case ',':
            // If the buffer is empty...
            if(!buff.length)
              return error('Missing number to check the condition');

            // Set the condition's state (true or false)
            /** @type {boolean} */
            let cond = (mem[m] === parseInt(buff));

            // If asked, invert the condition
            if(char === '!' || char === ',')
              cond = !cond;

            // If the condition is true...
            if(cond)
              // Just indicates that a condition is opened
              opened.push((char === ';' || char === ',') ? [i, buff] : [i]);
            else { // If the condition is false...
              // Ignore the condition
              let opened = 1;

              while(opened) {
                // If we reached the end of the script, no end was found. Then...
                if(i === script.length)
                  return error('No end specified for condition');

                i += 1;

                if(script[i] === '?' || script[i] === '!' || script[i] === ';')
                  opened += 1;
                else if(script[i] === '$')
                  opened -= 1;
              }
            }

            break;

          // Condition/loop end
          case '$':
            // If no condition/loop was opened...
            if(!opened.length)
              return error('No condition or loop was opened');

            let got = opened.pop();

            // If it was a loop...
            if(got.length > 1) {
              i    = got[0] - 1; // go to the char before the loop's opening
              buff = got[1];     // Restore the loop's buffer
            }

            break;

          // Get the memory index
          case '@':
            mem[m] = m;

            while(strict && mem[m] > 255)
              mem[m] -= Math.floor(mem[m] / 256) * 256;

            break;

          // Display the memory as a string
          case '~':
            // If the character is not printable...
            if(!String.fromCharCode(mem[m]).match(/[!"#\$%&'\(\)\*\+,\-\.\/a-zA-Z0-9:;<=>\?@\[\]\^_`\{\|\}~ ]/))
              return error(`${mem[m]} is not a printable character code`);

            // Add the character to the output
            display += String.fromCharCode(mem[m]);
            break;

          // Display the memory as a number
          case ':':
            // Display
            display += mem[m].toString();
            break;

          // Convert a character to its code
          case '_':
            // If the buffer is not one-char long
            if(buff.length !== 1)
              return error('Value must be 1 character long');

            // Do the conversion
            mem[m] = buff.charCodeAt(0);
            break;

          // Assign the same value to all memory's cells
          case '&':
            // If no buffer was specified...
            if(!buff.length)
              // Use '0' as the default value
              buff = '0';

            // Parse the buffer
            let parsed = parseInt(buff);

            // For each cell in the memory...
            for(let i = 0; i < mem.length; i++)
              // Assign the value to the cell
              mem[i] = parsed;

            break;

          // Generate a random value
          case '%':
            // If no buffer was specified...
            if(!buff.length)
              // Use '255' as the default value
              buff = '255';

            // Store the random-generated number into the memory
            mem[m] = Math.floor(Math.random() * (parseInt(buff) + 1));
            break;

          // Ask the user for a string and store it into the memory
          case '(':
            // If the 'prompt' fonction is not found...
            if(typeof prompt !== 'function')
              return error('Can\'t prompt a value to the user.');

            // Ask for the string
            // The first and third line permit to ignore the time passed for the input to don't exceed the timeout
            prompt_start = window.performance.now();
            buff = prompt('Please input a value');
            started += (window.performance.now() - prompt_start);

            while(mem.length < m + buff.length)
              mem.push(0);

            // For each char in the string...
            for(let i = 0; i < buff.length; i++) {
              mem[m + i] = buff.charCodeAt(i);

              // Check if the code does not exceed the limit in strict mode
              if(strict && mem[m + i] > 255)
                return error(`During input : ASCII code for character ${i + 1} is ${mem[m + i]}, exceeding the strict mode\'s number ranges [0..255]`);
            }

            break;
        }

        // If the character is not a digit, and not the condition/loop closing
        // symbol which can modify the current buffer...
        if(!'0123456789$'.includes(char))
          // Reset the buffer
          buff = '';

        // If the timeout is exceeded
        if(timeout && window.performance.now() > started + timeout)
          return error(`Timeout exceeded (${timeout} ms)`);
      }
    }

    // If a condition/loop was not closed...
    if(opened.length) {
      i = opened[opened.length - 1][0];
      return error((opened[opened.length - 1].length > 1 ? 'Loop' : 'Condition') + ' not closed');
    }

    // Return the output
    return {
      failed : false,
      content: display,
      trash  : { memory: mem }
    }
  };

})());
