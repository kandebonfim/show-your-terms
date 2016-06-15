(function() {
  var waitForIt;

  this.ShowYourTerms = (function() {
    function ShowYourTerms(container, replay) {
      this.container = container;
      this.replay = replay != null ? replay : true;
      if (!this.container.nodeType) {
        this.container = document.querySelector(this.container);
      }
      this.outputIndex = 0;
      this.content = [];
      if (this.container.innerText.length > 0) {
        this.declarativeBuilder();
      }
    }

    ShowYourTerms.prototype.declarativeBuilder = function() {
      var element, i, len, ref;
      ref = this.container.children;
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        if (element.getAttribute('data-action') === "command") {
          this.addCommand(element.innerText, {
            styles: element.classList,
            delay: element.getAttribute('data-delay')
          });
        } else {
          this.addLine(element.innerText, {
            styles: element.classList,
            delay: element.getAttribute('data-delay')
          });
        }
      }
      this.container.style.height = window.getComputedStyle(this.container, null).getPropertyValue("height");
      this.container.innerHTML = '';
      return this.start();
    };

    ShowYourTerms.prototype.addCommand = function(content, options) {
      if (options == null) {
        options = {};
      }
      return this.content.push(["command", content, options]);
    };

    ShowYourTerms.prototype.addLine = function(content, options) {
      if (options == null) {
        options = {};
      }
      return this.content.push(["line", content, options]);
    };

    ShowYourTerms.prototype.start = function() {
      return this.outputGenerator(this.content[this.outputIndex]);
    };

    ShowYourTerms.prototype.callNextOutput = function(delay) {
      if (delay == null) {
        delay = 800;
      }
      this.outputIndex = this.outputIndex + 1;
      if (this.content[this.outputIndex]) {
        return waitForIt(delay, (function(_this) {
          return function() {
            return _this.outputGenerator(_this.content[_this.outputIndex]);
          };
        })(this));
      } else {
        if (this.replay) {
          this.outputIndex = -1;
          return waitForIt(delay, (function(_this) {
            return function() {
              _this.callNextOutput();
              return _this.container.innerHTML = '';
            };
          })(this));
        }
      }
    };

    ShowYourTerms.prototype.outputGenerator = function(output) {
      var characters, content, counter, currentLine, interval, options, speed, text, type;
      type = output[0];
      content = output[1];
      options = output[2];
      currentLine = document.createElement("div");
      if (options.styles) {
        currentLine.setAttribute("class", options.styles);
      }
      if (options.speed) {
        speed = options.speed;
      } else {
        speed = 100;
      }
      currentLine.classList.add('active');
      if (type === "command") {
        characters = content.split('');
        counter = 0;
        return interval = setInterval(((function(_this) {
          return function() {
            var text;
            text = document.createTextNode(characters[counter]);
            currentLine.appendChild(text);
            _this.container.appendChild(currentLine);
            counter++;
            if (counter === characters.length) {
              currentLine.classList.remove('active');
              _this.callNextOutput(options.delay);
              return clearInterval(interval);
            }
          };
        })(this)), speed);
      } else {
        text = document.createTextNode(content);
        currentLine.appendChild(text);
        this.container.appendChild(currentLine);
        currentLine.classList.remove('active');
        return this.callNextOutput(options.delay);
      }
    };

    return ShowYourTerms;

  })();

  waitForIt = (function(_this) {
    return function(ms, func) {
      return setTimeout(func, ms);
    };
  })(this);

}).call(this);
