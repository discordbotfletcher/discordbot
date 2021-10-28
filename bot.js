require('dotenv').config()

const { checkPrimeSync } = require('crypto');
const { Client, Intents, Message } = require('discord.js');


const adjectives = [
    "stupid",
    "unintelligent",
    "brainless",
    "witless",
    "ignorant",
    "braindead",
    "simple-minded",
    "mindless",
    "laughable",
    "dumb",
    "moronic",
    "relentable",
    "unlikable",
    "unlovable",
    "repulsive",
    "arrogant",
    "pathetic",
    "brazen",
    "infantile",
    "decrepit",
    "grotesque"
]



const nouns = [
    "idiot",
    "asshole",
    "shit",
    "prick",
    "prat",
    "fuckwit",
    "imbecil",
    "douchebag",
    "fool",
    "dunce",
    "dolt",
    "moron",
    "cretin",
    "halfwit",
    "simpleton",
    "jerk",
    "dick",
    "dickhead",
    "asshat",
    "dickweed",
    "shitface",
    "bastard",
    "bellend",
    "bitch",
    "coward",
    "dickbag",
    "gimp",
    "pussy",
    "dipshit"
]


const fletcher_insults = [
    "jesus fucking christ - I didn't know they allowed retards into Discord!",
    "is nothing but a useless, worthless, faggot-lipped piece of shit whose mommy left daddy when she realized he wasn't exactly Eugene O Neill, who is now acting like a retard all over the channels!",
   

]


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.on('ready', ()=>{
    console.log(`Logged in as ${client.user.tag}`)
})
client.on('message',async (msg)=>{
    
    if(msg.content.toLowerCase() === 'fletcher'){
        if(msg.content === "FLETCHER"){
            msg.reply(`YE WHAT DO YOU WANT`)
        }
        else{
            msg.reply(`ye, what do you want`)
        }
        

    }

    else if(msg.content.toLowerCase().includes("sup fletcher") || msg.content.toLowerCase().includes("sup terence fletcher")){

        let option  = Math.random()<0.5?0:1


        if(option===1){
            let number = Math.random()<0.5?0:1
          
            if(number===1){
                console.log(`${msg.author.username} ${fletcher_insults[number]}`)
                msg.channel.send(`${msg.author.username} ${fletcher_insults[number]}`)
            }
            else{
                console.log(`${fletcher_insults[number]}`)
              msg.reply(fletcher_insults[number])
            }
        }

        else if(option===0){
            
            let adindex = Math.floor(Math.random() * (adjectives.length-1) + 1)
            let nounindex =  Math.floor(Math.random() * (nouns.length-1) + 1)
        
            console.log(`You ${adjectives[adindex]} ${nouns[nounindex]}`)
            msg.reply(`You ${adjectives[adindex]} ${nouns[nounindex]}`)
        }
    }

    else if(msg.content.toLowerCase()==="twtfdyss"){
  
        msg.channel.send("THEN WHY THE F*** DIDN'T YE SAY SO!")
    }

    else if(msg.content.toLowerCase() === "ans"){
        msg.channel.send("ANSWEEEEERRR!")
    }
})

client.login(process.env.BOT_TOKEN)