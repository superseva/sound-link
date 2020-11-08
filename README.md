# sound-link
Ability to add sound button in your journals and items text areas that will toggle a sound from your Sound Library.
The link needs to be added in the HTML part of the text editor. 
It looks like this:

```<a class="sound_link" data-playlist="PLAYLIST NAME" data-sound="SOUND NAME">Sound Name</a>```

**IMPORTANT**

This does require **The Furnace** module installed with **Advanced Macros *ON***.

You also need to import **"toggle-playlist-sound"** macro from the *Furnace Macro Compendium* in to your game since this will be called from the sound link.

![Example](https://raw.githubusercontent.com/superseva/sound-link/master/sound-link-example.jpg)

Thanks to **brunocalado** for writing this macro that helps in generating the link text so you can easily paste it inside the journal.
[https://raw.githubusercontent.com/brunocalado/mestre-digital/master/Foundry%20VTT/Macros/Ferramentas/Sound%20Link%20Builder.js](https://raw.githubusercontent.com/brunocalado/mestre-digital/master/Foundry%20VTT/Macros/Ferramentas/Sound%20Link%20Builder.js)

```
/* Sound Link Builder v1.0
Macro for: https://github.com/superseva/sound-link
Source: https://raw.githubusercontent.com/brunocalado/mestre-digital/master/Foundry%20VTT/Macros/Ferramentas/Sound%20Link%20Builder.js
Icon: 
*/

main();

function main() {
  let playlists_list = "";
  Array.from(game.playlists).map((el) => {
    playlists_list += `<option value="${el.data.name}">${el.data.name}</option>`;
  });
  
  let template = `  
  <p>    
    Playlist Name: <select id="playlistname">${playlists_list}</select>
  </p>
  <p>
    Sound Name: <input id="soundname" type="text" style="width: 250px" value=''>
  </p>
  <p>
    Link Name: <input id="linkname" type="text" style="width: 250px" value=''>
  </p>
  <br />
  `;
  new Dialog({
    title: "Sound Link Builder v1.0",
    content: template,
    buttons: {
      ok: {
        label: "Generate",
        callback: async (html) => {
          generateCode(html);
        },
      },
    },
  }).render(true);
}

async function generateCode(html) {  
  let soundname = html.find("#soundname")[0].value;
  let linkname = html.find("#linkname")[0].value;
  let playlistname = html.find("#playlistname")[0].value;
  let template='';  
  
  template = `<a class="sound_link" data-playlist="${playlistname}" data-sound="${soundname}">${linkname}</a>`;

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
