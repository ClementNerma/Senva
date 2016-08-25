// The strict mode offers better performances and is also needed for
// block-scoped (let) declarations.
'use strict';

/**
  * Throw a fatal error
  * @param {string} message
  * @return {void}
  */
function error(message) {
  console.error(message);
  process.exit();
}

// Require some modules and define local variables
let fs     = require('fs'),
    senva  = require('./compiler.js'),
    prompt = require('prompt-sync')(),
    args   = process.argv.slice(2);

/** The program's content
  * @type {string|void} */
let program;

if(args[0] === '-f') {
  if(!args[1])
    throw new Error('No file specified');

  try { program = fs.readFileSync(args[1], 'utf-8'); }
  catch(e) { error(`Failed to read input file "${args[1]}"`); }

  // If the program is empty
  if(!program)
    process.exit();
} else if(args[0])
  args[0] = program;

if(program) {
  let result = senva.exec(program);

  if(result.failed)
    error(result.content);

  console.log(result.content);
  process.exit();
}

// CLI Interpreter
while(true) {
  let code = prompt('> ', program);

  if(code === null)
    process.exit();

  let result = senva.exec(code);

  if(result.failed)
    console.error(result.content);
  else
    console.log(result.content);
}
