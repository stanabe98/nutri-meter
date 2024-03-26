import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import CredentialModel, {
  User,
  MacroTarget,
  CustomFoodInfo,
  RecentFoodInfo,
} from "../data-models/credentialModel";
import UserFoodLogModel, {
  FoodInfo,
  FoodLogEntry,
  UserFoodLog,
} from "../data-models/userModel";

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

      const sortedEntries = findEntry.sort(compareDateStrings);
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
          return;
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

        if (foodInfo.referenceId) {
          const recentAddentry: RecentFoodInfo = foodInfo as RecentFoodInfo;

          const recentFoodResult = await CredentialModel.findById(
            currentUserId
          );
          if (
            !recentFoodResult.recentlyAdded.some(
              (s) => s.referenceId === recentAddentry.referenceId
            )
          ) {
            if (recentFoodResult.recentlyAdded.length >= 10) {
              recentFoodResult.recentlyAdded.pop();
            }
            recentFoodResult.recentlyAdded.unshift(recentAddentry);

            // const result = await CredentialModel.findByIdAndUpdate(
            //   currentUserId,
            //   {
            //     $push: {
            //       recentlyAdded: {
            //         $each: [recentAddentry],
            //         $slice: -10,
            //       },
            //     },
            //   }
            //   ,
            //   { new: true, upsert: true }
            // );

            recentFoodResult.save();
          }
        }

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
      const findEntry = await UserFoodLogModel.findOne({
        user: currentUserId.toString(),
        date: date,
      });

      findEntry.foodLog = findEntry.foodLog.filter(
        (log) => !foodIds.includes(log._id.toString())
      );
      await findEntry.save();

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

const compareDateStrings = (dateObj1: UserFoodLog, dateObj2: UserFoodLog) => {
  const [day1, month1, year1] = dateObj1.date.split("-").map(Number);
  const [day2, month2, year2] = dateObj2.date.split("-").map(Number);

  const date1 = new Date(year1, month1 - 1, day1);
  const date2 = new Date(year2, month2 - 1, day2);

  return date1.getTime() - date2.getTime();
};
