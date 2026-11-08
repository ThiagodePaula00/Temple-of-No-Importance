import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class UploadService {
  async processAndSaveImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const uploadDir = path.join(process.cwd(), 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });

    const outputPath = path.join(uploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize(1920, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
    } catch {
      throw new BadRequestException('Falha ao processar o arquivo de imagem.');
    }

    return `http://localhost:3000/uploads/${filename}`;
  }
}
