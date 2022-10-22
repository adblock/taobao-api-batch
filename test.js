const TaobaoApiBatch = require('./index');


taobaoApiBatch = new TaobaoApiBatch({
    'app_key':'28105534',
    'app_secret':'5a32c6df53901614c80230f379c49e27',
});


setInterval(function () {
    taobaoApiBatch.addRequest({method:'taobao.httpdns.get'});
    taobaoApiBatch.execute(function (data) {
        console.log(data);
    });
},3000);
