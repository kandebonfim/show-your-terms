class @ShowYourTerms
  constructor: (@container, @replay = true, @termsOptions={}) ->
    defaultOptions = {
      single: false,
      pauseOnClick: true,
      copyOnDblClick: true,
      # overrideSpeed: 0,
      # overrideDelay: 1,
    }
    for key,val of defaultOptions
      if key not of @termsOptions
        @termsOptions[key] = val

    unless @container.nodeType
      @container = Array.prototype.slice.call(document.querySelectorAll(@container))
    
    @content = []
    @dynamic = []
    @outputIndex = []
    @termOptions = []
    toolbarData = '<div class="syt-statusbar"><div class="status"></div><ul class="tools"><li data-action="anim">Re-play</li><li data-action="copy">Copy to Clipboard</li><li data-action="pause">Pause</li><li data-action="full">Full View</li></ul></div>'
    
    if @container.length > 0
      total = @container.length-1
      if @termsOptions['single']
        total=0

      for i in [0..total]
        
        @content[i] = []
        @dynamic[i] = {
          status: "ready",
          timers: {} }
        @termOptions[i] = {
          animate: (!@container[i].classList.contains('noanimate')),
          statusbar: (!@container[i].classList.contains('nostatusbar'))
        }
        @container[i].innerHTML='<div>'+@container[i].innerHTML+'</div>'
        if @termOptions[i].statusbar
          @container[i].innerHTML+=toolbarData;
        # @dynamic[i].toolbar = @container[i].querySelectorAll('.syt-statusbar')
          
        @defineEvents i
        container = @container[i]
        @container[i] = @container[i].childNodes[0]

        if @container[i].innerText.length > 0
          @declarativeBuilder(i)          

  declarativeBuilder: (outputTerm) ->
    for element in @container[outputTerm].children
      @content[outputTerm].push [element.getAttribute('data-action'), element.innerText, {styles: element.classList, delay: element.getAttribute('data-delay'), speed: element.getAttribute('data-speed')}]
    @container[outputTerm].style.minHeight = window.getComputedStyle(@container[outputTerm], null).getPropertyValue "height"
    if @termOptions[outputTerm].animate
      @play(outputTerm)
    else
      @fullview(outputTerm)

  copyToClipboard: (outputTerm, line=-1) ->
    try 
      tar=document.createElement "textarea"
      document.body.append(tar)
      style={
        top:'-2em',
        left:'-2em',
        position:'fixed',
        background:'transparent',
        border : 'none',
        outline : 'none',
        boxShadow : 'none',
        padding:'0',
        overflow:'hidden',
        width:'2em',     # some browsers don't copy to clipboard if size is smaller
        height:'2em'
      }
      for st of style
        tar.style[st] = style[st];

      text=''
      if line==-1
        for el in @content[outputTerm]
          [type, content, options] = el;
          text+=content+"\n";        
      else
        [type, content, options] = @content[outputTerm][line++]
        lastType = type;
        text+=content+"\n";        
        while line < @content[outputTerm].length
          [type, content, options] = @content[outputTerm][line++]
          if type != lastType || type != 'line'
            break;
          lastType = type;
          text+=content+"\n";        

      tar.value=text

      tar.select()
      successful = document.execCommand('copy')
      unless successful
        alert "There was a problem copying to clipboard"

      # document.body.removeChild(tar)
    catch err
      alert "Sorry, your browser does not support it"

  defineEvents: (outputTerm) ->
    if @termsOptions['pauseOnClick']
      @container[outputTerm].addEventListener('click', ( =>
        @togglePause outputTerm
      ))
      
    if @termsOptions['copyOnDblClick']
      @container[outputTerm].addEventListener('dblclick', ((event) =>
        ele = event.target
        line = ele.getAttribute('data-line')
      
        @copyToClipboard outputTerm, line
      ), false)

    @container[outputTerm].addEventListener('mouseenter', ( =>
      @dynamic[outputTerm].mouseover = true
      if (@dynamic[outputTerm].timers.leaveReplay)
        clearInterval @dynamic[outputTerm].timers.leaveReplay
    ), false)
    
    @container[outputTerm].addEventListener('mouseleave', ( =>
      @dynamic[outputTerm].mouseover = false
      if @dynamic[outputTerm].leaveReplay
        @dynamic[outputTerm].leaveReplay=false
        @dynamic[outputTerm].timers.leaveReplay = setTimeout (=> @playagain outputTerm), 1000
    ), false)
    
    if @termOptions[outputTerm].statusbar
      toolbarElements = @container[outputTerm].querySelectorAll('.syt-statusbar .tools li')
      for toolbarElement in toolbarElements
        toolbarElement.addEventListener('click', ((event) =>
          event.stopPropagation();
          target = event.target.getAttribute ('data-action')
          if target == 'anim'
            @playagain outputTerm
          else if target == 'full'
            @fullview outputTerm
          else if target == 'pause'
            @togglePause outputTerm
          else if target == 'copy'
            @copyToClipboard outputTerm
      ))
      
   
  addCommand: (content, options, outputTerm=0) ->
    if outputTerm < @content.length
      @content[outputTerm].push ["command", content, options]

  addLine: (content, options, outputTerm=0) ->
    if outputTerm < @content.length
      @content[outputTerm].push ["line", content, options]

  clearTimers: (outputTerm=0) ->
    for timer of @dynamic[outputTerm].timers
      clearInterval(@dynamic[outputTerm].timers[timer])
      
  play: (outputTerm=0) ->
    if @dynamic[outputTerm].status == "ready"
      @clearTimers outputTerm
      @dynamic[outputTerm].status = "playing"
      @container[outputTerm].innerHTML=''
      @outputIndex[outputTerm] = 0
      @outputGenerator @content[outputTerm][@outputIndex[outputTerm]], outputTerm

  fullview: (outputTerm=0) ->
    @dynamic[outputTerm].status = "fullview"
    fullview=document.createElement "div"
    count=0
    for el in @content[outputTerm]
      [type, content, options] = el;
      currentLine = document.createElement "div"
      currentLine.setAttribute('data-line', count++)
      if options.styles then currentLine.setAttribute "class", options.styles

      if type == "command"
        if not currentLine.classList.contains 'type'
          currentLine.classList.add 'command'
      currentLine.append(content)
      fullview.append currentLine

    @container[outputTerm].innerHTML=fullview.innerHTML;
    @clearTimers outputTerm
    
  playagain: (outputTerm=0, mouseCheck=false) ->
    if mouseCheck && @dynamic[outputTerm].mouseover 
      @dynamic[outputTerm].leaveReplay=true
      @dynamic[outputTerm].status = "waiting"
      return
      
    @dynamic[outputTerm].status = "ready"
    @play outputTerm

  callNextOutput: (delay, outputTerm) ->
    if @isPlaying outputTerm
      @outputIndex[outputTerm] += 1
      if @termsOptions.overrideDelay then delay = @termsOptions.overrideDelay

      if @content[outputTerm][@outputIndex[outputTerm]]
        @dynamic[outputTerm].timers.output = setTimeout (=> @outputGenerator @content[outputTerm][@outputIndex[outputTerm]], outputTerm), delay
      else if @replay
        @dynamic[outputTerm].timers.replay = setTimeout (=> @playagain(outputTerm, true)), delay

  isPlaying: (outputTerm) ->
    return @dynamic[outputTerm].status == "playing"

  togglePause: (outputTerm) ->
    if @dynamic[outputTerm].status == "playing"
      @dynamic[outputTerm].status = "pause";
    else if @dynamic[outputTerm].status == "pause"
      @dynamic[outputTerm].status = "playing"

  outputGenerator: (output, outputTerm) ->
    [type, content, options] = output
    currentLine = document.createElement "div"
    if options.styles then currentLine.setAttribute "class", options.styles
    if options.speed then speed = options.speed else speed = 100
    if @termsOptions.overrideSpeed then speed = @termsOptions.overrideSpeed

    currentLine.classList.add 'active'
    currentLine.setAttribute('data-line', @outputIndex[outputTerm])

    if type == "command"
      if not currentLine.classList.contains 'type'
        currentLine.classList.add 'command'
      counter = 0
      @dynamic[outputTerm].timers.command = setInterval ( =>
        if @isPlaying outputTerm
          currentLine.appendChild document.createTextNode(content[counter])
          @container[outputTerm].appendChild currentLine
          counter++
          if counter == content.length
            currentLine.classList.remove 'active'
            @callNextOutput options.delay,outputTerm
            clearInterval @dynamic[outputTerm].timers.command
      ), speed
    else
      if not @isPlaying outputTerm
        @dynamic[outputTerm].timers.pause = setInterval ( =>
          if @isPlaying outputTerm
            clearInterval @dynamic[outputTerm].timers.pause
            @callNextOutput options.delay,outputTerm
	), speed
      else
        currentLine.appendChild document.createTextNode(content)
        @container[outputTerm].appendChild currentLine
        currentLine.classList.remove 'active'
        @callNextOutput options.delay,outputTerm
