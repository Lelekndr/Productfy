import { Request, Response } from 'express';
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";


//Create commment (protected)
export const createComment = async (req: Request, res: Response) => {
    try{
        const {userId} = getAuth(req);
        if (!userId) return res.status(401).json({message: "Unauthorized"});

        const {productId} = req.params;
        const {content} = req.body;

        if (!content) return res.status(400).json({message: "Content is required"});

        //Check if product exists
        const product = await queries.getProductById(productId);
        if (!product) return res.status(404).json({message: "Product not found"});

        const Comment = await queries.createComment({
            productId,
            userId,
            content
        });
        return res.status(201).json(Comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

//Delete comment (protected - owner only)
export const deleteComment = async (req: Request, res: Response) => {
    try{
        const {userId} = getAuth(req);
        if (!userId) return res.status(401).json({message: "Unauthorized"});

        const {commentId} = req.params;

        //Check if comment exists
        const existingComment = await queries.getCommentById(commentId);
        if (!existingComment) return res.status(404).json({message: "Comment not found"});

        if (existingComment.userId !== userId) return res.status(403).json({message: "Forbidden"});

        await queries.deleteComment(commentId);
        return res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};


