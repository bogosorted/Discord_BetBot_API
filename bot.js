const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

const fs = require('fs');
const path = require("path");
const { type } = require("os");
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
function receiveAcountValue(message)
{
  
  if(!fs.existsSync(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`))
  {
    let userStatus = {aragonCoins:config.initialAragonCoins};
    data = fs.writeFileSync(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`, JSON.stringify(userStatus));
  }       
  else 
  {
    data = fs.readFileSync(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`, 'utf-8');
  }   

  return (JSON.parse(data).aragonCoins);
}
async function ClientCommands(command,message,args)
{
    switch(command)
    {
      case "mywallet":
          walletvalue = receiveAcountValue(message);
          await message.channel.send(`You have ${walletvalue} aragon coins!`);

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
      case "magnata":
        CheckIfTop5(message,receiveAcountValue(message),message.member.user)
        Magnata(message);
      break;
      case "ping":
        var m = await message.channel.send("Ping?");
        m.edit(`Ping! The current latency its ${m.createdTimestamp - message.createdTimestamp}`);
      break;
  }
}
function test(message)
{
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#FC1B00')
	.setTitle('nome do bolão')
	.setURL('https://github.com/gafds/Discord_BetBot_API')
	.setAuthor('SWEEPSTAKE', 'https://cdn.discordapp.com/app-icons/861385571833085952/1200636fdb1c320f41069efa1900727d.png', 'https://github.com/gafds/Discord_BetBot_API')
	.setDescription(`${message.member.user.username} wants do to a sweepstake`)
	.setThumbnail('https://cdn.discordapp.com/app-icons/861385571833085952/1200636fdb1c320f41069efa1900727d.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	);
  message.channel.send(exampleEmbed);
}
async function Magnata(message)
{
  data = fs.readFileSync(`${serverDbPath}${message.guild.id}/top5.json`, 'utf-8');
  const magnatesData = JSON.parse(data); 
  formatedMagnatas = "";
  for(row = 0; row < magnatesData.length;row++)
  {
    line = `${row + 1}º  ${magnatesData[row][0].username} . . . . . . . . . . . . . . . . . . . . . . `;
    line = line.substring(0,50);
    formatedMagnatas += `${line}${magnatesData[row][1]} aragonCoins \n`;

  }

 await message.channel.send(">>> ```javascript\n                         TOP 5 Magnatas            \n" + formatedMagnatas + "```");
}
function CheckIfTop5Exists(guild)
{
  const top5 = [];

  const usersValues = guild.members.cache.map(member =>member)
  if(!fs.existsSync(`${serverDbPath}${guild.id}/top5.json`))
  {  
    index = 5;
    for(var i = 0; i <= usersValues.length; i++) 
    {
      
      if(!usersValues[i].user.bot)
      {
        top5.push([usersValues[i].user,config.initialAragonCoins]);
        index--;
      }
      if(index<=0)
      {
        break;
      }
      
    }
    data = fs.writeFileSync(`${serverDbPath}${guild.id}/top5.json`, JSON.stringify(top5));
  }
}
function CheckIfTop5(message,userValue,userMember)
{
  CheckIfTop5Exists(message.guild);

  data = fs.readFileSync(`${serverDbPath}${message.guild.id}/top5.json`, 'utf-8');
  const actualtop5 = JSON.parse(data);

  for (var row=0; row<actualtop5.length; row++) 
  {
    if(actualtop5[row][0].id === userMember.id) 
    {
      actualtop5[row][1] = userValue;
      break;  
    } 
    else if(actualtop5[row][1] < userValue)
    { 
      let member = actualtop5.find(object => object[0].id === userMember.id)
      if(member !== undefined)
      {
        actualtop5[actualtop5.indexOf(member)][1] = userValue;
      }
      else
      {
        actualtop5.push([message.guild.members.cache.get(userMember.id).user,userValue]);
      }
      break;
    }
  }

  actualtop5.sort((a, b) => b[1] - a[1]);
  actualtop5.length = 5;
  
  data = fs.writeFileSync(`${serverDbPath}${message.guild.id}/top5.json`, JSON.stringify(actualtop5));
   
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

    CheckIfTop5(message,userData.aragonCoins,message.guild.members.cache.get(receiverId));

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
  var data;
  CheckIfTop5Exists(guild);
  CheckIfDirExist(`${serverDbPath}${guild.id}`);
  console.log(`O bot entrou no servidor: ${guild.name} (id:${guild.id}). População: ${guild.memberCount} membros!`);
  client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidores`);

});

client.on("guildDelete",guild =>
{
  fs.rmdirSync(`${serverDbPath}${guild.id}`,{ recursive: true });
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
  //test(message);
  CheckIfJSONExist(`${serverDbPath}${message.guild.id}/${message.member.user.id}.json`);
  ClientCommands(command,message,args);
  AdmCommands(command,message,args);

});

client.login(config.token);