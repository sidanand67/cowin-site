let states_option = document.getElementById("states");
let districts_option = document.getElementById("districts");

function loadStates() {
	fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			//storing the json data in jsonData for future use
			jsonData = data.states;

			//creating options for select tag
			let html = "";
			for (let i = 0; i < jsonData.length; i++) {
				html += `
                    <option value='${i}'>${jsonData[i].state_name}</option>
			 	`;
			}

			document.getElementById("states").innerHTML = html;
			// console.log(state_id);
		});
}

loadStates();

// https://cdn-api.co-vin.in/api/v2/admin/location/districts/{state_id}
