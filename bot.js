const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

const fs = require('fs');
const path = require("path");
const serverDbPath = "servers_db/";

async function AdmCommands(command,message,args)
{
  if(message.member.hasPermission('ADMINISTRATOR'))
    {
      switch (command){
        case "addcoin":

          value = args.shift();
          mentionedUser = args.shift();

          if(!isNaN(value))
          {
            AddCoinTo(message,value,mentionedUser);
          }

        break;
    }
  }
}

function GetUserFromMention(mention) {

  if(typeof mention === 'undefined')return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
	}
  return mention;
}
function UserIdToMention(userid)
{
  return `<@${userid}>`
}

async function ClientCommands(command,message,args)
{
    switch(command)
    {
      case "mywallet":
       
        if(!fs.existsSync(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`))
        {
          let userStatus = {aragonCoins:config.initialAragonCoins};
          data = fs.writeFileSync(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`, JSON.stringify(userStatus));
        }       
        else 
        {
          data = fs.readFileSync(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`, 'utf-8');
        }   

          walletValue = JSON.parse(data).aragonCoins;
          await message.channel.send(`You have ${walletValue} aragon coins!`);

      break;
      
      case "startbet":

        break;

      case "deposit":

        value = args.shift()
        data = fs.readFileSync(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`, 'utf-8');
        userData = JSON.parse(data);

        if(!isNaN(value))
        {

          if(value > 0)
          {

            if(userData.aragonCoins >= value && value > 0)           
            {
              mentionedUser = args.shift();

              AddCoinTo(message,value,mentionedUser);
              AddCoinTo(message,-value,message.member.user.id);
            }

            else
            {
              await message.channel.send(`you didn't have enougth aragonCoins to deposit`);
            }

          }

          else
          {
            await message.channel.send('negative values not allowed');
          }

        }

        break;

      case "ping":
        var m = await message.channel.send("Ping?");
        m.edit(`Ping! The current latency its ${m.createdTimestamp - message.createdTimestamp}`);
      break;
  }
}

function CheckIfDirExist(path)
{
  if (!fs.existsSync(path))
        {
          fs.mkdirSync(path);
        }
}
function CheckIfJSONExist(path)
{
  if(!fs.existsSync(path))
  {
    let userStatus = { 
      aragonCoins:config.initialAragonCoins
    };
    data = fs.writeFileSync(path, JSON.stringify(userStatus));
  }
  
  else 
  {
    data = fs.readFileSync(path, 'utf-8');
    
  }   
}
async function AddCoinTo(message,value,mentionedUser)
{
  receiverId = GetUserFromMention(mentionedUser);

  if(message.guild.member(receiverId))
  {
    CheckIfJSONExist(`${serverDbPath}${message.guild.id}/${receiverId}.json`);


    data = fs.readFileSync(`${serverDbPath}${message.guild.id}/${receiverId}.json`, 'utf-8');
    userData = JSON.parse(data);
    userData.aragonCoins += parseFloat(value);  
    fs.writeFileSync(`${serverDbPath}${message.guild.id}/${receiverId}.json`, JSON.stringify(userData));

    await message.channel.send(`${UserIdToMention(receiverId)} has ${userData.aragonCoins} aragon coins now!`);

  }

}

client.on("ready",()=>
{
  console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores`);
  client.user.setActivity(`${client.guilds.cache.size} servers are beating things!!`);
});

client.on("guildCreate",guild =>
{
  console.log(`O bot entrou no servidor: ${guild.name} (id:${guild.id}). População: ${guild.memberCount} membros!`);
  client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidores`);
});

client.on("guildDelete",guild =>
{
  console.log(`O bot foi removido do servidor: ${guild.name}(id:${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on("message",async message =>
{
  if(message.author.bot) return;
  if(message.channel.type == "dm") return;
  if(!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  var data;
  
  CheckIfDirExist(`${serverDbPath}${message.guild.id}`);
  CheckIfJSONExist(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`);

  ClientCommands(command,message,args);
  AdmCommands(command,message,args);

});

client.login(config.token);