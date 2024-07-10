const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permissions :{
      type:Array,
      default : []
    },
    deleted: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});
const Role = mongoose.model('Role', roleSchema, "roles");

module.exports = Role;