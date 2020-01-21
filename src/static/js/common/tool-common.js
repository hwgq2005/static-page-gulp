(function() {
    var common = {
        buryPoint: buryPoint({
            publicData: {
                page_id: 10129,
                channel_id: 1
            }
        })
    };
    /**
     * 判断版本号
     * @param curr
     * @param promote
     * @returns {boolean}
     */
    // 比较版本
    common.versionCompare = function(curr, promote) {
        if (curr === promote) return true;
        let currVer = curr || "0.0.0";
        let promoteVer = promote || "0.0.0";
        let currVerArr = currVer.split(".");
        let promoteVerArr = promoteVer.split(".");
        let len = Math.max(currVerArr.length, promoteVerArr.length);
        let proVal, curVal;
        for (var i = 0; i < len; i++) {
            proVal = ~~promoteVerArr[i];
            curVal = ~~currVerArr[i];
            if (proVal < curVal) {
                return false;
            } else if (proVal > curVal) {
                return true;
            }
        }
    };

    /**
     * 判断工具箱是否登录
     */
    common.login = function() {
        let userInfo = zlj.getUserInfo();
        if (zlj.isApp()){
            if (!(userInfo && userInfo.token)) {
                let maskBox = document.createElement("div");
                maskBox.style.cssText =
                    ";position: fixed;left: 0;top: 0;right:0;bottom:0;z-index:9999;";
                document.body.appendChild(maskBox);
                maskBox.onclick = function() {
                    zlj.login({
                        data: { dialog: "1" },
                        success(response) {
                            maskBox.style.display = "none";
                        },
                        fail() {
                            alert("登录失败");
                        }
                    });
                };
            }
        }
    };
    /**
     * 左上角返回按钮事件
     * @param title 埋点标题
     * @param newURL 新版本跳转方法
     * @param oldUrl 旧版本跳转方法
     */
    common.goBack = function({
        title = "",
        newURL = "zljgo://native_api?type=10&content=" +
            encodeURIComponent(JSON.stringify({ action: "", isFromTool: "1" })),
        oldUrl = "https://frontstatic.zhaoliangji.com/tools/home/index.html"
    }) {
        if (zlj.getContextInfo() && zlj.getContextInfo().appVersion) {
            const edition = common.versionCompare(
                "7.5.34",
                zlj.getContextInfo().appVersion
            );
            zlj.openBlockBack(true);
            zlj.on("backEvent", () => {
                if (edition) {
                    common.buryPoint.send("click_app", {
                        tools_type: title,
                        event_type: "click",
                        operation_module: "返回"
                    });
                    location.href = newURL;
                } else {
                    location.href = oldUrl;
                }
            });
        }
    };
    common.login();
    window.common = common;
})();
