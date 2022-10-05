
import { EmbedBuilder } from "discord.js";

export default new EmbedBuilder()
  .setTimestamp(Date.now())
  .setFooter({
    text: '@add me to',
    iconURL: 'https://i.imgur.com/loE8sfz.png'
  });