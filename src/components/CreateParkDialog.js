import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const CreateParkDialog = ({
  open,
  onClose,
  newPark,
  setNewPark,
  newParkLocation,
  loadCarparks,
}) => {
  const handleCreateCarpark = async () => {
    if (!validateCarparkForm()) return;

    const accessToken = window.localStorage.getItem("accessToken");

    const newCarpark = {
      park_name: newPark.name,
      location_name: newPark.location_name,
      park_type_id: newPark.park_type_id,
      park_type_desc: newPark.park_type_desc,
      capacity_of_park: parseInt(newPark.capacity, 10),
      working_time: newPark.working_time,
      county_name: newPark.county_name,
      location: `SRID=4326;POINT(${newParkLocation.lng} ${newParkLocation.lat})`,
    };

    try {
      await axios.post(
        "http://localhost:8000/api/carpark/create/",
        newCarpark,
        {
          headers: { Authorization: "Token " + accessToken },
        }
      );
      onClose();
      loadCarparks();
    } catch (error) {
      console.error("Error creating car park:", error);
    }
  };

  const validateCarparkForm = () => {
    if (
      !newPark.name ||
      !newPark.capacity ||
      !newPark.working_time ||
      !newPark.location_name ||
      !newPark.park_type_id ||
      !newPark.park_type_desc ||
      !newPark.county_name
    ) {
      alert("All fields are required!");
      return false;
    }
    if (isNaN(newPark.capacity) || parseInt(newPark.capacity, 10) <= 0) {
      alert("Capacity must be a positive number.");
      return false;
    }
    return true;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Park</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Park Name"
          fullWidth
          value={newPark.name}
          onChange={(e) => setNewPark({ ...newPark, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Location Name"
          fullWidth
          value={newPark.location_name}
          onChange={(e) =>
            setNewPark({ ...newPark, location_name: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Park Type ID"
          fullWidth
          value={newPark.park_type_id}
          onChange={(e) =>
            setNewPark({ ...newPark, park_type_id: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Park Type Description"
          fullWidth
          value={newPark.park_type_desc}
          onChange={(e) =>
            setNewPark({ ...newPark, park_type_desc: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Capacity"
          fullWidth
          value={newPark.capacity}
          onChange={(e) => setNewPark({ ...newPark, capacity: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Working Time"
          fullWidth
          value={newPark.working_time}
          onChange={(e) =>
            setNewPark({ ...newPark, working_time: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="County Name"
          fullWidth
          value={newPark.county_name}
          onChange={(e) =>
            setNewPark({ ...newPark, county_name: e.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateCarpark}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateParkDialog;
