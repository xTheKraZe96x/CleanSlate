import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { TEST } from './global';
import { ReadWrite, CleanSlateController } from './Controller';

export function FilePath(){
    var path = "";
    var vscode = require('vscode');  
    var x = TEST.configContent
    
    //If configFile content is empty then do this 
    if(!TEST.fileExists){
        vscode.window.showInputBox({prompt: 'Please type your desired path for the output file'})
        .then(path => TEST.filePath = path);
    }
    else{
        //console.log(x + " is the current output file path");
        vscode.window.showInformationMessage(x + " is the current output file path");
    }
}

export function GetCurrFile(){
    var temp =  window.activeTextEditor.document.fileName.toString();
    var i = temp.lastIndexOf('\\');
    var j = temp.lastIndexOf('.');
    i++;
    TEST.fileName =  window.activeTextEditor.document.fileName.toString().substring(i, j);
}