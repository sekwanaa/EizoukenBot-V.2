module.exports = {
  name: "messageCreate",
  once: false,
  async execute(msg) {
    console.log(msg);
    if (msg.author.bot) {
      if (
        msg.content.startsWith("In the year") ||
        msg.content.startsWith("Reminder that the current themes") ||
        msg.content.startsWith("'🎶 | ")
      ) {
        try {
          setTimeout(() => {
            msg.delete().catch(() => null);
          }, 360000);
        } catch {
          console.log("Couldn't find bot response to delete");
          return;
        }
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
