const { ObjectId } = require("mongodb");

class AdminService {
    constructor(client) {
        this.Admin = client.db().collection("admin")
    }

    extractAdminData(payload) {
        const admin = {
            fullname: payload.fullname,
            username: payload.username,
            password: payload.password,
            position: payload.position,
            address: payload.address,
            phone: payload.phone,

        };
        Object.keys(admin).forEach(
            (key) => admin[key] === undefined && delete admin[key]
        );
        return admin;
    }

    async findByUserName(username) {
        return await this.Admin.findOne({username: username});
    }
    async checkPassword(username, password) {
        const test = await this.Admin.findOne({username: username, password: password});
        return test ? true: false;
    }
        
    async signIn(payload) {
        const admin = await this.findByUserName(payload.username);
        if (!admin) {
            return admin;
        }
        const passwordIsValid =  await this.checkPassword(payload.username, payload.password);
        if (passwordIsValid) return admin;
        return passwordIsValid;
    }
    async signup(payload) {
        const admin = this.extractAdminData(payload);
        return await this.Admin.insertOne(admin);
    }
}
module.exports = AdminService;