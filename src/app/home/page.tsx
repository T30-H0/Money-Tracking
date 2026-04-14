import { PropertyCard } from "@/components/PropertyCard/PropertyCard";
import { mockProperties, mockRecentViews } from "@/themes/home-data";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
          Discover top stays
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {mockProperties.map((property) => (
            <PropertyCard
              key={property.id}
              imageUrl={property.imageUrl}
              isFavorite={property.isFavorite}
              title={property.title}
              description={property.description}
              rating={property.rating}
              address={property.address}
              price={property.price}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
          Most recent views
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {mockRecentViews.map((property) => (
            <PropertyCard
              key={property.id}
              imageUrl={property.imageUrl}
              isFavorite={property.isFavorite}
              title={property.title}
              description={property.description}
              rating={property.rating}
              address={property.address}
              price={property.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
