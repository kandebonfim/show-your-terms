class ShowYourTerms
  constructor: (@container, @content) ->
    @container = document.querySelector(@container)
    @outputsParser()

  outputsParser: ->
    for type, content of @content
      @outputGenerator type, content

  outputGenerator: (type, content) ->
    switch type
      when "command"
        console.log type
      when "line"
        @outputLine content

  outputLine: (content) ->
    current = document.createElement("div")
    text = document.createTextNode(content)
    current.appendChild(text)
    @container.appendChild(current)

# # Helpers
# delay = (ms, func) -> setTimeout func, ms

# # Demo
# terminalDrops = {
#   "command": "hello, show your terms!",
#   "line": "hello, motherfocka!"
# }

# delay 200, -> new ShowYourTerms('.terminal', terminalDrops)
