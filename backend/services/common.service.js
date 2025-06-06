const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

exports.date = (datas) => {

    let datetime = new Date();
    let date=datetime.toISOString().slice(0,10);
    return date;
}

exports.datetime = () => {

    let datetime = new Date();
    return datetime;
}

exports.base_url = () => {

    
    return 'http://localhost:3001/';
}

exports.deleteUploadedFiles = async (files) => {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });

    try {
        // Flatten the array and filter out undefined values
        const flatFiles = Array.isArray(files) ? files.flat(Infinity).filter(file => file) : [files].filter(file => file);
        // Map each file to a delete command
        const deletePromises = flatFiles.map(file => {
            // If file is a URL, extract the key from it
            const fileKey = file.includes('https://') ? file.split('/').slice(3).join('/') : file;

            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileKey
            };
            return s3Client.send(new DeleteObjectCommand(params));
        });

        await Promise.all(deletePromises);
    } catch (deleteError) {
        console.error('Failed to delete files from S3:', deleteError);
    }
};

