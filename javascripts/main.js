(function() {
  $(function() {
    return window.notify = function(text) {
      return noty({
        theme: 'relax',
        closeWith: ['button'],
        text: text
      });
    };
  });

}).call(this);
