
require('dotenv').config()
const https = require('https')
const { checkPrimeSync } = require('crypto');
const fetch = require('cross-fetch');
const Canvas = require('canvas');
const { Client, Intents, Message, MessageAttachment, MessageEmbed } = require('discord.js');


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

  
    "asshat",
    
    "shitface",
    "bastard",
    "bellend",
    "bitch",
    "coward",

    "gimp",

    "dipshit"
]


const fletcher_insults = [
    "jesus fucking christ - I didn't know they allowed retards into Discord!",
    "is nothing but a useless, worthless, faggot-lipped piece of shit whose mommy left daddy when she realized he wasn't exactly Eugene O Neill, who is now acting like a retard all over the channels!",
   

]

async function fetchRedditData() {
    const res = await fetch("it.com/r/cursedimages/random.json?limit=100");
    const data = await res.json();
  
    return data[0].data.children[0].data;
  }


 async function getTitleAndImg(msg) {
  fetch("https://reddit.com/r/cursedimages/.json").then(res=>res.json()).then(data=>{
    let number  = Math.floor(Math.random() *27 +1)
    
    if(number===-0 || number===1){
        number = 19
    }
 
    else{
      

     
        console.log(data.data.children[number].data.subreddit_subscribers)
        const exampleEmbed = new MessageEmbed()
        .setTitle(data.data.children[number].data.title)
        .setURL("https://reddit.com"+data.data.children[number].data.permalink)
      
        .setDescription(data.data.children[number].data.subreddit_name_prefixed)
      

        .setImage(data.data.children[number].data.url_overridden_by_dest)
        .setTimestamp()
        

        msg.reply({ embeds: [exampleEmbed] });
    }
  })



  }




const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });


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

    if(msg.mentions.has(client.user)){
        let number = Math.random()<0.5?0:1

        if(number===0){
            msg.reply("yer a f***ing retard ain't ye")
        }
        else{
            msg.react("🖕")
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

    else if(msg.content.toLowerCase() === "cursed"){
        getTitleAndImg(msg)
       
    }
})

client.login(process.env.BOT_TOKEN)