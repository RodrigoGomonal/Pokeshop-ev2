import AboutCard from "../molecules/AboutCard";
import DeveloperCard from "../molecules/DeveloperCard";

export default function NosotrosSection() {
  return (
    <section className="container-fluid">
      <AboutCard />
      <DeveloperCard />
    </section>
  );
}