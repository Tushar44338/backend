import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessandRefreshTokens = async (userId) => {
    try {

        //find user in mongodb
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //set the user refresh token in the mongodb
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false}) // validationBeforeSave this is stop the validation while saving. we are saving only one field(refreshToken) when we save this it automatically show error for requiring fields.

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while creating access and refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })

    const { fullName, email, password, username } = req.body
    // console.log("req.body: ", req.body);
    // console.log("email: ", email);
    // console.log("password: ", password);
    // console.log("username: ", username);
    
    if( [fullName, email, username, password].some((field) => field?.trim() === "") ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User or email already exists")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path  // req.files options provide by the middleware which is located at user.routes.js
    // const coverImageLocalPath = req.files?.coverImage[0]?.path


    //this method handle the coverImage if not uploded by user
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }


    // console.log(avatarLocalPath);
    // console.log(coverImageLocalPath);
    // console.log(req.files);
    


    if(!avatarLocalPath){
        throw new ApiError(400, 'Avatar file is required.')
    }
    

    //cloudinary manage the files to be uplode
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, 'Avatar file is required.')
    }


    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase() 

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(400, 'something went wrong!, try again later')
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user created successfully!")
    )
})


const loginUser = asyncHandler( async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email) {
        throw new ApiError(400, "username or email is required!")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user not does not exits!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "incorrect password!!")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id) 

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken,refreshToken
        }, "user logged in successfully" 
    ))
})

const logoutUser = asyncHandler(async(req, res) => {
    User.findByIdAndUpdate(
        req.user._id,{
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "user logged out successfully"))
})

export { 
    registerUser, 
    loginUser,
    logoutUser
 };