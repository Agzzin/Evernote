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
    res.status(500).json({error: 'Error creating note'});
  }
});

router.get('/search', WithAuth, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Parâmetro de busca é obrigatório' });
  }

  try {
    let notes = await Note.find({
      author: req.user._id,
      $text: { $search: query }
    });
    res.json(notes);
  } catch (error) {
    console.error('Erro na busca:', error); 
    res.status(500).json({ error: 'Erro ao encontrar nota', detalhes: error.message });
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

router.delete('/:id', WithAuth, async (req, res) => {
  const {id} = req.params;
  try {
    let note = await Note.findById(id);
    if (!note) {
      res.status(404).json({error: 'Nota não encontrada'});
      return;
    }
    if(isOwner(req.user, note)){
      await note.deleteOne();
      res.json({message: 'Nota deletada'}).status(204);
    } else {
      res.status(403).json({error: 'Você não tem permissão para deletar essa nota'});
    }
  } catch (error) {
    res.status(500).json({error: 'Erro ao deletar nota'});
  }
})
module.exports = router;
