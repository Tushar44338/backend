import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

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

export { registerUser };