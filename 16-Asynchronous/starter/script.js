



const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// const getJson = response => {
//   if (response.ok) return response.json();
//   throw new Error(`Country not Found, status ${response.status}`);
// };
const getJson = R.ifElse(
  R.prop('ok'),
  response => response.json(),
  response => { throw new Error(`Country not Found, status ${response.status}`); });


const getCountryDataByName = name =>
  fetch(`https://restcountries.eu/rest/v2/name/${name}`)
    .then(getJson);

const getCountryDataByCode = code =>
  fetch(`https://restcountries.eu/rest/v2/alpha/${code}`)
    .then(getJson);

const buildCountryEl = (countryData, className = '') =>
  `
   <article class="country ${className}">
      <img class="country__img" src="${countryData.flag}" />
      <div class="country__data">
        <h3 class="country__name">${countryData.name}</h3>
        <h4 class="country__region">${countryData.region}</h4>
        <p class="country__row">
          <span>👫</span>${R.compose(R.divide(R.__, 1000000), R.prop('population'))(countryData)} million
        </p>
        <p class="country__row"><span>🗣️</span>${countryData.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${countryData.currencies[0].name}</</p>
      </div>
     </article> 
  `;

const renderCountry = data => {
  R.compose(
    el => {
      countriesContainer.insertAdjacentHTML('beforeend', el);
      document.querySelector('.countries').style.opacity = 1;
    },
    buildCountryEl
  )(data);
  return data;
};

const renderNeighbourCountry = data => {
  R.compose
    (
      el => countriesContainer.insertAdjacentHTML('beforeend', el),
      data => buildCountryEl(data, 'neighbour')
    )(data);

  return data;
};

// const getNeighbourCountryCode = R.compose(R.head, R.prop('borders'));
// const getNeighbourCountryCode = data => {
//   if (data.borders) return data.borders[0];
//   throw new Error('No Neighbours');
// };
const getNeighbourCountryCode = R.ifElse(
  R.compose(R.isNil, R.head, R.prop('borders')),
  () => { throw new Error('No Neighbours'); },
  R.compose(R.head, R.prop('borders'))
);


const renderError = msg => {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};


getCountryDataByName('china')
  .then(R.head)
  .then(renderCountry)
  .then(logIt)
  .then(getNeighbourCountryCode)
  .then(getCountryDataByCode)
  .then(renderNeighbourCountry)
  .catch(err => {
    console.error(err);
    renderError(`Something went wrong ${err.message}`);
  });
























function logIt(x) {
  console.log(x);
  return x;
};;
