String.prototype.format = function () {
  var s = this
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm")
    s = s.replace(reg, arguments[i])
  }

  return s
}

function update (data) {
  $.each(data, function (objectType, objectData) {
    var $parentE = $('[data-{0}-id="{1}"]'.format(objectType, objectData.id))
    $.each(data.quote, function (field, value) {
      var $e = $parentE.find('[data-{0}-field="{1}"]'.format(objectType, field))
      $e.text(value)
    })
  })
}

$('.vote-form').on('submit', function (event) {
  event.preventDefault()

  var $form = $(this)
  var json = $form.serializeArray()[0]

  $.ajax({
    url:     $form.attr('action'),
    method:  $form.attr('method'),
    data:    json,
    success: update,
  })
})
