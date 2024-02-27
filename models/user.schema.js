import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {

        name:{
            type: String,
            required:[true," the name is required"],
            maxLength:[50,"maximum length is 50"]
        }
    }
)