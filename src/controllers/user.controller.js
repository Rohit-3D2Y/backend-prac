import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend
   //validation to check if anything is empty or not
   //check if user already exists: email, username
   //check for images and avatars
   //upload them to cloudinary
   //create user object, store in db
   //remove password and refresh token field from response
   //check for user creation
   //return res

   const{fullName, email, username, password} = req.body
   console.log("email:", email)

   if([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
   }

   const existedUser = User.findOne({
    $or:[{username}, {email}]
   })
   if(existedUser) {
    throw new ApiError (409, "user with email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar not found");
   }

   uploadOnCloudinary(avatarLocalPath)
})

export {registerUser}