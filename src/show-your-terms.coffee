class @ShowYourTerms
  constructor: (@container, @replay = true) ->
    unless @container.nodeType
      @container = document.querySelector(@container)
    @content = []
    if @container.innerText.length > 0
      @declarativeBuilder()

  declarativeBuilder: ->
    for element in @container.children
      options = {styles: element.classList, delay: element.getAttribute('data-delay')}
      if element.getAttribute('data-action') == "command"
        @addCommand element.innerText, options
      else
        @addLine element.innerText, options
    @container.style.height = window.getComputedStyle(@container, null).getPropertyValue("height")
    @play()

  addCommand: (content, options) ->
    @content.push ["command", content, options]

  addLine: (content, options) ->
    @content.push ["line", content, options]

  play: ->
    @container.innerHTML = ''
    @outputIndex = 0
    @outputGenerator(@content[@outputIndex])

  callNextOutput: (delay) ->
    @outputIndex += 1
    if @content[@outputIndex]
      setTimeout (=> @outputGenerator @content[@outputIndex]), delay
    else if @replay
      setTimeout (=> @play()), delay

  outputGenerator: (output) ->
    [type, content, options] = output
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
