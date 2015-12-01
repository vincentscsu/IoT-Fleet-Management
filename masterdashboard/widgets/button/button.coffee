class Dashing.Button extends Dashing.Widget
  ready: ->
    $("#btn").click ->
      $.ajax 'http://ec2-52-91-167-181.compute-1.amazonaws.com:3000/api/run',
        type: 'GET'
        dataType: "jsonp"
        success:(data)->
          console.log(data)
          alert(data);
