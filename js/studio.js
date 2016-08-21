
"use strict";

function filesClickEvent() {
  $('#files div.file').click(function() {
    let fileName = $(this).text();

    if(fileName === currentFile)
      return ;

    files[currentFile] = editor.getValue();
    currentFile        = fileName;
    editor.setValue(files[currentFile]);
  });
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

editor.on('change', function(codemirror, change) {
  let code = codemirror.getValue();

  if(localStorageSupport)
    localStorage.setItem('__Senva_autosave', editor.getValue());

  let output = Senva.exec(code, true);
  $('#result').css('border-color', output.failed ? 'red' : 'lightgray');
  result.setValue(output.content);
  console.log(output.failed ? 'no memory' : output.trash.memory);
});

if(localStorageSupport && (autoSaved = localStorage.getItem('__Senva_autosave'))) {
  let conf;

  editor.setValue(autoSaved);
  console.info('Auto-saved content has been restored.');
}

editor.focus();
