String.prototype.format = function () {
  var s = this
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm")
    s = s.replace(reg, arguments[i])
  }

  return s
}

function ajaxUpdateAll (data) {
  $.each(data, function (objectType, objectData) {
    var $parentE = $('[data-{0}-id="{1}"]'.format(objectType, objectData.id))
    $.each(objectData, function (field, value) {
      var $e = $parentE.find('[data-{0}-field="{1}"]'.format(objectType, field))
      $e.text(value)
    })
  })

  if (data.recaptcha && data.recaptcha.SITE_KEY) {
    loadRecaptcha(data.recaptcha.SITE_KEY)
  }
}

function loadRecaptcha (siteKey) {
  var $lightboxWrapper = $('<div class="lightbox-wrapper">').appendTo('body')
  var $lightbox = $('<div class="lightbox">').appendTo($lightboxWrapper)
  var $form = $('<form method="POST">').appendTo($lightbox)
  $form.append('<div class="g-recaptcha" data-sitekey="{0}">'.format(siteKey))
  $.getScript('https://www.google.com/recaptcha/api.js')

  var poll = setInterval(function () {
    var recaptchaVal = $form.find('.g-recaptcha-response').val()
    if (recaptchaVal) {
      clearInterval(poll)
      setTimeout(function () {
        $.ajax({
          url:    '/session',
          method: 'POST',
          data: { 'g-recaptcha-response': recaptchaVal },
          success: function () {
            $lightboxWrapper.remove()
          }
        })
      }, 1000)
    }
  }, 100)
}

$('.vote-form').on('submit', function (event) {
  event.preventDefault()

  var $form = $(this)
  var json = $form.serializeArray()[0]

  $.ajax({
    url:     $form.attr('action'),
    method:  $form.attr('method'),
    data:    json,
    success: ajaxUpdateAll,
  })
})
