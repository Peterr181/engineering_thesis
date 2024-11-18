import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import PlatformWrapper from "../../components/compound/PlatformWrapper/PlatformWrapper";
import MaxWidthWrapper from "../../components/compound/MaxWidthWrapper/MaxWidthWrapper";
import { LatLngExpression } from "leaflet";
import styles from "./Finder.module.scss";
import WhiteCardWrapper from "../../components/atomic/WhiteCardWrapper/WhiteCardWrapper";
import { Button } from "@mui/material";
import { useLanguage } from "../../context/LanguageProvider";

interface Tags {
  name?: string;
  [key: string]: string | undefined;
}

interface OverpassElement {
  lat: number;
  lon: number;
  tags: Tags;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface SportsFacility {
  lat: number;
  lon: number;
  tags: Tags;
}

const Finder = () => {
  const { t } = useLanguage();
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [sportsFacilities, setSportsFacilities] = useState<SportsFacility[]>(
    []
  );
  const [city, setCity] = useState<string>("");

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const fetchSportsFacilities = async (lat: number, lon: number) => {
    try {
      const overpassResponse = await axios.get<OverpassResponse>(
        `https://overpass-api.de/api/interpreter?data=[out:json];node(around:10000,${lat},${lon})["leisure"="fitness_centre"];out;`,
        {
          withCredentials: false,
        }
      );

      const facilities: SportsFacility[] = overpassResponse.data.elements.map(
        (element: OverpassElement) => ({
          lat: element.lat,
          lon: element.lon,
          tags: element.tags || {},
        })
      );

      setSportsFacilities(facilities);
    } catch (error) {
      console.error(t("error.fetchSportsFacilities"), error);
    }
  };

  useEffect(() => {
    if (!city) {
      fetchSportsFacilities(52.22977, 21.01178);
    }
  }, [city]);

  const handleCitySearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${city}&format=json`,
        {
          withCredentials: false,
        }
      );

      if (response.data.length === 0) {
        throw new Error(t("error.cityNotFound"));
      }

      const { lat, lon } = response.data[0];
      setPosition([lat, lon]);

      fetchSportsFacilities(lat, lon);
    } catch (error) {
      console.error(t("error.fetchCoordinates"), error);
    }
  };

  const defaultPosition: LatLngExpression = [52.22977, 21.01178];

  return (
    <PlatformWrapper>
      <section className={styles.finder}>
        <MaxWidthWrapper>
          <WhiteCardWrapper>
            <h2>{t("finder.title")}</h2>
            <p>{t("finder.description")}</p>
            <div>
              <div className={styles.finder__input}>
                <input
                  type="text"
                  value={city}
                  onChange={handleCityChange}
                  placeholder={t("finder.placeholder")}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCitySearch}
                >
                  {t("finder.button")}
                </Button>
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
                    <Popup>{t("finder.youAreHere")}</Popup>
                  </Marker>
                )}
                {sportsFacilities.map((facility, index) => (
                  <Marker key={index} position={[facility.lat, facility.lon]}>
                    <Popup>
                      <div>
                        <h3>
                          {facility.tags.name || t("finder.unnamedFacility")}
                        </h3>
                        <p>
                          {facility.tags["addr:housenumber"] ||
                            t("finder.noAddress")}{" "}
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
      </section>
    </PlatformWrapper>
  );
};

export default Finder;
