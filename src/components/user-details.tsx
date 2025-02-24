import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { useUser } from "../hooks/user";
import { useAuth } from "../contexts/auth";

const UserDetails: React.FC = () => {
  const { user, updateUser, isLoading } = useUser();
  const { logout } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", _id: "" });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    }
  }, [user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditMode(false);
    updateUser(formData);
  };

  if (isLoading) return <div>Loading User...</div>;

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
      }}
    >
      <Avatar
        src={user?.imageUrl}
        alt="User Avatar"
        sx={{
          width: "200px",
          height: "200px",
          margin: "0 auto",
        }}
      />
      {editMode ? (
        <TextField
          onChange={handleNameChange}
          name="name"
          value={formData?.name}
        ></TextField>
      ) : (
        <Typography variant="h6" sx={{ margin: "10px" }}>
          {formData?.name}
        </Typography>
      )}
      <Stack direction="row" justifyContent="center">
        <IconButton sx={{ margin: "10px" }} onClick={() => logout()}>
          {/* TODO Navigate on logout */}
          <LogoutIcon color="warning" />
        </IconButton>
        {editMode ? (
          <IconButton sx={{ margin: "10px" }} onClick={(e) => handleSubmit(e)}>
            <SaveIcon color="success" />
          </IconButton>
        ) : (
          <IconButton sx={{ margin: "10px" }} onClick={() => setEditMode(true)}>
            <EditIcon color="info" />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
};

export default UserDetails;
