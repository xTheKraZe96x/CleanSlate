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
/// Function FilePath
/// Detects if a configFile has been created or not
///      If not created -> Give the user options to selection where they would like to save their markdown document
///                         and create a config file, if they don't select, defaults output file to root drive
///</summary>
export function FilePath() {
    window.showInformationMessage('Do you want to change the default location of the output file', ...['Yes'])
    .then(val => userSelection(val))
}

///<summary>
/// Function GetCurrFile
/// Fetches the name of current document that is open in VSCode Text Editor and sets fileName to it's name 
/// without the extension
///</summary>
export function GetCurrFile(){
    var temp =  window.activeTextEditor.document.fileName.toString();
    var i = temp.lastIndexOf('\\');
    var j = temp.lastIndexOf('.');
    i++;
    Core.fileName =  window.activeTextEditor.document.fileName.toString().substring(i, j);
}

///<summary>
/// Function userSelection
/// Responsible for getting the users selection based on if they would like to save output file in their own directory
/// or allow the extension to default it's location to the root drive
///</summary>
function userSelection(val: string){
    if(val){
        window.showOpenDialog({canSelectFolders: true, openLabel: "Select Folder"})
        .then(path => setPath(path));
    }
    else{
        ShowPath()
    }
}

export function ShowPath(){
    window.showInformationMessage('Current output file path is: ' + Core.context.globalState.get('filePath'))
}