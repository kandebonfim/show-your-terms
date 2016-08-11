class @ShowYourTerms
  constructor: (@container, @replay = true, @termsOptions={}) ->
    defaultOptions = { single: false,
    pauseOnClick: true }
    for key,val of defaultOptions
      if key not of @termsOptions
        @termsOptions[key] = val

    unless @container.nodeType
      @container = document.querySelectorAll(@container)
    @content = []
    @sstatus = []
    @outputIndex = []
    if @container.length > 0
      total = @container.length-1
      if @termsOptions['single']
        total=0
      for i in [0..total] 
        @content[i] = []
        @sstatus[i] = "ready"
        @defineEvents i
        if @container[i].innerText.length > 0
          @declarativeBuilder(i)

  declarativeBuilder: (outputTerm) ->
    for element in @container[outputTerm].children
      @content[outputTerm].push [element.getAttribute('data-action'), element.innerText, {styles: element.classList, delay: element.getAttribute('data-delay'), speed: element.getAttribute('data-speed')}]
    @container[outputTerm].style.minHeight = window.getComputedStyle(@container[outputTerm], null).getPropertyValue "height"
    @play(outputTerm)

  defineEvents: (outputTerm) ->
    if @termsOptions['pauseOnClick']
      @container[outputTerm].addEventListener('click', ( =>
        @togglePause outputTerm
      ))

  addCommand: (content, options, outputTerm=0) ->
    if outputTerm < @content.length
      @content[outputTerm].push ["command", content, options]

  addLine: (content, options, outputTerm=0) ->
    if outputTerm < @content.length
      @content[outputTerm].push ["line", content, options]

  play: (outputTerm=0) ->
    if @sstatus[outputTerm] == "ready"
      @sstatus[outputTerm] = "playing"
      @container[outputTerm].innerHTML = ''
      @outputIndex[outputTerm] = 0
      @outputGenerator @content[outputTerm][@outputIndex[outputTerm]], outputTerm

  playagain: (outputTerm=0) ->
    @sstatus[outputTerm] = "ready"
    @play outputTerm

  callNextOutput: (delay, outputTerm) ->
    @outputIndex[outputTerm] += 1
    if @content[outputTerm][@outputIndex[outputTerm]]
      setTimeout (=> @outputGenerator @content[outputTerm][@outputIndex[outputTerm]], outputTerm), delay
    else if @replay
      setTimeout (=> @playagain(outputTerm)), delay

  isPlaying: (outputTerm) ->
    return @sstatus[outputTerm] == "playing"

  togglePause: (outputTerm) ->
    if @sstatus[outputTerm] == "playing"
      @sstatus[outputTerm] = "pause";
    else if @sstatus[outputTerm] == "pause"
      @sstatus[outputTerm] = "playing"

  outputGenerator: (output, outputTerm) ->
    [type, content, options] = output
    currentLine = document.createElement "div"
    if options.styles then currentLine.setAttribute "class", options.styles
    if options.speed then speed = options.speed else speed = 100
    currentLine.classList.add 'active'

    if type == "command"
      counter = 0
      interval = setInterval ( =>
        if @isPlaying outputTerm
          currentLine.appendChild document.createTextNode(content[counter])
          @container[outputTerm].appendChild currentLine
          counter++
          if counter == content.length
            currentLine.classList.remove 'active'
            @callNextOutput options.delay,outputTerm
            clearInterval interval
      ), speed
    else
      if not @isPlaying outputTerm
        pauseInterval = setInterval ( =>
          if @isPlaying outputTerm
            clearInterval pauseInterval
	), speed
      else
        currentLine.appendChild document.createTextNode(content)
        @container[outputTerm].appendChild currentLine
        currentLine.classList.remove 'active'
        @callNextOutput options.delay,outputTerm
