import { TEST } from './global';

export class FileProperties {
    private _fse = require('fs');
    private content: string;
    
    readFile(path: string) {
        this._fse.readFile(path, function (err, data) {
            TEST.fileInfo = data.toString().split("\n");
            // console.log("Asynchronous read: " + data.toString());

            for(let i in TEST.fileInfo) {
                console.log(TEST.fileInfo[i]);
            }
        });
    }

    checkExists(path: string) {
        this._fse.open(path, 'wx', function(err, fd) {

            if (err) {
                if(err.code === 'EEXIST') {
                    TEST.fileExists = true;
                } 
            }
        });
    }


    createFile() {    
        this._fse.writeFile(TEST.filePath, TEST.fileInfo.join('\n'), function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("File created!");
        });

        TEST.fileInfo = [];

    }
}