import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import { LatLngExpression } from "leaflet";
import styles from "./Finder.module.scss";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";

const Finder = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [sportsFacilities, setSportsFacilities] = useState<any[]>([]);
  const apiKey = import.meta.env.VITE_REACT_APP_GEOCODING_API_KEY;

  const [city, setCity] = useState<string>("");

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleCitySearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${city}&format=json`
      );

      if (response.data.length === 0) {
        throw new Error("City not found");
      }

      const { lat, lon } = response.data[0];
      setPosition([lat, lon]);

      const overpassResponse = await axios.get(
        `https://overpass-api.de/api/interpreter?data=[out:json];node(around:10000,${lat},${lon})["leisure"="fitness_centre"];out;`
      );

      const facilities = overpassResponse.data.elements;
      setSportsFacilities(facilities);

      // Log the sportsFacilities array
      console.log("Sports Facilities:", facilities);
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
    }
  };

  const defaultPosition: LatLngExpression = [52.22977, 21.01178];

  console.log(sportsFacilities, "Miejsca sportowe");

  return (
    <section className={styles.finder}>
      <PlatformWrapper>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <h2>Look for new sport places</h2>
            <p>
              Simply enter a city name and look for sport places near your home!
              Be careful it only work well for bigger cities
            </p>
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
                key={position ? position.toString() : "default"}
                center={position || defaultPosition}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100vh", zIndex: 0 }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {position && (
                  <Marker position={position}>
                    <Popup>You are here</Popup>
                  </Marker>
                )}
                {/* Display sports facilities */}
                {sportsFacilities.map((facility, index) => (
                  <Marker key={index} position={[facility.lat, facility.lon]}>
                    <Popup>
                      <div>
                        <h3>{facility.tags.name}</h3>
                        <p>
                          {facility.tags["addr:housenumber"] ||
                            "No address specified"}{" "}
                          {facility.tags["addr:street"] || ""}{" "}
                          {facility.tags["addr:city"] || ""}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </WhiteCardWrapper>
        </MaxWidthWrapper>
      </PlatformWrapper>
    </section>
  );
};

export default Finder;
