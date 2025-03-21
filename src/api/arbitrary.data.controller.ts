import { Request, Response, NextFunction } from "express";
import { PassThrough } from "stream";
import csvParser from "csv-parser";
import { arbitraryService } from "../service/arbitrary.service";

export const arbitraryDataController = {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).send('Нет файла для загрузки');
                return;
            }

            const results: any[] = [];
            const fileStream = new PassThrough();
            fileStream.end(req.file.buffer);

            fileStream
                .pipe(csvParser({}))
                .on('data', (data: any) => results.push(data))
                .on('end', async () => {
                    try {
                        const uploadResult = await arbitraryService.uploadProducts(results);
                        res.status(201).json({ message: 'File successfully uploaded', data: uploadResult });
                    } catch (error) {
                        res.status(500).send('Error while uploading products: ' + ( error as Error)?.message);
                    }
                })
                .on('error', (error: Error) => {
                    res.status(500).send('Error while parsing csv: ' + error.message);
                });
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    },

    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await arbitraryService.get();
            res.send(result);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        }
    }
};
