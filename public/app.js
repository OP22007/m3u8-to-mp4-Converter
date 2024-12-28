"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const cors_1 = __importDefault(require("cors"));
app.use(cors_1.default());
const { exec } = require('child_process');
const fs_1 = __importDefault(require("fs"));
app.get('/:m3u8_url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const m3u8_url = req.params.m3u8_url;
    if (!m3u8_url) {
        res.send('Url not Found');
        return;
    }
    const filename = Date.now();
    console.log(`Downloading ${m3u8_url} as ${filename}.mp4 ...`);
    // Save file in ./videos/toto.mp4
    yield exec(`ffmpeg -i ${m3u8_url} -c copy -bsf:a aac_adtstoasc ./videos/${filename}.mp4`, (err) => {
        if (err) {
            res.send(err);
            return;
        }
        console.log(`${filename}.mp4 downloaded.`);
        res.download(`videos/${filename}.mp4`, `${filename}.mp4`, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            // Delete file after 10 minutes
            setTimeout(() => {
                fs_1.default.unlink(`./videos/${filename}.mp4`, (err) => { if (err)
                    console.log(err); });
            }, 1000 * 60 * 10);
        });
    });
}));
app.listen(3001, () => {
    console.log('** Server is listening on localhost:3001, open your browser on http://localhost:3001/ **');
});
