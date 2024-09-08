import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "../assets/Ibb_amblem.png";

import MapLibreComponent from "./MapLibreComponent";
import CreateParkDialog from "./CreateParkDialog";
import EditParkDialog from "./EditParkDialog";

import { fetchCarparks } from "../services/carparkService";

const Home = () => {
  const [carparks, setCarparks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPark, setSelectedPark] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [newPark, setNewPark] = useState({
    name: "",
    capacity: "",
    working_time: "",
    location_name: "",
    park_type_id: "",
    park_type_desc: "",
    county_name: "",
  });

  const [newParkLocation, setNewParkLocation] = useState(null);
  const [editPark, setEditPark] = useState({
    name: "",
    capacity: "",
    working_time: "",
    park_type_id: "",
    county_name: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadCarparks = useCallback(async () => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      const data = await fetchCarparks(accessToken);
      setCarparks(data);
    } catch (err) {
      setError("Failed to load carparks data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMapClick = (lng, lat) => {
    const isParkExist = carparks.some((park) => {
      const match = park.location.match(/POINT \(([^)]+)\)/);
      if (match) {
        const coords = match[1].split(" ");
        const parkLng = parseFloat(coords[0]);
        const parkLat = parseFloat(coords[1]);

        const distance = Math.sqrt((lng - parkLng) ** 2 + (lat - parkLat) ** 2);
        return distance < 0.001;
      }
      return false;
    });

    if (!isParkExist) {
      setNewParkLocation({ lng, lat });
      setOpenDialog(true);
    } else {
      console.log("Park already exists at this location.");
    }
  };

  const handleDelete = async (parkId) => {
    const confirmDelete = window.confirm(
      "Bu parkı silmek istediğinizden emin misiniz?"
    );
    if (!confirmDelete) return;

    const accessToken = window.localStorage.getItem("accessToken");

    try {
      await axios.delete(
        `http://localhost:8000/api/carpark/delete/${parkId}/`,
        {
          headers: { Authorization: "Token " + accessToken },
        }
      );

      loadCarparks();
      setSnackbar({
        open: true,
        message: "Park başarıyla silindi",
        severity: "success",
      });
    } catch (error) {
      console.error("Park silinirken hata oluştu:", error);
      setSnackbar({
        open: true,
        message: "Park silinirken hata oluştu",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ open: false, message: "", severity: "success" });

  useEffect(() => {
    loadCarparks();
  }, [loadCarparks]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "40px", marginRight: "10px" }}
          />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            İspark Car Park Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={6} style={{ padding: "20px" }}>

        {selectedPark && (
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {selectedPark.park_name}
                  </Typography>
                }
                action={
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "8px" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => setOpenEditDialog(true)}
                      sx={{ textTransform: "none" }}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(selectedPark.id)}
                      sx={{ textTransform: "none" }}
                    >
                      Sil
                    </Button>
                  </div>
                }
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: 2,
                  borderBottom: "1px solid #e0e0e0",
                }}
              />
              <CardContent sx={{ padding: 3, mt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <b>Capacity : </b> {selectedPark.capacity_of_park}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Working Time : </b> {selectedPark.working_time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>County : </b> {selectedPark.county_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      <b>Park Type : </b> {selectedPark.park_type_desc}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Location : </b> {selectedPark.location_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Coordinates : </b> {selectedPark.location}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <MapLibreComponent
                carparks={carparks}
                onParkSelect={setSelectedPark}
                onMapClick={handleMapClick}
              />
            </CardContent>
          </Card>
        </Grid>

        <EditParkDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          selectedPark={selectedPark}
          editPark={editPark}
          setEditPark={setEditPark}
          loadCarparks={loadCarparks}
        />

        <CreateParkDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          newPark={newPark}
          setNewPark={setNewPark}
          newParkLocation={newParkLocation}
          loadCarparks={loadCarparks}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Grid>
    </>
  );
};

export default Home;
