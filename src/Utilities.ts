/* ************************************************************
 Utilities - CleanSlate
 Used for all of the reading and writing to files.
   
 Copyright 2017 Liftlock Studios Inc. - All Rights Reserved
 Version: 0.0.1
 Coded By: Stephen Roebuck
 Modified By: Stephen Roebuck
 Last Update: 10-12-2017

************************************************************ */

import { Core } from './global';
import { FilePath } from './FilePath'
import { AssemblyArray, ParseAndGen, fileLocations, filesSkipped, filesCreated, clearVariables } from './ProjectGen'
import { Uri, window } from 'vscode';

var newIndex: string[] = [];
var indexPath: string = 'D:\\GameDev\\extensions\\slate\\source\\index.html.md';

///<summary>
/// Reads the Assembly file to start the process of 
///</summary>
///<param name="path"> Read file at the path given
///</param>
export function readFile(path: string){
    var _fse = require('fs');
    var x: number = 0;
    var newPath: string = '';
    if(path.includes('/')) {
        x = path.lastIndexOf('/');
        newPath = path.substr(0, x) + '/Assembly-CSharp.csproj';
    } else {
        x = path.lastIndexOf('\\');   
        newPath = path.substr(0, x) + '\\Assembly-CSharp.csproj';
    }

    _fse.readFile(newPath, function (err, data) {
        AssemblyArray(data.toString().split("\n"), path);
    });
}

///<summary>
/// Reads the file in to parse it
///</summary>
///<param name="path"> Read file at the path given </param>
export function projectFile(path: string) {
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        ParseAndGen(data.toString().split("\n"), path);
    });
}

///<summary>
/// Creates the file, updates variables to check if last file updated.
///</summary>
///<param name="content"> Grab content and attach it infront of fileName for displaying purposes
///</param>
///<param name="fileName"> Grab fileName and attach it after filePath for displaying purposes
///</param>
export function createProjFile(content: string[], fileName: string) {
    var _fse = require('fs');    
    var tempFile = Core.context.globalState.get('filePath') + '_' + fileName + Core.fileType;

    _fse.writeFile(tempFile, content.join('\n'), function(err) {

        Core.counter++;
        
         if(Core.counter === fileLocations.length) {
            LogUncompleted();
         }
    });
}

///<summary>
/// Prints log to the screen to inform user if they have any incomplete comments.
///</summary>
export function LogUncompleted(){
    if (filesSkipped.length > 0) {
        window.showInformationMessage('The following files were skipped due to incorrect or no comments: ' + filesSkipped.join(' '));
        clearVariables();
    } 
    //readIndex();
}

///<summary>
/// Prints log to the screen to inform user if they have any incomplete comments.
///</summary>
export function commentError(fileName: string){
     window.showInformationMessage('The following file has incorrect comments: ' + fileName);
}




///<summary>
/// Suggested addition. Of reading and writing a new index for users.
///</summary>
function readIndex() {
    var _fse = require('fs');
    _fse.readFile(indexPath, function (err, data) {
        generateNewIndex(data.toString().split("\n"));
    });
}

// Used for repopulating the user's current index.
// Not implemented.
function generateNewIndex(file: string[]) {
    var i: number = 0;
    var _fse = require('fs');

    file.forEach(element => {
        if(element.includes('includes:')) {
            newIndex.push(element + '\n');
            fillIncludes(i, file);
        } else {
            newIndex.push(element + '\n');  
        }
        i++;
    });

    _fse.writeFile(indexPath, newIndex.join(''), function(err) {
        newIndex = [];
    });

}

// Not implemented yet. 
function fillIncludes(num: number, file: string[]) {
    var x: number = 0;
    var j = num;
    var flag: boolean = true;

    while(flag) {
        var y = j + 1;
        if(file[j].includes('search') && file[y].includes('---')) {
            x = j;
            flag = false;
        }
        j++;
    }

    for (var index = num+1; index < x; index++) {
        filesCreated.forEach(element => {
            if(file[index].includes(element)) {
                filesCreated.splice(filesCreated.lastIndexOf(element), 1);
            }
        });
    }

    filesCreated.forEach(element => {
        newIndex.push('\t- ' + element + '\n');
    });
}

///<summary>
/// Generates markdown file.
///</summary>
export function createFile(){
    var _fse = require('fs'); 
    var tempFile = Core.context.globalState.get('filePath') + '_' + Core.fileName + Core.fileType;

    _fse.writeFile(tempFile, Core.fileInfo.join('\n'), function(err) {
        window.showInformationMessage('File created at ' + Core.context.globalState.get('filePath'));
    });

    Core.fileInfo = [];
}

///<summary>
/// Set the base path 
///</summary>
///<param name="userpath"> Gets Uri variable and sets file path to globalState
///</param>
export function setPath(userpath: Uri[]){
    var temp = userpath[0].fsPath;

    // used to check file system being used.
    if(!temp.endsWith('\\') || !temp.endsWith('/')) {
        if(temp.includes('\\')) {
            temp += '\\';
        } else {
            temp += '/';
        }
    }

    Core.context.globalState.update('filePath', temp)
    window.showInformationMessage('Current output file path is: ' + temp)
}