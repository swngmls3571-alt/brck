const cors = require('cors');
const express = require('express');
const project = require('./db');
const app = express();

app.use(express.json());
app.use(cors());  
//리뷰db
app.get('/dbrew',async(req,res) => {
    const pr = await project.query('SELECT * FROM `review`')
    res.send(pr);
})
//상품db
app.get('/dbprod',async(req,res) => {
    const pp = await project.query('SELECT * FROM `product`')
    res.send(pp);
})

//새상품db
app.get('/pnew',async(req,res) => {
    const pn = await project.query('SELECT * FROM `pnew`')
    res.send(pn);
})



app.listen(8080, () => {
    console.log("start 8080!");
});