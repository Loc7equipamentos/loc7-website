import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configurar S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'loc7-formularios';

export interface StoredPDF {
  key: string;
  url: string;
  fileName: string;
  uploadedAt: string;
  type: 'pf' | 'pj';
  clientEmail: string;
  clientName: string;
}

export async function uploadPDFToS3(
  pdfBuffer: Buffer,
  fileName: string,
  type: 'pf' | 'pj',
  clientEmail: string,
  clientName: string
): Promise<StoredPDF | null> {
  try {
    // Gerar chave única
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const uniqueId = uuidv4().substring(0, 8);
    const key = `formularios/${type}/${timestamp}/${uniqueId}-${fileName}`;

    // Parâmetros do upload
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      Metadata: {
        'client-email': clientEmail,
        'client-name': clientName,
        'form-type': type,
        'upload-date': new Date().toISOString(),
      },
    };

    // Fazer upload
    const result = await s3.upload(params).promise();

    console.log(`PDF enviado para S3: ${key}`);

    return {
      key,
      url: result.Location,
      fileName,
      uploadedAt: new Date().toISOString(),
      type,
      clientEmail,
      clientName,
    };
  } catch (error) {
    console.error('Erro ao fazer upload para S3:', error);
    return null;
  }
}

export async function getPDFUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    const url = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    });

    return url;
  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    return null;
  }
}

export async function listPDFs(type?: 'pf' | 'pj'): Promise<AWS.S3.ObjectList | null> {
  try {
    const prefix = type ? `formularios/${type}/` : 'formularios/';

    const result = await s3
      .listObjectsV2({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
      })
      .promise();

    return result.Contents || [];
  } catch (error) {
    console.error('Erro ao listar PDFs:', error);
    return null;
  }
}

export async function deletePDF(key: string): Promise<boolean> {
  try {
    await s3
      .deleteObject({
        Bucket: BUCKET_NAME,
        Key: key,
      })
      .promise();

    console.log(`PDF deletado: ${key}`);
    return true;
  } catch (error) {
    console.error('Erro ao deletar PDF:', error);
    return false;
  }
}
