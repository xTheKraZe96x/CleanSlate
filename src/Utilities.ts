import { Core } from './global';
import { FilePath } from './FilePath'
import { AssemblyArray, ParseAndGen, fileLocations, filesSkipped } from './ProjectGen'
import { Uri, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';

///<summary>
/// Reads the Assembly file to start the process of 
///</summary>
///<param name="path"> Read file at the path given
///</param>
export function readFile(path: string){
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        AssemblyArray(data.toString().split("\n"), path);
    });
}

///<summary>
/// Reads the file in to parse it
///</summary>
///<param name="path"> Read file at the path given
///</param>
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
        if (err) {
            return console.error(err);
        }
        Core.counter++;

        console.log('fLoc length' + fileLocations.length + ' | ' + Core.counter);
        
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
        window.showInformationMessage('The following files were skipped due to no comments: ' + filesSkipped.join(' '));
    } 
}

///<summary>
/// Generates markdown file.
///</summary>
export function createFile(){
    var _fse = require('fs');    
    var tempFile = Core.context.globalState.get('filePath') + '_' + Core.fileName + Core.fileType;
    console.log(tempFile);
    _fse.writeFile(tempFile, Core.fileInfo.join('\n'), function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("File created!");
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

    if(!temp.endsWith('\\')) {
        temp += '\\';
    }

    Core.context.globalState.update('filePath', temp)
    window.showInformationMessage('Current output file path is: ' + temp)
}