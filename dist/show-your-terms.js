(function() {
  this.ShowYourTerms = (function() {
    function ShowYourTerms(container, replay) {
      var i, j, ref;
      this.container = container;
      this.replay = replay != null ? replay : true;
      if (!this.container.nodeType) {
        this.container = document.querySelectorAll(this.container);
      }
      this.content = [];
      this.outputIndex = [];
      for (i = j = 0, ref = this.container.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        console.log(i, this.container[i]);
        this.content[i] = [];
        if (this.container[i].innerText.length > 0) {
          this.content[i] = [];
          this.declarativeBuilder(i);
        }
      }
    }

    ShowYourTerms.prototype.declarativeBuilder = function(containerIndex) {
      var element, j, len, ref;
      ref = this.container[containerIndex].children;
      for (j = 0, len = ref.length; j < len; j++) {
        element = ref[j];
        this.content[containerIndex].push([
          element.getAttribute('data-action'), element.innerText, {
            styles: element.classList,
            delay: element.getAttribute('data-delay'),
            speed: element.getAttribute('data-speed')
          }
        ]);
      }
      this.container[containerIndex].style.minHeight = window.getComputedStyle(this.container[containerIndex], null).getPropertyValue("height");
      return this.play(containerIndex);
    };

    ShowYourTerms.prototype.addCommand = function(content, options) {
      return this.content[0].push(["command", content, options]);
    };

    ShowYourTerms.prototype.addLine = function(content, options) {
      return this.content[0].push(["line", content, options]);
    };

    ShowYourTerms.prototype.play = function(outputChild) {
      if (outputChild == null) {
        outputChild = 0;
      }
      this.container[outputChild].innerHTML = '';
      this.outputIndex[outputChild] = 0;
      return this.outputGenerator(this.content[outputChild][this.outputIndex[outputChild]], outputChild);
    };

    ShowYourTerms.prototype.callNextOutput = function(delay, outputChild) {
      this.outputIndex[outputChild] += 1;
      if (this.content[outputChild][this.outputIndex[outputChild]]) {
        return setTimeout(((function(_this) {
          return function() {
            return _this.outputGenerator(_this.content[outputChild][_this.outputIndex[outputChild]], outputChild);
          };
        })(this)), delay);
      } else if (this.replay) {
        return setTimeout(((function(_this) {
          return function() {
            return _this.play(outputChild);
          };
        })(this)), delay);
      }
    };

    ShowYourTerms.prototype.outputGenerator = function(output, outputChild) {
      var content, counter, currentLine, interval, options, speed, type;
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
        counter = 0;
        return interval = setInterval(((function(_this) {
          return function() {
            currentLine.appendChild(document.createTextNode(content[counter]));
            _this.container[outputChild].appendChild(currentLine);
            counter++;
            if (counter === content.length) {
              currentLine.classList.remove('active');
              _this.callNextOutput(options.delay, outputChild);
              return clearInterval(interval);
            }
          };
        })(this)), speed);
      } else {
        currentLine.appendChild(document.createTextNode(content));
        this.container[outputChild].appendChild(currentLine);
        currentLine.classList.remove('active');
        return this.callNextOutput(options.delay, outputChild);
      }
    };

    return ShowYourTerms;

  })();

}).call(this);
