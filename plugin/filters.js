;(function(Filters) {
  'use strict'

  var controller = require('./controller')

  Filters.composerFormatting = function(payload, callback) {
    payload.options.push({
      name: 'hidden-content',
      className: 'fa fa-paper-plane'
    })
    callback(null, payload)
  }

  Filters.composerHelp = function(helpText, callback) {
    helpText += '<h2>回复可见</h2>'
    helpText += '可以使用回复可见隐藏部分内容:'
    helpText += '\n<pre>\n===\n\ns要隐藏的内容,回复后才可见\n\n===</pre>'
    callback(null, helpText)
  }

  // 拦截后交给控制器处理内容的显示
  Filters.parsePost = function(payload, callback) {
    controller.parsePost(payload, callback)
  }


})(module.exports)
