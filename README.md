# taobao-api-batch 淘宝开放平台批量调用


淘宝开放平台API批量调用简介说明  
https://developer.alibaba.com/docs/doc.htm?treeId=1&articleId=104350&docType=1


```
taobaoApiBatch = new TaobaoApiBatch({
    'app_key':'xxxxxxx',
    'app_secret':'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});

taobaoApiBatch.addRequest({method:'taobao.httpdns.get'});
taobaoApiBatch.addRequest({method:'taobao.top.ipout.get'});

taobaoApiBatch.execute(function (data) {
    console.log(data);
});
```
