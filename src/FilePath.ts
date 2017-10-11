import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { FileProperties }  from './Utilities';
import { TEST } from './global';
import { ReadWrite, CleanSlateController } from './Controller';

export function FilePath(){

    var path = "";
    var vscode = require('vscode');

    if(path === ""){
        vscode.window.showInputBox({prompt: 'Please type your desired path for the output file'})
        .then(path => vscode.window.showInformationMessage('Your file path has been set to ' + path));
        TEST.filePath = path;
    }
    else{
        console.log(path + ": current output file path");
    }
}