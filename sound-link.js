// LINK EXAMPLE
// <a class="sound_link" data-playlist="Music" data-sound="music" data-loop="0">Play Music/music</a>

Hooks.on("renderItemSheet", (app, html, options) => {
            searchSoundLinks(html);
});

Hooks.on("renderJournalSheet", (app, html, options) => {
            searchSoundLinks(html);
});
function searchSoundLinks (html){
    html.find('.sound_link').click((ev) => {
                    let element = ev.currentTarget;                    
					//let chatContent = `/toggle-playlist-sound ` + element.dataset.playlist + ` ` +  element.dataset.sound;
					let chatContent = `{{macro "toggle-playlist-sound" "` + element.dataset.playlist + `" "` +  element.dataset.sound + `"}}`;
					//console.log(chatContent);
					ChatMessage.create({content : chatContent});
            });
}
