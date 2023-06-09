'use strict';var _warn=require('./utils/warn'),_warn2=_interopRequireDefault(_warn);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function createIdleScript(){var a=0<arguments.length&&arguments[0]!==void 0?arguments[0]:15e3,b=1<arguments.length&&arguments[1]!==void 0?arguments[1]:5e3;return'\n    (function () {\n      var startEngage = new Date().getTime();\n      var timeEngaged = 0;\n      var idleTime = 0;\n      var idle = true;\n      var idleReport = false;\n      var idleTimer, reportTimer;\n\n      // Set the user as idle, and calculate the time\n      // they were non-idle\n      var setIdle = function () {\n        idleTime = new Date().getTime();\n        timeEngaged += idleTime - startEngage;\n        idle = true;\n      };\n\n      // Reset the idle timer.\n      // If the user was idle, start the non-idle timer\n      var pulse = function (evt) {\n        if (idle) {\n          idle = false;\n          startEngage = new Date().getTime();\n          idleReport = false;\n        }\n        window.clearTimeout(idleTimer);\n        idleTimer = window.setTimeout(setIdle, '+b+');\n      };\n\n      //  Utility function for attaching listeners to the window\n      var addListener = function (evt, cb) {\n        if (window.addEventListener) {\n          window.addEventListener(evt, cb);\n        } else if (window.attachEvent) {\n          window.attachEvent(\'on\' + evt, cb);\n        }\n      };\n\n      // Push an event to dataLayer every 15 seconds\n      // unless the user is idle.\n      // Also, push an event when the user leaves the page\n      var report = function (evt) {\n        if (!idle) {\n          timeEngaged += new Date().getTime() - startEngage;\n        }\n\n        // Push the payload to dataLayer, and only push valid time values\n        if (!idleReport && timeEngaged > 0 && timeEngaged < 3600000) {\n          window.dataLayer.push({\n            \'event\': \'nonIdle\',\n            activeSession: 1\n            // \'nonIdleTimeElapsed\': timeEngaged\n          });\n        }\n        if (idle) {\n          idleReport = true;\n        }\n\n        // Fix possible beforeunload duplication problem\n        if (evt && evt.type === \'beforeunload\') {\n          window.removeEventListener(\'beforeunload\', report);\n        }\n        timeEngaged = 0;\n        startEngage = new Date().getTime();\n        reportTimer = window.setTimeout(report, '+a+');\n      };\n\n      addListener(\'mousedown\', pulse);\n      addListener(\'keydown\', pulse);\n      addListener(\'scroll\', pulse);\n      addListener(\'mousemove\', pulse);\n      addListener(\'beforeunload\', report);\n      idleTimer = window.setTimeout(setIdle, '+b+');\n      reportTimer = window.setTimeout(report, '+a+');\n    })();\n  '}var Snippets={tags:function w(a){var b=a.id,c=a.src,d=a.events,e=a.dataLayer,f=a.dataLayerName,g=a.preview,h=a.auth,i=a.jsDir,j=a.htmlDir,k=a.reportInterval,l=a.idleInteval,m=h?'&gtm_auth='+h:'',n=g?'&gtm_preview='+g:'',o=h||g?'&gtm_cookies_win=x':'',p=''+m+n+o,q=c,r=j?q+'/'+j:q,s=i?q+'/'+i:q;b||(0,_warn2.default)('GTM Id is required');var t='\n      (function(w,d,s,l,i){w[l]=w[l]||[];\n        w[l].push({\'gtm.start\': new Date().getTime(),event:\'gtm.js\', '+JSON.stringify(d).slice(1,-1)+'});\n        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';\n        j.async=true;j.src=\''+s+'/gtm.js?id=\'+i+dl+\''+p+'\';\n        f.parentNode.insertBefore(j,f);\n      })(window,document,\'script\',\''+f+'\',\''+b+'\');',u=createIdleScript(k,l),v=this.dataLayer(e,f);return{noScripts:['\n      <iframe src="'+r+'/ns.html?id='+b+p+'"\n        height="0" width="0" style="display:none;visibility:hidden"></iframe>'],scripts:[t,u],dataLayerVar:v}},dataLayer:function c(a,b){return'\n      window.'+b+' = window.'+b+' || [];\n      window.'+b+'.push('+JSON.stringify(a)+')'}};module.exports=Snippets;