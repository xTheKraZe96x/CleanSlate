import { languages, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { createConfig, setConfig } from './Utilities'
import { Core } from './global';
import { ReadWrite, CleanSlateController } from './Controller';

export function FilePath(){
    var path = "";
    var vscode = require('vscode');  
    var x = Core.configContent
    
    window.showInformationMessage('hello', ...['Yes', 'No'])

    //If configFile content is empty then do this 
    // if(!Core.fileExists){
        vscode.window.showInputBox({prompt: 'Please type your desired path for the output file'})
        .then(path => setConfig(path));
    // }
    // else{
    //     //console.log(x + " is the current output file path");
    //     vscode.window.showInformationMessage(x + " is the current output file path");
    // }
}

export function GetCurrFile(){
    var temp =  window.activeTextEditor.document.fileName.toString();
    var i = temp.lastIndexOf('\\');
    var j = temp.lastIndexOf('.');
    i++;
    Core.fileName =  window.activeTextEditor.document.fileName.toString().substring(i, j);
}