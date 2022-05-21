// Saves options to chrome.storage
function save_options() {
  var apiKey = document.getElementById('api-key').value;
  chrome.storage.sync.set({
    apiKey
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    apiKey: ''
  }, function(result) {
    document.getElementById('api-key').value = result.apiKey;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);