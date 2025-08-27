let traveldata = {};
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("srch");
const searchBtn = document.getElementById("searchbtn");
const clearBtn = document.getElementById("clearbtn");

async function load() {
    try {
        const res = await fetch("travel_recommendation_api.json");
        traveldata = await res.json();
    } catch (error) {
        console.error("error in loading json file", error);
    }
}
load();



document.querySelector(".searchbox form").addEventListener("submit", e => {
    e.preventDefault();
    let query = document.getElementById("srch").value.trim().toLowerCase();
    if (!query) return;
    searchplaces(query);
    clearBtn.style.display="inline-block";
    searchBtn.style.display="none";
  
});

function searchplaces(query) {
    let results = [];

    traveldata.countries.forEach(country => {
        if (country.name.toLowerCase().includes(query)) {
            results = results.concat(country.cities);
        } else {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query)) {
                    results.push(city);
                }
            });
        }
    });

    if (query.includes("temple")) {
        results = results.concat(traveldata.temples);
    }
    if (query.includes("beach")) {
        results = results.concat(traveldata.beaches);
    }
    results=results.slice(0,2);

    displayresults(results);
}
function getLocalTime(timeZone) {
  if (!timeZone) return "Timezone not available";
  return new Date().toLocaleTimeString('en-US', { 
    timeZone: timeZone, 
    hour12: true, 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric' 
  });
}
function displayresults(places) {
    let container = document.getElementById("results");
    if (!container) {
        container = document.createElement("div");
        container.id = "results";
        document.body.appendChild(container);
    }

    container.innerHTML = "";

    if (places.length === 0) {
        container.innerHTML = "<p>Not found</p>";
        return;
    }

    places.forEach(place => {
        let card = document.createElement("div");
        card.classList.add("card");

        // ⏰ get local time for each place
        let localTime = place.timeZone ? getLocalTime(place.timeZone) : "Timezone not available";

        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}">
            <h2>${place.name}</h2>
            <p>${place.description}</p>
            <p class="local-time">Local Time: (${place.timeZone || "N/A"}): ${localTime}</p>
        `;

        container.appendChild(card);
    });

    clearBtn.addEventListener("click", e => {
        e.preventDefault();
        container.innerHTML = "";
        searchInput.value = "";
        clearBtn.style.display = "none";
        searchBtn.style.display = "inline-block";
    });
}
