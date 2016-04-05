(function() {
  var ShowYourTerms, delay, terminalDrops;

  ShowYourTerms = (function() {
    function ShowYourTerms(container, content1) {
      this.container = container;
      this.content = content1;
      this.container = document.querySelector(this.container);
      this.outputIndex = 0;
    }

    ShowYourTerms.prototype.start = function() {
      return this.outputGenerator(this.content[this.outputIndex]);
    };

    ShowYourTerms.prototype.outputGenerator = function(output) {
      var characters, classnames, content, counter, currentLine, interval, text, type, type_split;
      type_split = output[0].split(':');
      type = type_split[0];
      content = output[1];
      classnames = type_split.slice(1, type_split.lenght).join(' ');
      currentLine = document.createElement("div");
      if (classnames) {
        currentLine.setAttribute("class", classnames);
      }
      switch (type) {
        case "command":
          characters = content.split('');
          counter = 0;
          return interval = setInterval(((function(_this) {
            return function() {
              var text;
              console.log(characters[counter]);
              text = document.createTextNode(characters[counter]);
              currentLine.appendChild(text);
              _this.container.appendChild(currentLine);
              counter++;
              if (counter === characters.length) {
                _this.callNextOutput(_this.outputIndex);
                return clearInterval(interval);
              }
            };
          })(this)), 100);
        case "line":
          console.log(content);
          text = document.createTextNode(content);
          currentLine.appendChild(text);
          this.container.appendChild(currentLine);
          return this.callNextOutput(this.outputIndex);
      }
    };

    ShowYourTerms.prototype.callNextOutput = function(index) {
      this.outputIndex = this.outputIndex + 1;
      if (this.content[this.outputIndex]) {
        return this.outputGenerator(this.content[this.outputIndex]);
      }
    };

    return ShowYourTerms;

  })();

  delay = (function(_this) {
    return function(ms, func) {
      return setTimeout(func, ms);
    };
  })(this);

  terminalDrops = [["command", "hello, show your terms!"], ["line:yellow:bold", "hello, motherfocka!"], ["line:yellow:bold", "oi, teste!"]];

  delay(100, (function(_this) {
    return function() {
      var syt;
      syt = new ShowYourTerms('.terminal', terminalDrops);
      return syt.start();
    };
  })(this));

}).call(this);
