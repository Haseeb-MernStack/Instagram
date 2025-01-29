import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

// Add/Create new Post.
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!caption || !image) {
            return res.status(400).json({ message: "Caption and image are required" });
        }
        // image upload.
        const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: 'inside' }).toFormat('jpeg', { quality: 80 }).toBuffer();

        // convert buffer into data URI.
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        // use cloudinary.
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        // yahan se user mil jy ga.
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        // populate mongoDb ka aaik method hai jiss se hum kisi bhi user ki id se uss ka data nikaal sakte han.
        await post.populate({ path: 'author', select: '-password' });

        return res.status(200).json({
            message: 'New Post Created Successfully',
            post,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Get all posts.
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// get user post.
export const getUserPost = async (req, res) => {
    try {
        // post chahiye user ke hisaab se.
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username, profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username, profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// like Post.
export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id; // Ensure that the user ID is being set properly
        const postId = req.params.id;

        // Log to verify the postId and user ID
        console.log('Post ID:', postId);
        console.log('User ID:', likeKrneWalaUserKiId);

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Add user ID to the 'likes' array if not already liked
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // Success response
        return res.status(200).json({
            message: 'Post liked',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};



// dislike Post.
export const disLikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id; // Ensure that the user ID is being set properly
        const postId = req.params.id;

        // Log to verify the postId and user ID
        console.log('Post ID:', postId);
        console.log('User ID:', likeKrneWalaUserKiId);

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Remove user ID from the 'likes' array if already liked
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // Success response
        return res.status(200).json({
            message: 'Post disliked',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};



// Comment on Post.
export const AddComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKrneWalaUserKiId = req.id;

        // text ko get krain ge.
        const { text } = req.body;

        const post = await Post.findById(postId);

        if (!text) {
            return res.status(400).json({
                message: 'Comment is required',
                success: false
            });
        }
        const comment = await Comment.create({
            text,
            author: commentKrneWalaUserKiId,
            post: postId
            // yahan tak comment model create hua ha.
        })
        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            message: 'Comment added',
            comment,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// get each post comments.
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

        if (!comments) {
            return res.status(404).json({
                message: 'No comments found for this post.',
                success: false
            })
        };
        return res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        console.log(error);
    }
}

// delete Posts
export const deletePosts = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                message: false
            })
        };

        // check if the logged-in user is the owner of the post.
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: "Unauthorized",
            })
        };

        // delete post.
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post.
        let user = await User.findById(authorId);
        user.posts = user.posts(id => id.toString() !== postId);
        await user.save();

        // delete associated comments iska matlab post ke saath comments bhi delete ho jyyn ge.
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post deleted",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
}

// bookmark Post.
export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        };
        // find user.
        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            // already bookmarked --> remove from the bookmark.
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                message: 'Post removed from bookmark',
                type: 'unsaved',
                success: true
            })
        } else {
            // bookmark krna.
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                message: 'Post bookmarked',
                type: 'saved',
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}