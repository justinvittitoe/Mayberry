import { BlobServiceClient, ContainerClient, BlockBlobClient, Block } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import path from 'path';

dotenv.config()

const accountName = process.env.ACCOUNT_NAME || '';
const sasToken = process.env.SAS_TOKEN || '';
const containerName = process.env.CONTAINER_NAME || '';

if(!accountName || !sasToken || !containerName) {
    throw new Error('Azure Storage configuration missing. Check environment variables.')
}

//connect to blob storage
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`)
const containerClient: ContainerClient = blobServiceClient.getContainerClient(containerName)

export interface UploadResult {
    url: string;
    blobName: string;
    contentType: string;
}

export async function uploadImage(
    buffer: Buffer,
    originalName: string,
    mimetype: string,
    folder?: string
): Promise<UploadResult> {
    try {
        //check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(mimetype)) {
            throw new Error(`Invalid file type: ${mimetype}. Allowed types: ${allowedTypes.join(', ')}`)
        }

        //Generate Blob Name
        const fileExtension = path.extname(originalName)
        const uniqueId = uuidv4();
        const blobName = folder
            ? `${folder}/${uniqueId}${fileExtension}`
            : `${uniqueId}${fileExtension}`;

        // Get blob client
        const BlockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload with metadata
        await BlockBlobClient.upload(buffer, buffer.length, {
            blobHTTPHeaders: {
                blobContentType: mimetype
            },
            metadata:{
                originalName: originalName,
                uploadedAt: new Date().toISOString()
            }
        });

        const url = BlockBlobClient.url.split('?')[0]; //remove SAS token from url

        return {
            url,
            blobName,
            contentType: mimetype
        };
    } catch (error) {
        console.error('Error uploading to Azure BlobStorage:', error);
        throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function deleteImage(blobName: string): Promise<void> {
    try {
        const BlockBlobClient = containerClient.getBlockBlobClient(blobName);
        await BlockBlobClient.delete();
    } catch (error) {
        console.error('Error deletingfrom Azure blob storage:', error);
        throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : ' Unknown error'}`);
    }
}

export async function deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
        const url = new URL(imageUrl);
        const blobName = url.pathname.substring(url.pathname.indexOf('/') + 1);
        await deleteImage(blobName);
    } catch (error) {
        console.error('Error deleting image by URL: ', error);
        throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function imageExists(blobName: string): Promise<boolean> {
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        return await blockBlobClient.exists();
    } catch (error) {
        console.error('Error checking blob existence:', error);
        return false;
    }
}

export default {
    uploadImage,
    deleteImage,
    deleteImageByUrl,
    imageExists
};



async function extractMetaData(headers:any) {
    const contentType = headers['content-type']
    const fileType = contentType.split('/')[1]
    const contentDisposition = headers['content-disposition'];
    const caption = headers['x-image-caption'] || 'No caption provided';
    const matches = /filename="([^"]+)/i.exec(contentDisposition);
    const fileName = matches?.[1] || `image-${Date.now()}.${fileType}`

    return {fileName, caption, fileType}
}

async function uploadImageStream(blobName:any, dataStream: any) {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.uploadStream(dataStream);
    return blobClient.url;
}

async function storeMetadata(name:any, caption:any, fileType:any, imageUrl:any) {
    const MONGODB_URI = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(MONGODB_URI);
    const collection = mongoClient.db("PricingModel").collection('metadata')
    await collection.insertOne({name, caption, fileType, imageUrl});
}

async function handleImageUpload(req:any, res:any) {
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/api/upload' && req.method === 'POST') {
        try {
            const {fileName, caption, fileType} = await extractMetaData(req.headers);
            const imageUrl = await uploadImageStream(fileName, req)
            await storeMetadata(fileName, caption, fileType, imageUrl)

            res.writeHead(201);
            res.end(JSON.stringify({message: 'Image uploaded, metadata stored'}))

        } catch (error) {
            console.log(error)
            res.writeHead(500);
            res.end(JSON.stringify({error: 'Server error'}))
        }

    } else {
        res.writeHead(404);
        res.end(JSON.stringify({error: 'Not found'}))
    }
}

export {handleImageUpload}

