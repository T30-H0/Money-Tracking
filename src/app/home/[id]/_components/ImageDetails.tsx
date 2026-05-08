export function ImageDetails({
  imageUrl,
  title,
}: {
  imageUrl: string;
  title: string;
}) {
  return (
    <div>
      <img src={imageUrl} alt={title} />
    </div>
  );
}
