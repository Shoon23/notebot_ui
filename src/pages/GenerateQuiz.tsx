import React from "react";
import Input from "../components/Input";
import SearchInput from "../components/SearchInput";

const GenerateQuiz: React.FC = () => {
  return (
    <section className="px-3 h-[87vh] bg-neutral py-3">
      <form className="space-y-3">
        <Input type="text" placeholder="Quiz Name" />
        <button
          onClick={(e) => {
            e.preventDefault();
            (document.getElementById("my_modal_3") as any)?.showModal();
          }}
          className="bg-base-content text-neutral-content btn w-full border-none justify-start"
        >
          Choose Note
        </button>
        <dialog id="my_modal_3" className="modal ">
          <div className="modal-box bg-neutral text-neutral-content">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-3">Notes</h3>
            <div className="flex flex-col">
              {" "}
              <SearchInput />
            </div>
          </div>
        </dialog>
        <select className="select select-bordered w-full bg-base-content text-neutral-content">
          <option
            className="text-neutral-content bg-base-content border-none"
            disabled
            selected
          >
            Difficulty
          </option>
          <option className="">Easy</option>
        </select>{" "}
        <select className="select select-bordered w-full bg-base-content text-neutral-content">
          <option disabled selected>
            Question Type
          </option>
        </select>
        <select className="select select-bordered w-full bg-base-content text-neutral-content">
          <option disabled selected>
            BLOOMS Level
          </option>
        </select>
        <button className="btn btn-warning w-full">Generate</button>
      </form>
    </section>
  );
};

export default GenerateQuiz;
