import { mockDetails } from "@/themes/details-data";
import { ImageGallery } from "./_components/ImageGallery";
import { ReviewsSlider } from "./_components/ReviewsSlider";
import { DescriptionDetails } from "./_components/DescriptionsDetails";
import { AmenitiesList } from "./_components/AmenitiesList";
import { RatingSummary } from "./_components/RatingSummary";
import { BookingSection } from "./_components/BookingSection";
import { Separator } from "@/components/ui/separator";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7">
          <ImageGallery images={mockDetails.images} title={mockDetails.title} />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-10">
          <BookingSection price={mockDetails.price} />
        </div>
      </div>

      <Separator orientation="vertical" />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 p-6">
          <AmenitiesList items={mockDetails.convenient} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <ReviewsSlider reviews={mockDetails.reviews} />
            <RatingSummary
              rating={mockDetails.rating}
              totalReviews={mockDetails.totalReviews}
              reviews={mockDetails.reviews}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 p-6">
        <DescriptionDetails
          address={mockDetails.address}
          description={mockDetails.description}
        />
      </div>
    </div>
  );
}
