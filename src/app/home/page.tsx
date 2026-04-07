import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Home Page</h1>

      {/* shape-outside: url(image.jpg);
      shape-margin: 8px; */}
      {/* <Image alt="Home" src="/home.jpg" className="w-350 float-left" /> */}
      <p>Welcome to the Home Page!</p>
    </>
  );
}
