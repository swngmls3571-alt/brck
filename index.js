const cors = require('cors');
const express = require('express');
const project = require('./db');
const app = express();

app.use(express.json());
app.use(cors());  

app.get('/dbrew',async(req,res) => {
    const pr = await project.query('SELECT * FROM `project-review`')
    res.send(pr);
})
app.get('/dbprod',async(req,res) => {
    const pp = await project.query('SELECT * FROM `project-product`')
    res.send(pp);
})



app.listen(8080, () => {
    console.log("start 8080!");
});