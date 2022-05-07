// Initialize butotn with users's prefered color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// // When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// // The body of this function will be execuetd as a content script inside the
// // current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }

function getStorms() {
  async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '39a63810f70e8f1a0e7b5421f1370365998f6e9c'
      }
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  getData('https://api.stormboard.com/storms')
  .then(data => {
    let stormList = [...data.storms];
    console.log(stormList);
    let select = document.getElementById('stormSelect');
    for (const storm of stormList) {
      let option = document.createElement('option');
      option.value = storm.id;
      option.innerText = storm.title;
      select.append(option);
      console.log(option);
    }
  })
}

function createStorm() {
  // Example POST method implementation:
  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '39a63810f70e8f1a0e7b5421f1370365998f6e9c'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  let data = {
    plan: 'personal',
    title: 'My Quick Storm'
  }

  postData('https://api.stormboard.com/storms', data)
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
}

function saveIdea(url) {
  async function postData(url = '', data = {}, apiKey = '') {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '39a63810f70e8f1a0e7b5421f1370365998f6e9c'
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
  console.log(data);

  postData('https://api.stormboard.com/ideas', data)
  .then(data => {
    console.log(data);
    if (data.status === 200) {
      console.log('success');
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

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});