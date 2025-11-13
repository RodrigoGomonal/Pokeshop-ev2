import Icon from "../atoms/Icon";
import '../../App.css'

export default function DeveloperCard() {
  return (
    <div className="container d-flex justify-content-center align-items-center pokeMartBackground rounded">
      <div className="blog-card p-4 mt-4 w-100">
        <h2 className="text-center mb-4">Desarrolladores</h2>
        <p>Este sitio web fue desarrollado por:</p>
        <div className="d-flex align-items-center">
          <Icon width="50" height="50"/>
          <span> Rodrigo Gomonal </span>
        </div>
      </div>
    </div>
  );
}