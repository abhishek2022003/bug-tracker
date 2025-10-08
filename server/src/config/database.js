const { default: mongoose } = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.log("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDatabase;