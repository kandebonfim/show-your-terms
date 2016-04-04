(function() {
  var ShowYourTerms, terminalDrops;

  ShowYourTerms = (function() {
    function ShowYourTerms(container, content1) {
      this.container = container;
      this.content = content1;
      this.container = document.querySelectorAll(this.container);
      this.outputsParser();
    }

    ShowYourTerms.prototype.outputsParser = function() {
      var content, ref, results, type;
      ref = this.content;
      results = [];
      for (type in ref) {
        content = ref[type];
        results.push(this.outputGenerator(type, content));
      }
      return results;
    };

    ShowYourTerms.prototype.outputGenerator = function(type, content) {
      return console.log(type, content);
    };

    return ShowYourTerms;

  })();

  terminalDrops = {
    "command": "hello, show your terms!",
    "line": "hello, motherfocka!"
  };

  new ShowYourTerms('.terminal', terminalDrops);

}).call(this);
