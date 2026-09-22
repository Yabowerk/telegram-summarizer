import 'dotenv/config';
import mongoose from 'mongoose';
import { createRequire } from 'module';
import { ChannelMessage, Channel, UserChannelActivity} from './model/message.js';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { client } from './fetchChannel.js';
import { toNodeHandler } from "better-auth/node";
import { auth } from './auth.js';
import { requireAuth } from './middleware/requireAuth.js';
import cors from 'cors';
const require = createRequire(import.meta.url);



const app = express();


app.use(cors({
  origin: 'https://telegram-summarizer-sage.vercel.app',
  credentials: true                 
}));

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API});



async function dbconnection(){
  try{
const connection= await mongoose.connect(process.env.MONGO_URL);
console.log("db connected successfully");
  }catch(e){
    console.log("error db connection");
  }
}
dbconnection()



//route for showing recent and saved channel
app.get('/channels',requireAuth, async (req, res) => {
  try{
const { type } = req.query;
 const filter = { userId:req.user.id };
 if (type) {
    filter.type = type; 
}
const response = await UserChannelActivity.find(filter).sort({ lastInteractedAt: -1 });
const respondicon = [];
for (const data of response) {
    const username = data.channelUsername; 
    const channelProfile = await Channel.findOne({ channelUsername: username });
    if (channelProfile) {
        respondicon.push(channelProfile);
    }
}
console.log(respondicon);
    res.json(respondicon);
  }catch(e){
    console.log("error happen when getting channel history",e.message);
  }
 
});

  //today summary
  app.post('/:channelUsername/today/summary',requireAuth, async (req, res) => {
    console.log(`searching ${req.params.channelUsername} and saving...`);
    const entity = await client.getEntity(req.params.channelUsername);

        const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0); 
      const startOfTomorrow = new Date(startOfToday);
      startOfTomorrow.setDate(startOfTomorrow.getDate() + 1); 

    try{
        
const data = await client.getMessages(entity, { limit: 100});
if (!entity){
res.status(500).json("username not found");
console.log("entity error");
}
const buffer = await client.downloadProfilePhoto(entity, { isBig: false });
          const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      await Channel.updateOne({ channelUsername: entity.username },{$set:{channelTitle: entity.title, photoBase64: base64Image}},{ upsert: true });
      await UserChannelActivity.updateOne({ userId: req.user.id, channelUsername: entity.username, type: "recent" },{$set:{lastInteractedAt: new Date()}},{upsert:true});
           for (const msg of data) {
           await ChannelMessage.updateOne({channelUsername:entity.username,messageId:msg.id},{$setOnInsert:{text:msg.message,postedAt:new Date(msg.date* 1000)}},{upsert:true});
  
  }console.log({ message: "Data saved successfully", count: data.length });
    }catch(e){
console.log("error happen saving data:",e.message);
    }
    

  const response=await ChannelMessage.find({channelUsername:req.params.channelUsername,
postedAt:{$lt:startOfTomorrow ,$gte:startOfToday}})

    if (response.length === 0) {
      return res.json({ summary: "No messages found for today." });
    }
  try{
    
        const interaction = await ai.interactions.create({
            model: 'gemini-3.5-flash',
            system_instruction:'this are telegram posts,summarize them',
            input: await response.map(msg => msg.text).join('\n'),
          });
          
          console.log({summary:interaction.output_text,pic:entity.photo});
          const count = await ChannelMessage.countDocuments({
  channelUsername: entity.username,postedAt: { $gte: startOfToday, $lt: startOfTomorrow }
});
        res.json({summarized:interaction.output_text,postnumber:count});
          
        }catch(e){
          res.status(500).json("error happen summarizing the contetnt");
          console.log("error happen summarizing the contetnt",e.message);
        }
  });

  //range summary
app.post('/:channelUsername/range/summary',requireAuth, async (req, res) => {
    console.log(`searching ${req.params.channelUsername} and saving...`);
const entity = await client.getEntity(req.params.channelUsername);
     try{
        
const data = await client.getMessages(entity, { limit: 100});

if (!entity){
res.status(500).json("username not found");
console.log("entity error");
}

const buffer = await client.downloadProfilePhoto(entity, { isBig: false });
          const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      await Channel.updateOne({ channelUsername: entity.username },{$set:{channelTitle: entity.title, photoBase64: base64Image}},{ upsert: true });
      await UserChannelActivity.updateOne({ userId: req.user.id, channelUsername: entity.username, type: "recent" },{$set:{lastInteractedAt: new Date()}},{upsert:true});

  for (const msg of data) {
  await ChannelMessage.updateOne({channelUsername:entity.username,messageId:msg.id},{$setOnInsert:{text:msg.message,postedAt:new Date(msg.date* 1000)}},{upsert:true});
  }console.log({ message: "Data saved successfully", count: data.length });
    }catch(e){
console.log("error happen saving data:",e.message);
    }

    const{start,end}=req.query;
    console.log("start:", start, "end:", end);
console.log("parsed start:", new Date(start), "parsed end:", new Date(end));
  const response=await ChannelMessage.find({channelUsername:req.params.channelUsername,
postedAt:{$lt:new Date(end) ,$gte:new Date(start)}})

    if (response.length === 0) {
      return res.json({ summary: "No messages found" });
    }
   try{
        const interaction = await ai.interactions.create({
            model: 'gemini-3.5-flash',
            system_instruction:'this are telegram posts,summarize them',
            input: await response.map(msg => msg.text).join('\n'),
          });
            console.log({summary:interaction.output_text,pic:entity.photo});
          const count = await ChannelMessage.countDocuments({
  channelUsername: entity.username,postedAt: { $gte: new Date(start), $lt: new Date(end) }
});
        res.json({summary:interaction.output_text,postcount:count});
          console.log({summary:interaction.output_text,postcount:count});
        }catch(e){
          console.log(e);
        }
  });

  //adding channel to recent or saved
  app.post('/:channelusername/addingchannel',requireAuth, async (req, res) => {
const {type}=req.query;
const userid=req.user.id;
const username=req.params.channelusername;
try {
        const targetType = type === "saved" ? "saved" : "recent";
        
        await UserChannelActivity.updateOne(
            {userId: userid, channelUsername: username },{$set: {type: targetType,lastInteractedAt: new Date()}},{upsert:true});
        return res.sendStatus(200); 

    } catch (error){
        console.error("Failed to add channel:", error.message);
        return res.status(500).json({ error: "Internal server error" });}
});


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")});