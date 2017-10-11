import { window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { FileProperties }  from './Utilities';
import { TEST } from './global';
import { FilePath } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';


export function activate(context: ExtensionContext) {
   
    FilePath();
    let controller = new CleanSlateController();
    let test = new FileProperties();
    let rw = new ReadWrite();

    commands.registerCommand('extension.cleanSlate', () => {

        //path.setPath();
        rw.Parse();
        test.createFile();

    });

    context.subscriptions.push(controller);
}