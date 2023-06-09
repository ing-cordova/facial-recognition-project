import React from 'react'
import styles from './formcard.module.css';

const FormCard = (props) => {
  return (
    <div className={styles.container}>{props.children}</div>
  )
}

export default FormCard