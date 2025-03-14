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

function noMatchButton() {
  const button = document.querySelector('button.frescopia');
  const success = document.querySelector('button.frescopia ~ span');
  button.addEventListener('click', () => {
    copyText('frescopia.coffee', success);
  });
}

function performSearch() {
  const searchField = document.getElementById('search');
  const listItems = document.querySelectorAll('#searchResults li');
  const noMatch = document.querySelector('li.no-match');
  searchField.addEventListener('input', () => {
    const query = searchField.value.trim().toLowerCase();
    // Reset all matches
    listItems.forEach((item) => item.classList.remove('match'));
    noMatch.classList.remove('show');
    if (query.length >= 3) {
      listItems.forEach((item) => {
        const customerValue = item.getAttribute('data-customer').toLowerCase();
        if (customerValue.includes(query)) {
          item.classList.add('match');
        }
      });
      const matched = document.querySelectorAll('#searchResults li.match');
      if (matched.length < 1) {
        noMatch.classList.add('show');
      } else {
        noMatch.classList.remove('show');
      }
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

  const noMatch = document.createElement('li');
  noMatch.className = 'no-match';
  const frescopiaButton = document.createElement('button');
  frescopiaButton.className = 'frescopia';
  const frescopiaSuccess = document.createElement('span');
  frescopiaSuccess.className = 'message';
  noMatch.innerText = 'Time to brew some coffee...';
  noMatch.dataset.customer = '';
  noMatch.append(frescopiaButton, frescopiaSuccess);
  ul.append(noMatch);

  block.append(search, ul);

  performSearch();
  noMatchButton();
}
