import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import CredentialModel, {
  User,
  MacroTarget,
  CustomFoods,
  CustomFoodInfo,
} from "../data-models/credentialModel";
import UserFoodLogModel from "../data-models/userModel";
import generateToken from "../config/generateToken";
// import { CustomFoods } from "../data-models/credentialModel";

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}
interface AuthUserBody {
  email: string;
  password: string;
}

interface ModifyUserBody {
  pic?: string;
  macroTarget?: MacroTarget;
}

interface CreateCustomFood {
  food: CustomFoodInfo;
  modifyId?: string;
}

interface DeleteCustomFood {
  modifyId?: string[];
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const registerUser = asyncHandler(
  async (req: Request<{}, {}, CreateUserBody>, res: Response<any>) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please enter all the fields");
    }

    const userExists = await CredentialModel.findOne({ email });
    if (userExists) {
      res.status(400).send({ error: "400", message: "User exists" });
      throw new Error("User already exists");
    }

    const newUser = await CredentialModel.create({
      name: name,
      email: email,
      password: password,
    });

    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pic: newUser.pic,
        token: generateToken(newUser._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create the User");
    }
  }
);

export const authUser = asyncHandler(
  async (req: Request<{}, {}, AuthUserBody>, res: Response<any>) => {
    const { email, password } = req.body;

    const user = await CredentialModel.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invaild email or password");
    }
  }
);

export const getUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const currentUser = req.user;
    res.send(currentUser);
  }
);

const getUser2 = asyncHandler(
  async (req: Request & { user?: User }, res: Response) => {
    const currentUser = req.user;
    res.send(currentUser);
  }
);

export const modifyUser = asyncHandler(
  async (
    req: Request<{}, {}, ModifyUserBody> & { user?: User },
    res: Response
  ) => {
    const { pic, macroTarget } = req.body;
    const currentUserId = req.user._id;

    if (!pic && !macroTarget) {
      res.status(400);
      throw new Error("Nothing passed to body");
    }

    try {
      const currentUser = await CredentialModel.findOne({
        _id: currentUserId.toString(),
      });

      if (pic) {
        currentUser.pic = pic;
      }

      if (macroTarget) {
        console.log("exec", currentUser.macroTarget);
        currentUser.macroTarget = macroTarget;
      }
      await currentUser.save();
      const modifiedUser = { ...currentUser.toObject() };
      delete modifiedUser.password;

      res
        .status(200)
        .json({ message: "User updated successfully", currentUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const addSavedFood = asyncHandler(
  async (
    req: Request<{}, {}, CreateCustomFood> & { user?: User },
    res: Response
  ) => {
    const currentUserId = req.user._id;
    const { food } = req.body;

    try {
      const currentUser = await CredentialModel.findOne({
        _id: currentUserId.toString(),
      });
      currentUser.savedFoods.push({
        foodInfo: food,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as CustomFoods);
      await currentUser.save();
      res.status(200).json(currentUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const editSavedFood = asyncHandler(
  async (
    req: Request<{}, {}, CreateCustomFood> & { user?: User },
    res: Response
  ) => {
    const currentUserId = req.user._id;
    const { food, modifyId } = req.body;

    try {
      const currentUser = await CredentialModel.findOne({
        _id: currentUserId.toString(),
      });

      const index = currentUser.savedFoods.findIndex(
        (item) => item._id.toString() === modifyId
      );

      if (index === -1) {
        res.status(404).json({ error: "Saved Food entry not found" });
        return;
      }

      currentUser.savedFoods[index].foodInfo = {
        ...currentUser.savedFoods[index].foodInfo,
        ...food,
      } as CustomFoodInfo;

      await currentUser.save();
      res.status(200).json(currentUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const deleteSavedFood = asyncHandler(
  async (
    req: Request<{}, {}, DeleteCustomFood> & { user?: User },
    res: Response
  ) => {
    const currentUserId = req.user._id;
    const { modifyId } = req.body;

    try {
      const currentUser = await CredentialModel.updateOne(
        {
          _id: currentUserId.toString(),
        },
        { $pull: { savedFoods: { _id: { $in: modifyId } } } }
      );

      // const index = currentUser.savedFoods.findIndex(
      //   (item) => item._id.toString() === modifyId
      // );

      // if (index === -1) {
      //   res.status(404).json({ error: "Saved Food entry not found" });
      //   return;
      // }

      // currentUser.savedFoods[index].foodInfo = {
      //   ...currentUser.savedFoods[index].foodInfo,
      //   ...food,
      // } as CustomFoodInfo;

      // await currentUser.save();
      res.status(200).json({ message: "deleted saved food", currentUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

export const deleteUser = asyncHandler(
  async (req: Request & { user?: User }, res: Response) => {
    const currentUserId = req.user._id;
    try {
      const currentUser = await CredentialModel.deleteOne({
        _id: currentUserId.toString(),
      });

      res.status(200).json(currentUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);
