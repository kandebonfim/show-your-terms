class ShowYourTerms
  constructor: (@container, @content) ->
    @container = document.querySelectorAll(@container)
    @outputsParser()

  outputsParser: ->
    for type, content of @content
      @outputGenerator type, content

  outputGenerator: (type, content) ->
    console.log type, content

terminalDrops = {
  "command": "hello, show your terms!",
  "line": "hello, motherfocka!"
}

new ShowYourTerms('.terminal', terminalDrops)
