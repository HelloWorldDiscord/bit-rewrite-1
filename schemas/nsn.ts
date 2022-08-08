import mongoose from "mongoose";
const NSN = new mongoose.Schema({
    iterator: {
        type: Number,
        default: 0
    },
});

export default mongoose.model("NSN", NSN);