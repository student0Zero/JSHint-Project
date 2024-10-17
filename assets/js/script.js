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
