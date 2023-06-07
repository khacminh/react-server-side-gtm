'use strict';

var _warn = require('./utils/warn');

var _warn2 = _interopRequireDefault(_warn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://developers.google.com/tag-manager/quickstart

var Snippets = {
  tags: function tags(_ref) {
    var id = _ref.id,
        src = _ref.src,
        events = _ref.events,
        dataLayer = _ref.dataLayer,
        dataLayerName = _ref.dataLayerName,
        preview = _ref.preview,
        auth = _ref.auth,
        jsDir = _ref.jsDir,
        htmlDir = _ref.htmlDir;

    var gtm_auth = auth ? '&gtm_auth=' + auth : '';
    var gtm_preview = preview ? '&gtm_preview=' + preview : '';
    var gtm_cookies_win = auth || preview ? '&gtm_cookies_win=x' : '';
    var serverSideQuery = '' + gtm_auth + gtm_preview + gtm_cookies_win;
    var serverSideQueryForScript = serverSideQuery ? '+' + serverSideQuery : '';

    var gtm_src = src;
    var iframeSrc = htmlDir ? gtm_src + '/' + htmlDir : gtm_src;
    var jsSrc = jsDir ? gtm_src + '/' + jsDir : gtm_src;

    if (!id) (0, _warn2.default)('GTM Id is required');

    // const iframe = `
    //   <iframe src="${iframeSrc}/ns.html?id=${id}${gtm_auth}${gtm_preview}&gtm_cookies_win=x"
    //     height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>`
    // const script = `
    //   (function(w,d,s,l,i){w[l]=w[l]||[];
    //     w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js', ${JSON.stringify(events).slice(1, -1)}});
    //     var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    //     j.async=true;j.src='${jsSrc}/gtm.js?id='+i+dl'${serverSideQueryForScript}';
    //     f.parentNode.insertBefore(j,f);
    //   })(window,document,'script','${dataLayerName}','${id}');`

    var iframe = '\n      <iframe src="' + iframeSrc + '/ns.html?id=' + id + serverSideQuery + '"\n        height="0" width="0" style="display:none;visibility:hidden"></iframe>';

    var script = '\n      (function(w,d,s,l,i){w[l]=w[l]||[];\n        w[l].push({\'gtm.start\': new Date().getTime(),event:\'gtm.js\', ' + JSON.stringify(events).slice(1, -1) + '});\n        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';\n        j.async=true;j.src=\'' + jsSrc + '/gtm.js?id=\'+i+dl\'' + serverSideQueryForScript + '\';\n        f.parentNode.insertBefore(j,f);\n      })(window,document,\'script\',\'' + dataLayerName + '\',\'' + id + '\');';

    var dataLayerVar = this.dataLayer(dataLayer, dataLayerName);

    return {
      iframe: iframe,
      script: script,
      dataLayerVar: dataLayerVar
    };
  },
  dataLayer: function dataLayer(_dataLayer, dataLayerName) {
    return '\n      window.' + dataLayerName + ' = window.' + dataLayerName + ' || [];\n      window.' + dataLayerName + '.push(' + JSON.stringify(_dataLayer) + ')';
  }
};

module.exports = Snippets;