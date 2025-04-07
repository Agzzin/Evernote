const express = require('express');
const router = express.Router();
const Note = require('../../models/notes');
const WithAuth = require('../middlewares/auth');

router.post('/', WithAuth, async (req, res) => {
  const { title, body } = req.body;

  try {
    let note = new Note({title: title, body: body, author: req.user._id});
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({error: 'Erro ao criar nota'});
  }
});

module.exports = router;
