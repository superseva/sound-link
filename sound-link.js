// LINK EXAMPLE
// <a class="sound_link" data-playlist="Music" data-sound="music" data-loop="0">Play Music/music</a>

Hooks.on("renderItemSheet", (app, html, options) => {
    searchSoundLinks(html);
});

Hooks.on("renderJournalSheet", (app, html, options) => {
    searchSoundLinks(html);
});

function searchSoundLinks(html) {
    html.find(".sound_link").click((ev) => {
        let element = ev.currentTarget;
        let startsWith = '';
        let playlistName = element.dataset.playlist;
        let soundName = element.dataset.sound;

        const playlist = game.playlists.contents.find(p => startsWith ? p.name.startsWith(playlistName) : p.name === playlistName);
        if (!playlist)
            return;
        const sound = playlist.sounds.find(s => startsWith ? s.name.startsWith(soundName) : s.name === soundName);

        if (sound)
            playlist.updateEmbeddedDocuments("PlaylistSound", [{ _id: sound.id, playing: !sound.playing }]);

    });
}
