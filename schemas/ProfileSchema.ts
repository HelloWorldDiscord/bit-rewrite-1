import mongoose from 'mongoose';

const UserStats = new mongoose.Schema({
    hits: {
        type: "Number",
        default: 0        
    },
    likes: {
        type: "Number",
        default: 0
    },
    likeUsers: {
        type: "Array",
        default: []
    },
    comments: {
        type: "Array",
        default: []
    }
})


const ProfileSchema = new mongoose.Schema({
    userId: {
        type: "String",
        required: true,
    },
    bio: {
        type: "String",
        required: true,
        default: "Welcome to my profile!"
    },
    badges: {
        type: "Array",
        required: true,
    },
    joinDate: {
        type: "String",
        required: true,
    },
    staffElement: {
        type: "Boolean",
        required: true,
        default: false
    },
    staffPosition: {
        type: "String",
        required: false,
    },
    ownerElement: {
        type: "Boolean",
        required: true,
        default: false
    },
    displayPicture: {
        type: "String",
        required: true,
    },
    displayName: {
        type: "String",
        required: true,
    },
    syncOnStartup: {
        type: "Boolean",
        required: true,
        default: false
    },
    notifOptOut: {
        type: "Boolean",
        required: true,
        default: false
    },
    userStats: UserStats
})

export default mongoose.model("ProfileSchema", ProfileSchema);