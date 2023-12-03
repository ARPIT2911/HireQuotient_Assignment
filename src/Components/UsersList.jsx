import React, { useEffect, useState } from "react";
import "./UsersList.css";
import "antd/dist/antd.css";
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Pagination } from "antd";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [checkedRows, setcheckedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Pagination Start
  const [pageCount, setPageCount] = useState(0);
  // console.log("Page Count:", pageCount);

  const itemPerPage = 10;
  let pageVisited = pageCount * itemPerPage;

  const totalPages = Math.ceil(users.length / itemPerPage);
  const pageChange = ({ selected }) => {
    setPageCount(selected);
  };

  // pagination end

  useEffect(() => {
    getUsersDetails();
  }, []);
  const getUsersDetails = () => {
    fetch(
      `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
    )
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        // console.log(data);
      })
      // error
      .catch((err) => {
        console.log("Error:", err);
      });
  };

  // Delete User data onClick
  const deleteUser = (selectedUser) => {
    let userAfterDeletion = users.filter((user) => {
      return user.id !== selectedUser;
    });
    setUsers(userAfterDeletion);
  };
  const selectedRows = (rowId) => {
    // Check if the row is already selected
    if (checkedRows.includes(rowId)) {
      // If selected, remove it from the array
      setcheckedRows(checkedRows.filter(id => id !== rowId));
    } else {
      // If not selected, add it to the array
      setcheckedRows([...checkedRows, rowId]);
    }
  };
  const checkall = () => {
    // Toggle the selectAll state
    setSelectAll(!selectAll);
    // If selectAll is true, set selectedRows to all row IDs; otherwise, clear selectedRows
    setcheckedRows(selectAll ? [] : users.map(user => user.id));
  };
  const handledelete = ()=>{

    const updatedData = users.filter(user => !checkedRows.includes(user.id));
    setUsers(updatedData);
    // Clear selected rows after deletion
    setcheckedRows([]);
    // Also uncheck the "Select All" checkbox
    setSelectAll(false);

  }



  // Edit Data by Click
  const editUserDetails = () => {};
  console.log("PageVisited: ", pageVisited);
  return (
    <div className="container">
      <br />
      <input
        type="text"
        name="name"
        placeholder=" Search by any parameter "
        onChange={(e) => setSearchUser(e.target.value)}
      />

      <button onClick={handledelete}>
        Delete Selected
      <AiFillDelete color="red" />{" "}
      </button>

      <table className="table">
        <tr>
          <th>
            <span>Select all</span>
            <input type="checkbox" 
            onChange={() => checkall()}/>
          </th>
          <th>Name </th>
          <th>Email </th>
          <th> Role</th>
          <th>Action</th>
        </tr>

        {users
          //Search Data by Input
                                      
          .filter((user) => {
            if (searchUser === "") return user;
            else if (
              user.name.includes(searchUser) ||
              user.email.includes(searchUser) ||
              user.role.includes(searchUser)
            ) {
              return user;
            }
          })
          .slice(pageVisited, pageVisited + itemPerPage)
          .map((user) => (
            <tr key={user.id}
            style={{ backgroundColor: checkedRows.includes(user.id) ? 'lightgrey' : 'white' }}>
              <input
                type="checkbox"
                onChange={() => selectedRows(user.id)}
                checked={checkedRows.includes(user.id)}
              />

              <td> {user.name} </td>
              <td> {user.email} </td>
              <td> {user.role} </td>
              <td className="btn">
                <button onClick={editUserDetails}>
                  {" "}
                  <AiFillEdit />{" "}
                </button>
                <button onClick={() => deleteUser(user.id)}>
                  {" "}
                  <AiFillDelete color="red" />{" "}
                </button>
              </td>
            </tr>
          ))}
      </table>
      <br />
      <br />

      {/* pagination */}

      <ReactPaginate
        className="pagination"
        previousLabel={"Prev"}
        nextLabel={"Next"}
        pageCount={totalPages}
        onPageChange={pageChange}
        containerClassName={<Pagination />}
      />
    </div>
  );
}

export default UsersList;
