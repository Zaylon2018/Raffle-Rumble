const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
function readJSON(n){ return JSON.parse(fs.readFileSync(path.join(DATA_DIR,n),'utf8')); }

app.get('/api/competitions', (req,res)=>{ res.json(readJSON('competitions.json')); });
app.get('/api/competitions/:id', (req,res)=>{ const comps=readJSON('competitions.json'); const c=comps.find(x=>x.id===req.params.id); if(!c) return res.status(404).json({error:'not found'}); res.json(c); });
app.post('/api/draw',(req,res)=>{ const {competitionId}=req.body; const comps=readJSON('competitions.json'); const comp=comps.find(c=>c.id===competitionId); if(!comp) return res.status(404).json({error:'not found'}); const tickets=Math.max(1,comp.tickets_sold||1); const winner=Math.floor(Math.random()*tickets)+1; res.json({competitionId,winner}); });

// Serve built client for production
app.use(express.static(path.join(__dirname,'..','client','dist')));
app.get('*',(req,res)=>{ res.sendFile(path.join(__dirname,'..','client','dist','index.html')); });

const PORT=process.env.PORT||4000; app.listen(PORT,()=>console.log('Raffle Rumble server listening on',PORT));
