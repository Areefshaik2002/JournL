import { Router } from 'express'
import { JournalController } from '../controllers/journal.controller.js'
import { authenticateJWT } from '../middleware/auth.js'

const router = Router()

router.use(authenticateJWT)

router.get('/', JournalController.getJournals)
router.get('/:id', JournalController.getJournalById)
router.post('/', JournalController.createJournal)
router.put('/:id', JournalController.updateJournal)
router.delete('/:id', JournalController.deleteJournal)

export default router
