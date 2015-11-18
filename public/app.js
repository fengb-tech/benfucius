String.prototype.format = function () {
  var s = this
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm")
    s = s.replace(reg, arguments[i])
  }

  return s
}

$.fn.serializeJSON = function () {
  var array = this.serializeArray()
  var json = {}
  for (var i = 0; i < array.length; i++) {
    var element = array[i]
    json[element.name] = element.value
  }
  return json
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
    Recaptcha.load(data.recaptcha.SITE_KEY)
  }
}

var Lightbox = {
  show: function ($e, css) {
    if (this.$lightboxWrapper) {
      this.hide()
    }

    this.$lightboxWrapper = $('<div class="lightbox-wrapper">').appendTo('body')
    var $lightbox = $('<div class="lightbox">').appendTo(this.$lightboxWrapper)
    if (css) {
      $lightbox.css(css)
    }
    $lightbox.append($e)
    $(document).on('keyup', function (event) {
      if (event.keyCode === 27) {
        Lightbox.hide()
      }
    })
    this.$lightboxWrapper.on('click', function (event) {
      if (event.target !== $lightbox[0]) {
        Lightbox.hide()
      }
    })
  },

  hide: function () {
    this.$lightboxWrapper.remove()
    $(document).off('keypress')
  },
}

var Recaptcha = {
  load: function (siteKey) {
    var $form = $('<form method="POST">')
    $form.append('<div class="g-recaptcha" data-sitekey="{0}">'.format(siteKey))
    Lightbox.show($form, { width: 300 })

    $.getScript('https://www.google.com/recaptcha/api.js')

    var poll = setInterval(function () {
      var recaptchaVal = $form.find('.g-recaptcha-response').val()
      if (recaptchaVal) {
        clearInterval(poll)
        setTimeout(function () {
          Recaptcha.submit($form)
        }, 1000)
      }
    }, 100)
  },

  submit: function ($form) {
    $.ajax({
      url:    '/session',
      method: 'POST',
      data: $form.serializeJSON(),
      success: function () {
        Lightbox.hide()
      },
      error: function (xhr) {
        Recaptcha.load(xhr.responseJSON.recaptcha.SITE_KEY)
      },
    })
  },
}

$('.vote-form').on('submit', function (event) {
  event.preventDefault()

  var $form = $(this)

  $.ajax({
    url:     $form.attr('action'),
    method:  $form.attr('method'),
    data:    $form.serializeJSON(),
    success: ajaxUpdateAll,
  })
})
