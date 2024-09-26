import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import BottomNavigation from "../components/layouts/MobileNavigation";
import Navbar from "../components/layouts/WebNavigation";

const Home: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col  gap-10 items-center">
      <div className="flex gap-5 flex-col lg:flex-row">
        <div className="card bg-neutral text-neutral-content w-96 h-64">
          <div className="card-body items-center text-center">
            <h2 className="card-title">
              "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit
              quam error, natus, totam sequi amet aliquam dolorum aperiam animi,
              dolorem eaque? Nam eaque consequuntur numquam nulla incidunt vel,
              in facere.!"
            </h2>
          </div>
        </div>
        <div className="card bg-neutral text-neutral-content w-96 h-64">
          <figure className="px-10 pt-10">
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
              className="rounded-xl"
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Streak!</h2>
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="flex gap-1 flex-col">
          <h1>Recent Quiz</h1>
          <div className="flex flex-col gap-2">
            <div className="btn btn-neutral h-16 flex flex-row justify-between text-neutral-content w-96">
              <h2 className="card-title">Lorem</h2>
              <h2 className="card-title">5/10</h2>
            </div>
            <div className="btn btn-neutral h-16 flex flex-row justify-between text-neutral-content w-96">
              <h2 className="card-title">Lorem</h2>
              <h2 className="card-title">9/10</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
