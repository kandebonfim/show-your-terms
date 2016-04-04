class ShowYourTerms
  constructor: (@container, @content) ->
    @container = document.querySelector(@container)
    @outputsParser()

  outputsParser: ->
    for type, content of @content
      @outputGenerator type, content

  outputGenerator: (type, content) ->
    type_split = type.split(':')
    type = type_split[0]
    classnames = type_split.slice(1,type_split.lenght).join(' ')
    switch type
      when "command"
        @outputLine content, classnames
      when "line"
        @outputLine content, classnames

  outputLine: (content, classnames) ->
    current = document.createElement("div")
    current.setAttribute("class", classnames)
    text = document.createTextNode(content)
    current.appendChild(text)
    @container.appendChild(current)

# Helpers
delay = (ms, func) -> setTimeout func, ms

# Demo
terminalDrops = {
  "command": "hello, show your terms!",
  "line:yellow:bold": "hello, motherfocka!"
}

delay 200, -> new ShowYourTerms('.terminal', terminalDrops)
