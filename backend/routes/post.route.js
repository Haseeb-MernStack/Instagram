import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { AddComment, addNewPost, bookmarkPost, deletePosts, disLikePost, getAllPosts, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controller.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost);
router.route('/all').get(isAuthenticated, getAllPosts);
router.route('/userpost/all').get(isAuthenticated, getUserPost);
router.route('/:id/like').post(isAuthenticated, likePost);
router.route('/:id/dislike').post(isAuthenticated, disLikePost);
router.route('/:id/comment').post(isAuthenticated, AddComment);
router.route('/:id/comment/all').post(isAuthenticated, getCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated, deletePosts);
router.route('/:id/bookmark').post(isAuthenticated, bookmarkPost);

export default router;
