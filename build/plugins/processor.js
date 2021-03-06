const through = require('through2');

/**
 * 处理内容
 * @param params 参数
 * @param content 文件内容
 * @returns {*}
 */
function processor(params, content) {
    for (let item in params) {
        let reg = '/' + 'Env.' + item + '/g';
        content = content.replace(eval(reg), "'" + params[item] + "'");
    }
    return Buffer.from(content);
}

// params：调用插件传入的参数
module.exports = (params) => {

    // 创建stream对象，每个文件都会经过这个stream对象
    return through.obj(function (file, encoding, callback) {
        // 如果file类型不是buffer 退出不做处理
        if (!file.isBuffer()) {
            return callback();
        }

        // 将字符串加到文件数据开头
        file.contents = Buffer.from(processor(params, file.contents.toString()));

        // 确保文件会传给下一个插件
        this.push(file);

        // 告诉stream引擎，已经处理完成
        callback();
    });
};
