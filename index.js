const axios = require('axios');
const { format } = require('date-fns');
const querystring = require('querystring');
const crypto = require('crypto');
/// tsatastda
function TaobaoApiBatch(options) {
    this._options = options || {};
    if (!this._options.app_key || !this._options.app_secret) {
        throw new Error('app_key or app_secret need!');
    }
    // 批量请求的url
    this._url = options.url || 'http://gw.api.taobao.com/router/batch';
    // 批量请求的body
    this._split = '\r\n-S-\r\n';
    this._args = {};
    this._payload = '';
    this._publicMethod = ''; // 公共方法
    this._publicParams = {}; // 公共参数
    this._requestList = []; // 请求列表

}

// 计算签名
TaobaoApiBatch.prototype.signUrl = function(){
    // 接口参数
    this._args = {
        timestamp:format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        format: 'json',
        app_key: this._options.app_key,
        v: '2.0',
        sign_method: 'md5',
    };
    // 计算sign
    let sorted = Object.keys(this._args).sort();
    let basestring = this._options.app_secret;
    for (var i = 0, l = sorted.length; i < l; i++) {
        var k = sorted[i];
        basestring += k + this._args[k];
    }
    basestring += this._payload;
    basestring += this._options.app_secret;
    this._args.sign = this.md5(basestring).toUpperCase();
    const url = this._url+'?'+querystring.stringify(this._args);
    return url;
};

// hash 方法
TaobaoApiBatch.prototype.hash = function hash(method, s, format) {
    var sum = crypto.createHash(method);
    var isBuffer = Buffer.isBuffer(s);
    if (!isBuffer && typeof s === 'object') {
        s = JSON.stringify(sortObject(s));
    }
    sum.update(s, isBuffer ? 'binary' : 'utf8');
    return sum.digest(format || 'hex');
};
// md5 方法
TaobaoApiBatch.prototype.md5 = function md5(s, format) {
    return this.hash('md5', s, format);
};

// 设置公共方法
TaobaoApiBatch.prototype.setPublicMethod = function(publicMethod) {
    console.log('先不开发了');
    this._publicMethod = publicMethod;
};
// 设置公共参数
TaobaoApiBatch.prototype.setPublicParams = function(publicParams) {
    console.log('先不开发了');
    this._publicParams = publicParams;
};
// 添加公共参数
TaobaoApiBatch.prototype.addPublicParam = function(key,value) {
    console.log('先不开发了');
    this._publicParams[key] = value;
};
// 设置请求列表
TaobaoApiBatch.prototype.setRequest = function(requestList) {
    this._requestList = requestList;
};
// 添加请求列表
TaobaoApiBatch.prototype.addRequest = function(request) {
    this._requestList.push(request);
};
// 设置payload
TaobaoApiBatch.prototype.setPayload = function() {
    let split = this._split;
    let payload = '';
    this._requestList.forEach(function (value,index,array) {
        payload += querystring.stringify(value);
        if(index !== array.length -1){
            payload += split;
        }
    });
    this._payload = payload;
};
// 设置payload
TaobaoApiBatch.prototype.getBatchData = function(data){
    data = data.split(this._split);
    data.forEach(function (value,index) {
        data[index] = JSON.parse(value);
    });
    return data;
};
// 执行请求
TaobaoApiBatch.prototype.execute = function(callback) {
    this.setPayload();
    const url = this.signUrl();
    axios.post(
        url,
        this._payload,
        {
            headers: {
                'content-type': 'text/plain;charset=UTF-8',
            }
        }
        ).then(function (res) {
            if(res.data.hasOwnProperty('error_response')){
                console.log(res.data);
            }else {
                let data = this.taobaoApiBatch.getBatchData(res.data);
                callback(data);
                // 清空请求列表
                this.taobaoApiBatch._payload = '';
                this.taobaoApiBatch._requestList = [];
            }

    },this);
};

module.exports = TaobaoApiBatch;
