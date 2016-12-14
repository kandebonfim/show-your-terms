(function() {
  this.ShowYourTerms = (function() {
    function ShowYourTerms(container1, replay, termsOptions) {
      var container, defaultOptions, i, j, key, ref, toolbarData, total, val;
      this.container = container1;
      this.replay = replay != null ? replay : true;
      this.termsOptions = termsOptions != null ? termsOptions : {};
      defaultOptions = {
        single: false,
        pauseOnClick: true,
        copyOnDblClick: true
      };
      for (key in defaultOptions) {
        val = defaultOptions[key];
        if (!(key in this.termsOptions)) {
          this.termsOptions[key] = val;
        }
      }
      if (!this.container.nodeType) {
        this.container = Array.prototype.slice.call(document.querySelectorAll(this.container));
      }
      this.content = [];
      this.dynamic = [];
      this.outputIndex = [];
      this.termOptions = [];
      toolbarData = '<div class="syt-statusbar"><div class="status"></div><ul class="tools"><li data-action="anim">Re-play</li><li data-action="copy">Copy to Clipboard</li><li data-action="pause">Pause</li><li data-action="full">Full View</li></ul></div>';
      if (this.container.length > 0) {
        total = this.container.length - 1;
        if (this.termsOptions['single']) {
          total = 0;
        }
        for (i = j = 0, ref = total; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          this.content[i] = [];
          this.dynamic[i] = {
            status: "ready",
            timers: {}
          };
          this.termOptions[i] = {
            animate: !this.container[i].classList.contains('noanimate'),
            statusbar: !this.container[i].classList.contains('nostatusbar')
          };
          this.container[i].innerHTML = '<div>' + this.container[i].innerHTML + '</div>';
          if (this.termOptions[i].statusbar) {
            this.container[i].innerHTML += toolbarData;
          }
          this.defineEvents(i);
          container = this.container[i];
          this.container[i] = this.container[i].childNodes[0];
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
      if (this.termOptions[outputTerm].statusbar) {
        this.container[outputTerm].style.minHeight = parseInt(this.container[outputTerm].style.minHeight) + 26 + "px";
      }
      if (this.termOptions[outputTerm].animate) {
        return this.play(outputTerm);
      } else {
        return this.fullview(outputTerm);
      }
    };

    ShowYourTerms.prototype.copyToClipboard = function(outputTerm, line) {
      var content, el, err, error, j, lastType, len, options, ref, ref1, ref2, st, style, successful, tar, text, type;
      if (line == null) {
        line = -1;
      }
      try {
        tar = document.createElement("textarea");
        document.body.append(tar);
        style = {
          top: '-2em',
          left: '-2em',
          position: 'fixed',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          padding: '0',
          overflow: 'hidden',
          width: '2em',
          height: '2em'
        };
        for (st in style) {
          tar.style[st] = style[st];
        }
        text = '';
        if (line === -1) {
          ref = this.content[outputTerm];
          for (j = 0, len = ref.length; j < len; j++) {
            el = ref[j];
            type = el[0], content = el[1], options = el[2];
            text += content + "\n";
          }
        } else {
          ref1 = this.content[outputTerm][line++], type = ref1[0], content = ref1[1], options = ref1[2];
          lastType = type;
          text += content + "\n";
          while (line < this.content[outputTerm].length) {
            ref2 = this.content[outputTerm][line++], type = ref2[0], content = ref2[1], options = ref2[2];
            if (type !== lastType || type !== 'line') {
              break;
            }
            lastType = type;
            text += content + "\n";
          }
        }
        tar.value = text;
        tar.select();
        successful = document.execCommand('copy');
        if (!successful) {
          return alert("There was a problem copying to clipboard");
        }
      } catch (error) {
        err = error;
        return alert("Sorry, your browser does not support it");
      }
    };

    ShowYourTerms.prototype.defineEvents = function(outputTerm) {
      var j, len, results, toolbarElement, toolbarElements;
      if (this.termsOptions['pauseOnClick']) {
        this.container[outputTerm].addEventListener('click', ((function(_this) {
          return function() {
            return _this.togglePause(outputTerm);
          };
        })(this)));
      }
      if (this.termsOptions['copyOnDblClick']) {
        this.container[outputTerm].addEventListener('dblclick', ((function(_this) {
          return function(event) {
            var ele, line;
            ele = event.target;
            line = ele.getAttribute('data-line');
            return _this.copyToClipboard(outputTerm, line);
          };
        })(this)), false);
      }
      this.container[outputTerm].addEventListener('mouseenter', ((function(_this) {
        return function() {
          _this.dynamic[outputTerm].mouseover = true;
          if (_this.dynamic[outputTerm].timers.leaveReplay) {
            return clearInterval(_this.dynamic[outputTerm].timers.leaveReplay);
          }
        };
      })(this)), false);
      this.container[outputTerm].addEventListener('mouseleave', ((function(_this) {
        return function() {
          _this.dynamic[outputTerm].mouseover = false;
          if (_this.dynamic[outputTerm].leaveReplay) {
            _this.dynamic[outputTerm].leaveReplay = false;
            return _this.dynamic[outputTerm].timers.leaveReplay = setTimeout((function() {
              return _this.playagain(outputTerm);
            }), 1000);
          }
        };
      })(this)), false);
      if (this.termOptions[outputTerm].statusbar) {
        toolbarElements = this.container[outputTerm].querySelectorAll('.syt-statusbar .tools li');
        results = [];
        for (j = 0, len = toolbarElements.length; j < len; j++) {
          toolbarElement = toolbarElements[j];
          results.push(toolbarElement.addEventListener('click', ((function(_this) {
            return function(event) {
              var target;
              event.stopPropagation();
              target = event.target.getAttribute('data-action');
              if (target === 'anim') {
                return _this.playagain(outputTerm);
              } else if (target === 'full') {
                return _this.fullview(outputTerm);
              } else if (target === 'pause') {
                return _this.togglePause(outputTerm);
              } else if (target === 'copy') {
                return _this.copyToClipboard(outputTerm);
              }
            };
          })(this))));
        }
        return results;
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

    ShowYourTerms.prototype.clearTimers = function(outputTerm) {
      var results, timer;
      if (outputTerm == null) {
        outputTerm = 0;
      }
      results = [];
      for (timer in this.dynamic[outputTerm].timers) {
        results.push(clearInterval(this.dynamic[outputTerm].timers[timer]));
      }
      return results;
    };

    ShowYourTerms.prototype.play = function(outputTerm) {
      if (outputTerm == null) {
        outputTerm = 0;
      }
      if (this.dynamic[outputTerm].status === "ready") {
        this.clearTimers(outputTerm);
        this.dynamic[outputTerm].status = "playing";
        this.container[outputTerm].innerHTML = '';
        this.outputIndex[outputTerm] = 0;
        return this.outputGenerator(this.content[outputTerm][this.outputIndex[outputTerm]], outputTerm);
      }
    };

    ShowYourTerms.prototype.fullview = function(outputTerm) {
      var content, count, currentLine, el, fullview, j, len, options, ref, type;
      if (outputTerm == null) {
        outputTerm = 0;
      }
      this.dynamic[outputTerm].status = "fullview";
      fullview = document.createElement("div");
      count = 0;
      ref = this.content[outputTerm];
      for (j = 0, len = ref.length; j < len; j++) {
        el = ref[j];
        type = el[0], content = el[1], options = el[2];
        currentLine = document.createElement("div");
        currentLine.setAttribute('data-line', count++);
        if (options.styles) {
          currentLine.setAttribute("class", options.styles);
        }
        if (type === "command") {
          if (!currentLine.classList.contains('type')) {
            currentLine.classList.add('command');
          }
        }
        currentLine.append(content);
        fullview.append(currentLine);
      }
      this.container[outputTerm].innerHTML = fullview.innerHTML;
      return this.clearTimers(outputTerm);
    };

    ShowYourTerms.prototype.playagain = function(outputTerm, mouseCheck) {
      if (outputTerm == null) {
        outputTerm = 0;
      }
      if (mouseCheck == null) {
        mouseCheck = false;
      }
      if (mouseCheck && this.dynamic[outputTerm].mouseover) {
        this.dynamic[outputTerm].leaveReplay = true;
        this.dynamic[outputTerm].status = "waiting";
        return;
      }
      this.dynamic[outputTerm].status = "ready";
      return this.play(outputTerm);
    };

    ShowYourTerms.prototype.callNextOutput = function(delay, outputTerm) {
      if (this.isPlaying(outputTerm)) {
        this.outputIndex[outputTerm] += 1;
        if (this.termsOptions.overrideDelay) {
          delay = this.termsOptions.overrideDelay;
        }
        if (this.content[outputTerm][this.outputIndex[outputTerm]]) {
          return this.dynamic[outputTerm].timers.output = setTimeout(((function(_this) {
            return function() {
              return _this.outputGenerator(_this.content[outputTerm][_this.outputIndex[outputTerm]], outputTerm);
            };
          })(this)), delay);
        } else if (this.replay) {
          return this.dynamic[outputTerm].timers.replay = setTimeout(((function(_this) {
            return function() {
              return _this.playagain(outputTerm, true);
            };
          })(this)), delay);
        }
      }
    };

    ShowYourTerms.prototype.isPlaying = function(outputTerm) {
      return this.dynamic[outputTerm].status === "playing";
    };

    ShowYourTerms.prototype.togglePause = function(outputTerm) {
      if (this.dynamic[outputTerm].status === "playing") {
        return this.dynamic[outputTerm].status = "pause";
      } else if (this.dynamic[outputTerm].status === "pause") {
        return this.dynamic[outputTerm].status = "playing";
      }
    };

    ShowYourTerms.prototype.outputGenerator = function(output, outputTerm) {
      var content, counter, currentLine, options, speed, type;
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
      if (this.termsOptions.overrideSpeed) {
        speed = this.termsOptions.overrideSpeed;
      }
      currentLine.classList.add('active');
      currentLine.setAttribute('data-line', this.outputIndex[outputTerm]);
      if (type === "command") {
        if (!currentLine.classList.contains('type')) {
          currentLine.classList.add('command');
        }
        counter = 0;
        return this.dynamic[outputTerm].timers.command = setInterval(((function(_this) {
          return function() {
            if (_this.isPlaying(outputTerm)) {
              currentLine.appendChild(document.createTextNode(content[counter]));
              _this.container[outputTerm].appendChild(currentLine);
              counter++;
              if (counter === content.length) {
                currentLine.classList.remove('active');
                _this.callNextOutput(options.delay, outputTerm);
                return clearInterval(_this.dynamic[outputTerm].timers.command);
              }
            }
          };
        })(this)), speed);
      } else {
        if (!this.isPlaying(outputTerm)) {
          return this.dynamic[outputTerm].timers.pause = setInterval(((function(_this) {
            return function() {
              if (_this.isPlaying(outputTerm)) {
                clearInterval(_this.dynamic[outputTerm].timers.pause);
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
