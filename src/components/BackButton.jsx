import '../styles/BackButton.css';

/**
 * Botón para regresar a la etapa anterior de la historia.
 */
export default function BackButton({ onClick }) {
  return (
    <button
      className="back-button"
      onClick={onClick}
      aria-label="Volver a la etapa anterior"
    >
      <span className="back-button__icon" aria-hidden="true">←</span>
      <span className="back-button__label">Volver</span>
    </button>
  );
}
