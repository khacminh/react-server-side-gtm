import warn from './utils/warn'

function createIdleScript(reportInterval = 15000, idleInteval = 5000) {
  const jsScript = `
    (function () {
      var startEngage = new Date().getTime();
      var timeEngaged = 0;
      var idleTime = 0;
      var idle = true;
      var idleReport = false;
      var idleTimer, reportTimer;

      // Set the user as idle, and calculate the time
      // they were non-idle
      var setIdle = function () {
        idleTime = new Date().getTime();
        timeEngaged += idleTime - startEngage;
        idle = true;
      };

      // Reset the idle timer.
      // If the user was idle, start the non-idle timer
      var pulse = function (evt) {
        if (idle) {
          idle = false;
          startEngage = new Date().getTime();
          idleReport = false;
        }
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(setIdle, ${idleInteval});
      };

      //  Utility function for attaching listeners to the window
      var addListener = function (evt, cb) {
        if (window.addEventListener) {
          window.addEventListener(evt, cb);
        } else if (window.attachEvent) {
          window.attachEvent('on' + evt, cb);
        }
      };

      // Push an event to dataLayer every 15 seconds
      // unless the user is idle.
      // Also, push an event when the user leaves the page
      var report = function (evt) {
        if (!idle) {
          timeEngaged += new Date().getTime() - startEngage;
        }

        // Push the payload to dataLayer, and only push valid time values
        if (!idleReport && timeEngaged > 0 && timeEngaged < 3600000) {
          window.dataLayer.push({
            'event': 'nonIdle',
            activeSession: 1
            // 'nonIdleTimeElapsed': timeEngaged
          });
        }
        if (idle) {
          idleReport = true;
        }

        // Fix possible beforeunload duplication problem
        if (evt && evt.type === 'beforeunload') {
          window.removeEventListener('beforeunload', report);
        }
        timeEngaged = 0;
        startEngage = new Date().getTime();
        reportTimer = window.setTimeout(report, ${reportInterval});
      };

      addListener('mousedown', pulse);
      addListener('keydown', pulse);
      addListener('scroll', pulse);
      addListener('mousemove', pulse);
      addListener('beforeunload', report);
      idleTimer = window.setTimeout(setIdle, ${idleInteval});
      reportTimer = window.setTimeout(report, ${reportInterval});
    })();
  `;

  return jsScript;
}


// https://developers.google.com/tag-manager/quickstart

const Snippets = {
  tags: function ({ id, src, events, dataLayer, dataLayerName, preview, auth, jsDir, htmlDir, reportInterval, idleInteval }) {
    const gtm_auth = auth ? `&gtm_auth=${auth}` : '';
    const gtm_preview = preview ? `&gtm_preview=${preview}` : '';
    const gtm_cookies_win = auth || preview ? '&gtm_cookies_win=x' : '';
    const serverSideQuery = `${gtm_auth}${gtm_preview}${gtm_cookies_win}`;

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
        j.async=true;j.src='${jsSrc}/gtm.js?id='+i+dl+'${serverSideQuery}';
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','${dataLayerName}','${id}');`

    const activeScript = createIdleScript(reportInterval, idleInteval);
    const dataLayerVar = this.dataLayer(dataLayer, dataLayerName)

    return {
      // iframe,
      // script,
      // activeScripts,
      noScripts: [iframe],
      scripts: [script, activeScript],
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
