let apiKey = '39a63810f70e8f1a0e7b5421f1370365998f6e9c';

chrome.runtime.onInstalled.addListener(() => {
  console.log(apiKey);
  chrome.storage.local.set({apiKey: apiKey});
});