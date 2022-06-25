module.exports = function(term) {

    this.wait = async function() {
        return await new Promise(resolve => setTimeout(resolve, 800));
    }

    this.send = async function(msg, color) {
        term[color](msg + "\n");
    }

}
