/* ************************************************************
 Extension - CleanSlate
 Default entry point for the extension.
   
 Copyright 2017 Liftlock Studios Inc. - All Rights Reserved
 Version: 0.0.1
 Coded By: Stephen Roebuck
 Modified By: Vraj Patel
 Last Update: 10-12-2017

************************************************************ */


import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { createFile } from './Utilities'
import { Core } from './global';
import { FilePath, GetCurrFile, ShowPath } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';
import { ParseAssembly } from './ProjectGen'


export function activate(context: ExtensionContext) {
    // Assign context to the Core variables
    Core.context = context;

    GetCurrFile();
    FilePath();

    let controller = new CleanSlateController();
    let rw = new ReadWrite();

    commands.registerCommand('extension.cleanSlate', () => {
        rw.Parse();
        createFile();
    });

    commands.registerCommand('extension.cleanSlate-projGen', () => {
        ParseAssembly();
    });

    commands.registerCommand('extension.cleanSlate-markdown', () => {
        rw.Parse();
        createFile();
    });

    commands.registerCommand('extension.cleanSlate-changepath', () => {
        FilePath();
    });

    commands.registerCommand('extension.cleanSlate-showpath', () => {
        ShowPath();
    });

    // if undefined set to root
    if(!Core.context.globalState.get('filePath')) {
        Core.context.globalState.update('filePath', '/');
    }

    context.subscriptions.push(controller);
}