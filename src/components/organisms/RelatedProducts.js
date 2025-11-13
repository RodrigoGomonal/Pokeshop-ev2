export default function RelatedProducts() {
  const relacionados = [
    { name: "Poción", image: "https://images.wikidexcdn.net/mwuploads/wikidex/f/fd/latest/20230115173615/Poci%C3%B3n_EP.png" },
    { name: "Super Poción", image: "https://images.wikidexcdn.net/mwuploads/wikidex/1/1a/latest/20230115173819/Superpoci%C3%B3n_EP.png" },
    { name: "Hiper Poción", image: "https://images.wikidexcdn.net/mwuploads/wikidex/7/76/latest/20230115173900/Hiperpoci%C3%B3n_EP.png" },
    { name: "Poción Máxima", image: "https://images.wikidexcdn.net/mwuploads/wikidex/1/1b/latest/20230115181246/Poci%C3%B3n_m%C3%A1xima_EP.png" },
    { name: "Restaura Todo", image: "https://images.wikidexcdn.net/mwuploads/wikidex/4/40/latest/20230115181348/Restaurar_todo_EP.png" },
  ];

  return (
    <section className="container rounded-4 mb-5">
      <h3 className="pb-3">Productos Relacionados</h3>
      <div className="row row-cols-1 row-cols-lg-5 row-cols-md-3 g-5 d-flex flex-nowrap overflow-x-auto">
        {relacionados.map((prod, i) => (
          <div className="col" key={i}>
            <div className="card h-100 prod-card">
              <img
                src={prod.image}
                className="card-img-top"
                alt={prod.name}
                style={{ height: "100px", objectFit: "contain" }}
              />
              <div className="card-body">
                <h5 className="card-title text-center">{prod.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
