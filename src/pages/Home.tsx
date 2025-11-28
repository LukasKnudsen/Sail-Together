import TwoColumnLayout from "@/components/layouts/TwoColumnLayout";

export default function Home() {
  return (
    <>
      <main>
        <TwoColumnLayout sidebar={<div>Sidebar</div>} map={<div>Map</div>} />
      </main>
    </>
  );
}
