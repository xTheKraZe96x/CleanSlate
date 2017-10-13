import { Uri, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { readFile, createFile, projectFile, createProjFile } from './Utilities'
import { Core } from './global';
import { FilePath, GetCurrFile } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';

var assemblyPath: string;
export var filesSkipped: string[] = [];
export var filesCreated: string[] = [];
export var fileLocations: string[] = [];


export function clearVariables() {
    filesSkipped = [];
    filesCreated = [];
    fileLocations = [];
    Core.counter = 0;
}

///<summary>
/// Open a dialog box to save the Assembly path.
///</summary>
export function ParseAssembly() {
    window.showOpenDialog({canSelectFiles: true, openLabel: "Select Assembly File"})
    .then(path => checkFile(path));
}

///<summary>
/// Create the array of File Locations
/// Parse through each file
/// Create Files
///</summary>
///<param name="file">
/// Assembly file's contents.
///</param>
///<param name="path">
/// The default path to look within for files.
///</param>
export function AssemblyArray(file: string[], path: string) {
    var i = path.indexOf('Assembly');
    var j = 0;
    assemblyPath = path.substring(0, i);

    file.forEach(element => {
        if(element.includes('.cs') && element.includes('Include=')) {
            var x = element.indexOf('=');
            var y = element.indexOf('/');

            fileLocations.push(element.substring(x+2,y-2));
        }
    });

    fileLocations.forEach(element => {
        projectFile(assemblyPath + element);
    }); 
}

/// <summary>
/// Verifies the Assembly file that was selected.
/// </summary>
/// <param name="path">
/// File path the user selected.
/// </param>
function checkFile(path: Uri[]) {
    if(path[0].fsPath.includes('Assembly')) {
        readFile(path[0].fsPath);
    } else {
        window.showInformationMessage("Assembly File required to generate markdown files.");
    }
}

///<summary>
/// Parses the current document and outputs a markdown file.
///</summary>
///<param name="file">
/// The file to parse through
///</param>
///<param name="i">
/// Name of the file being processed.
///</param>
export function ParseAndGen(file: string[], i: string) {
    var outputString: string[] = [];

    var array: string[];

    array = file;
    var x = i.indexOf('.cs');
    var l = i.lastIndexOf('\\');

    outputString.push('# ' + i.substring(l+1, x) + '\r\n');
    
    array.forEach(element => {
        if (element.startsWith('///') && element.includes('<')) {
            var i = element.indexOf("<");
            var j = element.indexOf(">");

            var hldr = element.substring(i+1, j);

            if (hldr.includes('param') && !hldr.includes('/')) {
                outputString.push(parameters(array.indexOf(element), array));
            } else {
                switch (hldr) {
                    case "summary":
                        outputString.push(summary(array.indexOf(element) , '##', array));
                        break;
                    case "example":
                        outputString.push(codeBraces(array.indexOf(element), '>', array));
                        break;
                }
            }
        }
    });

    if(outputString.length > 1) {
        createProjFile(outputString, i.substring(l+1, x));
        filesCreated.push(i.substring(l+1, x));
    } else {
        filesSkipped.push(i.substring(l+1, x));
        Core.counter++;
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
function summary(num: number, str: string, array: string[]): string {
    var flag: boolean = true
    var string = str;
    var i = num;

    var j = array[i].lastIndexOf('>');

    if (j !== array[i].length) {
        var temp = array[i].slice(0, array[i].length - 1);

        string += temp.substr(j + 1);
    }

    while(flag) {
        i++;

        if( array[i].startsWith('///') && array[i].includes('</')) {
            string += '\n';
            flag = false;
        } else if (array[i].startsWith('///')) {
            var temp = array[i].slice(0, array[i].length - 1);
            string += '\n##' +temp.substring(3);
        }
    }
    
    return string;
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
function codeBraces(num: number, str: string, array: string[]): string {
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
    
    return string;
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
function parameters(num: number, array: string[]): string {
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
        return string;
    }

}

///<summary>
/// Checks if the string exists in the fileInfo
///</summary>
///<param name="checkVal">
/// Value to check for within the current file.
///</param>
function checkParamExists(checkVal: string): boolean {
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
///<param name="i">
/// The current spot at the array being used to parse the line
///</param>
///<param name="array">
/// The file broken into array form
///</param>
function paramTitle(array: string[], i: number): string {
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