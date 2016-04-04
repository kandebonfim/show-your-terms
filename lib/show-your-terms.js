(function() {
  var ShowYourTerms, delay, terminalDrops;

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
      var classnames, type_split;
      type_split = type.split(':');
      type = type_split[0];
      classnames = type_split.slice(1, type_split.lenght).join(' ');
      switch (type) {
        case "command":
          return this.outputLine(content, classnames);
        case "line":
          return this.outputLine(content, classnames);
      }
    };

    ShowYourTerms.prototype.outputLine = function(content, classnames) {
      var current, text;
      current = document.createElement("div");
      current.setAttribute("class", classnames);
      text = document.createTextNode(content);
      current.appendChild(text);
      return this.container.appendChild(current);
    };

    return ShowYourTerms;

  })();

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  terminalDrops = {
    "command": "hello, show your terms!",
    "line:yellow:bold": "hello, motherfocka!"
  };

  delay(200, function() {
    return new ShowYourTerms('.terminal', terminalDrops);
  });

}).call(this);
