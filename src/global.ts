///<summary>
/// ReadWrite Variables
///</summary>
export namespace Core {
    export var fileExists: boolean = false;
    export var fileInfo: string[] = [];
    export var tempStr: string;
    export var filePath: string;
    export var fileName: string;
    export var configContent: string = '';
    export const fileType: string = '.md';
    export const configFile: string = 'D:/configFile.txt';
}