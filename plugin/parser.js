(function (Parser) {
    'use strict';

    var async = require('async'),
        cloneRegexp = require('clone-regexp');

    var constants = require('./constants');

    var spoiler = cloneRegexp(constants.REG_SPOILER);

    // 这是获得内容,如果前面都没问题的话
    Parser.getContentAt = function (content, index, done) {
        async.waterfall([
            async.apply(Parser.prepare, content),
            function (sanitizedContent, next) {
                var spoilerContent;
                spoiler.lastIndex = index;
                spoilerContent = spoiler.exec(sanitizedContent);

                if (spoilerContent) {
                    next(null, spoilerContent[1]);
                } else {
                    next(new Error('Something went wrong. Spoiler content can not be found.'));
                }
            }
        ], done);
    };

    // 这是给隐藏的内容加上一个按钮,这边不需要按钮,就显示被隐藏了就行了
    Parser.parse = function (content, done) {
        async.waterfall([
            async.apply(Parser.prepare, content),
            function (sanitizedContent, next) {
                var execResult, textSegments = [sanitizedContent], cursor = 0, position = 0;
                spoiler.lastIndex = 0;

                // If there is a Spoiler in the content, content will be shattered on the chunks
                while ((execResult = spoiler.exec(sanitizedContent)) !== null) {
                    textSegments[cursor] = sanitizedContent.slice(position, execResult.index);
                    textSegments[++cursor] = `<div class="hidden-content" data-index="${execResult.index}" data-open="false"><div class="hidden-content-control"><a class="btn btn-default" href="#"><i class="fa fa-lock"></i> 回复后点击显示</a></div><div class="hidden-content-content"></div></div>`;
                    // Rest content
                    textSegments[++cursor] = sanitizedContent.slice(spoiler.lastIndex);
                    position = spoiler.lastIndex;
                }

                next(null, textSegments.join(''));
            }
        ], done);
    };

    /**
     * 1. Sanitize: remove wrapping tags, like <p>
     * 2. Fix a improperly closed <ul> and <ol> lists
     * 3. Fix a text lines at Start, that concatenates with spoiler via paragraph
     * @param {string} content post message to process
     * @param {function} done
     */
    Parser.prepare = function (content, done) {
        content = content
            .replace(constants.REG_SANITIZE_WRAP, '$2') // Remove wrapping tags, i.e. <p>:::</p>
            .replace(constants.REG_SAFE_LIST_CLOSE, '$1$4\n$3')
            .replace(constants.REG_SAFE_SHIFT_START, '$2$1') // Move inside a <p> tag
            .replace(constants.REG_SAFE_SHIFT_END, '$2$1') // Move inside a </p> tag
            .replace(constants.REG_SPOILER_TAG, '\n$1\n'); // Add necessary extra line
        done(null, content);
    };

})(module.exports);
