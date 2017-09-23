chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create('window.html', {id:"fileWin", innerBounds: {width: 1400, height: 800}}, function(win) {
    win.contentWindow.launchData = launchData;
  });
});

