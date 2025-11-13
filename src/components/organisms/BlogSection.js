import BlogCard from "../molecules/BlogCard";
import '../../App.css';

export default function BlogSection() {
  const blogs = [
    {
      title: "¿Sabías que Cura total?",
      text: "La cura total cura cualquier problema de estado: envenenamiento, congelamiento, quemaduras, parálisis, sueño inducido y confusión de Pokémon...",
      image: "https://images.wikidexcdn.net/mwuploads/wikidex/d/df/latest/20230123181503/Cura_total_EP.png",
    },
    {
      title: "¿Sabías que Revivir?",
      text: "Revive a un Pokémon que esté debilitado y recupera la mitad del total de sus PS, a diferencia del revivir máximo, que recupera el 100%...",
      image: "https://images.wikidexcdn.net/mwuploads/wikidex/6/6e/latest/20230123181418/Revivir_EP.png",
    },
  ];

  return (
    <div className="container mb-5">
      <div className="text-center mb-4">
        <h1>Noticias Importantes</h1>
      </div>
      {blogs.map((blog, index) => (
        <BlogCard key={index} {...blog} />
      ))}
    </div>
  );
}