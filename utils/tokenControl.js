const jwt = require('jsonwebtoken');
const settings = require('../settings');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

module.exports = function (req, res, next) {
    const token = req.headers['authorization'];

    if(token !== undefined) {
        jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
           if(err) {
               console.log(err);
               res.sendStatus(403);
           } else {
               if(data !== undefined) {
                   const firmId = data.user.FirmId;
                   const connection = new Connection(settings.dbConfig);
                   connection.on('connect', (err) => {
                      if(err) {
                          console.log(err);
                      } else {
                          request = new Request(
                              `
                                SELECT 
                                   *
                                FROM 
                                    Firms F WITH(NOLOCK)
                                WHERE 
                                    F.Id = @firmId
                              `,
                              (err, rowCount, rows) => {
                                  if(err) {
                                      console.log(err);
                                  }
                              }
                          ).on('doneInProc', (rowCount, more, rows) => {
                              if(rowCount === 0) {
                                  res.json({
                                      success: false,
                                      msg: "Firma bulunamadı, destek@teksdata.com ile iletişime geçiniz"
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
                                  const firm = jsonArray[0];
                                  const today = new Date();
                                  if(firm.ValidationDate > today) {
                                      req.FirmId = firmId;
                                      next();
                                  } else {
                                      res.json({
                                          success: false,
                                          msg: 'Ödeme bilginizi kontrol ediniz'
                                      });
                                  }
                              }
                          });
                          request.addParameter('firmId', TYPES.Int, firmId);
                          connection.execSql(request);
                      }
                   });
               }
           }
        });
    } else {
        res.sendStatus(403);
    }
}