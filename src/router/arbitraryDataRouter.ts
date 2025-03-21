import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { arbitraryDataController } from "../api/arbitrary.data.controller";
import multer from "multer";
import * as path from "node:path";

const storage = multer.memoryStorage();

const upload = multer({
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/csv' || path.extname(file.originalname).toLowerCase() !== '.csv') {
            // @ts-ignore
            return cb(new Error('Only CSV files are allowed'), false);
        }
        cb(null, true);
    },
    storage
});

export const arbitraryDataRouter = Router();

arbitraryDataRouter.use(authMiddleware);
arbitraryDataRouter.post('/', upload.single('file'), arbitraryDataController.create);
arbitraryDataRouter.get('/', arbitraryDataController.get);
