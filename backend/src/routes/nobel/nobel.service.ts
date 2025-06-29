import { NobelModel } from "../../models/nobel";
import type { NobelInput } from "./nobel.dto";

const NobelService = {
  async getAll() {
    return await NobelModel.find();
  },

  async findByYear(year: number) {
    return await NobelModel.find({ awardYear: year });
  },

  async getById(id: string) {
    const record = await NobelModel.findById(id);
    if (!record) throw new Error("Nobel record not found");
    return record;
  },

  async create(data: NobelInput) {
    const record = new NobelModel(data);
    await record.save();
    return record;
  },

  async update(id: string, data: NobelInput) {
    const record = await NobelModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!record) throw new Error("Nobel record not found for update");
    return record;
  },

  async delete(id: string) {
    const record = await NobelModel.findByIdAndDelete(id);
    if (!record) throw new Error("Nobel record not found for deletion");
    return { message: "Deleted successfully" };
  },
};

export { NobelService };
