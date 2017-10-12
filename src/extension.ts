import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { readFile, checkExists, createFile, createConfig, readConfig} from './Utilities'
import { Core } from './global';
import { FilePath, GetCurrFile, ShowPath } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';


export function activate(context: ExtensionContext) {

    // checkExists(Core.configFile);
    GetCurrFile();
    FilePath(context);
    let controller = new CleanSlateController();
    let rw = new ReadWrite();
5
    commands.registerCommand('extension.cleanSlate', () => {
        rw.Parse();
        createFile();
    });

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