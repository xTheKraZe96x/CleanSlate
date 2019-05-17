/* ************************************************************
 Global - CleanSlate
 Variables Core to all of the files, most files depend on this
 for storage.
   
 Copyright 2017 Liftlock Studios Inc. - All Rights Reserved
 Version: 0.0.1
 Coded By: Stephen Roebuck
 Modified By: Stephen Roebuck
 Last Update: 10-12-2017

************************************************************ */


import { ExtensionContext } from 'vscode'
///<summary>
/// Core variables used throughout the extension
///</summay>
export namespace Core {
    export var counter: number = 0;
    export var fileInfo: string[] = [];
    export var fileName: string;
    export var context: ExtensionContext;
    export const fileType: string = '.md';
}