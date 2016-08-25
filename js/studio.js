
"use strict";

function build(codemirror, change) {
  let code = codemirror.getValue();

  if(localStorageSupport)
    localStorage.setItem('__Senva_autosave', editor.getValue());

  let output = Senva.exec(code, document.getElementById('strictMode').checked, document.getElementById('longTimeout').checked ? 10000 : 1000, document.getElementById('disableBackMemory').checked, true);
  $('#result').css('border-color', output.failed ? 'red' : 'lightgray');
  result.setValue(output.content);
}

let localStorageSupport = (typeof localStorage !== 'undefined'),
    autoSaved;

let codeMirrorConfig = {
  styleActiveLine: true,
  lineNumbers: true,
  indentUnit: 4
};

let editor = CodeMirror($('#editor').get(0), codeMirrorConfig);
let result = CodeMirror($('#result').get(0), codeMirrorConfig);

editor.on('change', build);

if(localStorageSupport && (autoSaved = localStorage.getItem('__Senva_autosave')))
  editor.setValue(autoSaved);

editor.focus();

let checkboxes = document.querySelectorAll('input[type="checkbox"]');

for(let i = 0; i < checkboxes.length; i++)
  checkboxes[i].addEventListener('change', () => { build(editor); });
