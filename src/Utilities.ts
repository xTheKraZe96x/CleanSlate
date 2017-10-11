import { TEST } from './global';
import { FilePath } from './FilePath'

export function readFile(path: string){
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        TEST.fileInfo = data.toString().split("\n");
        // console.log("Asynchronous read: " + data.toString());

        for(let i in TEST.fileInfo) {
            console.log(TEST.fileInfo[i]);
        }
    });
}

export function checkExists(path: string){
    var _fse = require('fs');
    _fse.open(path, 'wx', function(err, fd) {

        if (err) {
            if(err.code === 'EEXIST') {
                TEST.fileExists = true;
            } 
        }

        if(TEST.fileExists){
            readConfig(TEST.configFile);
        }
        else{
            FilePath();
        }
    });
}

export function createFile(){
    var _fse = require('fs');    
    var tempFile = TEST.filePath + TEST.fileName + TEST.fileType;
    console.log(tempFile);
    _fse.writeFile(tempFile, TEST.fileInfo.join('\n'), function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("File created!");
    });

    TEST.fileInfo = [];
}

export function createConfig(){
    var _fse = require('fs');
    _fse.writeFile(TEST.configFile, TEST.filePath, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log(TEST.filePath);
        console.log("Config file created!");
    });
}

export function readConfig(path: string){
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        var x = data.toString();
        TEST.configContent = x;
        TEST.filePath = x;
    });
}

export function setConfig(userpath :string){
    TEST.filePath = userpath;
    createConfig();
}