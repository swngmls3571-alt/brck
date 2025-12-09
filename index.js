const cors = require('cors');
const express = require('express');
const project = require('./db');
const app = express();

app.use(express.json());
app.use(cors());
//리뷰db
app.get('/dbrew', async (req, res) => {
    const pr = await project.query('SELECT * FROM `review`')
    res.send(pr);
})
//상품조회 
app.get('/dbprod', async (req, res) => {
    const keyword = req.query.keyword || "";
    
    let sql = "SELECT * FROM products";
    let params = [];

    if (keyword) {
        sql += " WHERE pName LIKE ?";
        params.push(`%${keyword}%`);
    }

    const pp = await project.query(sql, params);
    res.send(pp);
});
//상품등록창 db 불러오게 함
app.post('/dbprod', async (req, res) => {
    const pId = 'p' + Date.now();
    const { pName, pPrice, description, stock } = req.body;

    // 필수 값 체크 (에러메시지)
    if (!pName || !pPrice) {
        return res.status(400).json({ message: "상품명과 가격을 적어주세요" });

    }
    // pPrice와 stock을 숫자로 변환
    const price = parseInt(pPrice);
    const stockNum = parseInt(stock) || 0;
    // 이미지 파일 경로 처리
    let imgPath = null;
    if (req.file) {
        imgPath = '/uploads' + req.file.filename; // DB에 저장할 경로
    }    

    await project.query(
        'INSERT INTO products(pId, pName,pPrice,description,stock) VALUES(?,?,?,?,?)',
        [pId, pName, pPrice, description, parseInt(stock)]

    )
    res.send({ message: "상품완료", pId: pId })
})



// 여기 회원가입창
app.post('/regist', async (req, res) => {
    const { id, pw, nickname, dob, name, gender, phone } = req.body;

    try {
        // 아이디 중복 있는지 확인
        const rows = await project.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        if (rows.length > 0) {
            return res.json({ result: false }); // 아이디 중복됨
        }

        // 회원 추가
        await project.query(
            'INSERT INTO users(id, pw, nickname, dob, name, gender, phone) VALUES(?,?,?,?,?,?,?)',
            [id, pw, nickname, dob, name, gender, phone]
        );

        res.json({ result: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ result: false, error: '서버 오류' });
    }
});



app.listen(8080, () => {
    console.log("start 8080!");
});