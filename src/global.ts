import { ExtensionContext } from 'vscode'
///<summary>
/// Core variables used throughout the extension
///</summay>
export namespace Core {
    export var counter: number = 0;
    export var fileInfo: string[] = [];
    export var fileName: string;
    export var context: ExtensionContext;
    export const fileType: string = '.md';
}