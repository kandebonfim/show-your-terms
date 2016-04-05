class ShowYourTerms
  constructor: (@container, @content) ->
    @container = document.querySelector(@container)
    @outputIndex = 0
    @outputGenerator(@content[@outputIndex])

  outputGenerator: (output) ->
    type_split = output[0].split(':')
    type = type_split[0]
    content = output[1]
    classnames = type_split.slice(1,type_split.lenght).join(' ')

    currentLine = document.createElement("div")

    if classnames
      currentLine.setAttribute("class", classnames)

    switch type
      when "command"
        characters = content.split('')

        counter = 0
        interval = setInterval(( =>
          console.log characters[counter]

          text = document.createTextNode(characters[counter])
          currentLine.appendChild(text)
          @container.appendChild(currentLine)

          counter++
          if counter == characters.length
            @callNextOutput(@outputIndex)
            clearInterval interval
        ), 100)

      when "line"
        console.log content
        text = document.createTextNode(content)
        currentLine.appendChild(text)
        @container.appendChild(currentLine)

        @callNextOutput(@outputIndex)

  callNextOutput: (index) ->
    @outputIndex = @outputIndex + 1
    if @content[@outputIndex]
      @outputGenerator(@content[@outputIndex])

# Helpers
delay = (ms, func) => setTimeout func, ms

# Demo
terminalDrops = [
  ["command", "hello, show your terms!"],
  ["line:yellow:bold", "hello, motherfocka!"]
  ["line:yellow:bold", "oi, teste!"]
]

delay 200, => new ShowYourTerms('.terminal', terminalDrops)
