const mongoCollections = require("../config/mongoCollections");
const themes = mongoCollections.themes;
let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
let yearChoice = new Date().getFullYear();

async function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}

let exportedMethods = {
    async themes(year) {
        if (year != undefined) {
            yearChoice = year;
        }

        const themesCollection = await themes();
        let message = `In the year ${yearChoice}, the themes are/were: `
        
        for (i=0;i<months.length;i++) {
            const currentThemes = await themesCollection.findOne({year: yearChoice, month: months[i]});
            if (currentThemes != null) {
                let month = await capitalize(currentThemes.month);
                message += `\n\t ${month}: ${currentThemes.theme}`;
            };
        }

        return message;
    },
    async addThemeData(msg, month, year, theme) {
        if (year != undefined) {
            yearChoice = year;
        }

        const themesCollection = await themes();
        const currentThemes = await themesCollection.findOne({year: yearChoice, month: month});
        if (currentThemes != null) {
            try {
                await themesCollection.findOneAndUpdate({year: yearChoice, month: month},{$set: {theme: theme}})
                if (currentThemes.theme == "") {
                    msg.channel.send(`You have updated the theme for ${month} ${yearChoice} to ${theme}`)
                } else {
                    msg.channel.send(`You have updated the theme for ${month} ${yearChoice} from ${currentThemes.theme} to ${theme}`)
                }
            } catch (error) {
                return msg.channel.send(error)
            }
        } else {
            try {
                let newTheme = {
                    year: yearChoice,
                    month: month,
                    theme: theme,
                }
        
                const add_theme = await themesCollection.insertOne(newTheme);
                msg.channel.send(`Theme: '${theme}' has been added to the month ${month} in ${yearChoice}`)
            } catch (error) {
                return msg.channel.send(error)
            }
        }

        return;
    },
    async removeThemeData(msg, month, year) {
        if (year != undefined) {
            yearChoice = year;
        }
        try {
            const themesCollection = await themes();
            const removeTheme = await themesCollection.findOneAndUpdate({year: yearChoice, month: month}, {$set: {theme: ""}});
            return
        } catch (error) {
            return msg.channel.send(error)
        }
    },
    async scheduledMessage() {
        let year = new Date().getFullYear();
        const themesCollection = await themes();
        let month = new Date().getMonth();
        let day = new Date().getDay();
        
        if (month == 12 && day == 28) {
            let message = "Reminder that next years themes are: "
            year = year + 1;
        
            for (i=0;i<months.length;i++) {
                const currentThemes = await themesCollection.findOne({year: year, month: months[i]})
                if (currentThemes != null) {
                    let month = await capitalize(currentThemes.month);
                    message += `\n\t ${month}: ${currentThemes.theme}`
                }
            }
            return message;
        } 
        else {
            let message = "Reminder that the current themes for this year are: "
        
            for (i=0;i<months.length;i++) {
                const currentThemes = await themesCollection.findOne({year: year, month: months[i]})
                if (currentThemes != null) {
                    let month = await capitalize(currentThemes.month);
                    message += `\n\t ${month}: ${currentThemes.theme}`
                }
            }

            return message;
        }
        
        return;
    },
}


module.exports = exportedMethods;