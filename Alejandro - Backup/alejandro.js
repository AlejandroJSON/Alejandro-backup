const Discord = require("discord.js");
const client = new Discord.Client();
const mongoose = require("mongoose");
mongoose
  .connect(
    "MONGO URL ",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(console.log("Mongoose Bağlandı Alejandro Role Backup Sistemi devreye girmiş bulunmaktadır."));
  
client.on("ready", () => {
  setInterval(() => roleBackup(), 5000);
});

client.on("ready", async () => {
  client.user.setStatus("dnd");
  client.user.setActivity(`BOTUNUZUN DURUMU`);
 });

const Database = require("./models/roles.js");

function roleBackup() {
	const guild = "SUNUCU ID";
  client.guilds.get(guild).roles.forEach(role => {
    Database.findOne({ rolid: role.id }, async (err, res) => {
      if (!res) {
        let members = role.members.map(gmember => gmember.id);
        let newSchema = new Database({
          _id: new mongoose.Types.ObjectId(),
          rolid: role.id,
          name: role.name,
          color: role.hexColor,
          permissions: role.permissions,
          members: members,
          position: role.position,
          hoisted: role.hoisted
        });
        newSchema.save();
      } else if (res) {
        res.name = role.name;
        res.color = role.hexColor;
        res.members = role.members.map(gmember => gmember.id);
        res.position = role.position;
        res.hoisted = role.hoisted;
        res.save();
      }
    });
  });
}
client.on("roleDelete", async role => {
  await Database.findOne({ rolid: role.id }, async (err, res) => {
    if (!res) return;
    await role.guild
      .createRole({
        name: res.name,
        hoist: res.hoist,
        color: res.color,
        position: res.position,
        permissions: res.permissions,
        mentionable: false
      })
      .then(rolee => {
        res.members.map(member => {
          role.guild.members.get(member).addRole(rolee.id);
        });
      });
  });
});

process.on("uncaughtException", function(err) {
  console.error(err + "HATA!");
});

client.login("TOKEN");
