
require('dotenv').config()
const https = require('https')
const { checkPrimeSync } = require('crypto');
const fetch = require('cross-fetch');
const Canvas = require('canvas');
const { Client, Intents, Message, MessageAttachment, VoiceChannel,MessageEmbed, MessageSelectMenu } = require('discord.js');
const voice = require('@discordjs/voice');
const Distube = require("distube").default;


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
    "grotesque",
    "fricking",
    "worthless"
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

    "dipshit",
    "mfer"
]


const fletcher_insults = [
    "jesus fucking christ - I didn't know they allowed retards into Discord!",
    "is nothing but a useless, worthless, faggot-lipped piece of shit whose mommy left daddy when she realized he wasn't exactly Eugene O Neill, who is now acting like a retard all over the channels!",
   

]


const vc_links = [

    {name:"bandpractice", link:"https://www.youtube.com/watch?v=xDAsABdkWSc&t=152s"},
    {name: "Caravan", link:"https://www.youtube.com/watch?v=38CRu1rCaKg"},
    {name: "Whiplash", link:"https://www.youtube.com/watch?v=HJrTYOyXHA0"},
    {name:"Overture", link:"https://www.youtube.com/watch?v=1Wr0yz4FLAg"},
    {name: "Upswinging", link:"https://www.youtube.com/watch?v=2KAflb277EI&list=PL8slRr4AfHIJWFDF0Wtl4C8Fsyotfi3S6&index=9"}

]

const song_counter = 0;

async function fetchRedditData() {
    const res = await fetch("it.com/r/cursedimages/random.json?limit=100");
    const data = await res.json();
  
    return data[0].data.children[0].data;
  }


 async function getTitleAndImg(msg, subreddit) {

  fetch("https://reddit.com/r/"+subreddit.toLowerCase()+"/.json?limit=60").then(res=>res.json()).then(data=>{
      
  
    if(data){
    
        let number  = Math.floor(Math.random() *data.data.children.length +1)
    
            if(number===-0 || number===1){
                number = 19
            }
    
            else{
            

                const exampleEmbed = new MessageEmbed()
                .setTitle(data?.data?.children[number]?.data.title)
                .setURL("https://reddit.com"+data.data.children[number].data.permalink)
            
                .setDescription(data?.data?.children[number]?.data.subreddit_name_prefixed)
            

                .setImage(data.data.children[number]?.data.url_overridden_by_dest)
                .setTimestamp()
                

                msg.reply({ embeds: [exampleEmbed] });
            }
            }

    else{
        msg.channel.send("There's no f***ing subreddit like that, try not to act retarded next time.")
    }
    
  })



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
    
    //WITH PREFIX
    if(msg.content.toLowerCase().startsWith("flet")){

        let command  = msg.content.toLowerCase().split(" ").pop()

   
       
        
        if(command.toLowerCase().startsWith("reddit")){
            console.log("split array")
            let subreddit = command.trim().split(",").pop().trim()
            
         
            if(subreddit.length>=1){
               getTitleAndImg(msg, subreddit)
            }

            else{
                msg.channel.send("*In a soft, menacing tone:* Do you thinlk, not specifying the subreddit is a great idea?")
            }
           
           
        }

        else if(command.toLowerCase() === "bandpractice"){
          
             
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


   
                 distube.play(msg, vc_links[0].link);
            }
        
        
        else if(command.toLowerCase().startsWith("whip")){

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
                console.log(i)
                if(vc_links[i].name.toLowerCase() === song.toLowerCase()){
                    
                    distube.play(msg, vc_links[i].link)
                    break;
                }

                else{
                    counter+=1
                    console.log(counter, "counter")
                    if(counter===vc_links.length){
                        msg.reply("That ain't a valid song name ye dingus")
                        break
                    }
                }
            }

            }
            

        }
  

        else if(command.toLowerCase().startsWith("volume")){

            let amount = parseInt(command.trim().split(",").pop().trim())

            let queue = distube.getQueue(msg.guild.id);
            if(queue.volume> amount){
                msg.channel.send(`Volume set to ${amount}. it's a good thing you decided to lower it, this ain't my f***ing tempo, its hurting my ears.`);
            }
            else{
                msg.channel.send(`Volume set to ${amount}. I would recommend lowering it, they aren't playing on my f***ing tempo.`)
            }
            queue.setVolume(amount);
           
            
        }

        else if(command.toLowerCase() === "skip"){
            
            let queue = distube.getQueue(msg.guild.id);
            console.log(queue, "skip")
            console.log(queue?.next)
         
        if (!msg.guild.me.voice.channel || !queue) {
           msg.reply(`Nothing to skip.`);
           console.log(msg.guild.me.voice.channel)
          
        }
      

        
        else{
            msg.channel.send(`Skipping ${queue?.songs[song_counter].name}`)
            queue?.skip()
        }

    
        }

        else if(command.toLowerCase().trim()==="help"){
            const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Terence Fletcher')
       
            .setAuthor('Fletcher Bot')
            .setDescription('Fun bot that plays Whiplash songs, greets you (rudely), displays subreddit contents and reacts angrily if you mention it. (More coming soon!)')

            .addFields(
                {name:"Prefix", value:"**flet**"},
                { name: 'Greeting Cmds', value: '**fletcher / FLETCHER** - (Greets you angrily) \n' },
                {name: "Insult Cmds", value:"**sup terence fletcher / sup fletcher** - (Insults you) \n **@Fletcher Bot** - (Reacts with middle finger emoji or insults you) \n "},
                {name:"Reddit Cmds", value:"**flet reddit,{subreddit}** - (Displays random post from subreddit (remove {}))"},
                {name:"Song Cmds", value:"**Play: flet whip,{songname}** - (Caravan, Overture, Whiplash, Upswinging) \n **Skip** - **flet skip** \n **Volume** - **flet volume,{number}** \n"},
                {name:"Band Practice", value:"**Band Practice: flet bandpractice** - (Band practice in Shaffer Conservatory) \n"}

                
            )
       
            .setImage('https://cdn.discordapp.com/app-icons/903238930089009212/32085bcc52b077db5b3117df7882f812.png?size=256')
        
            .setFooter('Fletcher Bot', 'https://cdn.discordapp.com/app-icons/903238930089009212/32085bcc52b077db5b3117df7882f812.png?size=256');
            msg.channel.send({ embeds: [exampleEmbed] });
                }
            
                
         }

    //WITHOUT PREFIX

    else if(msg.mentions.has(client.user)){
        let number = Math.random()<0.5?0:1

        if(number===0){
            msg.reply("yer a f***ing retard ain't ye")
        }
        else{
            msg.react("🖕")
        }
        

    }

    else if(msg.content.toLowerCase().includes("sup fletcher") || msg.content.toLowerCase().includes("sup terence fletcher")){
        
       setTimeout(()=>{
        console.log("Asdafds")
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
       }, 2000)

        msg.delete(1)
    }


    else if(msg.content.toLowerCase()==="twtfdyss"){
        setTimeout(()=>{ msg.channel.send("THEN WHY THE F*** DIDN'T YE SAY SO!")}, 2000)
        msg.delete(1)
       
    }

    else if(msg.content.toLowerCase() === "ans"){
        msg.channel.send("ANSWEEEEERRR!")
    }


    else if(msg.content.toLowerCase().trim() ==="fletcher"){
        if(msg.content.toUpperCase().trim()==="FLETCHER"){
            msg.reply("YE WHAT THE F*** DO YOU WANT?!")
        }

        else{
            msg.reply("ye, what do you want? Don't waste my time for no reason.")
        }
    }

    

    else{
        return;
    }


   



    
})

client.login(process.env.BOT_TOKEN)


