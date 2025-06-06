const cacheUtil = require('../utils/cache.util');
const jwtUtil = require('../utils/jwt.util');
const {
    Company
    } = require('../models/connection.js');

module.exports = async (req, res, next) => {
    const url =  req.url;
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) { 
        token = token.slice(7, token.length);
    }
    if (token) {
        try {
            token = token.trim();
            /* ---------------------- Check For Blacklisted Tokens ---------------------- */
            const isBlackListed = await cacheUtil.get(token);
            if (isBlackListed) {
                return res.status(401).json({ status:false,message: 'Unauthorized' });
            }
            const decoded = await jwtUtil.verifyToken(token);
            const active_company_id = decoded.active_company_id;
            // Check if active_company_id is blank
            if (active_company_id === '') {
                // If action is 'create' and URL is '/onboard-company', proceed to the next step
                if (req.body.action === 'create' && req.url === '/onboard-company') {
                    next();
                } else {
                    // Otherwise, return an authorization error
                    return res.status(400).json({ status: false, message: 'Authorization token is invalid.' });
                }
            } else {
                // If active_company_id is not blank, proceed to the next step
                const isExist = await Company.findByPk(active_company_id);
                console.log("hellllo",active_company_id);
                if(!isExist)
                {
                    return res.status(400).json({ status: false, message: 'Please provide a valid company ID' });   
                }
                next();
            }
            
        } catch (error) {
            return res.status(401).json({ status:false, message: 'Unauthorized' });
        }
    } else {
        return res.status(400).json({ status:false,message: 'Authorization header is missing.' })
    }
}