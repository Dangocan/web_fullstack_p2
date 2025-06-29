import mongoose from "mongoose";

const NobelSchema = new mongoose.Schema({
  awardYear: Number,
  dateAwarded: String,
  category: {
    en: String,
  },
  laureates: [
    {
      fullName: {
        id: String,
        en: String,
      },
      orgName: {
        id: String,
        en: String,
      },
    },
  ],
});

const NobelModel = mongoose.model("Nobel", NobelSchema);

export { NobelModel };
