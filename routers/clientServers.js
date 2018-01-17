const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tokenControl = require('../utils/tokenControl');
const settings = require('../settings');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

router.post('/login', (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const connection = new Connection(settings.dbConfig);
    connection.on('connect', (err) => {
        if (err) {
            console.log(err);
        } else {
            request = new Request(
                `
                    SELECT 
                        *
                    FROM
                        Firms F WITH(NOLOCK)
                    WHERE 
                        F.UserName = @userName AND 
                        F.Password = @password
                `,
                (err, rowCount, rows) => {
                    if (err) {
                        console.log(err);
                    }
                }
            ).on('doneInProc', (rowCount, more, rows) => {
                if (rowCount === 0) {
                    res.json({
                        success: false,
                        msg: 'Kullanıcı adı ya da şifre hatalı'
                    });
                } else {
                    jsonArray = [];
                    rows.forEach(function (columns) {
                        let rowObject = {};
                        columns.forEach(function (column) {
                            rowObject[column.metadata.colName] = column.value;
                        });
                        jsonArray.push(rowObject);
                    });
                    const user = {
                        Id: jsonArray[0].Id,
                        UserName: jsonArray[0].UserName,
                        Password: jsonArray[0].Password,
                        FirmId: jsonArray[0].Id,
                        ValidationDate: jsonArray[0].ValidationDate
                    };
                    const today = new Date();
                    if (user.ValidationDate > today) {
                        const token = jwt.sign({user}, process.env.SECRET_KEY);
                        res.json({
                            success: true,
                            msg: 'Kullanıcı girişi başarılı',
                            token: token
                        });
                    } else {
                        res.json({
                            success: false,
                            msg: 'Ödeme bilginizi kontrol ediniz'
                        });
                    }
                }
            });
            request.addParameter('userName', TYPES.VarChar, userName);
            request.addParameter('password', TYPES.VarChar, password);
            connection.execSql(request);

        }
    });
});

router.get('/token', tokenControl, (req, res) => {
    res.json({
        success: true,
        msg: 'Otomatik giriş başarılı'
    });
});

module.exports = router;