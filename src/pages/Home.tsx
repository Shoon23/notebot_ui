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
    <section className="h-[85vh] p-3 overflow-y-scroll flex flex-col  gap-10 items-center">
      <div className="flex gap-5 flex-col items-center lg:flex-row">
        <div className="card bg-neutral text-neutral-content ">
          <div className="card-body items-center text-center">
            <h2 className="card-title">{qoute}</h2>
          </div>
        </div>
        <div className="grid-cols-2 w-full  grid gap-3">
          <button className="btn  btn-primary">Create a Quiz</button>
          <button className="btn btn-secondary">Upload Notes</button>
          <button className="btn btn-accent">Progress</button>
          <button className="btn btn-info">Upload Notes</button>
        </div>
      </div>
      <div className=" flex flex-col lg:flex-row gap-5">
        <div className="flex gap-1 flex-col">
          <h1>Recent Quiz</h1>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((val) => {
              return (
                <div
                  key={val}
                  className=" btn btn-neutral h-16 flex flex-row justify-between text-neutral-content"
                >
                  <h2 className="card-title">Lorem</h2>
                  <h2 className="card-title">{val}/10</h2>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-1 flex-col">
          <h1>Recent Notes</h1>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map((val) => {
              return (
                <div
                  key={val}
                  className="btn btn-neutral h-16 flex flex-row justify-between text-neutral-content w-96"
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
