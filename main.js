document.getElementById("button1").addEventListener("click", loadJSON);

function loadJSON() {
	fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			let stateData = [];
			stateData[0] = undefined;
			for (let i in data.states){
				let stateName = data.states[i]['state_name'];
				// console.log(stateName);
				stateData.push(stateName);
			}

		
			let html = '';

			for(let i = 1; i < stateData.length; i++){
				html += `
			 		<li>${i} - ${stateData[i]}</li>
			 	`;
			}

			document.getElementById("result").innerHTML = html;
		});
}
