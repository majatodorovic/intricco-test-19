"use client";
import { useEffect, useState } from "react";
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

const Retails = () => {
  const [customIcon, setCustomIcon] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const { data } = useQuery({
    queryKey: ["prodajna-mesta"],
    queryFn: async () => {
      const res = await LIST(`/stores/retails`, { limit: -1 });
      const payload = res?.payload;

      return payload;
    },
  });

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
    <div
      className="sectionWidth mt-8 bg-grayLight p-[50px] pr-[30px] max-lg:p-[30px] lg:mt-12 xl:p-[100px] xl:pr-[60px]"
      data-aos="fade-up"
    >
      <div className="flex gap-20 max-lg:flex-col max-lg:gap-10">
        <div className="flex flex-1 flex-col gap-10 max-sm:gap-6">
          <h3 className="text-3xl font-light uppercase xl:text-5xl 2xl:text-6xl">
            Prodajna mesta
          </h3>
          <div className="flex flex-col gap-10">
            {data?.items?.map((item, index) => {
              return (
                <div key={index}>
                  <div className="text-xl font-normal uppercase max-md:text-base">
                    {item.address} {item.town_name}
                  </div>
                  <div className="mt-1 w-fit bg-white px-10 py-3 text-xl font-bold max-md:text-base">
                    {item.work_hours}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1">
          {isClient && customIcon && data?.items?.length > 0 && (
            <MapContainer
              center={[
                data?.items[0]?.latitude ?? 44.7866,
                data?.items[0]?.longitude ?? 20.4489,
              ]}
              zoom={7}
              scrollWheelZoom={true}
              className="h-[350px] w-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {data?.items?.map((item, index) => {
                return (
                  <Marker
                    key={
                      customIcon ? `map-ready-${index}` : `map-loading-${index}`
                    }
                    position={[
                      item?.latitude ?? 44.7866,
                      item?.longitude ?? 20.4489,
                    ]}
                    icon={customIcon}
                  >
                    <Popup>
                      <strong>{item.name}</strong>
                      <br />
                      {item.address}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Retails;
