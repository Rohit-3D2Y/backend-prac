import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null

            //upload on cloudinary

            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            // file has been uploaded successfully
            console.log("File uploaded successfully", response.url);

            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath); //remove locally saved temporary files as the upload operatin got failed
            return null;
             
        }
    }

    export {uploadOnCloudinary};

    // cloudinary.v2.uploader.upload("https://upload.wikipedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    //     {public_id:"olympic_flag"},
    //     function(error, result) {console.log(result, error)});
    