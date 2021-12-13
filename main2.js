let states_option = document.getElementById("states"); 
let districts_option = document.getElementById("districts"); 
let message = document.getElementById("message"); 
let submit_btn = document.getElementById("submit-btn"); 
let state_ind = null, district_ind = null; 
let jsonData = null;

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
            let html = '';
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
    let html = '';
    for (let d of data[stateId].districts){
        // console.log(`${d.district_id} - ${d.district_name}`);
        html += `
            <option value='${d.district_id}'>${d.district_name}</option>
        `
    }

    document.getElementById("districts").innerHTML = html; 
}

function onStatesChanged() {
    state_ind = states_option.selectedIndex + 1;
    // console.log(jsonData[index]);
    //loading the districts based on the selections in the states dropdown
    loadDistricts(jsonData, state_ind); 

}

function onDistrictsChanged(){
    district_ind = districts_option.selectedIndex; 
    // console.log(jsonData[state_ind].districts[district_ind]);

    let html = `Your state is ${jsonData[state_ind].state_name} and your district is ${jsonData[state_ind].districts[district_ind].district_name}`;
    message.innerHTML = html; 
}

//calling the states function for loading the states initially in the dropdown
loadStates();

//this is keeping the watch on states dropdown
if (states_option.addEventListener) {
  states_option.addEventListener("change", onStatesChanged, false);
} else {
  states_option.attachEvent("onchange", onStatesChanged, false);
}

//this is keeping the watch on districts dropdown
if (districts_option.addEventListener){
    districts_option.addEventListener("change", onDistrictsChanged, false);
}
else {
    districts_option.attachEvent("onchange", onDistrictsChanged, false); 
}