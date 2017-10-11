import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { createConfig, setConfig } from './Utilities'
import { Core } from './global';
import { ReadWrite, CleanSlateController } from './Controller';

export function FilePath(){
    var path = ""; 
    var x = Core.configContent
    
    //If configFile content is empty then do this 
    if(!Core.fileExists){
        window.showInformationMessage('Do you want to change the default location of the output file', ...['Yes'])
        .then(val => userSelection(val))
    }
    else{
        window.showInformationMessage(x + " is the current output file path");
    }
}

export function GetCurrFile(){
    var temp =  window.activeTextEditor.document.fileName.toString();
    var i = temp.lastIndexOf('\\');
    var j = temp.lastIndexOf('.');
    i++;
    Core.fileName =  window.activeTextEditor.document.fileName.toString().substring(i, j);
}

function userSelection(val: string){
    if(!val){
        console.log("hi")
        window.showInformationMessage("Your output file location has been set to: " + Core.outputDefault);
        Core.filePath = Core.outputDefault;
    }
    else{
        window.showOpenDialog({canSelectFolders: true, openLabel: "Select a directory for output file"})
        .then(path => setConfig(path));
    }
}