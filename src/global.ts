///<header>
/// Global Variables
///</header>
import {ExtensionContext} from 'vscode'
export namespace Core {
    export var counter: number = 0;
    export var fileInfo: string[] = [];
    export var filePath: string;
    export var fileName: string;
    export var context: ExtensionContext;
    export const fileType: string = '.md';
}