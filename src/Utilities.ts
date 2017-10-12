import { Core } from './global';
import { FilePath } from './FilePath'
import { AssemblyArray, ParseAndGen, fileLocations, filesSkipped } from './ProjectGen'
import { Uri, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';

export function readFile(path: string){
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        AssemblyArray(data.toString().split("\n"), path);
    });
}

export function projectFile(path: string) {
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        ParseAndGen(data.toString().split("\n"), path);
    });
}

export function createProjFile(content: string[], fileName: string) {
    var _fse = require('fs');    
    var tempFile = Core.filePath + '_' + fileName + Core.fileType;
    console.log(tempFile);
    _fse.writeFile(tempFile, content.join('\n'), function(err) {
        if (err) {
            return console.error(err);
        }
        Core.counter++;
        console.log("File created!");
    });

    LogFile(Core.filePath);
}


export function LogFile(path: string){
    var _fse = require('fs');
    _fse.open(path + 'log.txt', 'w+', function(err, fd) {
        if (err) {
            if(err.code === 'ENOENT') {

            } 
        }
        _fse.readFile(fd , function(err, data) {
            _fse.writeFile(fd, filesSkipped.join('\n\r') ,function(err){
                // window.showTextDocument()
            });
        });

        
    });
}





export function checkExists(path: string){
    var _fse = require('fs');
    _fse.open(path, 'r', function(err, fd) {

        if (err) {
            if(err.code === 'ENOENT') {
                Core.fileExists = false;
            } 
        }

        if(Core.fileExists){
            _fse.readFile(fd, function(err, data) {
                readConfig(data.toString());
            });



            // readConfig();
        } else {
            window.showInformationMessage("Your output file location has been set to: " + Core.outputDefault);
            Core.filePath = Core.outputDefault;
        }
    });
}

export function createFile(){
    var _fse = require('fs');    
    var tempFile = Core.filePath + '_' + Core.fileName + Core.fileType;
    console.log(tempFile);
    _fse.writeFile(tempFile, Core.fileInfo.join('\n'), function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("File created!");
    });

    Core.fileInfo = [];
}

export function createConfig(){
    var _fse = require('fs');
    _fse.writeFile(Core.configFile, Core.filePath, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log(Core.filePath);
        console.log("Config file created!");
    });
}

export function readConfig(path: string){
    Core.filePath = path;
    window.showInformationMessage("Your output file location has been set to: " + Core.filePath);
    console.log(Core.filePath);
    // var _fse = require('fs');
    // _fse.readFile(path, function (err, data) {
    //     var x = data.toString();
    //     Core.configContent = x;
    //     Core.filePath = x;
    // });
}

export function setConfig(userpath :Uri[]){
    //check if undefined.
    var temp = userpath[0].fsPath;

    if(!temp.endsWith('\\')) {
        temp += '\\';
    }

    Core.filePath = temp;
    createConfig();
}