(function (Filters) {
    'use strict';

    var controller = require('./controller');

    Filters.composerFormatting = function (payload, callback) {
        payload.options.push({
            name     : 'ns-spoiler',
            className: 'fa fa-eye'
        });
        callback(null, payload);
    };

    Filters.composerHelp = function (helpText, callback) {
        helpText += '<h2>折叠</h2>';
        helpText += '可以使用折叠隐藏部分内容:';
        helpText += '\n<pre>\n:::\n\ns要折叠的内容,点击按钮后才可见\n\n:::</pre>';
        callback(null, helpText);
    };

    Filters.parsePost = function (payload, callback) {
        controller.parsePost(payload, callback);
    };

})(module.exports);
