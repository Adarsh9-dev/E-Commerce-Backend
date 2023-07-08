import AWS from "aws-sdk";

export const uploadFile = (file) => {
  return new Promise((resolve, reject)=> {
    const s3 = new AWS.S3({apiVersion: '2006-03-01'})

    const credentials = {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET,
      Key: `adarsh/${file.originalname}`,
      Body: file.buffer,
    }

    s3.upload(credentials, function (err, data) {
      if (err) {
        return reject({error: err})
      }
      console.log("File Upload Successfully")
      return resolve(data.Location);
    })
  })
}