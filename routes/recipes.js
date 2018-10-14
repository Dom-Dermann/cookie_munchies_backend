const express = require('express');
const router = express.Router();
const { Recipe, recipeValidator } = require('../models/recipe');

router.post('/', async (req, res) => {
    const result = recipeValidator(req.body);
    if(result.error) return res.send(result.error.details[0].message);

     let recipe = new Recipe(req.body);

    await recipe.save()
        .then( (r) => res.send(r))
        .catch( (err) => res.status(404).send(err));
});

router.get('/', async (req, res) => {
    await Recipe.find()
        .then( (r) => res.status(404).send(r))
        .catch( (err) => res.send(err));
});

router.delete('/:id', async (req, res) => {
    await Recipe.findByIdAndRemove(req.params.id, (err, rec) => {
        if (err) return res.status(404).send(err);
        res.send(rec);
    })
});

module.exports = router;