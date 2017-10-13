import { Core } from './global';
import { FilePath } from './FilePath'
import { AssemblyArray, ParseAndGen, fileLocations, filesSkipped, filesCreated, clearVariables } from './ProjectGen'
import { Uri, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';


var newIndex: string[] = [];
var indexPath: string = 'D:\\GameDev\\extensions\\slate\\source\\index.html.md';

///<summary>
/// Reads the Assembly file to start the process of 
///</summary>
export function readFile(path: string){
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        AssemblyArray(data.toString().split("\n"), path);
    });
}

///<summary>
/// Reads the file in to parse it
///</summary>
export function projectFile(path: string) {
    var _fse = require('fs');
    _fse.readFile(path, function (err, data) {
        ParseAndGen(data.toString().split("\n"), path);
    });
}

///<summary>
/// Creates the file, updates variables to check if last file updated.
///</summary>
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

   // D:\GameDev\extensions\slate\source
    readIndex();




}


function readIndex() {
    var _fse = require('fs');
    _fse.readFile(indexPath, function (err, data) {
        generateNewIndex(data.toString().split("\n"));
    });
}

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
        console.log('updated index');
        clearVariables();
        newIndex = [];
    });

}


function fillIncludes(num: number, file: string[]) {
    var x: number = 0;
    var j = num;
    var flag: boolean = true;

    console.log('hello from includes');

    while(flag) {
        var y = j + 1;
        if(file[j].includes('search') && file[y].includes('---')) {
            x = j;
            flag = false;
        }
        j++;
    }



    // for (var index = 0; index < fileLocations.length; index++) {
    //     filesSkipped.forEach(element => {
    //         if(fileLocations[index].includes(element)) {
    //             fileLocations.splice(filesSkipped.lastIndexOf(element), 1);
    //         }
    //     });
    // }



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
export function setPath(userpath: Uri[]){
    var temp = userpath[0].fsPath;

    if(!temp.endsWith('\\')) {
        temp += '\\';
    }

    Core.context.globalState.update('filePath', temp)
    window.showInformationMessage('Current output file path is: ' + temp)
}