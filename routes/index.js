var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/binding', function(req, res, next) {
  res.render('binding');
});
router.get('/todo', function(req, res, next) {
  res.render('todo');
});
router.get('/form', function(req, res, next) {
  res.render('form');
});
router.get('/history', function(req, res, next) {
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
      //res.body();
      //console.dir(res);
      //console.log(req.body);
      //res.json(req.body);
      console.log(req.body.appid);
      console.log(req.body.mid);
      console.log(req.body.ticket);
    }
);
module.exports = router;
