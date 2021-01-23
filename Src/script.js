// //////////////////////Sellect Element\\\\\\\\\\\\\\\\\\\\\\\\\

const backToTopButton = document.querySelector("#back-to-top-btn");
const countries = document.querySelector('datalist');
const search = document.querySelector('#srch');
const date = document.querySelector('#date');
const nameCountry = document.querySelector('#name-country');
const confirmed = document.querySelector('.confirmed');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const chart = document.querySelector('.chart');

// /////////////////////////Start Back To Top\\\\\\\\\\\\\\\\\\\\\\\

window.addEventListener("scroll", scrollFunction);

function scrollFunction() {
  if (window.pageYOffset > 300) { // Show backToTopButton
    if (!backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnExit");
      backToTopButton.classList.add("btnEntrance");
      backToTopButton.style.display = "block";
    }
  } else { // Hide backToTopButton
    if (backToTopButton.classList.contains("btnEntrance")) {
      backToTopButton.classList.remove("btnEntrance");
      backToTopButton.classList.add("btnExit");
      setTimeout(function () {
        backToTopButton.style.display = "none";
      }, 250);
    }
  }
};

backToTopButton.addEventListener("click", smoothScrollBackToTop);

function backToTop() {
  window.scrollTo(0, 0);
};

function smoothScrollBackToTop() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;

  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  };
};

function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
};

// /////////////////////////End Back To Top\\\\\\\\\\\\\\\\\\\\\\\\\

// //////////////////////////Start Update\\\\\\\\\\\\\\\\\\\\\\\\\\\

let dataChart = [];

const API_URL = "https://api.covid19api.com/summary";

async function covid(country) {

  countries.innerHTML = `<option value="World"> World </option>`;
  resetValue(confirmed);
  resetValue(deaths);
  resetValue(recovered);


  const res = await fetch(API_URL);
  const data = await res.json();
  console.log(country);

  if (res.status === 4 || res.status === 200) {
    date.textContent = new Date(data.Date).toDateString();

    if (country === '' || country === 'world') {
      const {
        TotalConfirmed,
        TotalDeaths,
        TotalRecovered,
        NewConfirmed,
        NewDeaths,
        NewRecovered
      } = data.Global;

      total(TotalConfirmed, TotalDeaths, TotalRecovered);
      newUpdate(NewConfirmed, NewDeaths, NewRecovered);

      nameCountry.textContent = 'The World';
      dataChart = [TotalConfirmed, TotalDeaths, TotalRecovered];
    };


    data.Countries.forEach(item => {
      const option = document.createElement('option');
      option.value = item.Country;
      option.textContent = item.Country;
      countries.appendChild(option)

      if (country === item.Country) {

        total(item.TotalConfirmed, item.TotalDeaths, item.TotalRecovered);
        newUpdate(item.NewConfirmed, item.NewDeaths, item.NewRecovered);

        nameCountry.textContent = item.Country;
        dataChart = [item.TotalConfirmed, item.TotalDeaths, item.TotalRecovered];
      }
    });

    drawChart(dataChart);

  } else {

    chart.innerHTML = `<h2> Loading..... </h2>`

  }
};

const speed = 300;

function counting(target, element) {

  const inc = target / speed;
  const count = +element.textContent;

  if (count < target) {

    element.textContent = Math.ceil(count + inc);
    setTimeout(() => {
      counting(target, element)
    }, 1)
  } else {
    element.textContent = target;
  }
};

function total(Confirmed, Deaths, Recovered) {

  // Total Confirmed
  counting(Confirmed, confirmed.children[1]);
  // Total Deaths
  counting(Deaths, deaths.children[1]);
  // Total Recovered
  counting(Recovered, recovered.children[1]);
};

function newUpdate(Confirmed, Deaths, Recovered) {
  // New Confirmed
  counting(Confirmed, confirmed.children[2]);
  // New Deaths
  counting(Deaths, deaths.children[2]);
  // New Recovered
  counting(Recovered, recovered.children[2]);
};

function resetValue(element) {
  element.children[1].textContent = 0;
  element.children[2].textContent = 0;
};

function drawChart(data) {

  chart.innerHTML = '';
  const ctx = document.createElement('canvas');
  chart.appendChild(ctx);

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Total Confirmed', 'Total Deaths', 'Total Recovered'],
      datasets: [{
        label: nameCountry.textContent,
        data: data,
        backgroundColor: ['crimson', 'black', 'green'],
      }]
    },
    options: {}
  });
};

covid(search.value);

const btnSearch = document.querySelector('.buttonSrch')

btnSearch.addEventListener('click', (e) => {

  e.preventDefault();
  covid(search.value);
  console.log(search.value);
  search.value = '';

})

// //////////////////////////End Update\\\\\\\\\\\\\\\\\\\\\\\\\\\\