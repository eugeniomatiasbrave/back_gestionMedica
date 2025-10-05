import mongoose from 'mongoose';

const collection = "Writings"
const schema = new mongoose.Schema({

	title: {
        type:String,
        required:true
    },
    text: {
        type:String,
        required:true
    },
    date: {
        type:Date,
        default:Date.now
    }
});

const writingModel = mongoose.model(collection,schema);
export default writingModel;