/* ************************************************************
 FilePath - CleanSlate
 Used to read the filePath in from the user and save to 
 globalSettings
   
 Copyright 2017 Liftlock Studios Inc. - All Rights Reserved
 Version: 0.0.1
 Coded By: Vraj Patel
 Modified By: Vraj Patel
 Last Update: 10-12-2017

************************************************************ */

import { window } from 'vscode';
import { setPath } from './Utilities'
import { Core } from './global';
import { ReadWrite, CleanSlateController } from './Controller';

///<summary>
/// Detects if a configFile has been created or not
///      If not created -> Give the user options to selection where they would like to save their markdown document
///                         and create a config file, if they don't select, defaults output file to root drive
///</summary>
export function FilePath() {
    window.showInformationMessage('Do you want to change the default location of the output file', ...['Yes'])
    .then(val => userSelection(val))
}

///<summary>
/// Fetches the name of current document that is open in VSCode Text Editor and sets fileName to it's name 
/// without the extension
///</summary>
export function GetCurrFile(){
    var temp =  window.activeTextEditor.document.fileName.toString();
    var i: number = 0;    
    
    // used to check file system being used.
    if(temp.includes('\\')) {
        i = temp.lastIndexOf('\\');
    } else {
        var i = temp.lastIndexOf('/');
    }

    var j = temp.lastIndexOf('.');
    i++;
    Core.fileName =  window.activeTextEditor.document.fileName.toString().substring(i, j);
}

///<summary>
/// Responsible for getting the users selection based on if they would like to save output file in their own directory
/// or allow the extension to default it's location to the root drive
///</summary>
///<param name="val"> User choice from FilePath
///</param>
function userSelection(val: string){
    if(val){
        window.showOpenDialog({canSelectFolders: true, openLabel: "Select Folder"})
        .then(path => setPath(path));
    }
    else{
        ShowPath()
    }
}

///<summary>
/// Displays file path
///</summary>
export function ShowPath(){
    window.showInformationMessage('Current output file path is: ' + Core.context.globalState.get('filePath'))
}