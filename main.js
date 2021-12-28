let states_option = document.getElementById("states");
let districts_option = document.getElementById("districts");
let date = document.getElementById("date");
// let submit_btn = document.getElementById("submit-btn");
let state_ind = null,
    district_ind = null;
let jsonData = null;
let result = {
    district_id: null,
    date: null,
};
let vaccination_centers = document.getElementById("vaccination-centers");
vaccination_centers.style.visibility = 'hidden';
let table_body = document.getElementsByTagName("tbody")[0]; 

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
    // console.log(jsonData[state_ind].state_name);

    //loading the districts based on the selections in the states dropdown
    loadDistricts(jsonData, state_ind);
}

function onDistrictsChanged() {
    date.disabled = false;
    district_ind = districts_option.selectedIndex - 1;
    result.district_id =
        jsonData[state_ind].districts[district_ind].district_id;
    // console.log(jsonData[state_ind].districts[district_ind].district_name);
}

function printDate() {
    let today = date.value.split("-").reverse().join("-");
    result.date = today;
    // console.log(today);
}

function printCenters() {
    // console.log(result.district_id);
    // console.log(result.date);
    vaccination_centers.style.visibility = 'visible'; 

    let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${result.district_id}&date=${result.date}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            data = data.sessions;
            for (let i = 0; i < data.length; i++) {
                let row = document.createElement('tr'); 
                
                let center_id = document.createElement('td'); 
                let center_id_text = document.createTextNode(
                    `${data[i].center_id}`
                );
                center_id.appendChild(center_id_text); 
                row.appendChild(center_id); 

                let name = document.createElement('td'); 
                let name_text = document.createTextNode(`${data[i].name}`);
                name.appendChild(name_text); 
                row.appendChild(name); 

                let address = document.createElement('td'); 
                let address_text = document.createTextNode(`${data[i].address}`); 
                address.appendChild(address_text); 
                row.appendChild(address); 

                let state = document.createElement('td'); 
                let state_text = document.createTextNode(`${data[i].state_name}`);
                state.appendChild(state_text); 
                row.appendChild(state); 

                let district = document.createElement('td'); 
                let district_text = document.createTextNode(`${data[i].district_name}`);
                district.appendChild(district_text); 
                row.appendChild(district); 

                let pincode = document.createElement('td'); 
                let pincode_text = document.createTextNode(`${data[i].pincode}`);
                pincode.appendChild(pincode_text); 
                row.appendChild(pincode); 

                let vaccine = document.createElement('td'); 
                let vaccine_text = document.createTextNode(`${data[i].vaccine}`);
                vaccine.appendChild(vaccine_text); 
                row.appendChild(vaccine); 

                let dose1 = document.createElement('td'); 
                let dose1_text = document.createTextNode(
                    `${data[i].available_capacity_dose1}`
                );
                dose1.appendChild(dose1_text); 
                row.appendChild(dose1); 

                let dose2 = document.createElement('td'); 
                let dose2_text = document.createTextNode(
                    `${data[i].available_capacity_dose2}`
                );
                dose2.appendChild(dose2_text); 
                row.appendChild(dose2); 

                let fees = document.createElement('td'); 
                let fees_text = document.createTextNode(`${data[i].fee_type}`);
                fees.appendChild(fees_text); 
                row.appendChild(fees); 
                
                table_body.appendChild(row); 
            }
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
