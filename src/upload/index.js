const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan')
const _ = require('lodash')

const app = express();

// 파일 업로드 허용
app.use(fileUpload({
    createParentPath: true
}));

// 미들 웨어 추가
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('dev'));

app.post('/upload', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: '파일 업로드 실패'
            });
        } else {
            let f = req.files.uploadFile;
            f.mv('./uploads/' + f.name);
            res.send({
                status: true,
                message: '파일이 업로드 되었습니다.',
                data: {
                    name: f.name,
                    minetype: f.minetype,
                    size: f.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

// 포트 설정
const port = 3000;

app.listen(port, () => {
    console.log(`Server is on port ${port}.`);
})