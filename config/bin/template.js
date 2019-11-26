const componentname = process.argv[2];
const chineseName = process.argv[3] || componentname;

const content = {
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="HandheldFriendly" content="True">
      <meta name="MobileOptimized" content="320">
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"/>
      <title>${chineseName}</title>
      <link rel="stylesheet" href="css/index.css">
  </head>
  <body>
    <div id="app">
    </div>
    <script src="/static/js/vue/vue.min.js"></script>
    <script src="/static/js/axios/axios.min.js"></script>
    <script src="/static/js/sdk/zlj-js-sdk.min.js"></script>
    <script src="/static/js/lib-flexible/flexible.js"></script>
    <script src="/pages/${componentname}/js/index.js"></script>
  </body>
</html>`,
    css: `$font-size-base: 75;
@function rem($px) {
    @return $px/$font-size-base+rem;
}
.test{
    font-size:rem(-3);
}
    `,
    js: `;(function () {
    
    // @if NODE_ENV='development'
    var actHost = 'http://testact.zhaoliangji.com'; // 测试环境
    // @endif
    
    // @if NODE_ENV='production'
    var actHost = 'https://act.zhaoliangji.com'; // 正式环境
    // @endif

    new Vue({
        el: '#app',
        data: {
        
        },
        watch: {
        
        },
        created() {
           
        },
        mounted() {
        },
        methods: {
          
        }
    });
})();
`

};

module.exports = content;