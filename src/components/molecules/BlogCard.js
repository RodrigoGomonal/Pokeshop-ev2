import Button from "../atoms/ButtonLink";
import Image from "../atoms/Image";

export default function BlogCard({ title, text, image }) {
  return (
    <section className="container blog-card mx-auto text-center">
      <div className="row p-3 align-items-center pokeMartBackground rounded-3 mb-4">
        <div className="col-6">
          <h2>{title}</h2>
          <p className="text-start">{text}</p>
          <Button label="Ver caso" href="" variant="primary" />
        </div>
        <div className="col-6">
          <Image src={image} alt={title} />
        </div>
      </div>
    </section>
  );
}