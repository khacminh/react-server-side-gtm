import Snippets from './Snippets'

function addElement(snippet, scriptType = 'script') {
  const script = document.createElement(scriptType);
  script.innerHTML = snippet;
  return script;
}

const TagManager = {
  dataScript: function (dataLayer) {
    const script = document.createElement('script')
    script.innerHTML = dataLayer
    return script
  },
  gtm: function (args) {
    const snippets = Snippets.tags(args)

    const noScripts = snippets.noScripts.map(snippet => addElement(snippet, 'noscript'));
    const scripts = snippets.scripts.map(snippet => addElement(snippet, 'script'));

    // const noScript = () => {
    //   const noscript = document.createElement('noscript')
    //   noscript.innerHTML = snippets.iframe
    //   return noscript
    // }

    // const script = () => {
    //   const script = document.createElement('script')
    //   script.innerHTML = snippets.script
    //   return script
    // }

    const dataScript = this.dataScript(snippets.dataLayerVar)

    return {
      // noScript,
      // script,
      noScripts,
      scripts,
      dataScript
    }
  },

  initialize: function ({
    gtmId,
    src = "https://www.googletagmanager.com",
    events = {},
    dataLayer,
    dataLayerName = 'dataLayer',
    auth = '',
    preview = '',
    jsDir = '',
    htmlDir = '',
    reportInterval = 15000,
    idleInteval = 5000,
  }) {
    const gtm = this.gtm({
      id: gtmId,
      src,
      events: events,
      dataLayer: dataLayer || undefined,
      dataLayerName: dataLayerName,
      auth,
      preview,
      jsDir,
      htmlDir,
      reportInterval,
      idleInteval,
    })
    if (dataLayer) {
      document.head.appendChild(gtm.dataScript);
    }
    gtm.scripts.map(x => { document.head.insertBefore(x, document.head.childNodes[0]) });
    gtm.noScripts.map(x => { document.body.insertBefore(x, document.body.childNodes[0]) });
    // document.head.insertBefore(gtm.script(), document.head.childNodes[0])
    // document.body.insertBefore(gtm.noScript(), document.body.childNodes[0])
  },

  dataLayer: function ({ dataLayer, dataLayerName = 'dataLayer' }) {
    if (window[dataLayerName]) return window[dataLayerName].push(dataLayer)
    const snippets = Snippets.dataLayer(dataLayer, dataLayerName)
    const dataScript = this.dataScript(snippets)
    document.head.insertBefore(dataScript, document.head.childNodes[0])
  }
}

module.exports = TagManager
