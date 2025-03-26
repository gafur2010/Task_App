import { useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "../tools/firebase.config";
import Select from "react-select";

interface User {
  value: string;
  label: string;
}

interface Task {
  id: string;
  name: string;
  whom: string;
  status: string;
  date: string;
}

const Admin = () => {
  const [taskName, setTaskName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getUsers();
    getTasks();
  }, []);

  function getUsers() {
    const data = ref(database, "users");
    onValue(data, (snapshot) => {
      const data = snapshot.val();
      const usersArr = Object.keys(data)
        .filter((key) => data[key].email !== "k@gmail.com")
        .map((key) => ({
          value: data[key].email,
          label: data[key].email,
        }));
      setUsers(usersArr);
    });
  }

  function getTasks() {
    const data = ref(database, "tasks");
    onValue(data, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksArr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(tasksArr);
      }
    });
  }

  function saveTask() {
    if (!taskName || !selectedUser) return;
    const tasksRef = ref(database, "tasks");
    push(tasksRef, {
      name: taskName,
      whom: selectedUser.value,
      status: "create",
      date: new Date().toLocaleString(),
    });
    setTaskName("");
    setSelectedUser(null);
  }

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <div className="d-flex gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <Select
          options={users}
          value={selectedUser}
          onChange={(option) => setSelectedUser(option)}
          placeholder="Select User"
          className="w-50"
        />
        <button className="btn btn-primary" onClick={saveTask}>
          Save
        </button>
      </div>

      <div className="d-flex justify-content-around mt-5">
        <div
          className="border border-2 w-25 d-flex flex-column align-items-center rounded-3 m-2 bg-primary"
          style={{ height: "600px" }}
        >
          <h1 className="text-white">Create</h1>
          {tasks.map((itm, i) =>
            itm.status === "create" ? (
              <div key={i} className="card m-4" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h4 className="card-subtitle mb-2 ">{itm.name}</h4>
                  <h6 className="card-title">Whom:{itm.whom}</h6>
                  <p className="card-text">{itm.date}</p>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>

        <div
          className="border border-2 w-25 d-flex flex-column align-items-center rounded-3 m-2 bg-warning"
          style={{ height: "600px" }}
        >
          <h1 className="text-white">In Progress</h1>
          {tasks.map((itm, i) =>
            itm.status === "inprogress" ? (
              <div key={i} className="card m-4" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h4 className="card-subtitle mb-2 text-body">{itm.name}</h4>
                  <h6 className="card-title">Whom:{itm.whom}</h6>
                  <p className="card-text">{itm.date}</p>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>

        <div
          className="border border-2 w-25 d-flex flex-column align-items-center rounded-3 m-2 bg-secondary"
          style={{ height: "600px" }}
        >
          <h1 className="text-white">Complete</h1>
          {tasks.map((itm, i) =>
            itm.status === "complete" ? (
              <div key={i} className="card m-4" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h4 className="card-subtitle mb-2 text-body">{itm.name}</h4>
                  <h6 className="card-title">Whom:{itm.whom}</h6>
                  <p className="card-text">{itm.date}</p>
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

export default Admin;
