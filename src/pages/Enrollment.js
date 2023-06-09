import React, { useState, useRef } from 'react';
import useQuery from '../hooks/useQuery';
import useMutation from '../hooks/useMutation';
import FormCard from '../components/FormCard/FormCard';
import Webcam from 'react-webcam';
import Modal from '../components/Modal/Modal';
import styles from './styles/enrollment.module.css';

const Enrollment = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [sexo, setSexo] = useState('');
  const [photoData, setPhotoData] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [membresia, setMembresia] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showCaption, setShowCaption] = useState(false);

  const webcamRef = useRef(null);

  const { data } = useQuery('/Membrecias');


  const handleTelefonoChange = (event) => {
    const inputTel = event.target.value;

    // Remover cualquier guion existente en el valor actual
    const telefonoSinGuion = inputTel.replace(/-/g, '');

    // Obtener solo los dígitos numéricos
    const telefonoNumerico = telefonoSinGuion.replace(/\D/g, '');

    // Verificar si se ingresaron 4 o más dígitos y si no hay guion al final
    if (telefonoNumerico.length >= 4 && !inputTel.endsWith('-')) {
      // Formatear el número con guion después de los primeros 4 dígitos
      const telefonoFormateado = `${telefonoNumerico.slice(0, 4)}-${telefonoNumerico.slice(4, 8)}`;
      setTelefono(telefonoFormateado);
    } else {
      setTelefono(telefonoNumerico);
    }
  };

  const handleSexoChange = (event) => {
    setSexo(event.target.value);
  };

  const handleFechaNacimientoChange = (event) => {
    setFechaNacimiento(event.target.value);
  };

  //localStorage.setItem('data', JSON.stringify(data));

  const handleMembresiaChange = (event) => {
    setMembresia(event.target.value);
  };

  const handleNamesChange = (event) => {
    setNombres(event.target.value);
  }

  const handleApellidosChange = (event) => {
    setApellidos(event.target.value);
  }

  const capturePhoto = async (e) => {
    e.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();

    const response = await fetch(imageSrc);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      setPhotoData(base64data);
      localStorage.setItem('photoBlob', base64data);
    };

    setShowCaption(true);
  };

  //hook llamado para insertar.
  const [mutationFunc] = useMutation('/Usuarios');

  const collectData = async (event) => {
    event.preventDefault();

    //FOR DATABASE
    // const formData = {
    //   nombre: nombres,
    //   apellido: apellidos,
    //   imagenPerfil: photoData, // Obtener la foto previamente guardada en el localStorage
    //   genero: sexo,
    //   fechaNacimiento: fechaNacimiento,
    //   numeroTelefono: telefono,
    // };

    //FOR LOCALSTORAGE
    const formData = {
      nombre: nombres,
      apellido: apellidos,
      sexo: sexo,
      fechaNacimiento: fechaNacimiento,
      telefono: telefono,
      membresia: membresia,
      imagenPerfil: localStorage.getItem('photoBlob'), // Obtener la foto previamente guardada en el localStorage
    };

    //FOR DATABASE
    // await mutationFunc({
    //   method: 'post',
    //   variables: formData
    // });

    // Guardar los datos en un array en el localStorage
    const dataFORM = JSON.parse(localStorage.getItem('data')) || [];
    await dataFORM.push(formData);

    localStorage.setItem('data', JSON.stringify(dataFORM));

    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    clearData();
  };

  const clearData = () => {
    setNombres('');
    setApellidos('');
    setSexo('');
    setPhotoData('');
    setFechaNacimiento('');
    setTelefono('');
    setMembresia('');
    setShowCaption(false);
  }

  return (
    <div>
      <FormCard>
        <div className={styles['form-enclosed']}>
          <h1 className={styles.h1}>Formulario de Registro</h1>
          <form className={styles.form} method='POST' onSubmit={collectData}>
            <div className={styles['form-left']}>
              <label className={styles.label}>Nombres</label>
              <br />
              <input className={styles.input} type='text' name='names' value={nombres} onChange={handleNamesChange} required={true} />
              <br />
              <label className={styles.label}>Apellidos</label>
              <br />
              <input className={styles.input} type='text' name='apellidos' value={apellidos} onChange={handleApellidosChange} required={true} />
              <br />
              <label className={styles.label}>Genero</label>
              <br />
              <select className={styles.select} value={sexo} onChange={handleSexoChange}> required={true}
                <option value="">Seleccione...</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
              <br />
              <label className={styles.label}>Fecha de Nacimiento</label>
              <br />
              <input
                className={styles.input}
                type="date"
                value={fechaNacimiento}
                onChange={handleFechaNacimientoChange} required={true}
              />
              <br />
              <label className={styles.label}>Telefono</label>
              <br />
              <input
                className={styles.input}
                type="tel"
                pattern="[0-9]{4}-[0-9]{4}"
                placeholder="Formato: 1234-4567"
                value={telefono}
                onChange={handleTelefonoChange}
                required={true}
              />
              <br />
              <label className={styles.label}>Membresia</label>
              <br />
              <select className={styles.select} value={membresia} onChange={handleMembresiaChange}> required={true}
                <option value="">Seleccione...</option>
                {data && data.map((registro) => (
                  <option key={registro.idMembresia} value={registro.idMembresia}>
                    {registro.descripcion}
                  </option>
                ))}
              </select>
              <div className={styles['form-bottom']}>
                <button className={styles.button} type='submit' disabled={!showCaption}>Registrar nuevo Usuario</button>
              </div>
            </div>
            <div className={styles['form-right']}>
              <div className={styles.webcam}>
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className={styles["webcam-container"]} />
                <button onClick={capturePhoto} className={styles.capture}>Capturar Imagen</button>
                {showCaption ? <span className={styles.capturada}>SE HA CAPTURADO LA FOTOGRAFIA</span> : <span className={styles.nocapturada}>NO CAPTURADA</span>}
              </div>
            </div>
          </form>
          {showModal && <Modal onClose={closeModal} />}
        </div>
      </FormCard>
    </div>
  );
};

export default Enrollment;
