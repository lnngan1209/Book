const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("user");
    }
    //Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractUserData(payload) {
        const user = {
            email: payload.email,
            name: payload.name,
            password: payload.password,
            address: payload.address,
            phone: payload.phone,
            cart: payload.cart || [],
        }
        //loại bỏ những trường không được định nghĩa
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }
    async signUp(payload) {
        const user = this.extractUserData(payload);
        return await this.User.insertOne(user);
    }
    async signIn(payload) {
        const user = await this.findByEmail(payload.email);
        if (!user) {
            return user;
        }
        const passwordIsValid = await this.checkPassword(payload.email, payload.password);
        console.log(passwordIsValid)
        if (passwordIsValid) {
            return user;
        }
        return passwordIsValid;
    }
    async checkPassword(email, password) {
        const test = await this.User.findOne({email: email, password: password});
        return test ? true: false;
    }
    async findByEmail(email) {
        return await this.User.findOne({email: email});
    }
    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        })
    }
    async findByName(name) {
        return await this.findByEmail({
            name: {$regex: new RegExp(name), $options: "i"},
        });
    }
    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }
}

module.exports = UserService;