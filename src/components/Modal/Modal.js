import React from 'react'
import styles from './modal.module.css'

const Modal = ({ onClose }) => {
    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']}>
                <h2>Registro exitoso</h2>
                <p>Tu registro ha sido completado correctamente.</p>
                <button className={styles['modal-close-btn']} onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default Modal;