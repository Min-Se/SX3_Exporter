//index.js
import { getVideo } from "api.js";
document.getElementById("parse-button").addEventListener("click", parseText);
document.getElementById("clear-button").addEventListener("click", clearInput);

// HTML FRAGMENT
const htmlFragment = `
            <li class="link">
                <a href="{{id}}#{{file}}">{{message}}</a>
                <a class="sub" 	href="{{sub}}#{{file}}">Subs</a>
            </li>
        `;

// FRAGMENT RENDERER
function renderHTML(fragment, message, id, sub) {
	const renderedHTML = fragment
		.replace("{{id}}", `${id}`)
		.replaceAll("{{file}}", message)
		.replace("{{message}}", message)
		.replace("{{sub}}", sub);
	return renderedHTML;
}

const outputContainer = document.querySelector("#output"); // Get Document output container
function clearInput() {
	document.getElementById("textInput").value = "";
}
async function parseText() {
	// Get the input element and its value
	const inputElement = document.getElementById("textInput");
	const textToParse = inputElement.value;

	// Parse the HTML string into a DOM object
	const parser = new DOMParser();
	const doc = parser.parseFromString(textToParse, "text/html");

	// Find all 'li' elements
	const liElements = doc.querySelectorAll("ul li");

	// Iterate over each 'li' element
	for (let li of liElements) {
		// Find 'a' element inside 'li' and get its 'href' attribute
		const aElement = li.querySelector("a");
		let href = aElement.getAttribute("href");
		href = href.replace("//", "");
		if (href.endsWith("/")) {
			href = href.slice(0, -1);
		}
		const id = href.split("/").pop(); // Remove trailing slash and get the last part of the href as the id

		// Call the API and wait for it to respond
		const videoData = await getVideo(id);

		// If the API returned valid data, render it
		if (videoData) {
			// Call the renderHTML function with the video title and id
			outputContainer.innerHTML += renderHTML(
				htmlFragment,
				videoData.title,
				videoData.videos[0].url,
				videoData.subtitles[0].url
			);
		}
	}
}
