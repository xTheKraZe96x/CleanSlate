import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { readFile, checkExists, createFile, createConfig, readConfig} from './Utilities'
import { Core } from './global';
import { FilePath, GetCurrFile, ShowPath } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';
import { ParseAssembly } from './ProjectGen'


export function activate(context: ExtensionContext) {

    // checkExists(Core.configFile);
    GetCurrFile();
    FilePath(context);
    let controller = new CleanSlateController();
    let rw = new ReadWrite();

    commands.registerCommand('extension.cleanSlate', () => {
        rw.Parse();
        createFile();
    });

    commands.registerCommand('extension.cleanSlate-ProjGen', () => {
        // TODO:    open prompt for Assembly-CSHarp
        //          if actual Assembly-CSharp   -> parse
        //          if not                      -> leave with window saying not correct file.
        //          On parse create array of file names with .cs
        //          loop through array to parse each file and create files. make sure parse saves file
        //          text locally
        //          overload parse and write file to take attributes. 

        ParseAssembly();
        
        
        //rw.Parse();
    });

    context.globalState.update('test', 'test');
    console.log(context.globalState);
    console.log(context.globalState.get('test'));

    commands.registerCommand('extension.cleanSlate-markdown', () => {
        rw.Parse();
        createFile();
    });

    commands.registerCommand('extension.cleanSlate-changepath', () => {
        FilePath(context);
    });

    commands.registerCommand('extension.cleanSlate-showpath', () => {
        ShowPath();
    });

    context.subscriptions.push(controller);
}