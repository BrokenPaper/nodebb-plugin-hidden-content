/* /* globals define, app, ajaxify, bootbox, socket, templates, utils */

require(['forum/topic/images', 'translator'], function(images, translator) {
  var elements = {
      BUTTON: '.hidden-content-control a',
      CONTENT: '.hidden-content-content ',
      MAIN: '.hidden-content',
      POST: '[component="post"]'
    },
    classes = {
      OPEN_EYE: 'fa-lock',
      CLOSE_EYE: 'fa-unlock-alt'
    }

  $(window).on('action:topic.loading', function(e) {
    addTopicListener()
  })

  function addTopicListener() {
    $('[component="topic"]').on('click', elements.BUTTON, function() {
      toggle($(this))
    })
  }

  function toggle($button) {
    var $spoiler = $button.parents(elements.MAIN),
      $content = $spoiler.find(elements.CONTENT),
      open = $spoiler.attr('data-open') === 'true',
      postId = parseInt($spoiler.parents('[data-pid]').attr('data-pid')),
      index = parseInt($spoiler.attr('data-index')),
      icon = $button.find('i')

    $spoiler.attr('data-open', !open)

    if (!open) {
      icon.removeClass(classes.OPEN_EYE).addClass(classes.CLOSE_EYE)
    } else {
      icon.removeClass(classes.CLOSE_EYE).addClass(classes.OPEN_EYE)
    }

    // Check if content is empty
    if ($content.html().length === 0) {
      socket.emit('plugins.hidden-content.getSpoilerContent', { index: index, postId: postId }, function(error, content) {
        if (error) {
          
          app.alertError(error.message)
          return;


        }
        $content.html(content)
        
        /* 
        
        这函数还存在吗
        images.unloadImages($spoiler.parents(elements.POST))
        images.loadImages() */
      })
    }
  }
})
