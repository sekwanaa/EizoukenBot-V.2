module.exports = {
  name: "messageCreate",
  once: false,
  async execute(msg) {
    if (msg.author.bot) {
      if (msg.content.startsWith("🎶 | ")) {
        try {
          setTimeout(() => {
            msg.delete().catch(() => null);
          }, 360000);
        } catch {
          console.log("Couldn't find bot response to delete");
          return;
        }
      } else if (msg.embeds[0].data) {
        //if message is an embed
        return;
      } else {
        try {
          setTimeout(() => {
            msg.delete().catch(() => null);
          }, 60000);
        } catch {
          console.log("Couldn't find bot response to delete");
          return;
        }
      }
    } else {
      return;
    }
  },
};
