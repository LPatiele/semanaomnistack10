const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(request, response){
        const devs = await Dev.find();
        return response.json(devs)
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body
        
        let dev = await Dev.findOne({github_username})

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
    
            const { name = login, avatar_url, bio } = apiResponse.data
        
            const techsArray = parseStringAsArray(techs)
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
        }

        console.log(dev)
 
        return response.json(dev)
    },

    
    //update e destroy
    async update(request, response){
        const { id } = request.params
        console.log( {id} )

        
        const { techs, latitude, longitude, bio , name} = request.body
        

        const techsArray = parseStringAsArray(techs)
        
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }
        
        const atualizacao = await Dev.update( {github_username: id}, { 
            $set: { 
                name,
                techs: techsArray,
                location,
                bio,
            }
        })

        const dev = await Dev.findOne({github_username: id})

        console.log( {atualizacao})
        return response.json({atualizacao})
    },
    
}