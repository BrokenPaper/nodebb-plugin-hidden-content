;(function(Controller) {
  'use strict'

  var async = require('async')

  var constants = require('./constants'),
    nodebb = require('./nodebb'),
    parser = require('./parser')

  // 客户端调用的方法
  /**
   * Get spoiler content.
   * Because spoiler content is not cached or stored, previous hook chain should be accounted to find
   * a corresponding spoiler content.
   *
   * @param {object} payload request for spoiler content
   * @param {string} payload.postId post identifier
   * @param {number} payload.index initial index where spoiler content starts
   * @param {function} callback
   */
  Controller.getSpoilerContent = function(payload, callback) {
    async.waterfall(
      [
        async.apply(nodebb.posts.getPostFields, payload.postId, ['content', 'tid']),
        // Trigger parsing process
        function chainParse(post, next) {
          post[constants.PARSE_REJECT_TOKEN] = true
          nodebb.plugins.fireHook('filter:parse.post', { postData: post }, function(error, hookResult) {
            if (error) {
              return next(error)
            }
            next(null, hookResult.postData)
          })
        },
        function checkReply(post, next) {
          // 折腾了半天终于找到最方便的方法了
          nodebb.db.isSortedSetMember('tid:' + post.tid + ':posters', payload.uid, function(error, data) {
            if (error) {
              return next(error)
            }
            // Need Translate
            if (data === false) {
              return next(new Error('你没有回复过'))
            }

            next(null, post)
          })
        },
        function(post, next) {
          parser.getContentAt(post.content, payload.index, next)
        }
      ],
      callback
    )
  }

  Controller.hasReplied = async function(tid, uid) {
    //return nodebb.db.getObject('tid:' + tid + ':posters",value:"' + uid)
    return await nodebb.db.getSortedSetRevRangeByScore('tid:' + tid + ':posters', 0, -1, '+inf', 1)
  }
  // 新加载的帖子会被这里处理,已有的帖子不会被处理,太强了!
  // 不过这只是给新帖子加上被隐藏的标识而已
  /**
   * Performs replacements on content field.
   *
   * @param {object} payload - includes full post entity
   * @param {object} payload.postData a post object with 'content' field
   * @param {function} callback returns updated content
   */
  Controller.parsePost = function(payload, callback) {
    var content = payload.postData.content,
      rejectParse = payload.postData[constants.PARSE_REJECT_TOKEN]

    if (content && !rejectParse) {
      parser.parse(content, function(error, parsedContent) {
        payload.postData.content = parsedContent
        callback(error, payload)
      })
    } else {
      // Skip hook chain if reject token is set
      callback(null, payload)
    }
  }
})(module.exports)
