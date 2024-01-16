const express = require('express');
const pokemon = express.Router();
const db = require('../config/database');

pokemon.post("/", async (req, res, next) => { 
    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;

    if (pok_name && pok_height && pok_weight && pok_base_experience){
        let query = "INSERT INTO pokemon (pok_name, pok_height, pok_weight, pok_base_experience)";
        query += ` VALUES('${pok_name}', ${pok_height}, ${pok_weight}, ${pok_base_experience})`; 

        const addrow = await db.query(query);
        return (addrow.affectedRows == 1) ? 
            res.status(201).json({code: 201, message: "Nuevo Pokemon agregado!"}):
            res.status(500).json({code: 500, message: "Ocurrio un error!"})
    }
    return res.status(500).json({code: 500, message: "Campos incompletos, llenelos correctamente!"})
});

pokemon.get("/", async (req, res, next) => {
    const pokemon = await db.query("SELECT * FROM pokemon")
    return res.status(200).json({code: 200, message: pokemon});
});

pokemon.get("/:id([0-9]{1,4})", async (req, res, next) =>{
    const id = req.params.id
    const pokemons = await db.query("SELECT MAX(pok_id) as max_id FROM pokemon");
    return (id >= 0 && id <= pokemons[0].max_id) ?
        res.status(200).json({code: 200, message: await db.query("SELECT * FROM pokemon WHERE pok_id="+id+";")}) :
        res.status(404).json({code: 404, message: "No se encontro ningun pokemon con ese ID, ingresa uno de 1 a " +pokemons[0].max_id});
});

pokemon.get("/:name([A-Za-z]+)", async (req, res, next) =>{
    const name = req.params.name.toLowerCase();
    const PokemonSelected = await db.query("SELECT * FROM pokemon WHERE pok_name='"+name+"';");

    return (PokemonSelected.length > 0) ? 
        res.status(200).json({code: 200, message: PokemonSelected}) : 
        res.status(404).json({code: 404, message: 'Pokemon no encontrado!'}); 
});

module.exports = pokemon;