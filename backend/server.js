const express=require("express");
const cors=require("cors");
const app=express();

app.use(cors());
app.use(express.json());

app.post("/api/contact",(req,res)=>{
  console.log("LEAD:",req.body);
  res.json({status:"ok"});
});

app.listen(3000,()=>console.log("SERVER 3000"));
