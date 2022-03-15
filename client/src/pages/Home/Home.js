import React, { useRef } from "react";
import { AuthContext } from "../../App";
import { logout } from "../../auth/action";
import { useAlert } from "react-alert";
import "./Home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import { FiEdit3 } from "react-icons/fi";
import { BiAddToQueue } from "react-icons/bi";
import csc from "country-state-city";
import Smallspinner from "../../components/Smallspinner";
/**************************************************8 */

const Home = () => {
  const { auth, dispatch } = React.useContext(AuthContext);
  const alert = useAlert();
  const [list, setList] = useState([]);
  const ref = useRef(null);

  const [isEditPage, setIsEditPage] = useState(false);
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [pincode, setPincode] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  //  ************************* Fetching list of condidates ******************************//
  useEffect(() => {
    async function fetchList() {
      try {
        const { data } = await axios.get("/api/condidates/get/all");
        if (data.success) {
          setList(data.condidates);
        }
      } catch (error) {
        alert.error(error.response.data.error);
      }
    }
    fetchList();
  },[]);

  //  ************************* Logout ******************************//

  function clearAll(params) {
    setName("");
    setState("");
    setDob("");
    setPincode("");
    setAdress("");
    setEmail("");
    setStatus("");
    setAge("");
  }

  /***************************************************************************** */

  function validateEmail() {
    const validated = email.match(/[a-zA-z0-9](@gmail.com)$/);
    return validated;
  }

  /***************************************************************************** */

  function validateDetails() {
    setName(String(name).trim());
    setAdress(String(adress).trim());
    setState(String(state).trim());
    setStatus(String(status).trim());
    setAge(String(age).trim());
    setPincode(String(pincode).trim());
    console.log(
      name.length < 3,
      adress.length < 20,
      state.length === 0,
      age.length === 0,
      pincode.length !== 6,
      dob.length === 0
    );
    console.log();
    if (
      name.length < 3 ||
      adress.length < 20 ||
      state.length === 0 ||
      status.length === 0 ||
      age.length === 0 ||
      pincode.length !== 6 ||
      dob.length === 0
    ) {
      return false;
    }
    return true;
  }
  /***************************************************************************** */

  async function handleBothCreateAndEdit(e) {
    e.preventDefault();
    ref.current.disabled = true;

    const detailsValidated = validateDetails();
    const emailValidated = validateEmail();
    if (!detailsValidated || !emailValidated) {
      alert.error("Some fields are not filled in proper manner");
      ref.current.disabled=false;
      return;
    }
    const config = { headers: { "Content-Type": "application/json" } };
    const details = {
      name,
      email,
      dob,
      adress,
      status,
      state,
      age,
      pincode,
    };
    try {
      if (isEditPage) {
        const { data } = await axios.put(
          `/api/condidates/update`,
          details,
          config
        );
        if (data.success) {
          setList(data.condidates);
        }
      } else {
        const { data } = await axios.post(
          `/api/condidates/create`,
          details,
          config
        );
        if (data.success) {
          setList(data.condidates);
        }
      }
      setIsEditPage(false);
      hideCreateCondidate();
      clearAll();
      ref.current.disabled = false;
    } catch (error) {
      ref.current.disabled = false;
      alert.error(error.response.data.error);
    }
  }
  /***************************************************************************************8 */

  async function onEditClick(e, condidate) {
    showCreateCondidate(e);
    setIsEditPage(true);

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `/api/condidates/detail`,
        {
          email: condidate.email,
        },
        config
      );
      if (data.success) {
        const condidateDetails = data.condidate;
        setName(condidateDetails.name);
        setAdress(condidateDetails.adress);
        setAge(String(condidateDetails.age));
        setPincode(String(condidateDetails.pincode));
        setState(condidateDetails.state);
        setEmail(condidateDetails.email);
        setStatus(condidateDetails.status);
      }
    } catch (error) {
      console.log("The error is " + error);
      alert.error(error.response.data.error);
    }
  }
  /***************************************************************************************8 */
  async function onDeleteClick(e,condidate) {
    try {
      e.preventDefault();
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.delete(
        `/api/condidates/${condidate.email}`,
        config
      );
      if (data.success) {
        setList(data.condidates);
      }
    } catch (error) {
      alert.error(error.response.data.error);
    }
  }

  function onCancel(e) {
    e.preventDefault();
    clearAll();
    hideCreateCondidate();
    setIsEditPage(false);
  }
  /***************************************************************************** */
  function hideCreateCondidate() {
    const addcondidate = document.querySelector(".add-condidate");
    addcondidate.classList.add("hidden");
    clearAll();
  }
  /***************************************************************************** */

  function showCreateCondidate(e) {
    e.preventDefault();
    const addcondidate = document.querySelector(".add-condidate");
    addcondidate.classList.remove("hidden");
  }
  /***************************************************************************** */

  async function handleLogout(e) {
    e.preventDefault();
    const data = await logout(dispatch);
    if (!data.success) {
      alert.error(data.error);
    }
  }

  /*********************************************** */
  return (
    <div className="homepage">
      <div className="logout">
        <p onClick={handleLogout}>Log Out</p>
      </div>
      <h3>Condidate List :{Array.from(list).length}</h3>
      <div className="condidate-list">
        <div className="condidate-list-header">
          <p></p>
          <p>Name</p>
          <p>Date of Birth </p>
          <p>Email</p>
          <p>Result</p>
        </div>

        <div className="condidate-list-row-container">
          {auth.loading ? (
            <Smallspinner />
          ) : (
            list.map((item, index) => (
              <div key={index} className="condidate-list-row">
                <p>{index + 1}</p>
                <p>{item.name}</p>
                <p>{item.dob}</p>
                <p>{item.email}</p>
                <p className="condidate-icons">
                  <span>{item.status}</span>
                  <IoMdArrowDropdown
                    style={{ fontSize: "32px", color: "gray" }}
                  />
                  <span>
                    <FiEdit3
                      className="icons"
                      onClick={(e) => onEditClick(e, item)}
                    />
                    <AiOutlineDelete
                      className="icons"
                      onClick={(e) => onDeleteClick(e, item)}
                    />
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="add-condidate-button">
        <BiAddToQueue className="icons" />
        <span onClick={showCreateCondidate}>Add New Condidate</span>
      </div>
      <div className="add-condidate hidden">
        <form>
          <h1>Create Condidate</h1>

          <div>
            <div>
              <p>Name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter  name"
              />
            </div>
            <div>
              <p>Email</p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter  Email"
              />
            </div>
          </div>
          <div>
            <div>
              <p>Status</p>
              <select onChange={(e) => setStatus(e.target.value)}>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <p>Adress</p>
              <input
                type="text"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
                placeholder="Enter  address in min 20 chars"
              />
            </div>
          </div>
          <div>
            <div>
              <p>Date Of Birth</p>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value.toString())}
                placeholder="Enter  Date of birth"
              />
            </div>
            <div>
              <p>State</p>
              <select onChange={(e) => setState(e.target.value)}>
                <option>Select state</option>
                {csc.getStatesOfCountry("101").map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div>
              <p>Age</p>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter  age"
              />
            </div>
            <div>
              <p>Pincode</p>
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                type="number"
                placeholder="Enter  Pincode"
              />
            </div>
          </div>
          <div className="buttonContainer">
            <button onClick={onCancel}>Cancel</button>
            <button ref={ref} onClick={handleBothCreateAndEdit}>
              {isEditPage ? "Edit" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
