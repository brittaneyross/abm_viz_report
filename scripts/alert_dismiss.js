$(function(){
    $("#close").on("click", function(){
        $('#about').hide()
        $('#recall').show()
    })
})

$(function(){
    $("#recall").on("click", function(){
        $('#about').show()
        $('#recall').hide()
    })
})

