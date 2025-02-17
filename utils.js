//generate random id
const generateId = (prefix, max) => {
    var value = prefix + "-" + Math.floor(Math.random() * max) + Math.floor(Math.random() * max)
    return value
}


module.exports = {
    generateId
}