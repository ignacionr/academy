var statusElement = document.getElementById('status');
var progressElement = document.getElementById('progress');
var spinnerElement = document.getElementById('spinner');

var Module = {
  print: (function() {
    return (...args) => {
      var text = args.join(' ');
      console.log(text);
    };
  })(),
  canvas: (() => {
    var canvas = document.getElementById('canvas');
    canvas.addEventListener("webglcontextlost", (e) => { alert('WebGL context lost. You will need to reload the page.'); e.preventDefault(); }, false);

    return canvas;
  })(),
  setStatus: (text) => {
      console.log('status: ' + text);
  },
  totalDependencies: 0,
  monitorRunDependencies: (left) => {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
  }
};
Module.setStatus('Downloading...');
window.onerror = (event) => {
  Module.setStatus('Exception thrown, see JavaScript console');
  spinnerElement.style.display = 'none';
  Module.setStatus = (text) => {
    if (text) console.error('[post-exception status] ' + text);
  };
};
