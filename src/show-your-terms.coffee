class @ShowYourTerms
  constructor: (@container, @replay = true) ->
    unless @container.nodeType
      @container = document.querySelectorAll(@container)
    @content = []
    @outputIndex = []
    for i in [0..@container.length-1] 
      console.log(i, @container[i])
      @content[i] = []
      if @container[i].innerText.length > 0
        @content[i] = []
        @declarativeBuilder(i)

  declarativeBuilder: (containerIndex) ->
    for element in @container[containerIndex].children
      @content[containerIndex].push [element.getAttribute('data-action'), element.innerText, {styles: element.classList, delay: element.getAttribute('data-delay'), speed: element.getAttribute('data-speed')}]
    @container[containerIndex].style.minHeight = window.getComputedStyle(@container[containerIndex], null).getPropertyValue "height"
    @play(containerIndex)

  addCommand: (content, options) ->
    @content[0].push ["command", content, options]

  addLine: (content, options) ->
    @content[0].push ["line", content, options]

  play: (outputChild=0) ->
    @container[outputChild].innerHTML = ''
    @outputIndex[outputChild] = 0
    @outputGenerator @content[outputChild][@outputIndex[outputChild]], outputChild

  callNextOutput: (delay, outputChild) ->
    @outputIndex[outputChild] += 1
    if @content[outputChild][@outputIndex[outputChild]]
      setTimeout (=> @outputGenerator @content[outputChild][@outputIndex[outputChild]], outputChild), delay
    else if @replay
      setTimeout (=> @play(outputChild)), delay

  outputGenerator: (output, outputChild) ->
    [type, content, options] = output
    currentLine = document.createElement "div"
    if options.styles then currentLine.setAttribute "class", options.styles
    if options.speed then speed = options.speed else speed = 100
    currentLine.classList.add 'active'

    if type == "command"
      counter = 0
      interval = setInterval ( =>
        currentLine.appendChild document.createTextNode(content[counter])
        @container[outputChild].appendChild currentLine
        counter++
        if counter == content.length
          currentLine.classList.remove 'active'
          @callNextOutput options.delay,outputChild
          clearInterval interval
      ), speed
    else
      currentLine.appendChild document.createTextNode(content)
      @container[outputChild].appendChild currentLine
      currentLine.classList.remove 'active'
      @callNextOutput options.delay,outputChild
