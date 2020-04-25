import mongoose from 'mongoose'

// Schema 是用于定义一些数据表操作，而module是与表操作的相关行为
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        // 唯一值
        unique: true,
        // 必填项
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
})

// model 关联 Schema，做桥梁
export default mongoose.model('User', UserSchema)
