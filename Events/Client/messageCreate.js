module.exports = {
  name: "messageCreate",
  once: false,
  async execute(msg) {
    if (msg.author.bot) {
      if (msg.content.startsWith("🎶 | ")) {
        try {
          setTimeout(() => {
            msg.delete().catch(() => null);
          }, 3_600_000);
        } catch {
          console.log("Couldn't find bot response to delete");
          return;
        }
      } else {
        return;
      }
    } else {
      return;
    }
  },
};
