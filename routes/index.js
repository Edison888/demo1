var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/binding', function (req, res, next) {
    res.render('binding');
});
router.get('/todo', function (req, res, next) {
    res.render('todo');
});
router.get('/form', function (req, res, next) {
    res.render('form');
});
router.get('/history', function (req, res, next) {
    res.render('history');
});
router.get('/flow', function (req, res, next) {
    res.render('flow');
});
router.get('/attachment', function (req, res, next) {
    res.render('attachment');
});
router.get('/qrcode', function (req, res, next) {
    res.render('QRcode');
});
router.get('/qrlogin', function (req, res, next) {
    //console.log(req);
    //������֮��������֤ticket������ȡ���û���Ϣ
    //���ݻ�ȡ�����û���Ϣȥ���ص�json�ļ������ж��Ƿ��е�ǰ�û�����У���ô����Ⱦ��ҳ�淵�أ����û�У���Ⱦ���ҳ�档
    console.log(req.query.appid);
    console.log(req.query.mid);
    console.log(req.query.ticket);
});


router.post('/qrlogin', function (req, res, next) {
        //console.log(req.body.appid);
        console.log(req.body.mid);
        console.log(req.body.ticket);

        var uri = new URI('http://xt.gzbfdc.com/openauth2/api/token');
        //grant_type=client_credential&appid=10207&secret=bindingpage
        request(
            {
                uri: uri,
                method: 'GET',
                qs: {
                    grant_type: 'client_credential',
                    appid: req.body.appid,
                    secret: 'bindingpage'
                }
            }
            , function (error, status, data) {
                console.log('========================================================================');
                console.dir(error);
                console.dir(status);
                console.dir(data);
            });
    }
);
module.exports = router;
