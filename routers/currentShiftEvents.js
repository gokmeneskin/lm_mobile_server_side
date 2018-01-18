const express = require('express');
const router = express.Router();
const tokenControl = require('../utils/tokenControl');
const settings = require('../settings');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

router.post('/', tokenControl, (req, res) => {
    const connection = new Connection(settings.dbConfig);
    connection.on('connect', (err) => {
        if(err) {
            console.log(err);
        } else {
            request = new Request(
                `
                    IF NOT EXISTS (SELECT * FROM CurrentShiftEvents CSE WITH(NOLOCK) WHERE CSE.FirmId = @FirmId AND CSE.LoomNo = @LoomNo)
                        BEGIN
                            INSERT INTO CurrentShiftEvents
                                (
                                    FirmId
                                    ,RowID
                                    ,LoomNo
                                    ,GroupName
                                    ,CentralUnitNo
                                    ,ModuleNo
                                    ,StartDateTime
                                    ,EndDateTime
                                    ,EventID
                                    ,LoomSpeed
                                    ,ShiftName
                                    ,ShiftDate
                                    ,ShiftNo
                                    ,LineDuration
                                    ,LineDurationMinute
                                    ,PickCounter
                                    ,StartShiftPickCounter
                                    ,EndShiftPickCounter
                                    ,LineStatus
                                    ,OperationCode
                                    ,PowerOnCount
                                    ,Problem
                                )
                            VALUES
                                (
                                    @FirmId
                                    ,@RowID
                                    ,@LoomNo
                                    ,@GroupName
                                    ,@CentralUnitNo
                                    ,@ModuleNo
                                    ,@StartDateTime
                                    ,@EndDateTime
                                    ,@EventID
                                    ,@LoomSpeed
                                    ,@ShiftName
                                    ,@ShiftDate
                                    ,@ShiftNo
                                    ,@LineDuration
                                    ,@LineDurationMinute
                                    ,@PickCounter
                                    ,@StartShiftPickCounter
                                    ,@EndShiftPickCounter
                                    ,@LineStatus
                                    ,@OperationCode
                                    ,@PowerOnCount
                                    ,@Problem
                                )
                        END
                    ELSE
                        BEGIN
                            UPDATE CurrentShiftEvents
                            SET
                                LoomNo = @LoomNo
                                ,GroupName = @GroupName
                                ,CentralUnitNo = @CentralUnitNo
                                ,ModuleNo = @ModuleNo
                                ,StartDateTime = @StartDateTime
                                ,EndDateTime = @EndDateTime
                                ,EventID = @EventID
                                ,LoomSpeed = @LoomSpeed
                                ,ShiftName = @ShiftName
                                ,ShiftDate = @ShiftDate
                                ,ShiftNo = @ShiftNo
                                ,LineDuration = @LineDuration
                                ,LineDurationMinute = @LineDurationMinute
                                ,PickCounter = @PickCounter
                                ,StartShiftPickCounter = @StartShiftPickCounter
                                ,EndShiftPickCounter = @EndShiftPickCounter
                                ,LineStatus = @LineStatus
                                ,OperationCode = @OperationCode
                                ,PowerOnCount = @PowerOnCount
                                ,Problem = @Problem
                            WHERE
                                FirmId = @FirmId AND
                                LoomNo = @LoomNo
                        END
                `,
                (err, rowCount, rows) => {
                    if(err) {
                        console.log(err);
                    } else{
                        console.log(rowCount + ' Current Shift Events verisi eklendi');
                        res.json({
                           success: true,
                           msg: 'Veriler alındı'
                        });
                    }
                }
            );
            request.addParameter('FirmId', TYPES.Int, req.body.FirmId);
            request.addParameter('RowID', TYPES.Numeric, req.body.RowID);
            request.addParameter('LoomNo', TYPES.VarChar, req.body.LoomNo);
            request.addParameter('GroupName', TYPES.VarChar, req.body.GroupName);
            request.addParameter('CentralUnitNo', TYPES.Int, req.body.CentralUnitNo);
            request.addParameter('ModuleNo', TYPES.Int, req.body.ModuleNo);
            request.addParameter('StartDateTime', TYPES.VarChar, req.body.StartDateTime);
            request.addParameter('EndDateTime', TYPES.VarChar, req.body.EndDateTime);
            request.addParameter('EventID', TYPES.TinyInt, req.body.EventID);
            request.addParameter('LoomSpeed', TYPES.Int, req.body.LoomSpeed);
            request.addParameter('ShiftName', TYPES.VarChar, req.body.ShiftName);
            request.addParameter('ShiftDate', TYPES.VarChar, req.body.ShiftDate);
            request.addParameter('ShiftNo', TYPES.Int, req.body.ShiftNo);
            request.addParameter('LineDuration', TYPES.VarChar, req.body.LineDuration);
            request.addParameter('LineDurationMinute', TYPES.Float, req.body.LineDurationMinute);
            request.addParameter('PickCounter', TYPES.Numeric, req.body.PickCounter);
            request.addParameter('StartShiftPickCounter', TYPES.Numeric, req.body.StartShiftPickCounter);
            request.addParameter('EndShiftPickCounter', TYPES.Numeric, req.body.EndShiftPickCounter);
            request.addParameter('LineStatus', TYPES.TinyInt, req.body.LineStatus);
            request.addParameter('OperationCode', TYPES.VarChar, req.body.OperationCode);
            request.addParameter('PowerOnCount', TYPES.Int, req.body.PowerOnCount);
            request.addParameter('Problem', TYPES.Int, req.body.Problem);

            connection.execSql(request);
        }
    });
});

router.get('/', tokenControl, (req, res) => {
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
                        CurrentShiftEvents C WITH(NOLOCK)
                    WHERE 
                        C.FirmId = @firmId
                    ORDER BY
                        C.LoomNo
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
                    res.json({
                        success: true,
                        data: jsonArray
                    });
                }
            });
            request.addParameter('firmId', TYPES.Int, req.FirmId);
            connection.execSql(request);
        }
    });
});

module.exports = router;