chrome.app.runtime.onStartup.addListener(() => {
  console.log('starting apiKey');
  chrome.storage.sync.set({ apiKey: '39a63810f70e8f1a0e7b5421f1370365998f6e9c' });
});