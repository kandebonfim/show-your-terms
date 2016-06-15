class @ShowYourTerms
  constructor: (@container, @replay = true) ->
    unless @container.nodeType
      @container = document.querySelector(@container)
    @outputIndex = 0
    @content = []
    if @container.innerText.length > 0
      @declarativeBuilder()

  declarativeBuilder: ->
    for element in @container.children
      if element.getAttribute('data-action') == "command"
        @addCommand element.innerText, {styles: element.classList, delay: element.getAttribute('data-delay')}
      else
        @addLine element.innerText, {styles: element.classList, delay: element.getAttribute('data-delay')}
    @container.style.height = window.getComputedStyle(@container, null).getPropertyValue("height")
    @container.innerHTML = ''
    @start()

  addCommand: (content, options = {}) ->
    @content.push ["command", content, options]

  addLine: (content, options = {}) ->
    @content.push ["line", content, options]

  start: ->
    @outputGenerator(@content[@outputIndex])

  callNextOutput: (delay = 800) ->
    @outputIndex = @outputIndex + 1
    if @content[@outputIndex]
      waitForIt delay, => @outputGenerator(@content[@outputIndex])
    else
      if @replay
        @outputIndex = -1
        waitForIt delay, =>
          @callNextOutput()
          @container.innerHTML = ''

  outputGenerator: (output) ->
    type = output[0]
    content = output[1]
    options = output[2]
    currentLine = document.createElement("div")

    if options.styles then currentLine.setAttribute("class", options.styles)
    if options.speed then speed = options.speed else speed = 100
    currentLine.classList.add('active')

    if type == "command"
      characters = content.split('')

      counter = 0
      interval = setInterval(( =>
        text = document.createTextNode(characters[counter])
        currentLine.appendChild(text)
        @container.appendChild(currentLine)
        counter++

        if counter == characters.length
          currentLine.classList.remove('active')
          @callNextOutput(options.delay)
          clearInterval interval
      ), speed)
    else
      text = document.createTextNode(content)
      currentLine.appendChild(text)
      @container.appendChild(currentLine)

      currentLine.classList.remove('active')
      @callNextOutput(options.delay)

# Helpers
waitForIt = (ms, func) => setTimeout func, ms
