/* ************************************************************
 Controller - CleanSlate
 Parses the active window, as well as controls the Status
 Bar Items.
   
 Copyright 2017 Liftlock Studios Inc. - All Rights Reserved
 Version: 0.0.1
 Coded By: Stephen Roebuck
 Modified By: Vraj Patel + Stephen Roebuck
 Last Update: 10-13-2017

************************************************************ */

import {window, Progress, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import { Core } from './global';

//TODO: clear white space in the strings.

export class ReadWrite {

    private xmlTagCount: number = 0;
    ///<summary>
    /// Parses the current document and outputs a markdown file.
    ///</summary>
    public Parse() {

        var outputString: string[];
        var fcounter: number = 0; // used for counting number of functions
        //var xmlTagCount: number = 0;
        let editor = window.activeTextEditor;
        let doc = editor.document;
        let docContent = doc.getText();
        var array: string[];

        array = docContent.split('\n');
        for (var i = 0; i < array.length; i++) {
            array[i] = array[i].replace(/^\s*/g, '');;
            
        }
        // array.forEach(element => {
        //     element.replace(/^\s*/g, '');
        // });

        Core.fileInfo.push('# ' + Core.fileName + '\r\n');


        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            
            if (element.startsWith('///') && element.includes('<')) {
                var k = element.indexOf("<");
                var j = element.indexOf(">");
                
                var hldr = element.substring(k+1, j);

                //TODO: Fix param not including /
                //          ======== OR ========
                //      Update Documentation to show how to write.

                if (hldr.includes('param') && !hldr.includes('/')) {
                    this.parameters(i, array);
                } else if (hldr.includes('/')) {
                    if(!array[i+1].includes('///')) {
                        
                        Core.fileInfo[Core.fileInfo.length - this.xmlTagCount] = Core.fileInfo[Core.fileInfo.length - this.xmlTagCount].replace(/^#*/g, '\n\r### ' + array[i+1].substring(0, array[i+1].length - 2));
                        fcounter++;
                        this.xmlTagCount = 0;

                    }
                } else {
                    switch (hldr) {
                        case "summary":
                            this.addITall(i, '###', array);
                            this.xmlTagCount++;
                            break;
                        case "example":
                            this.codeBraces(i, '>', array);
                            this.xmlTagCount;
                            break;
                        //TODO: Add additional xml comments
                        //      permissions, etc...
                    }
                }
            }

        }

    }
    
    ///<summary>
    /// Parses the summary tag.
    ///</summary>
    ///<param name="num">
    /// The current spot at the array being used to parse the line
    ///</param>
    ///<param name="str">
    /// Header values for the line
    ///</param>
    ///<param name="array">
    /// The file broken into array form
    ///</param>
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
                string += '\n ' + temp.substring(3);
            }
        }
        
        Core.fileInfo.push(string);
    }

    ///<summary>
    /// specifically for code and example tags
    ///</summary>
    ///<param name="num">
    /// The current spot at the array being used to parse the line
    ///</param>
    ///<param name="str">
    /// Header values for the line
    ///</param>
    ///<param name="array">
    /// The file broken into array form
    ///</param>
    private codeBraces(num: number, str: string, array: string[]) {
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
    ///<param name="num">
    /// The current spot at the array being used to parse the line
    ///</param>
    ///<param name="array">
    /// The file broken into array form
    ///</param>
    private parameters(num: number, array: string[]) {
        var i = num;
        var string = 'Parameter | Description \n --------|--------\n';

        var x = array[i].indexOf('=');
        var y = array[i].indexOf('>');

        if(this.xmlTagCount < 2) {
            this.xmlTagCount++;
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

                if (array[i+1].startsWith('///') && array[i+1].includes('param')) {
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
    /// Checks if the string exists in the fileInfo, returns boolean.
    ///</summary>
    ///<param name="checkVal">
    /// Value to check for within the current file.
    ///</param>
    private checkParamExists(checkVal: string): boolean {
        var retVal: boolean = false;

        Core.fileInfo.forEach(element => {
            if(element.includes(checkVal)) {
                retVal = true;
            }
        });

        return retVal;
    }

    ///<summary>
    /// Grabs the title of the parameter, returns the parameter.
    ///</summary>
    ///<param name="i">
    /// The current spot at the array being used to parse the line
    ///</param>
    ///<param name="array">
    /// The file broken into array form
    ///</param>
    private paramTitle(array: string[], i: number): string {
        var retVal = '';

        var x = array[i].indexOf('=');
        var y = array[i].indexOf('>');

        retVal += array[i].substring(x+2, y-1) + ' | ';

        var j = array[i].lastIndexOf('>');
        
        if (j !== array[i].length) {
            var temp = array[i].slice(0, array[i].length - 1);
            console.log(temp.substr(j + 1));

            retVal += temp.substr(j + 1);
        }

        return retVal;
    }
 }

///<summary>
/// Used to monitor status bar icon
///</summary>
export class CleanSlateController {
    private _disposable: Disposable;
    private _statusBarItem: StatusBarItem;
    private commentCoverage: StatusBarItem;

    constructor() {
        let subscriptions: Disposable[] = [];

        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this._disposable = Disposable.from(...subscriptions);
    }


    private showCoverage() {
        let editor = window.activeTextEditor;
    
        if (!this.commentCoverage) {
            this.commentCoverage = window.createStatusBarItem(StatusBarAlignment.Left);
        }
    
        if(!editor || !Core.context.globalState.get('coverage')) {
            this.commentCoverage.hide();
            return;
        }

        this.commentCoverage.tooltip = 'Function Coverage';
        var coverage = this.getCoverage();

        this.commentCoverage.text = coverage;
        this.commentCoverage.show();


    }



    private getCoverage() {
        var retVal: string;
        let editor = window.activeTextEditor;
        let doc = editor.document;
        let docContent = doc.getText();
        var activeFile: string[];
    
        activeFile = docContent.split('\n');

        for (var i = 0; i < activeFile.length; i++) {
            activeFile[i] = activeFile[i].replace(/^\s*/g, ''); 
        }

    
        var functions: number = 0;
        var commentedFunc: number = 0;


        for (var i = 0; i < activeFile.length; i++) {
            if((activeFile[i].startsWith('private') && activeFile[i].includes(')') && activeFile[i].includes('{') )
            || (activeFile[i].startsWith('public') && activeFile[i].includes(')') && activeFile[i].includes('{'))
            || (activeFile[i].startsWith('static') && activeFile[i].includes(')') && activeFile[i].includes('{'))) {
                functions++;
                
                if(activeFile[i-1].startsWith('///')) {
                    commentedFunc++;
                }
            }
        }

        retVal = commentedFunc + ' / ' + functions + ' Functions Commented.';

        return retVal;
    }


    ///<summary>
    /// Creates the status bar icon
    /// Sets it up to react to a command.
    ///</summary>
    private showButton() {
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
            this._statusBarItem.tooltip = 'Clean Slate';
            this._statusBarItem.text = `$(book)`;
            this._statusBarItem.show();


        } else {
            this._statusBarItem.hide();
        }
    }

    ///<summary>
    /// Disposes of unused Resources
    ///</summary>
    dispose() {
        this._disposable.dispose();
        this._statusBarItem.dispose();
        this.commentCoverage.dispose();
    }

    ///<summary>
    /// Handles the event to show the button on it being the active window.
    ///</summary>
    private _onEvent() {
        this.showButton();
        this.showCoverage();
    }
}