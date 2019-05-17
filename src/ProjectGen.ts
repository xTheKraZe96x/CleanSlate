/* ************************************************************
 ProjectGen - CleanSlate
 Parses an entire Project using the Assembly-CSharp file,
 creates files for all files that include proper commenting
   
 Copyright 2017 Liftlock Studios Inc. - All Rights Reserved
 Version: 0.0.1
 Coded By: Stephen Roebuck
 Modified By: Stephen Roebuck
 Last Update: 10-16-2017

************************************************************ */

import { Uri, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument } from 'vscode';
import { readFile, createFile, projectFile, createProjFile, commentError } from './Utilities'
import { Core } from './global';
import { FilePath, GetCurrFile } from './FilePath'
import { ReadWrite, CleanSlateController } from './Controller';

var assemblyPath: string;
var xmlTagCount: number = 0;
var oob: boolean = false;

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
    window.showOpenDialog({canSelectFiles: true, openLabel: "Select Solution File"})
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
    var i: number = 0;
    if(path.includes('/')) {
        i = path.lastIndexOf('/') + 1;
    } else {
        i = path.lastIndexOf('\\') + 1;
    }

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
    if(path[0].fsPath.includes('.sln')) {
        readFile(path[0].fsPath);
    } else {
        window.showInformationMessage("Solution File required to generate markdown files.");
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
    var eofName = i.lastIndexOf('.cs');
    var bofName = i.lastIndexOf('\\');
    outputString.push('# ' + i.substring(bofName+1, eofName) + '\r\n');
    oob = false;

    for (var x = 0; x < array.length; x++) {
        array[x] = array[x].replace(/^\s*/g, '');;
    }

    for (var x = 0; x < array.length; x++) {
        var element = array[x];
        
        if (element.startsWith('///') && element.includes('<')) {
            var k = element.indexOf("<");
            var j = element.indexOf(">");
            
            var hldr = element.substring(k+1, j);

            //TODO: Fix param not including /
            //          ======== OR ========
            //      Update Documentation to show how to write.

            if (hldr.includes('param') && !hldr.includes('/')) {
                outputString.push(parameters(x, array));
                if(outputString[outputString.length - 1] === undefined) {
                    outputString.pop();
                }
                if(!array[x+1].includes('///')) {
                    outputString[outputString.length - xmlTagCount] = outputString[outputString.length - xmlTagCount].replace(/^#*/g, '\n\r### ' + array[x+1].substring(0, array[x+1].length - 2));
                    xmlTagCount = 0;
                }
            } else if (hldr.includes('/')) {
                if(!array[x+1].includes('///')) {
                    outputString[outputString.length - xmlTagCount] = outputString[outputString.length - xmlTagCount].replace(/^#*/g, '\n\r### ' + array[x+1].substring(0, array[x+1].length - 2));
                    xmlTagCount = 0;
                }
            } else {
                switch (hldr) {
                    case "summary":
                        outputString.push(summary(x, '###', array));
                        xmlTagCount++;
                        break;
                    case "example":
                        outputString[outputString.length - xmlTagCount] = outputString[outputString.length - xmlTagCount].replace(/^#*/g, '### \n\r ' + codeBraces(x, '>', array));
                        //outputString.push(codeBraces(x, '>', array));
                       // xmlTagCount++;
                        break;
                    case "returns": 
                        outputString.push(returns(x, array));
                        xmlTagCount++;
                        if(!array[x+1].includes('///')) {
                            outputString[outputString.length - xmlTagCount] = outputString[outputString.length - xmlTagCount].replace(/^#*/g, '\n\r### ' + array[x+1].substring(0, array[x+1].length - 2));
                            xmlTagCount = 0;
                        }
                        break;
                    //TODO: Add additional xml comments
                    //      permissions, etc...
                }
            }
        }

    }

    if(oob) {
        commentError(i.substring(bofName+1, eofName));
        Core.counter++;
    } else {
        if(outputString.length > 1) {
            createProjFile(outputString, i.substring(bofName+1, eofName));
            filesCreated.push(i.substring(bofName+1, eofName));
        } else {
            filesSkipped.push(i.substring(bofName+1, eofName));
            Core.counter++;
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
        if( i >= array.length) {
            oob = true;
            return '';
        }
        if( array[i].startsWith('///') && array[i].includes('</')) {
            string += '\n';
            flag = false;
        } else if (array[i].startsWith('///')) {
            var temp = array[i].slice(0, array[i].length - 1);
            string += '\n ' +temp.substring(3);
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
        string += temp.substr(j + 1);
    }

    while(flag) {
        i++;

        if( i >= array.length) {
            oob = true;
            return '';
        }

        if(array[i].startsWith('///') && array[i].includes('</example')) {
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
            if( i >= array.length) {
                oob = true;
                return "";
            }
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
    var currentLine = 0;
    var x = array[i].indexOf('=');
    var y = array[i].indexOf('>');

    if(xmlTagCount < 2) {
        xmlTagCount++;
        var flag: boolean = true;
        var extraParams: boolean = true;

        while(extraParams) {
            string += paramTitle(array, i);
            while(flag) {
                if( array[i].startsWith('///') && array[i].includes('</')) {
                    // inline as well
                    var temp = array[i].substr(0, array[i].lastIndexOf('<'));
                    if(currentLine === 0) {
                        string += array[i].substring(array[i].indexOf('>')+1, array[i].lastIndexOf('<'));
                    } else {
                        if (temp !== '</param') {
                            string += temp.substring(3);
                        } 
                    }
                    currentLine = 0;
                    flag = false;
                } else {
                    if(array[i].includes('</')) {
                        string += array[i].substring(3, array[i].lastIndexOf('<'));
                    } else {
                        if(array[i].includes('<param')) {
                            string += array[i].substr(array[i].lastIndexOf('>') + 1);
                            string = string.slice(0, string.length - 1);
                        } else {
                            var temp = array[i].slice(0, array[i].length - 1);
                            string += temp.substring(3);
                        }
                    }
                    i++;
                    currentLine++;
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
        return string;
    }
}

///<summary>
/// Cycles through parameters and fills the fileinfo
///</summary>
///<param name="line">
/// The current spot at the array being used to parse the line
///</param>
///<param name="file">
/// The file broken into array form
///</param>
function returns(line: number, file: string[]) : string {
    var string: string = "**Returns** ";

    if (file[line].includes('</')) {
        var x = file[line].indexOf('>');
        var y = file[line].lastIndexOf('<');

        string += file[line].substring(x+1, y);
    } else {
        var j = file[line].lastIndexOf('>');
        var flag = true;
        if (j !== file[line].length) {
            var temp = file[line].slice(0, file[line].length - 1);
            string += temp.substr(j + 1);
        }


        while(flag) {
            line++;
            if( file[line].startsWith('///') && file[line].includes('</')) {
                flag = false;
            } else {
                var temp = file[line].slice(0, file[line].indexOf('</'));
                string += temp.substring(3);
            }
        }
    }

   return string;
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

    retVal += array[i].substring(x+2, y-1) + '|';
    var j = array[i].lastIndexOf('>');
    
    // if (j !== array[i].length) {
    //     var temp = array[i].slice(0, array[i].length - 1);
    //     retVal += temp.substr(j + 1);
    // }

    return retVal;
}