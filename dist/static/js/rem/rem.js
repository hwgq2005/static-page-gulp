(function (doc, win) {
    // 默认设计稿宽度 750px
    var designWidth = 750,
        // 便于计算 100px = 1rem
        calcRatio = 100,
        docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth > designWidth) {
                docEl.style.fontSize = 10 + 'px';
            } else {
                docEl.style.fontSize = (clientWidth / designWidth * calcRatio) + 'px';
            }
        }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window)
