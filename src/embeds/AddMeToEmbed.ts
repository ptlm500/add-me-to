import { MessageEmbed, MessageEmbedOptions } from "discord.js";

export default class AddMeToEmbed extends MessageEmbed {
  constructor(options : MessageEmbedOptions) {
    super({
      ...options,
      footer: EMBED_FOOTER,
      timestamp: Date.now()
    });
  }
}

const EMBED_FOOTER = {
  text: '@add me to',
  iconURL: 'https://i.imgur.com/loE8sfz.png'
};
