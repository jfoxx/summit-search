import ffetch from '../../scripts/ffetch.js';

const allentries = await ffetch('/sitesoptimizercustomdemos-summit25.json').all();

function copyText(newClip, target) {
  navigator.clipboard.writeText(newClip).then(
    () => {
      target.innerText = 'Copied!';
      target.className = 'success';
    },
    () => {
      target.innerText = 'Error!';
      target.className = 'fail';
    },
  );
}

function performSearch() {
  const searchField = document.getElementById('search');
  const listItems = document.querySelectorAll('#searchResults li');
  searchField.addEventListener('input', () => {
    const query = searchField.value.trim().toLowerCase();
    // Reset all matches
    listItems.forEach((item) => item.classList.remove('match'));

    if (query.length >= 3) {
      listItems.forEach((item) => {
        const customerValue = item.getAttribute('data-customer').toLowerCase();
        if (customerValue.includes(query)) {
          item.classList.add('match');
        }
      });
    }
  });
}

export default function decorate(block) {
  // build search form
  const search = document.createElement('div');
  search.className = 'search-wrapper';
  const field = document.createElement('input');
  field.placeholder = 'Enter customer name';
  field.id = 'search';
  field.setAttribute('type', 'search');
  field.setAttribute('autocomplete', 'off');
  search.append(field);
  const ul = document.createElement('ul');
  ul.id = 'searchResults';
  allentries.forEach((i) => {
    const li = document.createElement('li');
    const website = i.Website.split('www.')[1];
    li.innerText = website;
    li.dataset.customer = i['Customer Name'];
    const copyButton = document.createElement('button');
    copyButton.className = 'copy';
    const messageSpan = document.createElement('span');
    copyButton.addEventListener('click', () => {
      copyText(website, messageSpan);
    });
    li.append(copyButton, messageSpan);
    ul.append(li);
  });

  block.append(search, ul);

  performSearch();
}
