import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import formidable, { Fields, Files, File } from 'formidable';
import { IncomingMessage } from 'http';
import { promises as fs } from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = formidable({ multiples: false });

  return new Promise((resolve) => {
    form.parse(req as unknown as IncomingMessage, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error('Form parse error:', err);
        return resolve(new NextResponse(
          JSON.stringify({ message: 'Form parse error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        ));
      }

      const file = files.file as File | undefined;

      if (!file) {
        return resolve(new NextResponse(
          JSON.stringify({ message: 'No file uploaded' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        ));
      }

      if (!file.mimetype?.startsWith('image/')) {
        return resolve(new NextResponse(
          JSON.stringify({ message: 'Invalid file type. Only images are allowed.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        ));
      }

      try {
        const data = await fs.readFile(file.filepath);
        const uploadResponse = await new Promise((resolveUpload, rejectUpload) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) {
                rejectUpload(error);
              } else {
                resolveUpload(result);
              }
            }
          ).end(data);
        });

        if (uploadResponse) {
          return resolve(new NextResponse(
            JSON.stringify({ url: (uploadResponse as any).secure_url }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          ));
        }
      } catch (error) {
        console.error('File read error:', error);
        return resolve(new NextResponse(
          JSON.stringify({ message: 'File read error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        ));
      }
    });
  });
}
