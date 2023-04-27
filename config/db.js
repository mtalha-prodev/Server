import mongoose from "mongoose";
// console.log(process.env.PORT);

export const database = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DB_URL, {});
    console.log(`Database connected  ${connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
