import mongoose from "mongoose"
export const connectDb = async() => {

    try {
        console.log("DB_URI",process.env.DB_URI);
        const connection = await mongoose.connect(process.env.DB_URI);

        return connection;

    } catch (error) {
        console.log(error);

    }

}

