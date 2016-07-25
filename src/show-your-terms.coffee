class @ShowYourTerms
  constructor: (@container, @replay = true) ->
    unless @container.nodeType
      @container = document.querySelector(@container)
    @content = []
    if @container.innerText.length > 0
      @declarativeBuilder()

  declarativeBuilder: ->
    for element in @container.children
      @content.push [element.getAttribute('data-action'), element.innerText, {styles: element.classList, delay: element.getAttribute('data-delay'), speed: element.getAttribute('data-speed')}]
    @container.style.minHeight = window.getComputedStyle(@container, null).getPropertyValue "height"
    @play()

  addCommand: (content, options) ->
    @content.push ["command", content, options]

  addLine: (content, options) ->
    @content.push ["line", content, options]

  play: ->
    @container.innerHTML = ''
    @outputIndex = 0
    @outputGenerator @content[@outputIndex]

  callNextOutput: (delay) ->
    @outputIndex += 1
    if @content[@outputIndex]
      setTimeout (=> @outputGenerator @content[@outputIndex]), delay
    else if @replay
      setTimeout (=> @play()), delay

  outputGenerator: (output) ->
    [type, content, options] = output
    currentLine = document.createElement "div"

    if options.styles then currentLine.setAttribute "class", options.styles
    if options.speed then speed = options.speed else speed = 100
    currentLine.classList.add 'active'

    if type == "command"
      counter = 0
      interval = setInterval ( =>
        currentLine.appendChild document.createTextNode(content[counter])
        @container.appendChild currentLine
        counter++
        if counter == content.length
          currentLine.classList.remove 'active'
          @callNextOutput options.delay
          clearInterval interval
      ), speed
    else
      currentLine.appendChild document.createTextNode(content)
      @container.appendChild currentLine
      currentLine.classList.remove 'active'
      @callNextOutput options.delay
