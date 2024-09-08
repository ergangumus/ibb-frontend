import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapLibreComponent = ({ carparks, onParkSelect, onMapClick }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=IW8VQdSALkdrgwGqtBmr",
        center: [28.9784, 41.0082],
        zoom: 9,
      });

      mapInstance.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        onMapClick(lng, lat);
      });
    }
  }, [onMapClick]);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    carparks.forEach((park) => {
      const match = park.location.match(/POINT \(([^)]+)\)/);
      if (match) {
        const coords = match[1].split(" ");
        const lng = parseFloat(coords[0]);
        const lat = parseFloat(coords[1]);

        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          const marker = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .setPopup(
              new maplibregl.Popup({ offset: 25, maxWidth: "350px" }).setHTML(
                `
                  <div style="padding: 10px; margin-top: -30px; font-family: Arial, sans-serif;">
                    <h4 style="margin-bottom: 10px; font-weight: bold; font-size: 18px;">
                      ${park.park_name}
                    </h4>
                    <div style="line-height: 1.6;">
                      <p style="margin: 5px 0;"><strong>Location Name:</strong> ${park.location_name}</p>
                      <p style="margin: 5px 0;"><strong>Park Type ID:</strong> ${park.park_type_id}</p>
                      <p style="margin: 5px 0;"><strong>Park Type Description:</strong> ${park.park_type_desc}</p>
                      <p style="margin: 5px 0;"><strong>Capacity:</strong> ${park.capacity_of_park}</p>
                      <p style="margin: 5px 0;"><strong>Working Time:</strong> ${park.working_time}</p>
                      <p style="margin: 5px 0;"><strong>County Name:</strong> ${park.county_name}</p>
                      <p style="margin: 5px 0;"><strong>Location:</strong> ${park.location}</p>
                    </div>
                  </div>
                  `
              )
            )
            .addTo(mapInstance.current);

          marker.getElement().addEventListener("click", () => {
            onParkSelect(park);
          });

          markersRef.current.push(marker);
        }
      } else {
        console.error(`Invalid location for park: ${park.park_name}`);
      }
    });
  }, [carparks, onParkSelect]);

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
};

export default MapLibreComponent;
