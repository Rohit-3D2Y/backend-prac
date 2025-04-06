import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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

  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "user with email or username already exists");
  }

  const avatarLocalPath = req.files.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar not there");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req -> body
  //username or email
  //find the User
  //password check
  //access token generation and refresh token generation
  //send cookies

  const generateRefreshAndAccessToken = async(userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})

      return { accessToken, refreshToken }

    } catch (error) {
      throw new ApiError(500, "Something went wrong while generating regresh and access tokens")
    }
  }

  const {email, username, password } = req.body;
  if(!username || !email ) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [ {username}, {email}]
  });

  if(!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid) {
    throw new ApiError(401, "Password is not valid")
  }

  const {accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true
  }

  return res.
  status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(
    200, {
      user: loggedInUser, accessToken,refreshToken
    },
    "User logged in Successfully"
  ))
 });

const logOutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {refreshToken: undefined}
      },
      {
        new:true
      }
    )

    const options = {
      httpOnly: true,
      secure: true
    }

    return res.status(200).clearCooke("accessToken", options).clearCooke("refreshToken", options).json(new ApiResponse(200,{}, "User logged out successfully" ))
})

export { registerUser, loginUser , logOutUser};
