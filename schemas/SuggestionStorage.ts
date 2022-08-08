import mongoose from "mongoose";

const SuggestionStorage = new mongoose.Schema({
    number: {
        type: "String",
        required: true
    },
    msgId: {
        type: "String",
        required: true
    },
    authorId: {
        type: "String",
        required: true
    },
    cardId: {
        type: "String",
        required: true
    },
    comments: {
        type: "Array",
        required: true,
        default: []
    }
})

export default mongoose.model("SuggestionStorage", SuggestionStorage);