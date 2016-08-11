(function() {
  this.ShowYourTerms = (function() {
    function ShowYourTerms(container, replay, termsOptions) {
      var defaultOptions, i, j, key, ref, total, val;
      this.container = container;
      this.replay = replay != null ? replay : true;
      this.termsOptions = termsOptions != null ? termsOptions : {};
      defaultOptions = {
        single: false,
        pauseOnClick: true
      };
      for (key in defaultOptions) {
        val = defaultOptions[key];
        if (!(key in this.termsOptions)) {
          this.termsOptions[key] = val;
        }
      }
      if (!this.container.nodeType) {
        this.container = document.querySelectorAll(this.container);
      }
      this.content = [];
      this.sstatus = [];
      this.outputIndex = [];
      if (this.container.length > 0) {
        total = this.container.length - 1;
        if (this.termsOptions['single']) {
          total = 0;
        }
        for (i = j = 0, ref = total; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          this.content[i] = [];
          this.sstatus[i] = "ready";
          this.defineEvents(i);
          if (this.container[i].innerText.length > 0) {
            this.declarativeBuilder(i);
          }
        }
      }
    }

    ShowYourTerms.prototype.declarativeBuilder = function(outputTerm) {
      var element, j, len, ref;
      ref = this.container[outputTerm].children;
      for (j = 0, len = ref.length; j < len; j++) {
        element = ref[j];
        this.content[outputTerm].push([
          element.getAttribute('data-action'), element.innerText, {
            styles: element.classList,
            delay: element.getAttribute('data-delay'),
            speed: element.getAttribute('data-speed')
          }
        ]);
      }
      this.container[outputTerm].style.minHeight = window.getComputedStyle(this.container[outputTerm], null).getPropertyValue("height");
      return this.play(outputTerm);
    };

    ShowYourTerms.prototype.defineEvents = function(outputTerm) {
      if (this.termsOptions['pauseOnClick']) {
        return this.container[outputTerm].addEventListener('click', ((function(_this) {
          return function() {
            return _this.togglePause(outputTerm);
          };
        })(this)));
      }
    };

    ShowYourTerms.prototype.addCommand = function(content, options, outputTerm) {
      if (outputTerm == null) {
        outputTerm = 0;
      }
      if (outputTerm < this.content.length) {
        return this.content[outputTerm].push(["command", content, options]);
      }
    };

    ShowYourTerms.prototype.addLine = function(content, options, outputTerm) {
      if (outputTerm == null) {
        outputTerm = 0;
      }
      if (outputTerm < this.content.length) {
        return this.content[outputTerm].push(["line", content, options]);
      }
    };

    ShowYourTerms.prototype.play = function(outputTerm) {
      if (outputTerm == null) {
        outputTerm = 0;
      }
      if (this.sstatus[outputTerm] === "ready") {
        this.sstatus[outputTerm] = "playing";
        this.container[outputTerm].innerHTML = '';
        this.outputIndex[outputTerm] = 0;
        return this.outputGenerator(this.content[outputTerm][this.outputIndex[outputTerm]], outputTerm);
      }
    };

    ShowYourTerms.prototype.playagain = function(outputTerm) {
      if (outputTerm == null) {
        outputTerm = 0;
      }
      this.sstatus[outputTerm] = "ready";
      return this.play(outputTerm);
    };

    ShowYourTerms.prototype.callNextOutput = function(delay, outputTerm) {
      this.outputIndex[outputTerm] += 1;
      if (this.content[outputTerm][this.outputIndex[outputTerm]]) {
        return setTimeout(((function(_this) {
          return function() {
            return _this.outputGenerator(_this.content[outputTerm][_this.outputIndex[outputTerm]], outputTerm);
          };
        })(this)), delay);
      } else if (this.replay) {
        return setTimeout(((function(_this) {
          return function() {
            return _this.playagain(outputTerm);
          };
        })(this)), delay);
      }
    };

    ShowYourTerms.prototype.isPlaying = function(outputTerm) {
      return this.sstatus[outputTerm] === "playing";
    };

    ShowYourTerms.prototype.togglePause = function(outputTerm) {
      if (this.sstatus[outputTerm] === "playing") {
        return this.sstatus[outputTerm] = "pause";
      } else if (this.sstatus[outputTerm] === "pause") {
        return this.sstatus[outputTerm] = "playing";
      }
    };

    ShowYourTerms.prototype.outputGenerator = function(output, outputTerm) {
      var content, counter, currentLine, interval, options, pauseInterval, speed, type;
      type = output[0], content = output[1], options = output[2];
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
        if (!currentLine.classList.contains('type')) {
          currentLine.classList.add('command');
        }
        counter = 0;
        return interval = setInterval(((function(_this) {
          return function() {
            if (_this.isPlaying(outputTerm)) {
              currentLine.appendChild(document.createTextNode(content[counter]));
              _this.container[outputTerm].appendChild(currentLine);
              counter++;
              if (counter === content.length) {
                currentLine.classList.remove('active');
                _this.callNextOutput(options.delay, outputTerm);
                return clearInterval(interval);
              }
            }
          };
        })(this)), speed);
      } else {
        if (!this.isPlaying(outputTerm)) {
          return pauseInterval = setInterval(((function(_this) {
            return function() {
              if (_this.isPlaying(outputTerm)) {
                clearInterval(pauseInterval);
                return _this.callNextOutput(options.delay, outputTerm);
              }
            };
          })(this)), speed);
        } else {
          currentLine.appendChild(document.createTextNode(content));
          this.container[outputTerm].appendChild(currentLine);
          currentLine.classList.remove('active');
          return this.callNextOutput(options.delay, outputTerm);
        }
      }
    };

    return ShowYourTerms;

  })();

}).call(this);
