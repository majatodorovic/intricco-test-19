"use client";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";
import { list as LIST } from "@/api/api";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export const LokacijePage = () => {
  const [customIcon, setCustomIcon] = useState(null);
  const [selected, setSelected] = useState({
    country: "Serbia",
    town: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [findStore, setFindStore] = useState(false);
  const [places, setPlaces] = useState([]);
  const { data } = useQuery({
    queryKey: ["prodajna-mesta"],
    queryFn: async () => {
      const [wholesalesRes, retailsRes, warehouseRes] = await Promise.all([
        LIST(`/stores/wholesales`, { limit: -1 }),
        LIST(`/stores/retails`, { limit: -1 }),
        LIST(`/stores/warehouse`, { limit: -1 }),
      ]);

      const wholesaleItems = wholesalesRes?.payload?.items || [];
      const retailItems = retailsRes?.payload?.items || [];
      const warehouseItems = warehouseRes?.payload?.items || [];
      const allItems = [...wholesaleItems, ...retailItems, ...warehouseItems];

      if (allItems.length > 0) {
        const townsInSerbia = allItems
          .filter((item) => item.country_name === "Serbia")
          .map((item) => item.town_name);

        const defaultTown = townsInSerbia[0] || "";

        setSelected({ country: "Serbia", town: defaultTown });

        const initialPlaces = allItems
          .filter(
            (item) =>
              item.country_name === "Serbia" && item.town_name === defaultTown,
          )
          .map(({ latitude, longitude, name, phone, address, work_hours }) => ({
            lat: Number(latitude),
            lng: Number(longitude),
            name,
            address,
            phone,
            work_hours,
          }));

        setPlaces(initialPlaces);
        setFindStore(true);
      }

      return { items: allItems };
    },
  });

  const findPlaces = (data) => {
    const foundPlaces = data?.items
      ?.filter(
        ({ country_name, town_name }) =>
          country_name === selected?.country && town_name === selected?.town,
      )
      .map(({ latitude, longitude, name, address, phone, work_hours }) => ({
        lat: Number(latitude),
        lng: Number(longitude),
        name,
        address,
        phone,
        work_hours,
      }));

    setPlaces(foundPlaces || []);
  };

  const showMapHandler = useCallback(() => {
    setFindStore(true);
  }, []);

  useEffect(() => {
    if (selected?.country && selected?.town) {
      setTimeout(() => {
        showMapHandler();
      }, 1000);
    }
  }, [selected]);

  const uniqueTowns = new Set();

  useEffect(() => {
    setIsClient(true);
    import("leaflet").then((L) => {
      setCustomIcon(
        new L.Icon({
          iconUrl: "/icons/location-pin.png",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        }),
      );
    });
  }, []);

  return (
    <>
      <div className="sectionWidth">
        <div className="mt-5 flex items-center gap-5 max-lg:flex-wrap">
          <select
            value={selected?.country}
            className="mainInput md:w-[300px]"
            onChange={(e) => {
              setSelected({ town: "", country: e.target.value });
              setFindStore(false);
            }}
          >
            <option value="">Izaberite državu</option>
            {(data?.items || [])
              .map(({ country_name }) => country_name)
              .filter(Boolean)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((uniqueCountry, index) => {
                const countryMapping = {
                  Serbia: "Srbija",
                  Montenegro: "Crna Gora",
                  "Bosnia and Herzegovina": "Bosna i Hercegovina",
                  Croatia: "Hrvatska",
                  Slovenia: "Slovenija",
                  Hungary: "Mađarska",
                  Macedonia: "Makedonija",
                  Slovakia: "Slovačka",
                };
                return (
                  <option key={index} value={uniqueCountry}>
                    {countryMapping[uniqueCountry] || uniqueCountry}
                  </option>
                );
              })}
          </select>
          <select
            value={selected?.town}
            className="mainInput md:w-[300px]"
            onChange={(e) => {
              setSelected({ ...selected, town: e.target.value });
              setFindStore(false);
            }}
          >
            <option value="">Izaberite grad</option>
            {data?.items?.map(({ country_name, town_name }) => {
              if (
                country_name === selected?.country &&
                !uniqueTowns.has(town_name)
              ) {
                uniqueTowns.add(town_name);
                return (
                  <option key={town_name} value={town_name}>
                    {town_name}
                  </option>
                );
              }
              return null;
            })}
          </select>
          <button
            onClick={() => {
              findPlaces(data);
              showMapHandler();
            }}
            className="primaryButton px-6 py-3.5"
          >
            Pronađite radnju
          </button>
        </div>

        <div className="flex flex-col items-start md:gap-10 lg:flex-row">
          {findStore && (
            <div className="mt-5 flex w-full flex-col max-md:divide-y md:min-w-[20%] md:max-w-[20%] md:gap-7">
              {places.map((place, i) => (
                <div key={i} className="gap-2 max-md:py-6">
                  <h1 className="mb-3 text-[1.5rem] font-medium leading-[normal] max-md:text-[1.3rem]">
                    {place.name}
                  </h1>
                  <p className="text-base max-md:text-[16px]">
                    {place?.address}
                  </p>
                  <p className="text-base max-md:text-[16px]">{place?.phone}</p>
                  <p className="text-base max-md:text-[16px]">
                    {place?.work_hours}
                  </p>
                </div>
              ))}
            </div>
          )}

          {isClient && findStore && places.length > 0 && (
            <MapContainer
              center={[places[0].lat, places[0].lng]}
              zoom={7}
              scrollWheelZoom={true}
              className="mt-5 h-[500px] w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {places.map((place, index) => (
                <Marker
                  key={index}
                  position={[place.lat, place.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <strong>{place.name}</strong>
                    <br />
                    {place.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </>
  );
};
