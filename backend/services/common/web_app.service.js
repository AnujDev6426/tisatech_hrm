const {
    WebAppContentMasters
    } = require('../../models/connection.js');

exports.findUserByEmailLogin = (types) => {
    return WebAppContentMasters.findOne({ 
        where: {
            type: types
            
        }
    }) 
}
