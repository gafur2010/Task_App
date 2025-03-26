import { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { database } from "../tools/firebase.config";

interface Tasks {
  id: string;
  name: string;
  status: string;
  whom: string;
  date: string;
}

const Home = () => {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  useEffect(() => {
    getTasks();
  }, []);
  function getTasks() {
    const data = ref(database, "tasks");
    onValue(data, (snapshot) => {
      const data = snapshot.val();
      const usersArr = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      console.log(usersArr);
      setTasks(usersArr);
    });
  }

  function changeRight(itm: Tasks) {
    const oneDoc = ref(database, `tasks/${itm.id}`);
    if (itm.status === "create") {
      update(oneDoc, { ...itm, status: "inprogress" });
    } else if (itm.status === "inprogress") {
      update(oneDoc, { ...itm, status: "complete" });
    } else {
      remove(oneDoc);
    }
  }
  function changeLeft(itm: Tasks) {
    const oneDoc = ref(database, `tasks/${itm.id}`);
    if (itm.status === "complete") {
      update(oneDoc, { ...itm, status: "inprogress" });
    }
    if (itm.status === "inprogress") {
      update(oneDoc, { ...itm, status: "create" });
    }
    if (itm.status === "completed") {
      remove(oneDoc);
    }
  }

  return (
    <div className="d-flex justify-content-around mt-5 ">
      <div
        className="border border-2 w-25 d-flex flex-column align-items-center rounded-3 m-2 bg-primary"
        style={{ height: "600px" }}
      >
        <h1>Create</h1>
        <div className="overflow-y-auto">
          {tasks.map((itm, i) =>
            itm.status === "create" ? (
              <div key={i} className="card m-4" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h4 className="card-subtitle mb-2 ">{itm.name}</h4>
                  <h6 className="card-title">Whom:{itm.whom}</h6>
                  <p className="card-text">{itm.date}</p>
                  <button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "20px",
                    }}
                    onClick={() => changeRight(itm)}
                    className="btn btn-success"
                  >
                    ↻
                  </button>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
      <div
        className="border border-2 w-25 d-flex flex-column align-items-center rounded-3 m-2 bg-warning"
        style={{ height: "600px" }}
      >
        <h1>Inprogress</h1>
        <div className="overflow-y-auto">
          {tasks.map((itm, i) =>
            itm.status === "inprogress" ? (
              <div key={i} className="card m-4" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h4 className="card-subtitle mb-2 text-body">{itm.name}</h4>
                  <h6 className="card-title">Whom:{itm.whom}</h6>
                  <p className="card-text">{itm.date}</p>
                  <button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "60px",
                    }}
                    onClick={() => changeLeft(itm)}
                    className="btn btn-success"
                  >
                    ↺
                  </button>
                  <button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "20px",
                    }}
                    onClick={() => changeRight(itm)}
                    className="btn btn-success"
                  >
                    ↻
                  </button>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
      <div
        className="border border-2 w-25 d-flex flex-column align-items-center rounded-3 m-2 bg-secondary"
        style={{ height: "600px" }}
      >
        <h1>Complete</h1>
        <div className="overflow-y-auto">
          {tasks.map((itm, i) =>
            itm.status === "complete" ? (
              <div key={i} className="card m-4" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h4 className="card-subtitle mb-2 text-body">{itm.name}</h4>
                  <h6 className="card-title">Whom:{itm.whom}</h6>
                  <p className="card-text">{itm.date}</p>
                  <button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "70px",
                    }}
                    onClick={() => changeLeft(itm)}
                    className="btn btn-success"
                  >
                    ↺
                  </button>
                  <button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "20px",
                    }}
                    onClick={() => changeRight(itm)}
                    className="btn btn-success"
                  >
                    ✔️
                  </button>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
