const Home: React.FC = () => {
  return (
    <section className="h-[80vh] p-3 overflow-y-scroll flex flex-col  gap-10 items-center">
      <div className="flex gap-5 flex-col items-center lg:flex-row">
        <div className="card bg-neutral text-neutral-content h-64">
          <div className="card-body items-center text-center">
            <h2 className="card-title">
              "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit
              quam error, natus, totam sequi amet aliquam dolorum aperiam animi,
              dolorem eaque? Nam eaque consequuntur numquam nulla incidunt vel,
              in facere.!"
            </h2>
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
