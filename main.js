const states_option = document.getElementById("states");
const districts_option = document.getElementById("districts");
const date = document.getElementById("date");
let state_ind = null;
let district_ind = null;
let jsonData = null;
let result = {
	district_id: null,
	date: null,
};
const vaccineCenters = document.getElementById("vaccine-center"); 
const dateSelected = document.getElementById("selected-date"); 

// Fetching the json Data from the file for the first time
function loadStates() {
	fetch("./data.json")
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			//storing the json data in jsonData for future use
			jsonData = data;

			//creating options for select tag
			let html = `
                <option hidden disabled selected value> -- select a state -- </option>
            `;
			for (let i = 1; i < data.length; i++) {
				html += `
                    <option value='${i}'>${data[i].state_name}</option>
			 	`;
			}
			document.getElementById("states").innerHTML = html;
			//loading districts in the initial case i.e for state no. 1
			loadDistricts(data, 1);
		});
}

function loadDistricts(data, stateId) {
	let html = `
        <option hidden disabled selected value> -- select a district -- </option>
    `;
	for (let d of data[stateId].districts) {
		// console.log(`${d.district_id} - ${d.district_name}`);
		html += `
            <option value='${d.district_id}'>${d.district_name}</option>
        `;
	}

	document.getElementById("districts").innerHTML = html;
}

function onStatesChanged() {
	districts_option.disabled = false;
	state_ind = states_option.selectedIndex;
	//loading the districts based on the selections in the states dropdown
	loadDistricts(jsonData, state_ind);
	
	clearData(); 
}

function onDistrictsChanged() {
	date.disabled = false;
	district_ind = districts_option.selectedIndex - 1;
	result.district_id = jsonData[state_ind].districts[district_ind].district_id;

	clearData(); 
}

function getDate() {
	let today = date.value.split("-").reverse().join("-");
	result.date = today;
}

function clearData(){
	vaccineCenters.innerHTML = ""; 
	dateSelected.style.visibility = "hidden"; 
	vaccineCenters.style.visibility = "hidden"; 
}

function renderCenters() {
	let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${result.district_id}&date=${result.date}`;

	fetch(url)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			data = data.sessions;
			let html = ``;
			for (let i = 0; i < data.length; i++) {
				html += `
					<div class="vaccine-card">
						<h3 class="center-id" id="center-id">${data[i].center_id}</h3>
						<h2 class="center-name" id="center-name">${data[i].name}</h2>
						<h3 class="center-add" id="center-add">${data[i].address}, ${data[i].district_name}, ${data[i].state_name}</h3>
						<h3 class="center-pin" id="center-pin">${data[i].pincode}</h3>
						<h3 class="center-vaccine" id="center-vaccine">${data[i].vaccine}</h3>
						<div class="vaccine-dose">
							<h3 class="center-dose-1" id="center-dose-1">${data[i].available_capacity_dose1}</h3>
							<h3 class="center-dose-2" id="center-dose-2">${data[i].available_capacity_dose2}</h3>
						</div>
						<h3 class="center-fee" id="center-fee">${data[i].fee_type}</h3>
					</div>
				`;
			}

			vaccineCenters.innerHTML = html; 
			dateSelected.textContent = `Date: ${result.date}`; 
			dateSelected.style.visibility = "visible"; 
			vaccineCenters.style.visibility = "visible"; 
		})
		.catch(() => console.log("no data found..."));
}

//calling the states function for loading the states initially in the dropdown
loadStates();

//this is keeping the watch on states dropdown
states_option.addEventListener("change", onStatesChanged);

//this is keeping the watch on districts dropdown
districts_option.addEventListener("change", onDistrictsChanged);

//keeping track of change in date
date.addEventListener("change", clearData); 

//this is keeping the watch on date dropdown
date.addEventListener("change", getDate);
