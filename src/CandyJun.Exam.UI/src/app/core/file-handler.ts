/**
 * @File: file handler
 * @Author: wush
 */
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export class FileHandlerPayload<T> {
    public data?: T;
    public files: File[] | Map<string /* file name */, string /* dataurl */>;
}

export class FileHandler {

    /**
     * upload file
     *
     * @example
     *       FileHandler.upload<GetFileInfoOutput>(
     *           `${config.esdServiceApiUrl}/api/InformationFile/SaveEditFile`,
     *           this.http,
     *           {data: data, files: files}});
     */
    public static upload<TData, TOutput>(apiUrl: string, http: HttpClient, req: FileHandlerPayload<TData>): Observable<TOutput> {

        if (!req.files) {
            console.log('no file to upload.');
            return of();
        }

        const formData = new FormData();

        if (Array.isArray(req.files)) {
            // file type: File[]
            const fileArr = <File[]>req.files;
            for (const file of fileArr) {
                formData.append(`files`, file, (<File>file).name);
            }
        } else {
            // file type: dataurl (Map<string /* file name */, string /* dataurl */)
            const fileMap = <Map<string, string>>req.files;
            fileMap.forEach((file, fileName) => {
                formData.append(`files`, this.dataURItoBlob(<string>file), fileName);
            });
        }

        if (req.data !== undefined && req.data !== null) {
            for (const property in req.data) {
                if (req.data.hasOwnProperty(property)) {
                    const value = req.data[property];
                    if (value === null || value === undefined) {
                        formData.append(property, '');
                    } else {
                        formData.append(property, value.toString());
                    }
                }
            }
        }
        return http.request<TOutput>('POST', apiUrl, { body: formData });
    }

    private static dataURItoBlob(dataURI: string) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeString });
    }
}
