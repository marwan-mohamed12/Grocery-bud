import { useState } from "react";
import Alert from "./Alert";
import List from "./List";
import { nanoid } from "nanoid";
import { ToastContainer, toast, Slide } from "react-toastify";

const getLocalStorage = () => {
    let list = localStorage.getItem("list");
    if (list) {
        return JSON.parse(list);
    } else {
        return [];
    }
};

function App() {
    const [name, setName] = useState("");
    const [list, setList] = useState(getLocalStorage);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [alert, setAlert] = useState({
        show: false,
        msg: "",
        type: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            //show alert
            // showAlert(true, "danger", "Please enter value!");
            toast.error("Please enter value!");
        } else if (name && isEditing) {
            //edit the value
            setList(
                list.map((item) => {
                    if (item.id === editId) {
                        return { ...item, title: name };
                    }
                    return item;
                })
            );
            setName("");
            setEditId(null);
            setIsEditing(false);
            // showAlert(true, "success", "Value Changed");
            toast.success("Value changed");
        } else {
            // show alert
            // showAlert(true, "success", "Item added to the list");
            const newItem = { id: nanoid(), title: name };
            setList([...list, newItem]);
            setName("");
            toast.success("Item added to the list");
        }
    };

    const showAlert = (show = false, type = "", msg = "") => {
        setAlert({ show, type, msg });
    };

    const clearitems = () => {
        // showAlert(true, "danger", "Empty the list");
        setList([]);
        toast.error("Empty the list");
    };

    const deleteItem = (id) => {
        // showAlert(true, "danger", "Item removed");
        setList(list.filter((item) => item.id !== id));
        toast.error("Item removed");
    };

    const editItem = (id) => {
        const specficItem = list.find((item) => item.id === id);
        setIsEditing(true);
        setEditId(id);
        setName(specficItem.title);
    };

    localStorage.setItem("list", JSON.stringify(list));

    return (
        <section className="section-center">
            <form className="grocery-form" onSubmit={handleSubmit}>
                {alert.show && (
                    <Alert {...alert} removeAlert={showAlert} list={list} />
                )}
                <h3>grocery bud</h3>
                <div className="form-control">
                    <input
                        type="text"
                        className="grocery"
                        placeholder="e.g. eggs"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button type="submit" className="submit-btn">
                        {isEditing ? "edit" : "submit"}
                    </button>
                </div>
            </form>

            {list.length > 0 && (
                <div className="grocery-container">
                    <List
                        items={list}
                        deleteItem={deleteItem}
                        editItem={editItem}
                    />
                    <button className="clear-btn" onClick={clearitems}>
                        clear items
                    </button>
                </div>
            )}

            <ToastContainer
                position="top-center"
                autoClose={1500}
                transition={Slide}
            />
        </section>
    );
}

export default App;
