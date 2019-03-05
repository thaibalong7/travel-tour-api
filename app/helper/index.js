


module.exports = {
    validateEmail: async function (email) {
        var Regex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/
        return Regex.test(email);
    }, 
    validatePhoneNumber: async function (phone_number) {
        var Regex = /^\d{10}$/
        return Regex.test(phone_number);
    }
}