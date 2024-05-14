function pokemon(name, img, stats, types) {
	this.name = name;
	this.img = img;
	this.stats = stats;
	this.types = types;
}

function displayPokemon() {
	myPokemon.forEach((element) => {
		let div = document.createElement("div");
		let img = document.createElement("img");
		let p = document.createElement("p");
		p.innerHTML = "#" + element.id.toString().padStart(3, "0");
		img.src = element.sprites.front_default;
		div.addEventListener("click", displayStats);
		div.appendChild(img);
		div.appendChild(p);
		document.body.querySelector("section").appendChild(div);
	});
}

function displayStats(event) {
	let aside = document.querySelector("aside");
	aside.innerHTML = "";
	let index = event.target.parentElement.querySelector("p").innerHTML;
	index = index.substring(1);
	while (index[0] == 0) {
		index = index.substring(1);
	}
	index = Number(index) - 1;

	let h1 = document.createElement("h1");
	let img = document.createElement("img");
	let section = document.createElement("section");
	let p = document.createElement("p");
	let p2 = document.createElement("p");
	let p3 = document.createElement("p");
	let button = document.createElement("button");
	let myEle = document.createElement("div");
	let styleColor;
	img.src = myPokemon[index].sprites.front_default;
	button.innerHTML = languageJSON[language]["addTeam"];
	button.addEventListener("click", (e) => {
		addMember(e, index);
	});
	if (Math.floor(Math.random() * 10) == 0) {
		img.src = myPokemon[index].sprites.front_shiny;
		setTimeout(() => {
			console.log(languageJSON[language].shiny);
		}, 2000);
	}
	for (let i = 0; i < myPokemon[index].types.length; i++) {
		let div = document.createElement("div");
		let typeText = document.createElement("p");
		typeText.innerHTML = languageJSON[language][myPokemon[index].types[i].type.name];
		div.classList.add("type");
		div.style.backgroundColor = style.getPropertyValue(`--${myPokemon[index].types[i].type.name}`);
		if (styleColor == null || styleColor == "") {
			styleColor = div.style.backgroundColor;
		}
		div.appendChild(typeText);
		section.appendChild(div);
	}
	p.innerHTML = `${languageJSON[language]["height"]}: ${myPokemon[index].height / 10} m - ${languageJSON[language]["weight"]}: ${myPokemon[index].weight / 10} kg`;

	for (const iterator of mySpecies[index].names) {
		if (iterator.language.name == language) {
			h1.innerHTML = iterator.name;
		}
	}
	if (mySpecies[index].is_legendary || mySpecies[index].is_mythical) {
		h1.innerHTML = `&#11088; ${h1.innerHTML}`;
	}
	let flavorTextArr = mySpecies[index].flavor_text_entries;
	for (let i = flavorTextArr.length - 1; i != 0; i--) {
		if (flavorTextArr[i].language.name == language) {
			p2.innerHTML = flavorTextArr[i].flavor_text;
			break;
		}
	}
	myPokemon[index].generationURL = mySpecies[index].evolution_chain.url;
	generation = mySpecies[index].generation.url;
	myEle.appendChild(getEvoChain(index));
	fetch(generation, { method: "GET" })
		.then((response) => {
			console.log(`Response: ${response.status} ${response.statusText}`);
			return response.json();
		})
		.then((text) => {
			p3.innerHTML = languageJSON[language]["intro"] + languageJSON[language][text.main_region.name];
		});

	let conSection1 = document.createElement("section");
	let conSection2 = document.createElement("section");
	let containerDiv1 = document.createElement("div");
	let containerDiv2 = document.createElement("div");

	conSection1.appendChild(h1);
	conSection1.appendChild(img);
	conSection1.style.backgroundColor = styleColor;
	conSection1.appendChild(myEle);
	aside.appendChild(conSection1);

	containerDiv1.appendChild(section);
	containerDiv1.appendChild(p);
	containerDiv1.appendChild(p2);
	containerDiv1.appendChild(p3);
	containerDiv1.appendChild(button);

	containerDiv2.appendChild(getStatElement(index));
	conSection2.appendChild(containerDiv1);
	conSection2.appendChild(containerDiv2);

	styleColor = styleColor.slice(4, -1);
	conSection2.style.backgroundColor = `rgba(${styleColor}, 0.6)`;
	aside.appendChild(conSection2);
	if (myTeam.length != 0) {
		displayMembers();
	}
}

function getStatElement(index) {
	if (index === null || index === "") return console.error("stat Element error " + index);
	let list = document.createElement("ul");
	for (let i = 0; i < myPokemon[index].stats.length; i++) {
		let listItem = document.createElement("li");
		let h3 = document.createElement("h3");
		let canvas = document.createElement("canvas");
		h3.innerHTML = languageJSON[language][myPokemon[index].stats[i].stat.name];
		canvas.width = 255;
		canvas.height = 20;
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = style.getPropertyValue(`--${myPokemon[index].stats[i].stat.name}`);
		ctx.fillRect(0, 0, myPokemon[index].stats[i].base_stat, 20);
		ctx.strokeRect(0, 0, 255, 20);
		listItem.appendChild(h3);
		listItem.appendChild(canvas);
		list.appendChild(listItem);
	}
	return list;
}

function addMember(event, index) {
	if (myTeam.length >= 6) {
		console.log("team is full");
		return 0;
	}
	let img;
	let name;
	let stats = [];
	let types = [];
	img = event.target.parentElement.parentElement.parentElement.querySelector("section:first-of-type").querySelector("img").src;
	name = myPokemon[index].name;
	let username = prompt(`give you pokemon a name`, name);
	if (username != undefined || username != null) {
		name = username;
	}
	for (let i = 0; i < 6; i++) {
		stats.push(myPokemon[index].stats[i].base_stat);
	}
	for (let i = 0; i < myPokemon[index].types.length; i++) {
		types.push(myPokemon[index].types[i].type.name);
	}
	myTeam.push(new pokemon(name, img, stats, types));
	localStorage.setItem("myTeam", JSON.stringify(myTeam));
	displayMembers();
}

function displayMembers() {
	if (document.body.querySelector("aside > div") == null || document.body.querySelector("aside > div") == undefined) {
		document.body.querySelector("aside").appendChild(document.createElement("div"));
	}
	let container = document.body.querySelector("aside > div");
	container.innerHTML = "";
	for (let i = 0; i < myTeam.length; i++) {
		let figure = document.createElement("figure");
		let img = document.createElement("img");
		let figcaption = document.createElement("figcaption");
		let button = document.createElement("button");
		button.innerHTML = "remove";
		button.addEventListener("click", removeMember);
		img.src = myTeam[i].img;
		for (let index = 0; index < mySpecies.length; index++) {
			if (mySpecies[index].name == myTeam[i].name) {
				mySpecies[index].names.forEach((element) => {
					if (element.language.name == language) {
						figcaption.innerHTML = element.name;
					}
				});
			}
		}
		figcaption.addEventListener("click", renameMember);
		figure.appendChild(img);
		figure.appendChild(figcaption);
		figure.appendChild(button);
		figure.style.borderColor = style.getPropertyValue(`--${myTeam[i].types[0]}`);
		container.appendChild(figure);
	}
	displayTeamInfo();
}

function displayTeamInfo() {
	let section;
	if (document.body.querySelector("aside").querySelector("section:last-of-type > div > h2") == null) {
		section = document.createElement("section");
	} else {
		section = document.body.querySelector("aside > section:last-of-type");
		section.innerHTML = "";
	}
	let div = document.createElement("div");
	for (let i = 0; i < myPokemon[0].stats.length; i++) {
		let totalStat = 0;
		for (let index = 0; index < myTeam.length; index++) {
			totalStat += myTeam[index].stats[i];
		}
		let h2 = document.createElement("h2");
		h2.innerHTML = languageJSON[language]["total"] + " " + languageJSON[language][myPokemon[0].stats[i].stat.name];
		let canvas = document.createElement("canvas");
		canvas.width = 255 * (myTeam.length / 2);
		canvas.height = 20;
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = style.getPropertyValue(`--${myPokemon[0].stats[i].stat.name}`);
		ctx.fillRect(0, 0, totalStat / 2, 20);
		ctx.strokeRect(0, 0, Math.floor(255 * (myTeam.length / 2)), 20);
		div.appendChild(h2);
		div.appendChild(canvas);
		section.appendChild(div);
	}
	let types = new Set();
	for (let i = 0; i < myTeam.length; i++) {
		for (let index = 0; index < myTeam[i].types.length; index++) {
			types.add(myTeam[i].types[index]);
		}
	}
	let containerDiv = document.createElement("div");
	let h2 = document.createElement("h2");
	h2.innerHTML = "Total types";
	containerDiv.appendChild(h2);
	for (const i of types) {
		let div = document.createElement("div");
		div.classList.add("type");
		div.innerHTML = languageJSON[language][i];
		div.style.backgroundColor = style.getPropertyValue(`--${i}`);
		containerDiv.appendChild(div);
	}
	section.appendChild(containerDiv);
	containerDiv.parentElement.style.backgroundColor = document.body.querySelector("section:nth-of-type(2)").style.backgroundColor;
	document.body.querySelector("aside").appendChild(section);
}

function removeMember(event) {
	let name = event.currentTarget.parentElement.querySelector("figcaption").innerHTML;
	if (!confirm(`${languageJSON[language]["confirm1"]}  ${name} ${languageJSON[language]["confirm2"]}`)) return 0;
	for (let i = 0; i < myTeam.length; i++) {
		if (myTeam[i].name == name) {
			myTeam.splice(i, 1);
			displayMembers();
			localStorage.setItem("myTeam", JSON.stringify(myTeam));
			return 1;
		}
	}
	return 0;
}

function renameMember(event) {
	let currentName = event.target.innerHTML;
	let newName = prompt(languageJSON[language]["rename"]);
	if (newName == undefined || newName == null) {
		return 0;
	}
	for (let i = 0; i < myTeam.length; i++) {
		if (myTeam[i].name == currentName) {
			myTeam[i].name = newName;
			displayMembers();
		}
	}
}

function getEvoChain(index) {
	let container = document.createElement("div");
	console.log(index);
	fetch(myPokemon[index].generationURL, { method: "GET" })
		.then((response) => {
			console.log(`Response: ${response.status} ${response.statusText}`);
			return response.json();
		})
		.then((text) => {
			{
				let figure = document.createElement("figure");
				let img = document.createElement("img");
				img.src = getPokemonImg(text.chain.species.name);
				let figcaption = document.createElement("figcaption");
				for (let index = 0; index < mySpecies.length; index++) {
					if (mySpecies[index].name == text.chain.species.name) {
						mySpecies[index].names.forEach((objects) => {
							if (objects.language.name == language || objects.language.name == "ja-Hrkt") {
								figcaption.innerHTML = objects.name;
							}
						});
					}
				}
				figure.appendChild(img);
				figure.appendChild(figcaption);
				container.appendChild(figure);
			}
			let container1 = document.createElement("div");
			let container2 = document.createElement("div");
			text.chain.evolves_to.forEach((element) => {
				element.evolves_to.forEach((element2) => {
					let figure = document.createElement("figure");
					let img = document.createElement("img");
					img.src = getPokemonImg(element2.species.name);
					let figcaption = document.createElement("figcaption");
					for (let index = 0; index < mySpecies.length; index++) {
						if (mySpecies[index].name == element2.species.name) {
							mySpecies[index].names.forEach((objects) => {
								if (objects.language.name == language || objects.language.name == "ja-Hrkt") {
									figcaption.innerHTML = objects.name;
								}
							});
						}
					}
					figure.appendChild(img);
					figure.appendChild(figcaption);
					container2.appendChild(figure);
				});
				let figure = document.createElement("figure");
				let img = document.createElement("img");
				img.src = getPokemonImg(element.species.name);
				let figcaption = document.createElement("figcaption");
				for (let index = 0; index < mySpecies.length; index++) {
					if (mySpecies[index].name == element.species.name) {
						mySpecies[index].names.forEach((objects) => {
							if (objects.language.name == language || objects.language.name == "ja-Hrkt") {
								figcaption.innerHTML = objects.name;
							}
						});
					}
				}
				figure.appendChild(img);
				figure.appendChild(figcaption);
				container1.appendChild(figure);
			});
			container.appendChild(container1);
			container.appendChild(container2);
		});
	return container;
}

function getPokemonImg(name) {
	for (let i = 0; i < myPokemon.length; i++) {
		if (name == myPokemon[i].name) {
			return myPokemon[i].sprites.front_default;
		}
	}
}

function setLang(event) {
	language = event.target.innerHTML.slice(0, 2);
	if (language == "ge") language = "de";
	localStorage.setItem("language", language);
	location.reload();
}

//replace this value with 898!!!!!!!!!!!!!!!
let pokemonCount = 898;
let myPokemon = [];
let mySpecies = [];
let promises = [];
let myTeam = [];
let languageJSON = [];
let language = "en";
let style = getComputedStyle(document.documentElement);

{
	let container = localStorage.getItem("myTeam");
	container = JSON.parse(container);
	if (container != null && container != undefined) {
		myTeam = container;
	}
	let tempLanguage = localStorage.getItem("language");
	if (tempLanguage != null && tempLanguage != undefined) {
		language = tempLanguage;
	}
	let options = document.querySelectorAll("option");
	for (let i = 0; i < options.length; i++) {
		options[i].addEventListener("click", setLang);
	}
}

for (let i = 1; i <= pokemonCount; i++) {
	promises.push(
		fetch(`https://pokeapi.co/api/v2/pokemon/${i}`, { method: "GET" })
			.then((response) => {
				console.log(`Response: ${response.status} ${response.statusText}`);
				return response.json();
			})
			.then((text) => {
				myPokemon.push(text);
			})
	);
	promises.push(
		fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`, { method: "GET" })
			.then((response) => {
				console.log(`Response: ${response.status} ${response.statusText}`);
				return response.json();
			})
			.then((text) => {
				mySpecies.push(text);
			})
	);
}

promises.push(
	fetch("./js/text.json", { method: "GET" })
		.then((response) => {
			console.log(`Response: ${response.status} ${response.statusText}`);
			return response.json();
		})
		.then((text) => {
			languageJSON = text;
			console.log(languageJSON);
		})
);

Promise.all(promises)
	.then(function handleData(data) {
		console.log(myPokemon);
		console.log(mySpecies);
		myPokemon.sort((a, b) => {
			if (a.id < b.id) return -1;
			if (a.id > b.id) return 1;
			return 0;
		});
		mySpecies.sort((a, b) => {
			if (a.id < b.id) return -1;
			if (a.id > b.id) return 1;
			return 0;
		});
		displayPokemon();
	})
	.catch(function handleError(error) {
		console.log("Error" + error);
	});
