/* globals define, app, ajaxify, bootbox, socket, templates, utils */

$(document).ready(function() {
  'use strict'

  var tag = '===',
    nl = '\n\n',
    textPrompt = '隐藏内容'

  // not support this composer yet.

  /*     $(window).on('action:composer.loaded', function (ev, data) {
        if ($.Redactor && $.Redactor.opts.plugins.indexOf('hidden-content') === -1) {
            $.Redactor.opts.plugins.push('hidden-content');
        }
    });
 */
  $(window).on('action:composer.enhanced', function() {
    require(['composer/formatting', 'composer/controls'], function(formatting, controls) {
      formatting.addButtonDispatch('hidden-content', composerControlDidClick)

      function composerControlDidClick(textArea, selectionStart, selectionEnd) {
        if (selectionStart === selectionEnd) {
          var hlContentStart = selectionStart + getTag().length,
            hlContentEnd = hlContentStart + textPrompt.length
          controls.insertIntoTextarea(textArea, getNewSpoiler(textPrompt))
          controls.updateTextareaSelection(textArea, hlContentStart, hlContentEnd)
        } else {
          controls.wrapSelectionInTextareaWith(textArea, getTag(), getTag())
        }
      }

      function getNewSpoiler(message) {
        return getTag() + message + getTag()
      }

      function getTag() {
        return nl + tag + nl
      }
    })
  })

  /*     $(window).on('action:redactor.load', function () {
        $.Redactor.prototype['hidden-content'] = function () {
            return {
                init   : function () {
                    var button = this.button.add('hidden-content', 'Add Spoiler');
                    this.button.setIcon(button, '<i class="fa fa-eye-slash"></i>');
                    this.button.addCallback(button, this['hidden-content'].onClick);
                },
                onClick: function () {
                    this.insert.html('<p>' + tag + '<br /><br />' + textPrompt + '<br /><br />' + tag + '</p>');
                }
            };
        };
    }); */
})
