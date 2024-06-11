/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import Header from "../components/Header";
import { new_flight } from "../api/flight/services/amadeus";

type Props = {
  searchParams: flightParams;
};

export type flightParams = {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: string;
  locationIATA: string;
  destinationIATA: string;
};

async function SearchPage({ searchParams }: Props) {
  if (!searchParams.origin) return notFound();

  let results;
  try {
    results = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/flight/search?origin=${searchParams.origin}&destination=${searchParams.destination}&departureDate=${searchParams.departureDate}&passengers=${searchParams.passengers}`
    );
  } catch (error) {
    console.error("Error fetching flight data:", error);
    return <div>Error fetching flight data</div>;
  }

  if (!results.ok) {
    console.error("Failed to fetch flight data:", results.statusText);
    return <div>Failed to fetch flight data</div>;
  }

  let data = await results.json();

  if (data.length === 0) {
    console.log("No results found");
    try {
      data = await new_flight(
        searchParams.locationIATA,
        searchParams.destinationIATA,
        searchParams.departureDate
      );
      console.log(data);
      if (data) {
        data = [data]; // Convertir el objeto en un array para renderizar
      }
    } catch (error) {
      console.error("Error fetching new flight data:", error);
      return <div>Error fetching new flight data</div>;
    }
  }

  if (!data || data.length === 0) return <div>No results...</div>;

  return (
    <section>
      <Header isHome={false} />
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <h1 className="text-4xl font-bold pb-3">
          Tus resultados de vuelos de avión
        </h1>

        <h2 className="pb-3">
          Fecha de salida de los vuelos
          <span className="italic ml-2">{searchParams.departureDate}</span>
        </h2>

        <hr className="mb-5" />

        <h3 className="font-semibold text-xl">
          {/* Aquí se muestra la lista de resultados de la búsqueda*/}
        </h3>

        <div className="space-y-2 mt-5">
          {data.map((item: any, i: any) => (
            <div
              key={i}
              className="flex space-y-2 justify-between space-x-4 p-5 border rounded-lg"
            >
              <img
                src={item.image}
                alt="image of property"
                className="h-44 w-54 rounded-lg"
              />

              <div className="flex flex-1 space-x-5 justify-between">
                <div>
                  <p className="text-xl text-bold">
                    {searchParams.origin} - {searchParams.destination}
                  </p>
                  <p className="text-sm">{item.description}</p>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="flex items-start justify-end space-x-2 text-right">
                    <div>
                      <p className="font-bold">Calificación</p>
                      <p className="text-xs">Excelente</p>
                    </div>

                    <p className="flex items-center justify-center font-bold text-sm w-10 h-10 text-white bg-blue-900 rounded-lg flex-shrink-0">
                      {item.rating || "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg ">Asientos: {item.available_seats}</p>
                    <p className="text-2xl font-bold">
                      Precio: {item.price} {""}$
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SearchPage;
