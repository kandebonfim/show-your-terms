(function() {
  var ShowYourTerms;

  ShowYourTerms = (function() {
    function ShowYourTerms(container, content1) {
      this.container = container;
      this.content = content1;
      this.container = document.querySelector(this.container);
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
      switch (type) {
        case "command":
          return console.log(type);
        case "line":
          return this.outputLine(content);
      }
    };

    ShowYourTerms.prototype.outputLine = function(content) {
      var current, text;
      current = document.createElement("div");
      text = document.createTextNode(content);
      current.appendChild(text);
      return this.container.appendChild(current);
    };

    return ShowYourTerms;

  })();

}).call(this);
