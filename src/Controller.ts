import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import { TEST } from './global';

export class ReadWrite {
    public Parse() {

        var outputString: string[];




        let editor = window.activeTextEditor;
        let doc = editor.document;
        let docContent = doc.getText();
        var array: string[];

        array = docContent.split('\n');
    
        
        array.forEach(element => {
            if (element.startsWith('///') && element.includes('<')) {
                var i = element.indexOf("<");
                var j = element.indexOf(">");

                var hldr = element.substring(i+1, j);

                switch (element.substring(i+1, j)) {
                    case "header":
                        this.addITall(array.indexOf(element) , '##', array);
                        break;
                    case "code":
                        this.codeBraces(array.indexOf(element), '```\r\n', array);
                        break;

                }

            }
        });


    }


    public addITall(num: number, str: string, array: string[]) {
        var flag: boolean = true
        var string = str;
        var i = num;

        while(flag) {
            i++;

            if( array[i].startsWith('///') && array[i].includes('</')) {
                string += '\n';
                flag = false;
            } else if (array[i].startsWith('///')) {
                string += ' ' + array[i].substring(3);
            }
        }
        
        TEST.fileInfo.push(string) ;
    }


    public codeBraces(num: number, str: string, array: string[]) {
        var flag: boolean = true
        var string = str;
        var i = num;

        while(flag) {
            i++;

            if( array[i].startsWith('///') && array[i].includes('</')) {
                string += '\n```\r\n';
                flag = false;
            } else {
                string +=  '\n' + array[i];
            }
        }
        
        TEST.fileInfo.push(string) ;
    }

    
 }
    
export class CleanSlateController {
    private _disposable: Disposable;
    private _statusBarItem: StatusBarItem;


    constructor() {

        let subscriptions: Disposable[] = [];

        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }

    showButton() {
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        let editor = window.activeTextEditor;
        if(!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {

            this._statusBarItem.command = 'extension.cleanSlate';

            this._statusBarItem.text = `$(book)`;
            this._statusBarItem.show();


        } else {
            this._statusBarItem.hide();
        }
    }



    dispose() {
        this._disposable.dispose();
        this._statusBarItem.dispose();
    }

    private _onEvent() {
        this.showButton();
    }
}