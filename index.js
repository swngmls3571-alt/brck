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
    const pp = await project.query('SELECT * FROM `products`')
    res.send(pp);
})
//상품등록창 db 불러오게 함
app.post('/dbprod',async(req,res)=> {
    const pId = 'p' + Date.now();
    await project.query(
        'INSERT INTO products(pId, pName,pPrice,description,stock) VALUES(?,?,?,?,?)',
        [pId,req.body.pName,req.body.pPrice,req.body.description, parseInt(req.body.stock)]
    )
    
    res.send({message:"상품완료", pId: pId})
})
//새상품db
// app.get('/pnew',async(req,res) => {
//     const pn = await project.query('SELECT * FROM ``')
//     res.send(pn);
// })



app.listen(8080, () => {
    console.log("start 8080!");
});