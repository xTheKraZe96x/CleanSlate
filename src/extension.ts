import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { readFile, checkExists, createFile, createConfig, readConfig} from './Utilities'
import { Core } from './global';
import { FilePath, GetCurrFile } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';


export function activate(context: ExtensionContext) {

    // checkExists(Core.configFile);
    GetCurrFile();
    FilePath();
    let controller = new CleanSlateController();
    let rw = new ReadWrite();
5
    commands.registerCommand('extension.cleanSlate', () => {
        rw.Parse();
        createFile();
    });

    context.subscriptions.push(controller);
}