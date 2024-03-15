import React, { useState, useEffect } from "react";
import { CurrentUser, MacroTarget } from "../data/data-types";
import TargetsInput from "../custom-components/another-input";
import { postCurrentUserInfo } from "../hooks/userGetUserFoods";

const ModifyTargets: React.FC<{
  queryResult: CurrentUser | null | undefined;
  refetch: any;
  isLoading: boolean;
}> = ({ queryResult, refetch, isLoading }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [calorieTarget, setCalorieTarget] = useState<number | undefined>(10);
  const [proteinTarget, setProteinTarget] = useState<number | undefined>(0);
  const [carbsTarget, setCarbsTarget] = useState<number | undefined>(0);
  const [fatsTarget, setFatsTarget] = useState<number | undefined>(0);
  const [macroTarget, setMacroTarget] = useState();

  useEffect(() => {
    setCalorieTarget(queryResult?.macroTarget.calories);
    setProteinTarget(queryResult?.macroTarget.protein);
    setFatsTarget(queryResult?.macroTarget.fats);
    setCarbsTarget(queryResult?.macroTarget.carbs);
  }, [queryResult]);

  const isEmpty = (obj: Record<string, any>) => {
    return Object.keys(obj).length === 0;
  };

  const submitModified = async () => {
    const obj: MacroTarget = {};

    // if (queryResult?.macroTarget.calories !== calorieTarget)
      obj.calories = calorieTarget;
    // if (queryResult?.macroTarget.protein !== proteinTarget)
      obj.protein = proteinTarget;
    // if (queryResult?.macroTarget.carbs !== carbsTarget) 
    obj.carbs = carbsTarget;
    // if (queryResult?.macroTarget.fats !== fatsTarget) 
    obj.fats = fatsTarget;

    if (isEmpty(obj)) return;
    console.log("obj",obj)


    await postCurrentUserInfo(obj);
    setIsEdit(false);
    refetch();
  };

  return (
    <div className="ml-5 border border-black  ">
      <h3>Current Nutrition Targets</h3>
      {!isEdit ? (
        <>
          <div className="mt-5">
            <div className="mt-3">
              Calories: <span>{queryResult?.macroTarget.calories ?? "-"}</span>
            </div>
            <div className="mt-3">
              Protein: <span>{queryResult?.macroTarget.protein ?? "-"}</span>
            </div>
            <div className="mt-3">
              Carbs: <span>{queryResult?.macroTarget.carbs ?? "-"}</span>
            </div>
            <div className="mt-3">
              Fats: <span>{queryResult?.macroTarget.fats ?? "-"}</span>{" "}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-5">
            <div className="mt-3">
              Calories:
              <TargetsInput
                styles="inline-block"
                placeholder={
                  "current: " + queryResult?.macroTarget.calories ?? "-"
                }
                value={calorieTarget}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCalorieTarget(Number(e.target.value))
                }
              />
            </div>
            <div className="mt-3">
              Protein:
              <TargetsInput
                styles="inline-block"
                placeholder={
                  "current: " + queryResult?.macroTarget.protein ?? "-"
                }
                value={proteinTarget}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProteinTarget(Number(e.target.value))
                }
              />
            </div>
            <div className="mt-3">
              Carbs:
              <TargetsInput
                styles="inline-block "
                placeholder={
                  "current: " + (queryResult?.macroTarget.carbs ?? "-")
                }
                value={carbsTarget ?? "-"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCarbsTarget(Number(e.target.value))
                }
              />
            </div>
            <div className="mt-3">
              Fats:
              <TargetsInput
                styles="inline-block "
                placeholder={
                  "current: " + (queryResult?.macroTarget.fats ?? "-")
                }
                value={fatsTarget ?? "-"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFatsTarget(Number(e.target.value))
                }
              />
            </div>
          </div>
        </>
      )}

      <div className="flex">
        {!isEdit ? (
          <>
            <button onClick={() => setIsEdit(true)} className="mx-auto mt-3">
              Edit
            </button>
          </>
        ) : (
          <>
            <button onClick={submitModified} className="mx-auto mt-3">
              Save
            </button>
            <button onClick={() => setIsEdit(false)} className="mx-auto mt-3">
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModifyTargets;
