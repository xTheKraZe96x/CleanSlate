import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { readFile, checkExists, createFile, createConfig, readConfig} from './Utilities'
import { TEST } from './global';
import { FilePath, GetCurrFile } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';


export function activate(context: ExtensionContext) {

    checkExists(TEST.configFile);
    GetCurrFile();
    let controller = new CleanSlateController();
    let rw = new ReadWrite();

    commands.registerCommand('extension.cleanSlate', () => {
        rw.Parse();
        createFile();
        createConfig();
    });

    context.subscriptions.push(controller);
}