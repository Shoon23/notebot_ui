import { useMutation, useMutationState } from "@tanstack/react-query";
import useUserSession from "../hooks/useUserSession";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  // const user = useUserSession();
  const [qoute, setQoute] = useState("");
  useEffect(() => {
    const get_qoutes = () => {};
    fetch("https://gomezmig03.github.io/MotivationalAPI/en.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to retrieve data from the server.");
        }
        return response.json();
      })
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * data.length);
        const phrase = data[randomIndex].phrase;
        const author = data[randomIndex].author;
        setQoute(`"${phrase}" - ${author}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    get_qoutes();
  });
  return (
    <section className="bg-neutral h-[87vh] p-3 overflow-y-scroll flex flex-col items-center ">
      <div className="flex  flex-col items-center lg:flex-row">
        <div className="mb-5 card bg-base-content text-neutral-content">
          <div className="card-body items-center text-center">
            <h2 className="card-title -">{qoute}</h2>
          </div>
        </div>
        <div className="mb-5 grid-cols-2 w-full grid text-white">
          <button className="btn bg-red-500 rounded-md m-1 h-16 text-neutral-content border-none">
            Create a Quiz
          </button>
          <button className="btn bg-green-500 rounded-md  m-1 h-16 text-neutral-content border-none">
            Upload Notes
          </button>
          <button className="btn bg-blue-500 rounded-md  m-1 h-16 text-neutral-content border-none">
            Progress
          </button>
          <button className="btn bg-orange-500 rounded-md m-1 h-16 text-neutral-content border-none">
            Upload Notes
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 ">
        <div className="flex mb-1 flex-col">
          <h1 className="text-white">Recent Quiz</h1>
          <div className="flex flex-col ">
            {[1, 2, 3, 4, 5].map((val) => {
              return (
                <div
                  key={val}
                  className="border-none mb-2 btn bg-base-content text-neutral-content h-16 flex flex-row justify-between "
                >
                  <h2 className="card-title">Lorem</h2>
                  <h2 className="card-title">{val}/10</h2>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex mb-1 flex-col">
          <h1 className="text-white mb-2">Recent Notes</h1>
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((val) => {
              return (
                <div
                  key={val}
                  className="border-none mb-2 btn bg-base-content text-neutral-content h-16 flex flex-row justify-between w-96"
                >
                  <h2 className="card-title">Lorem</h2>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
