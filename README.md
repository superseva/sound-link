# sound-link
Ability to add a sound button in the text of your journals and items that will toggle a sound from your Sound Library.
You can add a sound link button in two ways
1. writing @Sound[Playlist name|Sound Name]{Sound Name} in the text editor of a journal. It's the same way you would write a link for an Actors or a Journals
- or -
2. Editing the HTML source of the editor and adding an a href link there. The link looks like this:
```<a class="sound_link" data-playlist="PLAYLIST NAME" data-sound="SOUND NAME">Sound Name</a>```

Be aware that the first option might not work and cause conflicts with other modes that modify how the TextEditor renders the content. If so, use the second option.

![Example](https://raw.githubusercontent.com/superseva/sound-link/master/sound-link-example.jpg)

**EXTRA**

Thanks to **brunocalado** for writing this macro that helps in generating the link text so you can easily paste it inside the journal.

```
/**
 * Sound Link Builder v2.0
 * Thanks to @brunocalado
 * Macro for: https://github.com/superseva/sound-link
 * Icon: 
 */

main()

function main() {
	let choices = new Object();
	for (let playlist of game.playlists) {
		let playlistName = playlist.name;
		choices[playlistName] = new Array();

		for (let sound of playlist.sounds) {
			let soundName = sound.name;
			choices[playlistName].push(soundName);
		}
	}

	new Dialog({
		title: "Sound Link Builder v2.0",
		content: generateContent(choices),
		buttons: {
			ok: {
				label: "Generate",
				icon: '<i class="fas fa-cog"></i>',
				callback: async (html) => {
					generateCode(html);
				},
			},
		},
	}).render(true);
}

function generateContent(choices) {
	let playlists = new String();
	for (let pl in choices) {
		let sounds = JSON.stringify(choices[pl]);
		playlists += `\n<option data-sounds='${sounds}'>${pl}</option>`;
	}

	let script = `
		<script>
			function switchSounds(select) {
				let sounds = document.getElementById("soundname");
			
				// remove old option in sounds select
				while (sounds.firstChild) {
					sounds.removeChild(sounds.firstChild);
				}
				
				// get sounds list from dataset
				let rawsounds = select.selectedOptions[0].dataset.sounds;
				if (rawsounds === undefined) {
					return;
				}
				
				// add option in sounds select
				for (let sound of JSON.parse(rawsounds)) {
					let option = document.createElement("option");
					option.innerHTML = sound;
					sounds.appendChild(option);
				}
			}
		</script>
	`;

	let style = `
		<style>
			.label {
				display: inline-block;
				width: 100px;
			}

			.input {
				display: inline-block;
				width: 250px !important;
				box-sizing: border-box;
			}
		</style>
	`;

	let html = `
		<p>
			<label for="playlistname" class="label"> Playlist Name: </label>
			<select id="playlistname" class="input" onchange="switchSounds(this)">
				<option>-----</option>
				${playlists}
			</select>
		</p>
		
		<p>
			<label for="soundname" class="label"> Sound Name: </label>
			<select id="soundname" class="input"></select>
		</p>
		
		<p>
			<label for="linkname" class="label"> Link Name: </label>
			<input id="linkname" type="text" class="input">
		</p>
	`;

	return `
		${script}
		${style}
		${html}
	`;
}


async function generateCode(html) {
	let playlistname = html.find("#playlistname").val();
	let soundname = html.find("#soundname").val();
	let linkname = html.find("#linkname").val();

	let template = `<a class="sound_link" data-playlist="${playlistname}" data-sound="${soundname}">${linkname}</a>`;

	/* view */
	let form = `
		<label>Copy this to the journal Source Code</label>
		<textarea id="moduleTextArea" rows="5" cols="33">${template}</textarea>
	`;

	let dialog = new Dialog({
		title: "module.json",
		content: form,
		buttons: {
			use: {
				label: "Copy to Clipboard",
				callback: () => {
					let copyText = document.getElementById("moduleTextArea"); /* Get the text field */
					copyText.select(); /* Select the text field */
					document.execCommand("copy"); /* Copy the text inside the text field */
					ui.notifications.notify(`Saved on Clipboard`); /* Alert the copied text */
				}
			}
		}
	}).render(true);
}
```
