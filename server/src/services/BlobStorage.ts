import { BlobServiceClient } from '@azure/storage-blob';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'

dotenv.config()

const accountName = process.env.ACCOUNT_NAME || '';
const sasToken = process.env.SAS_TOKEN || '';
const containerName = process.env.CONTAINER_NAME || '';

//connect to blob storage
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`)
const containerClient = blobServiceClient.getContainerClient(containerName)


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

