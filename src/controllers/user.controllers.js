import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // console.log(accessToken,refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { username, email, fullName, password } = req.body;
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  console.log("User Register Successfully");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials or Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  console.log("User logged In Successfully");

  return res
    .status(202)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  console.log("User Logout Successfully");
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "User Logout Successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(403, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    console.log("Access token refreshed");
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword  = asyncHandler( async (req, res ) => {
 const {oldPassword, newPassword } = req.body

 const user = await User.findById(req.user?._id)
 const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

 if (!isPasswordCorrect) {
     throw new ApiError(400, "Invalid old password")
      }
    user.password = newPassword
    await user.save({validateBeforeSave:false})
    
    console.log("Password changed successfully");
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler( async (req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,
      req.user, 
      "current user fetched successfully"))
});

const updateAccountDetails = asyncHandler( async ( req, res) => {
  const {fullName,email } = req.body
  if (!(fullName || email)) {
    throw new ApiError(400, "All fields are required")
  }
  const user = await User.findByIdAndDelete(
    req.user?._id,
  {
    $set:{
      fullName,
      email
    }
  },
  {new:true}).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(202,user,"account details update successfully"))
});

const updateUserAvatar = asyncHandler ( async (req, res) => {
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar")
    }

   const user = await User.findByIdAndUpdate(req.user?._id,{
      $set:{
        avatar:avatar.url
      }
    },
    {
      new:true
    }).select("-password")
  

    return res
    .status(200)
    .json(200,user ,"Avatar updated successfully")
});

const updateUserCoverImage = asyncHandler ( async (req, res) => {
  const coverImageLocalPath = req.file?.path
  if (!coverImageLocalPath) {
      throw new ApiError(400, "cover image file is missing")
  }
  const coverImage = await uploadOnCloudinary(avatarLocalPath)

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading on cover image")
    }

   const user = await User.findByIdAndUpdate(req.user?._id,{
      $set:{
        coverImage:coverImage.url
      }
    },
    {
      new:true
    }).select("-password")
  

    return res
    .status(200)
    .json(200,user ,"cover Image updated successfully")
});

const getUserChannerProfile = asyncHandler ( async (req, res) => {
    const  {username} = req.params
    if (!username) {
      throw new ApiError(402, "username not found OR missing")
    }
    const channel = await User.aggregate([
      {
        $match:{
          username: username?.toLowerCase()
        }
      },
      {
        $lookup:{
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as:"Subscribers"

        }
      },
      {
        $lookup:{
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as:"SubscribedTo"

        }
      },
      {
        $addFields:{
          SubscribersCount: {
            $size: "$subscribers"
          },
            channelsSubcribedToCount:{
              $size: "$SubscribedTo"
          },
          isSubscribed: {
            $cond:{
              if:{$in:[req.user?._id, "$subscribers.subscriber"]},
              then:true,
              else:false
            }
          }
        }
      },
      {
        $project: {
          fullName:1,
          username:1,
          SubscribersCount:1,
          channelsSubcribedToCount:1,
          isSubscribed:1,
          coverImage:1,
          avatar:1,
          email:1
        }
      }

    ])

    if (!channel?.length) {
      throw new ApiError(404, "Channel does not exists")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Channel found successfully")
    )
});

const getWatchHistory = asyncHandler ( async ( req, res ) => {
   const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id)
       // _id: new mongoose.Types.ObjectId.createFromHexString(req.user._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    username:1,
                    avatar:1
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
    }
   ]);

   return res
   .status(200)
   .json(
    new ApiResponse(200,
      user[0].watchHistory,
      "Watch History fetched successfully")
   )
});



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannerProfile,
    getWatchHistory
  };
