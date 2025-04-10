const express = require('express');
const router = express.Router();
const Note = require('../../models/note');
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

router.get('/:id', WithAuth, async (req, res) => {
  try {
    const {id} = req.params;
    let note = await Note.findById(id)
    if(isOwner(req.user, note)){
      res.json(note);
    }else{
      res.status(403).json({error: 'You are not the owner of this note'});
    }
  } catch (error) {
    res.status(500).json({error: 'Erro to get note'});
    
  }
});

const isOwner = (user , note) =>{
  if(JSON.stringify(user._id) === JSON.stringify(note.author._id)){
    return true;
}else{
  return false;
}}


router.get('/', WithAuth, async (req, res) => {
  try {
    let notes = await Note.find({author: req.user._id})
    res.json(notes);
  } catch (error) {
    res.status(500).json({error: 'Erro to get notes'});
    
  }
})

router.put('/:id', WithAuth, async (req, res) => {
  const { title, body } = req.body;
  const {id} = req.params;

  try {
    let note = await Note.findById(id);
    if(isOwner(req.user, note)){
       note = await Note.findByIdAndUpdate(id, 
        {$set: {title: title, body: body}},
        {upsert: true, new: true}
      );;

      res.json(note);
  
    } else {
      res.status(403).json({error: 'You are not the owner of this note'});
        }
  } catch (error) {
    res.status(500).json({error: 'Erro to update note'});
    
  }
})

module.exports = router;
