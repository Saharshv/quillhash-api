import { pool } from '../connect';
import { QueryResult } from 'pg';
import { Request, Response } from 'express';

// CREATES USER IN POSTGRES
export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, image} = req.body;
    const response: QueryResult = await pool.query(
        "INSERT INTO Users(name, email, password, image) VALUES ($1, $2, $3, $4)",
        [name, email, password, image]
    );
    return response;
};

// CHECKS IF LOGIN DETAILS ARE CORRECT
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response: QueryResult = await pool.query(
        "SELECT * FROM Users WHERE email = $1 AND password = $2 ",
        [email, password]
      );
    
      if (!response.rows[0]) {
        return null;
      }
      return response.rows[0];
}

// CHECKS IF USER IS IN POSTGRES
export const findUser = async (req: Request, res: Response, userId: any) => {
    const response: QueryResult = await pool.query(
        'SELECT likes, blocked FROM Users WHERE id = $1', [userId]
    );
    if (!response.rows[0]) {
        return null;
      }
      return response.rows[0];
}

// LIKES THE USER'S IMAGE
export const likeUser = async (req: any, res: any) => {
    const userId = req.params.userId;
    const userDetail = await findUser(req, res, userId);
    if(!userDetail)
    {
        return null;        
    }
    const likes = userDetail.likes;
    const currentUser = req.user.id;
    if(!likes.includes(currentUser))
        likes.push(currentUser);
    const response: QueryResult = await pool.query(
        'UPDATE Users SET likes = $1 WHERE id = $2', [likes, userId]
    );
    if (!response) {
        return null;
    }
    return response;
}

// BLOCKS THE USER
export const blockUser = async (req: any, res: any) => {
    const userId = req.params.userId;
    const userDetail = await findUser(req, res, userId);
    if(!userDetail)
    {
        return null;        
    }
    const blockedBy = userDetail.blocked;
    const currentUser = req.user.id;
    if(!blockedBy.includes(currentUser))
        blockedBy.push(currentUser);
    const response: QueryResult = await pool.query(
        'UPDATE Users SET blocked = $1 WHERE id = $2', [blockedBy, userId]
    );
    if (!response) {
        return null;
    }
    return response;
}

// ADDS IMAGE TO THE USER PROFILE
export const addImage = async (req: any, res: any) => {
    const currentUser = req.user.id;
    const image = req.body.image;
    const response: QueryResult = await pool.query(
        'UPDATE Users SET image = $1 WHERE id = $2', [image, currentUser]
    );
    if (!response) {
        return null;
    }
    return response;
}

// SHOWS THE LIST OF USERS THAT HAVE NOT BLOCKED THE USER AND NOT LIKED THE USER
export const usersToShow = async (req: any, res: any) => {
    const currentUser = req.user.id;
    const userDetail = await findUser(req, res, currentUser);
    const response: QueryResult = await pool.query(
        'SELECT id, name, image FROM Users WHERE id != $1 AND id NOT IN (SELECT unnest(likes) FROM Users WHERE id = $1) AND id NOT IN (SELECT unnest(likes) FROM Users WHERE id = $1)', [currentUser]
    )
    console.log(response);
    if (!response.rows[0]) {
        return null;
    }
    return response.rows;
}
