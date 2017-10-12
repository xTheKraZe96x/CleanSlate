import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { readFile, createFile} from './Utilities'
import { Core } from './global';
import { FilePath, GetCurrFile, ShowPath } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';
import { ParseAssembly } from './ProjectGen'


export function activate(context: ExtensionContext) {

    //Assign this context to Core context var
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

    context.subscriptions.push(controller);
}