const cors = require('cors');
const express = require('express');
const project = require('./db');
const app = express();
app.use('/img', express.static('img'));

//img
const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "img/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const img = multer({ storage });

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
        sql += " WHERE (pName LIKE? OR pcategory LIKE ?)";
        params.push(`%${keyword}%, %${keyword}`);
    }

    const pp = await project.query(sql, params);
    res.send(pp);
});
//상품등록창 db 불러오게 함
app.post('/dbprod', img.single("img"),async (req, res) => {
    const pId = 'p' + Date.now();
    const { pName, pPrice, description, pcategory ,stock } = req.body;
    //img
    const imgPath = req.file ? "/img/" + req.file.filename : null;

    // 필수 값 체크 (에러메시지)
    if (!pName || !pPrice) {
        return res.status(400).json({ message: "상품명과 가격을 적어주세요" });

    }



    await project.query(
        'INSERT INTO products(pId, pName,img,pPrice,pcategory,description,stock) VALUES(?,?,?,?,?,?,?)',
        [pId, pName, imgPath, parseInt(pPrice) , pcategory,description, parseInt(stock), ]

    )
    res.send({ message: "상품완료", pId: pId })
})
//상품수정창
app.put('/dbprod', async(req, res) => {
    const { pId, stock } = req.body;
    
    try {
        await project.query(
            'UPDATE products SET stock=? WHERE pId=?',
            [parseInt(stock), pId]
        );
        
        res.json({ success: true, message: "재고 수정 완료" });
    } catch(err) {
        console.error("DB 에러:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
//상품 삭제
app.delete('/dbprod/delete/:pId', async(req, res) => {
    const { pId } = req.params;

    
    try {
        await project.query(
            `DELETE FROM products WHERE pId=?`,
            [pId]
        );
        
        res.json({ success: true, message: "재고 삭제완료" });
    } catch(err) {
        console.error("DB 에러:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});
//img 다운로드 

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