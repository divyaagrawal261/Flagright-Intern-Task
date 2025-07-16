import express from 'express';
import { createOrUpdateUser, listAllUsers } from '../controllers/userControllers.js';

export default function userRoutes(session) {
  const router = express.Router();

  router.post('/', (req, res) => createOrUpdateUser(session, req, res));
  router.get('/', (req, res)=> listAllUsers(session, req, res));

  return router;
}