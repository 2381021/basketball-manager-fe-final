import { UseMutateFunction } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface PlayerFormProps {
  isEdit: boolean;
  mutateFn: UseMutateFunction<any, Error, PlayerFormInput, unknown>;
  defaultInputData?: PlayerFormInput;
}

export type PlayerFormInput = {
  name: string;
  position: string;
  speciality: string;
};

const PlayerForm: React.FC<PlayerFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PlayerFormInput>();

  useEffect(() => {
    if (props.defaultInputData) {
      setValue("name", props.defaultInputData.name);
      setValue("position", props.defaultInputData.position);
      setValue("speciality", props.defaultInputData.speciality);
    }
  }, [props.defaultInputData]);

  const onSubmit: SubmitHandler<PlayerFormInput> = (data) => {
    if (props.isEdit) {
      if (!confirm("Are you sure you want to update player data?")) {
        return;
      }
    }
    props.mutateFn(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Name</label>
        <input
          type="text"
          id="name"
          className={
            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
            (errors.name && "border-red-500")
          }
          placeholder="Player Name"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <p className="text-red-600 text-xs italic" id="nameError">
            Name is required.
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Position</label>
        <input
          type="text"
          id="position"
          className={
            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
            (errors.position && "border-red-500")
          }
          placeholder="Player Position"
          {...register("position", { required: true })}
        />
        {errors.position && (
          <p className="text-red-600 text-xs italic" id="positionError">
            Position is required.
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Speciality</label>
        <input
          type="text"
          id="speciality"
          className={
            "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
            (errors.speciality && "border-red-500")
          }
          placeholder="Player Speciality"
          {...register("speciality", { required: true })}
        />
        {errors.speciality && (
          <p className="text-red-600 text-xs italic" id="specialityError">
            Speciality is required.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        {props.isEdit ? (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Player
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Player
          </button>
        )}
      </div>
    </form>
  );
};

export default PlayerForm; 