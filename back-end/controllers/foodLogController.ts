import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import CredentialModel, {
  User,
  MacroTarget,
} from "../data-models/credentialModel";
import UserFoodLogModel, {
  FoodInfo,
  FoodLogEntry,
} from "../data-models/userModel";
import generateToken from "../config/generateToken";
import dayjs from "dayjs";

interface CreateFoodLog {
  foodInfo: FoodInfo;
  date: string;
  modifyId?: string;
}

interface ModifyFoodLog {
  foodInfo: FoodInfo;
  date: string;
  modifyId: string;
}

interface DeleteFoodLog {
  date: string;
  foodIds: string[];
}

interface DeleteFullEntry {
  date: string;
}

export const getFoodLog = asyncHandler(
  async (req: Request<{ date: string }, {}, {}> & { user?: User }, res) => {
    const date = req.params.date;
    const currentUserId = req.user._id;

    try {
      const findEntry = await UserFoodLogModel.findOne({
        user: currentUserId.toString(),
        date: date,
      });
      res.status(200).send(findEntry === null ? [] : findEntry);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const getAllFoodLogs = asyncHandler(
  async (req: Request<{}> & { user?: User }, res) => {
    const currentUserId = req.user._id;
    try {
      const findEntry = await UserFoodLogModel.find({
        user: currentUserId.toString(),
      }).select("date totalMacros _id");

      const sortedEntries = findEntry.sort((a, b) => {
        const dateA = dayjs(a.date, "DD-MM-YYYY");
        const dateB = dayjs(b.date, "DD-MM-YYYY");
        return dateA.diff(dateB);
      });

      res.status(200).send(sortedEntries === null ? [] : sortedEntries);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const addNewEntry = asyncHandler(
  async (req: Request<{}, {}, CreateFoodLog> & { user?: User }, res) => {
    const { foodInfo, date, modifyId } = req.body;
    console.log("date", date);
    const currentUserId = req.user._id;

    try {
      const findEntry = await UserFoodLogModel.findOne({
        user: currentUserId.toString(),
        date: date,
      });

      if (findEntry && modifyId) {
        const index = findEntry.foodLog.findIndex(
          (entry) => entry._id.toString() === modifyId
        );

        if (index === -1) {
          res.status(404).json({ error: "Food log entry not found" });
        }

        findEntry.foodLog[index].foodInfo = {
          ...findEntry.foodLog[index].foodInfo,
          ...foodInfo,
        } as FoodInfo;

        findEntry.foodLog[index].updatedAt = new Date();

        await findEntry.save();
        res.status(200).json(findEntry);
        return;
      }

      if (!findEntry) {
        console.log("ss");
        const newFoodEntry = await UserFoodLogModel.create({
          user: currentUserId.toString(),
          date: date,
          foodLog: { foodInfo: foodInfo },
        });
        if (newFoodEntry) {
          res.status(201).json(newFoodEntry);
        }
      } else {
        findEntry.foodLog.push({
          foodInfo: foodInfo,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as FoodLogEntry);
        await findEntry.save();
        res.status(200).json(findEntry);
      }
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const modifyEntry = asyncHandler(
  async (req: Request<{}, {}, ModifyFoodLog> & { user?: User }, res) => {
    const { foodInfo, date, modifyId } = req.body;
    const currentUserId = req.user._id;

    try {
      const findEntry = await UserFoodLogModel.findOne({
        user: currentUserId.toString(),
        date: date,
      });

      const index = findEntry.foodLog.findIndex(
        (entry) => entry._id.toString() === modifyId
      );

      if (index === -1) {
        res.status(404).json({ error: "Food log entry not found" });
      }
      findEntry.foodLog[index].foodInfo = foodInfo;
      findEntry.foodLog[index].updatedAt = new Date();

      await findEntry.save();
      res.status(200).json(findEntry);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const deleteEntry = asyncHandler(
  async (req: Request<{}, {}, DeleteFoodLog> & { user?: User }, res) => {
    const { date, foodIds } = req.body;
    const currentUserId = req.user._id;

    try {
      const deleteEntry = await UserFoodLogModel.updateOne(
        {
          user: currentUserId.toString(),
          date: date,
        },
        { $pull: { foodLog: { _id: { $in: foodIds } } } }
      );

      res.json({
        message: "selected food logs deleted successfully",
        deleteEntry,
      });
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const deleteFullEntry = asyncHandler(
  async (req: Request<{}, {}, DeleteFullEntry> & { user?: User }, res) => {
    const { date } = req.body;
    const currentUserId = req.user._id;

    try {
      const deleteEntry = await UserFoodLogModel.deleteOne({
        user: currentUserId.toString(),
        date: date,
      });

      res.json({
        message: "selected entry deleted successfully",
        deleteEntry,
      });
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  }
);
