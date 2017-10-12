import { languages, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { createConfig, setConfig, checkExists } from './Utilities'
import { Core } from './global';
import { ReadWrite, CleanSlateController } from './Controller';

///<summary>
/// Function FilePath
/// Detects if a configFile has been created or not
///      If not created -> Give the user options to selection where they would like to save their markdown document
///                         and create a config file, if they don't select, defaults output file to root drive
///</summary>
export function FilePath() {
    // if(!Core.fileExists){
        window.showInformationMessage('Do you want to change the default location of the output file', ...['Yes'])
        .then(val => userSelection(val))
    // }
    // else{
    //     window.showInformationMessage(x + " is the current output file path");
    // }
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
    if(!val){
        checkExists(Core.configFile);
    }
    else{
        window.showOpenDialog({canSelectFolders: true, openLabel: "Select Folder"})
        .then(path => setConfig(path));
    }
}