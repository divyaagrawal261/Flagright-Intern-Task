import express from 'express';
import { getUserRelationships, getTransactionRelationships } from '../controllers/relationshipControllers.js';

export default function relationshipRoutes(session) {
  const router = express.Router();

  router.get('/user/:id', (req, res) => getUserRelationships(session, req, res));
  router.get('/transaction/:id', (req, res) => getTransactionRelationships(session, req, res));

  return router;
}