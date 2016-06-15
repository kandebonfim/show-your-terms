class @ShowYourTerms
  constructor: (@container, @replay = true) ->
    @outputIndex = 0
    @content = []

  addCommand: (content, options = {}) ->
    @content.push ["command", content, options]
    return self

  addLine: (content, options = {}) ->
    @content.push ["line", content, options]

  start: ->
    @outputGenerator(@content[@outputIndex])

  callNextOutput: (index, delay = 800) ->
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

    if options.styles
      currentLine.setAttribute("class", options.styles)

    if options.speed then speed = options.speed else speed = 100

    currentLine.className += " active"

    switch type
      when "command"
        characters = content.split('')

        counter = 0
        interval = setInterval(( =>
          text = document.createTextNode(characters[counter])
          currentLine.appendChild(text)
          @container.appendChild(currentLine)

          counter++

          if counter == characters.length
            @removeClass(currentLine, 'active')
            @callNextOutput(@outputIndex, options.delay)
            clearInterval interval
        ), speed)

      when "line"
        text = document.createTextNode(content)
        currentLine.appendChild(text)
        @container.appendChild(currentLine)

        @removeClass(currentLine, 'active')
        @callNextOutput(@outputIndex, options.delay)

  removeClass: (el, classname) ->
    el.className = el.className.replace(classname,'')

# Helpers
waitForIt = (ms, func) => setTimeout func, ms
