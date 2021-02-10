'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// btn.addEventListener("click", function ()
// {});

function getCountryDataByCountryName(countryName) {
  return fetch(`https://restcountries.eu/rest/v2/name/${countryName}`);
}

function getCountryDataByCountryCode(countryCode) {
  return fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);
}

function getNeibourCountryName(countryName) {

}



// fetch("https://restcountries.eu/rest/v2/name/portugal")
// 	.then(response =>
// 	{
// 		if (!response.ok)
// 			throw new Error(`Country not found ${ response.status }`);
// 		return response.json();
// 	})
// 	.then(([data]) =>
// 	{
// 		renderCountry(data);
// 		return data.borders[0];
// 	})
// 	.then((neighborCountryCode) =>
// 		fetch(`https://restcountries.eu/rest/v2/alpha/${ neighborCountryCode }`))
// 	.then(response =>
// 	{
// 		if (!response.ok)
// 			throw new Error(`Country not found ${ response.status }`);
// 		return response.json();
// 	})
// 	.then(data => renderCountry(data, "neighbor"))
// 	.catch(err => console.log(err))
// 	.finally(countriesContainer.style.opacity = 100);

whereAmI(52.508, 13.381);

function whereAmI(lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(response => {
      if (!response.ok) return;
      return response.json();
    })
    .then(({ country }) => fetch(`https://restcountries.eu/rest/v2/name/${country}`))
    .then(response => {
      if (!response.ok) return;
      return response.json();
    })
    .then(([data]) => renderCountry({ countryData: data, /* className: "neighbor"  */ }))
    .catch(err => console.log(err))
    .finally(countriesContainer.style.opacity = 100);
}


function renderCountry({ countryData, className } = {}) {
  const html = `
        <article class="country ${className}">
          <img class="country__img" src="${countryData.flag}" />
          <div class="country__countryData">
            <h3 class="country__name">${countryData.name}</h3>
            <h4 class="country__region">${countryData.region}</h4>
            <p class="country__row">
              <span>👫</span>${(countryData.population / 1000000).toFixed(1)}M
            </p>
            <p class="country__row">
                <span>🗣️</span>${countryData.languages[0].name}
            </p>
            <p class="country__row">
                <span>💰</span>${countryData.currencies[0].name}
            </p>
          </div>
        </article>
    `;

  document.querySelector(".countries").insertAdjacentHTML("beforeend", html);

};


