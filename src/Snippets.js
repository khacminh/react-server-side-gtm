import warn from './utils/warn'

// https://developers.google.com/tag-manager/quickstart

const Snippets = {
  tags: function ({ id, src, events, dataLayer, dataLayerName, preview, auth, jsDir, htmlDir }) {
    const gtm_auth = auth ? `&gtm_auth=${auth}` : '';
    const gtm_preview = preview ? `&gtm_preview=${preview}` : '';
    const gtm_cookies_win = auth || preview ? '&gtm_cookies_win=x' : '';
    const serverSideQuery = `${gtm_auth}${gtm_preview}${gtm_cookies_win}`;
    const serverSideQueryForScript = serverSideQuery ? `+${serverSideQuery}` : '';

    const gtm_src = src
    const iframeSrc = htmlDir ? `${gtm_src}/${htmlDir}` : gtm_src;
    const jsSrc = jsDir ? `${gtm_src}/${jsDir}` : gtm_src;

    if (!id) warn('GTM Id is required')

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

    const iframe = `
      <iframe src="${iframeSrc}/ns.html?id=${id}${serverSideQuery}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`

    const script = `
      (function(w,d,s,l,i){w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js', ${JSON.stringify(events).slice(1, -1)}});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='${jsSrc}/gtm.js?id='+i+dl'${serverSideQueryForScript}';
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','${dataLayerName}','${id}');`

    const dataLayerVar = this.dataLayer(dataLayer, dataLayerName)

    return {
      iframe,
      script,
      dataLayerVar
    }
  },
  dataLayer: function (dataLayer, dataLayerName) {
    return `
      window.${dataLayerName} = window.${dataLayerName} || [];
      window.${dataLayerName}.push(${JSON.stringify(dataLayer)})`
  }
}

module.exports = Snippets
