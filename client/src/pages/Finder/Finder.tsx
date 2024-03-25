import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import { LatLng, LatLngExpression } from "leaflet";
import styles from "./Finder.module.scss";
import Button from "../../components/atomic/Button/Button";

const Finder = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const apiKey = import.meta.env.VITE_REACT_APP_GEOCODING_API_KEY;

  const [city, setCity] = useState<string>("");

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleCitySearch = async () => {
    try {
      const response = await axios.get(
        `https://geocode.maps.co/search?q=${city}&api_key=${apiKey}`
      );
      const { lat, lon } = response.data[0];
      setPosition([lat, lon]);
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
    }
  };

  console.log("pozycja miasta", position);

  const defaultPosition: LatLngExpression = [52.22977, 21.01178];

  return (
    <section className={styles.finder}>
      <PlatformWrapper>
        <MaxWidthWrapper>
          <div>
            <div className={styles.finder__input}>
              <input
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="Wpisz nazwę miejscowości"
              />
              <button onClick={handleCitySearch}>Szukaj</button>
            </div>
            <MapContainer
              key={position ? position.toString() : "default"} // Add key prop here
              center={position || defaultPosition}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100vh", zIndex: 0 }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {position && (
                <Marker position={position}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
              {/* Tutaj możesz oznaczyć obiekty sportowe */}
            </MapContainer>
          </div>
        </MaxWidthWrapper>
      </PlatformWrapper>
    </section>
  );
};

export default Finder;
