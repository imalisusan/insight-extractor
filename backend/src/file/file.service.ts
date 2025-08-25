import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileNotFoundException } from '../common/exceptions/business.exceptions';

export interface FileData {
  filename: string;
  content: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  path: string;
}

@Injectable()
export class FileService implements OnModuleInit {
  private readonly uploadDir = join(process.cwd(), 'uploads');
  private fileStorage = new Map<string, UploadedFile>();

  constructor() {
    this.ensureUploadDir();
  }

  async onModuleInit() {
    await this.loadExistingFiles();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private async loadExistingFiles() {
    try {
      const files = await fs.readdir(this.uploadDir);
      for (const filename of files) {
        const underscoreIndex = filename.indexOf('_');
        if (underscoreIndex > 0) {
          const fileId = filename.substring(0, underscoreIndex);
          const originalName = filename.substring(underscoreIndex + 1);
          const filepath = join(this.uploadDir, filename);
          
          const uploadedFile: UploadedFile = {
            id: fileId,
            filename: originalName,
            path: filepath,
          };
          
          this.fileStorage.set(fileId, uploadedFile);
        }
      }
      console.log(`Loaded ${this.fileStorage.size} existing files into memory`);
    } catch (error) {
      console.error('Failed to load existing files:', error);
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileId = uuidv4();
    const filename = `${fileId}_${file.originalname}`;
    const filepath = join(this.uploadDir, filename);

    await fs.writeFile(filepath, file.buffer);

    const uploadedFile: UploadedFile = {
      id: fileId,
      filename: file.originalname,
      path: filepath,
    };

    this.fileStorage.set(fileId, uploadedFile);
    return fileId;
  }

  async getFileData(fileId: string): Promise<FileData> {
    const uploadedFile = this.fileStorage.get(fileId);
    if (!uploadedFile) {
      throw new FileNotFoundException(fileId);
    }

    try {
      const content = await fs.readFile(uploadedFile.path, 'utf-8');
      return {
        filename: uploadedFile.filename,
        content,
      };
    } catch (error) {
      throw new FileNotFoundException(fileId);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    const uploadedFile = this.fileStorage.get(fileId);
    if (uploadedFile) {
      try {
        await fs.unlink(uploadedFile.path);
        this.fileStorage.delete(fileId);
      } catch (error) {
        console.error(`Failed to delete file ${fileId}:`, error);
      }
    }
  }
}