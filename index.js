
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytdlDiscord = require('ytdl-core-discord');
var weather = require('weather-js');
const fs= require('fs');
const client = new Discord.Client();
const moment = require('moment');

let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));


//Bot launch check
client.on('ready', () => {
	console.log('hi');
	console.log('Economy System starting...');
	client.user.setPresence({ status: 'online', game: { name: ']help' } });
});

//User Join
client.on('guildMemberAdd', member  =>
	{
		console.log(member);
		member.guild.channels.get('717008690271617082').send('``` '+member.user.username+' Has join the server. Welcome aboard! ```');

	});

//User Leaves
client.on('guildMemberRemove', member =>
{
	member.guild.channels.get('717008690271617082').send('``` '+member.user.username+' Has left the server. Thanks for stopping by! ```');

});

//MESSAGE COMMANDS
client.on('message', message => 	{
if (message.author.bot) return;

//help command
if(message.content.startsWith(']help'))
	{
		
		message.channel.send({embed:
			{
			title: "Help Command List",
			color: 0xF800FF,
			fields:
			[
				{
					name: "]help",
					value: "Shows all available commands."
				}
				,
				{
					name:"]info",
					value:"Shows your current level and xp needed for the next one."
				}
				,
				{
					name:"]iam (role)",
					value:"Assign yourself a role from the available options."
				}
				,
				{
					name:"]ping",
					value:"pongs the ping."
				}
				,
				{
					name:"]money",
					value:"Shows your current balance."
				}
				,
				{
					name:"]5050 (amount)",
					value:"Gamble with a 50/50 shot at winning the bet."
				}
				,
				{
					name:"]play (url)",
					value:"Play a song in the channel you're in."
				}
				,
				{
					name:"]stop ",
					value:"stops the song in the channel you're in."
				}
				,
				{
					name:"]roll (numberofsides)",
					value:"rolls a dice with the given amount of sides."
				}
				,
				{
					name:"]flip",
					value:"Flips a coin, heads or tails."
				}
				,
				{
					name:"]weather (location)",
					value:"gives you weather info on the desired area"
				}
				,
				{
					name:"]shop",
					value:"gives you a list of things to buy with CryptoCurrency"
				}
				,
				{
					name:"]buy",
					value:"lets you purchase things from the CryptoShop."
				}
				,
				{
					name:"]dicebet (amount)",
					value:"Test your luck against Digi. Who can role higher? If you role higher than her on a d20, you triple your bet."
				}
				,
				{
					name:"]rps (throw)",
					value:"Play rock paper scissors"
				}
				,
				{
					name:"]daily",
					value:"Claims a daily $500"
				}
				,
				{
					name:"]pay (user) (amount)",
					value:"Claims a daily $500"
				}
		
			]
			}
		});
	}
	//End of Help

	//random selector

//USER LEVELLING SYSTEM SECTION````````````````````````````````````````````````````````
let role;
//Creates the new user
if (!db[message.author.id]) db[message.author.id] = {
	xp: 0,
	level: 0
  };
db[message.author.id].xp++;
let userInfo = db[message.author.id];
if(userInfo.xp > 10) {
	userInfo.level++
	userInfo.xp = 0
	message.reply("Congratulations, you leveled up! You are now level "+userInfo.level);
}
if(userInfo.level ==1 && userInfo.xp==0)
{
	console.log("passed")
	role= message.guild.roles.find(r => r.name === "Test Role")
	message.member.addRole(role).catch(console.error);
}

//Actual command for the level system
if(message.content.startsWith(']info')) {
	let userInfo = db[message.author.id];
	let member = message.mentions.members.first();
	let embed = new Discord.RichEmbed()
	.setColor(0xF800FF)
	.addField("Level", userInfo.level)
	.addField("XP", userInfo.xp+"/10");
	if(!member) return message.channel.sendEmbed(embed)
	let memberInfo = db[member.id]
	let embed2 = new Discord.RichEmbed()
	.setColor(0x4286f4)
	.addField("Level", memberInfo.level)
	.addField("XP", memberInfo.xp+"/10")
	message.channel.sendEmbed(embed2)


}

fs.writeFile("./database.json", JSON.stringify(db), (x) => {
	if (x) console.error(x)
  });


//END USER LEVELLING SYSTEM SECTION````````````````````````````````````````````````````

//Self giveable roles to user.
if(message.content.startsWith("]iam "))
{
	let roleSearch= message.content.slice(5);
	
	let roleCheck=  message.guild.roles.find(x => x.name == roleSearch);

	if(!roleCheck)
	{
		message.reply("That's not a valid role. Try again.");
	}
	else {
	let roleGive= message.guild.roles.find(r => r.name === roleSearch);
	message.member.addRole(roleGive).catch(console.error);
	message.reply("You have been granted: "+roleSearch);
	}
}

//ECONOMY SECTION````````````````````````````````````````````````````````````````````````````````````````````````````````````

let sender = message.author;

if(!userData[sender.id + message.guild.id]) userData[sender.id +message.guild.id]={}
if(!userData[sender.id + message.guild.id].money) userData[sender.id+ message.guild.id].money = 1000;
if(!userData[sender.id + message.guild.id].lastDaily) userData[sender.id +message.guild.id].lastDaily = 'Daily not collected yet.'
//Gives 10 credits every message sent besides bot commands

if(!message.content.startsWith("]"))
{
	userData[sender.id+ message.guild.id].money+=10;
}



fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
	if(err) console.error(err);
})

	//Bot Check
	if(message.content.startsWith(']ping'))
	{
		message.channel.send('Pong!');
	}//End of Bot Check

	if(message.content.startsWith(']money'))
	{
		
		message.channel.send({embed:
			{
			title: "CryptoBank",
			color: 0xF800FF,
			fields:
			[
				{
					name: "User",
					value: message.author.username,
					inline:true
				}
				,
				{
					name:"CryptoBalance",
					value:userData[sender.id +message.guild.id].money,
					inline:true
				}
		
			]
			}
		});
	}
		if (message.content.startsWith("]daily"))
		{
			if(userData[sender.id + message.guild.id].lastDaily != moment().format('L'))
			{
				userData[sender.id + message.guild.id].lastDaily = moment().format('L');
				userData[sender.id + message.guild.id].money += 500;
				message.channel.send(
				{embed:
				{
					title:"Daily Reward",
					description: "You got $500 added to your account!"
				}
				});
			} else {
				message.channel.send({
					embed:
					{
						title: "Daily Reward",
						description: "You've already claimed your daily reward! Come back "+ moment().endOf('day').fromNow()+"."
					}
				})
			}
		}
	//Store commands
	if(message.content.startsWith(']shop'))
	{
		message.channel.send( {embed:
		{
			title:"CryptoShop",
			color: 0xF800FF,
			fields:
			[
				{
					name:"Red Role Tag",
					value: 10000
				}
				,
				{
					name:"Blue Role Tag",
					value: 10000
				}
				,
				{
					name:"Yellow Role Tag",
					value: 10000
				}
				,
				{
					name:"Green Role Tag",
					value: 10000
				}
				,
				{
					name:"Teal Role Tag",
					value: 10000
				}
				,
				{
					name:"Pink Role Tag",
					value: 10000
				}
				,
				{
					name:"Purple Role Tag",
					value: 10000
				}
			]
		}

		});
		message.reply("Type ]buy (color desired) to purchase a role. Leave out the 'role tag' bit please!");
		
	}
	//End of Shop function

	//Buy Function

	if(message.content.startsWith(']buy'))
	{
		let product = message.content.slice(5);
		product=product.toLowerCase();

		let roleCheck=  message.guild.roles.find(x => x.name == product);

		if(!roleCheck)
		{
			message.reply("That isn't a role on the market!");
		}
		else if(userData[sender.id +message.guild.id].money <10000)
		{
			message.reply("You can't afford that role.")
		}
		else {
		let roleGive= message.guild.roles.find(r => r.name === product);
		message.member.addRole(roleGive).catch(console.error);
		message.reply("You have purchased the "+product+" tag for 10000 credits");
		userData[sender.id +message.guild.id].moneyuserData[sender.id +message.guild.id].money-=10000;
		}

	}

	if(message.content.startsWith("]pay "))
	{
		if(!message.mentions.members.first()) return message.reply("You didn't specify who you're paying.");
		let target = message.mentions.members.first();
		let newString =message.content.replace(message.mentions.members.first(),"");
		let amount = newString.slice(28);
		amount= parseInt(amount);
		console.log(amount);
		userData[target.id +message.guild.id].money+= amount;
		userData[sender.id +message.guild.id].money-= amount;
		console.log(userData[target.id +message.guild.id].money);
		console.log(userData[sender.id +message.guild.id].money);
		message.channel.send("Money sent to "+target);


	}

	//End of Buy function
	
//END OF ECONOMY FUNCTION````````````````````````````````````````````````````````````````````````````````````````````````````````

//CASINO COMMANDS

//Dice Bet function

if(message.content.startsWith("]dicebet"))
{
	let bet= message.content.slice(9);
	let cpuRoll= Math.floor(Math.random() *20)+1;
	let userRoll= Math.floor(Math.random() *20)+1;
	let userAnswer="";
	let playerWin= ["``` What?! But I rigged i-... Hmph.```","``` Dang. Good roll!```","``` I thought I was feeling lucky.```","``` Okay okay I'll pay up.```"];
	let cpuWin=["``` Better luck next time!```","``` Ouch... You didn't need that, right?```","``` Fork it over tough guy.```"];
	let winnings= bet*3;
	message.channel.send({embed:
		{
		title: "You have to roll higher than me to win. You'll triple your bet if you do!",
		color: 0xF800FF,
		fields:
		[
			{
				name: "Your Bet",
				value: bet,
				inline:true
			}
		]
		}
	});

	message.channel.send("Are you sure you want to do this, yes or no?").then(()=>
		{
			const filter = m => message.author.id === m.author.id;

			message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
				.then(messages => {
					message.channel.send(`You said : ${messages.first().content}`); let userAnswer=messages.first().content;
					switch(userAnswer)
					{
						case "yes":
						case "Yes":
						userData[sender.id+ message.guild.id].money-= bet;
						message.channel.send({
							embed: 
							{
								title:"Rolls!",
								color:0xF800FF,
								fields:
								[
									{
										name:"Your Roll",
										value:userRoll,
										inline:true
									}
									,
									{
										name:"My Roll",
										value:cpuRoll,
										inline:true
									}
								]
							}
						});

						if(userRoll>cpuRoll)
						{
							message.channel.send(playerWin[Math.floor(Math.random()*4)]);
							message.channel.send({embed : 
								{
									title: "You won! Congrats!",
									color: 0xF800FF,
									fields:
									[
										{
										name:"Bet",
										value:bet
										}
										,
										{
										name: "Winnings: $",
										value: winnings
										}
										,
										{
										name: "New Balance: ",
										value: (userData[sender.id+ message.guild.id].money +winnings)
										}
										
									]
	
								}
								});
								userData[sender.id+ message.guild.id].money=userData[sender.id+ message.guild.id].money +winnings;
						}
						else if (userRoll==cpuRoll)
						{message.channel.send(">>> Since nobody won, you didn't lose money.");}
						else
						{
							message.channel.send(cpuWin[Math.floor(Math.random()*3)]);
							message.channel.send({embed:
							 {
								title: "You lost! Bummer.",
								color: 0xF800FF,
								fields:
								[
									{
									name:"New Balance",
									value:userData[sender.id+ message.guild.id].money
									}
								]
							 }

							});
						}
						break;

					case "no":
					case "No":
						message.channel.send("See you next time!");
					break;
					default: message.channel.send("That's not a vaild answer.")
					}
				})
				.catch(() => {
					message.channel.send('You did not enter any input!');
				});
		});

}

//coin flip function
if(message.content.startsWith(']5050'))
{

	let luck= Math.floor(Math.random() *2);
	if(!userData[sender.id + message.guild.id]) userData[sender.id +message.guild.id]={}
	if(!userData[sender.id + message.guild.id].money) userData[sender.id+ message.guild.id].money = 1000;	
	let bet= message.content.slice(6);
	let winnings=bet*2;
	
	var noOptionhigh= ["I don't blame you. That was a bit too much money to bet.", "Ever hear of high risk, high reward? Guess not.","So you do have a bit of sanity! Go a little lower."];
	var noOptionLow= ["As if you were losing much anyways.", "Really? Can't seperate from lunch money?","Wait... why? Do you need $"+bet+" that bad?"]
	var yesOption=["Alright! Here we go.", "Best of luck to you.","You didn't need it anyway... right?"]
		
	message.channel.send({embed:
			{
			title: "You have a 50/50 chance of doubling $"+bet,
			color: 0xF800FF,
			fields:
			[
				{
					name: "Your Bet",
					value: bet,
					inline:true
				}
			]
			}
		});

		message.channel.send("Are you sure you want to do this, yes or no?").then(()=>
		{
			const filter = m => message.author.id === m.author.id;

			message.channel.awaitMessages(filter, { time: 120000, max: 1, errors: ['time'] })
				.then(messages => {
					message.channel.send(`You said : ${messages.first().content}`); let userAnswer=messages.first().content;
					switch(userAnswer)
					{
						case "yes":
						case "Yes":
						userData[sender.id+ message.guild.id].money-= bet;
						message.channel.send(yesOption[Math.floor(Math.random() * yesOption.length)]);
						message.channel.send("And the result is...");
						if(luck==1)
						{
							message.channel.send({embed : 
							{
								title: "You won!",
								color: 0xF800FF,
								fields:
								[
									{
									name:"Bet",
									value:bet
									}
									,
									{
									name: "Winnings: $",
									value: winnings
									}
									,
									{
									name: "New Balance: $",
									value: (userData[sender.id+ message.guild.id].money +winnings)
									}
									
								]

							}
							});
							userData[sender.id+ message.guild.id].money+=(userData[sender.id+ message.guild.id].money +winnings);
						}

						if(luck==0)
						{
							message.channel.send({embed: 
							{
								title: "You Lost!",
								color: 0xF800FF,
								fields:
								[
									{
									name:"Bet: $",
									value: bet
									}
									,
									{
									name: "New Balance: $",
									value: (userData[sender.id+ message.guild.id].money)
									}
								]

							}
							});
						}
						break;
			
						case "no":
						case "No":
						if(bet> 500)
						{
							message.channel.send(noOptionhigh[Math.floor(Math.random() * noOptionhigh.length)]);
						}
						else {message.channel.send(noOptionLow[Math.floor(Math.random() * noOptionLow.length)]);}
			
							
							break;
						
						default: message.channel.send("Invalid answer. Try again.")
					
					}
				})
				.catch(() => {
					message.channel.send('You did not enter any input!');
				});
		});
	}
//END OF Coin flip

//END OF CASINO````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

//MUSIC FUNCTIONS`````````````````````````````````````````````````````````````````````````````````````````````````````````````````
	//Play Function
	if (message.content.startsWith(']play')) 
	{
		if (!message.member.voiceChannel) return message.channel.send('You must join a voice channel first'); // djs stable

		let link = message.content.slice(6);
		console.log (link);
		try
		{
			if (!link.startsWith('https://www.youtube.com')) throw "Thats not a valid link";
		}
		catch(err)
		{
			return message.channel.send("Error: " + err);
		}
		

		message.member.voiceChannel.join().then(async connection => { // djs stable
			const info = await ytdl.getInfo(link);
			const dispatcher = connection.playOpusStream(await ytdlDiscord(link)); // using djs stable, ytdl-core-discord
			const start = Date.now();

			dispatcher.on('start', () => {
				console.log(`Starting song with length of ${info.length_seconds} seconds.`);
				setTimeout(() => {
					console.log('\tSong should now be over, disconnecting');
				}, info.length_seconds * 1000 + 10000);
			});

			 dispatcher.on('end', reason => { 
				let seconds = Math.round((Date.now() - start) / 1000);
				console.log(`\tSong was ${info.length_seconds} seconds long, ended after ${seconds} seconds; ${(seconds / info.length_seconds * 100).toFixed(1)}% played.\n\tEnd reason: ${reason}`);
			})
		});
	} //End of play function

	//Stop Function
	if(message.content.startsWith(']stop'))
	{
		if (!message.member.voiceChannel) return message.channel.send('Join a Voice Channel first!');
		message.member.voiceChannel.join().then(async connection => {
		message.channel.send("Killing playlist and disconnecting");
		connection.disconnect();
		});
	}//End of Stop function

	//END OF MUSIC FUNCTIONS `````````````````````````````````````````````````````````````````

	//MISC FUNCTIONS````````````````````````````````````````````````````````````
	//Dice roll function
	if(message.content.startsWith(']roll'))
	{
		let diceSides = message.content.slice(6);
		var roll= Math.floor(Math.random() * diceSides) + 1;
		return message.reply(" rolled a "+ roll +" on a d"+ diceSides +"!");
	}// End of Dice Roll

	//Coin flip function
	if(message.content.startsWith(']flip'))
	{
	
		var coin= Math.floor(Math.random() * 2) + 1;
		if(coin==1)
		{
			return message.channel.send("It's heads!");
		}
		else
		{
			return message.channel.send("It's tails!");
		}
	}// End of coin flip

	if(message.content.startsWith("]rps "))
	{
		let rps= ["rock","paper","scissors"];
		let userThrow= message.content.slice(5)
		userThrow=userThrow.toLowerCase();
		let cpuThrow = rps[(Math.floor(Math.random()*3))];
		message.channel.send("You threw "+userThrow+"!")
		message.channel.send("I threw "+cpuThrow+"!")

		if(userThrow=="rock" && cpuThrow=="paper")
		{
			message.channel.send("I win!")
		}
		else if(userThrow=="rock" && cpuThrow=="scissors")
		{
			message.channel.send("You win!")
		}
		else if(userThrow=="rock" && cpuThrow=="rock")
		{
			message.channel.send("It's a tie!")
		}
		else if(userThrow=="paper" && cpuThrow=="paper")
		{
			message.channel.send("It's a tie!")
		}
		else if(userThrow=="paper" && cpuThrow=="rock")
		{
			message.channel.send("You Win!")
		}
		else if(userThrow=="paper" && cpuThrow=="scissors")
		{
			message.channel.send("I win!")
		}
		else if(userThrow=="scissors" && cpuThrow=="paper")
		{
			message.channel.send("You win!")
		}
		else if(userThrow=="scissors" && cpuThrow=="rock")
		{
			message.channel.send("I win!")
		}
		else if(userThrow=="scissors" && cpuThrow=="scissors")
		{
			message.channel.send("It's a tie!")
		}
		else{message.channel.send("Do you know how to play rock paper scissors?"); }
	}
	//END OF MISC ````````````````````````````````````````````````````````````````

	//Weather retrieval function
	if(message.content.startsWith(']weather'))
	{
		let weatherSearch= message.content.slice(9);
		weather.find({search: weatherSearch, degreeType: 'F'}, function(err, result) {
			if(err) console.log(err);

			message.channel.send({embed: 
				{
					title: "Today's Weather",
					color: 0xF800FF,
					fields:
					[
						{
							name:JSON.stringify(result[0].location.name, null, 2),
							value:JSON.stringify(result[0].current.temperature, null, 2)+ " Degrees (F) | "+
							JSON.stringify(result[0].current.skytext, null, 2)+" | "+
							JSON.stringify(result[0].current.humidity, null, 2)+ " Percent Humidity | "+
							"Windspeed: "+JSON.stringify(result[0].current.windspeed, null, 2),
							inline: true
						}
						
					]
				}
			})
			
		});
		
	}

	if(message.content.startsWith("]msg "))
	{
		var mention = message.mentions.users.first();
		if(mention==null){ message.channel.send("You didn't tell me who to message"); return;}
		message.delete();
		var mentionMessage= message.content.slice(28);
		mention.send(mentionMessage);
		console.log("Message sent");

	}

});

client.login('My-Token').catch(console.error);
