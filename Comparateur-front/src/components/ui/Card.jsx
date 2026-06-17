export default function Card({ children }) {
    return (
        <div
            className="
                bg-white
                rounded-3xl
                shadow-lg
                border border-slate-100
                p-8
            "
        >
            {children}
        </div>
    );
}