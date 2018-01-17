const express = require('express');
const router = express.Router();
const tokenControl = require('../utils/tokenControl');
const settings = require('../settings');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

router.get('/', tokenControl, (req, res) => {
    const connection = new Connection(settings.dbConfig);
    connection.on('connect', (err) => {
        if(err) {
            console.log(err);
        } else {
            request = new Request(
                `
                    INSERT INTO CurrentShiftEvents
                    (
                        [FirmId]
                        ,[RowID]
                        ,[LoomNo]
                        ,[GroupName]
                        ,[CentralUnitNo]
                        ,[ModuleNo]
                        ,[StartDateTime]
                        ,[EndDateTime]
                        ,[EventID]
                        ,[LoomSpeed]
                        ,[ShiftName]
                        ,[ShiftDate]
                        ,[ShiftNo]
                        ,[LineDuration]
                        ,[LineDurationMinute]
                        ,[PickCounter]
                        ,[StartShiftPickCounter]
                        ,[EndShiftPickCounter]
                        ,[LineStatus]
                        ,[OperationCode]
                        ,[PowerOnCount]
                        ,[Problem]
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
                `,
                (err, rowCount, rows) => {
                    if(err) {
                        console.log(err);
                    }
                }
            ).on('doneInProc', (rowCount, more, rows) => {
                console.log(rows);
            });
            request.addParameter('FirmId', TYPES.Int, FirmId);
            request.addParameter('RowID', TYPES.Numeric, RowID);
            request.addParameter('LoomNo', TYPES.VarChar, LoomNo);
            request.addParameter('GroupName', TYPES.VarChar, GroupName);
            request.addParameter('CentralUnitNo', TYPES.Int, CentralUnitNo);
            request.addParameter('ModuleNo', TYPES.Int, ModuleNo);
            request.addParameter('StartDateTime', TYPES.VarChar, StartDateTime);
            request.addParameter('EndDateTime', TYPES.VarChar, EndDateTime);
            request.addParameter('EventID', TYPES.TinyInt, EventID);
            request.addParameter('LoomSpeed', TYPES.Int, LoomSpeed);
            request.addParameter('ShiftName', TYPES.VarChar, ShiftName);
            request.addParameter('ShiftDate', TYPES.VarChar, ShiftDate);
            request.addParameter('ShiftNo', TYPES.Int, ShiftNo);
            request.addParameter('LineDuration', TYPES.VarChar, LineDuration);
            request.addParameter('LineDurationMinute', TYPES.Float, LineDurationMinute);
            request.addParameter('PickCounter', TYPES.Numeric, PickCounter);
            request.addParameter('StartShiftPickCounter', TYPES.Numeric, StartShiftPickCounter);
            request.addParameter('EndShiftPickCounter', TYPES.Numeric, EndShiftPickCounter);
            request.addParameter('LineStatus', TYPES.TinyInt, LineStatus);
            request.addParameter('OperationCode', TYPES.VarChar, OperationCode);
            request.addParameter('PowerOnCount', TYPES.Int, PowerOnCount);
            request.addParameter('Problem', TYPES.Int, Problem);

            connection.execSql(request);
        }
    });
});

module.exports = router;