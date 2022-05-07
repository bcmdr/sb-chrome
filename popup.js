const apiKey = '39a63810f70e8f1a0e7b5421f1370365998f6e9c'

function getStorms() {
  async function getData(url = '') {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      }
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  getData('https://api.stormboard.com/storms')
  .then(data => {
    let stormList = [...data.storms];
    let select = document.getElementById('stormSelect');
    for (const storm of stormList) {
      let option = document.createElement('option');
      option.value = storm.id;
      option.innerText = storm.title;
      select.append(option);
    }
  })
}

function saveIdea(url) {
  async function postData(url = '', data = {}, apiKey = '') {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  let ideaText = document.getElementById("idea-text")?.value;
  let stormid = document.getElementById("stormSelect").value;
  let includeLink = document.getElementById('include-link');
  
  if (ideaText.trim() === '') {
    let textArea = document.getElementById("idea-text");
    textArea.focus();
    textArea.value = '';
    return; 
  }

  ideaText = includeLink.checked ? ideaText + `\n\n${url}` : ideaText;
  
  let data = {
    stormid,
    data: ideaText,
    x: 100,
    y: 250,
  }

  postData('https://api.stormboard.com/ideas', data, apiKey)
  .then(data => {
    if (data.status === 200) {
      let saveIdea = document.getElementById('saveIdea');
      saveIdea.classList.add('btn-saved');
      saveIdea.innerText = 'Saved';
      let textArea = document.getElementById("idea-text");
      textArea.classList.add('saved');
      textArea.addEventListener('click', () => {
        textArea.value = '';
        textArea.classList.remove('saved');
        saveIdea.innerText = 'Save Idea';
        saveIdea.classList.remove('btn-saved');
      });
    }
  });
}

getStorms();
let saveIdeaBtn = document.getElementById("saveIdea");
let goToStormBtn = document.getElementById("goToStorm");
let textArea = document.getElementById("idea-text");
textArea.focus();

saveIdeaBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  saveIdea(tab.url);
});

goToStormBtn.addEventListener('click', async () => {
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
  let stormid = document.getElementById("stormSelect").value;
  chrome.tabs.update({
    url: "http://www.stormboard.com/storm/" + stormid
  });
});