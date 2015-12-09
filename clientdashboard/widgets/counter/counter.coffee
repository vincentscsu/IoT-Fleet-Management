class Dashing.Counter extends Dashing.Widget
  h = 1
  m = 0
  s = 0
  ready: ->
    setInterval(@startTime, 1000)

  startTime: =>
    if (s==0&&m==0&&h==0) then return
    s = s-1

    if (s<0) then s = 59; m = m-1
    if (m<0) then m = 59; h = h-1

    m = @formatTime(m)
    s = @formatTime(s)
    @set('time', h + ":" + m + ":" + s)

  formatTime: (i) ->
    if i < 10 then "0" + i else i