async function getData(url = '', apiKey) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    }
  });
  return response.json();
}

async function postData(url = '', data = {}, apiKey) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

async function getStorms(apiKey) {
  let response = await getData('https://api.stormboard.com/storms', apiKey);
  let stormList = [...response.storms];
  let select = document.getElementById('storm-select');
  
  // Build the Storm Select Drop-down
  for (const storm of stormList) {
    let option = document.createElement('option');
    option.value = storm.id;
    option.innerText = storm.title;
    select.append(option);
  }
}

async function saveIdea(url) {
  let textArea = document.getElementById("idea-text");
  let ideaText = textArea.value;
  let stormid = document.getElementById("storm-select").value;
  let includeLink = document.getElementById('include-link');
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // If idea is empty, focus the text area and stop. 
  if (ideaText.trim() === '') {
    textArea.focus();
    textArea.value = '';
    return; 
  }

  // Append the current page's url to the idea if selected. 
  ideaText = includeLink.checked ? ideaText + `\n\n${tab.url}` : ideaText;
  
  // Create the idea. 
  let idea = {
    stormid,
    data: ideaText,
    x: 100,
    y: 250,
  }

  // Load the API Key from Storage
  chrome.storage.local.get(['apiKey'], async function(result) {
    let apiKey = result.apiKey;
    // Submit the idea.
    let response = await postData('https://api.stormboard.com/ideas', idea, apiKey);

    // Response was successful.
    if (response.status === 200) {

      // Change the save button to show it saved. 
      let saveIdea = document.getElementById('saveIdea');
      saveIdea.classList.add('btn-saved');
      saveIdea.innerText = 'Saved';

      // Change the text area to show it saved. 
      let textArea = document.getElementById("idea-text");
      textArea.classList.add('saved');
      textArea.blur();

      // Add foucs listener text area to revert saved status. 
      textArea.addEventListener('focus', () => {
        textArea.value = '';
        textArea.classList.remove('saved');
        saveIdea.innerText = 'Save Idea';
        saveIdea.classList.remove('btn-saved');
      });
    }
  });
}

// Run main function when extension pop-up loads.
(function main() {
  let textArea = document.getElementById("idea-text");
  let saveIdeaBtn = document.getElementById("saveIdea");
  let goToStormBtn = document.getElementById("goToStorm");
  
  // Ready the text area. 

  textArea.focus();

  // Fetch Storm List
  chrome.storage.local.get(['apiKey'], function(result) {
    getStorms(result.apiKey);
  });


  textArea.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
      if (!event.shiftKey) {
        event.preventDefault();
        saveIdea();
      }
    }
  });

  // Save Idea Button
  saveIdeaBtn.addEventListener("click", async () => {
    saveIdea();
  });

  // Go to Storm Button
  goToStormBtn.addEventListener('click', async () => {
    let stormid = document.getElementById("storm-select").value;
    chrome.tabs.create({
      url: "http://www.stormboard.com/storm/" + stormid
    });
  });
})(); 
