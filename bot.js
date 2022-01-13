
require('dotenv').config()
const https = require('https')

const { checkPrimeSync } = require('crypto');
const fetch = require('cross-fetch');
const Canvas = require('canvas');
const { Client, Intents, Message, MessageAttachment, VoiceChannel,MessageEmbed, MessageSelectMenu } = require('discord.js');
const voice = require('@discordjs/voice');
const Distube = require("distube").default;
var admin = require("firebase-admin");

var firebase= require("./firebase.json");
admin.initializeApp({
credential: admin.credential.cert(firebase)
});

const db = admin.firestore()


const adjectives = [
    "stupid",
    "unintelligent",
    "dense",
    "fatherless",
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
    "limp-dick",
    "hymie",
    "repulsive",
    "arrogant",
    "pathetic",
    "brazen",
    "infantile",
    "grotesque",
    "fucking",
    "worthless",
    "fat",
    "absolute",
    "motherfucking"
]

const nouns = [
    "idiot",
    "asshole",
    "shit",
    "fucker",
    "fuckwit",
    "douchebag",
    "dunce",
    "dolt",
    "moron",
    "halfwit",
    "simpleton",
    "asshat",
    "shitface",
    "bastard",
    "bitch",
    "dipshit",
    "faggot",
    "niggerfaggot",
    "dumbass",
    "motherfucker"
]


const fletcher_insults = [
    "jesus fucking christ - I didn't know they allowed retards into Discord!",
    "is nothing but a useless, worthless, faggot-lipped piece of shit whose mommy left daddy when she realized he wasn't exactly Eugene O Neill, who is now acting like a retard all over the channels!",

]


const vc_links = [

    {name:"band", link:"https://www.youtube.com/watch?v=xDAsABdkWSc&t=152s"},
    {name: "Caravan", link:"https://www.youtube.com/watch?v=38CRu1rCaKg"},
    {name: "Whiplash", link:"https://www.youtube.com/watch?v=HJrTYOyXHA0"},
    {name:"Overture", link:"https://www.youtube.com/watch?v=1Wr0yz4FLAg"},
    {name: "Upswinging", link:"https://www.youtube.com/watch?v=2KAflb277EI&list=PL8slRr4AfHIJWFDF0Wtl4C8Fsyotfi3S6&index=9"}

]

const song_counter = 0;


 async function getTitleAndImg(msg, subreddit, is_NSFW) {
    
    if(is_NSFW)
    {
        fetch("https://reddit.com/r/"+subreddit.toLowerCase()+"/.json?limit=60").then(res=>res.json()).then(data=>{
      
  
            if(data?.data?.children.length>1){
        
                let number  = Math.floor(Math.random() *data?.data?.children?.length +1)
        
                if(data?.data?.children[number].data?.over_18 === true){
                    
                    if(msg.channel.nsfw){

                        if(number===-0 || number===1){
                            number = 6
                        }
                
                        else{
                    
                            const exampleEmbed = new MessageEmbed()
                            .setTitle(data?.data.children[number].data?.title)
                            .setURL("https://reddit.com"+data?.data?.children[number].data?.permalink)
                        
                            .setDescription(data?.data?.children[number]?.data?.subreddit_name_prefixed)
                        
            
                            .setImage(data?.data?.children[number]?.data?.url_overridden_by_dest)
                            .setTimestamp()
                            
            
                            msg.reply({ embeds: [exampleEmbed] });
                        }
                    }

                    else{
                        msg.reply("You can only view NSFW in an NSFW channel you dumb fuck")
                    }
                    
                }
        
                else{
                    msg.reply("That's not NSFW you retard. Enter an actual one next time.")
                }
                    }
        
            else{
                msg.channel.send("There was an error fetching data. Try again.")
            }
            
          })
    }

    else{

        fetch("https://reddit.com/r/"+subreddit.toLowerCase()+"/.json?limit=60").then(res=>res.json()).then(data=>{
      
  
            if(data?.data?.children.length>1){
        
                let number  = Math.floor(Math.random() *data?.data?.children?.length +1)
        
                if(data?.data?.children[number].data?.over_18 === false){

                        if(number===-0 || number===1){
                            number = 6
                        }
                
                        else{
                    
                            const exampleEmbed = new MessageEmbed()
                            .setTitle(data?.data.children[number].data?.title)
                            .setURL("https://reddit.com"+data?.data?.children[number].data?.permalink)
                        
                            .setDescription(data?.data?.children[number]?.data?.subreddit_name_prefixed)
                        
            
                            .setImage(data?.data?.children[number]?.data?.url_overridden_by_dest)
                            .setTimestamp()

                            msg.reply({ embeds: [exampleEmbed] });
                        }
                }
        
                else{
                    msg.reply("You cannot view NSFW with this command.")
                }
                    }
        
            else{
                msg.channel.send("There was an error fetching data from that source. Try again.")
            }
            
          })
    }

  }


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const distube = new Distube(client, {
    emitNewSongOnly: false,
    searchSongs: 0,
  });



client.on('ready', ()=>{
    console.log(`Logged in as ${client.user.tag}`)
})



const status = (queue) =>
`Volume: \`${queue.volume}%\` | Filter: \`${
  queue.filter || "Off"
}\` | Loop: \`${
  queue.repeatMode
    ? queue.repeatMode == 2
      ? "All Queue"
      : "This Song"
    : "Off"
}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;



distube.on("playSong", (queue, song) => {
    let playembed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle(`🎵 Playing `)
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.name}](${song.url})`)
      .addField("Requested By", `${song.user}`, true)
      .addField("Duration", `${song.formattedDuration.toString()}`, true)
      .setFooter(status(queue), song.user.displayAvatarURL({ dynamic: true }));
  
    queue.textChannel.send({ embeds: [playembed] });
  });

  distube.on("addSong", (queue, song) => {
    let playembed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle(`🎵 Added to Queue `)
      .setThumbnail(song.thumbnail)
      .setDescription(`[${song.name}](${song.url})`)
      .addField("Requested By", `${song.user}`, true)
      .addField("Duration", `${song.formattedDuration.toString()}`, true)
      .setFooter(
        `Fletcher Bot`,
        song.user.displayAvatarURL({ dynamic: true })
      );
  
    queue.textChannel.send({ embeds: [playembed] });
    song_counter+=1;
  });


client.on('message',async (msg)=>{

    
    if(msg.content.toLowerCase().startsWith(".f")){

        let command  = msg.content.toLowerCase().split(" ").pop()

        if(command.toLowerCase().startsWith("reddit")){
            let subreddit = command.trim().split(",").pop().trim()
            
         
            if(subreddit.length>=1){
               getTitleAndImg(msg, subreddit, false)
            }

            else{
                msg.channel.send("*In a soft, menacing tone:* Do you thinlk, not specifying the name is a great idea?")
            }
           
           
        }

        else if(command.toLowerCase().startsWith("nsfw")){

            let subreddit = command.trim().split(",").pop().trim()
            
            if(subreddit.length>=1){
               getTitleAndImg(msg, subreddit, true)
            }

            else{
                msg.channel.send("*In a soft, menacing tone:* Do you think, not specifying the name is a great idea?")
            }
           
           
        }
        
        else if(command.toLowerCase().startsWith("practice")){

            let channel = msg.member.voice.channel;
            let queue = distube.getQueue(msg.guildId);
            if (!channel) {
            return msg.reply({
                embeds: [
                new MessageEmbed()
                    .setColor("BLURPLE")
                    .setDescription(`Do you think, asking me to play songs without joining a voice channel is a good idea? Join and then ask me, don't waste my time.`)
                    .setFooter(
                    `Fletcher Bot`,
                    msg.author.displayAvatarURL({ dynamic: true })
                    ),
                ],
            });
            }

            if(command.trim().split(",").length>2){
                msg.reply("You can only listen to one song at a time. Its like this: **flet play,{songname}**, without the {}. What's so hard to understand?")
            }
            else{

                let song = command.trim().split(",").pop().trim()
                        
                let counter = 0;
            for(let i=0; i<=vc_links.length;i++){
                if(vc_links[i].name.toLowerCase() === song.toLowerCase()){
                    
                    distube.play(msg, vc_links[i].link)
                    break;
                }

                else{
                    counter+=1
                    if(counter===vc_links.length){
                        msg.reply("That ain't a valid song name you dingus")
                        break
                    }
                }
            }

            }
            

        }
  

        else if(command.toLowerCase().startsWith("volume")){
            
            let amount = parseInt(command.trim().split(",").pop().trim())

            let queue = distube.getQueue(msg.guild.id);
            if(amount>=0 && amount<=100){
                if(queue.volume> amount){
                    msg.channel.send(`Volume set to ${amount}%. it's a good thing you decided to lower it, this ain't my f***ing tempo, its hurting my ears.`);
                }
                else{
                    msg.channel.send(`Volume set to ${amount}%. I would recommend lowering it, they aren't playing on my f***ing tempo.`)
                }
                queue.setVolume(amount);
            }

            else{
                msg.reply("Volume must be within 1 and 100")
            }
            
        }

        else if(command.toLowerCase() === "skip"){
            
            let queue = distube.getQueue(msg.guild.id);
         
        if (!msg.guild.me.voice.channel || !queue) {
           msg.reply(`Nothing to skip.`);
          
        }
      
        else{
            msg.channel.send(`Skipping ${queue?.songs[song_counter].name}`)
            queue?.skip()
        }

    
        }

     

        else if(command.toLowerCase() === "stop"){

            let queue = distube.getQueue(msg.guild.id)
            if (!msg.guild.me.voice.channel || !queue) {
                msg.reply(`Nothing to stop.`);
             }
           
            distube.stop(msg)
            msg.channel.send(`Stopped playing ${queue?.songs[song_counter].name}`)
        }

        else if(command.toLowerCase().trim()==="help"){
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Terence Fletcher')
       
            .setAuthor('Fletcher Bot')
            .setDescription('Fun bot that plays Whiplash songs, greets you (rudely), displays subreddit contents and reacts angrily if you mention it. (More coming soon!)')

            .addFields(
                {name:"Prefix", value:"**.f**"},
                {name: "Insult Commands", value:"**sup terence fletcher / sup fletcher** - (Insults you) \n **@Fletcher Bot** - (Reacts with middle finger emoji or insults you) \n "},
                {name:"Reddit Commands", value:"**.f reddit,{subreddit_without_r/}** - (Displays random post from subreddit)"},
                {name:"Song Commands", value:"**Play: .f practice,{whiplash_song}** - (Caravan, Overture, Whiplash, Upswinging) \n **Skip** - **.f skip** \n **Stop** - **.f stop** \n **Volume** - **.f volume,{number}** \n"},
                
            )
    
            msg.channel.send({ embeds: [exampleEmbed] });
                }
            
                
         }

    //WITHOUT PREFIX

    else if(msg.mentions.has(client.user)){
        let number = Math.random()<0.5?0:1
        if(number===0){
            setTimeout(()=>{
            let adindex = Math.floor(Math.random() * (adjectives.length-1) + 1)
            let nounindex = Math.floor(Math.random() * (nouns.length-1) + 1)

            msg.reply(`Stop pinging me you ${adjectives[adindex]} ${nouns[nounindex]}`)
          
            }, 2000)
         
        }
        
        else{
            setTimeout(()=>{  msg.react("🖕")}, 2000)
          
        }
        

    }

    else if(msg.content.toLowerCase().includes("sup fletcher") || msg.content.toLowerCase().includes("sup terence fletcher")){
        
       setTimeout(()=>{
        let option  = Math.random()<0.5?0:1


        if(option===1){
            let number = Math.random()<0.5?0:1
          
            if(number===1){
                msg.channel.send(`${msg.author.username} ${fletcher_insults[number]}`)
            }
            else{
              msg.reply(fletcher_insults[number])
            }
        }

        else if(option===0){
            
            let adindex = Math.floor(Math.random() * (adjectives.length-1) + 1)
            let nounindex = Math.floor(Math.random() * (nouns.length-1) + 1)

            msg.reply(`You ${adjectives[adindex]} ${nouns[nounindex]}`)
        }
       }, 2000)

     
    }


    else if(msg.content.toLowerCase()==="twtfdyss"){
        setTimeout(()=>{ msg.channel.send("THEN WHY THE F*** DIDN'T YOU SAY SO!")}, 2000)
  
    }

    else if(msg.content.toLowerCase() === "ans"){
        msg.channel.send("ANSWEEEEERRR!")
    }
})

client.on('guildCreate', (g) => {
    const channel = g.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(g.me).has('SEND_MESSAGES'))
    channel.send(`Wassup cocksuckers! I just joined ${g.name}. Now, listen to me very carefully. My prefix is ".f". Type ".f help" to know more. And if I EVER find you pinging me, I swear to fucking god, I will stop being so polite.`)
})


client.login(process.env.BOT_TOKEN)


