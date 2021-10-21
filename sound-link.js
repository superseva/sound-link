// LINK EXAMPLE

// @Sound[Playlist Name|Sound Name]{Sound Name}
// OR in the HMTL editor
// <a class="sound_link" data-playlist="Music" data-sound="music" data-loop="0">Play Music/music</a>

class HTMLEnricherSound {
  static patchEnrich() {
    const originalEnrich = TextEditor.enrichHTML
    TextEditor.enrichHTML = function (html, options) {
      html = originalEnrich.apply(this, [html, options])
      html = HTMLEnricherSound.enrichAll(html)
      return html
    }
  }
  static bindRichTextLinks(html) {
    html.find('.sound_link').click((ev) => {
      let element = ev.currentTarget
      let startsWith = ''
      let playlistName = element.dataset.playlist
      let soundName = element.dataset.sound
      const playlist = game.playlists.contents.find((p) =>
        startsWith ? p.name.startsWith(playlistName) : p.name === playlistName,
      )
      if (!playlist) return
      const sound = playlist.sounds.find((s) =>
        startsWith ? s.name.startsWith(soundName) : s.name === soundName,
      )
      if (sound)
        playlist.updateEmbeddedDocuments('PlaylistSound', [
          { _id: sound.id, playing: !sound.playing },
        ])
    })
  }
  /**
   * Replace the first @Sound link in the text with a rich link.
   * @param text
   */
  static enrich(text) {
    const sPos = text.indexOf('@Sound')
    const ePos = text.indexOf('}', sPos)
    const enrichMe = text.slice(sPos, ePos + 1)
    const lBracket = enrichMe.indexOf('[')
    const rBracket = enrichMe.indexOf(']')
    const lCurly = enrichMe.indexOf('{')
    const rCurly = enrichMe.indexOf('}')
    // Required character is missing
    if (lBracket === -1 || rBracket === -1 || lCurly === -1 || rCurly === -1) {
      throw new Error(game.i18n.localize('SOUNDLINK.ENRICH.InvalidFormat'))
    }
    // Order is not correct
    if (rCurly < lCurly || lCurly < rBracket || rBracket < lBracket) {
      throw new Error(game.i18n.localize('SOUNDLINK.ENRICH.InvalidFormat'))
    }
    const options = enrichMe.slice(lBracket + 1, rBracket)

    if (options.indexOf('|') !== options.lastIndexOf('|')) {
      throw new Error(game.i18n.localize('SOUNDLINK.ENRICH.InvalidFormat'))
    }
    let linkText = enrichMe.slice(lCurly + 1, rCurly)
    // Empty names are not supported
    if (linkText === undefined || linkText === '') {
      throw new Error(game.i18n.localize('SOUNDLINK.ENRICH.EmptyLinkText'))
    }
    const [playlistName, soundName] = options.split('|')
    const result = `<a class="sound_link" data-playlist="${playlistName}" data-sound="${soundName}">${soundName}</a>`
    return text.slice(0, sPos) + result + text.slice(ePos + 1)
  }
  /**
   * Replace all rich text markup with appropriate rich text HTML in the specified text.
   * @param text
   */
  static enrichAll(text) {
    while (text.includes('@Sound')) {
      text = HTMLEnricherSound.enrich(text)
    }
    return text
  }
}

Hooks.on('init', () => {
  HTMLEnricherSound.patchEnrich()
})

Hooks.on('renderItemSheet', (app, html, options) => {
  HTMLEnricherSound.bindRichTextLinks(html)
})

Hooks.on('renderJournalSheet', (app, html, options) => {
  HTMLEnricherSound.bindRichTextLinks(html)
})
