import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { UserProfile } from "../../components";
import { getUsers, deleteUser } from "./service";
import AddUserModal from "./add-user-modal/add-user-modal";
import EditUserModal from "./edit-user-modal/edit-user-modal";
import { UserModel } from "./interface";

const Administration = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | string>("checking");
  const [openAdd, setOpenAdd] = useState(false);
  const [editUser, setEditUser] = useState<UserModel | null>(null);

  const fetchUsers = async () => {
    const response = await getUsers();
    if (response !== "Not Admin") {
      setUsers(response);
      setIsAdmin(true);
    } else {
      setUsers([]);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await deleteUser({ id });
    fetchUsers();
  };

  return (
    <div>
      {isAdmin === "checking" ? (
        <p>Verifying Admin...</p>
      ) : isAdmin ? (
        <>
          <Button
            variant="contained"
            sx={{ mb: 3, ml: 4, mt: 2 }}
            onClick={() => setOpenAdd(true)}
          >
            Add User
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 2.5,
              padding: "0 2rem 2rem 2rem",
              alignItems: "stretch"
            }}
          >
            {users?.map((user) => (
              <UserProfile
                key={user._id}
                id={user._id!}
                email={user.email!}
                role={user.role!}
                dateRegistered={user.dateRegistered}
                ipAddress={user.ipAddress}
                onEdit={() => setEditUser(user)}
                onDelete={() => handleDeleteUser(user._id!)}
              />
            ))}
          </Box>

          <AddUserModal
            open={openAdd}
            setOpen={setOpenAdd}
            onUserAdded={fetchUsers}
          />

          <EditUserModal
            open={!!editUser}
            setOpen={(open: boolean) => !open && setEditUser(null)}
            user={editUser}
            onUpdate={fetchUsers}
          />
        </>
      ) : (
        <p>Access Denied, Please Use an Admin Account</p>
      )}
    </div>
  );
};

export default Administration;