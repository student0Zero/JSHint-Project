// constant to hold the api key
const API_KEY = 'lc67dn2Um0bAVycJhMm7JKUjT6c';
// constant to hold the api url
const API_URL = 'https://ci-jshint.herokuapp.com/api';
// constant to create a new bs modal
const resultsModal = new bootstrap.Modal(
  document.getElementById('resultsModal')
);

// wire up button using event listener
document
  .getElementById('status')
  .addEventListener('click', (e) => getStatus(e));

// for posting form
document.getElementById('submit').addEventListener('click', (e) => postForm(e));

function processOptions(form) {
  let optArray = [];

  for (let entry of form.entries()) {
    if (entry[0] === 'options') {
      optArray.push(entry[1]);
    }
  }

  form.delete('options');

  form.append('options', optArray.join());

  return form;
}

// function to post form
async function postForm(e) {
  const form = processOptions(
    new FormData(document.getElementById('checksform'))
  );

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: API_KEY,
    },
    body: form,
  });

  const data = await response.json();

  // handling errors - see function
  if (response.ok) {
    displayErrors(data);
  } else {
    // used to display errors in browser
    displayException(data);
    throw new Error(data.error);
  }
}

// handling errors function
function displayErrors(data) {
  let heading = `JSHints Results for ${data.file}`;

  if (data.total_errors === 0) {
    results = `<div class="no_errors">No Errors Reported</div>`;
  } else {
    results = `<div>Total Errors: <span class='error_count'>${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      results += `<div>At line<span class='line'>${error.line}</span>, `;
      results += `column <span class='column'>${error.col}</span></div>`;
      results += `<div class='error'>${error.error}</div>`;
    }
  }

  // display heading and content to modal
  document.getElementById('resultsModalTitle').innerText = heading;
  document.getElementById('results-content').innerHTML = results;
  resultsModal.show();
}

// get status function
/** make a GET request to the api url with api key
 * pass the data to a display function
 */
async function getStatus(e) {
  // query string as per api instructions
  // equivalent tp https://ci-jshint.....+API key
  const queryString = `${API_URL}?api_key=${API_KEY}`;

  // constant to await response from above request
  const response = await fetch(queryString);

  // convert response to json
  const data = await response.json();

  // handling response
  //   if ok then display data in dsiplayStatus function
  if (response.ok) {
    displayStatus(data);
  } else {
    // used to display errors in browser
    displayException(data);
    // response if not ok
    throw new Error(data.error);
  }
}

function displayStatus(data) {
  // create text for heading
  let heading = 'API Key Status';
  //   create a div title
  let results = `<div>Your Key is valid until:</div>`;

  //amend div by adding a class and appending with expiry date
  results += `<div class='key-status'>${data.expiry}</div>`;

  // The innerText property returns: Just the text content of the element and all its children, without CSS hidden text spacing and tags, except <script> and <style> elements.
  document.getElementById('resultsModalTitle').innerText = heading;

  //   The innerHTML property returns: The text content of the element, including all spacing and inner HTML tags.
  document.getElementById('results-content').innerHTML = results;

  resultsModal.show();
}

function displayException(data) {
  let heading = `An Exception Occurred`;

  results = `<div>The API returned status code ${data.status_code}</div>`;
  results += `<div>Error Number: <strong>${data.error_no}</strong></div>`;
  results += `<div>Error Text: <strong>${data.error}</strong></div>`;

  document.getElementById('resultsModalTitle').innerText = heading;
  document.getElementById('results-content').innerHTML = results;

  resultsModal.show();
}
