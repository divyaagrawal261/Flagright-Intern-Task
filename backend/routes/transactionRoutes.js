import express from 'express';
import { createOrUpdateTransaction, listAllTransactions } from '../controllers/transactionControllers.js';

export default function transactionRoutes(session) {
  const router = express.Router();

  router.post('/', (req, res) => createOrUpdateTransaction(session, req, res));
  router.get('/', (req, res)=> listAllTransactions(session, req, res));

  return router;
}