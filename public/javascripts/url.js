/**
 * Created by mingxing_he@kingdee.com on 2016/10/20.
 */
var debug = true;
var host_produce = "";
var host_test = "http://192.168.1.158:8089";
var common_biz_url = "/servlet/MobileApproveServlet";
var requrl = (debug ? host_test : host_produce) + common_biz_url;



//-----���ֲ�ͬ������-------------------------------
var statuskeyparam = '';
var statuscodeparam = '';
var urlObj = getUrlParamObj();
switch (urlObj.type) {
    case 'todohd'://��Ҫ�Ҵ������Ѿ�����
        statuskeyparam = 'ishandled';
        statuscodeparam = 'handled';
        break;
    case 'todounhd'://��Ҫ�Ҵ�����δ����
        statuskeyparam = 'ishandled';
        statuscodeparam = 'unhandled';
        break;
    case 'subhd'://���ύ�Ĳ����Ѿ�����
        statuskeyparam = 'submit';
        statuscodeparam = 'finished';
        break;
    case 'subunhd'://���ύ�Ĳ���δ����
        statuskeyparam = 'submit';
        statuscodeparam = 'unhandled';
        break;
}
//-----���ֲ�ͬ������-------------------------------

/*
 * ��ȡ��ǰҳ�棨ͨ������ҳ�������
 * */
function getUrlParamObj() {
    var curUrl = window.location.href;//��ȡ��ǰҳ��url��ַ���������ģ�
    var uri = new URI(curUrl);//ʵ����һ��URI����
    var paramObj = uri.search(true);//����?֮�����Ӷ�Ӧ��������ɵ�js��������uri == "http://example.org/bar/world.html?foo=bar&hello=world&hello=mars"  ����{ foo: "bar", hello : ["world", "mars"] }
    return paramObj;
}
