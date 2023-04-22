import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));

function searchCountries(e){
  const inputValue = e.target.value.trim()
  if (inputValue === '') {
    clearCountriesInfo();
     return;
    }
  fetchCountries(inputValue).then(resultOfSearch).catch(error)
}

function resultOfSearch(countries) {
  if (countries.length === 1) {
    makeCard(countries[0]);
  } else if (countries.length <= 10) {
    makeList(countries);
  } else {
    foundToMuch();
  }
}

function makeCard(country) {
  const countries = Object.values(country.languages).join(', ');
  const markup = `
    <div class="country-card">
        <img class="country-image" src="${country.flags.svg}" alt="Flag">
        <h1 class="country-title">${country.name.official}</h1>
        <p><b>Capital: </b>${country.capital}</p>
        <p><b>Population: </b>${country.population}</p>
        <p><b>Languages: </b>${countries}</p>
    </div>
  `;
  refs.countryInfo.innerHTML = markup;
  refs.countryList.innerHTML = '';
}

function makeList(countries) {
  const markup = countries
    .map(c => {
      return `<ul class="country-list">
              <li class="country-item">
                <img class="country-image" src="${c.flags.svg}" alt="Flag">
                <span>${c.name.official}</span>
              </li>
            </ul>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
  refs.countryInfo.innerHTML = '';
}

function clearCountriesInfo() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function foundToMuch() {
  clearCountriesInfo();
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name'
  );
}

function error(error) {
  clearCountriesInfo();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
