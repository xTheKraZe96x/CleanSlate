import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import { Core } from './global';

//TODO: clear white space in the strings.

export class ReadWrite {
    ///<summary>
    /// Parses the current document and outputs a markdown file.
    ///</summary>
    public Parse() {

        var outputString: string[];

        let editor = window.activeTextEditor;
        let doc = editor.document;
        let docContent = doc.getText();
        var array: string[];

        array = docContent.split('\n');
        
        Core.fileInfo.push('# ' + Core.fileName + '\r\n');
        
        array.forEach(element => {
            if (element.startsWith('///') && element.includes('<')) {
                var i = element.indexOf("<");
                var j = element.indexOf(">");

                var hldr = element.substring(i+1, j);

                if (hldr.includes('param') && !hldr.includes('/')) {
                    this.parameters(array.indexOf(element), array);



                } else {
                    switch (hldr) {
                        case "summary":
                            this.addITall(array.indexOf(element) , '##', array);
                            break;
                        case "example":
                            this.codeBraces(array.indexOf(element), '>', array);
                            break;
    
                    }
                }
            }
        });
    }
    
    ///<summary>
    /// Parses the summary tag.
    ///</summary>
    public addITall(num: number, str: string, array: string[]) {
        var flag: boolean = true
        var string = str;
        var i = num;

        var j = array[i].lastIndexOf('>');

        if (j !== array[i].length) {
            var temp = array[i].slice(0, array[i].length - 1);

            string += temp.substr(j + 1);
            console.log(string);
        }

        while(flag) {
            i++;

            if( array[i].startsWith('///') && array[i].includes('</')) {
                string += '\n';
                flag = false;
            } else if (array[i].startsWith('///')) {
                                var temp = array[i].slice(0, array[i].length - 1);
                string += temp.substring(3);
            }
        }
        
        Core.fileInfo.push(string);
    }

    ///<summary>
    /// specifically for code and example tags
    ///</summary>
    public codeBraces(num: number, str: string, array: string[]) {
        var flag: boolean = true
        var codeBlock: boolean = false;
        var string = str;
        var i = num;

        // Checks to see if there is more to the inital string
        var j = array[i].lastIndexOf('>');

        if (j !== array[i].length) {
            var temp = array[i].slice(0, array[i].length - 1);
            console.log(temp);

            string += temp.substr(j + 1);
        }



        while(flag) {
            i++;

            if( array[i].startsWith('///') && array[i].includes('</example')) {
                string += '\n';
                flag = false;
            } else if(array[i].startsWith('///') && array[i].includes('<code>')) {
                string += '\n\r\n\r```csharp\r\n';
                codeBlock = true;
            } else {
                var temp = array[i].slice(0, array[i].length - 1);
                string += temp.substring(3);
            }

            while(codeBlock) {
                i++;
                if( array[i].startsWith('///') && array[i].includes('</code')) {
                    string += '\n```\r\n';
                    codeBlock = false;
                } else {
                    string += array[i].substring(3);
                }
            }
        }
        
        Core.fileInfo.push(string);
    }


    ///<summary>
    /// Cycles through parameters and fills the fileinfo
    ///</summary>
    parameters(num: number, array: string[]) {
        var i = num;
        var string = 'Parameter | Description \n --------|--------\n';

        var x = array[i].indexOf('=');
        var y = array[i].indexOf('>');

        if(!this.checkParamExists(array[i].substring(x+1,y))) {

            var flag: boolean = true;
            var extraParams: boolean = true;

            while(extraParams) {
                string += this.paramTitle(array, i);
                while(flag) {
                    i++;
                    if( array[i].startsWith('///') && array[i].includes('</')) {
                        flag = false;
                    } else {
                        var temp = array[i].slice(0, array[i].length - 1);
                        string += temp.substring(3);
                    }
                }

                if (array[i+1].includes('param')) {
                    i++;
                    flag = true;
                    string += '\r\n'
                } else {
                    extraParams = false;
                }
            }
            Core.fileInfo.push(string);
        }

    }

    ///<summary>
    /// Checks if the string exists in the fileInfo
    ///</summary>
    checkParamExists(checkVal: string): boolean {
        var retVal: boolean = false;

        Core.fileInfo.forEach(element => {
            if(element.includes(checkVal)) {
                retVal = true;
            }
        });

        return retVal;
    }

    ///<summary>
    /// Grabs the title of the parameter
    ///</summary>
    paramTitle(array: string[], i: number): string {
        var retVal = '';

        var x = array[i].indexOf('=');
        var y = array[i].indexOf('>');

        retVal += array[i].substring(x+1, y) + '|';

        var j = array[i].lastIndexOf('>');
        
        if (j !== array[i].length) {
            var temp = array[i].slice(0, array[i].length - 1);
            console.log(temp);

            retVal += temp.substr(j + 1);
        }

        return retVal;
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

        if (doc.languageId === "csharp") {

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