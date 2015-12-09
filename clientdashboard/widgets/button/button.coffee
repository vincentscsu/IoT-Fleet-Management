class Dashing.Button extends Dashing.Widget
  status = "unregistered"
  ready: ->
    $("#btn").click ->
      $.ajax 'http://ec2-52-91-167-181.compute-1.amazonaws.com:3000/api/run',
        type: 'GET'
        dataType: "jsonp"
        success:(data)->
          console.log(data)
          alert(data);
    setInterval(@updateProgress, 100)
    setInterval(@updateStatus, 100)

  updateStatus: =>
    status = $('.status')
  updateProgress: =>
    array = $('.progress')
    i = 0
    while i < array.length
      t = array[i]
      bar = t.childNodes[3]
      width = t.childNodes[1].innerHTML 
      bar.style.width = width + '%'
      t.style.display = if width=="0" then "none" else "inline-block"
      i++
