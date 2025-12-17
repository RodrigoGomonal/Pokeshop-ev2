import BoletaTable from "../molecules/BoletaTable";

export default function BoletaSection() {
    return (
        <section className="p-4">
            <div className="align-items-center mb-3">
                <h1> Boletas</h1>
            </div>
        <BoletaTable />
        </section>
    );          
}