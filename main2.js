let states_option = document.getElementById("states"); 
let districts_option = document.getElementById("districts"); 
let date = document.getElementById("date"); 
let submit_btn = document.getElementById("submit-btn"); 
let state_ind = null, district_ind = null; 
let jsonData = null;
let result = {
    "district_id": null,
    "date": null
};
let vaccination_centres = document.getElementById("vaccination-centres");

// Fetching the json Data from the file for the first time
function loadStates() {
    fetch("./data.json")
        .then(function(response){
            return response.json(); 
        })
        .then(function(data){
            //storing the json data in jsonData for future use
            jsonData = data;

            //creating options for select tag
            let html = `
                <option hidden disabled selected value> -- select an option -- </option>
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

function loadDistricts(data, stateId){
    let html = `
        <option hidden disabled selected value> -- select an option -- </option>
    `;
    for (let d of data[stateId].districts){
        // console.log(`${d.district_id} - ${d.district_name}`);
        html += `
            <option value='${d.district_id}'>${d.district_name}</option>
        `
    }

    document.getElementById("districts").innerHTML = html; 
}

function onStatesChanged() {
    state_ind = states_option.selectedIndex;
    // console.log(jsonData[state_ind].state_name);

    //loading the districts based on the selections in the states dropdown
    loadDistricts(jsonData, state_ind); 
}

function onDistrictsChanged(){
    district_ind = districts_option.selectedIndex - 1; 
    result.district_id = jsonData[state_ind].districts[district_ind].district_id;
    // console.log(jsonData[state_ind].districts[district_ind].district_name);
}

function printDate(){
    let today = date.value.split('-').reverse().join('-');
    result.date = today;
    // console.log(today);
}

function printCenters(){
    // console.log(result.district_id);
    // console.log(result.date);
    let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${result.district_id}&date=${result.date}`;
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            let html = data;
            console.log(data);
            vaccination_centres.innerHTML = html;
        });
}

//calling the states function for loading the states initially in the dropdown
loadStates();

//this is keeping the watch on states dropdown
states_option.addEventListener("change", onStatesChanged);

//this is keeping the watch on districts dropdown
districts_option.addEventListener("change", onDistrictsChanged);

//this is keeping the watch on date dropdown
date.addEventListener("change", printDate); 

//action after clicking submit
submit_btn.addEventListener("click", printCenters); 
