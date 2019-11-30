function screenClear() {
  $('#console').text('');
}

function screenLog() {
  var line = $.makeArray(arguments).join(' ') + "\n";
  $('#console').append(line);
}

var saveTimeout;
var saveDelay = 1000;
var saveKey = 'code';

$(document).ready(function() {
  /**
   * Setup Ace Editor
   */
  var editor = ace.edit('editor');

  editor.setTheme('ace/theme/monokai');
  editor.session.setMode('ace/mode/javascript');

  editor.session.on('change', function(e) {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(function() {
      var doc = editor.session.getDocument();

      localStorage.setItem(saveKey, doc.$lines.join("\n"));
    }, saveDelay);
  });


  /**
   * Attempt to load saved document
   */
  try {
    var doc = localStorage.getItem(saveKey);

    if (doc && doc.trim() !== '') {
      editor.session.setValue(doc);
    }
  } catch (err) {
    console.warn(err);
  }


  /**
   * Configure Key Bindings
   */
  $(document).on('keydown', function(e) {
    var isEnterKey = (e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13);

    if (e.shiftKey && isEnterKey) {
      e.preventDefault();

      var doc = editor.session.getDocument();
      var code = doc.$lines.join("\n");

      var consoleLog = console.log;
      console.log = screenLog;

      screenClear();

      eval(code);

      console.log = consoleLog;

      return false;
    }
  });
});
